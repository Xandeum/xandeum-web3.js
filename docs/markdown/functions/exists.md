[**Xandeum Web3 Library v0.6.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / exists

# Function: exists()

> **exists**(`connection`, `path`): `Promise`\<`any`\>

Defined in: [exists.ts:23](https://github.com/Xandeum/xandeum-web3.js/blob/stuttgart/src/exists.ts#L23)

Sends a JSON-RPC request to the Xandeum RPC endpoint to check if a file or directory exists.

This function calls the custom RPC method `isExist`, which should be implemented
by the backend to validate the existence of metadata (files/directories) at a given path.

## Parameters

### connection

`Connection`

The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).

### path

`string`

The filesystem path to check (e.g., `/documents/myfile.txt`).

## Returns

`Promise`\<`any`\>

A `Promise<any>` resolving to the RPC response JSON, typically including a `result` field
         indicating existence (e.g., `true` or `false`), or `null` if not found.
