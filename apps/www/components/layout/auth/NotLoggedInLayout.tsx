/**
 * @file components/layout/auth/NotLoggedInLayout.tsx
 * @description Layout component for non-authenticated users with wallet connection
 */

"use client";

import Image from "next/image";
import { WalletButton } from "./wallet/wallet-button";
import { CookieNotice } from "../CookieNotice";

export default function NotLoggedInLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Mobile logo */}
      <div className="flex w-full px-4 pt-2 lg:hidden">
        <div className="relative h-[45px] w-[45px]">
          <Image
            src="/black.svg"
            alt="BaseBuzz"
            width={45}
            height={45}
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex grow flex-col pb-[152px] lg:flex-row lg:pb-[calc(152px+32px)]">
        {/* Left column - Logo (desktop only) */}
        <div className="hidden h-full w-[55%] items-center justify-center lg:flex">
          <div className="relative h-[330px] w-[330px]">
            <Image
              src="/black.svg"
              alt="BaseBuzz"
              width={330}
              height={330}
              priority
            />
          </div>
        </div>

        {/* Right column - Content */}
        <div className="flex h-full w-full items-start px-8 pt-4 lg:w-[45%] lg:items-center lg:px-10 lg:pt-0">
          <div className="w-full">
            <div className="flex max-w-[600px] flex-col pt-0 lg:pt-4">
              <h1 className="break-words text-[40px] font-bold leading-[52px] tracking-[-0.8px] text-foreground lg:text-[63px] lg:leading-[82px]">
                Happening now
              </h1>
              <h2 className="mt-2 text-[31px] font-bold leading-9 tracking-[-0.4px] text-foreground lg:mt-3">
                Join today.
              </h2>
            </div>

            <div className="mt-4 flex w-full flex-col space-y-2 lg:mt-8 lg:max-w-[300px] lg:space-y-[12px]">
              <button
                className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#94A3B8] bg-card text-[15px] font-medium leading-5 text-card-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sign up with Coinbase"
              >
                <div className="rounded-[15px] bg-background p-1">
                  <Image
                    src="/coinbase.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
                </div>
                Sign up with Coinbase
              </button>

              <button
                className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#94A3B8] bg-card text-[15px] font-medium leading-5 text-card-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sign up with MetaMask"
              >
                <div className="rounded-[15px] bg-background p-1">
                  <Image
                    src="/metamask.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
                </div>
                Sign up with MetaMask
              </button>

              <div
                className="flex items-center justify-center py-0.5"
                role="separator"
                aria-hidden="true"
              >
                <div className="h-px flex-1 bg-border"></div>
                <span className="mx-2 text-[15px] text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <button
                className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#FF0080] bg-[length:200%_auto] px-8 py-2 font-medium text-primary-foreground transition-colors duration-200 hover:bg-right"
                aria-label="Let me in"
              >
                <div className="rounded-[15px] bg-background/10 p-1">
                  <Image
                    src="/wallet-connect.svg"
                    alt="Wallet Connect"
                    width={28}
                    height={28}
                    className="h-7 w-7"
                  />
                </div>
                Wallet Connect
              </button>

              <p className="text-center text-[13px] leading-4 text-muted-foreground">
                By signing up, you agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                , including{" "}
                <a href="#" className="text-primary hover:underline">
                  Cookie Use
                </a>
                .
              </p>

              <div className="pb-0.5 lg:pb-8" />

              <p className="text-[15px] font-medium text-muted-foreground">
                Browse as guest
              </p>

              <button
                className="h-[44px] w-full rounded-[10px] bg-primary text-[17px] font-bold leading-5 text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Just let me in"
              >
                Just let me in
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="absolute bottom-[152px] left-0 right-0 z-10 w-full bg-background py-4">
        <nav className="mx-auto flex w-[80%] flex-wrap items-center justify-between gap-y-2 px-4 pb-4">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help Center
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cookie Policy
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accessibility
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Status
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resources
          </a>
        </nav>
      </footer>

      {/* Cookie notice */}
      <CookieNotice />
    </div>
  );
}
