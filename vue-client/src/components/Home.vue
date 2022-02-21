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
              v-on:click="queryRecentOperationsFromAddress(userInputAddress)"
            >
              Query
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
              <h3>Operation Kind:</h3>
              <p>{{ operation.kind ? operation.kind : '-' }}</p>
              <h3>Block Timestamp:</h3>
              <p>
                {{
                  operation.block.timestamp ? operation.block.timestamp : '-'
                }}
              </p>
              <h3>Block Hash:</h3>
              <p>{{ operation.block.hash ? operation.block.hash : '-' }}</p>
              <h3>Operation Hash:</h3>
              <p>{{ operation.hash ? operation.hash : '-' }}</p>
              <h3>Amount:</h3>
              <p>{{ operation.amount ? operation.amount : '-' }}</p>
              <h3>Destination:</h3>
              <p>{{ operation.destination ? operation.destination : '-' }}</p>
              <h3>Source:</h3>
              <p>
                {{ operation.source.address ? operation.source.address : '-' }}
              </p>
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
          v-on:click="
            queryRecentOperationsFromAddressAfter()
          "
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
import { orderBy } from 'lodash';

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
    async queryRecentOperationsFromAddress(addressString) {
      const operationsWithAddressAsSource = await this.queryOperationsFromAddressAndRelationship(
        addressString,
        'source'
      );
      const operationsWithAddressAsDestination = await this.queryOperationsFromAddressAndRelationship(
        addressString,
        'destination'
      );

      const totalOperations =
        operationsWithAddressAsSource.length +
        operationsWithAddressAsDestination.length;

      let allOperations = [];
      operationsWithAddressAsSource.forEach(operation => {
        operation.tezplorer_operation_type = 'source';
        allOperations.push(operation);
      });
      operationsWithAddressAsDestination.forEach(operation => {
        operation.tezplorer_operation_type = 'destination';
        allOperations.push(operation);
      });
      if (allOperations.length !== totalOperations) {
        throw new Error(
          `Error in queryRecentOperationsFromAddress. Expected ${totalOperations} operations but got ${allOperations.length}.`
        );
      }

      if (totalOperations <= 50) {
        this.queryResponseOperations = orderBy(
          allOperations,
          ['block.level', 'hash'],
          ['desc', 'asc']
        );
      } else {
        allOperations = allOperations.slice(0, 50);
        this.queryResponseOperations = orderBy(
          allOperations,
          ['block.level', 'hash'],
          ['desc', 'asc']
        );
      }
      this.operationsPaginationDetails.address = addressString;
      this.setOperationsPaginationDetailsAfterCursors(allOperations);
    },

    async queryRecentOperationsFromAddressAfter() {
      const operationsWithAddressAsSource = await this.queryOperationsFromAddressAndRelationshipAfter(
         this.operationsPaginationDetails.address,
        'source',
        this.operationsPaginationDetails.sourceAfterCursor
      );
      const operationsWithAddressAsDestination = await this.queryOperationsFromAddressAndRelationshipAfter(
         this.operationsPaginationDetails.address,
        'destination',
        this.operationsPaginationDetails.sourceAfterCursor
      );

      const totalOperations =
        operationsWithAddressAsSource.length +
        operationsWithAddressAsDestination.length;

      let allOperations = [];
      operationsWithAddressAsSource.forEach(operation => {
        operation.tezplorer_operation_type = 'source';
        allOperations.push(operation);
      });
      operationsWithAddressAsDestination.forEach(operation => {
        operation.tezplorer_operation_type = 'destination';
        allOperations.push(operation);
      });
      if (allOperations.length !== totalOperations) {
        throw new Error(
          `Error in queryRecentOperationsFromAddress. Expected ${totalOperations} operations but got ${allOperations.length}.`
        );
      }

      if (totalOperations <= 50) {
        this.queryResponseOperations = orderBy(
          allOperations,
          ['block.level', 'hash'],
          ['desc', 'asc']
        );
      } else {
        allOperations = allOperations.slice(0, 50);
        this.queryResponseOperations = orderBy(
          allOperations,
          ['block.level', 'hash'],
          ['desc', 'asc']
        );
      }
      this.setOperationsPaginationDetailsAfterCursors(allOperations);
    },

    setOperationsPaginationDetailsAfterCursors(operationsArray) {
      const lastSourceIndex = operationsArray
        .map(operation => operation.tezplorer_operation_type === 'source')
        .lastIndexOf(true);

      const lastDestinationIndex = operationsArray
        .map(operation => operation.tezplorer_operation_type === 'destination')
        .lastIndexOf(true);

      this.operationsPaginationDetails.sourceAfterCursor = `${operationsArray[lastSourceIndex].hash}:${operationsArray[lastSourceIndex].batch_position}:${operationsArray[lastSourceIndex].internal}`;
      this.operationsPaginationDetails.destinationAfterCursor = `${operationsArray[lastDestinationIndex].hash}:${operationsArray[lastDestinationIndex].batch_position}:${operationsArray[lastDestinationIndex].internal}`;
    },

    async queryOperationsFromAddressAndRelationship(
      addressString,
      relationship
    ) {
      const res = await axios.get(
        `http://localhost:8080/operations/${addressString}/${relationship}`
      );
      if (!res) {
        throw new Error('Error');
      }
      return res.data;
    },
    async queryOperationsFromAddressAndRelationshipAfter(
      addressString,
      relationship,
      cursor
    ) {
      const res = await axios.get(
        `http://localhost:8080/operations/${addressString}/${relationship}/after/${cursor}`
      );
      if (!res) {
        throw new Error('Error');
      }
      return res.data;
    }
  }
};
</script>
