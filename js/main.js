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
    
    var showIndividualData = function(descriptor, $div, unitA, unitB) {
        $div.eq(0).text(descriptor + ": " + unitA.name);
        $div.eq(1).attr("src", "images/portraits/" + unitA.name + ".gif");
        $div.eq(2).attr("src", "images/weapon_groups/" + unitA.weapon.weaponType + ".gif");
        $div.eq(3).attr("src", "images/weapons/" + unitA.weapon.name + ".gif");
        $div.eq(4).text(unitA.weapon.name + " " + unitA.weaponTriangleBonus(unitB));
        $div.eq(5).text("2x? " + unitA.isRepeatedAttack(unitB));
        $div.eq(6).text("HP " + unitA.HP + "/" + unitA.maxHP);
        $div.eq(7).text("Mt " + unitA.damage(unitB));
        $div.eq(8).text("Hit " + unitA.accuracy(unitB));
        $div.eq(9).text("Crit " + unitA.criticalChance(unitB));
        $div.eq(10).attr("src", "images/map_sprites/" + unitA.job + ".gif");
    };

    var showData = function ($div1, $div2, unit1, unit2) {
        showIndividualData("Attacker", $div1, unit1, unit2);
        showIndividualData("Defender", $div2, unit2, unit1);
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
        var optgroup;

        if (unit.weaponSkill.sword > 0) {
            optgroup = $('<optgroup>');
            optgroup.attr('label', "Swords");

            for (i = 0; i < Swords.length; i++) {
                optgroup.append(new Option(Swords[i], Swords[i]));
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.axe > 0) {
            optgroup = $('<optgroup>');
            optgroup.attr('label', "Axes");

            for (i = 0; i < Axes.length; i++) {
                optgroup.append(new Option(Axes[i], Axes[i]));
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.lance > 0) {
            optgroup = $('<optgroup>');
            optgroup.attr('label', "Lances");

            for (i = 0; i < Lances.length; i++) {
                optgroup.append(new Option(Lances[i], Lances[i]));
            }

            $dropdownSelector.append(optgroup);
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
        battle = new Battle(unit1, unit2, logToBattle);
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