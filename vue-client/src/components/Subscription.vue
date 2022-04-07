<template>
  <div>
    <div>
      <p class="text-center mt-5 mb-0">SUBSCRIPTION LEDGERS</p>
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
              <span class="mx-auto">SUBSCRIPTION FILTERS</span>
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
            <h3 class="ml-6 mb-2">Operation Kind</h3>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              :disabled="true"
              v-model="delegationSubscription"
            />
            <label> Delegation</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              :disabled="true"
              v-model="endorsementSubscription"
            />
            <label> Endorsement</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              :disabled="true"
              v-model="originationSubscription"
            />
            <label> Origination</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              :disabled="true"
              v-model="revealSubscription"
            />
            <label> Reveal</label>
            <br />
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="transactionSubscription"
            />
            <label> Transaction</label>
            <br />
            <br />
            <h3 class="ml-6">Replay</h3>
            <p class="ml-6">(subscribe n blocks before current head)</p>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay25"
              v-on:click="setReplayFromBlockLevel(replay25)"
            />
            <label> 25</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay25"
              v-on:click="setReplayFromBlockLevel(replay25)"
            />
            <label> 25</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay50"
              v-on:click="setReplayFromBlockLevel(replay50)"
            />
            <label> 50</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay75"
              v-on:click="setReplayFromBlockLevel(replay75)"
            />
            <label> 75</label>
            <input
              class="ml-7 mb-2"
              type="checkbox"
              v-model="replay100"
              v-on:click="setReplayFromBlockLevel(replay100)"
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
      <div v-if="loading" align="center">
        <br />
        <br />
        <v-progress-circular
          :size="600"
          :width="7"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card
        v-for="(operation, index) in subscriptionResults"
        v-bind:key="index"
        class="mx-auto mt-1"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-system-bar height="50px" dark color="primary">
              <v-spacer> {{ operation.transactionAdded.block.hash }}</v-spacer>
              <v-spacer></v-spacer>
              <span>{{ operation.transactionAdded.block.header.level }}</span>
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
                index) in operation.transactionAdded"
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

<style scoped></style>
<script>
import { SubscriptionClient } from 'graphql-subscriptions-client';

export default {
  data() {
    return {
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
      transactionSubscription: true
    };
  },
  methods: {
    testfunc(data) {
      this.loading = false;
      this.subscriptionResults.push(data);
    },
    setReplayFromBlockLevel(replayBlockLevelChoice) {
      this.replay25 = false;
      this.replay50 = false;
      this.replay75 = false;
      this.replay100 = false;
      this[replayBlockLevelChoice] = true;
    },
    async subscribeToGraphQLAccountTransactions(addressString) {
      this.loading = true;
      console.log('here');
      // get ready
      const GRAPHQL_ENDPOINT = 'wss://mainnet.tezgraph.tez.ie/graphql';
      console.log('her2');

      const query = `
      subscription {
        transactionAdded(
          filter: {
            or: [
              { destination: { equalTo: "${addressString}" } }
              { source: { equalTo: "${addressString}" } }
            ]
          }
        ) {
          origin
          source
          destination
          amount
          block {
            header {
              level
              timestamp
            }
            hash
          }
          metadata {
            balance_updates {
              kind
              change
              origin
              contract
              category
              delegate
              cycle
            }
            internal_operation_results {
              kind
              source
              nonce
              result {
                status
                consumed_gas
                consumed_milligas
                errors
              }
            }
            operation_result {
              balance_updates {
                kind
                change
                origin
                contract
                category
                delegate
                cycle
              }
              originated_contracts
              storage_size
              paid_storage_size_diff
              big_map_diff {
                action
              }
              lazy_storage_diff {
                kind
                id
              }
              status
              consumed_gas
              consumed_milligas
              errors
              storage
              allocated_destination_contract
            }
          }
        }
      }
    `;

      // set up the client, which can be reused
      console.log('here3');

      const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: error => {
          error && console.error(error);
        }
      });

      // make the actual request
      client.request({ query });

      console.log('here5');

      // the above doesn't do much though

      const testfunc = this.testfunc;
      // call subscription.unsubscribe() later to clean up
      this.subscription = client
        .request({ query })
        // so lets actually do something with the response
        .subscribe({
          next({ data }) {
            if (data) {
              testfunc(data);
              console.log(JSON.stringify(data));
            }
          }
        });
    }
  }
};
</script>
