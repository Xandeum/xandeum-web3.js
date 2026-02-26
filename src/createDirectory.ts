import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
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

  // inner_data: [6u8 (operation), fsid as u64 LE, paths]
  const innerData = Buffer.concat([
    Buffer.from([6]),
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
