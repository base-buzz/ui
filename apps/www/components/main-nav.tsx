"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      {/* BaseBuzz Logo & Sheet Trigger */}
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

      {/* Main Navigation */}
      <nav className="ml-2 flex items-center gap-4 text-sm xl:gap-6">
        <Link href="/mint" className={cn("transition-colors hover:text-foreground/80", pathname === "/mint" ? "text-foreground" : "text-foreground/80")}>
          Mint
        </Link>
        <Link href="/governance" className={cn("transition-colors hover:text-foreground/80", pathname === "/governance" ? "text-foreground" : "text-foreground/80")}>
          Governance
        </Link>
        <Link href="/roadmap" className={cn("transition-colors hover:text-foreground/80", pathname === "/roadmap" ? "text-foreground" : "text-foreground/80")}>
          Roadmap
        </Link>

        {/* Apps on Base (New) */}
        <Link href="/apps" className="flex items-center gap-1 transition-colors hover:text-foreground/80">
  <Image
    src="/icons/Base_Wordmark_Blue.svg"
    alt="Base Apps"
    width={50} // Adjust width for better scaling
    height={12} // Match text height
    className="object-contain"
  />
  <span className={cn("transition-colors hover:text-foreground/80", pathname === "/roadmap" ? "text-foreground" : "text-foreground/80")}>Apps</span>
</Link>

      </nav>
    </div>
  );
}
