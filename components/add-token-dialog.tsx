"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTokenMetadata } from "@/hooks/use-token-metadata"
import { Plus, Loader2, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

interface AddTokenDialogProps {
  onTokenAdd: (token: Token) => void
}

export function AddTokenDialog({ onTokenAdd }: AddTokenDialogProps) {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState("")
  const [previewToken, setPreviewToken] = useState<Token | null>(null)
  const { fetchTokenMetadata, loading, error } = useTokenMetadata()

  const handleAddressChange = (value: string) => {
    setAddress(value)
    setPreviewToken(null)
  }

  const handlePreview = async () => {
    if (!address.trim()) return

    try {
      const metadata = await fetchTokenMetadata(address.trim())
      if (metadata) {
        setPreviewToken({
          address: metadata.address,
          symbol: metadata.symbol,
          name: metadata.name,
          decimals: metadata.decimals,
          logoURI: metadata.logoURI,
        })
      }
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleAddToken = () => {
    if (previewToken) {
      onTokenAdd(previewToken)
      setOpen(false)
      setAddress("")
      setPreviewToken(null)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setAddress("")
    setPreviewToken(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-slate-800/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Token
        </Button>
      </DialogTrigger>

      <DialogContent className="glass-card border-slate-700/50 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add Custom Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="token-address" className="text-sm font-medium text-slate-300">
              Token Contract Address
            </Label>
            <div className="flex space-x-2">
              <Input
                id="token-address"
                placeholder="Enter Solana token address..."
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400"
              />
              <Button
                onClick={handlePreview}
                disabled={!address.trim() || loading}
                className="accent-gradient hover:opacity-90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Preview"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 text-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewToken && (
            <div className="glass-card-light border-slate-600/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">Token Found!</span>
              </div>

              <div className="flex items-center space-x-4">
                {previewToken.logoURI && (
                  <img
                    src={previewToken.logoURI || "/placeholder.svg"}
                    alt={previewToken.symbol}
                    className="w-12 h-12 rounded-full border-2 border-slate-600"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold text-lg text-white">{previewToken.symbol}</div>
                  <div className="text-sm text-slate-300">{previewToken.name}</div>
                  <div className="text-xs text-slate-400">Decimals: {previewToken.decimals}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ExternalLink className="h-3 w-3" />
                <span className="font-mono break-all">{previewToken.address}</span>
              </div>

              <Button onClick={handleAddToken} className="w-full accent-gradient hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Token to List
              </Button>
            </div>
          )}

          <div className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
            <strong>⚠️ Security Notice:</strong> Always verify token addresses from official sources. Adding custom
            tokens carries risks including potential scams or rug pulls.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
