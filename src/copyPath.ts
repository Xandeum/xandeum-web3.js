import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers.js'

/**
 * Constructs a Solana transaction to copy a file or directory from one  path to another.
 *
 * @param fsid - The unique numeric identifier representing the target file system.
 * @param srcPath - The source path to copy from (e.g., `/documents/report.txt`).
 * @param destPath - The destination path to copy to (e.g., `/archive/report.txt`).
 * @param wallet - The wallet public key used to sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the copyPath instruction.
 * @throws Will throw an error if `srcPath` or `destPath` contains invalid characters.
 *
 */

export async function copyPath (
  fsid: string,
  srcPath: string,
  destPath: string,
  wallet: PublicKey
): Promise<Transaction> {
  // Validate path: only letters, numbers, and /
  sanitizePath(srcPath)

  sanitizePath(destPath)

  const rest = Buffer.from(`${srcPath}\0${destPath}`, 'utf-8')

  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([9]).buffer),
    Buffer.from(Uint8Array.of(...new BN(fsid).toArray('le', 8))),
    rest
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
