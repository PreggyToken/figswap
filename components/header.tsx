"use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Activity, Shield, Zap, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b transition-colors duration-300 backdrop-blur-xl relative z-20 dark-theme:border-slate-700/50 dark-theme:bg-slate-900/80 light-theme:border-slate-200 light-theme:bg-white/90">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Image
                src="/figswap-logo.jpg"
                alt="FigSwap Logo"
                width={40}
                height={40}
                className="sm:w-12 sm:h-12 rounded-xl shadow-lg ring-2 transition-colors dark-theme:ring-slate-600/30 light-theme:ring-slate-300"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold transition-colors dark-theme:text-white light-theme:text-slate-800">
                FigSwap
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs sm:text-sm transition-colors dark-theme:text-slate-400 light-theme:text-slate-500">
                  Advanced Solana DEX
                </p>
                <Badge className="bg-emerald-600 text-white text-xs px-2 py-1">Live</Badge>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span>Jupiter Powered</span>
              </div>
              <div className="flex items-center space-x-2 transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>MEV Protected</span>
              </div>
              <div className="flex items-center space-x-2 transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast Execution</span>
              </div>
            </div>

            <ThemeToggle />

            <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !font-medium !shadow-lg !text-white !border-0 !transition-all !duration-200 !h-10" />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="transition-colors dark-theme:text-slate-400 dark-theme:hover:text-white light-theme:text-slate-600 light-theme:hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t transition-colors dark-theme:border-slate-700 light-theme:border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span>Jupiter Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>MEV Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-sm transition-colors dark-theme:text-slate-300 light-theme:text-slate-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast Execution</span>
              </div>
              <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !font-medium !shadow-lg !text-white !border-0 !transition-all !duration-200 !w-full !h-12" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
