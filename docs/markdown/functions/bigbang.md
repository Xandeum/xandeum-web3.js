[**Xandeum Web3 Library v0.5.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / bigbang

# Function: bigbang()

> **bigbang**(`wallet`): `Promise`\<`Transaction`\>

Defined in: [bigbang.ts:10](https://github.com/Xandeum/xandeum-web3.js/blob/ingolstadt/src/bigbang.ts#L10)

Constructs a Solana transaction that triggers the "bigbang" instruction and create new file system.

## Parameters

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
