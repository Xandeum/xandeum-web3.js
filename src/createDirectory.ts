import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers.js'

/**
 * Constructs a Solana transaction to create a new directory within a  file system.
 *
 * @param fsid - A numeric filesystem identifier used to scope the directory creation.
 * @param path - The parent path where the directory should be created (e.g., `/documents`).
 * @param name - The name of the new directory (e.g., `reports`).
 * @param wallet - The signer’s public key that authorizes the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the createDirectory instruction.
 * @throws Will throw an error if `path` or `name` contains invalid characters.@throws Will throw if the combined path is invalid (non-alphanumeric or unsupported characters).
 */

export async function createDirectory (
  fsid: string,
  path: string,
  name: string,
  wallet: PublicKey
): Promise<Transaction> {
  // Validate path: only letters, numbers, and /
  const combinedPath = path.endsWith('/') ? `${path}${name}` : `${path}/${name}`
  sanitizePath(combinedPath)
  const rest = Buffer.from(`${path}\0${name}`, 'utf-8')
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([6]).buffer),
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
