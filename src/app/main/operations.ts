import { resData, runAxiosCall } from "./axios";

export type operationNode = {
  __typename: string
  hash: string,
  batch_position: string,
  internal: string,
  kind: string,
  block: {
    hash: string,
    level: string,
    timestamp: string
  },
  source: {
    address: string
  },
  fee: string,
  counter: string,
  gas_limit: string,
  storage_limit: string,
  storage_size: string,
  amount: string,
  parameters: string
  entrypoint: string,
  value: string,
  prim: string,
};

export type bigmapNode = {
  id: string,
  annots: string,
  block: {
    hash: string,
    timestamp: string,
    level: number,
  },
  contract: {
    address: string,
    contract_metadata: {
      name: string,
      description: string,
      version: string,
      authors: string[],
      homepage: string,
    },
    operations: {
      edges: {
        node: {
          contract: {
            address: string,
          },
          kind: string,
          source: {
            address: string,
          },
          hash: string
          batch_position: string,
          internal: string,
        }
      }[]
    }
  }
};

type bigfishData = {
  cursor: string,
  block: {
    hash: string,
    timestamp: string,
    level: number
  },
  contract: { // if kt address is involved
    address: string,
    contract_metadata?: {
      name: string,
      description: string,
      version: string,
      authors: string[],
    }
  },
  transaction_operation?: {
    source_address: string | null,
    kind: string | null,
    destination_address: string | null,
    operation_hash: string | null,
    batch_position: string | null,
    internal_position: string | null,
    amount: string,
    consumed_gas: string,
    consumed_milligas: string,
    storage_size: string,
    entrypoint: string,
     //what casing do we want to use?
  }
}


type transactionRecord = {
  cursor: string,
  kind: string,
  hash: string,
  block: { hash: string, timestamp: string, level: string },
  storage_size: string,
  metadata: {
    operation_result: {
      consumed_gas: string
      consumed_milligas: string
    }
  },
  parameters: { entrypoint: string },
  amount: string,
  destination: string,
  source: {
    address: string,
    contract_metadata: any,
  }
}

export async function getRecentBigTransactions() {
  // Set up Tezgraph GraphQL Query
  let graphqlQuery = `query OperationsQuery {
    operations(
      first: 50
      filter: { kind: transaction, amount: { gte: "1000000000" } }
    ) {
      edges {
        cursor
        node {
          kind
          hash
          block {
            hash
            timestamp
            level
          }
          internal
          ... on TransactionRecord {
            storage_size
            metadata {
              operation_result {
                consumed_gas
                consumed_milligas
              }
            }
            parameters {
              entrypoint
            }
            amount
            destination
            source {
              address
              contract_metadata {
                description
                name
                authors
                version
                raw
              }
            }
          }
        }
      }
    }
  }`;

  const graphqlQueryConfig = {
    "operationName": "OperationsQuery",
    "query": graphqlQuery,
    "variables": {}
  };

  // Run Tezgraph Query
  const axiosResponse: resData = await runAxiosCall('post', graphqlQueryConfig)
  const axiosResponseData = axiosResponse.data
  const axiosResponseErrors = axiosResponse.errors

  // If Tezgraph returns an error, return error. 
  if (axiosResponseErrors !== undefined) {
    console.log(`Error: ${axiosResponseErrors}`)
    if (axiosResponseData === null || axiosResponseData === undefined) {
      throw new Error(`${axiosResponseErrors}`)
    }
  }

  const recentLedgersData = axiosResponseData.operations.edges
  const ledgersDataArray: any[] = [];


  recentLedgersData.forEach((operation: any) => {
    const operatationRecord: transactionRecord = operation.node
    operatationRecord.cursor = operation.cursor

    console.log('===============');
    console.log(operatationRecord);
    console.log('===============');

    const bigfishData: bigfishData = {
      cursor: '',
      block: {
        hash: '',
        timestamp: '',
        level: 0
      },
      contract: { // if kt address is involved
        address: '',
        contract_metadata: {
          name: '',
          description: '',
          version: '',
          authors: [''],
        }
      },
      transaction_operation: {
        source_address: '' ,
        kind: '' ,
        destination_address: '' ,
        operation_hash: '' ,
        batch_position: '' ,
        internal_position: '' ,
        amount: '',
        consumed_gas: '',
        consumed_milligas: '',
        storage_size: '',
        entrypoint: '',
         //what casing do we want to use?
      }
    }
    ledgersDataArray.push(operatationRecord);

  })
  return ledgersDataArray
}
