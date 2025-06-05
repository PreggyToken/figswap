"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useSwapExecution } from "@/hooks/use-swap-execution"
import { Loader2, ArrowRightLeft, Shield, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

interface SwapButtonProps {
  fromToken: Token
  toToken: Token
  fromAmount: string
  quote: any
  slippage: number
  disabled: boolean
  useMEVProtection: boolean
}

export function SwapButton({
  fromToken,
  toToken,
  fromAmount,
  quote,
  slippage,
  disabled,
  useMEVProtection,
}: SwapButtonProps) {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { executeSwap, loading, mevProtectionActive } = useSwapExecution()
  const { toast } = useToast()
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapResult, setSwapResult] = useState<{
    success: boolean
    signature?: string
    error?: string
  } | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)

  const handleSwap = async () => {
    if (!connected || !publicKey || !quote) return

    setIsSwapping(true)
    setSwapResult(null)

    try {
      const signature = await executeSwap({
        quote,
        userPublicKey: publicKey.toString(),
        useMEVProtection,
      })

      // Set successful result
      setSwapResult({
        success: true,
        signature,
      })

      // Show toast
      toast({
        title: "Swap Successful! 🎉",
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}`,
      })

      // Show result dialog
      setShowResultDialog(true)

      console.log("Swap successful:", signature)
    } catch (error) {
      console.error("Swap failed:", error)

      // Set error result
      setSwapResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })

      // Show toast
      toast({
        title: "Swap Failed ❌",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })

      // Show result dialog
      setShowResultDialog(true)
    } finally {
      setIsSwapping(false)
    }
  }

  if (!connected) {
    return (
      <Button
        onClick={() => setVisible(true)}
        className="w-full accent-gradient hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 hover-lift"
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleSwap}
        disabled={disabled || isSwapping || loading}
        className="w-full accent-gradient hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:transform-none"
      >
        {isSwapping || loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {mevProtectionActive ? "Protected Swap in Progress..." : "Swapping..."}
          </>
        ) : (
          <>
            {useMEVProtection && <Shield className="mr-2 h-5 w-5 text-emerald-300" />}
            {!useMEVProtection && <ArrowRightLeft className="mr-2 h-5 w-5" />}
            Swap {fromToken.symbol} for {toToken.symbol}
          </>
        )}
      </Button>

      {/* Swap Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="glass-card border-slate-700/50 dark:border-slate-700/50 light:border-slate-300 text-white dark:text-white light:text-slate-800 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              {swapResult?.success ? (
                <>
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span>Swap Successful!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span>Swap Failed</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {swapResult?.success ? (
              <>
                <div className="glass-card-light p-4 rounded-lg border-slate-600/30 dark:border-slate-600/30 light:border-slate-200">
                  <div className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 mb-2">
                    Transaction Details
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">From</span>
                      <span className="font-semibold">
                        {fromAmount} {fromToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">To</span>
                      <span className="font-semibold">
                        {(Number.parseInt(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(6)}{" "}
                        {toToken.symbol}
                      </span>
                    </div>
                    {useMEVProtection && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">
                          Protection
                        </span>
                        <span className="text-emerald-500 font-semibold flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          MEV Protected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-300 dark:text-slate-300 light:text-slate-600">Transaction Hash</span>
                  </div>
                  <a
                    href={`https://solscan.io/tx/${swapResult.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 p-2 rounded block break-all hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-slate-200 transition-colors"
                  >
                    {swapResult.signature}
                  </a>
                </div>

                <Button className="w-full accent-gradient hover:opacity-90" onClick={() => setShowResultDialog(false)}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <div className="glass-card-light p-4 rounded-lg border-red-500/30">
                  <div className="text-sm text-red-400 dark:text-red-400 light:text-red-600 mb-2">Error Details</div>
                  <div className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 p-3 rounded">
                    {swapResult?.error || "Unknown error occurred during swap"}
                  </div>
                </div>

                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">
                  <p>Possible solutions:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Check your wallet balance</li>
                    <li>Try with a smaller amount</li>
                    <li>Increase slippage tolerance</li>
                    <li>Try again later when network conditions improve</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                    onClick={() => setShowResultDialog(false)}
                  >
                    Close
                  </Button>
                  <Button className="flex-1 accent-gradient hover:opacity-90" onClick={handleSwap}>
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
