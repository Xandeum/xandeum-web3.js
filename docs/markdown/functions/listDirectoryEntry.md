[**Xandeum Web3 Library v0.8.1**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / listDirectoryEntry

# Function: listDirectoryEntry()

> **listDirectoryEntry**(`connection`, `path`): `Promise`\<`any`\>

Defined in: [listDirectoryEntery.ts:24](https://github.com/Xandeum/xandeum-web3.js/blob/reinheim/src/listDirectoryEntery.ts#L24)

Sends a JSON-RPC request to the Xandeum RPC endpoint to list all entries (files and subdirectories)
within a specified path.

This function calls the custom RPC method `listDirs`, which is  return an array of
directory entry metadata — names, types etc.

## Parameters

### connection

`Connection`

The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).

### path

`string`

The  filesystem path representing the directory to list (e.g., `/documents`).

## Returns

`Promise`\<`any`\>

A `Promise<any>` resolving to the parsed JSON response from the RPC server,
         typically including a `result` array containing directory entry objects.
