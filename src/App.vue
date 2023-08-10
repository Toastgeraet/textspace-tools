<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import type { Ref } from 'vue';
import { reactive } from 'vue';
import { addPrices, getAdriftCommodities, performAsync } from './apiFunctions';
import { computed } from 'vue';

const dialog = ref(false);

const hidePassword = ref(true);

const state = useStorage(
    'my-store',
    {
        apiKey: '',
        current_system: 2412, // laurin
        target_system: 0,
        target_volume: 0,
        ship: {
            current_charge: 0,
            range: 0,
        },
        hold: {
            hold_remaining: 0,
            hold_size: 0
        }
    },
    localStorage,
    { mergeDefaults: true } // <--
)

state.value.current_system = 2412;
updateShipStatus();

function isMobile() {
    return window.innerWidth < 700;
}

const ftlChargePercentage = computed(() => {
    return (state.value.ship.current_charge / state.value.ship.range) * 100;
})

async function updateShipStatus() {
    const ship = await performAsync(`/status/ship/`);
    state.value.ship.current_charge = ship.current_charge;
    state.value.ship.range = ship.range;
}

async function refuelShip() {
    const status = await performAsync(`/status/ship/`);
    const fuelMissing = status.max_fuel - status.current_fuel;
    await performAsync(`/action/refuel/?quantity=${fuelMissing}`);
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

async function updateHoldStatus() {
    const hold = (await performAsync(`/status/hold/`));
    state.value.hold.hold_remaining = hold.hold_remaining;
    state.value.hold.hold_size = hold.hold_size;
}

async function openDialog() {
    dialog.value = true;
    await updateHoldStatus();
    state.value.target_volume = state.value.hold.hold_remaining;
}

async function recoverAndShipIt(commodity: any) {
    await performAsync(`/action/cargo/commodities/recover/?commodity_id=${commodity.commodity_id}&quantity=${state.value.target_volume}`);
    await performAsync(`/action/ftl/?system_id=${state.value.target_system}`);
    await performAsync(`/action/cargo/commodities/sell_all/?id_list=${commodity.commodity_id}`);
    await refuelShip();
    await performAsync(`/action/ftl/?system_id=${state.value.current_system}`); // return trip
    await updateShipStatus();
}

(async () => {
    const adriftCommodities = (await getAdriftCommodities() as any);
    await addPrices(adriftCommodities);
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
                            <v-text-field class="mt-2" label="API key" v-model="state.apiKey"
                                :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="() => (hidePassword = !hidePassword)"
                                :type="hidePassword ? 'password' : 'text'">
                            </v-text-field>
                        </v-card-text>
                    </v-card>

                    <v-card class="mt-2">
                        <template v-slot:title>
                            Ship
                        </template>
                        <template v-slot:text>                            
                            <h3 class="mb-2">FTL Charge</h3>
                            <v-progress-linear v-model="state.ship.current_charge" color="light-blue" striped height="25">
                                <template v-slot:default="{ value }">
                                    <strong>{{ Math.ceil(value) }} LYs</strong>
                                </template>
                            </v-progress-linear>
                        </template>

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
                                                @click="openDialog"></v-icon></td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </template>
                    </v-card>


                    <v-dialog v-model="dialog" :fullscreen="isMobile()" transition="dialog-bottom-transition" width="auto">
                        <v-card>
                            <v-card-text>
                                Pick up {Amount} units of <strong>{{ selectedCommodity.commodity_name
                                }}</strong> and ship it to sell: <span><v-text-field label="Amount"
                                        v-model="state.target_volume"></v-text-field></span>
                                <v-text-field label="Target system id" v-model="state.target_system"></v-text-field>
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
