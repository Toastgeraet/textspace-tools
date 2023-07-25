(() => {
    for (let rep = 0; rep < 14; rep++) {
        const cycle_start = TRAINING_DURATION_SECONDS * rep;
        const

            cargoSellAllCommodities(SYSTEM_NOVA_COMMODITY_ARSENIC.commodity_id, cycle_start);
        console.log("Scheduling sale of commodities in " + `${cycle_start}`.toHHMMSS());

        startTraining(CRAFT_SKILL_ID_MINING, cycle_start + 5)
        console.log("Scheduling start of mining training in " + `${cycle_start + 5}`.toHHMMSS());

        startMining(SYSTEM_NOVA_COMMODITY_ARSENIC, cycle_start + 20)
        console.log("Scheduling start of mining commodities in " + `${cycle_start + 20}`.toHHMMSS());

        stopMining(cycle_start + TRAINING_DURATION_SECONDS - 60)
        console.log("Scheduling stop of mining commodities in " + `${cycle_start + TRAINING_DURATION_SECONDS - 60}`.toHHMMSS());
    }
})();

(() => {
    for (let rep = 0; rep < 14; rep++) {
        const bifrons = 2420;
        const laurin = 2412;
        const bromine = 35;

        await sleep(1000 * 60 * 15);
        await cargoSellAllCommodities(bromine, 0).promise;

        await performAsync(`/action/sublight/start/?system_id=${laurin}`);
        await sleep(1000 * 60 * 15);

        await performAsync(`/action/cargo/commodities/recover/?commodity_id=35&quantity=5300`);

        await performAsync(`/action/sublight/start/?system_id=${bifrons}`);

    }
})();

startMining(SYSTEM_MORESBY_COMMODITY_CAESIUM, 0)
cargoSellAllCommodities(36, 0);
startTraining(CRAFT_SKILL_ID_DEFENCE, 0)
setInterval(() => {
    startTraining(CRAFT_SKILL_ID_DEFENCE, 0)
    // cargoSellAllCommodities(36, 0);
}, 1000 * 60 * 101);


(async () => {
    await relieveCrew(CREW_COMMANDER_MATZOVSKY_ID, SHIP_ID_BARGE_BIG_PAW);
    await switchShip(SHIP_ID_BARGE_BIG_PAW);
    await cargoSellAllCommodities(COMMODITY_ARSENIC_ID).promise;
})();

(async () => {
    setInterval(async () => {
        // transferCargoFromShip(COMMODITY_ARSENIC_ID, 1, SHIP_ID_BARGE_SPAM_28);
        // cargoSellAllCommodities(46); //palladium
        cargoSellAllCommodities(40); //zirconium
        // cargoSellAllCommodities(50); //tin
    }, 1000 * 60 * 60)
})();

(async () => {
    await switchShip(SHIP_ID_HAULER_JUNIE);
    await assignCrew(CREW_COMMANDER_MATZOVSKY_ID, SHIP_ID_BARGE_BIG_PAW);
})();

(async () => {
    const user = await asJson(performApiTask(`/user/`));
    ship_ids = user.owned_ships;
    promises = ship_ids.map(id => asJson(performApiTask(`/lookup/ship/?ship_id=${id}`)));
    ships = (await Promise.allSettled(promises)).map(p => p.value); // not enlisted ships    
    console.log("current ship", user.current_ship);
})();


(async () => {
})();


// search and do collection plate mission
missionId = (await performAsync(`/missions/search/?term=collection`)).board[0].mission_id;
(await performAsync(`/missions/step_complete/?mission_id=${missionId}&step=1`));
(await performAsync(`/missions/step_complete/?mission_id=${missionId}&step=2`));

function toArray(objWithNumKeys) {
    return objWithNumKeys.entries().map(([key, value]) => value);
}

(async () => {
    await sleep(1000 * 60 * 2);
    for (let rep = 0; rep < 14; rep++) {
        const bifrons = 2420;
        const kharaxos = 2413;
        const laurin = 2412;
        const sell_at = kharaxos;

        const bromine = 35;
        const selenium = 34;
        const commodity = selenium;

        await performAsync(`/action/cargo/commodities/recover/?commodity_id=${commodity}&quantity=5300`);
        console.log(`pickup`);
        await performAsync(`/action/sublight/start/?system_id=${sell_at}`);
        console.log(`to kharaxos`);        
        await sleep(1000 * 60 * 4);

        
        await cargoSellAllCommodities(commodity, 0).promise;
        console.log(`sold`);
        await performAsync(`/action/sublight/start/?system_id=${laurin}`);
        console.log(`to laurin`);
        await sleep(1000 * 60 * 4);

        await getPrices();
        // await sleep(1000 * 60 * 2);        
    }
})();



(async () => {
    getPrices()
})();