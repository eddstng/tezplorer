import { runAxiosCall } from "./axios";

export interface LedgerParams {
  contract_metadata: boolean,
  contract_origination: boolean,
  pagination_after: string | undefined,
}

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

export type LedgerData = {
  cursor: string,
  annots: string,
  block: {
    hash: string,
    timestamp: string,
    level: number
  },
  contract: {
    address: string,
    contract_metadata?: {
      name: string,
      description: string,
      version: string,
      authors: string[],
    }
  },
  origination_operation?: {
    contract_address: string | null,
    kind: string | null,
    creator_address: string | null,
    operation_hash: string | null,
    batch_position: string | null,
    internal_position: string | null,
  }
}

const contractMetadataQueryBlock = `contract_metadata {
    name
    description
    version
    authors
    homepage
  }`

const contractOriginationQueryBlock = `operations(
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
  }`

export async function getRecentLedgers(params: LedgerParams
) {
  // Set up Tezgraph GraphQL Query
  const endpoint = "https://mainnet.staging.tezgraph.tez.ie/graphql";

  let graphqlQuery = `query BigmapsQuery {
      bigmaps(
        filter: { annots: "%ledger" }
        first: 25  
        order_by: { field: id, direction: desc }
        ${params.pagination_after ? `after: ${params.pagination_after}` : ""}
      ) {
        total_count
        edges {
          cursor
          node {
            id
            annots
            block {
              hash
              timestamp
              level
            }
            contract {
              address
              ${params.contract_metadata ? contractMetadataQueryBlock : ""}
              ${params.contract_origination ? contractOriginationQueryBlock : ""}
            }
          } 
        }
      }
    }`;

  const graphqlQueryConfig = {
    "operationName": "BigmapsQuery",
    "query": graphqlQuery,
    "variables": {}
  };

  // Run Tezgraph Query
  const axiosResponse = await runAxiosCall('post', graphqlQueryConfig)
  const axiosResponseData = axiosResponse.data
  const axiosResponseErrors = axiosResponse.errors

  // If Tezgraph returns an error, return error. 
  if (axiosResponseErrors !== undefined) {
    if (axiosResponseData === null || axiosResponseData === undefined) {
      throw new Error(`${axiosResponseErrors}`)
    }
  }

  const recentLedgersData = axiosResponseData.bigmaps.edges
  const ledgersDataArray: any[] = [];

  recentLedgersData.forEach((token: any) => {
    let originationOperation = null;
    if (token.node.contract) {
      originationOperation = token.node.contract.operations && token.node.contract.operations.edges[0] ? token.node.contract.operations.edges[0] : null
    }
    const tokenData: LedgerData = {
      cursor: token.node.id,
      annots: token.node.annots,
      block: token.node.block,
      contract: {
        address: token.node.contract.address,
      },
    }

    if (token.node.contract.contract_metadata) {
      tokenData.contract.contract_metadata = token.node.contract.contract_metadata
    }

    if (token.node.contract.operations && token.node.contract.operations.edges[0]) {
      tokenData.origination_operation = {
        contract_address: originationOperation ? originationOperation.node.contract.address : null,
        kind: originationOperation ? originationOperation.node.kind : null,
        creator_address: originationOperation ? originationOperation.node.source.address : null,
        operation_hash: originationOperation ? originationOperation.node.hash : null,
        batch_position: originationOperation ? originationOperation.node.batch_position : null,
        internal_position: originationOperation ? originationOperation.node.internal : null,
      }
    }
    ledgersDataArray.push(tokenData);
  })

  return {
    errors: axiosResponseErrors,
    data: ledgersDataArray,
  }
}
