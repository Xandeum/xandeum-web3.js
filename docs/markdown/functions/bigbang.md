[**Xandeum Web3 Library v0.5.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / bigbang

# Function: bigbang()

> **bigbang**(`replica_count`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [bigbang.ts:12](https://github.com/Xandeum/xandeum-web3.js/blob/ingolstadt/src/bigbang.ts#L12)

Constructs a Solana transaction that triggers the "bigbang" instruction and create new file system.

## Parameters

### replica\_count

`string`

A stringified integer representing the number of replicas for the new file system.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
