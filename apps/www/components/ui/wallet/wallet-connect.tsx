"use client";

import * as React from "react";
import { Wallet, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useClipboard } from "@/hooks/use-clipboard"; // ✅ Clipboard hook
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { WalletSheet } from "@/components/ui/wallet/wallet-sheet"; // ✅ Import the new sheet

export function WalletConnect({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}) {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { copy, copied } = useClipboard();

  return (
    <>
      {
        isConnected && address ? (
          <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative flex items-center gap-2 transition hover:bg-muted"
                onClick={() => onOpenChange(true)}
              >
                <Wallet className="h-5 w-5" />
                <div className="group relative">
                  <span>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <Copy
                    className="absolute right-[-20px] top-[2px] h-4 w-4 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => copy(address)}
                  />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <WalletSheet open={open} onClose={() => onOpenChange(false)} />
            </SheetContent>
          </Sheet>
        ) : null // Remove duplicate button - handled by WalletButton
      }
    </>
  );
}

export default WalletConnect;
