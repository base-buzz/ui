"use client";

import { useAccount, useDisconnect } from "wagmi";
import { redirect } from "next/navigation";
import { WalletConnect } from "@/components/ui/wallet/wallet-connect";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Redirect to home if not connected
  if (!isConnected) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">BaseBuzz</span>
            </a>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <WalletConnect open={isWalletOpen} onOpenChange={setIsWalletOpen} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => disconnect()}
              className="text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
              title="Disconnect"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
