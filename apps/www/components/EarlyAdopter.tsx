"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function EarlyAdopter() {
  const [timeRemaining, setTimeRemaining] = useState(7 * 24 * 60 * 60); // Countdown in seconds (1 week)

  // ✅ Countdown timer for "Early Adopter Reward Sprint"
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 7 * 24 * 60 * 60));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Convert seconds to readable format
  const formatCountdown = () => {
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    return `${days} Days ${hours} Hrs ${minutes} Min`;
  };

  return (
    <div className="col-span-2 w-full space-y-8 border-t border-border py-6">
      <p className="text-center text-lg font-medium">
        🔥 Early Adopter Reward Sprint ENDS IN:{" "}
        <span className="text-red-500">{formatCountdown()}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Badge variant="secondary" className="transition hover:scale-105">
          🎖️ Claim Reputation Badge
        </Badge>
        <Badge variant="secondary" className="transition hover:scale-105">
          ⚡ Governance Boost
        </Badge>
        <Badge variant="secondary" className="transition hover:scale-105">
          💰 LP Gas Rebates
        </Badge>
      </div>
    </div>
  );
}
