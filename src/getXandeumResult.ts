
import { Connection } from "@solana/web3.js"

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sends a JSON-RPC request to the Xandeum-compatible endpoint to retrieve
 * the result of a transaction previously submitted with a specific signature.
 *
 * This function calls the custom RPC method `getXandeumResult`, which returns
 * the result associated with the given transaction signature.
 *
 * @param connection - The Solana web3 connection object pointing to a Xandeum-compatible RPC endpoint.
 * @param signature - The transaction signature string whose result should be queried.
 *
 * @returns A `Promise<any>` resolving to the parsed JSON response from the RPC server,
 *          which includes the result of the transaction if available.
 */
export async function getXandeumResult(
    connection: Connection,
    signature: string
  ): Promise<any> {
    const url = connection.rpcEndpoint;
    const maxAttempts = 3;
    const delayMs = 5000;
  
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Wait before every attempt (including the first one)
      await sleep(delayMs);
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getXandeumResult",
          params: [signature],
        }),
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error(`Attempt ${attempt}/${maxAttempts} failed: ${response.status} ${text}`);
        if (attempt === maxAttempts) {
          return { result: null, error: `HTTP ${response.status}` };
        }
        continue;
      }
  
      const data = await response.json();
  
      // Change this condition if Xandeum uses a different "not ready" value
      if (data?.result != null && data.result !== "pending") {
        console.log(`Got result on attempt ${attempt}`);
        return data; // Success — return immediately
      }
  
      console.log(`Attempt ${attempt}/${maxAttempts}: still pending...`);
    }
  
    // All 3 attempts done, still no result
    console.log("Max attempts reached — result still not available");
    return { result: null, error: "Result not ready after 3 attempts" };
  }