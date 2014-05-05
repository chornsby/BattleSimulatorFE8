var Eirika  = new Unit("Eirika", 16, 4, 8, 9, 5, 3, 1, 5);
var Ephraim = new Unit("Ephraim", 23, 8, 9, 11, 8, 7, 2, 8);
var Garcia  = new Unit("Garcia", 28, 8, 7, 7, 3, 5, 1, 14);

Eirika.setTerrain(Forest);
Ephraim.setTerrain(Plain);
Garcia.setTerrain(Forest);

Eirika.setWeapon(IronSword);
Ephraim.setWeapon(IronLance);
Garcia.setWeapon(IronAxe);

var Bandito = new Unit("Bandito", 22, 5, 1, 1, 0, 5, 0, 11);
Bandito.setTerrain(Plain);
Bandito.setWeapon(IronAxe);

var Bandito2 = new Unit("Bandito", 20, 5, 2, 4, 0, 2, 0, 11);
Bandito2.setTerrain(Forest);
Bandito2.setWeapon(IronAxe);

var ONeill = new Unit("ONeill", 23, 6, 4, 7, 0, 2, 0, 11);
ONeill.setTerrain(Plain);
ONeill.setWeapon(IronAxe);

var Seth = new Unit("Seth", 30, 14, 13, 12, 13, 11, 8, 11);
Seth.setTerrain(Plain);
Seth.setWeapon(SteelSword);
