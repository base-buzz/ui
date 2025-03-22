"use client";

import * as React from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const WalletConnected = () => {
  const { toast } = useToast();
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();

  // ✅ Add open state for external control
  const [open, setOpen] = React.useState(false);

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connect Wallet"}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] p-4">
        <h2 className="text-center text-lg font-semibold">Wallet</h2>
        {isConnected && address ? (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm font-medium">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-sm">
                Balance: {balance?.formatted} {balance?.symbol}
              </p>
              <p className="text-xs text-muted-foreground">
                Network: {chain?.name ?? "Unknown"} (ID: {chain?.id})
              </p>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="flex w-full items-center justify-between"
                onClick={() =>
                  window.open(
                    `https://basescan.org/address/${address}`,
                    "_blank",
                  )
                }
              >
                View on Explorer <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                className="flex w-full items-center justify-between"
                onClick={() => disconnect()}
              >
                Disconnect <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No wallet connected.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
};

// ✅ Export setOpen function to allow external control
export { WalletConnected };
export let setWalletSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;

export default WalletConnected;
