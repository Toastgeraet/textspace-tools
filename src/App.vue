<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

const drawer = ref(false);

const state = useStorage(
    'my-store',
    { apiKey: '', },
    localStorage,
    { mergeDefaults: true } // <--
)

const system = ref({
    adriftCommodities: [
        {
            name: "Selenium",
            amount: 11300257,
        },
        {
            name: "Potassium",
            amount: 4086440,
        },
    ]
})

const selectedCommodity = ref(null);
function selectCommodity(commodity) {
    selectedCommodity.value = commodity;
}
function commodityStyle(commodity) {
    return commodity.name === selectedCommodity.value?.name ? "highlighted" : "";
}

</script>

<template>
    <v-card>
        <v-layout>

            <v-app-bar color="primary" prominent>
                <!-- <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
                <v-toolbar-title>Textspaced Quick UI</v-toolbar-title>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" location="bottom" temporary>
                <v-list :items="items"></v-list>
            </v-navigation-drawer>

            <v-main class="h-screen">

                <div class="d-flex justify-center">
                    <div class="flex-column">
                        <v-card-text>
                            Please enter your API key to get started. You need to be a patron to have access to an API key.
                        </v-card-text>
                        
                        <v-text-field label="API key" v-model="state.apiKey"></v-text-field>

                        <v-card>
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
                                            <th class="text-left">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr @click="selectCommodity(comm)" :class="commodityStyle(comm)"
                                            v-for="comm in system.adriftCommodities" :key="comm.name">
                                            <td>{{ comm.name }}</td>
                                            <td>{{ comm.amount }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </template>
                        </v-card>
                    </div>
                </div>

            </v-main>
        </v-layout>
    </v-card>

    <!-- <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav> -->

    <!-- <RouterView /> -->
</template>

<style scoped>
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
