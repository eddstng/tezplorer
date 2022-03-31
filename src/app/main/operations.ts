import { resData, runAxiosCall } from "./axios";

export type operationNode = {
  batch_position: number,
  kind: string,
  hash: string,
  block: {
    hash: string,
    timestamp: string,
    level: number
  },
  internal: number,
  storage_size: string,
  metadata: {
    operation_result: {
      consumed_gas: string,
      consumed_milligas: string
    }
  },
  parameters: {
    entrypoint: string
  },
  amount: string,
  destination: {
    address: string,
    contract_metadata: any
  },
  source: {
    address: string,
    contract_metadata: any
  },
  cursor: string,
  // bigmap_values: {
  //   edges: [
  //     {
  //       node: {
  //         kind: update,
  //         key: {
  //           int: 1146
  //         },
  //         contract: {
  //           address: KT1DcrUC4rhnDkmvKDTykD3se7ZSwvqE1Rpr
  //         }
  //       }
  //     },
  //     {
  //       node: {
  //         kind: update,
  //         key: {
  //           bytes: 000031641295fb44cd0887a01789ca070b9e7357369c
  //         },
  //         contract: {
  //           address: KT1DcrUC4rhnDkmvKDTykD3se7ZSwvqE1Rpr
  //         }
  //       }
  //     }
  //   ]
  // },
}

type bigfishData = {
  cursor: string,
  block: {
    hash: string,
    timestamp: string,
    level: number
  },
  transaction_operation?: {
    source_address: string | null,
    source_contract_metadata: any, // make contract metadata type
    kind: string | null,
    destination_address: string | null,
    destination_contract_metadata: any,
    operation_hash: string | null,
    batch_position: number | null,
    internal_position: number | null,
    amount: string,
    consumed_gas: string,
    consumed_milligas: string,
    storage_size: string,
    entrypoint: string,
    //what casing do we want to use?
  }
  usdPrice: number | null,
}

export async function getRecentBigTransactions() {
  // Set up Tezgraph GraphQL Query
  let graphqlQuery = ` query OperationsQuery {
    operations(
      first: 25
      filter: { kind: transaction, amount: { gte: "1000000000" } }
    ) {
      edges {
        cursor
        node {
          batch_position
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
            bigmap_values(first: 100) {
              edges {
                node {
                  kind
                  key
                  contract {
                    address
                  }
                }
              }
            }
            amount
            destination {
              address
              contract_metadata {
                description
                name
                authors
                version
                raw
              }
            }
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
    // console.log(`Error: ${axiosResponseErrors}`)
    if (axiosResponseData === null || axiosResponseData === undefined) {
      throw new Error(`${axiosResponseErrors}`)
    }
  }

  const recentLedgersData = axiosResponseData.operations.edges
  const ledgersDataArray: any[] = [];

  // const xtzUsdPrice: { data: { tezos: { usd: string } } } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd')


  recentLedgersData.forEach((operation: any) => {
    const operatationRecord: operationNode = operation.node
    operatationRecord.cursor = operation.cursor

    // console.log('===============');
    // console.log(xtzUsdPrice.data.tezos.usd);
    // console.log('===============');
    // console.log((parseInt(operatationRecord.amount) / 1000000))
    // console.log(parseInt(xtzUsdPrice.data.tezos.usd) * (parseInt(operatationRecord.amount) / 1000000))
    // operatationRecord.usdPrice = parseInt(xtzUsdPrice.data.tezos.usd) * (parseInt(operatationRecord.amount) / 1000000)
    const bigfishData: bigfishData = {
      cursor: operatationRecord.cursor,
      block: {
        hash: operatationRecord.block.hash,
        timestamp: operatationRecord.block.timestamp,
        level: operatationRecord.block.level
      },
      transaction_operation: {
        source_address: operatationRecord.source.address,
        source_contract_metadata: operatationRecord.source.contract_metadata,
        kind: operatationRecord.kind,
        destination_address: operatationRecord.destination.address,
        destination_contract_metadata: operatationRecord.destination.contract_metadata,
        operation_hash: operatationRecord.hash,
        batch_position: operatationRecord.batch_position,
        internal_position: operatationRecord.internal,
        amount: operatationRecord.amount,
        consumed_gas: operatationRecord.metadata.operation_result.consumed_gas,
        consumed_milligas: operatationRecord.metadata.operation_result.consumed_milligas,
        storage_size: operatationRecord.storage_size,
        entrypoint: operatationRecord.parameters.entrypoint,
        //what casing do we want to use?
      },
      usdPrice: null,
    }
    ledgersDataArray.push(bigfishData);

  })
  return ledgersDataArray
}
