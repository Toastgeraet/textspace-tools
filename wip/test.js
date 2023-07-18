(() => {
    for (let rep = 0; rep < 14; rep++) {
        const cycle_start = TRAINING_DURATION_SECONDS * rep;

        cargoSellAllCommodities(SYSTEM_NOVA_COMMODITY_ARSENIC.commodity_id, cycle_start);
        console.log("Scheduling sale of commodities in " + `${cycle_start}`.toHHMMSS());

        startTraining(MINING_CRAFT_SKILL_ID, cycle_start + 5)
        console.log("Scheduling start of mining training in " + `${cycle_start + 5}`.toHHMMSS());

        startMining(SYSTEM_NOVA_COMMODITY_ARSENIC, cycle_start + 20)
        console.log("Scheduling start of mining commodities in " + `${cycle_start + 20}`.toHHMMSS());

        stopMining(cycle_start + TRAINING_DURATION_SECONDS - 60)
        console.log("Scheduling stop of mining commodities in " + `${cycle_start + TRAINING_DURATION_SECONDS - 60}`.toHHMMSS());
    }
})();

startMining(SYSTEM_ADAMA_COMMODITY_CAESIUM, 0)
cargoSellAllCommodities(COMMODITY_CAESIUM_ID, 0);
setInterval(() => {
    cargoSellAllCommodities(COMMODITY_CAESIUM_ID, 0);
}, 1000 * 60 * 60 * 5);


(async () => {
    await relieveCrew(CREW_COMMANDER_MATZOVSKY_ID, SHIP_ID_BARGE_BIG_PAW);
    await switchShip(SHIP_ID_BARGE_BIG_PAW);
    await cargoSellAllCommodities(COMMODITY_ARSENIC_ID).promise;
})();

(async () => {
    setInterval(async () => {
        transferCargoFromShip(COMMODITY_ARSENIC_ID, 1, SHIP_ID_BARGE_SPAM_28);
        cargoSellAllCommodities(COMMODITY_ARSENIC_ID);
    }, 1000 * 60 * 10)
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
