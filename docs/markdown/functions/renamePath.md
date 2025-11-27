[**Xandeum Web3 Library v0.4.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / renamePath

# Function: renamePath()

> **renamePath**(`fsid`, `oldPath`, `name`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [renamePath.ts:18](https://github.com/Xandeum/xandeum-web3.js/blob/herrenberg/src/renamePath.ts#L18)

Constructs a Solana transaction to rename (or move) a file or directory
within a file system, based on a provided file system ID (`fsid`).

## Parameters

### fsid

`string`

A stringified integer representing the file system ID where the path exists.

### oldPath

`string`

The current path of the file or directory to be renamed or moved.

### name

`string`

The new name to assign to the file or directory.

### wallet

`PublicKey`

The public key of the wallet that signs and authorizes the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the rename path instruction.

## Throws

May throw an error if either `oldPath` or `newPath` is invalid per `sanitizePath`.
