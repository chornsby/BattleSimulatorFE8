function Unit(characterJSON) {

    this.name = characterJSON.name;
    this.job = characterJSON.job;
    this.HP = characterJSON.HP;
    this.maxHP = characterJSON.HP;
    this.power = characterJSON.power;
    this.skill = characterJSON.skill;
    this.speed = characterJSON.speed;
    this.luck = characterJSON.luck;
    this.defence = characterJSON.defence;
    this.resistance = characterJSON.resistance;
    this.constitution = characterJSON.constitution;
    this.weaponSkill = characterJSON.weaponSkill;

    this.weapon = null;
    this.terrain = null;

    this.weaponTriangleBonus = function(that) {
        // Return 1 if the attacker has a bonus due to the triangle.
        // Return 0 if there is no bonus.
        // Return -1 if the attacker suffers a penalty due to the triangle.
        return this.weapon.weaponTriangleBonus(that.weapon);
    };

    this.weaponEffectiveness = function(that) {
        // Return the effectiveness coefficient for an attacker.
        /* TODO: Implement this? */
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
            return this.speed - (weaponWeight - constitution);
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

        return terrainDefence + unitDefence;
    };

    this.magicalDefence = function() {
        // Return the defence power based on stats.
        var terrainDefence = this.terrain.defence;
        var unitResistance = this.resistance;

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

        if (this.job.lethal || this.job.lethal) {
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

    this.copy = function() {
        // Return a copy of the object.
        var copy = new Unit({
            "name":this.name,
            "job":this.job,
            "HP":this.maxHP,
            "power":this.power,
            "skill":this.skill,
            "speed":this.speed,
            "luck":this.luck,
            "defence":this.defence,
            "resistance":this.resistance,
            "constitution":this.constitution,
            "weaponSkill":this.weaponSkill

        });

        copy.setTerrain(this.terrain);
        copy.setWeapon(this.weapon);

        return copy;
    };

}