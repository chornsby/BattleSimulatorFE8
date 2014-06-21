var fliers = ["Pegasus Knight", "Falcon Knight", "Wyvern Rider", "Wyvern Lord", "Wyvern Knight"];

function Unit(characterJSON) {
    
    this.JSON = characterJSON;

    this.name = characterJSON.name;
    this.job = characterJSON.job;
    this.baseLevel = characterJSON.baseLevel;
    this.level = characterJSON.baseLevel;

    this.HP = characterJSON.HP;
    this.maxHP = characterJSON.HP;
    this.power = characterJSON.power;
    this.skill = characterJSON.skill;
    this.speed = characterJSON.speed;
    this.luck = characterJSON.luck;
    this.defence = characterJSON.defence;
    this.resistance = characterJSON.resistance;
    this.constitution = characterJSON.constitution;

    // TODO: Copy objects that are not being deeply copied -- reference is copied.
    this.weaponSkill = characterJSON.weaponSkill;
    this.statGrowths = characterJSON.statGrowths;

    this.weapon = null;
    this.terrain = null;

    this.inRange = function(unit, separation) {
        // Return true if this is in range to attack the given unit.
        return separation >= this.weapon.minRange && separation <= this.weapon.maxRange;
    };

    this.weaponTriangleBonus = function(that) {
        // Return 1 if the attacker has a bonus due to the triangle.
        // Return 0 if there is no bonus.
        // Return -1 if the attacker suffers a penalty due to the triangle.
        return this.weapon.weaponTriangleBonus(that.weapon);
    };

    this.weaponEffectiveness = function(that) {
        // Return the effectiveness coefficient for an attacker.
        if (this.weapon.effectiveAgainst.indexOf(that.job) > -1) {
            return 3;
        }

        return 1;
    };

    this.attackPower = function(that) {
        // Return the attack power based on weapon might and stats.
        var unitStrength = this.power;
        var weaponMight = this.weapon.might;
        var triangleBonus = this.weaponTriangleBonus(that);
        var effectiveness = this.weaponEffectiveness(that);

        return unitStrength + (weaponMight + triangleBonus) * effectiveness;
    };

    this.attackSpeed = function() {
        // Return the attack speed based on weapon weight and stats.
        var weaponWeight = this.weapon.weight;
        var constitution = this.constitution;

        if (weaponWeight > constitution) {
            return capAboveZero(this.speed - (weaponWeight - constitution));
        }

        return this.speed;
    };

    this.isRepeatedAttack = function(that) {
        // Return true if this unit can strike twice.
        var attackerAS = this.attackSpeed();
        var defenderAS = that.attackSpeed();

        return attackerAS > defenderAS + 3;
    };

    this.physicalDefence = function() {
        // Return the defence power based on stats.
        var terrainDefence = this.terrain.defence;
        var unitDefence = this.defence;

        if (fliers.indexOf(this.job) > -1) {
            return unitDefence;
        }

        return terrainDefence + unitDefence;
    };

    this.magicalDefence = function() {
        // Return the defence power based on stats.
        var terrainDefence = this.terrain.defence;
        var unitResistance = this.resistance;

        if (fliers.indexOf(this.job) > -1) {
            return unitResistance;
        }

        return terrainDefence + unitResistance;
    };

    this.damage = function(that) {
        // Return the potential damage caused by an attacker.
        var attackPower = this.attackPower(that);

        if (this.weapon.isPhysical()) {
            return capAboveZero(attackPower - that.physicalDefence());
        }

        if (this.weapon.isMagical()) {
            return capAboveZero(attackPower - that.magicalDefence());
        }

        return 0;
    };

    this.hitRate = function() {
        // Return the hit rate based on unit's accuracy and weapon.
        var weaponAccuracy = this.weapon.hit;
        var skillTerm = 2 * this.skill;
        var luckTerm = Math.floor(0.5 * this.luck);
        var sRankBonus = 0;

        if (this.weaponSkill[this.weapon.weaponType] === 6) {
            sRankBonus = 5;
        }

        return weaponAccuracy + skillTerm + luckTerm + sRankBonus;
    };

    this.evadeRate = function() {
        // Return the evade rate based on a unit's speed and terrain.
        var attackSpeedTerm = 2 * this.attackSpeed();
        var luckTerm = this.luck;
        var terrainTerm = this.terrain.avoid;

        if (fliers.indexOf(this.job) > -1) {
            return attackSpeedTerm + luckTerm;
        }

        return attackSpeedTerm + luckTerm + terrainTerm;
    };

    this.accuracy = function(that) {
        // Return the accuracy of this unit.
        var hitRate = this.hitRate();
        var evadeRate = that.evadeRate();
        var triangleBonus = 15 * this.weaponTriangleBonus(that);

        return capToPercent(hitRate - evadeRate + triangleBonus);
    };

    this.criticalRate = function() {
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
    };

    this.criticalEvadeRate = function() {
        // Return the critical evade rate based on unit's luck.
        return this.luck;
    };

    this.criticalChance = function(that) {
        // Return the critical chance of attacker.
        var criticalRate = this.criticalRate();
        var criticalEvadeRate = that.criticalEvadeRate();

        return capToPercent(criticalRate - criticalEvadeRate);
    };

    this.setTerrain = function(newTerrain) {
        // Set the terrain for the unit.
        this.terrain = newTerrain;
    };

    this.setWeapon = function(newWeapon) {
        // Set the weapon for the unit.
        this.weapon = newWeapon;
    };

    this.normaliseHP = function() {
        // If HP drops below 0 then set to 0.
        // If HP rises above max then set to max.
        if (this.HP < 0) {
            this.HP = 0;
        } else if (this.HP > this.maxHP) {
            this.HP = this.maxHP;
        }
    };

    this.resetHealth = function() {
        // Reset HP to max HP.
        this.HP = this.maxHP;
    };
    
    this.levelTo = function(newLevel) {
        // Update the unit stats to average values for newLevel.

        // Reset to base stats.
        this.maxHP = this.JSON.HP;
        this.power = this.JSON.power;
        this.skill = this.JSON.skill;
        this.speed = this.JSON.speed;
        this.luck = this.JSON.luck;
        this.defence = this.JSON.defence;
        this.resistance = this.JSON.resistance;

        // Level up stats.
        this.maxHP += Math.round((newLevel - 1) * this.statGrowths.HP / 100);
        this.power += Math.round((newLevel - 1) * this.statGrowths.power / 100);
        this.skill += Math.round((newLevel - 1) * this.statGrowths.skill / 100);
        this.speed += Math.round((newLevel - 1) * this.statGrowths.speed / 100);
        this.luck += Math.round((newLevel - 1) * this.statGrowths.luck / 100);
        this.defence += Math.round((newLevel - 1) * this.statGrowths.defence / 100);
        this.resistance += Math.round((newLevel - 1) * this.statGrowths.resistance / 100);

        // TODO: Normalise stats to class maximums.

        // Normalise level and HP.
        this.HP = this.maxHP;
        this.level = newLevel;
    };

    this.copy = function() {
        // Return a fresh copy of the object.
        var copy = new Unit(this.JSON);

        copy.setTerrain(this.terrain);
        copy.setWeapon(this.weapon);

        return copy;
    };

}