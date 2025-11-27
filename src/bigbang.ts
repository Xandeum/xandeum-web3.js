import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'

/**
 * Constructs a Solana transaction that triggers the "bigbang" instruction and create new file system.
 *
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @param replica_count - A stringified integer representing the number of replicas for the new file system.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
 */
export async function bigbang (replica_count:string,wallet: PublicKey): Promise<Transaction> {
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Uint8Array.of(...new BN(replica_count).toArray('le', 8)))
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
