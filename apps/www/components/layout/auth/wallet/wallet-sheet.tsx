/**
 * @file components/layout/auth/wallet/wallet-sheet.tsx
 * @description Wallet sheet component for displaying wallet connection and network information
 */

"use client";

import { useAccount, useDisconnect, useBalance, useConfig } from "wagmi";
import { switchNetwork } from "wagmi/actions";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";
import Link from "next/link";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
import { useEnsName } from "wagmi";
import { base, baseGoerli } from "wagmi/chains";
import { Icons } from "@/components/icons";

interface WalletSheetProps {
  /** Controls the open state of the sheet */
  open: boolean;
  /** Callback function to handle sheet open state changes */
  onOpenChange?: (state: boolean) => void;
}

// Constants for token addresses
const BASE_ETH_ADDRESS = "0x4200000000000000000000000000000000000006";
// eslint-disable-next-line turbo/no-undeclared-env-vars
const BUZZ_ADDRESS = process.env.NEXT_PUBLIC_BUZZ_TOKEN_ADDRESS;
const isBuzzTokenValid =
  BUZZ_ADDRESS?.startsWith("0x") && BUZZ_ADDRESS.length === 42;

export function WalletSheet({ open, onOpenChange }: WalletSheetProps) {
  // Wagmi hooks for wallet state and actions
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { copy } = useClipboard();
  const { data: ethBalance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const config = useConfig();

  // Fetch BUZZ token balance
  const buzzBalanceResult = useBalance({
    address,
    token: isBuzzTokenValid ? (BUZZ_ADDRESS as `0x${string}`) : undefined,
  });
  const buzzBalance = buzzBalanceResult.data;

  // State for ETH price
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Debug logging for balance updates
  useEffect(() => {
    console.log("WalletSheet: buzzBalanceResult", buzzBalanceResult);
    console.log("WalletSheet: buzzBalance", buzzBalance);
  }, [buzzBalanceResult, buzzBalance]);

  // Debug logging for chain and ENS updates
  useEffect(() => {
    console.log("WalletSheet: chain", chain);
    console.log("WalletSheet: ensName", ensName);
  }, [chain, ensName]);

  /**
   * Fetches token price from CoinGecko API
   * @param tokenAddress - The token contract address
   * @returns The token price in USD or null if fetch fails
   */
  const getTokenPrice = async (tokenAddress: string) => {
    try {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      const url = `${process.env.NEXT_PUBLIC_COINGECKO_BASE_TOKEN_API}?contract_addresses=${tokenAddress}&vs_currencies=usd`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("Fetched token price data from Coingecko:", data);
      return data[tokenAddress.toLowerCase()]?.usd ?? null;
    } catch (error) {
      console.error("Failed to fetch token price", error);
      return null;
    }
  };

  // Fetch ETH price on component mount
  useEffect(() => {
    getTokenPrice(BASE_ETH_ADDRESS.toLowerCase()).then(setEthPrice);
  }, []);

  // Don't render if wallet is not connected
  if (!isConnected) return null;

  /**
   * Handles sheet open state changes
   * @param val - New open state
   */
  const handleOpenChange = (val: boolean) => {
    console.log("WalletSheet: onOpenChange called with val=", val);
    onOpenChange?.(val);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[350px] p-6">
        {/* Header with close button */}
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

        {/* Wallet address section */}
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
        </div>

        {/* On-chain data section */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">On-Chain Data</h3>
          <div className="space-y-2 text-sm">
            {/* ETH Balance */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Base ETH</span>
              <span className="font-medium">
                {ethBalance
                  ? `${parseFloat(formatEther(ethBalance.value)).toFixed(4)} ETH` +
                    (ethPrice
                      ? ` ($${(parseFloat(formatEther(ethBalance.value)) * ethPrice).toFixed(2)})`
                      : "")
                  : "--"}
              </span>
            </div>

            {/* Network and ENS information */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Network</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{chain?.name || "Unknown"}</span>
                {process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const targetChainId =
                        chain?.id === base.id ? baseGoerli.id : base.id;
                      try {
                        await switchNetwork(config, { chainId: targetChainId });
                      } catch (error) {
                        console.error("Failed to switch network:", error);
                      }
                    }}
                  >
                    Switch to {chain?.id === base.id ? "Goerli" : "Mainnet"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">ENS Name</span>
              <span className="font-medium">{ensName || "--"}</span>
            </div>
          </div>
        </div>

        {/* Disconnect button */}
        <div className="mt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              disconnect();
              handleOpenChange(false);
            }}
          >
            Disconnect
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default WalletSheet;
