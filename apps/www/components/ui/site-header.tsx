import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CommandMenu } from "@/components/command-menu";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/ui/main-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/registry/new-york/ui/button";
import { WalletButton } from "@/components/ui/wallet/wallet-button";

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center gap-2 md:gap-4">
          {/* ✅ Hamburger Menu (Sheet) */}
          <MainNav />

          {/* ✅ Right-Aligned Controls */}
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            {/* ✅ Hide search, GH, and dark mode below lg (md & sm hidden) */}
            <div className="hidden w-full flex-1 lg:flex lg:w-auto lg:flex-none">
              <CommandMenu />
            </div>
            <nav className="hidden items-center gap-2 lg:flex">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0"
              >
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeSwitcher />
            </nav>

            {/* ✅ Wallet Connect remains visible on all screens */}
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
