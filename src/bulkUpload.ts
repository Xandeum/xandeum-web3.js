import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, buildInstructionData } from './helpers'

/**
 * Constructs a Solana transaction to perform a bulk upload operation, which writes data
 * to a file at the specified path.
 *
 * @param fsid - A stringified integer representing the file system ID where the file resides.
 * @param path - The path to the file to be uploaded.
 * @param file_size - The size of the file to be uploaded.
 * @param file_hash - The hash of the file to be uploaded.
 * @param wallet - The public key of the wallet that signs and authorizes the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the bulk upload instruction.
 * @throws Will throw an error if the `path` contains invalid characters.
 */

export async function bulkUpload (
  fsid: string,
  path: string,
  file_size: number,
  file_hash: string,
  wallet: PublicKey,
): Promise<Transaction> {
  sanitizePath(path)

  // Encode the path as UTF-8
  const pathBuffer = Buffer.from(path, 'utf-8')
  // Encode the path length as an 8-byte little-endian unsigned integer
  const pathLengthBuffer = Buffer.from(new BN(pathBuffer.length).toArray('le', 8))

  // inner_data: [4u8 (operation), fsid as u64 LE, position as u64 LE, pathLength as u64 LE, path]
  const innerData = Buffer.concat([
    Buffer.from([17]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
    Buffer.from(new BN(file_size).toArray('le', 8)),
    (() => {
      const hashBuf = Buffer.from(file_hash, 'hex')
      if (hashBuf.length < 64) {
        const padded = Buffer.alloc(64, 0)
        hashBuf.copy(padded)
        return padded
      }
      return hashBuf
    })(),
    pathLengthBuffer,
    pathBuffer
  ])

  const instructionData = buildInstructionData(innerData)
  let feeDistributorPda = getFeeDistributorPda()
  const payerAta = getAssociatedTokenAddressWithProgramIds(wallet)
  const feeAta = getAssociatedTokenAddressWithProgramIds(feeDistributorPda.pda)

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
        pubkey: payerAta.ata,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: feeAta.ata,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
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
