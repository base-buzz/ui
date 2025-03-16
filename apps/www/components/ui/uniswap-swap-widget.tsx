import Image from "next/image";

export function UniswapSwapWidget() {
  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-md">
      <p className="text-lg font-medium">💱 Swap $BASEBUZZ Instantly</p>
      <p className="text-sm text-muted-foreground">
        Trade $BASEBUZZ securely via Uniswap.
      </p>

      {/* ✅ Placeholder for Swap Widget */}
      <div className="mt-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted">
        <p className="text-muted-foreground">🔄 Uniswap Widget Coming Soon</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {/* "Powered by:" + Base Logo (Switches in Dark Mode) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Powered by:</span>

          {/* Default: Light Mode */}
          <Image
            src="/icons/Base_Wordmark_Blue.png"
            alt="Base"
            width={50}
            height={10}
            className="block dark:hidden"
          />

          {/* Dark Mode Version */}
          <Image
            src="/icons/Base_Wordmark_White.png"
            alt="Base"
            width={50}
            height={10}
            className="hidden dark:block"
          />
        </div>

        {/* Uniswap Icon + "Buy on Uniswap" in One Row */}
        <a
          href="https://app.uniswap.org/#/swap?outputCurrency=0xYourTokenAddress"
          target="_blank"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <span className="leading-none">Buy on ↗</span>
          <Image
            src="/icons/Uniswap_Logo_and_Wordmark.png"
            alt="Uniswap"
            width={90}
            height={20}
          />
        </a>
      </div>
    </div>
  );
}
