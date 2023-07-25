String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

// Object.prototype.toArray = function () {
//     return Object.entries(this).map(([key, value]) => value);
// }

function toArray(obj) {
    return Object.entries(obj).map(([key, value]) => value);
}

function preprendSlash(str) {
    if (!str.startsWith('/')) {
        str = `/${str}`;
    }
    return str;
}

function performApiTask(apiTask) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${API_KEY}`);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    let promise = fetch(`https://play.textspaced.com/api${apiTask}`, requestOptions);
    promise.then(result => console.log(result))
        .catch(error => {
            reject(error);
            // console.log('error', error)
        });

    return promise;
}


async function performAsync(action) {
    return (await performApiTask(action)).json()
}

async function performAsyncArray(action) {
    obj = await (await performApiTask(action)).json();
    entries = Object.entries(obj).map(([key, value]) => value);
    return entries;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function asJson(promise) {
    return (await promise).json();
}

function scheduleApiTask(apiTask, seconds) {
    apiTask = preprendSlash(apiTask);
    let cancelId;
    let promise = new Promise((resolve, reject) => {
        cancelId = setTimeout(() => {
            performApiTask(apiTask).then(response => resolve(response.json()));
        }, 1000 * seconds);
    });

    return {
        promise,
        cancelId
    }
}

/**
 * TODO FIND USECASE
 * @param {*} serviceConstant 
 * @param {*} delayInSeconds 
 * @returns 
 */
function useService(serviceConstant, delayInSeconds = 0) {
    apiEndpoint = `/service/?service_id=${serviceConstant.service_id}`;
    return scheduleApiTask(apiEndpoint, delayInSeconds);
}

function startTraining(skillId, delayInSeconds = 0) {
    apiEndpoint = `/action/sr_training/?skill_id=${skillId}`;
    return scheduleApiTask(apiEndpoint, delayInSeconds);
}

/**
 * 
 * @param localCommodity { body_id, commodity_id }
 * @param delayInSeconds 
 * @returns 
 */
function startMining(localCommodity, delayInSeconds = 0) {
    apiEndpoint = `/action/mining/start/?body_id=${localCommodity.body_id}&commodity_id=${localCommodity.commodity_id}`;
    return scheduleApiTask(apiEndpoint, delayInSeconds)
}

function stopMining(delayInSeconds = 0) {
    apiEndpoint = `/action/mining/stop/`;
    return scheduleApiTask(apiEndpoint, delayInSeconds)
}

function cargoSellAllCommodities(commodity_id, delayInSeconds = 0) {
    apiEndpoint = `/action/cargo/commodities/sell_all/?id_list=${commodity_id}`;
    return scheduleApiTask(apiEndpoint, delayInSeconds)
};

function relieveCrew(crew_id, ship_id, delayInSeconds = 0) {
    apiEndpoint = `/crew/relieve/?crew_id=${crew_id}&ship_id=${ship_id}`;
    return performApiTask(apiEndpoint, delayInSeconds);
}

function assignCrew(crew_id, ship_id, delayInSeconds = 0) {
    apiEndpoint = `/crew/assign/?crew_id=${crew_id}&ship_id=${ship_id}`;
    return performApiTask(apiEndpoint, delayInSeconds);
}

function getUser() {
    return performApiTask(`/user/`)
}

function casinoPlaySlots() {
    return performApiTask(`/casino/slots/`)
}

function switchShip(ship_id) {
    return performApiTask(`/action/switch_ship/?ship_id=${ship_id}`);
}

function transferCargoFromShip(commodity_id, quantity, ship_id) {
    return performApiTask(`/action/cargo/commodities/transfer/?commodity_id=${commodity_id}&quantity=${quantity}&ship_id=${ship_id}`);
}


async function getPrices() {
    systemCommodities = await performAsyncArray(`/system/commodities/`);
    
    // adrift ones
    // systemCommodities = toArray((await performAsync(`/location/`)).adrift_cargo.commodities).filter(sc => sc !== null);
    console.log(systemCommodities);
    

    pricePromisesPC = systemCommodities.map(async (sysCommo) => {
        const prices = await performAsyncArray(`/lookup/nearby/regions/prices/?commodity_id=${sysCommo.commodity_id}`);
        sysCommo.prices = prices;
        return prices.sort((b, a) => a.sell_price - b.sell_price);
        // console.log(prices.map(a => a.sell_price));
    });

    sortedPricesPC = await Promise.all(pricePromisesPC);

    systemCommodities.sort((b, a) => a.prices[0].sell_price - b.prices[0].sell_price);


    currLocation = (await performAsync(`/system/`)).position;

    console.log(systemCommodities);
    console.log(systemCommodities.map(sc => [sc.prices[0].sell_price, Math.min(Math.abs(sc.prices[0].start - currLocation), Math.abs(sc.prices[0].end - currLocation)), sc.commodity_name, sc.commodity_id]));
}

async function getPricesAdrift() {
    systemCommodities = await performAsyncArray(`/system/commodities/`);
    
    // adrift ones
    systemCommodities = toArray((await performAsync(`/location/`)).adrift_cargo.commodities).filter(sc => sc !== null);
    console.log(systemCommodities);
    

    pricePromisesPC = systemCommodities.map(async (sysCommo) => {
        const prices = await performAsyncArray(`/lookup/nearby/regions/prices/?commodity_id=${sysCommo.commodity_id}`);
        sysCommo.prices = prices;
        return prices.sort((b, a) => a.sell_price - b.sell_price);
        // console.log(prices.map(a => a.sell_price));
    });

    sortedPricesPC = await Promise.all(pricePromisesPC);

    systemCommodities.sort((b, a) => a.prices[0].sell_price - b.prices[0].sell_price);


    currLocation = (await performAsync(`/system/`)).position;

    console.log(systemCommodities);
    console.log(systemCommodities.map(sc => [sc.prices[0].sell_price, Math.min(Math.abs(sc.prices[0].start - currLocation), Math.abs(sc.prices[0].end - currLocation)), sc.commodity_name, sc.commodity_id]));
}

const SHIP_ID_HAULER_JUNIE = 178874;
const SHIP_ID_BARGE_SPAM_28 = 178997;
const SHIP_ID_BARGE_BIG_PAW = 178762;
const CREW_COMMANDER_GROSHIKOV_ID = 1239221;
const CREW_COMMANDER_MATZOVSKY_ID = 1254993;
const TRAINING_DURATION_SECONDS = 60 * 101; // 1h 40m = 100m
const CRAFT_SKILL_ID_MINING = 6;
const CRAFT_SKILL_ID_DEFENCE = 4;

const MINING_DURATION_SECS_MARCIE = 22380;

const COMMODITY_ARSENIC_ID = 33;
const COMMODITY_BORON_ID = 5;
const COMMODITY_CAESIUM_ID = 55;
const COMMODITY_YTTRIUM_ID = 39;

const SYSTEM_NOVA_COMMODITY_BORON = { body_id: 9315, commodity_id: 5 };
const SYSTEM_NOVA_COMMODITY_ARSENIC = { body_id: 9303, commodity_id: 33 };
const SYSTEM_ADAMA_COMMODITY_CAESIUM = { body_id: 9213, commodity_id: 55 };
const SYSTEM_MORESBY_COMMODITY_CAESIUM = {
    "commodity_id": 55,
    "body_id": 11885,
    "stock_amount": 11885,
    "commodity_remaining": 2184844,
    "commodity_maximum": 2185361,
    "commodity_name": "Caesium",
    "commodity_short_name": "Cs",
    "commodity_illegal": false,
    "commodity_rarity": 19,
    "commodity_category": 1,
    "commodity_sub_category": 1,
    "body_list": "Moresby 19",
    "computed": {
        "can_mine": true
    }
};

const SYSTEM_MORESBY_ID = 2404;
const SYSTEM_MORESBY_COMMODITY_LANTHANUM = {
    "commodity_id": 57,
    "body_id": 11877,
};

