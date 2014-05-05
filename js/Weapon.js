function Weapon(weaponType, might, hit, crit, weight) {
    this.weaponType = weaponType;
    this.might = might;
    this.hit = hit;
    this.crit = crit;
    this.weight = weight;
}

var IronSword = new Weapon("sword", 5, 90, 0, 5);
var IronLance = new Weapon("lance", 7, 80, 0, 8);
var IronAxe   = new Weapon("axe", 8, 75, 0, 10);
var SteelSword = new Weapon("sword", 8, 75, 0, 10);