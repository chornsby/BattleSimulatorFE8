function StatGrowths(statGrowthsJSON) {
    // Represent the stat growths of a unit as percentages.
    this.HP = statGrowthsJSON.HP;
    this.power = statGrowthsJSON.power;
    this.skill = statGrowthsJSON.skill;
    this.speed = statGrowthsJSON.speed;
    this.luck = statGrowthsJSON.luck;
    this.defence = statGrowthsJSON.defence;
    this.resistance = statGrowthsJSON.resistance;
}