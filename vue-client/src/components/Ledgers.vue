<template>
  <div>
    <div>
      <p class="text-center mt-5 mb-0">RECENT LEDGERS</p>
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
              class="ml-15  "
              width="200px"
              v-model="checkbox"
              v-on:click="getRecentLedgers()"
            >
              Get Ledgers
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
        v-for="operation in queryResponseTokens"
        v-bind:key="operation.id"
        class="mx-auto mt-1"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-system-bar height="50px" dark color="primary">
              <span
                >{{ operation.cursor }}:{{ operation.contract.address }}</span
              >
              <v-spacer></v-spacer>
              <span>{{ operation.block.level }}</span>
              <br />
            </v-system-bar>
            <v-system-bar
              v-if="operation.contract.contract_metadata"
              class="contract-metadata-banner"
              height="50px"
              dark
              color="primary"
            >
              <span>{{ operation.contract.contract_metadata.name }}</span>
              <v-spacer></v-spacer>
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
              <h3>address</h3>
              <p>
                {{
                  operation.contract.address ? operation.contract.address : '-'
                }}
              </p>

              <h3>annots</h3>
              <p>{{ operation.annots ? operation.annots : '-' }}</p>

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

              <div v-if="operation.contract.contract_metadata">
                <h3>contract_metadata</h3>
                <p>Name: {{ operation.contract.contract_metadata.name }}</p>
                <p>
                  Description:
                  {{ operation.contract.contract_metadata.description }}
                </p>
                <p>
                  Version: {{ operation.contract.contract_metadata.version }}
                </p>
                <p>
                  Authors: {{ operation.contract.contract_metadata.authors }}
                </p>
                <p>
                  Homepage: {{ operation.contract.contract_metadata.homepage }}
                </p>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div class="text-center mt-8 mb-8" v-if="queryResponseTokens">
        <v-btn class="ml-3 mr-3" height="55px">
          Prev
        </v-btn>
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
                    <v-btn
                      height="25px"
                      v-if="nestedTokenObjectKey.includes('address')"
                      class="ml-2 mb-1"
                      v-on:click="
                        subscribeToGraphQLAccountTransactions(
                          nestedTokenObjectValue
                        )
                      "
                    >
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
    subscribeToGraphQLAccountTransactions(address) {
      this.operationDetailsDialog = false;
      this.$store.commit('setSubscriptionAddress', address);
      this.$root.$emit('changeTabToSubscription');
      this.$root.$emit('subscribeToGraphQLAccountTransactions');
    },
    async getRecentLedgers() {
      this.queryResponseTokens = null;
      this.loading = true;
      const res = await axios.post(`http://localhost:8080/recent/ledgers`, {
        contract_metadata: this.contractMetadataQueryBoolean,
        contract_origination: this.originationQueryBoolean
      });
      if (!res) {
        throw new Error('Error');
      }
      this.queryResponseTokens = res.data.data;
      this.loading = false;

      return res.data;
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
