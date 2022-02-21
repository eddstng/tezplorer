import axios from "axios";
import { orderBy } from "lodash";

type operationNode = {
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

type resData = {
    data: {
        accounts: {
            edges: {
                node: {
                    [key: string]: {
                        edges: {
                            node: operationNode,
                            canonical_value: string,
                            michelson_value: string,
                        }[],
                    },
                },
            }[],
        },
    },
    errors?: {
        message: string
    }[]

}


export async function getOperationsFromAddressDesc(address: string, relationshipType: "destination" | "source") {
    // Set up Tezgraph GraphQL Query
    const endpoint = "https://mainnet.tezgraph.tez.ie/graphql";
    const graphqlQuery = {
        "operationName": "AccountQuery",
        "query": `query AccountQuery {
            accounts(
              first: 100
              filter: { addresses: ["${address}"] }
            ) {
              edges {
                node {
                  operations(
                    first: 100
                    filter: { relationship_type: ${relationshipType} }
                    order_by: { field: chronological_order, direction: desc }
                  ) {
                    edges {
                      node {
                        __typename
                        hash
                        batch_position
                        internal
                        kind
                        block {
                          hash
                          level
                          timestamp
                        }
                        source {
                          address
                        }
                        ... on EndorsementRecord {
                          reward
                          deposit
                          metadata {
                            delegate
                            slots
                          }
                        }
                        ... on RevealRecord {
                          fee
                          counter
                          gas_limit
                          storage_limit
                          public_key
                          metadata {
                            operation_result {
                              consumed_gas
                              consumed_milligas
                              errors
                              status
                            }
                          }
                        }
                        ... on OriginationRecord {
                          burned
                          delegate
                          balance
                          fee
                          counter
                          gas_limit
                          storage_limit
                          storage_size
                          contract {
                            script {
                              code
                              storage
                            }
                          }
                          contract_address
                          metadata {
                            operation_result {
                              consumed_gas
                              consumed_milligas
                              errors
                              status
                            }
                          }
                        }
                        ... on TransactionRecord {
                          fee
                          counter
                          gas_limit
                          storage_limit
                          storage_size
                          amount
                          parameters {
                            entrypoint
                            value
                            canonical_value
                            michelson_value
                          }
                          destination
                          metadata {
                            operation_result {
                              consumed_gas
                              consumed_milligas
                              errors
                              status
                            }
                          }
                        }
                        ... on DelegationRecord {
                          fee
                          counter
                          gas_limit
                          amount
                          storage_limit
                          delegate
                          metadata {
                            operation_result {
                              consumed_gas
                              consumed_milligas
                              errors
                              status
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          `,
        "variables": {}
    };
    const headers = {
        "content-type": "application/json",
        "Authorization": "<token>"
    };
    const response = axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });

    // Run Tezgraph Query
    const axiosResponse: resData = (await response).data
    const axiosResponseData = axiosResponse.data
    const axiosResponseErrors = axiosResponse.errors



    console.log(axiosResponseData.accounts.edges[0].node.operations)

    // If Tezgraph returns an error, return error. 
    if (axiosResponseErrors !== undefined) {
        return axiosResponseErrors
    }

    // If no error, add all operations into an array and sort them by block level and hash, also removing unnecessary fields. 
    const accountOperationQueriesData = axiosResponseData.accounts.edges[0].node
    if (accountOperationQueriesData.operations === null) {
        return []
    }
    let accoutOperationQueries = Object.keys(accountOperationQueriesData)
    let arrayWithAllOperationsRetrieved: any = [];
    accoutOperationQueries.forEach((key) => {
        arrayWithAllOperationsRetrieved.push(...accountOperationQueriesData[key].edges)
    })
    arrayWithAllOperationsRetrieved = arrayWithAllOperationsRetrieved.map((element: { node: any }) => {
        return element.node
    })
    const sortedArrayWithAllOperationsRetrieved = orderBy(arrayWithAllOperationsRetrieved, ["block.level", "hash"], ["desc", "asc"])
    return (sortedArrayWithAllOperationsRetrieved)
}

export async function getRecentOperationsFromAddress(address: string) {
    // Set up Tezgraph GraphQL Query
    const endpoint = "https://mainnet.tezgraph.tez.ie/graphql";
    const graphqlQuery = {
        "operationName": "AccountQuery",
        "query": `query AccountQuery {  accounts(    first: 100    filter: { addresses: ["${address}"] }  ) {    edges {      node {        op_destination: operations(first: 100, filter: { relationship_type: destination } order_by: {field: chronological_order direction: desc}) {          edges {            node {              __typename              hash              batch_position              internal              kind              block {                hash                level                timestamp              }              source {                address              }              ... on EndorsementRecord {                reward                deposit                metadata {                  delegate                  slots                }              }              ... on RevealRecord {                fee                counter                gas_limit                storage_limit                public_key                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on OriginationRecord {                burned                delegate                balance                fee                counter                gas_limit                storage_limit                storage_size                contract {                  script {                    code                    storage                  }                }                contract_address                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on TransactionRecord {                fee                counter                gas_limit                storage_limit                storage_size                amount                parameters {                  entrypoint                  value                  canonical_value                  michelson_value                }                destination                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on DelegationRecord {                fee                counter                gas_limit                amount                storage_limit                delegate                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }            }          }        }        op_sender: operations(first: 100, filter: { relationship_type: source } order_by: {field: chronological_order direction: desc}) {          edges {            node {              __typename              hash              batch_position              internal              kind              block {                hash                level                timestamp              }              source {                address              }              ... on EndorsementRecord {                reward                deposit                metadata {                  delegate                  slots                }              }              ... on RevealRecord {                fee                counter                gas_limit                storage_limit                public_key                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on OriginationRecord {                burned                delegate                balance                fee                counter                gas_limit                storage_limit                storage_size                contract {                  script {                    code                    storage                  }                }                contract_address                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on TransactionRecord {                fee                counter                gas_limit                storage_limit                storage_size                amount                parameters {                  entrypoint                  value                  canonical_value                  michelson_value                }                destination                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }              ... on DelegationRecord {                fee                counter                gas_limit                amount                storage_limit                delegate                metadata {                  operation_result {                    consumed_gas                    consumed_milligas                    errors                    status                  }                }              }            }          }        }      }    }  }}`,
        "variables": {}
    };
    const headers = {
        "content-type": "application/json",
        "Authorization": "<token>"
    };
    const response = axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });

    // Run Tezgraph Query
    const axiosResponse: resData = (await response).data
    const axiosResponseData = axiosResponse.data
    const axiosResponseErrors = axiosResponse.errors

    // If Tezgraph returns an error, return error. 
    if (axiosResponseErrors !== undefined) {
        return axiosResponseErrors
    }

    // If no error, add all operations into an array and sort them by block level and hash, also removing unnecessary fields. 
    const accountOperationQueriesData = axiosResponseData.accounts.edges[0].node
    let accoutOperationQueries = Object.keys(accountOperationQueriesData)
    let arrayWithAllOperationsRetrieved: any = [];
    accoutOperationQueries.forEach((key) => {
        arrayWithAllOperationsRetrieved.push(...accountOperationQueriesData[key].edges)
    })
    arrayWithAllOperationsRetrieved = arrayWithAllOperationsRetrieved.map((element: { node: any }) => {
        return element.node
    })
    const sortedArrayWithAllOperationsRetrieved = orderBy(arrayWithAllOperationsRetrieved, ["block.level", "hash"], ["desc", "asc"])
    return (sortedArrayWithAllOperationsRetrieved)
}