"use client";

import Image from "next/image";
import { TabsNav } from "@/components/ui/tabs-nav";
import { CardsDemo } from "@/components/cards";
import { HeroSection } from "@/components/ui/hero-section";
import { TrendingBox } from "@/components/ui/trending-box";
import { EarlyAdopterBox } from "@/components/ui/early-adopter-box";
import { MarketOverview } from "@/components/ui/market-overview-section";
import NotLoggedInLayout from "@/components/layout/auth/NotLoggedInLayout";

export default function Home() {
  // TODO: Add authentication check here
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <NotLoggedInLayout />;
  }

  return (
    <>
      {/* ✅ Hero Section */}
      <HeroSection />

      {/* ✅ Market Overview Wrapper (Trending + Early Adopter) */}
      <MarketOverview />

      {/* ✅ Separate Section for Examples Navigation */}
      <div className="container-wrapper">
        <div className="container pt-6">
          <div className="rounded-lg border bg-background p-4 shadow-md">
            <TabsNav className="[&>a:first-child]:text-primary" />
          </div>
        </div>
      </div>

      {/* ✅ Rest of the Page */}
      <div className="container-wrapper">
        <div className="container py-6">
          <section className="overflow-hidden rounded-lg border bg-background shadow-md md:hidden md:shadow-xl">
            <Image
              src="/tabs/cards-light.png"
              width={1280}
              height={1214}
              alt="Cards"
              className="block dark:hidden"
            />
            <Image
              src="/tabs/cards-dark.png"
              width={1280}
              height={1214}
              alt="Cards"
              className="hidden dark:block"
            />
          </section>
          <section
            className="hidden md:block [&>div]:p-0"
            style={
              {
                "--radius": "0.75rem",
              } as React.CSSProperties
            }
          >
            <CardsDemo />
          </section>
        </div>
      </div>
    </>
  );
}
