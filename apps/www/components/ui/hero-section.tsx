"use client";

import { Button } from "@/components/ui/button";
import { UniswapSwapWidget } from "@/components/uniswap-swap-widget";
import { EarlyAdopter } from "@/components/EarlyAdopter";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="container-wrapper">
        <div className="container grid grid-cols-1 items-center gap-8 py-8 text-center md:grid-cols-2 md:pt-24 md:text-left">
          
          {/* ✅ Left Column: Main Hero Messaging */}
          <div className="flex flex-col items-center space-y-6 md:items-start">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              🚀 The AI-Powered DeFi Ecosystem on Base
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              $BUZZ fuels the future of on-chain speculation, governance, and real-world finance.
            </p>

            {/* ✅ Call to Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Button variant="default" size="lg" className="transition hover:scale-105">
                Connect Wallet & Explore
              </Button>
              <Button variant="secondary" size="lg" className="transition hover:scale-105">
                See the Roadmap
              </Button>
            </div>
          </div>

          {/* ✅ Right Column: Uniswap Swap Box */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <UniswapSwapWidget />
          </div>
        </div>

        {/* ✅ Early Adopter Reward Sprint Moved to Separate Component */}
        <EarlyAdopter />
      </div>
    </section>
  );
}
