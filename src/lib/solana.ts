import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const PLATFORM_WALLET = process.env.PLATFORM_WALLET_ADDRESS || ''

export interface VerificationResult {
  verified: boolean
  error?: string
  amountSOL?: number
  blockTime?: number
}

export async function verifyTransaction(
  txHash: string,
  expectedAmountSOL: number,
  tolerancePct = 0.02
): Promise<VerificationResult> {
  try {
    if (!PLATFORM_WALLET || PLATFORM_WALLET === 'YOUR_PLATFORM_WALLET_ADDRESS_HERE') {
      return { verified: false, error: 'Platform wallet not configured.' }
    }

    const connection = new Connection(RPC_URL, 'confirmed')

    const tx = await connection.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    })

    if (!tx) {
      return { verified: false, error: 'Transaction not found. It may still be confirming — please wait a moment and try again.' }
    }

    if (!tx.meta || tx.meta.err) {
      return { verified: false, error: 'Transaction failed on-chain.' }
    }

    // Max 24-hour age check
    if (tx.blockTime) {
      const ageSeconds = Date.now() / 1000 - tx.blockTime
      if (ageSeconds > 86400) {
        return { verified: false, error: 'Transaction is older than 24 hours.' }
      }
    }

    // Find SOL transfer to platform wallet
    const platformPubkey = new PublicKey(PLATFORM_WALLET)
    const accountKeys = tx.transaction.message.accountKeys
    const platformIndex = accountKeys.findIndex(
      (k) => k.pubkey.toBase58() === platformPubkey.toBase58()
    )

    if (platformIndex === -1) {
      return { verified: false, error: 'Platform wallet was not a recipient in this transaction.' }
    }

    const preBalance = tx.meta.preBalances[platformIndex]
    const postBalance = tx.meta.postBalances[platformIndex]
    const receivedLamports = postBalance - preBalance

    if (receivedLamports <= 0) {
      return { verified: false, error: 'No SOL was received by the platform wallet.' }
    }

    const receivedSOL = receivedLamports / LAMPORTS_PER_SOL
    const tolerance = expectedAmountSOL * tolerancePct

    if (Math.abs(receivedSOL - expectedAmountSOL) > tolerance) {
      return {
        verified: false,
        error: `Amount mismatch. Expected ~${expectedAmountSOL} SOL, received ${receivedSOL.toFixed(4)} SOL.`,
        amountSOL: receivedSOL,
      }
    }

    return { verified: true, amountSOL: receivedSOL, blockTime: tx.blockTime ?? undefined }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { verified: false, error: `Verification error: ${msg}` }
  }
}
