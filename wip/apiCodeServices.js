const SERVICE_MINING_PERMITTED =
{
    faction_only: false,
    name: 'Mining Permitted',
    service_id: '0'
};
const SERVICE_TRADING_COMMODITIES =
{
    faction_only: false,
    name: 'Trading Commodities',
    service_id: '1'
};
const SERVICE_TRADING_PORTS = { faction_only: false, name: 'Trading Ports', service_id: '2' };
const SERVICE_PERSONAL = { faction_only: true, name: 'Personal', service_id: '3' };
const SERVICE_SHIP_TRANSPORT = { faction_only: false, name: 'Ship Transport', service_id: '4' };
const SERVICE_SHIP_REPAIR = { faction_only: false, name: 'Ship Repair', service_id: '5' };
const SERVICE_SHIP_TRADING = { faction_only: false, name: 'Ship Trading', service_id: '6' };
const SERVICE_CASINO = { faction_only: false, name: 'Casino', service_id: '8' };
const SERVICE_FACTION_DROP = { faction_only: true, name: 'Faction Drop', service_id: '9' };
const SERVICE_SHIP_REFUEL = { faction_only: false, name: 'Ship Refuel', service_id: '10' };
const SERVICE_TRADING_CONSUMABLES =
{
    faction_only: false,
    name: 'Trading Consumables',
    service_id: '11'
};
const SERVICE_AMENITY = { faction_only: false, name: 'Amenity', service_id: '13' };
const SERVICE_FACTION_PORT_CRAFTING =
{
    faction_only: true,
    name: 'Faction Port Crafting',
    service_id: '14'
};
const SERVICE_FACTION_STORAGE = { faction_only: true, name: 'Faction Storage', service_id: '15' };
const SERVICE_TRADING_PARTS = { faction_only: false, name: 'Trading Parts', service_id: '16' };
const SERVICE_FACTION_PORT_CUSTOMISATION =
{
    faction_only: true,
    name: 'Faction Port Customisation',
    service_id: '17'
};
const SERVICE_FACTION_TREASURY =
{
    faction_only: true,
    name: 'Faction Treasury',
    service_id: '18'
};
const SERVICE_TRADING_ILLEGAL_COMMODITIES =
{
    faction_only: false,
    name: 'Trading Illegal Commodities',
    service_id: '19'
};
const SERVICE_TRADING_ILLEGAL_PORTS =
{
    faction_only: false,
    name: 'Trading Illegal Ports',
    service_id: '20'
};
const SERVICE_FACTION_SHIP_CRAFTING =
{
    faction_only: true,
    name: 'Faction Ship Crafting',
    service_id: '21'
};
const SERVICE_FACTION_FABRICATION =
{
    faction_only: true,
    name: 'Faction Fabrication',
    service_id: '22'
};
const SERVICE_CREW_HIRING = { faction_only: false, name: 'Crew Hiring', service_id: '23' };
const SERVICE_FIGHTER_WING = { faction_only: true, name: 'Fighter Wing', service_id: '24' };
const SERVICE_WORMHOLE_TRAVEL =
{
    faction_only: false,
    name: 'Wormhole Travel',
    service_id: '25'
};
const SERVICE_TRIBUTE = { faction_only: false, name: 'Tribute', service_id: '26' };
const SERVICE_PORT_FITTING = { faction_only: false, name: 'Port Fitting', service_id: '27' };
const SERVICE_AMENITY_ILLEGAL =
{
    faction_only: false,
    name: 'Amenity Illegal',
    service_id: '29'
};
const SERVICE_SHIP_ROOM_FITTING =
{
    faction_only: false,
    name: 'Ship Room Fitting',
    service_id: '30'
};
const SERVICE_DATA_MINING = { faction_only: false, name: 'Data Mining', service_id: '31' };
const SERVICE_TRAINING = { faction_only: false, name: 'Training', service_id: '32' };
const SERVICE_MEDITATION = { faction_only: true, name: 'Meditation', service_id: '33' };
const SERVICE_TRAVELLING_MERCHANT =
{
    faction_only: false,
    name: 'Travelling Merchant',
    service_id: '34'
};
const SERVICE_FORGE = { faction_only: false, name: 'Forge', service_id: '35' };
const SERVICE_SHIP_TRADING_ADVANCED =
{
    faction_only: false,
    name: 'Ship Trading Advanced',
    service_id: '36'
};
const SERVICE_TRADING_COMPANIONS =
{
    faction_only: false,
    name: 'Trading Companions',
    service_id: '37'
}

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
            console.log('error', error)
        });

    return promise;
}

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

function switchShip(ship_id) {
    return performApiTask(`/action/switch_ship/?ship_id=${ship_id}`);
}

function transferCargoFromShip(commodity_id, quantity, ship_id) {
    return performApiTask(`/action/cargo/commodities/transfer/?commodity_id=${commodity_id}&quantity=${quantity}&ship_id=${ship_id}`);
}

const SHIP_ID_HAULER_JUNIE = 178874;
const SHIP_ID_BARGE_SPAM_28 = 178997;
const SHIP_ID_BARGE_BIG_PAW = 178762;
const CREW_COMMANDER_GROSHIKOV_ID = 1239221;
const CREW_COMMANDER_MATZOVSKY_ID = 1254993;
const TRAINING_DURATION_SECONDS = 60 * 101; // 1h 40m = 100m
const MINING_CRAFT_SKILL_ID = 6;

const MINING_DURATION_SECS_MARCIE = 22380;

const COMMODITY_ARSENIC_ID = 33;
const COMMODITY_BORON_ID = 5;
const COMMODITY_CAESIUM_ID = 55;
const COMMODITY_YTTRIUM_ID = 39;

const SYSTEM_NOVA_COMMODITY_BORON = { body_id: 9315, commodity_id: 5 };
const SYSTEM_NOVA_COMMODITY_ARSENIC = { body_id: 9303, commodity_id: 33 };
const SYSTEM_ADAMA_COMMODITY_CAESIUM = { body_id: 9213, commodity_id: 55 };