import { Metadata } from "next";
import Image from "next/image";
import { TabsNav } from "@/components/ui/tabs-nav";
import { CardsDemo } from "@/components/cards";
import { HeroSection } from "@/components/ui/hero-section";
import { TrendingBox } from "@/components/ui/trending-box";
import { EarlyAdopterBox } from "@/components/ui/early-adopter-box";
import { MarketOverview } from "@/components/ui/market-overview-section";

const title =
  "BaseBuzz | Trade crypto and NFT's safely on the top Base platform";
const description =
  "BaseBuzz is the ultimate hub for AI-driven DeFi, meme speculation, and real-world asset tokenization. Trade, engage, and build—powered by $BUZZ.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function IndexPage() {
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
