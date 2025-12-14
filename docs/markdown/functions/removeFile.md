[**Xandeum Web3 Library v0.8.1**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / removeFile

# Function: removeFile()

> **removeFile**(`fsid`, `path`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [removeFile.ts:17](https://github.com/Xandeum/xandeum-web3.js/blob/reinheim/src/removeFile.ts#L17)

Constructs a Solana transaction to remove a file from a  file system,
identified by a file system ID (`fsid`) and a UTF-8 encoded file path.

## Parameters

### fsid

`string`

A stringified integer representing the file system ID in which the file resides.

### path

`string`

The full path to the file to be deleted.

### wallet

`PublicKey`

The public key of the wallet that signs and authorizes the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the remove file instruction.

## Throws

May throw an error if `path` is invalid per `sanitizePath`.
