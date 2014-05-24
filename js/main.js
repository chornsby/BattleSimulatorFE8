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
    var $unit1LevelDropdown = $('#unit1-level-dropdown');
    var $unit1TerrainDropdown = $('#unit1-terrain-dropdown');
    var $unit1WeaponDropdown = $('#unit1-weapon-dropdown');

    var $unit2UnitDropdown = $('#unit2-unit-dropdown');
    var $unit2LevelDropdown = $('#unit2-level-dropdown');
    var $unit2TerrainDropdown = $('#unit2-terrain-dropdown');
    var $unit2WeaponDropdown = $('#unit2-weapon-dropdown');

    var $battleSeparationDropdown = $('#battle-separation');

    var logToBattle = function(text) {
        // Append the given text to the $battleLog textarea.
        $battleLog.val($battleLog.val() + text + "\n");
    };
    
    var showIndividualData = function(descriptor, $div, unitA, unitB) {
        $div.find('.unit-portrait').attr("src", "images/portraits/" + unitA.name + ".gif");
        $div.find('.weapon-type').attr("src", "images/weapon_groups/" + unitA.weapon.weaponType + ".gif");
        $div.find('.weapon-name').attr("src", "images/weapons/" + unitA.weapon.name + ".gif");

        if (unitA.isRepeatedAttack(unitB)) {
            $div.find('.repeat-attack').text("2x");
        } else {
            $div.find('.repeat-attack').html("<br>");
        }

        $div.find('.hp').text("HP " + unitA.HP + "/" + unitA.maxHP);
        $div.find('.might').text("Mt " + unitA.damage(unitB));
        $div.find('.accuracy').text("Hit " + unitA.accuracy(unitB));
        $div.find('.critical').text("Crit " + unitA.criticalChance(unitB));

        var table = $div.find('td input');
        table.eq(0).val(unitA.maxHP);
        table.eq(1).val(unitA.luck);
        table.eq(2).val(unitA.power);
        table.eq(3).val(unitA.defence);
        table.eq(4).val(unitA.skill);
        table.eq(5).val(unitA.resistance);
        table.eq(6).val(unitA.speed);
        table.eq(7).val(unitA.constitution);

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

    var updateLevelDropdown = function(unit, $dropdownSelector) {
        for (var i = unit.baseLevel; i < 21; i++) {
            $dropdownSelector.append(new Option(i, i));
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

        if (unit.weaponSkill.bow > 0) {
            optgroup = $('<optgroup label="Bows">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "bow") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.anima > 0) {
            optgroup = $('<optgroup label="Anima Magic">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "anima") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.dark > 0) {
            optgroup = $('<optgroup label="Dark Magic">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "dark") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

        if (unit.weaponSkill.light > 0) {
            optgroup = $('<optgroup label="Light Magic">');

            for (weapon in Weapons) {
                if (Weapons[weapon].weaponType === "light") {
                    optgroup.append(new Option(weapon, weapon));
                }
            }

            $dropdownSelector.append(optgroup);
        }

    };

    var unit1 = Characters["Eirika"].copy();
    var unit2 = Characters["Eirika"].copy();
    var separation = $battleSeparationDropdown.val();

    updateUnitDropdown($unit1UnitDropdown);
    updateUnitDropdown($unit2UnitDropdown);

    updateLevelDropdown(unit1, $unit1LevelDropdown);
    updateLevelDropdown(unit2, $unit2LevelDropdown);

    updateTerrainDropdown($unit1TerrainDropdown);
    updateTerrainDropdown($unit2TerrainDropdown);

    updateWeaponDropdown(unit1, $unit1WeaponDropdown);
    updateWeaponDropdown(unit2, $unit2WeaponDropdown);

    unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
    unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
    unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
    unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

    var battle = new Battle(unit1, unit2, separation, logToBattle);

    showData($attacker, $defender, unit1, unit2);

    $fight.click(function () {
        battle.round(unit1, unit2);
        showData($attacker, $defender, unit1, unit2);
    });

    $reset.click(function () {
        resetHealths();
        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1UnitDropdown.change(function () {
        resetHealths();
        $unit1WeaponDropdown.empty();
        $unit1LevelDropdown.empty();

        unit1 = Characters[$unit1UnitDropdown.val()].copy();

        updateWeaponDropdown(unit1, $unit1WeaponDropdown);
        updateLevelDropdown(unit1, $unit1LevelDropdown);

        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2UnitDropdown.change(function () {
        resetHealths();
        $unit2WeaponDropdown.empty();
        $unit2LevelDropdown.empty();

        unit2 = Characters[$unit2UnitDropdown.val()].copy();

        updateWeaponDropdown(unit2, $unit2WeaponDropdown);
        updateLevelDropdown(unit2, $unit2LevelDropdown);

        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1LevelDropdown.change(function() {
        resetHealths();

        unit1.levelTo(parseInt($unit1LevelDropdown.val()));

        showData($attacker, $defender, unit1, unit2);
    });

    $unit2LevelDropdown.change(function() {
        resetHealths();

        unit2.levelTo(parseInt($unit2LevelDropdown.val()));

        showData($attacker, $defender, unit1, unit2);
    });

    $unit1WeaponDropdown.change(function () {
        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit1TerrainDropdown.change(function () {
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2WeaponDropdown.change(function () {
        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        showData($attacker, $defender, unit1, unit2);
    });

    $unit2TerrainDropdown.change(function () {
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);
        showData($attacker, $defender, unit1, unit2);
    });

    $battleSeparationDropdown.change(function() {
        battle.separation = parseInt($battleSeparationDropdown.val());
        showData($attacker, $defender, unit1, unit2);
    });

    $attacker.find('td input').on('input', function() {

        var valueIn = parseInt(this.value);

        if (valueIn >= 0) {

            // Treat HP specially because must change two values.
            if (this.name === "HP") {
                unit1.HP = valueIn;
                unit1.maxHP = valueIn;
            } else {
                unit1[this.name] = valueIn;
            }

            resetHealths();
            showData($attacker, $defender, unit1, unit2);
        }
    });

    $defender.find('td input').on('input', function() {

        var valueIn = parseInt(this.value);

        if (valueIn >= 0) {

            // Treat HP specially because must change two values.
            if (this.name === "HP") {
                unit2.HP = valueIn;
                unit2.maxHP = valueIn;
            } else {
                unit2[this.name] = valueIn;
            }

            resetHealths();
            showData($attacker, $defender, unit1, unit2);
        }
    });
});