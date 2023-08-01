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
function toArray(obj: any) {
    return Object.entries(obj).map(([key, value]) => value);
}
async function getAdriftCommodities() {
    let adrift = [] as any;
    for (let page = 0; page < 10; page++) {
        adrift = [...adrift, ...toArray((await performAsync(`/location/?page=${page}`)).adrift_cargo.commodities).filter(sc => sc !== null)];
    }
    adrift.sort((a: any, b: any) => b.amount - a.amount);
    return adrift;
}

export { performApiTask, performAsync, toArray, getAdriftCommodities };