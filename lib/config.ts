export const QUICKNODE_CONFIG = {
  HTTPS_ENDPOINT: process.env.NEXT_PUBLIC_QUICKNODE_HTTPS!,
  WSS_ENDPOINT: process.env.NEXT_PUBLIC_QUICKNODE_WSS!,
}

export const JUPITER_CONFIG = {
  BASE_URL: "https://quote-api.jup.ag/v6",
  SWAP_URL: "https://quote-api.jup.ag/v6/swap",
}

// Log configuration on startup
if (typeof window !== "undefined") {
  console.log("🔧 FigSwap Configuration:")
  console.log("📡 QuickNode HTTPS:", QUICKNODE_CONFIG.HTTPS_ENDPOINT ? "✅ Configured" : "❌ Missing")
  console.log("🔌 QuickNode WSS:", QUICKNODE_CONFIG.WSS_ENDPOINT ? "✅ Configured" : "❌ Missing")

  if (!QUICKNODE_CONFIG.HTTPS_ENDPOINT) {
    console.warn("⚠️ NEXT_PUBLIC_QUICKNODE_HTTPS environment variable is not set!")
  }
}

export const POPULAR_TOKENS = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  {
    address: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    symbol: "stSOL",
    name: "Lido Staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png",
  },
  {
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
  {
    address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    decimals: 6,
    logoURI: "https://static.jup.ag/jup/icon.png",
  },
  {
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    decimals: 5,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
  },
  {
    address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    symbol: "POPCAT",
    name: "Popcat",
    decimals: 9,
    logoURI: "https://cf-ipfs.com/ipfs/QmQxWVZyg1WKzgNhKGzqGgVGkqLGYFjgGgGkqLGYFjgGgG",
  },
  {
    address: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
    symbol: "WEN",
    name: "Wen",
    decimals: 5,
    logoURI: "https://cf-ipfs.com/ipfs/QmWENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
  },
  {
    address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    symbol: "PYTH",
    name: "Pyth Network",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png",
  },
]

export const DEFAULT_SLIPPAGE = 0.5 // 0.5%
export const LOW_LIQUIDITY_THRESHOLD = 100000 // $100k TVL threshold
