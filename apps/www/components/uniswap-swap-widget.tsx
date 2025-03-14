"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";

const tokenAddress = "0xYourTokenAddress"; // Replace with BUZZ contract address

export function UniswapSwapWidget() {
  return (
    <div className="rounded-lg border border-border p-4 shadow-md bg-background">
      <p className="text-lg font-medium">💱 Swap $BUZZ Instantly</p>
      <p className="text-sm text-muted-foreground">
        Trade $BUZZ securely via Uniswap.
      </p>

      {/* ✅ Placeholder for Swap Widget */}
      <div className="mt-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted">
        <p className="text-muted-foreground">🔄 Uniswap Widget Coming Soon</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
  {/* "Powered by:" + Coinbase Icon */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Powered by:</span>
    <Icons.coinbase className="w-6 h-6" /> {/* Same size */}
  </div>

  {/* Uniswap Icon + "Buy on Uniswap" in One Row */}
  <Link
    href={`https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}`}
    target="_blank"
    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
  >
    <Icons.uniswap className="w-6 h-6" /> {/* Set to same size as Coinbase */}
    <span className="leading-none">Buy on Uniswap ↗</span> {/* Ensures text aligns well */}
  </Link>
</div>



        </div>
  );
}
