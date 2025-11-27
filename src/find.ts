import { Connection } from "@solana/web3.js"

export interface RpcRequest {
  jsonrpc: string
  id: number
  method: string
  params: any[]
}

/**
 * Sends a JSON-RPC request to the Xandeum RPC endpoint to search for a file or directory
 * within a specified path.
 *
 * This function calls the custom RPC method `find`, which is  return an array of
 * directory entry metadata — names, types etc.
 *
 * @param connection - The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).
 * @param path - The  filesystem path where the search will be performed (e.g., `/documents`).
 * @param query - The query to search for (e.g., `'myfile.txt'`).
 *
 * @returns A `Promise<any>` resolving to the parsed JSON response from the RPC server,
 *          typically including a `result` array containing directory entry objects.
 */

export async function listDirectoryEntry (
  connection: Connection,
  path: string,
  query: string,
): Promise<any> {
  const url = connection.rpcEndpoint;
  const requestBody: RpcRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'find',
    params: [path,query]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text(); 
    return Error(`error! status: ${response.status}, message: ${errorText}`);
  }

  const data = await response.json()
  return data
}
