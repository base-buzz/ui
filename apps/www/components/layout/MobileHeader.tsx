"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Icon } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWalletModal } from "@/hooks/useAuth";
import { useAccount } from "wagmi";

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface MobileHeaderProps {
  title?: string;
  showTabs?: boolean;
  tabs?: Tab[];
  showBackButton?: boolean;
  showProfile?: boolean;
}

export default function MobileHeader({
  title,
  showTabs = false,
  tabs,
  showBackButton = false,
  showProfile = false,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const defaultTabs: Tab[] = [
    { id: "for-you", label: "For you", path: "/home" },
    { id: "following", label: "Following", path: "/home/following" },
    { id: "buildin", label: "Buildin", path: "/home/buildin" },
    { id: "canto", label: "Canto", path: "/home/canto" },
  ];

  const currentTabs = tabs || defaultTabs;
  const [activeTab, setActiveTab] = useState(currentTabs[0].id);

  // Update active tab based on pathname
  useEffect(() => {
    const matchingTab = currentTabs.find((tab) => pathname === tab.path);
    if (matchingTab) {
      setActiveTab(matchingTab.id);
    } else {
      // Default to first tab if no match
      setActiveTab(currentTabs[0].id);
    }
  }, [pathname, currentTabs]);

  // Handle goBack
  const goBack = () => {
    router.back();
  };

  // Don't render on landing page
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/90 backdrop-blur-md md:hidden">
      {/* Main header row with title or profile */}
      <div className="flex h-[53px] items-center justify-between px-4">
        {showBackButton ? (
          <button onClick={goBack} className="rounded-full p-1 hover:bg-muted">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
        ) : showProfile ? (
          isConnected && user ? (
            <Link href="/profile/me">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.pfp || "https://i.pravatar.cc/150"}
                  alt={user.alias || "User"}
                />
                <AvatarFallback>{user.alias?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <button
              onClick={openWalletModal}
              className="rounded-full p-1 hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          )
        ) : (
          <div className="h-8 w-8">
            <img
              src="/black.svg"
              alt="BaseBuzz"
              className="h-6 w-6 dark:invert"
            />
          </div>
        )}

        {title && <h1 className="text-xl font-bold">{title}</h1>}

        <div className="w-8">{/* Placeholder for right side if needed */}</div>
      </div>

      {/* Tabs navigation row */}
      {showTabs && (
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${currentTabs.length}, minmax(0, 1fr))`,
          }}
        >
          {currentTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              className={cn(
                "flex h-[53px] items-center justify-center border-b-2 px-4 font-medium",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
