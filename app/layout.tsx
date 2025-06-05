import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FigSwap - Advanced Solana Token Swap",
  description: "Fast, secure, and intelligent Solana token swapping with real-time liquidity data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
