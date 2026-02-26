import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers'

/**
 * Constructs a Solana transaction to perform a poke\operation, which writes data
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
        pubkey: dataKey,
        isSigner: false,
        isWritable: false
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
