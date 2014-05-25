// TODO: Separate game logic from rendering to page.
// TODO: Add support for brave weapons.
// TODO: Add support for poisoning.
// TODO: Include effects of Luna and Nosferatu.

var Battle = function(unit1, unit2, separation, logToBattle) {
    this.attacker = unit1;
    this.defender = unit2;
    this.separation = separation;
    this.logToBattle = logToBattle;
    this.hasWon = false;
    
    this.battleOver = function() {
        // Return true if battle is not over.
        if (this.hasWon) {
            return true;
        }

        if (this.attacker.HP < 1) {
            this.logToBattle("Defender " + this.defender.name + " wins!");
            this.hasWon = true;
            return true;
        }

        if (this.defender.HP < 1) {
            this.logToBattle("Attacker " + this.attacker.name + " wins!");
            this.hasWon = true;
            return true;
        }

        return false;
    };

    this.round = function() {
        // Simulate one round of battle.
        if (this.battleOver()) return;

        var attackerHitChance;
        var attackerDamage;
        var attackerCriticalChance;

        var defenderHitChance;
        var defenderDamage;
        var defenderCriticalChance;
        
        var attackerRoundOne = function(attacker, defender) {
            // First attacker round.
            if (percentChance() < attackerHitChance) {

                if (percentChance() < attackerCriticalChance) {
                    defender.HP -= attackerDamage * 3;
                    defender.normaliseHP();
                    logToBattle("Attacker " + attacker.name + " scores a critical hit for " + attackerDamage * 3 + " damage!");
                } else {
                    defender.HP -= attackerDamage;
                    defender.normaliseHP();
                    logToBattle("Attacker " + attacker.name + " scores a hit for " + attackerDamage + " damage.");
                }

            } else {
                logToBattle("Attacker " + attacker.name + " misses...");
            }
        };
        
        var defenderRoundOne = function(attacker, defender) {
            // First defender round.
            if (percentChance() < defenderHitChance) {

                if (percentChance() < defenderCriticalChance) {
                    attacker.HP -= defenderDamage * 3;
                    attacker.normaliseHP();
                    logToBattle("Defender " + defender.name + " scores a critical hit for " + defenderDamage * 3 + " damage!");
                } else {
                    attacker.HP -= defenderDamage;
                    attacker.normaliseHP();
                    logToBattle("Defender " + defender.name + " scores a hit for " + defenderDamage + " damage.");
                }

            } else {
                logToBattle("Defender " + defender.name + " misses...");
            }
        };
        
        var attackerRoundTwo = function(attacker, defender) {
            // Second attacker round.
            if (attacker.isRepeatedAttack(defender)) {

                if (percentChance() < attackerHitChance) {

                    if (percentChance() < attackerCriticalChance) {
                        defender.HP -= attackerDamage * 3;
                        defender.normaliseHP();
                        logToBattle("Attacker " + attacker.name + " scores a critical hit for " + attackerDamage * 3 + " damage!");
                    } else {
                        defender.HP -= attackerDamage;
                        defender.normaliseHP();
                        logToBattle("Attacker " + attacker.name + " scores a hit for " + attackerDamage + " damage.");
                    }

                } else {
                    logToBattle("Attacker " + attacker.name + " misses...");
                }
            }
        };
        
        var defenderRoundTwo = function(attacker, defender) {
            // Second defender round.
            if (defender.isRepeatedAttack(attacker)) {

                if (percentChance() < defenderHitChance) {

                    if (percentChance() < defenderCriticalChance) {
                        attacker.HP -= defenderDamage * 3;
                        attacker.normaliseHP();
                        logToBattle("Defender " + defender.name + " scores a critical hit for " + defenderDamage * 3 + " damage!");
                    } else {
                        attacker.HP -= defenderDamage;
                        attacker.normaliseHP();
                        logToBattle("Defender " + defender.name + " scores a hit for " + defenderDamage + " damage.");
                    }

                } else {
                    logToBattle("Defender " + defender.name + " misses...");
                }
            }
        };
        
        if (this.attacker.inRange(this.defender, this.separation)) {
            attackerHitChance = this.attacker.accuracy(this.defender);
            attackerDamage = this.attacker.damage(this.defender);
            attackerCriticalChance = this.attacker.criticalChance(this.defender);
        } else {
            attackerHitChance = null;
            attackerDamage = null;
            attackerCriticalChance = null;
        }

        if (this.defender.inRange(this.attacker, this.separation)) {
            defenderHitChance = this.defender.accuracy(this.attacker);
            defenderDamage = this.defender.damage(this.attacker);
            defenderCriticalChance = this.defender.criticalChance(this.attacker);
        } else {
            defenderHitChance = null;
            defenderDamage = null;
            defenderCriticalChance = null;
        }

        if (this.attacker.inRange(this.defender, this.separation)) {
            attackerRoundOne(this.attacker, this.defender);

            if (this.battleOver()) return;

            if (this.attacker.weapon.brave) {
                attackerRoundOne(this.attacker, this.defender);
            }
        }

        if (this.battleOver()) return;

        if (this.defender.inRange(this.attacker, this.separation)) {
            defenderRoundOne(this.attacker, this.defender);

            if (this.battleOver()) return;

            if(this.defender.weapon.brave) {
                defenderRoundOne(this.attacker, this.defender);
            }
        }

        if (this.battleOver()) return;

        if (this.attacker.inRange(this.defender, this.separation)) {
            attackerRoundTwo(this.attacker, this.defender);

            if (this.battleOver()) return;

            if (this.attacker.weapon.brave) {
                attackerRoundTwo(this.attacker, this.defender);
            }
        }

        if (this.battleOver()) return;

        if (this.defender.inRange(this.attacker, this.separation)) {
            defenderRoundTwo(this.attacker, this.defender);

            if (this.battleOver()) return;

            if (this.defender.weapon.brave) {
                defenderRoundTwo(this.attacker, this.defender);
            }
        }

        if (this.battleOver()) return;

        var healing;

        if (this.attacker.terrain.heal > 0) {
            healing = Math.floor(this.attacker.maxHP * this.attacker.terrain.heal / 100);

            this.attacker.HP += healing;
            this.attacker.normaliseHP();

            this.logToBattle("Attacker " + this.attacker.name + " was healed for a max of " + healing + ".");
        }

        if (this.defender.terrain.heal > 0) {
            healing = Math.floor(this.defender.maxHP * this.defender.terrain.heal / 100);

            this.defender.HP += healing;
            this.defender.normaliseHP();

            this.logToBattle("Defender " + this.defender.name + " was healed for a max of " + healing + ".");
        }
    };
};