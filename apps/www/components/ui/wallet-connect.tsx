"use client";

import * as React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const WalletConnectButton = () => {
  const { openConnectModal } = useConnectModal(); // ✅ Use RainbowKit hook

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={openConnectModal} // ✅ Directly trigger modal
    >
      <Wallet className="h-5 w-5" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnectButton;
