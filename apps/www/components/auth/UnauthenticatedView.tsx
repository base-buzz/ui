import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkle, LogIn, Rocket } from "lucide-react";

interface UnauthenticatedViewProps {
  onAuthClick?: () => void;
}

export function UnauthenticatedView({ onAuthClick }: UnauthenticatedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <Sparkle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold">
            Welcome to BaseBuzz
          </CardTitle>
          <CardDescription>
            Connect your wallet to see posts and join the conversation
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            You need to connect your wallet to view posts, like, comment, and
            participate in the BaseBuzz community.
          </p>
          <p className="text-muted-foreground">
            BaseBuzz is a decentralized social platform built on Base.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            onClick={onAuthClick}
            className="gap-2 rounded-full"
          >
            <LogIn className="h-4 w-4" />
            Connect Wallet
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<Rocket className="h-6 w-6 text-primary" />}
          title="Join the Revolution"
          description="Be part of the next generation of social media on Base."
        />
        <FeatureCard
          icon={<Sparkle className="h-6 w-6 text-primary" />}
          title="Own Your Content"
          description="Your posts, your data - take control of your online presence."
        />
        <FeatureCard
          icon={<LogIn className="h-6 w-6 text-primary" />}
          title="Connect & Share"
          description="Engage with a community of builders and enthusiasts."
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
