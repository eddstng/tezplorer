<template>
  <v-app>
    <template>
      <!-- <Operations /> -->
      <template>
        <v-card color="basil">
          <v-card-title class="text-center justify-center py-6">
            <h1 class="font-weight-bold text-h2 basil--text">
              TEZPLORER
            </h1>
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
                <div v-if="item === 'all_ledgers'">
                  <Tokens />
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
// import Operations from './components/Operations';
import Tokens from './components/Tokens';
export default {
  components: {
    Tokens
  },
  data() {
    return {
      render: true,
      tab: null,
      items: ['Appetizers', 'Entrees', 'all_ledgers', 'Cocktails'],
      content: {
        Appetizers: '123123123123',
        Entrees: 'edddddd',
        Deserts: '23423424234234234234',
        Cocktails: '5k'
      },
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    };
  }
};
</script>
