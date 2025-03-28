"use client";

export default function HomePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Welcome to BaseBuzz</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        You are now logged in with your wallet. Start exploring!
      </p>

      {/* Add your authenticated content here */}
      <div className="mt-8 grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Your Activity</h2>
          <p className="mt-2 text-muted-foreground">
            Track your interactions and engagement here.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Your Stats</h2>
          <p className="mt-2 text-muted-foreground">
            View your on-chain statistics and achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
