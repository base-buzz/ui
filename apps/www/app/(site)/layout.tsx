"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { WalletSheet } from "@/components/ui/wallet/wallet-sheet";
import { useWalletSheet } from "@/hooks/useWalletSheet";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { isWalletSheetOpen, closeWalletSheet } = useWalletSheet();

  // Don't show header on the landing page
  const isLandingPage = pathname === "/";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isLandingPage && <SiteHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isLandingPage && <SiteFooter />}
      <WalletSheet open={isWalletSheetOpen} onOpenChange={closeWalletSheet} />
    </div>
  );
}
