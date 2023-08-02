<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { Ref } from 'vue';
import { reactive } from 'vue';
import { addPrices, getAdriftCommodities, performAsync } from './apiFunctions';

const dialog = ref(false);

const state = useStorage(
    'my-store',
    { apiKey: '', },
    localStorage,
    { mergeDefaults: true } // <--
)

const hold_remaining = ref(0);

function isMobile() {
    return window.innerWidth < 700;
}

const system = reactive({
    adriftCommodities: [] as any
})

const selectedCommodity: Ref<any> = ref(null);
function selectCommodity(commodity: any) {
    selectedCommodity.value = commodity;
}
function commodityStyle(commodity: any) {
    return commodity.commodity_name === selectedCommodity.value?.commodity_name ? "highlighted" : "";
}

async function remainingHold(){
    return (await performAsync(`/status/hold/`)).hold_remaining;
}

async function recoverAndShipIt(commodity: any) {
    await performAsync(`/action/cargo/commodities/recover/?commodity_id=${commodity.commodity_id}&quantity=${hold_remaining.value}`);
    await performAsync(`/action/ftl/?system_id=${2413}`);
    await performAsync(`/action/cargo/commodities/sell_all/?id_list=${commodity.commodity_id}`);
    await performAsync(`/action/ftl/?system_id=${2412}`);
}

(async () => {
    const adriftCommodities = (await getAdriftCommodities() as any);
    await addPrices(adriftCommodities);
    hold_remaining.value = await remainingHold();
    system.adriftCommodities = adriftCommodities;
})();

</script>

<template>
    <v-layout>
        <v-app-bar color="primary" prominent>
            <!-- <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
            <v-toolbar-title>Textspaced Quick UI</v-toolbar-title>
        </v-app-bar>

        <v-main class="h-screen">

            <div class="d-flex justify-center">
                <div class="flex-column">
                    <v-card class="mt-2">
                        <v-card-text>
                            Please enter your API key to get started. You need to be a patron to have access to an API key.
                            <v-text-field class="mt-2" label="API key" v-model="state.apiKey"></v-text-field>
                        </v-card-text>
                    </v-card>

                    <v-card class="mt-2">
                        <template v-slot:title>
                            Commodities
                        </template>

                        <template v-slot:subtitle>
                            Adrift commodities (ready for recovery)
                        </template>

                        <template v-slot:text>
                            <v-table fixed-header density="compact" class="h-100">
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            Name
                                        </th>
                                        <th class="text-right">
                                            Amount
                                        </th>
                                        <th class="text-right">
                                            Best Price (This region)
                                        </th>
                                        <th class="text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="selectCommodity(comm)" :class="commodityStyle(comm)"
                                        v-for="comm in system.adriftCommodities" :key="comm.name">
                                        <td>{{ comm.commodity_name }}</td>
                                        <td class="text-right">{{ comm.amount.toLocaleString() }}</td>
                                        <td class="text-right">{{ comm.prices[0]?.sell_price.toLocaleString() }} ({{
                                            comm.prices.find((p: any) => p.current)?.sell_price.toLocaleString() }})</td>
                                        <td class="text-center"><v-icon icon="mdi-dots-vertical"
                                                @click="dialog = true"></v-icon></td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </template>
                    </v-card>


                    <v-dialog v-model="dialog" :fullscreen="isMobile()" transition="dialog-bottom-transition" width="auto">
                        <v-card>
                            <v-card-text>
                                Pick up {Amount} units of <strong>{{ selectedCommodity.commodity_name
                                }}</strong> and ship it to sell: <span><v-text-field label="Amount" :value="hold_remaining"></v-text-field></span>
                                <v-text-field label="Target system id" value="2413"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="text" @click="recoverAndShipIt(selectedCommodity)">Ship
                                    (FTL)</v-btn>
                                <v-btn color="primary" variant="text" @click="dialog = false">Cancel</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </div>

        </v-main>
    </v-layout>

    <!-- <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav> -->

    <!-- <RouterView /> -->
</template>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform .2s ease-in-out;
}

tbody tr:hover,
.highlighted {
    background-color: #e91e63;
    cursor: pointer;
}

header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
