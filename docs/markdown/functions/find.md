[**Xandeum Web3 Library v0.8.1**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / find

# Function: find()

> **find**(`connection`, `path`, `query`): `Promise`\<`any`\>

Defined in: [find.ts:25](https://github.com/Xandeum/xandeum-web3.js/blob/reinheim/src/find.ts#L25)

Sends a JSON-RPC request to the Xandeum RPC endpoint to search for a file or directory
within a specified path.

This function calls the custom RPC method `find`, which is  return an array of
directory entry metadata — names, types etc.

## Parameters

### connection

`Connection`

The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).

### path

`string`

The  filesystem path where the search will be performed (e.g., `/documents`).

### query

`string`

The query to search for (e.g., `'myfile.txt'`).

## Returns

`Promise`\<`any`\>

A `Promise<any>` resolving to the parsed JSON response from the RPC server,
         typically including a `result` array containing directory entry objects.
