"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useState } from "react";

export function MainNav() {
  const pathname = usePathname();
  const [isLegalOpen, setIsLegalOpen] = useState(false);

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
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

          <Separator className="my-4" />

          {/* ✅ Social Links - Animated */}
          <div className="flex justify-center gap-4">
            {[
              {
                href: siteConfig.links.twitter,
                icon: <Icons.twitter className="h-6 w-6" />,
                label: "Twitter",
              },
              {
                href: siteConfig.links.github,
                icon: <Icons.gitHub className="h-6 w-6" />,
                label: "GitHub",
              },
              {
                href: "https://discord.gg/basebuzz",
                icon: <Icons.discord className="h-6 w-6" />,
                label: "Discord",
              },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href} target="_blank" rel="noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="group transition-transform duration-300 hover:rotate-[10deg] hover:text-primary"
                >
                  {icon}
                  <span className="sr-only">{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          {/* ✅ Legal & Privacy Dropdown */}
          <div className="space-y-2">
            <button
              onClick={() => setIsLegalOpen(!isLegalOpen)}
              className="flex w-full items-center justify-between text-sm font-medium transition hover:text-primary"
            >
              Legal & Privacy
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${
                  isLegalOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isLegalOpen && (
              <div className="ml-4 space-y-2 text-sm text-muted-foreground">
                <Link
                  href="/terms"
                  className="block transition hover:text-primary"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="block transition hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ✅ Clickable Logo (Always Links to Home) */}
      <Link
        href="/"
        className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
      >
        {/* Dark mode: White logo / Light mode: Blue logo */}
        <Image
          src="/icons/BaseBuzz_Network_Logo_White.svg"
          alt="BaseBuzz Logo"
          width={20}
          height={12}
          className="hidden object-contain dark:block"
        />
        <Image
          src="/icons/BaseBuzz_Network_Logo_Blue.svg"
          alt="BaseBuzz Logo"
          width={20}
          height={12}
          className="block object-contain dark:hidden"
        />
        <span className="font-bold text-foreground/80 md:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      {/* ✅ Desktop Navigation (Only Shows on Large Screens) */}
      <nav className="ml-2 hidden items-center gap-4 text-sm md:flex xl:gap-6">
        <Link
          href="/mint"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/mint" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Token
        </Link>
        <Link
          href="/governance"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/governance"
              ? "text-foreground"
              : "text-foreground/80",
          )}
        >
          Governance
        </Link>
        <Link
          href="/roadmap"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/roadmap" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Roadmap
        </Link>

        {/* ✅ Base Apps Link */}
        <Link
          href="/apps"
          className="flex items-center gap-1 transition-colors hover:text-foreground/80"
        >
          <span
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/apps" ? "text-foreground" : "text-foreground/80",
            )}
          >
            Apps
          </span>
        </Link>
      </nav>
    </div>
  );
}
