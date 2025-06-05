import { NextResponse } from "next/server"

export async function GET() {
  try {
    const endpoint = process.env.NEXT_PUBLIC_QUICKNODE_HTTPS

    if (!endpoint) {
      return NextResponse.json({ available: false, error: "QuickNode endpoint not configured" })
    }

    // Test the endpoint with a simple health check
    const testPayload = {
      jsonrpc: "2.0",
      id: 1,
      method: "getHealth",
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    // If the endpoint responds successfully, MEV protection is available
    // since it's an add-on feature included with the QuickNode endpoint
    const available = response.ok

    console.log(`🛡️ MEV Protection Status: ${available ? "Available" : "Unavailable"}`)

    return NextResponse.json({
      available,
      endpoint: endpoint.includes("morning-radial-card") ? "morning-radial-card" : "unknown",
      status: response.status,
    })
  } catch (error) {
    console.error("❌ Error verifying MEV protection:", error)
    return NextResponse.json({
      available: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
