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
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const { copy, copied } = useClipboard();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      {isConnected ? (
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/avatars/01.png"
            alt="Wallet Avatar"
            width="10"
            height="10"
            className="h-5 w-5 rounded-full"
          />
          <span className="max-w-[100px] truncate">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
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
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-lg bg-background text-foreground hover:bg-muted"
          onClick={() => openConnectModal?.()}
        >
          <Wallet className="h-5 w-5 text-foreground" />
          Connect Wallet
        </Button>
      )}

      {isConnected && <WalletSheet open={open} onOpenChange={setOpen} />}
    </>
  );
}
