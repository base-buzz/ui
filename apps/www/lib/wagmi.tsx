"use client";

import React from "react";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance (if using React Query).
const queryClient = new QueryClient();

// Explicitly type the Wagmi config so TS doesn’t try to reference internal library types.
type MyConfig = ReturnType<typeof getDefaultConfig>;

export const config: MyConfig = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID", // Must be obtained from WalletConnect Cloud
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    // process.env for testnets, if you want:
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true, // If your Next.js app uses SSR
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
