import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { getFeeDistributorPda } from './helpers'

/**
 * Constructs a Solana transaction that triggers the "bigbang" instruction and create new file system.
 *
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @param replica_count - A stringified integer representing the number of replicas for the new file system. Must be 2 or greater. The total number of copies will be replica_count + 1 (one original plus the replicas).
 * @returns A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
 */
export async function bigbang(replica_count:string,wallet: PublicKey): Promise<Transaction> {
  const innerData = Buffer.concat([
    Buffer.from([0]),
    Buffer.from(new BN(replica_count).toArray('le', 8))
  ])

  const innerLen = Buffer.alloc(4)
  innerLen.writeUInt32LE(innerData.length)

  const instructionData = Buffer.concat([
    Buffer.from([0]),
    innerLen,
    innerData
  ])
  let feeDistributorPda = getFeeDistributorPda()

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: wallet,
        isSigner: true,
        isWritable: true
      },
      {
        pubkey: feeDistributorPda.pda,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false
      }
    ],
    programId: new PublicKey(programId),
    data: instructionData
  })

  const tx = new Transaction().add(instruction)
  return tx
}
