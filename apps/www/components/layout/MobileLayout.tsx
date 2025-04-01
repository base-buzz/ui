"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useWalletModal } from "@/hooks/useAuth";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./DesktopNavigation";
import { NavIcon } from "@/components/ui/nav-icon";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-275, 0, 275],
    ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"],
  );

  // Track swipe state
  const swipeState = useRef({
    startX: 0,
    startScrollLeft: 0,
    isScrolling: false,
  });

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    swipeState.current.startX = touch.clientX;
    swipeState.current.isScrolling = false;
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    if (swipeState.current.isScrolling) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.current.startX;
    const mainContent = document.querySelector("main");

    // If vertical scroll is detected, disable swipe
    if (mainContent && Math.abs(deltaX) < 10) {
      swipeState.current.isScrolling = true;
      return;
    }

    // Prevent default only if we're swiping horizontally
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
      x.set(deltaX);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    const deltaX = x.get();
    if (Math.abs(deltaX) > 100) {
      // Snap to side
      x.set(deltaX > 0 ? 275 : -275);
    } else {
      // Spring back
      x.set(0);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative h-full min-h-screen touch-pan-y">
      {/* Left Navigation Sheet */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-full w-[275px] -translate-x-full transform bg-background"
        style={{ x }}
      >
        <div className="flex h-full flex-col p-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = isActive ? item.activeIcon : item.icon;

              if (item.requiresAuth && !isConnected) {
                return (
                  <button
                    key={item.href}
                    onClick={() => openWalletModal()}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-full p-3 transition-colors hover:bg-accent/10",
                      isActive && "font-bold",
                    )}
                  >
                    <NavIcon
                      icon={Icon}
                      isActive={isActive}
                      showNotificationDot={item.href === "/notifications"}
                      className="h-[26px] w-[26px]"
                    />
                    <span className="text-xl">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-full p-3 transition-colors hover:bg-accent/10",
                    isActive && "font-bold",
                  )}
                >
                  <NavIcon
                    icon={Icon}
                    isActive={isActive}
                    showNotificationDot={item.href === "/notifications"}
                    className="h-[26px] w-[26px]"
                  />
                  <span className="text-xl">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="mt-auto">
            <Link
              href="/profile"
              className="flex w-full items-center gap-3 rounded-full p-3 transition-colors hover:bg-accent/10"
            >
              <div className="h-10 w-10 rounded-full bg-accent" />
              <div className="flex-1 text-left">
                <div className="font-bold">User</div>
                <div className="text-sm text-muted-foreground">@user</div>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right Wallet Sheet */}
      <motion.div
        className="fixed right-0 top-0 z-50 h-full w-[275px] translate-x-full transform bg-background"
        style={{ x: useTransform(x, (value) => -value) }}
      >
        <div className="flex h-full flex-col p-4">
          <div className="text-xl font-bold">Wallet</div>
          {isConnected ? (
            <div className="mt-4">
              {/* Connected wallet info */}
              <div className="rounded-lg border border-border p-4">
                <div className="font-medium">Connected</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  0x72...377A
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openWalletModal()}
              className="mt-4 w-full rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        className="relative min-h-screen"
        style={{
          x,
          backgroundColor: "white",
        }}
      >
        {children}
      </motion.main>

      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/50"
        style={{
          opacity: useTransform(x, [-275, 0, 275], [1, 0, 1]),
          pointerEvents: x.get() !== 0 ? "auto" : "none",
        }}
        onClick={() => x.set(0)}
      />
    </div>
  );
}
