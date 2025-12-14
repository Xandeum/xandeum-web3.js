[**Xandeum Web3 Library v0.8.1**](../README.md)

***

[Xandeum Web3 Library](../globals.md) / unsubscribeResult

# Function: unsubscribeResult()

> **unsubscribeResult**(`connection`, `subscriptionId`): `void`

Defined in: [webSocket.ts:103](https://github.com/Xandeum/xandeum-web3.js/blob/reinheim/src/webSocket.ts#L103)

Sends a WebSocket JSON-RPC message to unsubscribe from a previously subscribed transaction result
using the `xandeumResultUnsubscribed` method (note: custom method, ensure server-side implementation matches).

This function automatically closes the WebSocket connection after sending the unsubscribe request.

## Parameters

### connection

`Connection`

The solana web3 connection with Xandeum-compatible JSON-RPC endpoint (e.g., `'https://api.devnet.solana.com'`).

### subscriptionId

`string`

The ID of the active subscription you want to cancel.

## Returns

`void`
