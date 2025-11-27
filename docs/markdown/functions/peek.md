[**Xandeum Web3 Library v0.6.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / peek

# Function: peek()

> **peek**(`fsid`, `path`, `startPosition`, `endPosition`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [peek.ts:20](https://github.com/Xandeum/xandeum-web3.js/blob/stuttgart/src/peek.ts#L20)

Constructs a Solana transaction to perform a "peek" operation on a file within a file system.

The peek operation reads data between two byte offsets within a specified file path.

## Parameters

### fsid

`string`

A stringified integer representing the file system ID in which the file resides.

### path

`string`

The path to the file to be peeked.

### startPosition

`number`

The starting byte offset (inclusive) to begin reading from.

### endPosition

`number`

The ending byte offset (exclusive) to stop reading at.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the peek instruction.

## Throws

Will throw an error if the `path` contains invalid characters.
