import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { programId, TOKEN_PROGRAM_ID } from './const'
import { getFeeDistributorPda, getAssociatedTokenAddressWithProgramIds, u64ToLeBytes, buildInstructionData } from './helpers'

/**
 * Constructs a Solana transaction that triggers the "bigbang" instruction and creates a new file system.
 *
 * @param replicaCount - The number of replicas for the new file system. Must be 2 or greater. The total number of copies will be replicaCount + 1 (one original plus the replicas).
 * @param wallet - The public key of the wallet that will sign and authorize the transaction.
 * @returns A Promise that resolves to a Solana `Transaction` object containing the bigbang instruction.
 */
export async function bigbang(replicaCount: number, wallet: PublicKey): Promise<Transaction> {
  const feeDistributorPda = getFeeDistributorPda();
  const payerAta = getAssociatedTokenAddressWithProgramIds(wallet);
  const feeAta = getAssociatedTokenAddressWithProgramIds(feeDistributorPda.pda);
  const innerData = Buffer.concat([Buffer.from([0]), u64ToLeBytes(replicaCount)]);
  const instructionData = buildInstructionData(innerData);

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: wallet,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: feeDistributorPda.pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey("11111111111111111111111111111111"),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: payerAta.ata,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: feeAta.ata,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: new PublicKey(programId),
    data: instructionData,
  });

  return new Transaction().add(instruction);
}
