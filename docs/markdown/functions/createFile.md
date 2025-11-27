[**Xandeum Web3 Library v0.6.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / createFile

# Function: createFile()

> **createFile**(`fsid`, `path`, `name`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [createFile.ts:17](https://github.com/Xandeum/xandeum-web3.js/blob/stuttgart/src/createFile.ts#L17)

Constructs a Solana transaction to create a new file
within a file system, identified by a file system ID (`fsid`).

## Parameters

### fsid

`string`

A stringified integer representing the file system ID where the file is to be created.

### path

`string`

The absolute or relative path within the file system where the file should be created.

### name

`string`

The name of the new file or directory to be created.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the createFile instruction.

## Throws

Will throw an error if `path` or `name` contains invalid characters.
