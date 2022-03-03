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
            <v-btn
              class="ml-2"
              height="55px"
              v-on:click="queryTokens()"
            >        
              Tokens
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
      <div class="text-center mb-8" v-if="queryResponseOperations">
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
          v-on:click="queryRecentOperationsFromAddress(userInputAddress)"
        >
          Next
        </v-btn>
      </div>
      <v-card
        v-for="operation in queryResponseOperations"
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
                operationDetailsDialog = true;
                selectedOperationDetails = operation;
              "
            >
<h3> cursor </h3>
              <p>{{ operation.cursor ? operation.cursor : '-' }}</p>

<h3> annots </h3>
              <p>{{ operation.annots ? operation.annots : '-' }}</p>
              
              <h3> hash </h3>
              <p>{{ operation.block.hash ? operation.block.hash : '-' }}</p>
              
              <h3> timestamp </h3>
              <p>{{ operation.block.timestamp ? operation.block.timestamp : '-' }}</p>
              
              <h3> level </h3>
              <p>{{ operation.block.level ? operation.block.level : '-' }}</p>
              
              <h3> address </h3>
              <p>{{ operation.contract.address ? operation.contract.address : '-' }}</p>
              
              <h3> contract_metadata </h3>
              <p>{{ operation.contract.contract_metadata ? operation.contract.contract_metadata : '-' }}</p>
              
              <h3> contract_address </h3>
              <p>{{ operation.origination_operation.contract_address ? operation.origination_operation.contract_address : '-' }}</p>
              
              <h3> kind </h3>
              <p>{{ operation.origination_operation.kind ? operation.origination_operation.kind : '-' }}</p>
              
              <h3> creator_address </h3>
              <p>{{ operation.origination_operation.creator_address ? operation.origination_operation.creator_address : '-' }}</p>
              
              <h3> operation_hash </h3>
              <p>{{ operation.origination_operation.operation_hash ? operation.origination_operation.operation_hash : '-' }}</p>
              
              <h3> batch_position </h3>
              <p>{{ operation.origination_operation.batch_position ? operation.origination_operation.batch_position : '-' }}</p>
              
              <h3> internal_position </h3>
              <p>{{ operation.origination_operation.internal_position ? operation.origination_operation.internal_position : '-' }}</p>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div class="text-center mt-8 mb-8" v-if="queryResponseOperations">
        <v-btn class="ml-3 mr-3" height="55px">
          Prev
        </v-btn>
        <v-btn
          class="ml-3 mr-3"
          height="55px"
          v-on:click="queryRecentOperationsFromAddressAfter()"
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
            v-for="(value, key) in selectedOperationDetails"
            v-bind:key="key"
            class="text-overline"
          >
            <h3>{{ key }}</h3>
            <p>{{ value }}</p>
          </div>
          <h3>Raw JSON:</h3>
          <p>{{ selectedOperationDetails }}</p>
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
      queryResponseOperations: null,
      userInputAddress: '',
      selectedOperationDetails: null,
      operationDetailsiDalog: false,
      operationsPaginationDetails: {
        address: '',
        sourceAfterCursor: '',
        destinationAfterCursor: ''
      }
    };
  },
  methods: {
    async queryTokens(
    ) {
      const res = await axios.get(
        `http://localhost:8080/tokens`
      ); 
      if (!res) {
        throw new Error('Error');
      }
      this.queryResponseOperations = res.data;
      return res.data;
    }
  }
};
</script>
