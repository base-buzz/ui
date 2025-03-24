/**
 * @file components/ui/wallet/wallet-button.tsx
 * @description Button component for wallet connection actions
 *
 * WalletButton Component
 *
 * A client-side component that provides the main wallet connection interface.
 * Shows a "Connect Wallet" button when not connected, and a button with the
 * connected wallet address when connected. Includes copy functionality for the
 * wallet address and opens a wallet details sheet when clicked.
 */

"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { Copy, Wallet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { WalletSheet } from "@/components/ui/wallet/wallet-sheet";
import Image from "next/image";

export function WalletButton() {
  // Wagmi hook for wallet state
  const { address, isConnected } = useAccount();

  // Local state for wallet sheet visibility
  const [open, setOpen] = useState(false);

  // Custom hook for clipboard operations
  const { copy, copied } = useClipboard();

  // RainbowKit hook for opening the connect modal
  const { openConnectModal } = useConnectModal();

  return (
    <>
      {isConnected ? (
        // Connected wallet state
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(true)}
        >
          {/* Wallet avatar */}
          <Image
            src="/avatars/01.png"
            alt="Wallet Avatar"
            width="10"
            height="10"
            className="h-5 w-5 rounded-full"
          />
          {/* Truncated wallet address */}
          <span className="max-w-[100px] truncate">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          {/* Copy button with success state */}
          <div
            className="relative flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              copy(address ?? "");
            }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500 opacity-100 transition-opacity" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 opacity-0 transition-opacity hover:opacity-100" />
            )}
          </div>
        </Button>
      ) : (
        // Disconnected wallet state
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-lg bg-background text-foreground hover:bg-muted"
          onClick={() => openConnectModal?.()}
        >
          <Wallet className="h-5 w-5 text-foreground" />
          Connect Wallet
        </Button>
      )}

      {/* Wallet details sheet */}
      {isConnected && <WalletSheet open={open} onOpenChange={setOpen} />}
    </>
  );
}
