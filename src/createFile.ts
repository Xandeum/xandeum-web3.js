import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers.js'
/**
 * Constructs a Solana transaction to create a new file
 * within a file system, identified by a file system ID (`fsid`).
 * 
 * @param fsid - A stringified integer representing the file system ID where the file is to be created.
 * @param path - The absolute or relative path within the file system where the file should be created.
 * @param name - The name of the new file or directory to be created.
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the createFile instruction.
 * @throws Will throw an error if `path` or `name` contains invalid characters.
 */
export async function createFile (
  fsid: string,
  path: string,
  name: string,
  wallet: PublicKey
): Promise<Transaction> {
  const combinedPath = path.endsWith('/') ? `${path}${name}` : `${path}/${name}`
  sanitizePath(combinedPath);

  const rest = Buffer.from(`${path}\0${name}`, 'utf-8')

  // inner_data: [2u8 (operation), fsid as u64 LE, paths]
  const innerData = Buffer.concat([
    Buffer.from([2]),
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
