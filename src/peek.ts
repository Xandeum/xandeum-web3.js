import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda } from './helpers'

/**
 * Constructs a Solana transaction to perform a "peek" operation on a file within a file system.
 *
 * The peek operation reads data between two byte offsets within a specified file path.
 *
 * @param fsid - A stringified integer representing the file system ID in which the file resides.
 * @param path - The path to the file to be peeked.
 * @param startPosition - The starting byte offset (inclusive) to begin reading from.
 * @param endPosition - The ending byte offset (exclusive) to stop reading at.
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the peek instruction.
 * @throws Will throw an error if the `path` contains invalid characters.
 */

export async function peek (
  fsid: string,
  path: string,
  startPosition: number,
  endPosition: number,
  wallet: PublicKey
): Promise<Transaction> {
  sanitizePath(path)

  const rest = Buffer.from(`${path}`, 'utf-8')
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([3]).buffer),
    Buffer.from(Uint8Array.of(...new BN(fsid).toArray('le', 8))),
    Buffer.from(Uint8Array.of(...new BN(startPosition).toArray('le', 8))),
    Buffer.from(Uint8Array.of(...new BN(endPosition).toArray('le', 8))),
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
