function Weapon(weaponJSON) {

    this.name = weaponJSON.name;
    this.weaponType = weaponJSON.weaponType;
    this.rank = weaponJSON.rank;
    this.might = weaponJSON.might;
    this.hit = weaponJSON.hit;
    this.crit = weaponJSON.crit;
    this.weight = weaponJSON.weight;

    var physicalTypes = ["sword", "lance", "axe"];
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
        var i = physicalTypes.indexOf(this.weaponType);
        var j = physicalTypes.indexOf(that.weaponType);

        // Check both are physical types.
        if (i > -1 && j > -1) {
            // Check which beats which.
            if (i == j) return 0;
            if (i == j - 1 || (i == j + 2)) return -1;
            return 1;
        }

        var k = magicTypes.indexOf(this.weaponType);
        var l = magicTypes.indexOf(that.weaponType);

        // Check both are magic types.
        if (k > -1 && l > -1) {
            // Check which beats which.
            if (k == l) return 0;
            if (k == l - 1 || (k == l + 2)) return -1;
            return 1;
        }
    }
}

var Swords = ["Iron Sword", "Slim Sword", "Steel Sword", "Silver Sword",
    "Iron Blade", "Steel Blade", "Silver Blade", "Killing Edge"];
var Lances = ["Iron Lance", "Slim Lance", "Steel Lance", "Silver Lance",
    "Killer Lance"];
var Axes   = ["Iron Axe", "Steel Axe", "Silver Axe", "Killer Axe"];


