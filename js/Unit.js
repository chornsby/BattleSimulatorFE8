// TODO: Stat caps for classes.
// TODO: More promotions in characters.json.

function Unit(characterJSON) {

    this.JSON = characterJSON;

    this.name = characterJSON.name;
    this.job = characterJSON.job;
    this.baseJob = characterJSON.job;
    this.baseLevel = characterJSON.baseLevel;
//    this.level = characterJSON.baseLevel;

    this.HP = roundAboveZero(characterJSON.HP);
    this.maxHP = roundAboveZero(characterJSON.HP);
    this.power = roundAboveZero(characterJSON.power);
    this.skill = roundAboveZero(characterJSON.skill);
    this.speed = roundAboveZero(characterJSON.speed);
    this.luck = roundAboveZero(characterJSON.luck);
    this.defence = roundAboveZero(characterJSON.defence);
    this.resistance = roundAboveZero(characterJSON.resistance);
    this.constitution = characterJSON.constitution;

    this.weaponSkill = new WeaponSkill(characterJSON.weaponSkill);
    this.statGrowths = new StatGrowths(characterJSON.statGrowths);
    this.promotions = characterJSON.promotions;

    this.weapon = null;
    this.terrain = null;
}

Unit.prototype = {

    inRange: function (unit, separation) {
        // Return true if this is in range to attack the given unit.
        return separation >= this.weapon.minRange && separation <= this.weapon.maxRange;
    },

    weaponTriangleBonus: function (that) {
        // Return 1 if the attacker has a bonus due to the triangle.
        // Return 0 if there is no bonus.
        // Return -1 if the attacker suffers a penalty due to the triangle.
        return this.weapon.weaponTriangleBonus(that.weapon);
    },

    weaponEffectiveness: function (that) {
        // Return the effectiveness coefficient for an attacker.
        if (this.weapon.effectiveAgainst.indexOf(that.job) > -1) {
            return 3;
        }

        return 1;
    },

    attackPower: function (that) {
        // Return the attack power based on weapon might and stats.
        var unitStrength = this.power;
        var weaponMight = this.weapon.might;
        var triangleBonus = this.weaponTriangleBonus(that);
        var effectiveness = this.weaponEffectiveness(that);

        return unitStrength + (weaponMight + triangleBonus) * effectiveness;
    },

    attackSpeed: function () {
        // Return the attack speed based on weapon weight and stats.
        var weaponWeight = this.weapon.weight;
        var constitution = this.constitution;

        if (weaponWeight > constitution) {
            return capAboveZero(this.speed - (weaponWeight - constitution));
        }

        return this.speed;
    },

    isRepeatedAttack: function (that) {
        // Return true if this unit can strike twice.
        var attackerAS = this.attackSpeed();
        var defenderAS = that.attackSpeed();

        return attackerAS > defenderAS + 3;
    },

    physicalDefence: function () {
        // Return the defence power based on stats.
        var terrainDefence = this.terrain.defence;
        var unitDefence = this.defence;

        if (Job.prototype.fliers.indexOf(this.job) > -1) {
            return unitDefence;
        }

        return terrainDefence + unitDefence;
    },

    magicalDefence: function () {
        // Return the defence power based on stats.
        var terrainDefence = this.terrain.defence;
        var unitResistance = this.resistance;

        if (Job.prototype.fliers.indexOf(this.job) > -1) {
            return unitResistance;
        }

        return terrainDefence + unitResistance;
    },

    damage: function (that) {
        // Return the potential damage caused by an attacker.
        var attackPower = this.attackPower(that);

        if (this.weapon.isPhysical()) {
            return capAboveZero(attackPower - that.physicalDefence());
        }

        if (this.weapon.isMagical()) {
            return capAboveZero(attackPower - that.magicalDefence());
        }

        return 0;
    },

    hitRate: function () {
        // Return the hit rate based on unit's accuracy and weapon.
        var weaponAccuracy = this.weapon.hit;
        var skillTerm = 2 * this.skill;
        var luckTerm = Math.floor(0.5 * this.luck);
        var sRankBonus = 0;

        if (this.weaponSkill[this.weapon.weaponType] === 6) {
            sRankBonus = 5;
        }

        return weaponAccuracy + skillTerm + luckTerm + sRankBonus;
    },

    evadeRate: function () {
        // Return the evade rate based on a unit's speed and terrain.
        var attackSpeedTerm = 2 * this.attackSpeed();
        var luckTerm = this.luck;
        var terrainTerm = this.terrain.avoid;

        if (Job.prototype.fliers.contains(this.job)) {
            return attackSpeedTerm + luckTerm;
        }

        return attackSpeedTerm + luckTerm + terrainTerm;
    },

    accuracy: function (that) {
        // Return the accuracy of this unit.
        var hitRate = this.hitRate();
        var evadeRate = that.evadeRate();
        var triangleBonus = 15 * this.weaponTriangleBonus(that);

        return capToPercent(hitRate - evadeRate + triangleBonus);
    },

    criticalRate: function () {
        // Return the critical rate based on weapon and unit's skill.
        var weaponCritical = this.weapon.crit;
        var skillTerm = Math.floor(0.5 * this.skill);
        var classCritical = 0;

        if (this.job.lethal) {
            classCritical = 15;
        }

        var sRankBonus = 0;

        if (this.weaponSkill[this.weapon.weaponType] === 6) {
            sRankBonus = 5;
        }

        return weaponCritical + skillTerm + classCritical + sRankBonus;
    },

    criticalEvadeRate: function () {
        // Return the critical evade rate based on unit's luck.
        return this.luck;
    },

    criticalChance: function (that) {
        // Return the critical chance of attacker.
        var criticalRate = this.criticalRate();
        var criticalEvadeRate = that.criticalEvadeRate();

        return capToPercent(criticalRate - criticalEvadeRate);
    },

    setTerrain: function (newTerrain) {
        // Set the terrain for the unit.
        this.terrain = newTerrain;
    },

    setWeapon: function (newWeapon) {
        // Set the weapon for the unit.
        var key;

        // First remove old stat boosts (if applicable).
        if (this.weapon != null) {
            for (key in this.weapon.statBoosts) {
                this[key] -= this.weapon.statBoosts[key];
            }
        }

        // Then set the new weapon.
        this.weapon = newWeapon;

        // Finally, add new stat boosts (if applicable).
        for (key in newWeapon.statBoosts) {
            this[key] += newWeapon.statBoosts[key];
        }
    },

    normaliseHP: function () {
        // If HP drops below 0 then set to 0.
        // If HP rises above max then set to max.
        if (this.HP < 0) {
            this.HP = 0;
        } else if (this.HP > this.maxHP) {
            this.HP = this.maxHP;
        }
    },

    resetHealth: function () {
        // Reset HP to max HP.
        this.HP = this.maxHP;
    },

    levelTo: function (newLevel) {
        // Update the unit stats to average values for newLevel.

        // Reset to base stats.
        this.maxHP = this.JSON.HP;
        this.power = this.JSON.power;
        this.skill = this.JSON.skill;
        this.speed = this.JSON.speed;
        this.luck = this.JSON.luck;
        this.defence = this.JSON.defence;
        this.resistance = this.JSON.resistance;

        // Add promotion gains.
        if (this.job != this.baseJob) {
            this.maxHP += this.promotions[this.job].maxHP;
            this.power += this.promotions[this.job].power;
            this.skill += this.promotions[this.job].skill;
            this.speed += this.promotions[this.job].speed;
            this.luck += this.promotions[this.job].luck;
            this.defence += this.promotions[this.job].defence;
            this.resistance += this.promotions[this.job].resistance;
        }

        // Level up stats.
        this.maxHP += (newLevel - 2) * this.statGrowths.HP / 100;
        this.power += (newLevel - 2) * this.statGrowths.power / 100;
        this.skill += (newLevel - 2) * this.statGrowths.skill / 100;
        this.speed += (newLevel - 2) * this.statGrowths.speed / 100;
        this.luck += (newLevel - 2) * this.statGrowths.luck / 100;
        this.defence += (newLevel - 2) * this.statGrowths.defence / 100;
        this.resistance += (newLevel - 2) * this.statGrowths.resistance / 100;

        this.maxHP = roundAboveZero(this.maxHP);
        this.power = roundAboveZero(this.power);
        this.skill = roundAboveZero(this.skill);
        this.speed = roundAboveZero(this.speed);
        this.luck = roundAboveZero(this.luck);
        this.defence = roundAboveZero(this.defence);
        this.resistance = roundAboveZero(this.resistance);

        // TODO: Normalise stats to class maximums.

        // Normalise level and HP.
        this.HP = this.maxHP;
//        this.level = newLevel;
    },

    copy: function () {
        // Return a fresh copy of the object.
        return new Unit(this.JSON);
    }

};
