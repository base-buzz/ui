"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { leftNavItems } from "@/lib/leftNavItems";
import { Icon } from "@/components/ui/icons";
import { isProtectedRoute, useWalletModal } from "@/hooks/useAuth";
import WalletModal from "@/components/modals/WalletModal";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function LeftNavigation() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { user } = useCurrentUser();
  const { isWalletModalOpen, openWalletModal, closeWalletModal } =
    useWalletModal();
  const [isCompact, setIsCompact] = useState(false);

  // Notification counts - these would come from backend/Supabase in production
  // @TODO: Integrate with Supabase to fetch actual notification counts
  const [homeCount, setHomeCount] = useState(1);
  const [notificationsCount, setNotificationsCount] = useState(2);

  const handleNavClick = (path: string) => {
    if (!isConnected && isProtectedRoute(leftNavItems, path)) {
      // Open wallet modal if user tries to access a protected route
      openWalletModal();
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  };

  return (
    <>
      <div className="flex h-screen flex-col justify-between py-2">
        <div className="flex h-full flex-col overflow-y-auto">
          <div>
            {/* Logo */}
            <Link href="/" className="mb-4 flex items-center px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary p-2">
                <img
                  src="/black.svg"
                  alt="BaseBuzz"
                  className="h-5 w-5 invert"
                />
              </div>
            </Link>

            {/* Nav Items */}
            <ul className="space-y-2">
              {leftNavItems.map((item) => {
                const isActive = pathname === item.path;

                // Determine if we should show a notification dot and count
                const showNotificationDot =
                  (item.icon === "home" && homeCount > 0) ||
                  (item.icon === "bell" && notificationsCount > 0);

                const itemCount =
                  item.icon === "home"
                    ? homeCount
                    : item.icon === "bell"
                      ? notificationsCount
                      : 0;

                return (
                  <li key={item.path}>
                    {item.protected && !isConnected ? (
                      <button
                        onClick={() => openWalletModal()}
                        className={cn(
                          "flex w-full items-center rounded-full px-3 py-3 transition-colors hover:bg-accent",
                          isActive ? "bg-accent/50 font-bold" : "",
                        )}
                      >
                        <div className="relative">
                          <Icon
                            name={item.icon}
                            className={cn(
                              "h-7 w-7",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground",
                              item.icon === "home" &&
                                isActive &&
                                "text-foreground",
                            )}
                          />
                          {showNotificationDot && (
                            <div className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1d9bf0] text-[11px] font-bold leading-none text-white">
                              {itemCount > 0 && itemCount <= 9 ? itemCount : ""}
                            </div>
                          )}
                        </div>
                        {!isCompact && (
                          <div className="flex flex-1 items-center">
                            <span
                              className={cn(
                                "ml-4 hidden text-xl md:block",
                                isActive ? "font-bold" : "",
                                item.icon === "home" && "font-extrabold",
                              )}
                            >
                              {item.label}
                            </span>
                            {showNotificationDot && itemCount > 9 && (
                              <div className="ml-3 flex h-[17px] min-w-[26px] items-center justify-center rounded-full bg-[#1d9bf0] px-1 text-[11px] font-bold text-white">
                                {itemCount}
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center rounded-full px-3 py-3 transition-colors hover:bg-accent",
                          isActive ? "bg-accent/50 font-bold" : "",
                        )}
                        onClick={() => handleNavClick(item.path)}
                      >
                        <div className="relative">
                          <Icon
                            name={item.icon}
                            className={cn(
                              "h-7 w-7",
                              item.icon === "home" && isActive
                                ? "text-foreground"
                                : isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                            )}
                          />
                          {showNotificationDot && (
                            <div className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1d9bf0] text-[11px] font-bold leading-none text-white">
                              {itemCount > 0 && itemCount <= 9 ? itemCount : ""}
                            </div>
                          )}
                        </div>
                        {!isCompact && (
                          <div className="flex flex-1 items-center">
                            <span
                              className={cn(
                                "ml-4 hidden text-xl md:block",
                                isActive ? "font-bold" : "",
                                item.icon === "home" && isActive && "font-bold",
                              )}
                            >
                              {item.label}
                            </span>
                            {showNotificationDot && itemCount > 9 && (
                              <div className="ml-3 flex h-[17px] min-w-[26px] items-center justify-center rounded-full bg-[#1d9bf0] px-1 text-[11px] font-bold text-white">
                                {itemCount}
                              </div>
                            )}
                          </div>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Post Button */}
            <div className="mx-auto mt-4 w-full px-3">
              <Link
                href="/compose"
                className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 md:py-4"
              >
                <Icon name="sparkles" className="h-7 w-7 md:hidden" />
                <span className="hidden md:block">Post</span>
              </Link>
            </div>
          </div>

          {/* User Profile Button */}
          {user && isConnected && (
            <div className="mx-auto mt-auto w-full px-3">
              <Link
                href="/profile/me"
                className="flex w-full items-center justify-between rounded-full px-3 py-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src="https://i.pravatar.cc/150?img=3"
                      alt={user.alias || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {!isCompact && (
                    <div className="ml-3 hidden md:block">
                      <div className="text-base font-bold">{user.alias}</div>
                      <div className="text-sm text-muted-foreground">
                        @{user.alias?.toLowerCase().replace(/\s+/g, "_")}
                      </div>
                    </div>
                  )}
                </div>
                {!isCompact && (
                  <Icon
                    name="more-horizontal"
                    className="hidden h-5 w-5 md:block"
                  />
                )}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Connection Modal */}
      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </>
  );
}
