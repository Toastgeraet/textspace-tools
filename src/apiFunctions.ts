import { useStorage } from "@vueuse/core";

const state = useStorage(
    'my-store',
    {} as any,
    localStorage,
    { mergeDefaults: true } // <--
)

function performApiTask(apiTask: any) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${state.value.apiKey}`);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    let promise = fetch(`https://play.textspaced.com/api${apiTask}`, requestOptions as any);
    promise.then(result => console.log(result))
        .catch(error => {
            console.log('error', error)
        });

    return promise;
}
async function performAsync(action: any) {
    return (await performApiTask(action)).json()
}
async function performAsyncArray(action: any) {
    const obj = await (await performApiTask(action)).json();
    const entries = Object.entries(obj).map(([key, value]) => value);
    return entries;
}
function toArray(obj: any) {
    return Object.entries(obj).map(([key, value]) => value);
}
async function getAdriftCommodities() {
    let adrift = [] as any;
    for (let page = 0; page < 3; page++) {
        adrift = [...adrift, ...toArray((await performAsync(`/location/?page=${page}`)).adrift_cargo.commodities).filter(sc => sc !== null)];
    }
    adrift.sort((a: any, b: any) => b.amount - a.amount);
    return adrift.map((a: any) => { a.prices = []; return a; });
}
async function addPrices(commodities: any[]) {

    const pricePromisesPC = commodities.map(async (sysCommo) => {
        const prices = await performAsyncArray(`/lookup/nearby/regions/prices/?commodity_id=${sysCommo.commodity_id}`);
        sysCommo.prices = prices;
        return prices.sort((b: any, a: any) => a.sell_price - b.sell_price);
    });

    const sortedPricesPC = await Promise.all(pricePromisesPC);

    commodities.sort((b, a) => a.prices[0].sell_price - b.prices[0].sell_price);

    const currLocation = (await performAsync(`/system/`)).position;

    console.log(commodities);
    console.log(commodities.map(sc => [sc.prices[0].sell_price, Math.min(Math.abs(sc.prices[0].start - currLocation), Math.abs(sc.prices[0].end - currLocation)), sc.commodity_name, sc.commodity_id]));
}

export { performApiTask, performAsync, toArray, getAdriftCommodities, addPrices };