var physicalTypes = ["sword", "lance", "axe"];
var magicTypes = ["anima", "dark", "light"];

var isPhysical = function(weapon) {
    return physicalTypes.indexOf(weapon.weaponType) > -1;
};

var isMagical = function(weapon) {
    return magicTypes.indexOf(weapon.weaponType) > -1;
};

var capToPercent = function(n) {
    // Return a number between 0 and 100 inclusive.
    if (n > 100) {
        return 100;
    }

    if (n < 0) {
        return 0;
    }

    return n;
};

var capAboveZero = function(n) {
    // Return a value above zero.
    if (n < 0) {
        return 0;
    }

    return n;
};

var percentChance = function() {
    // Return a value between 0 and 99 inclusive.
    return Math.floor(Math.random() * 100);
};

var weaponTriangleBonus = function(attacker, defender) {
    // Return 1 if the attacker has a bonus due to the triangle.
    // Return 0 if there is no bonus.
    // Return -1 if the attacker suffers a penalty due to the triangle.
    var attackerType = attacker.weapon.weaponType;
    var defenderType = defender.weapon.weaponType;

    var i = physicalTypes.indexOf(attackerType);
    var j = physicalTypes.indexOf(defenderType);

    // Check both are physical types.
    if (i > -1 && j > -1) {
        // Check which beats which.
        if (i == j) return 0;
        if (i == j - 1 || (i == j + 2)) return -1;
        return 1;
    }

    var k = magicTypes.indexOf(attackerType);
    var l = magicTypes.indexOf(defenderType);

    // Check both are magic types.
    if (k > -1 && l > -1) {
        // Check which beats which.
        if (k == l) return 0;
        if (k == l - 1 || (k == l + 2)) return -1;
        return 1;
    }

    return 0;
};

var accuracy = function(attacker, defender) {
    // Return the accuracy of attacker.
    var hitRate = attacker.hitRate();
    var evadeRate = defender.evadeRate();
    var triangleBonus = 15 * weaponTriangleBonus(attacker, defender);

    return capToPercent(hitRate - evadeRate + triangleBonus);
};

var weaponEffectiveness = function(attacker, defender) {
    // Return the effectiveness coefficient for an attacker.
    /* TODO: Implement this? */
    return 1;
};

var damage = function(attacker, defender) {
    // Return the potential damage caused by an attacker.
    var attackPower = attacker.attackPower(
        weaponTriangleBonus(attacker, defender),
        weaponEffectiveness(attacker, defender)
    );

    if (isPhysical(attacker.weapon)) {
        return capAboveZero(attackPower - defender.physicalDefence());
    }

    if (isMagical(attacker.weapon)) {
        return capAboveZero(attackPower - defender.magicalDefence());
    }

    return 0;
};

var criticalChance = function(attacker, defender) {
    // Return the critical chance of attacker.
    var criticalRate = attacker.criticalRate();
    var criticalEvadeRate = defender.criticalEvadeRate();

    return capToPercent(criticalRate - criticalEvadeRate);
};

var isRepeatedAttack = function(attacker, defender) {
    // Return true if the attacker can strike twice.
    var attackerAS = attacker.attackSpeed();
    var defenderAS = defender.attackSpeed();

    return attackerAS > defenderAS + 3;
};

var Battle = function(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
    
    this.battleOver = function(attacker, defender) {
        // Return true if battle is not over.
        return attacker.HP < 1 || defender.HP < 1;
    };

    this.round = function(attacker, defender) {
        // Simulate one round of battle.
        if (this.battleOver(attacker, defender)) return;

        var attackerHitChance = accuracy(attacker, defender);
        var defenderHitChance = accuracy(defender, attacker);

        var attackerDamage = damage(attacker, defender);
        var defenderDamage = damage(defender, attacker);

        var attackerCriticalChance = criticalChance(attacker, defender);
        var defenderCriticalChance = criticalChance(defender, attacker);

        // First attacker round.
        if (percentChance() < attackerHitChance) {

            if (percentChance() < attackerCriticalChance) {
                defender.HP -= attackerDamage * 3;
                defender.normaliseHP();
                console.log(attacker.name + " scores a critical hit!");
            } else {
                defender.HP -= attackerDamage;
                defender.normaliseHP();
                console.log(attacker.name + " scores a hit.");
            }

        } else {
            console.log(attacker.name + " misses...");
        }

        if (this.battleOver(attacker, defender)) return;

        // First defender round.
        if (percentChance() < defenderHitChance) {

            if (percentChance() < defenderCriticalChance) {
                attacker.HP -= defenderDamage * 3;
                attacker.normaliseHP();
                console.log(defender.name + " scores a critical hit!");
            } else {
                attacker.HP -= defenderDamage;
                attacker.normaliseHP();
                console.log(defender.name + " scores a hit.");
            }

        } else {
            console.log(defender.name + " misses...");
        }

        if (this.battleOver(attacker, defender)) return;

        // Second attacker round.
        if (isRepeatedAttack(attacker, defender)) {

            if (percentChance() < attackerHitChance) {

                if (percentChance() < attackerCriticalChance) {
                    defender.HP -= attackerDamage * 3;
                    defender.normaliseHP();
                } else {
                    defender.HP -= attackerDamage;
                    defender.normaliseHP();
                }

                if (this.battleOver(attacker, defender)) return;
            }
        }

        // Second defender round.
        if (isRepeatedAttack(defender, attacker)) {

            if (percentChance() < defenderHitChance) {

                if (percentChance() < defenderCriticalChance) {
                    attacker.HP -= defenderDamage * 3;
                    attacker.normaliseHP();
                } else {
                    attacker.HP -= defenderDamage;
                    attacker.normaliseHP();
                }

                if (this.battleOver(attacker, defender)) return;
            }
        }

        return;
    };
}

$(document).ready(function() {
    var $attacker = $('#attacker');
    var $defender = $('#defender');

    var showData = function($div1, $div2, unit1, unit2) {
        $div1.html(unit1.name + "<br>"
            + unit1.weapon.weaponType + " " + weaponTriangleBonus(unit1, unit2) + "<br>"
            + "2x? " + isRepeatedAttack(unit1, unit2) + "<br>"
            + "HP " + unit1.HP + "/" + unit1.maxHP +"<br>"
            + "Mt " + damage(unit1, unit2) + "<br>"
            + "Hit " + accuracy(unit1, unit2) + "<br>"
            + "Crit " + criticalChance(unit1, unit2));

        $div2.html(unit2.name + "<br>"
            + unit2.weapon.weaponType + " " + weaponTriangleBonus(unit2, unit1) + "<br>"
            + "2x? " + isRepeatedAttack(unit2, unit1) + "<br>"
            + "HP " + unit2.HP + "/" + unit2.maxHP +"<br>"
            + "Mt " + damage(unit2, unit1) + "<br>"
            + "Hit " + accuracy(unit2, unit1) + "<br>"
            + "Crit " + criticalChance(unit2, unit1));
    };

    showData($attacker, $defender, Eirika, Garcia);

    var battle = new Battle(Eirika, Garcia);

    $('#fight').click(function() {
        battle.round(Eirika, Garcia);
        showData($attacker, $defender, Eirika, Garcia);
    });

    $('#reset').click(function() {
        Eirika.HP = Eirika.maxHP;
        Garcia.HP = Garcia.maxHP;
        showData($attacker, $defender, Eirika, Garcia);
    });

});