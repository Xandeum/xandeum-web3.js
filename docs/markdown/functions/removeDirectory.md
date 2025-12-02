[**Xandeum Web3 Library v0.8.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / removeDirectory

# Function: removeDirectory()

> **removeDirectory**(`fsid`, `path`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [removeDirectory.ts:17](https://github.com/Xandeum/xandeum-web3.js/blob/master/src/removeDirectory.ts#L17)

Constructs a Solana transaction to perform a "remove directory" operation
in a  file system, identified by a file system ID (`fsid`).

## Parameters

### fsid

`string`

A stringified integer representing the file system ID containing the directory.

### path

`string`

The full path to the directory that should be removed.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the remove directory instruction.

## Throws

May throw an error if the `path` fails validation in `sanitizePath`.
