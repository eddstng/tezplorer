import axios from "axios";
import { orderBy } from "lodash";
import { resData } from "./axios";

export interface LedgerParams {
  contract_metadata: boolean,
  contract_origination: boolean,
  pagination_after: string | undefined,
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

export async function getOperationsFromAddressDescAfter(address: string, relationshipType: "destination" | "source", afterCursor: string) {
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
                after: "${afterCursor}"
                filter: { relationship_type: ${relationshipType} }
                order_by: { field: chronological_order, direction: desc }
              ) {
                edges {
                  cursor
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


export async function getTokensAfter(afterCursor: string) {

  // Set up Tezgraph GraphQL Query
  const endpoint = "https://mainnet.staging.tezgraph.tez.ie/graphql";
  const graphqlQuery = {
    "operationName": "BigmapQuery",
    "query": `query BigmapQuery {
      bigmaps(
        filter: { annots: "%ledger" }
        first: 5
        after: "${afterCursor}"
        order_by: { field: id, direction: desc }
      ) {
        total_count
        edges {
          cursor
          node {
            id
            annots
            annots
            block {
              hash
              timestamp
              level
            }
            contract {
              address
              contract_metadata {
                name
                description
                version
                authors
                homepage
              }
              operations(
                first: 1
                filter: { kind: origination, relationship_type: contract }
              ) {
                edges {
                  node {
                    ... on OriginationRecord {
                      contract {
                        address
                      }
                    }
                    kind
                    source {
                      address
                    }
                    hash
                  }
                }
              }
            }
          }
        }
      }
    }`,
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
    console.log(`Error: ${axiosResponseErrors}`)
    if (axiosResponseData === null || axiosResponseData === undefined) {
      throw new Error(`${axiosResponseErrors}`)
    }
  }

  const tokensQueriesData = axiosResponseData.bigmaps.edges

  const tokenDataArray: any[] = [];

  tokensQueriesData.forEach((token) => {
    let contractMetadata = null;
    let originationOperation = null;
    if (token.node.contract) {
      contractMetadata = token.node.contract.contract_metadata ?? null;
      originationOperation = token.node.contract.operations.edges[0] ?? null
    }
    const tokenData = {
      cursor: token.node.id,
      annots: token.node.annots,
      block: token.node.block,
      contract: {
        address: token.node.contract.address,
        contract_metadata: contractMetadata,
      },
      origination_operation: {
        contract_address: originationOperation ? originationOperation.node.contract.address : null,
        kind: originationOperation ? originationOperation.node.kind : null,
        creator_address: originationOperation ? originationOperation.node.source.address : null,
        operation_hash: originationOperation ? originationOperation.node.hash : null,
        batch_position: originationOperation ? originationOperation.node.batch_position : null,
        internal_position: originationOperation ? originationOperation.node.internal : null,
      },
    }
    tokenDataArray.push(tokenData);
  })

  return {
    errors: axiosResponseErrors,
    data: tokenDataArray,
  }

}

export async function getBigmapsRelatedToAddresses(addressesString: string) {
  // Set up Tezgraph GraphQL Query
  const endpoint = "https://mainnet.staging.tezgraph.tez.ie/graphql";
  const graphqlQuery = {
    "operationName": "BigmapQuery",
    "query": `query BigmapQuery {
        bigmaps(
          filter: {
            contract: { addresses: [${addressesString}] }
          }
          first: 100
        ) {
          total_count
          edges {
            cursor
            node {
              id
              annots
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

  // If Tezgraph returns an error, return error. 
  if (axiosResponseErrors !== undefined) {
    return axiosResponseErrors
  }

  console.log(JSON.stringify(axiosResponseData))
}
