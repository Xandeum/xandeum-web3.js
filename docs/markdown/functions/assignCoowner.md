[**Xandeum Web3 Library v0.5.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / assignCoowner

# Function: assignCoowner()

> **assignCoowner**(`fsid`, `path`, `coowner`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [assignCoowner.ts:15](https://github.com/Xandeum/xandeum-web3.js/blob/ingolstadt/src/assignCoowner.ts#L15)

Constructs a Solana transaction to assign a co-owner to a file or directory
identified by a file system ID (`fsid`).

## Parameters

### fsid

`string`

A stringified integer representing the file system ID where the co-owner is to be assigned.

### path

`string`

The path within the file system.

### coowner

`PublicKey`

The public key of the co-owner to be assigned.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the assignCoowner instruction.
