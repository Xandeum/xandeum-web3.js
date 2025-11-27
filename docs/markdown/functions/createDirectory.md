[**Xandeum Web3 Library v0.5.0**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / createDirectory

# Function: createDirectory()

> **createDirectory**(`fsid`, `path`, `name`, `wallet`): `Promise`\<`Transaction`\>

Defined in: [createDirectory.ts:17](https://github.com/Xandeum/xandeum-web3.js/blob/ingolstadt/src/createDirectory.ts#L17)

Constructs a Solana transaction to create a new directory within a  file system.

## Parameters

### fsid

`string`

A numeric filesystem identifier used to scope the directory creation.

### path

`string`

The parent path where the directory should be created (e.g., `/documents`).

### name

`string`

The name of the new directory (e.g., `reports`).

### wallet

`PublicKey`

The signer’s public key that authorizes the transaction.

## Returns

`Promise`\<`Transaction`\>

A Promise that resolves to a Solana `Transaction` object containing the createDirectory instruction.

## Throws

Will throw an error if `path` or `name` contains invalid characters.@throws Will throw if the combined path is invalid (non-alphanumeric or unsupported characters).
