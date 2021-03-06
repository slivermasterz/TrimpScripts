var perked = false;
var prestiged = false;
var bwRaiding = 0;
var resetGenes = false;
enableDebug = false;
userscriptOn = false;
autoTrimpSettings["VoidMaps"].value = 510;
autoTrimpSettings["ExitSpireCell"].value = 40;
autoTrimpSettings["AutoStartDaily"].enabled = false;

setInterval(
    function(){
        //Windstacking stance dancing
        if(game.global.world>=70) {
            if (game.global.dailyChallenge.hasOwnProperty("mirrored") && game.global.world < 230) {
                setFormation(1);
            }
            else if (getEmpowerment() !== "Wind" || game.global.mapsActive || game.empowerments.Wind.currentDebuffPower === 200) {
                if (!(game.global.mapsActive && game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)].bonus === "lmc")) {
                    setFormation(2);
                }
                if (getEmpowerment() !== "Wind") {
                    MODULES["maps"].enoughDamageCutoff = 4;
                }
            }
            else if (game.global.challengeActive === "Daily" && !game.global.spireActive) {
                setFormation(4);
                if (game.global.gridArray[game.global.lastClearedCell + 1].corrupted === "corruptBleed" || game.global.gridArray[game.global.lastClearedCell + 1].corrupted === "healthyBleed") {
                    setFormation(2);
                }
                MODULES["maps"].enoughDamageCutoff = 160;
            }
        }
        //Misc Features
        if (game.global.soldierHealth === 0 && !(game.global.spireActive || (game.global.mapsActive && getCurrentMapObject().location === "Void") || game.global.preMapsActive)) {
            fightManual();
            buyArmors();
        }
        if (game.global.antiStacks !== 45 && game.global.lastBreedTime >= 45000 && !game.global.spireActive) {
            forceAbandonTrimps();
        }
        if ((needPrestige || !enoughDamage) && game.global.world>=200 && (getEmpowerment() === "Ice" || (getEmpowerment() === "Wind" && game.global.lastBreedTime >= 45000)) && !game.global.mapsActive && game.global.mapBonus !== 10 && game.global.world!==game.options.menu.mapAtZone.setZone) {
            forceAbandonTrimps();
        }
        if (game.global.world === autoTrimpSettings["VoidMaps"].value && game.global.lastClearedCell >= 80 && getPageSetting('AutoMaps') === 0){
            toggleAutoMaps();
        }
        if (game.global.world === 495 && !resetGenes)
        {
            game.global.genPaused = true;
            numTab('6');
            game.global.firing = true;
            buyJob('Geneticist');
            game.global.firing = false;
            resetGenes = true;
        }
        //Raiding logic
        if (game.global.world === game.options.menu.mapAtZone.setZone && game.options.menu.mapAtZone.enabled === 1) {
            if (getPageSetting('AutoMaps') === 1 && game.global.mapsActive && !prestiged) {
                autoTrimpSettings["AutoMaps"].value = 0;
                game.options.menu.repeatUntil.enabled = 2;
                game.global.repeatMap = false;
            }
            else if (getPageSetting('AutoMaps') === 0 && game.global.preMapsActive && !prestiged) {
                game.global.repeatMap = true;
                (game.global.world % 10 === 5) ? bestGear():plusPres();
                buyMap();
                selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
                runMap();
                prestiged = true;
                bwRaiding = bwRaiding === 0 ? 1 : -1;
            }
            else if (prestiged && game.global.preMapsActive) {
                recycleMap();
                game.options.menu.mapAtZone.enabled = 0;
                autoTrimpSettings["AutoMaps"].value = bwRaiding > -1 ? 0 : 1;
            }
        }
        if (game.global.world === game.options.menu.mapAtZone.setZone + 1){
            game.options.menu.mapAtZone.enabled = 1;
            game.options.menu.mapAtZone.setZone = nextMapAtZone(game.options.menu.mapAtZone.setZone);
            prestiged = false;
        }

        //Resetting values
        if (game.global.world <= 10 && game.global.dailyChallenge.hasOwnProperty("mirrored")){
            autoTrimpSettings["BuyWeapons"].enabled = false;
        }
        else if (game.global.world===230){
            perked = false;
            prestiged = false;
            resetGenes = false;
            game.options.menu.mapAtZone.setZone = 495;
            game.options.menu.mapAtZone.enabled = 1;
            autoTrimpSettings["BuyWeapons"].enabled = true;
            autoTrimpSettings["AutoMaps"].value = 1;
        }
        //AutoAllocate Looting II
        if (!perked && game.global.world !== 230){
            viewPortalUpgrades();
            game.global.lastCustomAmt = 100000;
            numTab(5, true);
            if (getPortalUpgradePrice("Looting_II")+game.resources.helium.totalSpentTemp <= game.resources.helium.respecMax){
                buyPortalUpgrade('Looting_II');
                activateClicked();
                message("Bought 100k Looting II","Notices");
            }
            else{
                perked = true;
                cancelPortal();
                message("Done buying Looting II","Notices");
            }
        }
    },500);

function buyArmors(){
    numTab(3);
    buyEquipment('Boots');
    buyEquipment('Helmet');
    buyEquipment('Pants');
    buyEquipment('Shoulderguards');
    buyEquipment('Breastplate')
    buyEquipment('Gambeson')
}

function plusPres(){
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advExtraLevelSelect').value = plusMapToRun(game.global.world);
    document.getElementById('advSpecialSelect').value = "p";
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 9;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    updateMapCost();
}

function bestGear() {
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advSpecialSelect').value = 0;
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 0;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    document.getElementById('advExtraLevelSelect').value = 10;
    while (updateMapCost(true) > game.resources.fragments.owned)
    {
        document.getElementById('advExtraLevelSelect').value--;
    }
}


function plusMapToRun(zone) {
    var currentModifier = (zone - 235) % 15;
    if (currentModifier === 1) {
        if (zone % 10 === 1) {
            return 4;
        }
        else if (zone % 10 === 6) {
            return 5;
        }
    }
    else if (currentModifier === 5) {
        if (zone % 10 === 5) {
            return 6;
        }
        else if (zone % 10 === 0) {
            return 5;
        }
    }
    return 0;
}

function nextMapAtZone(zone) {
    var currentModifier = (zone - 235) % 15;
    if (currentModifier === 1) {
        return zone + 4;
    }
    else if (currentModifier === 5) {
        return zone + 11;
    }
    else {
        return -1;
    }
}