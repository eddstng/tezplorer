import axios, { Method } from "axios";
import { BigmapNode } from "./bigmaps";
import { OperationNode } from "./operations";
const endpoint = "https://mainnet.staging.tezgraph.tez.ie/graphql";

export type resData = {
    data: {
        accounts: {
            edges: {
                node: {
                    [key: string]: {
                        edges: {
                            node: OperationNode,
                            canonical_value: string,
                            michelson_value: string,
                        }[],
                    },
                },
            }[],
        },
        bigmaps: {
            edges: {
                node: BigmapNode,
            }[],
        },
        operations: {
            edges: {
                node: OperationNode
            }[]
        }
    },
    errors?: {
        message: string
    }[]
}

export async function runAxiosCall(
    method: Method,
    data: { operationName: string, query: string }
) {
    const headers = {
        "content-type": "application/json",
        "Authorization": "<token>"
    };

    const response = axios({
        url: endpoint,
        method: method,
        headers,
        data: data,
    });

    // Run Tezgraph Query
    return (await response).data
}
