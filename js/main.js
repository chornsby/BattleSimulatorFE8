// TODO: Tidy code...

$(document).ready(function() {

    var Characters = {};
    var Weapons = {};
//    var Jobs = {};
    var Terrains = {};

    // TODO: Use callbacks to avoid forcing synchronous requests.
    // TODO: Check whether all have completed only on increment of tally.
    $.ajaxSetup({
        async: false
    });

    $.getJSON("json/weapons.json", function (data) {
        for (var i = 0; i < data.length; i++) {
            Weapons[data[i].name] = new Weapon(data[i]);
        }
    });

    // TODO: Implement jobs properly.
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

    var $attacker = $('#attacker');
    var $defender = $('#defender');

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
        $div.find('.unit-portrait').attr("src", "images/portraits/" + unitA.name + ".gif");
        $div.find('.weapon-type').attr("src", "images/weapon_groups/" + unitA.weapon.weaponType + ".gif");
        $div.find('.weapon-name').attr("src", "images/weapons/" + unitA.weapon.name + ".gif");
//        $div.eq(4).text(unitA.weapon.name + " " + unitA.weaponTriangleBonus(unitB));
        $div.find('.repeat-attack').text("2x? " + unitA.isRepeatedAttack(unitB));
        $div.find('.hp').text("HP " + unitA.HP + "/" + unitA.maxHP);
        $div.find('.might').text("Mt " + unitA.damage(unitB));
        $div.find('.accuracy').text("Hit " + unitA.accuracy(unitB));
        $div.find('.critical').text("Crit " + unitA.criticalChance(unitB));
//        $div.eq(10).attr("src", "images/map_sprites/" + unitA.job + ".gif");
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
        var weapon;
        var optgroup;

        if (unit.weaponSkill.sword > 0) {
            optgroup = $('<optgroup label="Swords">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "sword") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.axe > 0) {
            optgroup = $('<optgroup label="Axes">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "axe") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.lance > 0) {
            optgroup = $('<optgroup label="Lances">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "lance") {
                    optgroup.append(new Option(weapon, weapon));
                }
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