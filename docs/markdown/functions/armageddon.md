[**Xandeum Web3 Library v0.8.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / armageddon

# Function: armageddon()

> **armageddon**(`fsid`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [armageddon.ts:13](https://github.com/Xandeum/xandeum-web3.js/blob/master/src/armageddon.ts#L13)

Constructs a Solana transaction that triggers the "armageddon" instruction
on the specified file system (fsid).

## Parameters

### fsid

`string`

A stringified integer representing the file system ID to be used in the instruction.

### wallet

`PublicKey`

The public key of the wallet that will sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the armageddon instruction.
