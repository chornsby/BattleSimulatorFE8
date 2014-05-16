// TODO: Separate game logic from rendering to page.

var Battle = function(unit1, unit2, logToBattle) {
    this.attacker = unit1;
    this.defender = unit2;
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

        var attackerHitChance = this.attacker.accuracy(this.defender);
        var defenderHitChance = this.defender.accuracy(this.attacker);

        var attackerDamage = this.attacker.damage(this.defender);
        var defenderDamage = this.defender.damage(this.attacker);

        var attackerCriticalChance = this.attacker.criticalChance(this.defender);
        var defenderCriticalChance = this.defender.criticalChance(this.attacker);

        // First attacker round.
        if (percentChance() < attackerHitChance) {

            if (percentChance() < attackerCriticalChance) {
                this.defender.HP -= attackerDamage * 3;
                this.defender.normaliseHP();
                this.logToBattle("Attacker " + this.attacker.name + " scores a critical hit! " + attackerDamage * 3);
            } else {
                this.defender.HP -= attackerDamage;
                this.defender.normaliseHP();
                this.logToBattle("Attacker " + this.attacker.name + " scores a hit. " + attackerDamage);
            }

        } else {
            this.logToBattle("Attacker " + this.attacker.name + " misses...");
        }

        if (this.battleOver()) return;

        // First defender round.
        if (percentChance() < defenderHitChance) {

            if (percentChance() < defenderCriticalChance) {
                this.attacker.HP -= defenderDamage * 3;
                this.attacker.normaliseHP();
                this.logToBattle("Defender " + this.defender.name + " scores a critical hit! " + defenderDamage * 3);
            } else {
                this.attacker.HP -= defenderDamage;
                this.attacker.normaliseHP();
                this.logToBattle("Defender " + this.defender.name + " scores a hit. " + defenderDamage);
            }

        } else {
            this.logToBattle("Defender " + this.defender.name + " misses...");
        }

        if (this.battleOver()) return;

        // Second attacker round.
        if (this.attacker.isRepeatedAttack(this.defender)) {

            if (percentChance() < attackerHitChance) {

                if (percentChance() < attackerCriticalChance) {
                    this.defender.HP -= attackerDamage * 3;
                    this.defender.normaliseHP();
                    this.logToBattle("Attacker " + this.attacker.name + " scores a critical hit! " + attackerDamage * 3);
                } else {
                    this.defender.HP -= attackerDamage;
                    this.defender.normaliseHP();
                    this.logToBattle("Attacker " + this.attacker.name + " scores a hit. " + attackerDamage);
                }

            } else {
                this.logToBattle("Attacker " + this.attacker.name + " misses...");
            }
        }

        if (this.battleOver()) return;

        // Second defender round.
        if (this.defender.isRepeatedAttack(this.attacker)) {

            if (percentChance() < defenderHitChance) {

                if (percentChance() < defenderCriticalChance) {
                    this.attacker.HP -= defenderDamage * 3;
                    this.attacker.normaliseHP();
                    this.logToBattle("Defender " + this.defender.name + " scores a critical hit! " + defenderDamage * 3);
                } else {
                    this.attacker.HP -= defenderDamage;
                    this.attacker.normaliseHP();
                    this.logToBattle("Defender " + this.defender.name + " scores a hit. " + defenderDamage);
                }

            } else {
                this.logToBattle("Defender " + this.defender.name + " misses...");
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

        console.log(this.defender.terrain, this.defender.terrain.heal)

    };
};