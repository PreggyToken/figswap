import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { serializedTransaction } = await request.json()

    if (!serializedTransaction) {
      return NextResponse.json({ error: "Missing serialized transaction" }, { status: 400 })
    }

    const endpoint = process.env.NEXT_PUBLIC_QUICKNODE_HTTPS

    if (!endpoint) {
      return NextResponse.json({ error: "QuickNode endpoint not configured" }, { status: 500 })
    }

    console.log("🛡️ Submitting transaction with Blink MEV Protection...")

    // Prepare the payload for Blink MEV Protection
    const payload = {
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1000000),
      method: "sendTransaction",
      params: [
        serializedTransaction,
        {
          encoding: "base64",
          skipPreflight: false,
          preflightCommitment: "confirmed",
          maxRetries: 3,
        },
      ],
    }

    // Send the transaction through QuickNode with Blink MEV protection
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-qn-api-version": "1",
        "x-qn-mev-protection": "enabled", // Enable Blink MEV protection
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Blink MEV protection failed:", response.status, errorText)
      return NextResponse.json({ error: `MEV protection failed: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    if (data.error) {
      console.error("❌ Transaction error:", data.error)
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    console.log("✅ Transaction successfully protected by Blink MEV Protection")
    console.log("🔗 Transaction signature:", data.result)

    return NextResponse.json({
      signature: data.result,
      protected: true,
    })
  } catch (error) {
    console.error("❌ Error in MEV protection API:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
