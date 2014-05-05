function Unit(name, HP, power, skill, speed, luck, defence, resistance,
              constitution) {
    this.weapon = null;
    this.terrain = null;

    this.name = name;
    this.HP = HP;
    this.maxHP = HP;
    this.power = power;
    this.skill = skill;
    this.speed = speed;
    this.luck = luck;
    this.defence = defence;
    this.resistance = resistance;
    this.constitution = constitution;

    this.attackPower = function(weaponTriangleBonus, weaponEffectiveness) {
        // Return the attack power based on weapon might and stats.
        var unitStrength = this.power;
        var weaponMight = this.weapon.might;

        return unitStrength + (weaponMight + weaponTriangleBonus) * weaponEffectiveness;
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

    this.attackSpeed = function() {
        // Return the attack speed based on weapon weight and stats.
        var weaponWeight = this.weapon.weight;
        var constitution = this.constitution;

        if (weaponWeight > constitution) {
            return this.speed - (weaponWeight - constitution);
        }
        return this.speed;
    };

    this.hitRate = function() {
        // Return the hit rate based on unit's accuracy and weapon.
        var weaponAccuracy = this.weapon.hit;
        var skillTerm = 2 * this.skill;
        var luckTerm = Math.floor(0.5 * this.luck);
        var sRankBonus = 0;

        /* TODO: Implement s-rank bonus. */

        return weaponAccuracy + skillTerm + luckTerm + sRankBonus;
    };

    this.evadeRate = function() {
        // Return the evade rate based on a unit's speed and terrain.
        var attackSpeedTerm = 2 * this.attackSpeed();
        var luckTerm = this.luck;
        var terrainTerm = this.terrain.avoid;

        return attackSpeedTerm + luckTerm + terrainTerm;
    };

    this.criticalRate = function() {
        // Return the critical rate based on weapon and unit's skill.
        var weaponCritical = this.weapon.crit;
        var skillTerm = Math.floor(0.5 * this.skill);
        var classCritical = 0;

        if (this.unitClass == "beserker" || this.unitClass == "swordmaster") {
            classCritical = 15;
        }

        var sRankBonus = 0;

        /* TODO: Implement s-rank bonus. */

        return weaponCritical + skillTerm + classCritical + sRankBonus;
    };

    this.criticalEvadeRate = function() {
        // Return the critical evade rate based on unit's luck.
        return this.luck;
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
        if (this.HP < 0) {
            this.HP = 0;
        }
    }

}
