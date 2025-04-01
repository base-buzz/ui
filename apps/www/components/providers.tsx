"use client";

import * as React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { UserProvider } from "@/contexts/user-context";
import { AuthProvider } from "@/contexts/auth-context";
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
  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);

  const openWalletSheet = () => setIsWalletSheetOpen(true);
  const closeWalletSheet = () => setIsWalletSheetOpen(false);
  const toggleWalletSheet = () => setIsWalletSheetOpen((prev) => !prev);

  // Use a longer-running effect to ensure hydration is complete
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing during the initial hydration
  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <WalletSheetContext.Provider
            value={{
              isWalletSheetOpen,
              openWalletSheet,
              closeWalletSheet,
              toggleWalletSheet,
            }}
          >
            <AuthProvider>
              <UserProvider>
                {children}
                <ServiceWorkerRegistration />
              </UserProvider>
            </AuthProvider>
          </WalletSheetContext.Provider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
