import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const.js'
import { getFeeDistributorPda } from './helpers.js'

/**
 * Constructs a Solana transaction that triggers the "armageddon" instruction
 * on the specified file system (fsid).
 * 
 * @param fsid - A stringified integer representing the file system ID to be used in the instruction.
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the armageddon instruction.
 */
export async function armageddon (
  fsid: string,
  wallet: PublicKey
): Promise<Transaction> {
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([1]).buffer),
    Buffer.from(Uint8Array.of(...new BN(fsid).toArray('le', 8)))
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
      }
    ],
    programId: new PublicKey(programId),
    data: instructionData
  })

  const tx = new Transaction().add(instruction)
  return tx
}
