"use client"

import { useState, useEffect, useCallback } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

interface TokenBalance {
  balance: number
  decimals: number
  uiAmount: number
  mint: string
}

export function useTokenBalance(tokenAddress: string) {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<TokenBalance | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !tokenAddress || !connected) {
      setBalance(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Handle SOL balance
      if (tokenAddress === "So11111111111111111111111111111111111111112") {
        const solBalance = await connection.getBalance(publicKey, "confirmed")
        setBalance({
          balance: solBalance,
          decimals: 9,
          uiAmount: solBalance / Math.pow(10, 9),
          mint: tokenAddress,
        })
        return
      }

      // Handle SPL token balance
      try {
        const mintPubkey = new PublicKey(tokenAddress)

        // Get all token accounts for this wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            mint: mintPubkey,
          },
          "confirmed",
        )

        if (tokenAccounts.value.length > 0) {
          // Find the account with the highest balance (in case of multiple accounts)
          let maxBalance = 0
          let maxAccount = tokenAccounts.value[0]

          for (const account of tokenAccounts.value) {
            const accountBalance = Number.parseInt(account.account.data.parsed.info.tokenAmount.amount)
            if (accountBalance > maxBalance) {
              maxBalance = accountBalance
              maxAccount = account
            }
          }

          const accountInfo = maxAccount.account.data.parsed.info
          const tokenAmount = accountInfo.tokenAmount

          setBalance({
            balance: Number.parseInt(tokenAmount.amount),
            decimals: tokenAmount.decimals,
            uiAmount: Number.parseFloat(tokenAmount.uiAmountString || "0"),
            mint: tokenAddress,
          })
        } else {
          // No token account found, balance is 0
          setBalance({
            balance: 0,
            decimals: 6, // Default decimals for most SPL tokens
            uiAmount: 0,
            mint: tokenAddress,
          })
        }
      } catch (mintError) {
        console.error("Error parsing mint address:", mintError)
        setError("Invalid token address")
        setBalance(null)
      }
    } catch (err) {
      console.error("Failed to fetch token balance:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch balance")
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }, [connection, publicKey, tokenAddress, connected])

  useEffect(() => {
    fetchBalance()

    if (!publicKey || !tokenAddress || !connected) return

    // Set up real-time balance updates
    let subscriptionId: number | null = null
    let intervalId: NodeJS.Timeout | null = null

    const setupSubscription = async () => {
      try {
        if (tokenAddress === "So11111111111111111111111111111111111111112") {
          // Subscribe to SOL balance changes
          subscriptionId = connection.onAccountChange(
            publicKey,
            (accountInfo) => {
              setBalance({
                balance: accountInfo.lamports,
                decimals: 9,
                uiAmount: accountInfo.lamports / Math.pow(10, 9),
                mint: tokenAddress,
              })
            },
            "confirmed",
          )
        } else {
          // For SPL tokens, refresh periodically
          intervalId = setInterval(fetchBalance, 15000) // Refresh every 15 seconds
        }
      } catch (err) {
        console.error("Failed to set up balance subscription:", err)
        // Fallback to periodic refresh
        intervalId = setInterval(fetchBalance, 15000)
      }
    }

    setupSubscription()

    return () => {
      if (subscriptionId !== null) {
        try {
          connection.removeAccountChangeListener(subscriptionId)
        } catch (err) {
          console.error("Error removing account change listener:", err)
        }
      }
      if (intervalId !== null) {
        clearInterval(intervalId)
      }
    }
  }, [connection, publicKey, tokenAddress, connected, fetchBalance])

  // Refresh balance when wallet connects/disconnects
  useEffect(() => {
    if (connected) {
      fetchBalance()
    } else {
      setBalance(null)
      setError(null)
    }
  }, [connected, fetchBalance])

  return { balance, loading, error, refetch: fetchBalance }
}
