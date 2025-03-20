"use client";
/* eslint-disable turbo/no-undeclared-env-vars */

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
  baseGoerli,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance (if using React Query).
const queryClient = new QueryClient();

// Determine which projectId to use
const projectId =
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID_TESTNET
    : process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID_MAINNET;

// Ensure projectId is set, or throw a clear error
if (!projectId) {
  throw new Error(
    "Missing WalletConnect Project ID. Please set it in .env.local.",
  );
}

// Explicitly type the Wagmi config so TS doesn’t try to reference internal library types.
type MyConfig = ReturnType<typeof getDefaultConfig>;

export const config: MyConfig = getDefaultConfig({
  appName: "BaseBuzz",
  projectId,
  chains: [
    base, // Base Mainnet ✅
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [baseGoerli] : []), // Base Goerli ✅
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
