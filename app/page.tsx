import { SwapInterface } from "@/components/swap-interface"
import { Header } from "@/components/header"
import { StatsPanel } from "@/components/stats-panel"
import { MarketOverview } from "@/components/market-overview"

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Light theme background */}
      <div className="light-theme:bg-gradient-to-br light-theme:from-slate-50 light-theme:via-white light-theme:to-slate-100 dark-theme:bg-gradient-to-br dark-theme:from-slate-900 dark-theme:via-slate-800 dark-theme:to-slate-900 min-h-screen">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-30 dark-theme:opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23334155' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <Header />

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
          {/* Market Overview */}
          <div className="fade-in-up mb-4 sm:mb-8">
            <MarketOverview />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="lg:col-span-2 slide-in">
              <SwapInterface />
            </div>
            <div className="lg:col-span-1 fade-in-up" style={{ animationDelay: "0.2s" }}>
              <StatsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
