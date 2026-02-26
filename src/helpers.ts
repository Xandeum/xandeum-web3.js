import { PublicKey } from '@solana/web3.js'
import { programId } from './const'
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
