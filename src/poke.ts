import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, buildInstructionData } from './helpers'

/**
 * Constructs a Solana transaction to perform a poke operation, which writes data
 * to a file at the specified path and byte position.
 *
 * @param fsid - A stringified integer representing the file system ID where the file resides.
 * @param path - The path to the file to be written to.
 * @param position - The byte offset in the file where data should be written.
 * @param wallet - The public key of the wallet that signs and authorizes the transaction.
 * @param dataKey - A public key of a data account that holds the content to be written to the file.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the poke instruction.
 * @throws Will throw an error if the `path` contains invalid characters.
 */

export async function poke (
  fsid: string,
  path: string,
  position: number,
  wallet: PublicKey,
  dataKey: PublicKey
): Promise<Transaction> {
  sanitizePath(path)

  // Encode the path as UTF-8
  const pathBuffer = Buffer.from(path, 'utf-8')
  // Encode the path length as an 8-byte little-endian unsigned integer
  const pathLengthBuffer = Buffer.from(new BN(pathBuffer.length).toArray('le', 8))

  // inner_data: [4u8 (operation), fsid as u64 LE, position as u64 LE, pathLength as u64 LE, path]
  const innerData = Buffer.concat([
    Buffer.from([4]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
    Buffer.from(new BN(position).toArray('le', 8)),
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
        pubkey: dataKey,
        isSigner: false,
        isWritable: false
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
