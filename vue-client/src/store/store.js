import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    subscriptionAddress: "",
    focusedTab: "subscription",
    tabs: ['subscription', 'recent_ledgers', 'big_fish'],
  },
  mutations: {
    setSubscriptionAddress(state, subscriptionAddress) {
      state.subscriptionAddress = subscriptionAddress;
    },
    setFocusedTab(state, focusedTab) {
      state.focusedTab = focusedTab;
    },
  },
  getters: {
  },
});
