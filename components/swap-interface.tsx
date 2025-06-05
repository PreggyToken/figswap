"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TokenSelector } from "@/components/token-selector"
import { SlippageSettings } from "@/components/slippage-settings"
import { SwapButton } from "@/components/swap-button"
import { LiquidityInfo } from "@/components/liquidity-info"
import { MEVProtectionToggle } from "@/components/mev-protection-toggle"
import { useJupiterQuote } from "@/hooks/use-jupiter-quote"
import { useTokenPrices } from "@/hooks/use-token-prices"
import { useLiquidityData } from "@/hooks/use-liquidity-data"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { ArrowUpDown, Settings, AlertTriangle, ArrowRightLeft, Wallet, RefreshCw } from "lucide-react"
import { POPULAR_TOKENS, DEFAULT_SLIPPAGE, LOW_LIQUIDITY_THRESHOLD } from "@/lib/config"

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(POPULAR_TOKENS[0])
  const [toToken, setToToken] = useState(POPULAR_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)
  const [showSettings, setShowSettings] = useState(false)
  const [useMEVProtection, setUseMEVProtection] = useState(true)

  const {
    quote,
    loading: quoteLoading,
    error: quoteError,
  } = useJupiterQuote({
    inputMint: fromToken.address,
    outputMint: toToken.address,
    amount: fromAmount,
    slippageBps: Math.floor(slippage * 100),
  })

  const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices([fromToken.address, toToken.address])
  const { liquidityData, loading: liquidityLoading } = useLiquidityData([fromToken.address, toToken.address])
  const {
    balance: fromTokenBalance,
    loading: balanceLoading,
    refetch: refetchBalance,
  } = useTokenBalance(fromToken.address)

  const handleFromTokenSelect = useCallback(
    (token: any) => {
      console.log("🔄 From token changed to:", token.symbol)
      if (token.address === toToken.address) {
        setToToken(fromToken)
      }
      setFromToken(token)
      setFromAmount("")
    },
    [fromToken, toToken],
  )

  const handleToTokenSelect = useCallback(
    (token: any) => {
      console.log("🔄 To token changed to:", token.symbol)
      if (token.address === fromToken.address) {
        setFromToken(toToken)
      }
      setToToken(token)
    },
    [fromToken, toToken],
  )

  const handleSwapTokens = useCallback(() => {
    console.log("🔄 Swapping tokens")
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount("")
  }, [fromToken, toToken])

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
    }
  }, [])

  const handleMaxClick = useCallback(() => {
    if (fromTokenBalance) {
      // For SOL, leave 0.001 SOL for transaction fees
      if (fromToken.address === "So11111111111111111111111111111111111111112") {
        const maxAmount = Math.max(0, fromTokenBalance.uiAmount - 0.001) // Leave 0.001 SOL for fees
        setFromAmount(maxAmount.toFixed(9)) // Use full precision for SOL
      } else {
        setFromAmount(fromTokenBalance.uiAmount.toString())
      }
    }
  }, [fromTokenBalance, fromToken.address])

  const handleHalfClick = useCallback(() => {
    if (fromTokenBalance) {
      let halfAmount: number

      // For SOL, calculate half but still leave some for fees
      if (fromToken.address === "So11111111111111111111111111111111111111112") {
        const availableAmount = Math.max(0, fromTokenBalance.uiAmount - 0.001)
        halfAmount = availableAmount / 2
        setFromAmount(halfAmount.toFixed(9))
      } else {
        halfAmount = fromTokenBalance.uiAmount / 2
        setFromAmount(halfAmount.toString())
      }
    }
  }, [fromTokenBalance, fromToken.address])

  const fromValueUSD =
    prices[fromToken.address] && fromAmount && !pricesLoading
      ? (Number.parseFloat(fromAmount) * prices[fromToken.address]).toFixed(2)
      : "0.00"

  const toAmount = quote?.outAmount
    ? (Number.parseInt(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(6)
    : "0"

  const toValueUSD =
    prices[toToken.address] && quote?.outAmount && !pricesLoading
      ? ((Number.parseInt(quote.outAmount) / Math.pow(10, toToken.decimals)) * prices[toToken.address]).toFixed(2)
      : "0.00"

  const fromTokenLiquidity = liquidityData[fromToken.address]
  const toTokenLiquidity = liquidityData[toToken.address]
  const hasLowLiquidity =
    (fromTokenLiquidity && fromTokenLiquidity.tvl < LOW_LIQUIDITY_THRESHOLD) ||
    (toTokenLiquidity && toTokenLiquidity.tvl < LOW_LIQUIDITY_THRESHOLD)

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="glass-card hover-lift">
        <CardHeader className="pb-3 sm:pb-4 mobile-padding">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold transition-colors dark-theme:text-white light-theme:text-slate-800 flex items-center space-x-2 sm:space-x-3">
              <ArrowRightLeft className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
              <span>Swap Tokens</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="transition-colors dark-theme:text-slate-400 dark-theme:hover:text-white dark-theme:hover:bg-slate-700/50 light-theme:text-slate-600 light-theme:hover:text-slate-900 light-theme:hover:bg-slate-200 rounded-lg h-8 w-8 sm:h-10 sm:w-10"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          {showSettings && (
            <div className="mt-3 sm:mt-4">
              <SlippageSettings slippage={slippage} onSlippageChange={setSlippage} />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 mobile-padding">
          {/* MEV Protection Toggle */}
          <MEVProtectionToggle enabled={useMEVProtection} onToggle={setUseMEVProtection} />

          {/* Price Error Alert */}
          {pricesError && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10 transition-colors dark-theme:text-yellow-200 light-theme:text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mobile-text">
                Price data unavailable. Using fallback prices for USD estimates.
              </AlertDescription>
            </Alert>
          )}

          {/* Low Liquidity Alert */}
          {hasLowLiquidity && (
            <Alert className="border-orange-500/50 bg-orange-500/10 transition-colors dark-theme:text-orange-200 light-theme:text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mobile-text">
                Low Liquidity Warning: One or more tokens have limited liquidity which may result in higher slippage.
              </AlertDescription>
            </Alert>
          )}

          {/* From Token */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                From
              </span>
              <div className="flex items-center space-x-2">
                {fromTokenBalance && (
                  <div className="flex items-center space-x-1 text-xs transition-colors dark-theme:text-slate-400 light-theme:text-slate-500">
                    <Wallet className="h-3 w-3" />
                    <span>
                      {balanceLoading
                        ? "..."
                        : fromTokenBalance.uiAmount.toFixed(
                            fromToken.address === "So11111111111111111111111111111111111111112" ? 4 : 6,
                          )}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={refetchBalance}
                      className="h-4 w-4 p-0 transition-colors dark-theme:text-slate-400 dark-theme:hover:text-white light-theme:text-slate-500 light-theme:hover:text-slate-700"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <span className="text-emerald-500 font-semibold">
                  {pricesLoading ? "..." : `$${fromValueUSD}`}
                  {pricesError && " (est)"}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2 sm:space-x-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={handleAmountChange}
                    className="text-xl sm:text-2xl font-bold transition-colors mobile-input dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-white dark-theme:placeholder-slate-500 light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-800 light-theme:placeholder-slate-400 focus:border-emerald-500 rounded-xl h-12 sm:h-16"
                  />
                </div>
                <TokenSelector
                  selectedToken={fromToken}
                  onTokenSelect={handleFromTokenSelect}
                  excludeToken={toToken.address}
                  liquidityData={liquidityData}
                />
              </div>

              {/* Balance buttons */}
              {fromTokenBalance && fromTokenBalance.uiAmount > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleHalfClick}
                    disabled={balanceLoading}
                    className="flex-1 mobile-button transition-colors dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-slate-300 dark-theme:hover:bg-slate-700/50 light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-600 light-theme:hover:bg-slate-100"
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMaxClick}
                    disabled={balanceLoading}
                    className="flex-1 mobile-button transition-colors dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-slate-300 dark-theme:hover:bg-slate-700/50 light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-600 light-theme:hover:bg-slate-100"
                  >
                    Max
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full border-2 transition-colors dark-theme:border-slate-600 dark-theme:hover:border-emerald-500 dark-theme:hover:bg-emerald-500/10 light-theme:border-slate-300 light-theme:hover:border-emerald-500 light-theme:hover:bg-emerald-500/10 w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300"
            >
              <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 transition-colors dark-theme:text-slate-400 light-theme:text-slate-600 hover:text-emerald-500" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                To
              </span>
              <span className="text-emerald-500 font-semibold">
                {pricesLoading ? "..." : `$${toValueUSD}`}
                {pricesError && " (est)"}
              </span>
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="text-xl sm:text-2xl font-bold transition-colors mobile-input dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-white light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-800 rounded-xl h-12 sm:h-16"
                />
              </div>
              <TokenSelector
                selectedToken={toToken}
                onTokenSelect={handleToTokenSelect}
                excludeToken={fromToken.address}
                liquidityData={liquidityData}
              />
            </div>
          </div>

          {/* Quote Info */}
          {quote && (
            <div className="glass-card-light p-3 sm:p-4 space-y-3 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                  Exchange Rate
                </span>
                <span className="font-semibold transition-colors dark-theme:text-white light-theme:text-slate-800">
                  1 {fromToken.symbol} ={" "}
                  {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount || "1")).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                  Price Impact
                </span>
                <span
                  className={`font-semibold ${
                    Number.parseFloat(quote.priceImpactPct || "0") > 0.05 ? "text-orange-500" : "text-emerald-500"
                  }`}
                >
                  {quote.priceImpactPct ? `${(Number.parseFloat(quote.priceImpactPct) * 100).toFixed(3)}%` : "< 0.001%"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                  Slippage Tolerance
                </span>
                <span className="font-semibold transition-colors dark-theme:text-white light-theme:text-slate-800">
                  {slippage}%
                </span>
              </div>
              {useMEVProtection && (
                <div className="flex justify-between text-sm">
                  <span className="transition-colors dark-theme:text-slate-400 light-theme:text-slate-600">
                    MEV Protection
                  </span>
                  <span className="font-semibold text-emerald-500">Active</span>
                </div>
              )}
            </div>
          )}

          {/* Swap Button */}
          <SwapButton
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={fromAmount}
            quote={quote}
            slippage={slippage}
            disabled={!fromAmount || !quote || quoteLoading || fromToken.address === toToken.address}
            useMEVProtection={useMEVProtection}
          />

          {quoteError && (
            <Alert className="border-red-500/50 bg-red-500/10 transition-colors dark-theme:text-red-200 light-theme:text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mobile-text">
                {quoteError.includes("Failed to fetch quote")
                  ? "Unable to get quote. Please check your connection and try again."
                  : `Quote Error: ${quoteError}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Liquidity Information - Hidden on mobile to save space */}
      <div className="hidden sm:block">
        <LiquidityInfo
          fromToken={fromToken}
          toToken={toToken}
          liquidityData={liquidityData}
          loading={liquidityLoading}
        />
      </div>
    </div>
  )
}
