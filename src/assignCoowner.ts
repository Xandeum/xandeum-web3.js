import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { programId } from './const'
import BN from 'bn.js'
import { getFeeDistributorPda } from './helpers.js'

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
  const instructionData = Buffer.concat([
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.from(Int8Array.from([14]).buffer),
    Buffer.from(Uint8Array.of(...new BN(fsid).toArray('le', 8))),
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