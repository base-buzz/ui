"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Don't show header on the landing page
  const isLandingPage = pathname === "/" || pathname === "/home";

  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      {!isLandingPage && <SiteHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isLandingPage && <SiteFooter />}
    </div>
  );
}
