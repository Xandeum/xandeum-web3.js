[**Xandeum Web3 Library v0.4.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / move

# Function: move()

> **move**(`fsid`, `srcPath`, `destPath`, `name`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [move.ts:19](https://github.com/Xandeum/xandeum-web3.js/blob/herrenberg/src/move.ts#L19)

Constructs a Solana transaction to copy a file or directory from one  path to another.

## Parameters

### fsid

`string`

The unique numeric identifier representing the target file system.

### srcPath

`string`

The source path to copy from (e.g., `/documents`).

### destPath

`string`

The destination path to copy to (e.g., `/archive`).

### name

`string`

The name of the new file or directory at the destination (e.g., `report.txt`).

### wallet

`PublicKey`

The wallet public key used to sign and authorize the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the copyPath instruction.

## Throws

Will throw an error if `srcPath` or `destPath` contains invalid characters.
