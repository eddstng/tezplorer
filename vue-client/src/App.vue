<template>
  <v-app>
    <template>
      <template>
        <div>
          <v-system-bar dark color="primary">
            <span>TEZPLORER </span>
            <v-spacer></v-spacer>
            <span>12:30</span>
          </v-system-bar>
          <br />
        </div>
        <v-card color="basil">
          <v-card-title class="text-center justify-center py-6">
                  
            <h1 class="font-weight-bold text-h2 basil--text">TEZPL<img class="" src="./images/tezmarine.png" height="75px">RER</h1>
          </v-card-title>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
              <v-card color="basil" flat>
                <div v-if="item === 'subscription'">
                  <Subscription />
                </div>
                <div v-if="item === 'all_ledgers'">
                  <Ledgers />
                </div>
                <div v-if="item === '🐟'">
                  <Bigfish />
                </div>
                <v-card-text>{{ content[item] }}</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </template>
  </v-app>
</template>

<script>
import Ledgers from './components/Ledgers';
import Subscription from './components/Subscription';
import Bigfish from './components/Bigfish';
export default {
  components: {
    Ledgers,
    Subscription,
    Bigfish
  },
  data() {
    return {
      render: true,
      tab: null,
      items: ['subscription', 'Entrees', 'all_ledgers', '🐟'],
      content: {
        Entrees: 'edddddd',
        Deserts: '23423424234234234234'
      }
    };
  }
};
</script>
