<template>
  <div>
    <div>
      <p class="text-center mt-5">SUBSCRIPTION LEDGERS</p>
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
            <br />
            <v-text-field
              class="ml-3 mr-3"
              v-model="tezosAccountAddress"
              :counter="10"
              label="Tezos Account Address"
              required
            ></v-text-field>

            <br />

            <input
              class="ml-3 mb-3"
              type="checkbox"
              v-model="delegationSubscription"
            />
            <label> Delegation</label>

            <br />
            <input
              class="ml-3 mb-3"
              type="checkbox"
              v-model="endorsementSubscription"
            />
            <label> Endorsement</label>
            <br />

            <input
              class="ml-3 mb-3"
              type="checkbox"
              v-model="originationSubscription"
            />
            <label> Origination</label>
            <br />

            <input
              class="ml-3 mb-3"
              type="checkbox"
              v-model="revealSubscription"
            />
            <label> Reveal</label>
            <br />
            <input
              class="ml-3 mb-3"
              type="checkbox"
              v-model="transactionSubscription"
            />
            <label> Transaction</label>
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
        v-for="operation in subscriptionResults"
        v-bind:key="operation.id"
        class="mx-auto mt-1"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-system-bar height="50px" dark color="primary">
              <v-spacer>
                {{ operation.transactionAdded.block.hash }}</v-spacer
              >

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
            v-for="(tokenBigmapDetailValue,
            tokenBigmapDetailKey) in operation.transactionAdded"
            v-bind:key="tokenBigmapDetailKey"
            class="text-overline"
          >
            <p>
              --------------------------------------------------------------------
            </p>

            <h3>{{ tokenBigmapDetailKey }}</h3>
            <div
              v-if="
                typeof tokenBigmapDetailValue === 'object' &&
                  tokenBigmapDetailValue !== null
              "
            >
              <div
                v-for="(nestedTokenObjectValue,
                nestedTokenObjectKey) in tokenBigmapDetailValue"
                v-bind:key="nestedTokenObjectValue"
                class="text-overline"
              >
                <div
                  v-if="
                    typeof nestedTokenObjectValue === 'object' &&
                      nestedTokenObjectValue !== null
                  "
                >
                  <h3>{{ nestedTokenObjectKey }}</h3>
                  <div
                    v-for="(nestedNestedTokenObjectValue,
                    nestedNestedTokenobjectKey) in nestedTokenObjectValue"
                    v-bind:key="nestedNestedTokenObjectValue"
                    class="text-overline"
                  >
                    <h5>{{ nestedNestedTokenobjectKey }}</h5>
                    <p>{{ nestedNestedTokenObjectValue }}</p>
                  </div>
                </div>
                <div v-else>

                  <h5>{{ nestedTokenObjectKey }}</h5>
                  <p>
                    {{
                      nestedTokenObjectValue ? nestedTokenObjectValue : 'null'
                    }}     
                  <v-btn v-if="nestedTokenObjectKey.includes('_address')">
                    Subscribe
                  </v-btn>
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>{{ tokenBigmapDetailValue }}</p>
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
.contract-metadata-banner {
  margin-top: -10px;
}
.v-system-bar {
  font-size: 18px;
}
</style>
<script>
import { SubscriptionClient } from 'graphql-subscriptions-client';

export default {
  data() {
    return {
      loading:false,
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
    async subscribeToGraphQLAccountTransactions(addressString) {
      this.loading = true;
      console.log('here');
      // get ready
      const GRAPHQL_ENDPOINT = 'wss://mainnet.tezgraph.tez.ie/graphql';
      console.log('her2');

      const query = `
      subscription {
  transactionAdded(
    // replayFromBlockLevel: 2257332
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
      client
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
