function Weapon(weaponJSON) {

    this.name = weaponJSON.name;
    this.weaponType = weaponJSON.weaponType;
    this.rank = weaponJSON.rank;
    this.uses = weaponJSON.uses;
    this.maxUses = weaponJSON.uses;
    this.weight = weaponJSON.weight;
    this.might = weaponJSON.might;
    this.hit = weaponJSON.hit;
    this.crit = weaponJSON.crit;
    this.minRange = weaponJSON.minRange;
    this.maxRange = weaponJSON.maxRange;
    this.weaponExp = weaponJSON.weaponExp;
    this.cost = weaponJSON.cost;

    this.reaver = weaponJSON.reaver;

    this.effectiveAgainst = weaponJSON.effectiveAgainst;

    var physicalTypes = ["sword", "lance", "axe", "bow"];
    var magicTypes = ["anima", "dark", "light"];

    this.isPhysical = function() {
        return physicalTypes.indexOf(this.weaponType) > -1;
    };

    this.isMagical = function() {
        return magicTypes.indexOf(this.weaponType) > -1;
    };

    this.weaponTriangleBonus = function(that) {
        // Return 1 if the attacker has a bonus due to the triangle.
        // Return 0 if there is no bonus.
        // Return -1 if the attacker suffers a penalty due to the triangle.
        // Return 2 or -2 for reaver bonus vs non-reaver weapon in triangle.

        if (this.weaponType === 'sword') {

            if (this.reaver && !that.reaver) {
                if (that.weaponType === 'lance') return 2;
                else if (that.weaponType === 'axe') return -2;
                else return 0;
            }

            if (that.weaponType === 'axe') return 1;
            else if (that.weaponType === 'lance') return -1;
            else return 0;
        }

        if (this.weaponType === 'axe') {

            if (this.reaver && !that.reaver) {
                if (that.weaponType === 'sword') return 2;
                else if (that.weaponType === 'lance') return -2;
                else return 0;
            }

            if (that.weaponType === 'lance') return 1;
            else if (that.weaponType === 'sword') return -1;
            else return 0;
        }

        if (this.weaponType === 'lance') {

            if (this.reaver && !that.reaver) {
                if (that.weaponType === 'axe') return 2;
                else if (that.weaponType === 'sword') return -2;
                else return 0;
            }

            if (that.weaponType === 'sword') return 1;
            else if (that.weaponType === 'axe') return -1;
            else return 0;
        }

        if (this.weaponType === 'bow') return 0;

        if (this.weaponType === 'anima') {
            if (that.weaponType === 'light') return 1;
            else if (that.weaponType === 'dark') return -1;
            else return 0;
        }

        if (this.weaponType === 'light') {
            if (that.weaponType === 'dark') return 1;
            else if (that.weaponType === 'anima') return -1;
            else return 0;
        }

        if (this.weaponType === 'dark') {
            if (that.weaponType === 'anima') return 1;
            else if (that.weaponType === 'light') return -1;
            else return 0;
        }

        console.log('Unknown weapon type: ' + this.weaponType);
        return 0;
    }
}