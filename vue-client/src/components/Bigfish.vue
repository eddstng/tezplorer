<template>
  <div>
    <div>
      <p class="text-center mt-5 mb-0">RECENT BIG FISH</p>
    </div>
    <v-card height="100%" tile>
      <div>
        <v-card style="position: fixed" class="mx-auto mt-9 float-left">
          <v-container class="px-0" fluid>
            <v-system-bar height="50px" dark color="primary">
              <span class="mx-auto">LEDGER FILTERS</span>
              <br />
            </v-system-bar>
            <br />
            <v-btn
              width="350px"
              v-model="contractMetadataQueryBoolean"
              v-on:click="
                contractMetadataQueryBoolean = !contractMetadataQueryBoolean
              "
            >
              Contract Metadata: {{ contractMetadataQueryBoolean }}
            </v-btn>
            <br />
            <br />

            <v-btn
              width="350px"
              v-model="originationQueryBoolean"
              v-on:click="originationQueryBoolean = !originationQueryBoolean"
            >
              Origination Data: {{ originationQueryBoolean }}
            </v-btn>
            <br />
            <br />
            <br />
            <v-btn
              class="ml-15"
              width="200px"
              v-model="checkbox"
              v-on:click="getRecentBigfish()"
            >
              Get Fish
            </v-btn>
            <br />
            <br />
            <v-btn
              class="ml-15"
              width="200px"
              v-model="checkbox"
              v-on:click="subscribeToGraphQL()"
            >
              Get Sub
            </v-btn>
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
        v-for="operation in queryResponseTokens"
        v-bind:key="operation.id"
        class="mx-auto mt-1"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-system-bar height="50px" dark color="primary">
              <v-spacer>
                {{ operation.transaction_operation.operation_hash }}:{{
                  operation.transaction_operation.batch_position
                }}</v-spacer
              >

              <v-spacer></v-spacer>
              <span>${{ operation.usdPrice.toFixed(2) }}</span>
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
              <h3>operation hash</h3>
              <p>{{ operation.transaction_operation.operation_hash }}</p>

              <h3>batch position</h3>
              <p>{{ operation.transaction_operation.batch_position }}</p>

              <h3>internal position</h3>
              <p>{{ operation.transaction_operation.internal_position }}</p>

              <h3>source address</h3>
              <p>{{ operation.transaction_operation.source_address }}</p>

              <div
                v-if="operation.transaction_operation.source_contract_metadata"
              >
                <h3>source_contract_metadata</h3>
                <p>
                  Name:
                  {{
                    operation.transaction_operation.source_contract_metadata
                      .name
                  }}
                </p>
                <p>
                  Description:
                  {{
                    operation.transaction_operation.source_contract_metadata
                      .description
                  }}
                </p>
                <p>
                  Version:
                  {{
                    operation.transaction_operation.source_contract_metadata
                      .version
                  }}
                </p>
                <p>
                  Authors:
                  {{
                    operation.transaction_operation.source_contract_metadata
                      .authors
                  }}
                </p>
                <p>
                  Homepage:
                  {{
                    operation.transaction_operation.source_contract_metadata
                      .homepage
                  }}
                </p>
              </div>
              <h3>destination address</h3>
              <p>{{ operation.transaction_operation.destination_address }}</p>

              <div
                v-if="
                  operation.transaction_operation.destination_contract_metadata
                "
              >
                <h3>destination_contract_metadata</h3>
                <p>
                  Name:
                  {{
                    operation.transaction_operation
                      .destination_contract_metadata.name
                  }}
                </p>
                <p>
                  Description:
                  {{
                    operation.transaction_operation
                      .destination_contract_metadata.description
                  }}
                </p>
                <p>
                  Version:
                  {{
                    operation.transaction_operation
                      .destination_contract_metadata.version
                  }}
                </p>
                <p>
                  Authors:
                  {{
                    operation.transaction_operation
                      .destination_contract_metadata.authors
                  }}
                </p>
                <p>
                  Homepage:
                  {{
                    operation.transaction_operation
                      .destination_contract_metadata.homepage
                  }}
                </p>
              </div>

              <h3>amount</h3>
              <p>{{ operation.transaction_operation.amount }}</p>

              <h3>usd price</h3>
              <p>${{ operation.usdPrice.toFixed(2) }}</p>

              <h3>block hash</h3>
              <p>{{ operation.block.hash ? operation.block.hash : '-' }}</p>

              <h3>block timestamp</h3>
              <p>
                {{
                  operation.block.timestamp ? operation.block.timestamp : '-'
                }}
              </p>

              <h3>block level</h3>
              <p>{{ operation.block.level ? operation.block.level : '-' }}</p>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div class="text-center mt-8 mb-8" v-if="queryResponseTokens">
        <v-btn class="ml-3 mr-3" height="55px"> Prev </v-btn>
        <v-btn class="ml-3 mr-3" height="55px" v-on:click="queryTokensNext()">
          Next
        </v-btn>
      </div>
    </v-card>
    <v-dialog v-model="operationDetailsDialog" width="1200" font-color="black">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 mb-5">
          Operation Details
        </v-card-title>

        <v-card-text class="black--text">
          <div
            v-for="(tokenBigmapDetailValue,
            tokenBigmapDetailKey) in tokenBigmapDetails"
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
          <p>
            --------------------------------------------------------------------
          </p>
          <h3>Raw JSON:</h3>
          <p>{{ tokenBigmapDetails }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="operationDetailsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import axios from 'axios';
import { SubscriptionClient } from 'graphql-subscriptions-client';

export default {
  data() {
    return {
      contractMetadataQueryBoolean: false,
      originationQueryBoolean: false,
      checkbox: true,
      loading: false,
      operationDetailsDialog: false,
      queryResponseTokens: null,
      userInputAddress: '',
      tokenBigmapDetails: null,
      operationDetailsiDalog: false,
      operationsPaginationDetails: {
        address: '',
        sourceAfterCursor: '',
        destinationAfterCursor: ''
      }
    };
  },
  methods: {
    async getRecentBigfish() {
      this.queryResponseTokens = null;
      this.loading = true;
      const xtzUsdPrice = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd'
      );
      console.log(xtzUsdPrice.data.tezos.usd);
      console.log(xtzUsdPrice.data.tezos.usd);
      console.log(xtzUsdPrice.data.tezos.usd);

      const res = await axios.get(`http://localhost:8080/recent/bigfish`);
      if (!res) {
        throw new Error('Error');
      }
      const bigfishArray = [];
      res.data.forEach(element => {
        let bigfishObj = element;
        bigfishObj.usdPrice =
          (element.transaction_operation.amount / 1000000) *
          xtzUsdPrice.data.tezos.usd;
        bigfishArray.push(bigfishObj);
      });
      this.queryResponseTokens = res.data;
      this.loading = false;

      return res.data;
    },
    async subscribeToGraphQL() {
      // get ready
      const GRAPHQL_ENDPOINT = 'wss://tezgraph-mainnet.tezoslive.io/graphql';

      const query = `subscription {
  transactionAdded{
    origin
    source
    destination
    amount
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
      const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: error => {
          error && console.error(error);
        }
      });

      // make the actual request
      client.request({ query });

      // the above doesn't do much though

      // call subscription.unsubscribe() later to clean up
      client
        .request({ query })
        // so lets actually do something with the response
        .subscribe({
          next({ data }) {
            if (data) {
              console.log('We got something!', data);
            }
          }
        });
    },

    async queryTokensNext() {
      if (
        this.queryResponseTokens[this.queryResponseTokens.length - 1].cursor ===
        undefined
      ) {
        throw new Error('Error');
      }
      const nextCursor = this.queryResponseTokens[
        this.queryResponseTokens.length - 1
      ].cursor;
      this.queryResponseTokens = null;
      this.loading = true;
      const res = await axios.post(`http://localhost:8080/recent/ledgers`, {
        contract_metadata: this.contractMetadataQueryBoolean,
        contract_origination: this.originationQueryBoolean,
        after: nextCursor
      });
      if (!res) {
        throw new Error('Error');
      }
      this.queryResponseTokens = res.data.data;
      this.loading = false;
      return res.data;
    }
  }
};
</script>
