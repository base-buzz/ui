"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Determine which projectId to use
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

// Ensure projectId is set, or throw a clear error
if (!projectId) {
  throw new Error(
    "Missing WalletConnect Project ID. Please set it in .env.local.",
  );
}

export const chains = [base, mainnet] as const;

export const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

// Create the RainbowKit config
export const wagmiConfig = getDefaultConfig({
  appName: "BaseBuzz",
  projectId,
  chains,
  ssr: true,
}) as const;
