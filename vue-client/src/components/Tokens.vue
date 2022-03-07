<template>
  <div>
    <v-card class="fill-height" outlined tile>
      <v-form>
        <v-container class="col-md-4 offset-md-4">
          <v-row class="mt-5">
            <v-text-field
              v-model="userInputAddress"
              label="ENTER TZ ADDRESS"
              outlined
            ></v-text-field>
            <v-btn class="ml-2" height="55px" v-on:click="queryTokens()">
              Tokens
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
      <div class="text-center mb-8" v-if="queryResponseTokens">
        <v-btn
          class="ml-3 mr-3"
          height="55px"
          v-on:click="queryRecentOperationsFromAddress(userInputAddress)"
        >
          Prev
        </v-btn>
        <v-btn
          class="ml-3 mr-3"
          height="55px"
          v-on:click="queryTokensNext()"
        >
          Next
        </v-btn>
      </div>
      <v-card
        v-for="operation in queryResponseTokens"
        v-bind:key="operation.id"
        class="mx-auto"
        outlined
        max-width="800px"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div
              class="text-overline"
              v-on:click="
                operationDetailsDialog = false;
                operationDetailsDialog = true;
                tokenBigmapDetails = operation;
              "
            >
              <!-- <h3>cursor</h3>
              <p>{{ operation.cursor ? operation.cursor : '-' }}</p> -->
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
        <v-btn
          class="ml-3 mr-3"
          height="55px"
          v-on:click="queryTokensNext()"
        >
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
            <p>--------------------------------------------------------------------</p>

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
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>{{ tokenBigmapDetailValue }}</p>
            </div>
          </div>
          <p>--------------------------------------------------------------------</p>
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

<script>
import axios from 'axios';

export default {
  data() {
    return {
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
    async queryTokens() {
      const res = await axios.get(`http://localhost:8080/tokens`);
      if (!res) {
        throw new Error('Error');
      }
      this.queryResponseTokens = res.data;
      return res.data;
    },
      async queryTokensNext() {
      if (this.queryResponseTokens[this.queryResponseTokens.length -1].cursor === undefined) {
        throw new Error('Error');
      }
      const res = await axios.get(`http://localhost:8080/tokens/after/${this.queryResponseTokens[this.queryResponseTokens.length -1].cursor}`);
      if (!res) {
        throw new Error('Error');
      }
      this.queryResponseTokens = res.data;
      return res.data;
    }
  }
};
</script>
