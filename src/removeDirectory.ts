import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import { sanitizePath } from './sanitizePath'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, buildInstructionData } from './helpers'

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
  // inner_data: [7u8 (operation), fsid as u64 LE, path]
  const innerData = Buffer.concat([
    Buffer.from([7]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
    Buffer.from(`${path}`, 'utf-8')
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
