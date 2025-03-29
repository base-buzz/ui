"use client";

import { useAccount } from "wagmi";
import { redirect } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();

  // Redirect to home if not connected
  if (!isConnected) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
