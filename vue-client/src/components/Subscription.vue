<template>
  <div>
    <div>
      <p class="text-center mt-5 mb-0">SUBSCRIPTION</p>
    </div>
    <v-card height="100%" tile>
      <div>
        <v-card
          width="350px"
          style="position: fixed"
          class="mx-auto mt-9 float-left"
        >
          <v-container class="px-0" fluid>
            <v-system-bar height="50px" dark color="primary">
              <span class="mx-auto">SUBSCRIPTION</span>
              <br />
            </v-system-bar>
            <v-text-field
              class="ml-3 mr-3"
              v-model="tezosAccountAddress"
              :counter="36"
              label="Tezos Account Address"
              required
            ></v-text-field>
            <br />
            <h3 class="text-center mb-2">Operation Kind</h3>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="delegationSubscription"
              v-on:click="setSubscriptionOperationKind('delegationAdded')"
            />
            <label> Delegation</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="endorsementSubscription"
              v-on:click="setSubscriptionOperationKind('endorsementAdded')"
            />
            <label> Endorsement</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="originationSubscription"
              v-on:click="setSubscriptionOperationKind('originationAdded')"
            />
            <label> Origination</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="revealSubscription"
              v-on:click="setSubscriptionOperationKind('revealAdded')"
            />
            <label> Reveal</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="transactionSubscription"
              v-on:click="setSubscriptionOperationKind('transactionAdded')"
            />
            <label> Transaction</label>
            <br />
            <br />
            <h3 class="text-center">Replay</h3>
            <p class="text-center">(subscribe n blocks before current head)</p>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay0"
              v-on:click="setReplayFromLevelBoolean(replay0)"
            />
            <label> 0</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay25"
              v-on:click="setReplayFromLevelBoolean(replay25)"
            />
            <label> 25</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay50"
              v-on:click="setReplayFromLevelBoolean(replay50)"
            />
            <label> 50</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay75"
              v-on:click="setReplayFromLevelBoolean(replay75)"
            />
            <label> 75</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay100"
              v-on:click="setReplayFromLevelBoolean(replay100)"
            />
            <label> 100</label>
            <br />
            <br />
            <v-btn
              class="ml-15  "
              width="200px"
              v-on:click="
                subscribeToGraphQLAccountTransactions(tezosAccountAddress)
              "
            >
              Subscribe
            </v-btn>
            <br />
            <br />

            <v-btn
              class="ml-15  "
              width="200px"
              v-on:click="
                unsubscribeToGraphQLAccountTransactions(tezosAccountAddress)
              "
            >
              Unsubscribe
            </v-btn>
            <br />
          </v-container>
          <v-card-actions> </v-card-actions>
        </v-card>
      </div>
      <v-alert
        v-if="newResultsAlert"
        class="mx-auto text-center mt-6"
        max-width="800px"
        height="100px"
        type="info"
      >
        <div>
          <h4 class="one">
            NEW SUBSCRIPTION RESULTS
          </h4>
          <img class="mt-2 ml-7" src="../images/lighthouse.png" height="60px" />
        </div>
      </v-alert>
      <v-alert
        v-if="subscribedToAlert"
        class="mx-auto text-center mt-6"
        max-width="800px"
        height="100px"
        type="info"
      >
        <div>
          <h4 class="two">
            SUBSCRIBED TO <br />
            {{ this.$store.state.subscriptionAddress }}
          </h4>
        </div>
      </v-alert>
      <v-alert
        v-if="unsubscribedAlert"
        class="mx-auto text-center mt-6"
        max-width="800px"
        height="100px"
        type="info"
      >
        <div>
          <h4 class="three">
            UNSUBSCRIBED
          </h4>
        </div>
      </v-alert>
      <div v-if="loading" align="center">
        <br />
        <br />
        <br />
        <v-progress-circular
          :size="600"
          :width="7"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card
        v-for="(operation, index) in subscriptionResults.slice().reverse()"
        v-bind:key="index"
        class="mx-auto mt-1"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-system-bar height="50px" dark color="primary">
              <v-spacer> {{ operation[subscriptionType].block.hash }}</v-spacer>
              <v-spacer></v-spacer>
              <img
                v-if="
                  Date.now() -
                    new Date(
                      operation[subscriptionType].block.header.timestamp
                    ) <
                    15000 && flashingIcon
                "
                src="../images/new.png"
                height="80px"
              />

              <span>{{ operation[subscriptionType].block.header.level }}</span>
              <br />
            </v-system-bar>
            <div
              class="text-overline ml-2 mt-5"
              v-on:click="
                operationDetailsDialog = false;
                operationDetailsDialog = true;
                tokenBigmapDetails = operation;
              "
            >
              <div
                v-for="(subscriptionResultValue,
                subscriptionResultKey,
                index) in operation[subscriptionType]"
                v-bind:key="index"
                class="text-overline"
              >
                <h3>{{ subscriptionResultKey }}</h3>
                <div
                  v-if="
                    typeof subscriptionResultValue === 'object' &&
                      subscriptionResultValue !== null
                  "
                >
                  <div
                    v-for="(nestedSubscriptionResultValue,
                    nestedSubscriptionResultKey,
                    index) in subscriptionResultValue"
                    v-bind:key="index"
                    class="text-overline"
                  >
                    <div
                      v-if="
                        typeof nestedSubscriptionResultValue === 'object' &&
                          nestedSubscriptionResultValue !== null
                      "
                    >
                      <h4>{{ nestedSubscriptionResultKey }}</h4>
                      <div
                        v-for="(nestedNestedSubscriptionResultValue,
                        nestedNestedSubscriptionResultKey,
                        index) in nestedSubscriptionResultValue"
                        v-bind:key="index"
                        class="text-overline"
                      >
                        <h5>{{ nestedNestedSubscriptionResultKey }}</h5>
                        <p>
                          {{
                            nestedNestedSubscriptionResultValue === null
                              ? 'null'
                              : nestedNestedSubscriptionResultValue
                          }}
                        </p>
                      </div>
                    </div>
                    <div v-else>
                      <h5>{{ nestedSubscriptionResultKey }}</h5>
                      <p>
                        {{
                          nestedSubscriptionResultValue === null
                            ? 'null'
                            : nestedSubscriptionResultValue
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>
                    {{
                      subscriptionResultValue === null
                        ? 'null'
                        : subscriptionResultValue
                    }}
                  </p>
                </div>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-card>
  </div>
</template>

<style scoped>
.one {
  margin-top: 3%;
  margin-left: 29%;
  float: left;
}
.two {
  margin-top: 2%;
  margin-left: 19%;
  float: left;
}
.three {
  margin-top: 3%;
  margin-left: 37%;
  float: left;
}
</style>
<script>
import { SubscriptionClient } from 'graphql-subscriptions-client';
import axios from 'axios';

export default {
  mounted() {
    this.$root.$on('subscribeToGraphQLAccountTransactions', () => {
      return this.subscribeToGraphQLAccountTransactions(
        this.$store.state.subscriptionAddress
      );
    });
  },
  data() {
    return {
      newResultsAlert: false,
      subscribedToAlert: false,
      unsubscribedAlert: false,
      flashingIcon: false,
      subscriptionClient: null,
      replay0: true,
      replay25: false,
      replay50: false,
      replay75: false,
      replay100: false,
      loading: false,
      subscription: null,
      subscriptionResults: [],
      tezosAccountAddress: '',
      contractMetadataQueryBoolean: false,
      delegationSubscription: false,
      endorsementSubscription: false,
      originationSubscription: false,
      revealSubscription: false,
      transactionSubscription: true,
      subscriptionType: 'transactionAdded'
    };
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    },
    async pushDataToSubscriptionResults(data) {
      this.loading = false;
      this.flashingIcon = true;
      this.subscribedToAlert = false;
      this.unsubscribedAlert = false;
      this.newResultsAlert = true;
      this.subscriptionResults.push(data);
      await this.sleep(1000);
      this.flashingIcon = false;
      await this.sleep(500);
      this.flashingIcon = true;
      await this.sleep(1000);
      this.flashingIcon = false;
      await this.sleep(500);
      this.flashingIcon = true;
      await this.sleep(10000);
      this.flashingIcon = false;
      this.newResultsAlert = false;
      if (this.subscription !== null) {
        this.subscribedToAlert = true;
      }
    },
    setReplayFromLevelBoolean(desiredReplayBlockLevel) {
      this.replay0 = false;
      this.replay25 = false;
      this.replay50 = false;
      this.replay75 = false;
      this.replay100 = false;
      this[desiredReplayBlockLevel] = true;
    },
    setSubscriptionOperationKind(subscriptionOperationKind) {
      this.delegationSubscription = false;
      this.endorsementSubscription = false;
      this.originationSubscription = false;
      this.revealSubscription = false;
      this.transactionSubscription = false;
      this[subscriptionOperationKind] = true;
      this.subscriptionType = subscriptionOperationKind;
    },
    async getReplayFromLevelArgument() {
      const res = await axios.get(`https://api.tzkt.io/v1/head`);
      if (!res) {
        throw new Error('Error');
      }
      switch (true) {
        case this.replay25:
          return `replayFromBlockLevel: ${res.data.level - 25}`;
        case this.replay50:
          return `replayFromBlockLevel: ${res.data.level - 50}`;
        case this.replay75:
          return `replayFromBlockLevel: ${res.data.level - 75}`;
        case this.replay100:
          return `replayFromBlockLevel: ${res.data.level - 100}`;
        default:
          return '';
      }
    },
    unsubscribeToGraphQLAccountTransactions() {
      if (this.subscription !== null) {
        this.subscription.unsubscribe();
      }
      this.newResultsAlert = false;
      this.subscribedToAlert = false;
      this.unsubscribedAlert = true;
      this.subscription = null;
      this.loading = false;
      return;
    },
    async subscribeToGraphQLAccountTransactions(addressString) {
      if (addressString === "") {
        return
      }
      this.unsubscribeToGraphQLAccountTransactions();
      this.unsubscribedAlert = false;
      this.loading = true;
      this.$store.commit('setSubscriptionAddress', addressString);
      this.tezosAccountAddress = addressString;
      const replayFromLevelArgument = await this.getReplayFromLevelArgument();
      this.loading = true;
      const GRAPHQL_ENDPOINT = 'wss://mainnet.tezgraph.tez.ie/graphql';
      const transactionSubscriptionQuery = `transactionAdded(          ${replayFromLevelArgument}          filter: {        or: [          { destination: { equalTo: "${addressString}" } }          { source: { equalTo: "${addressString}" } }        ]      }        ) {          origin          source          destination          amount          block {            header {              level              timestamp            }            hash          }          metadata {            balance_updates {              kind              change              origin              contract              category              delegate              cycle            }            internal_operation_results {              kind              source              nonce              result {                status                consumed_gas                consumed_milligas                errors              }            }            operation_result {              balance_updates {                kind                change                origin                contract                category                delegate                cycle              }              originated_contracts              storage_size              paid_storage_size_diff              big_map_diff {                action              }              lazy_storage_diff {                kind                id              }              status              consumed_gas              consumed_milligas              errors              storage              allocated_destination_contract            }          }        }`;
      const originationSubscriptionQuery = `originationAdded(    ${replayFromLevelArgument}       filter: {      source: {equalTo: "${addressString}"}    }  ) {    kind    block {      header {        level        timestamp      }      hash    }    metadata {      balance_updates {        kind        change        origin        contract        category        delegate        cycle      }      internal_operation_results {        kind        source        nonce        result {          status          consumed_gas          consumed_milligas          errors        }      }      operation_result {        balance_updates {          kind          change          origin          contract          category          delegate          cycle        }        originated_contracts        storage_size        paid_storage_size_diff        big_map_diff {          action        }        lazy_storage_diff {          kind          id        }        status        consumed_gas        consumed_milligas        errors      }    }  }`;
      const endorsementSubscriptionQuery = `endorsementAdded(    ${replayFromLevelArgument}    filter: { delegate: { equalTo: "${addressString}" } }  ) {    kind    block {      header {        level        payload_hash        timestamp      }      hash    }    origin    metadata {      balance_updates {        kind        change        origin        contract        category        delegate        cycle      }      slots      delegate      endorsement_power    }    level    slot    round    block_payload_hash  }`
      const revealSubscriptionQuery = ` revealAdded(   ${replayFromLevelArgument}     filter: { source: { equalTo: "${addressString}" } }  ) {    origin    source    fee    counter    gas_limit    storage_limit    source    public_key    block {      header {        level        timestamp      }      hash    }    metadata {      balance_updates {        kind        change        origin        contract        category        delegate        cycle      }      internal_operation_results {        kind        source        nonce        result {          status          consumed_gas          consumed_milligas          errors        }      }      operation_result {        status        consumed_gas        consumed_milligas        errors      }    }  }`
      const delegationSubscriptionQuery = `  delegationAdded(    ${replayFromLevelArgument}    filter: { source: { equalTo: "${addressString}" } }  ) {    kind    origin    fee    counter    gas_limit    storage_limit    source    delegate    block {      header {        level        timestamp      }      hash    }    metadata {      balance_updates {        kind        change        origin        contract        category        delegate        cycle      }      operation_result {        status        consumed_gas        consumed_milligas        errors      }      internal_operation_results {        kind        source        nonce        result {          status          consumed_gas          consumed_milligas          errors        }      }    }  }`
      const query = `
      subscription {
        ${this.transactionSubscription ? transactionSubscriptionQuery : ''}
        ${this.originationSubscription ? originationSubscriptionQuery : ''}
        ${this.endorsementSubscription ? endorsementSubscriptionQuery : ''}
        ${this.revealSubscription ? revealSubscriptionQuery : ''}
        ${this.delegationSubscription ? delegationSubscriptionQuery : ''}
      }
      `;

      const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: error => {
          error && console.error(error);
        }
      });

      client.request({ query });
      const pushDataToSubscriptionResults = this.pushDataToSubscriptionResults;
      this.newResultsAlert = false;
      this.unsubscribedAlert = false;
      this.subscribedToAlert = true;
      this.subscription = client.request({ query }).subscribe({
        next({ data }) {
          if (data) {
            pushDataToSubscriptionResults(data);
          }
        }
      });
    }
  }
};
</script>
