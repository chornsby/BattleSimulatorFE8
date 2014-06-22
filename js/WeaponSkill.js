function WeaponSkill(weaponSkillJSON) {
    // Represent the weapon skill of a unit.
    // Weapon ranks from 0-6: no skill, E, D, C, B, A, S.
    this.sword = weaponSkillJSON.sword;
    this.lance = weaponSkillJSON.lance;
    this.axe = weaponSkillJSON.axe;
    this.bow = weaponSkillJSON.bow;
    this.anima = weaponSkillJSON.anima;
    this.dark = weaponSkillJSON.dark;
    this.light = weaponSkillJSON.light;
    this.staff = weaponSkillJSON.staff;
}

