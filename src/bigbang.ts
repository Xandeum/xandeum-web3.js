import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { programId } from './const'

/**
 * Constructs a Solana transaction that triggers the "bigbang" instruction and create new file system.
 *
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
 */
export async function bigbang (wallet: PublicKey): Promise<Transaction> {
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
  ])

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: wallet,
        isSigner: true,
        isWritable: true
      }
    ],
    programId: new PublicKey(programId),
    data: instructionData
  })

  const tx = new Transaction().add(instruction)
  return tx
}
