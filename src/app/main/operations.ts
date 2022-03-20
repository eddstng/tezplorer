import { runAxiosCall } from "./axios";

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


export async function getRecentBigTransactions() {
        // Set up Tezgraph GraphQL Query
        let graphqlQuery = `query OperationsQuery{
          operations(
            first: 50
            filter: { kind: transaction, amount: { gte: "1000000000" } }
          ) {
            edges {
              node {
                kind
                hash
                block {
                  timestamp
                  level
                }
        
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
        const axiosResponse = await runAxiosCall('post', graphqlQueryConfig)
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
    
        // recentLedgersData.forEach((token: any) => {
        //     let originationOperation = null;
        //     if (token.node.contract) {
        //         originationOperation = token.node.contract.operations && token.node.contract.operations.edges[0] ? token.node.contract.operations.edges[0] : null
        //     }
        //     const tokenData: LedgerData = {
        //         cursor: token.node.id,
        //         annots: token.node.annots,
        //         block: token.node.block,
        //         contract: {
        //             address: token.node.contract.address,
        //         },
        //     }
    
        //     if (token.node.contract.contract_metadata) {
        //         tokenData.contract.contract_metadata = token.node.contract.contract_metadata
        //     }
    
        //     if (token.node.contract.operations && token.node.contract.operations.edges[0]) {
        //         tokenData.origination_operation = {
        //             contract_address: originationOperation ? originationOperation.node.contract.address : null,
        //             kind: originationOperation ? originationOperation.node.kind : null,
        //             creator_address: originationOperation ? originationOperation.node.source.address : null,
        //             operation_hash: originationOperation ? originationOperation.node.hash : null,
        //             batch_position: originationOperation ? originationOperation.node.batch_position : null,
        //             internal_position: originationOperation ? originationOperation.node.internal : null,
        //         }
        //     }
        //     ledgersDataArray.push(tokenData);
        // })
    
        // return {
        //     errors: axiosResponseErrors,
        //     data: ledgersDataArray,
        // }

        console.log(JSON.stringify(recentLedgersData));
        return recentLedgersData

    }
    