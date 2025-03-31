"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { WalletSheet } from "@/components/ui/wallet/wallet-sheet";
import { useWalletSheet } from "@/hooks/useWalletSheet";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const isLandingPage = pathname === "/";
  const { isWalletSheetOpen, closeWalletSheet } = useWalletSheet();

  return (
    <>
      {!isLandingPage && !isHomePage && <SiteHeader />}
      {children}
      {!isLandingPage && <SiteFooter />}
      <WalletSheet open={isWalletSheetOpen} onOpenChange={closeWalletSheet} />
      <TailwindIndicator />
    </>
  );
}
