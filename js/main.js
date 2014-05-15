// TODO: Tidy code...

$(document).ready(function() {

    var Characters = {};
    var Weapons = {};
//    var Jobs = {};
    var Terrains = {};

    // TODO: Use callbacks to avoid forcing synchronous requests.
    $.ajaxSetup({
        async: false
    });

    $.getJSON("json/weapons.json", function (data) {
        for (var i = 0; i < data.length; i++) {
            Weapons[data[i].name] = new Weapon(data[i]);
        }
    });

//    $.getJSON("json/jobs.json", function (data) {
//        for (var i = 0; i < data.length; i++) {
//            Jobs[data[i].name] = new Job(data[i]);
////            Jobs[data[i].name] = data[i];
//        }
//    });

    $.getJSON("json/terrains.json", function (data) {
        for (var i = 0; i < data.length; i++) {
            Terrains[data[i].name] = new Terrain(data[i]);
//            Terrains[data[i].name] = data[i];
        }
    });

    $.getJSON("json/characters.json", function (data) {
        for (var i = 0; i < data.length; i++) {
            Characters[data[i].name] = new Unit(data[i]);
        }
    });

    var $attacker = $('#attacker').children();
    var $defender = $('#defender').children();

    var $fight = $('#fight');
    var $reset = $('#reset');

    var $battleLog = $('#battle-log');

    var $unit1UnitDropdown = $('#unit1-unit-dropdown');
    var $unit1TerrainDropdown = $('#unit1-terrain-dropdown');
    var $unit1WeaponDropdown = $('#unit1-weapon-dropdown');

    var $unit2UnitDropdown = $('#unit2-unit-dropdown');
    var $unit2TerrainDropdown = $('#unit2-terrain-dropdown');
    var $unit2WeaponDropdown = $('#unit2-weapon-dropdown');

    var logToBattle = function(text) {
        // Append the given text to the $battleLog textarea.
        $battleLog.val($battleLog.val() + text + "\n");
    };

    var showData = function ($div1, $div2, unit1, unit2) {
        $div1.eq(0).text("Attacker: " + unit1.name);
        $div1.eq(1).attr("src", "images/portraits/" + unit1.name + ".gif");
        $div1.eq(2).attr("src", "images/weapon_groups/" + unit1.weapon.weaponType + ".gif");
        $div1.eq(3).attr("src", "images/weapons/" + unit1.weapon.name + ".gif");
        $div1.eq(4).text(unit1.weapon.name + " " + unit1.weaponTriangleBonus(unit2));
        $div1.eq(5).text("2x? " + unit1.isRepeatedAttack(unit2));
        $div1.eq(6).text("HP " + unit1.HP + "/" + unit1.maxHP);
        $div1.eq(7).text("Mt " + unit1.damage(unit2));
        $div1.eq(8).text("Hit " + unit1.accuracy(unit2));
        $div1.eq(9).text("Crit " + unit1.criticalChance(unit2));
        $div1.eq(10).attr("src", "images/map_sprites/" + unit1.job + ".gif");

        $div2.eq(0).text("Defender: " + unit2.name);
        $div2.eq(1).attr("src", "images/portraits/" + unit2.name + ".gif");
        $div2.eq(2).attr("src", "images/weapon_groups/" + unit2.weapon.weaponType + ".gif");
        $div2.eq(3).attr("src", "images/weapons/" + unit2.weapon.name + ".gif");
        $div2.eq(4).text(unit2.weapon.name + " " + unit2.weaponTriangleBonus(unit1));
        $div2.eq(5).text("2x? " + unit2.isRepeatedAttack(unit1));
        $div2.eq(6).text("HP " + unit2.HP + "/" + unit2.maxHP);
        $div2.eq(7).text("Mt " + unit2.damage(unit1));
        $div2.eq(8).text("Hit " + unit2.accuracy(unit1));
        $div2.eq(9).text("Crit " + unit2.criticalChance(unit1));
        $div2.eq(10).attr("src", "images/map_sprites/" + unit2.job + ".gif");
    };

    var resetHealths = function () {
        // Reset the health of the two units involved in the battle.
        unit1.resetHealth();
        unit2.resetHealth();
        $battleLog.val("");
    };

    var updateUnitDropdown = function($dropdownSelector) {
        for (var key in Characters) {
            $dropdownSelector.append(new Option(key, key))
        }
    };

    var updateTerrainDropdown = function($dropdownSelector) {
        for (var key in Terrains) {
            $dropdownSelector.append(new Option(key, key))
        }
    };

    var updateWeaponDropdown = function (unit, $dropdownSelector) {
        // Update the dropdown options as a side effect.
        var i;

        if (unit.weaponSkill.sword > 0) {
            for (i = 0; i < Swords.length; i++) {
                $dropdownSelector.append(new Option(Swords[i], Swords[i]))
            }
        }
        if (unit.weaponSkill.axe > 0) {
            for (i = 0; i < Axes.length; i++) {
                $dropdownSelector.append(new Option(Axes[i], Axes[i]))
            }
        }
        if (unit.weaponSkill.lance > 0) {
            for (i = 0; i < Lances.length; i++) {
                $dropdownSelector.append(new Option(Lances[i], Lances[i]))
            }
        }
        /* TODO: Finish for other weapons and magic. */
    };

    var unit1 = Characters["Eirika"].copy();
    var unit2 = Characters["Eirika"].copy();

    updateUnitDropdown($unit1UnitDropdown);
    updateUnitDropdown($unit2UnitDropdown);

    updateTerrainDropdown($unit1TerrainDropdown);
    updateTerrainDropdown($unit2TerrainDropdown);

    updateWeaponDropdown(unit1, $unit1WeaponDropdown);
    updateWeaponDropdown(unit2, $unit2WeaponDropdown);

    unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
    unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
    unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
    unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

    var battle = new Battle(unit1, unit2, logToBattle);

    showData($attacker, $defender, unit1, unit2);

    $fight.click(function () {
        battle.round(unit1, unit2);
        showData($attacker, $defender, unit1, unit2);
    });

    $reset.click(function () {
        resetHealths();
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1UnitDropdown.change(function () {
        resetHealths();
        $unit1WeaponDropdown.empty();

        unit1 = Characters[$unit1UnitDropdown.val()].copy();
        updateWeaponDropdown(unit1, $unit1WeaponDropdown);

        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2UnitDropdown.change(function () {
        resetHealths();
        $unit2WeaponDropdown.empty();

        unit2 = Characters[$unit2UnitDropdown.val()].copy();
        updateWeaponDropdown(unit2, $unit2WeaponDropdown);

        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1WeaponDropdown.change(function () {
        resetHealths();
        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1TerrainDropdown.change(function () {
        resetHealths();
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2WeaponDropdown.change(function () {
        resetHealths();
        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2TerrainDropdown.change(function () {
        resetHealths();
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);
        battle = new Battle(unit1, unit2, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });
});