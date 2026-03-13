import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import BN from 'bn.js'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, buildInstructionData } from './helpers'

/**
 * Constructs a Solana transaction to assign a co-owner to a file or directory
 * identified by a file system ID (`fsid`).
 * 
 * @param fsid - A stringified integer representing the file system ID where the co-owner is to be assigned.
 * @param path - The path within the file system.
 * @param coowner - The public key of the co-owner to be assigned.
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the assignCoowner instruction.
 */
export async function assignCoowner (
  fsid: string,
  path: string,
  coowner: PublicKey,
  wallet: PublicKey
): Promise<Transaction> {
  const rest = Buffer.from(`${path}\0${coowner.toString()}`, 'utf-8')

  // inner_data: [14u8 (operation), fsid as u64 LE, path\0coowner]
  const innerData = Buffer.concat([
    Buffer.from([14]),
    Buffer.from(new BN(fsid).toArray('le', 8)),
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
