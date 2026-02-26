import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers'
/**
 * Constructs a Solana transaction to rename (or move) a file or directory
 * within a file system, based on a provided file system ID (`fsid`).
 *
 * @param fsid - A stringified integer representing the file system ID where the path exists.
 * @param oldPath - The current path of the file or directory to be renamed or moved.
 * @param name - The new name to assign to the file or directory.
 * @param wallet - The public key of the wallet that signs and authorizes the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the rename path instruction.
 * @throws May throw an error if either `oldPath` or `newPath` is invalid per `sanitizePath`.
 */

export async function renamePath (
  fsid: string,
  oldPath: string,
  name: string,
  wallet: PublicKey
): Promise<Transaction> {
  sanitizePath(oldPath)

  sanitizePath(name)

  const rest = Buffer.from(`${oldPath}\0${name}`, 'utf-8')

  // inner_data: [8u8 (operation), fsid as u64 LE, paths]
  const innerData = Buffer.concat([
    Buffer.from([8]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
    rest
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
