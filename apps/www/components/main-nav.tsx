"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import usePathname
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";

export function MainNav() {
  const pathname = usePathname(); // ✅ Define pathname here

  return (
    <div className="flex items-center gap-2">
      
      {/* ✅ Hamburger Button for Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-6">
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="text-lg font-bold">
              Home
            </Link>
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

      {/* ✅ Clickable Logo (Always Links to Home) */}
      <Link href="/" className="flex items-center gap-2 text-lg font-bold">
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="md:inline-block">{siteConfig.name}</span>
      </Link>

      {/* ✅ Desktop Navigation (Only Shows on Large Screens) */}
      <nav className="ml-2 hidden items-center gap-4 text-sm md:flex xl:gap-6">
        <Link
          href="/mint"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/mint" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Token
        </Link>
        <Link
          href="/governance"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/governance" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Governance
        </Link>
        <Link
          href="/roadmap"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/roadmap" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Roadmap
        </Link>

        {/* ✅ Base Apps Link */}
        <Link href="/apps" className="flex items-center gap-1 transition-colors hover:text-foreground/80">
          <Image
            src="/icons/Base_Wordmark_Blue.svg"
            alt="Base Apps"
            width={50}
            height={12}
            className="object-contain"
          />
          <span
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/apps" ? "text-foreground" : "text-foreground/80"
            )}
          >
            Apps
          </span>
        </Link>
      </nav>
    </div>
  );
}
