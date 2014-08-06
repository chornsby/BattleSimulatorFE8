// TODO: Tidy code...

$(document).ready(function() {

    // TODO: Preload pictures and store in objects.

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

    var $unit1UnitDropdown = $attacker.find('.unit-dropdown');
    var $unit1LevelDropdown = $attacker.find('.level-dropdown');
    var $unit1PromotedLevelDropdown = $attacker.find('.promoted-level-dropdown');
    var $unit1JobDropdown = $attacker.find('.job-dropdown');
    var $unit1TerrainDropdown = $attacker.find('.terrain-dropdown');
    var $unit1WeaponDropdown = $attacker.find('.weapon-dropdown');

    var $unit2UnitDropdown = $defender.find('.unit-dropdown');
    var $unit2LevelDropdown = $defender.find('.level-dropdown');
    var $unit2PromotedLevelDropdown = $defender.find('.promoted-level-dropdown');
    var $unit2JobDropdown = $defender.find('.job-dropdown');
    var $unit2TerrainDropdown = $defender.find('.terrain-dropdown');
    var $unit2WeaponDropdown = $defender.find('.weapon-dropdown');

    var $battleSeparationDropdown = $('#battle-separation');

    var logToBattle = function(text) {
        // Append the given text to the $battleLog textarea.
        $battleLog.val($battleLog.val() + text + "\n");
    };
    
    var showIndividualData = function(descriptor, $div, unitA, unitB, separation) {
        $div.find('.unit-portrait').attr("src", "images/portraits/" + unitA.name + ".gif");
        $div.find('.weapon-type').attr("src", "images/weapon_groups/" + unitA.weapon.weaponType.capitalise() + ".gif");
        $div.find('.weapon-name').attr("src", "images/weapons/" + unitA.weapon.name + ".gif");

        if (unitA.inRange(unitB, separation)) {
            if (unitA.isRepeatedAttack(unitB) && unitA.weapon.brave) {
                $div.find('.repeat-attack').text("4X");
            } else if (unitA.isRepeatedAttack(unitB) || unitA.weapon.brave){
                $div.find('.repeat-attack').text("2X");
            } else {
                $div.find('.repeat-attack').html("<br>");
            }

            $div.find('.hp').text("HP " + unitA.HP + "/" + unitA.maxHP);
            $div.find('.might').text("Mt " + unitA.damage(unitB));
            $div.find('.accuracy').text("Hit " + unitA.accuracy(unitB));
            $div.find('.critical').text("Crit " + unitA.criticalChance(unitB));
        } else {
            $div.find('.repeat-attack').html("<br>");
            $div.find('.hp').text("HP " + unitA.HP + "/" + unitA.maxHP);
            $div.find('.might').text("Mt --");
            $div.find('.accuracy').text("Hit --");
            $div.find('.critical').text("Crit --");
        }

        var $statsTable = $div.find('td input');
        $statsTable.eq(0).val(unitA.maxHP);
        $statsTable.eq(1).val(unitA.luck);
        $statsTable.eq(2).val(unitA.power);
        $statsTable.eq(3).val(unitA.defence);
        $statsTable.eq(4).val(unitA.skill);
        $statsTable.eq(5).val(unitA.resistance);
        $statsTable.eq(6).val(unitA.speed);
        $statsTable.eq(7).val(unitA.constitution);

        var $skillTable = $div.find('td select');
        $skillTable.eq(0).find("option").eq(unitA.weaponSkill.sword).prop("selected", true);
        $skillTable.eq(1).find("option").eq(unitA.weaponSkill.axe).prop("selected", true);
        $skillTable.eq(2).find("option").eq(unitA.weaponSkill.lance).prop("selected", true);
        $skillTable.eq(3).find("option").eq(unitA.weaponSkill.bow).prop("selected", true);
        $skillTable.eq(4).find("option").eq(unitA.weaponSkill.anima).prop("selected", true);
        $skillTable.eq(5).find("option").eq(unitA.weaponSkill.dark).prop("selected", true);
        $skillTable.eq(6).find("option").eq(unitA.weaponSkill.light).prop("selected", true);
        $skillTable.eq(7).find("option").eq(unitA.weaponSkill.staff).prop("selected", true);

    };

    var showData = function ($div1, $div2, unit1, unit2, separation) {
        showIndividualData("Attacker", $div1, unit1, unit2, separation);
        showIndividualData("Defender", $div2, unit2, unit1, separation);
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

    var updateLevelDropdown = function(unit, $unpromoted, $promoted) {

        var i;

        if (Job.prototype.promotedJobs.indexOf(unit.baseJob) > -1) {

            $unpromoted.empty();
            $unpromoted.append(new Option("-", 1));

            $promoted.empty();
            for (i = 1; i < 21; i++) {
                $promoted.append(new Option(i, i));
            }

        } else if (Job.prototype.promotedJobs.indexOf(unit.job) > -1) {

            $unpromoted.empty();
            for (i = 1; i < 21; i++) {
                $unpromoted.append(new Option(i, i));
            }

            $promoted.empty();
            for (i = 1; i < 21; i++) {
                $promoted.append(new Option(i, i));
            }

        } else {

            $unpromoted.empty();
            for (i = 1; i < 21; i++) {
                $unpromoted.append(new Option(i, i));
            }

            $promoted.empty();
            $promoted.append(new Option("-", 1));

        }

        $unpromoted.find("option").eq(0).prop("selected", true);
        $promoted.find("option").eq(0).prop("selected", true);
    };

    var updateJobDropdown = function(unit, $dropdownSelector) {
        $dropdownSelector.empty();
        $dropdownSelector.append(new Option(unit.job, unit.job));

        for (var key in unit.promotions) {
            $dropdownSelector.append(new Option(key, key));
        }
    };

    var updateWeaponDropdown = function (unit, $dropdownSelector) {

        $dropdownSelector.empty();

        var weaponName;
        var weapon;

        var optgroups = {
            "sword": $('<optgroup label="Swords">'),
            "lance": $('<optgroup label="Lances">'),
            "axe": $('<optgroup label="Axes">'),
            "bow": $('<optgroup label="Bows">'),
            "anima": $('<optgroup label="Anima Magic">'),
            "light": $('<optgroup label="Light Magic">'),
            "dark": $('<optgroup label="Dark Magic">')
        };

        for (weaponName in Weapons) {
            weapon = Weapons[weaponName];

            var canWield = unit.weaponSkill[weapon.weaponType] > weapon.rank;

            if (weapon.usedBy.length > 0) {
                // Treat special weapons here (rapier, shamshir, etc).
                var usedByThem = weapon.usedBy.indexOf(unit.job) > -1;

                if (usedByThem && canWield) {
                    optgroups[weapon.weaponType].append(new Option(
                        weaponName, weaponName));
                }
            } else {
                // Treat standard weapons here
                if (canWield) {
                    optgroups[weapon.weaponType].append(new Option(
                        weaponName, weaponName));
                }
            }
        }

        // Add the option groups to the dropdown if they contain anything.
        for (var key in optgroups) {
            if (unit.weaponSkill[key] > 0) {
                $dropdownSelector.append(optgroups[key]);
            }
        }

        unit.setWeapon(Weapons[$dropdownSelector.val()]);
    };

    var unit1 = Characters["Eirika"].copy();
    var unit2 = Characters["Seth"].copy();
    var separation = $battleSeparationDropdown.val();

    updateUnitDropdown($unit1UnitDropdown);
    updateUnitDropdown($unit2UnitDropdown);

    $unit2UnitDropdown.find("option").eq(1).prop("selected", true);

    updateLevelDropdown(unit1, $unit1LevelDropdown, $unit1PromotedLevelDropdown);
    updateLevelDropdown(unit2, $unit2LevelDropdown, $unit2PromotedLevelDropdown);

    updateJobDropdown(unit1, $unit1JobDropdown);
    updateJobDropdown(unit2, $unit2JobDropdown);

    updateTerrainDropdown($unit1TerrainDropdown);
    updateTerrainDropdown($unit2TerrainDropdown);

    updateWeaponDropdown(unit1, $unit1WeaponDropdown);
    updateWeaponDropdown(unit2, $unit2WeaponDropdown);

    unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
    unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

    var battle = new Battle(unit1, unit2, separation, logToBattle);

    showData($attacker, $defender, unit1, unit2, separation);

    $fight.click(function () {
        battle.round(unit1, unit2);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $reset.click(function () {
        resetHealths();
        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit1UnitDropdown.change(function () {
        resetHealths();

        unit1 = Characters[$unit1UnitDropdown.val()].copy();

        updateWeaponDropdown(unit1, $unit1WeaponDropdown);
        updateLevelDropdown(unit1, $unit1LevelDropdown, $unit1PromotedLevelDropdown);
        updateJobDropdown(unit1, $unit1JobDropdown);

        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit2UnitDropdown.change(function () {
        resetHealths();

        unit2 = Characters[$unit2UnitDropdown.val()].copy();

        updateWeaponDropdown(unit2, $unit2WeaponDropdown);
        updateLevelDropdown(unit2, $unit2LevelDropdown, $unit2PromotedLevelDropdown);
        updateJobDropdown(unit2, $unit2JobDropdown);

        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);

        battle = new Battle(unit1, unit2, separation, logToBattle);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    var levelUnit1 = function() {
        resetHealths();

        var unpromotedLevel = parseInt($unit1LevelDropdown.val());
        var promotedLevel = parseInt($unit1PromotedLevelDropdown.val());

        unit1.levelTo(unpromotedLevel + promotedLevel);

        showData($attacker, $defender, unit1, unit2, separation);
    };

    var levelUnit2 = function() {
        resetHealths();

        var unpromotedLevel = parseInt($unit2LevelDropdown.val());
        var promotedLevel = parseInt($unit2PromotedLevelDropdown.val());

        unit2.levelTo(unpromotedLevel + promotedLevel);

        showData($attacker, $defender, unit1, unit2, separation);
    };


    $unit1LevelDropdown.change(function() {
        levelUnit1();
    });

    $unit1PromotedLevelDropdown.change(function() {
        levelUnit1();
    });

    $unit2LevelDropdown.change(function() {
        levelUnit2()
    });

    $unit2PromotedLevelDropdown.change(function() {
        levelUnit2();
    });

    $unit1WeaponDropdown.change(function () {
        unit1.setWeapon(Weapons[$unit1WeaponDropdown.val()]);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit1TerrainDropdown.change(function () {
        unit1.setTerrain(Terrains[$unit1TerrainDropdown.val()]);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit2WeaponDropdown.change(function () {
        unit2.setWeapon(Weapons[$unit2WeaponDropdown.val()]);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit2TerrainDropdown.change(function () {
        unit2.setTerrain(Terrains[$unit2TerrainDropdown.val()]);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $battleSeparationDropdown.change(function() {
        separation = parseInt($battleSeparationDropdown.val());
        battle.separation = separation;
        showData($attacker, $defender, unit1, unit2, separation);
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
            battle = new Battle(unit1, unit2, separation, logToBattle);
            showData($attacker, $defender, unit1, unit2, separation);
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
            battle = new Battle(unit1, unit2, separation, logToBattle);
            showData($attacker, $defender, unit1, unit2, separation);
        }
    });

    $attacker.find('td select').change(function() {

        unit1.weaponSkill[this.className] = parseInt(this.value);

        updateWeaponDropdown(unit1, $unit1WeaponDropdown);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $defender.find('td select').change(function() {

        unit2.weaponSkill[this.className] = parseInt(this.value);

        updateWeaponDropdown(unit2, $unit2WeaponDropdown);
        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit1JobDropdown.change(function() {

        unit1.job = $unit1JobDropdown.val();
        updateLevelDropdown(unit1, $unit1LevelDropdown, $unit1PromotedLevelDropdown);

        if (unit1.job != unit1.baseJob && $unit1LevelDropdown.val() < 10) {
            $unit1LevelDropdown.find("option").eq(9).prop("selected", true);
        }

        levelUnit1();

        showData($attacker, $defender, unit1, unit2, separation);
    });

    $unit2JobDropdown.change(function() {

        unit2.job = $unit2JobDropdown.val();
        updateLevelDropdown(unit2, $unit2LevelDropdown, $unit2PromotedLevelDropdown);

        if (unit2.job != unit2.baseJob && $unit2LevelDropdown.val() < 10) {
            $unit2LevelDropdown.find("option").eq(9).prop("selected", true);
        }

        levelUnit2();

        showData($attacker, $defender, unit1, unit2, separation);
    });

});