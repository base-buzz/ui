"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      {/* BaseBuzz Logo & Sheet Trigger (No useState, ShadCN handles state internally) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden lg:inline-block">{siteConfig.name}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-6">
          {/* Navigation Links inside Sheet */}
          <nav className="flex flex-col space-y-3">
            <Link href="/explore" className="text-lg">
              Explore
            </Link>
            <Link href="/mint" className="text-lg">
              Mint
            </Link>
            <Link href="/governance" className="text-lg">
              Governance
            </Link>
            <Link href="/roadmap" className="text-lg">
              Roadmap
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/*       
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link> */}

      <nav className="ml-2 flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/docs/installation"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs/installation"
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Mint
        </Link>
        <Link
          href="/docs/components"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs/components") &&
              !pathname?.startsWith("/docs/component/chart")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Governance
        </Link>
        <Link
          href="/blocks"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/blocks")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Roadmap
        </Link>
        <Link
          href="/charts"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs/component/chart") ||
              pathname?.startsWith("/charts")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          W3 Apps
        </Link>
      </nav>
    </div>
  )
}
