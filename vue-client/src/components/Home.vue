<template>
  <div>
    <v-card class="fill-height" outlined tile>
      <v-form>
        <v-container class="col-md-4 offset-md-4">
          <v-row class="mt-5 mb-5">
            <v-text-field
              v-model="userInputAddress"
              label="ENTER TZ ADDRESS"
              outlined
            ></v-text-field>
            <v-btn
              class="ml-2"
              height="55px"
              v-on:click="queryAddressDetails(userInputAddress)"
            >
              Query
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
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
              <h3>Operation Hash:</h3>
              <p>{{ operation.hash }}</p>
              <h3>Block Hash:</h3>
              <p>{{ operation.block.hash }}</p>
              <h3>Block Timestamp:</h3>
              <p>{{ operation.block.timestamp }}</p>
              <h3>Operation Kind:</h3>
              <p>{{ operation.kind }}</p>
              <h3>Amount:</h3>
              <p>{{ operation.amount }}</p>
              <h3>Destination:</h3>
              <p>{{ operation.destination }}</p>
              <h3>Source:</h3>
              <p>{{ operation.source.address }}</p>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
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
      operationDetailsDialog: false
    };
  },
  methods: {
    async queryAddressDetails(addressString) {
      console.log(addressString);
      const res = await axios.get(`http://localhost:8080/${addressString}`);
      if (!res) {
        console.log('Error occurred.');
      }
      this.queryResponseOperations = res.data;
      console.log(res.data);
    }
  }
};
</script>
