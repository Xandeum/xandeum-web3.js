import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
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
  // inner_data: [1u8 (operation), fsid as u64 LE]
  const innerData = Buffer.concat([
    Buffer.from([1]),
    Buffer.from(new BN(fsid).toArray('le', 8))
  ])

  // wrap_storage_tx: [0u8, inner_data.len() as u32 LE, inner_data]
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
