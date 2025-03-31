"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LeftNavigation from "./LeftNavigation";
import RightSidebar from "./RightSidebar";
import MobileBottomNav from "./MobileBottomNav";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if the current page is the landing page
  const isLandingPage = pathname === "/";

  // Add extra padding at the bottom on mobile for the navigation bar
  const mobileBottomPadding = !isLandingPage ? "pb-[49px] md:pb-0" : "";

  return (
    <div
      className={cn(
        "relative flex min-h-svh flex-col bg-background",
        mobileBottomPadding,
      )}
    >
      {isLandingPage ? (
        // Landing page layout
        <div className="flex-1">{children}</div>
      ) : (
        // Twitter-like 3-column layout
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
      )}

      {/* Mobile bottom navigation - visible only on mobile */}
      <MobileBottomNav />
    </div>
  );
}
