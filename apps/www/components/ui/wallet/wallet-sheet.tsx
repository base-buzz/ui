import { useAccount, useDisconnect } from "wagmi";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";
import Link from "next/link";

interface WalletSheetProps {
  open: boolean;
  onOpenChange?: (state: boolean) => void;
}

export function WalletSheet({ open, onOpenChange }: WalletSheetProps) {
  console.log("WalletSheet: rendering... open=", open);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { copy } = useClipboard();

  if (!isConnected) return null;

  const handleOpenChange = (val: boolean) => {
    console.log("WalletSheet: onOpenChange called with val=", val);
    onOpenChange?.(val);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[350px] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Wallet</h2>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="transition hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => {
                console.log("WalletSheet: top X button clicked");
                handleOpenChange(false);
              }}
            >
              <X size={18} />
            </Button>
          </SheetClose>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-2">
            <span className="w-full truncate font-mono text-sm">{address}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copy(address || "")}
              className="transition hover:text-blue-500"
            >
              <Copy size={16} />
            </Button>
          </div>
          <Link
            href="/debug"
            className="block w-full text-center text-sm text-blue-500 hover:underline"
            onClick={() => {
              console.log("WalletSheet: Debug link clicked");
              if (onOpenChange) {
                // Add this null check
                onOpenChange(false);
              }
            }}
          >
            Debug Info
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">On-Chain Data</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Base ETH</span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Badges</span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Reputation
              </span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                FOMO Score
              </span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">LDR</span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                BUZZ Holdings
              </span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Eligibility
              </span>
              <span className="font-medium">--</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
