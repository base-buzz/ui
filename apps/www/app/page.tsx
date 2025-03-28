"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TabsNav } from "@/components/ui/tabs-nav";
import { CardsDemo } from "@/components/cards";
import { HeroSection } from "@/components/ui/hero-section";
import { TrendingBox } from "@/components/ui/trending-box";
import { EarlyAdopterBox } from "@/components/ui/early-adopter-box";
import { MarketOverview } from "@/components/ui/market-overview-section";
import NotLoggedInLayout from "@/components/layout/auth/NotLoggedInLayout";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to home if connected
  useEffect(() => {
    if (isConnected) {
      router.push("/home");
    }
  }, [isConnected, router]);

  // Show the not logged in layout if not authenticated
  return <NotLoggedInLayout />;
}
