"use client"

import type React from "react"

import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  CloverWalletAdapter,
  BitgetWalletAdapter,
  BitpieWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"
import { QUICKNODE_CONFIG } from "@/lib/config"

require("@solana/wallet-adapter-react-ui/styles.css")

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => QUICKNODE_CONFIG.HTTPS_ENDPOINT || clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BitgetWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new CloverWalletAdapter(),
      new BitpieWalletAdapter(),
    ],
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
