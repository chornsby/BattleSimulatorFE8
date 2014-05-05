function Terrain(terrainType, defence, avoid) {
    this.terrainType = terrainType;
    this.defence = defence;
    this.avoid = avoid;
}

var Forest = new Terrain("forest", 1, 20);
var Fort = new Terrain("fort", 2, 20);
var Plain = new Terrain("plain", 0, 0);