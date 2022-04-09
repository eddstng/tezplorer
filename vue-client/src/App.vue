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
        <v-card color="basil" height="100vh">
          <v-card-title class="text-center justify-center py-6">
            <h1 class="font-weight-bold text-h2 basil--text">
              TEZPL<img
                class=""
                src="./images/tezmarine.png"
                height="75px"
              />RER
            </h1>
          </v-card-title>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab v-for="item in this.$store.state.tabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in this.$store.state.tabs" :key="item">
              <v-card color="basil" flat>
                <div v-if="item === 'subscription'">
                  <Subscription />
                </div>
                <div v-if="item === 'recent_ledgers'">
                  <Ledgers />
                </div>
                <div v-if="item === 'big_fish'">
                  <Bigfish />
                </div>
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
    mounted() {
    this.$root.$on('changeTabToSubscription', () => {
      return this.tab = 'subscription';
    });
  },
  data() {
    return {
      render: true,
      tab: null,
    };
  }
};
</script>
