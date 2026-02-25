import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers'
/**
 * Constructs a Solana transaction to perform a "remove directory" operation
 * in a  file system, identified by a file system ID (`fsid`).
 *
 * @param fsid - A stringified integer representing the file system ID containing the directory.
 * @param path - The full path to the directory that should be removed.
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the remove directory instruction.
 * @throws May throw an error if the `path` fails validation in `sanitizePath`.
 */

export async function removeDirectory (
  fsid: string,
  path: string,
  wallet: PublicKey
): Promise<Transaction> {
  sanitizePath(path)
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([7]).buffer),
    Buffer.from(Uint8Array.of(...new BN(fsid).toArray('le', 8))),
    Buffer.from(`${path}`, 'utf-8')
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
