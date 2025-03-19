import * as React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const WalletConnectSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[340px] space-y-6 p-6 dark:bg-black"
      >
        {/* Title */}
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-white">
            Connect a Wallet
          </SheetTitle>
        </SheetHeader>

        {/* Wallet Buttons */}
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {/* Separator */}
        <div className="flex items-center text-sm font-medium uppercase text-gray-400">
          <div className="grow border-t border-gray-700"></div>
          <span className="px-3">Other Wallets</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        {/* Other Wallets */}
        <div className="space-y-3">
          <Button className="flex w-full items-center justify-start gap-3 bg-gray-900 px-4 py-3 text-white">
            <Image
              src="/icons/phantom.png"
              alt="Phantom"
              width={24}
              height={24}
            />
            Phantom
          </Button>
          <Button className="flex w-full items-center justify-start gap-3 rounded-b-lg bg-gray-900 px-4 py-3 text-white">
            <Image
              src="/icons/coinbase.svg"
              alt="Coinbase"
              width={24}
              height={24}
            />
            Coinbase Wallet
          </Button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500">
          By connecting a wallet, you agree to BaseBuzz Labs’{" "}
          <span className="underline">Terms of Service</span> and consent to its{" "}
          <span className="underline">Privacy Policy</span>.
        </p>
      </SheetContent>
    </Sheet>
  );
};

export default WalletConnectSheet;
