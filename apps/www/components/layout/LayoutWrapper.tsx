"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LeftNavigation from "./LeftNavigation";
import RightSidebar from "./RightSidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if the current page is the landing page
  const isLandingPage = pathname === "/";

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      {isLandingPage ? (
        // Landing page layout
        <div className="flex-1">{children}</div>
      ) : (
        // Twitter-like 3-column layout
        <div className="mx-auto flex w-full max-w-[1290px] justify-center">
          {/* Left column - Navigation */}
          <div className="sticky top-0 h-screen w-[68px] shrink-0 md:w-[270px]">
            <LeftNavigation />
          </div>

          {/* Center column - Main content */}
          <div className="h-full w-full max-w-[600px] border-x border-border">
            {children}
          </div>

          {/* Right column - Sidebar */}
          <div className="sticky top-0 hidden h-screen w-[350px] shrink-0 overflow-y-auto pl-[25px] lg:block">
            <RightSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
