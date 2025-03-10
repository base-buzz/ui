import * as React from "react"
import { Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
        className="w-[340px] p-6 space-y-6 dark:bg-black"
      >
        {/* Title */}
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-white">
            Connect a Wallet
          </SheetTitle>
        </SheetHeader>

        {/* Wallet Buttons */}
        <div className="space-y-3">
          <Button className="w-full flex items-center justify-start gap-3 bg-gray-900 text-white py-3 px-4 rounded-t-lg">
            <img src="/icons/metamask.svg" alt="MetaMask" className="h-6 w-6" />
            MetaMask
          </Button>
          <Button className="w-full flex items-center justify-start gap-3 bg-gray-900 text-white py-3 px-4 rounded-b-lg">
            <img
              src="/icons/walletconnect.svg"
              alt="WalletConnect"
              className="h-6 w-6"
            />
            WalletConnect
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center text-gray-400 text-sm uppercase font-medium">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3">Other Wallets</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Other Wallets */}
        <div className="space-y-3">
          <Button className="w-full flex items-center justify-start gap-3 bg-gray-900 text-white py-3 px-4">
            <img src="/icons/phantom.png" alt="Phantom" className="h-6 w-6" />
            Phantom
          </Button>
          <Button className="w-full flex items-center justify-start gap-3 bg-gray-900 text-white py-3 px-4 rounded-b-lg">
            <img src="/icons/coinbase.svg" alt="Coinbase" className="h-6 w-6" />
            Coinbase Wallet
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By connecting a wallet, you agree to BaseBuzz Labs’{" "}
          <span className="underline">Terms of Service</span> and consent to its{" "}
          <span className="underline">Privacy Policy</span>.
        </p>
      </SheetContent>
    </Sheet>
  )
}

export default WalletConnectSheet
