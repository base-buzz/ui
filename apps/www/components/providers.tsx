"use client";

import * as React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

// Create a React Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  // Use a longer-running effect to ensure hydration is complete
  // This prevents flashing of unauthenticated state on refresh
  React.useEffect(() => {
    // Delay setting mounted state slightly to ensure wallet state is loaded
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200); // Small delay for hydration

    return () => clearTimeout(timer);
  }, []);

  // Show nothing during the initial hydration
  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
