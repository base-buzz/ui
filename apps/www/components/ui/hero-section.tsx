"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import clsx from "clsx";

const getRandomValue = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function HeroSection() {
  const [transactions, setTransactions] = useState([
    "Buy: 0x123...456 → $250 BUZZ",
    "Sell: 0x456...789 → $180 BUZZ",
  ]);
  const [marketVolume, setMarketVolume] = useState(900000); // Start under 1M
  const [whaleBuy, setWhaleBuy] = useState(800); // Whale buys <1200
  const [trendingToken, setTrendingToken] = useState("$MELONI4ELON");
  const [mintedTokens, setMintedTokens] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(7 * 24 * 60 * 60); // Countdown in seconds (1 week)
  const [shakeTransactions, setShakeTransactions] = useState(false);

  // ✅ Updates market volume (goes up or down)
  useEffect(() => {
    const volumeInterval = setInterval(() => {
      setMarketVolume((prev) =>
        prev + getRandomValue(-2000, 4000) // Can decrease or increase
      );
    }, 2000);

    return () => clearInterval(volumeInterval);
  }, []);

  // ✅ Updates whale buy value every 5 minutes
  useEffect(() => {
    const whaleInterval = setInterval(() => {
      setWhaleBuy(getRandomValue(400, 1200));
    }, 300000);

    return () => clearInterval(whaleInterval);
  }, []);

  // ✅ Updates transaction list every 5 seconds & shakes on update
  useEffect(() => {
    const transactionInterval = setInterval(() => {
      const type = Math.random() > 0.5 ? "Buy" : "Sell";
      const amount = getRandomValue(1, 355);
      const newTx = `${type}: 0x${getRandomValue(100, 999)}...${getRandomValue(
        100,
        999
      )} → $${amount} BUZZ`;

      setTransactions((prev) => [newTx, ...prev.slice(0, 4)]);

      // ✅ Add token to market stats if it's a mint
      if (type === "Buy" && Math.random() > 0.8) {
        const newToken = `$TOKEN${getRandomValue(1, 99)}`;
        setMintedTokens((prev) => [newToken, ...prev.slice(0, 2)]);
      }

      // ✅ Trigger shake effect
      setShakeTransactions(true);
      setTimeout(() => setShakeTransactions(false), 1000);
    }, 5000);

    return () => clearInterval(transactionInterval);
  }, []);

  // ✅ Countdown timer for "Early Adopter Reward Sprint"
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 7 * 24 * 60 * 60));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // ✅ Random Flash Interval (1-3s)
  useEffect(() => {
    const flashInterval = setInterval(() => {
      setShakeTransactions(true);
      setTimeout(() => setShakeTransactions(false), 1000);
    }, getRandomValue(1000, 3000));

    return () => clearInterval(flashInterval);
  }, []);

  // Convert seconds to readable format
  const formatCountdown = () => {
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    return `${days} Days ${hours} Hrs ${minutes} Min`;
  };

  return (
    <section className="border-b border-border">
      <div className="container-wrapper">
        <div className="container grid grid-cols-1 items-center gap-8 pt-16 text-center md:grid-cols-2 md:pt-24 md:text-left">
          
          {/* ✅ Left Column: Main Hero Messaging */}
          <div className="flex flex-col items-center space-y-6 md:items-start">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              🚀 The AI-Powered DeFi Ecosystem on Base
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              $BUZZ fuels the future of on-chain speculation, governance, and real-world finance.
            </p>
    
            {/* Call to Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Button variant="default" size="lg" className="transition hover:scale-105">
                Connect Wallet & Explore
              </Button>
              <Button variant="secondary" size="lg" className="transition hover:scale-105">
                See the Roadmap
              </Button>
            </div>
          </div>

          {/* ✅ Right Column: Live Market Stats */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="animate-fade-in rounded-lg border border-border p-4 shadow-md">
              <p className="text-lg font-medium">📊 Live Market Stats</p>
              <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-2">
                <div className="animate-count text-xl font-bold text-primary">
                  💸 Total Market Volume: ${marketVolume.toLocaleString()}
                </div>
                <div className="animate-marquee">
                  🔥 Trending: <span className="text-primary">$MELONI4ELON 🚀</span>
                </div>
                {mintedTokens.map((token, index) => (
                  <div key={index} className="text-sm text-primary">
                    🆕 New Token: {token}
                  </div>
                ))}
                <div className="animate-pulse text-xl font-bold text-primary">
                  🐋 Whale Buy: +${whaleBuy.toLocaleString()} BUZZ
                </div>
              </div>
            </div>

            {/* ✅ Recent Transactions (Shakes on update) */}
            <div
              className={clsx(
                "overflow-hidden rounded-lg border border-border p-4 shadow-md transition",
                { "animate-shake-flash": shakeTransactions }
              )}
            >
              <p className="text-lg font-medium">⚡ Recent Transactions</p>
              <div className="ticker">
                <div className="ticker__wrapper">
                  {transactions.map((tx, index) => (
                    <div key={index} className="ticker__item">
                      {tx}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Early Adopter Reward Sprint Countdown (Fixed Spacing) */}
        <div className="col-span-2 w-full space-y-8 border-t border-border pt-6">
          <p className="text-center text-lg font-medium">
            🔥 Early Adopter Reward Sprint ENDS IN:{" "}
            <span className="text-red-500">{formatCountdown()}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="transition hover:scale-105">
              🎖️ Claim Reputation Badge
            </Badge>
            <Badge variant="secondary" className="transition hover:scale-105">
              ⚡ Governance Boost
            </Badge>
            <Badge variant="secondary" className="transition hover:scale-105">
              💰 LP Gas Rebates
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
