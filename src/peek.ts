import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, buildInstructionData } from './helpers'

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

  // inner_data: [3u8 (operation), fsid as u64 LE, startPosition as u64 LE, endPosition as u64 LE, path]
  const innerData = Buffer.concat([
    Buffer.from([3]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
    Buffer.from(new BN(startPosition).toArray('le', 8)),
    Buffer.from(new BN(endPosition).toArray('le', 8)),
    rest
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
