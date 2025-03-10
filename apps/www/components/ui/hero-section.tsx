import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center space-y-6 text-center">
      {/* Main Headline */}
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        🚀 The AI-Powered DeFi Ecosystem on Base
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        $BUZZ fuels the future of on-chain speculation, governance, and real-world finance.
      </p>

      {/* Call to Actions */}
      <div className="flex space-x-4">
        <Button variant="default" size="lg">
          Connect Wallet & Explore
        </Button>
        <Button variant="outline" size="lg">
          See the Roadmap
        </Button>
      </div>

      {/* Live Market Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-4">
        <div>💸 Total Market Volume: $XXM</div>
        <div>🔥 Trending: $TOKEN 🚀</div>
        <div>🐋 Whale Buy: +$10K BUZZ</div>
        <div>🏆 Leaderboard: 0xDEF (300% ROI)</div>
      </div>

      {/* Exclusive Incentives */}
      <div className="w-full space-y-4 border-t border-border pt-6">
        <p className="text-lg font-medium">🔥 Early Adopter Rewards</p>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <Badge variant="secondary">🎖️ Claim Reputation Badge</Badge>
          <Badge variant="secondary">⚡ Governance Boost</Badge>
          <Badge variant="secondary">💰 LP Gas Rebates</Badge>
        </div>
      </div>

      {/* Project Ecosystem Overview */}
      <div className="w-full border-t border-border pt-6">
        <p className="text-lg font-medium">BaseBuzz Ecosystem</p>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>🔹 AI Trading</div>
          <div>🔹 Meme Speculation</div>
          <div>🔹 Pro Trading Tools</div>
          <div>🔹 Tokenized RWAs</div>
        </div>
      </div>
    </section>
  );
}
