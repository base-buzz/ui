"use client";

import * as React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { UserProvider } from "@/contexts/user-context";
import "@rainbow-me/rainbowkit/styles.css";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import { createContext, useContext, useState } from "react";

// Create a React Query client
const queryClient = new QueryClient();

// Create a context for the wallet sheet
interface WalletSheetContextType {
  isWalletSheetOpen: boolean;
  openWalletSheet: () => void;
  closeWalletSheet: () => void;
  toggleWalletSheet: () => void;
}

const WalletSheetContext = createContext<WalletSheetContextType | undefined>(
  undefined,
);

export function useWalletSheetContext() {
  const context = useContext(WalletSheetContext);
  if (!context) {
    throw new Error(
      "useWalletSheetContext must be used within a WalletSheetProvider",
    );
  }
  return context;
}

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

  // Wallet sheet state
  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);

  const openWalletSheet = () => setIsWalletSheetOpen(true);
  const closeWalletSheet = () => setIsWalletSheetOpen(false);
  const toggleWalletSheet = () => setIsWalletSheetOpen((prev) => !prev);

  // Show nothing during the initial hydration
  if (!mounted) {
    return null;
  }

  return (
    <WalletSheetContext.Provider
      value={{
        isWalletSheetOpen,
        openWalletSheet,
        closeWalletSheet,
        toggleWalletSheet,
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <UserProvider>
              {children}
              <ServiceWorkerRegistration />
            </UserProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </WalletSheetContext.Provider>
  );
}
