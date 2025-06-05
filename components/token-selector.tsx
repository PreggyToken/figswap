"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddTokenDialog } from "@/components/add-token-dialog"
import { ChevronDown, Search, TrendingUp, AlertTriangle, Star, Verified } from "lucide-react"
import { POPULAR_TOKENS, LOW_LIQUIDITY_THRESHOLD } from "@/lib/config"
import { useTokenListFromDAS } from "@/hooks/use-token-list-from-das"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  verified?: boolean
  custom?: boolean
}

interface LiquidityData {
  tvl: number
  volume24h: number
  pairs: number
}

interface TokenSelectorProps {
  selectedToken: Token
  onTokenSelect: (token: Token) => void
  excludeToken?: string
  liquidityData?: Record<string, LiquidityData>
}

export function TokenSelector({ selectedToken, onTokenSelect, excludeToken, liquidityData }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customTokens, setCustomTokens] = useState<Token[]>([])
  const { userTokens, loading } = useTokenListFromDAS()

  const popularTokensWithVerified = POPULAR_TOKENS.map((token) => ({ ...token, verified: true }))
  const allTokens = [...popularTokensWithVerified, ...userTokens, ...customTokens].filter(
    (token, index, self) =>
      token.address !== excludeToken && self.findIndex((t) => t.address === token.address) === index,
  )

  const filteredTokens = allTokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedTokens = filteredTokens.sort((a, b) => {
    if (a.verified && !b.verified) return -1
    if (!a.verified && b.verified) return 1

    const aLiquidity = liquidityData?.[a.address]?.tvl || 0
    const bLiquidity = liquidityData?.[b.address]?.tvl || 0
    if (aLiquidity !== bLiquidity) return bLiquidity - aLiquidity

    return a.symbol.localeCompare(b.symbol)
  })

  const handleTokenSelect = (token: Token) => {
    console.log("🔄 Token selected:", token.symbol, token.address)
    onTokenSelect(token)
    setOpen(false)
    setSearchQuery("")
  }

  const handleCustomTokenAdd = (token: Token) => {
    const newToken = { ...token, custom: true }
    setCustomTokens((prev) => [...prev, newToken])
    console.log("✅ Custom token added:", newToken)
  }

  const getTokenLiquidityStatus = (tokenAddress: string) => {
    const data = liquidityData?.[tokenAddress]
    if (!data) return null

    if (data.tvl < LOW_LIQUIDITY_THRESHOLD) {
      return { status: "low", color: "bg-orange-500" }
    } else if (data.tvl > 1000000) {
      return { status: "high", color: "bg-emerald-500" }
    }
    return { status: "medium", color: "bg-yellow-500" }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 min-w-[120px] sm:min-w-[140px] transition-colors mobile-button dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-white dark-theme:hover:bg-slate-700/50 dark-theme:hover:border-slate-500 light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-800 light-theme:hover:bg-slate-100 light-theme:hover:border-slate-400 rounded-xl h-12 sm:h-16 transition-all duration-200"
        >
          {selectedToken.logoURI && (
            <img
              src={selectedToken.logoURI || "/placeholder.svg"}
              alt={selectedToken.symbol}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          )}
          <div className="text-left flex-1">
            <div className="font-bold text-xs sm:text-sm flex items-center space-x-1">
              <span>{selectedToken.symbol}</span>
              {selectedToken.verified && <Verified className="h-2 w-2 sm:h-3 sm:w-3 text-blue-400" />}
            </div>
            <div className="text-xs transition-colors dark-theme:text-slate-400 light-theme:text-slate-500 truncate hidden sm:block">
              {selectedToken.name}
            </div>
          </div>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-colors dark-theme:text-slate-400 light-theme:text-slate-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-md glass-card transition-colors dark-theme:border-slate-700/50 dark-theme:text-white light-theme:border-slate-300 light-theme:text-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold transition-colors dark-theme:text-white light-theme:text-slate-800">
            Select Token
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors dark-theme:text-slate-400 light-theme:text-slate-500" />
            <Input
              placeholder="Search tokens or paste address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mobile-input transition-colors dark-theme:bg-slate-800/50 dark-theme:border-slate-600 dark-theme:text-white dark-theme:placeholder-slate-400 light-theme:bg-white light-theme:border-slate-300 light-theme:text-slate-800 light-theme:placeholder-slate-500 focus:border-emerald-400"
            />
          </div>

          <AddTokenDialog onTokenAdd={handleCustomTokenAdd} />

          <div className="max-h-60 sm:max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
            {loading ? (
              <div className="text-center py-8 transition-colors dark-theme:text-slate-400 light-theme:text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-2 mobile-text">Loading tokens...</p>
              </div>
            ) : sortedTokens.length === 0 ? (
              <div className="text-center py-8 transition-colors dark-theme:text-slate-400 light-theme:text-slate-500 mobile-text">
                {searchQuery ? `No tokens found for "${searchQuery}"` : "No tokens found"}
              </div>
            ) : (
              <>
                {/* Popular Tokens Section */}
                {!searchQuery && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3 px-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">Popular Tokens</span>
                    </div>
                    {popularTokensWithVerified
                      .filter((token) => token.address !== excludeToken)
                      .slice(0, 6)
                      .map((token) => {
                        const liquidityStatus = getTokenLiquidityStatus(token.address)
                        const tokenLiquidity = liquidityData?.[token.address]

                        return (
                          <Button
                            key={token.address}
                            variant="ghost"
                            className="w-full justify-start p-3 sm:p-4 h-auto transition-colors dark-theme:hover:bg-slate-700/50 light-theme:hover:bg-slate-100 rounded-lg transition-all duration-200"
                            onClick={() => handleTokenSelect(token)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-3">
                                {token.logoURI && (
                                  <img
                                    src={token.logoURI || "/placeholder.svg"}
                                    alt={token.symbol}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none"
                                    }}
                                  />
                                )}
                                <div className="text-left">
                                  <div className="font-bold flex items-center space-x-2 mobile-text">
                                    <span>{token.symbol}</span>
                                    {token.verified && <Verified className="h-3 w-3 text-blue-400" />}
                                    {liquidityStatus && (
                                      <div className={`w-2 h-2 rounded-full ${liquidityStatus.color}`}></div>
                                    )}
                                  </div>
                                  <div className="text-sm transition-colors dark-theme:text-slate-400 light-theme:text-slate-500 truncate max-w-[120px] sm:max-w-[150px]">
                                    {token.name}
                                  </div>
                                  {tokenLiquidity && (
                                    <div className="text-xs text-emerald-400">
                                      TVL: ${(tokenLiquidity.tvl / 1000000).toFixed(1)}M
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-1">
                                {liquidityStatus?.status === "high" && (
                                  <Badge variant="outline" className="text-emerald-400 border-emerald-400 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    High
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Button>
                        )
                      })}
                  </div>
                )}

                {/* All Tokens Section */}
                {(searchQuery || sortedTokens.length > 6) && (
                  <div>
                    {!searchQuery && (
                      <div className="text-sm font-semibold transition-colors dark-theme:text-slate-400 light-theme:text-slate-500 mb-2 px-2">
                        All Tokens
                      </div>
                    )}
                    {sortedTokens.map((token) => {
                      const liquidityStatus = getTokenLiquidityStatus(token.address)
                      const tokenLiquidity = liquidityData?.[token.address]

                      return (
                        <Button
                          key={token.address}
                          variant="ghost"
                          className="w-full justify-start p-3 sm:p-4 h-auto transition-colors dark-theme:hover:bg-slate-700/50 light-theme:hover:bg-slate-100 rounded-lg transition-all duration-200"
                          onClick={() => handleTokenSelect(token)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              {token.logoURI && (
                                <img
                                  src={token.logoURI || "/placeholder.svg"}
                                  alt={token.symbol}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              )}
                              <div className="text-left">
                                <div className="font-bold flex items-center space-x-2 mobile-text">
                                  <span>{token.symbol}</span>
                                  {token.verified && <Verified className="h-3 w-3 text-blue-400" />}
                                  {token.custom && <Badge className="text-xs bg-blue-600">Custom</Badge>}
                                  {liquidityStatus && (
                                    <div className={`w-2 h-2 rounded-full ${liquidityStatus.color}`}></div>
                                  )}
                                </div>
                                <div className="text-sm transition-colors dark-theme:text-slate-400 light-theme:text-slate-500 truncate max-w-[120px] sm:max-w-[150px]">
                                  {token.name}
                                </div>
                                {tokenLiquidity && (
                                  <div className="text-xs text-emerald-400">
                                    TVL: ${(tokenLiquidity.tvl / 1000000).toFixed(1)}M
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-1">
                              {liquidityStatus?.status === "low" && (
                                <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Low
                                </Badge>
                              )}

                              {liquidityStatus?.status === "high" && (
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400 text-xs">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  High
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
