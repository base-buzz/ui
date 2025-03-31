"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LeftNavigation from "./LeftNavigation";
import RightSidebar from "./RightSidebar";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import { useWalletSheet } from "@/hooks/useWalletSheet";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { isWalletSheetOpen, closeWalletSheet } = useWalletSheet();

  // Determine if we're on the landing page
  const isLandingPage = pathname === "/";

  // Determine if we should show tabs on specific routes
  const showTabs = [
    "/home",
    "/home/following",
    "/home/buildin",
    "/home/canto",
  ].includes(pathname);

  // Determine if we need to show the back button (e.g., on profile pages)
  const showBackButton =
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/post/") ||
    pathname === "/settings" ||
    pathname === "/notifications" ||
    pathname === "/messages";

  // Add extra padding at the bottom on mobile for the navigation bar
  const mobileBottomPadding = !isLandingPage ? "pb-[49px] md:pb-0" : "";

  // Don't use the standard layout on the landing page
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        mobileBottomPadding,
        isWalletSheetOpen ? "overflow-hidden" : "",
      )}
    >
      {/* Mobile top header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Twitter-like 3-column layout */}
      <div className="mx-auto flex w-full max-w-[1290px] justify-center">
        {/* Left column - Navigation (hidden on mobile) */}
        <div className="sticky top-0 hidden h-screen w-[68px] shrink-0 md:block md:w-[270px]">
          <LeftNavigation />
        </div>

        {/* Center column - Main content */}
        <div className="h-full w-full max-w-[600px] border-x border-border">
          {children}
        </div>

        {/* Right column - Sidebar (hidden on mobile and smaller tablets) */}
        <div className="sticky top-0 hidden h-screen w-[350px] shrink-0 overflow-y-auto pl-[25px] lg:block">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile bottom navigation - visible only on mobile */}
      {!isLandingPage && <MobileBottomNav />}
    </div>
  );
}
