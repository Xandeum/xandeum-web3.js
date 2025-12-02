[**Xandeum Web3 Library v0.8.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / getMetadata

# Function: getMetadata()

> **getMetadata**(`connection`, `path`): `Promise`\<`any`\>

Defined in: [getMetadata.ts:26](https://github.com/Xandeum/xandeum-web3.js/blob/master/src/getMetadata.ts#L26)

Sends a JSON-RPC request to the Xandeum RPC endpoint to retrieve metadata
about a file or directory at the given path.

This function calls the custom RPC method `getMetadata`, which is implemented
by the backend to return metadata such as type (file or directory), size,
timestamps etc.

## Parameters

### connection

`Connection`

The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).

### path

`string`

The filesystem path to query metadata for (e.g., `/documents/myfile.txt`).

## Returns

`Promise`\<`any`\>

A `Promise<any>` resolving to the parsed JSON response from the RPC server,
         typically containing a `result` object with metadata fields.
