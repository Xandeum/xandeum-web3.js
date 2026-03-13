import { PublicKey } from '@solana/web3.js'
import { programId, TOKEN_PROGRAM_ID, ATA_PROGRAM_ID, TOKEN_MINT_ADDRESS } from './const'
import BN from 'bn.js'

/**
 * Seed used for deriving the fee distributor PDA
 */
export const FEE_DISTRIBUTOR_SEED = 'fee_distributor'

/**
 * Duration of one pulse in seconds
 */
export const PULSE_DURATION_SECONDS = 15

/**
 * Number of pulses in one yuga
 */
export const PULSES_PER_YUGA = 100

/**
 * Duration of one yuga in seconds (16384 * 15 = 245,760 seconds ≈ 2.84 days)
 */
export const YUGA_DURATION_SECONDS = PULSES_PER_YUGA * PULSE_DURATION_SECONDS

/**
 * Unix timestamp (in seconds) when the first yuga started
 */
export const YUGA_START_TIMESTAMP = 1768898445 

/**
 * Calculates the yuga number from a given unix timestamp.
 * 
 * @param unixTimestamp - Unix timestamp in seconds
 * @returns The yuga number for the given timestamp
 */
export function getYugaFromTimestamp(unixTimestamp: number): number {
  if (unixTimestamp < YUGA_START_TIMESTAMP) {
    return 0
  }
  return Math.floor((unixTimestamp - YUGA_START_TIMESTAMP) / YUGA_DURATION_SECONDS)
}

/**
 * Gets the current yuga value.
 * Yuga represents an epoch or era in the Xandeum system.
 * Each yuga lasts 245,760 seconds (approximately 2.84 days).
 * 
 * @returns The current yuga number
 */
export function getCurrentYuga(): number {
  const currentTime = Math.floor(Date.now() / 1000)
  return getYugaFromTimestamp(currentTime)
}

/**
 * Derives the Program Derived Address (PDA) for the fee distributor account.
 * 
 * The PDA is derived using:
 * - The fee distributor seed
 * - The current yuga (epoch) as little-endian bytes
 * 
 * @returns An object containing the PDA public key and bump seed
 * 
 * @example
 * ```typescript
 * const { pda, bump } = getFeeDistributorPda()
 * console.log('Fee Distributor PDA:', pda.toBase58())
 * console.log('Bump seed:', bump)
 * ```
 */
/**
 * Derives the Associated Token Address (ATA) for a given wallet using custom program IDs.
 * 
 * @param walletAddress - The public key of the wallet
 * @returns An object containing the ATA public key and bump seed
 */
export function getAssociatedTokenAddressWithProgramIds(walletAddress: PublicKey): { ata: PublicKey; bump: number } {
  const [ata, bump] = PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      TOKEN_MINT_ADDRESS.toBuffer(),
    ],
    ATA_PROGRAM_ID
  );
  return { ata, bump };
}

/**
 * Converts a u64 value to little-endian bytes.
 * 
 * @param value - The value to convert (number)
 * @returns A Buffer containing the 8-byte little-endian representation
 */
export function u64ToLeBytes(value: number): Buffer {
  const bn = new BN(value);
  if (bn.isNeg() || bn.byteLength() > 8) {
    throw new Error(`u64 out of range: ${value}`);
  }
  return Buffer.from(bn.toArray('le', 8));
}

/**
 * Builds the instruction data buffer for a given inner data payload.
 * Allocates a fixed 33-byte buffer, sets the first byte to 0,
 * and copies the inner data starting at offset 1.
 * 
 * @param innerData - The inner data buffer to embed in the instruction
 * @returns A 33-byte Buffer containing the instruction data
 */
export function buildInstructionData(innerData: Buffer): Buffer {
  const instructionData = Buffer.alloc(33, 0);
  instructionData[0] = 0;
  innerData.copy(instructionData, 1);
  return instructionData;
}

export function getFeeDistributorPda(): { pda: PublicKey; bump: number } {
  const yuga = getCurrentYuga()
  
  const yugaBuffer = Buffer.from(new BN(yuga).toArray('le', 8))
  
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(FEE_DISTRIBUTOR_SEED, 'utf-8'),
      yugaBuffer
    ],
    new PublicKey(programId)
  )
  
  return { pda, bump }
}
