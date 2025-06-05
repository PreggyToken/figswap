"use client"

import { useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction, VersionedTransaction } from "@solana/web3.js"
import { JUPITER_CONFIG } from "@/lib/config"
import { usePriorityFee } from "./use-priority-fee"
import { submitTransactionWithMEVProtection } from "@/lib/mev-middleware"

interface ExecuteSwapParams {
  quote: any
  userPublicKey: string
  useMEVProtection?: boolean
}

export function useSwapExecution() {
  const { connection } = useConnection()
  const { signTransaction } = useWallet()
  const [loading, setLoading] = useState(false)
  const [mevProtectionActive, setMevProtectionActive] = useState(false)
  const { getPriorityFee } = usePriorityFee()

  const executeSwap = async ({ quote, userPublicKey, useMEVProtection = false }: ExecuteSwapParams) => {
    if (!signTransaction) {
      throw new Error("Wallet not connected")
    }

    setLoading(true)
    setMevProtectionActive(useMEVProtection)

    try {
      // Get priority fee estimate
      const priorityFee = await getPriorityFee()

      // Get swap transaction from Jupiter
      const swapResponse = await fetch(JUPITER_CONFIG.SWAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey,
          wrapAndUnwrapSol: true,
          computeUnitPriceMicroLamports: priorityFee.priorityFeeEstimate,
        }),
      })

      if (!swapResponse.ok) {
        throw new Error("Failed to get swap transaction")
      }

      const { swapTransaction } = await swapResponse.json()

      // Deserialize and sign transaction
      const transactionBuf = Buffer.from(swapTransaction, "base64")
      let transaction: Transaction | VersionedTransaction

      try {
        transaction = VersionedTransaction.deserialize(transactionBuf)
      } catch {
        transaction = Transaction.from(transactionBuf)
      }

      const signedTransaction = await signTransaction(transaction)

      let signature: string

      // Use MEV protection if enabled
      if (useMEVProtection) {
        console.log("🛡️ Using Blink MEV Protection for transaction")
        signature = await submitTransactionWithMEVProtection(signedTransaction)
      } else {
        // Regular transaction submission
        console.log("📡 Submitting transaction without MEV protection")
        signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        })
      }

      // Confirm transaction
      console.log("⏳ Confirming transaction...")
      await connection.confirmTransaction(signature, "confirmed")
      console.log("✅ Transaction confirmed!")

      return signature
    } catch (error) {
      console.error("❌ Swap execution failed:", error)
      throw error
    } finally {
      setLoading(false)
      setMevProtectionActive(false)
    }
  }

  return { executeSwap, loading, mevProtectionActive }
}
