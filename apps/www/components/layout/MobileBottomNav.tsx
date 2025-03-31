"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon, IconName } from "@/components/ui/icons";
import { useWalletModal } from "@/hooks/useAuth";
import { useAccount } from "wagmi";
import WalletModal from "@/components/modals/WalletModal";
import { Plus } from "lucide-react";
import { useUnreadMessages } from "@/components/hooks/useUnreadMessages";

interface NavItem {
  path: string;
  icon?: IconName;
  count?: number;
  isCompose?: boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isWalletModalOpen, openWalletModal, closeWalletModal } =
    useWalletModal();
  const { isConnected } = useAccount();
  const { unreadCount } = useUnreadMessages();

  // Notification counts - these would come from backend/Supabase in production
  const [notificationsCount, setNotificationsCount] = useState(2);

  const navItems: NavItem[] = [
    { path: "/home", icon: "home" },
    { path: "/explore", icon: "search" },
    { path: "/compose", isCompose: true }, // Hidden in the nav list but added for complete array
    { path: "/notifications", icon: "bell", count: notificationsCount },
    { path: "/messages", icon: "mail", count: unreadCount },
  ];

  // Check if it's a PWA standalone mode
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-ignore - Safari specific property
        window.navigator.standalone === true,
    );
  }, []);

  const handleNavClick = (path: string) => {
    if (
      !isConnected &&
      (path.includes("/notifications") || path.includes("/messages"))
    ) {
      openWalletModal();
      return false;
    }
    return true;
  };

  // Don't show on landing page
  if (pathname === "/") return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex h-[49px] w-full items-center justify-around border-t border-border bg-background md:hidden",
          isStandalone && "pb-5", // Add padding for home indicator on iOS standalone mode
        )}
      >
        {navItems
          .filter((item) => !item.isCompose)
          .map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");
            const requiresAuth =
              item.path === "/notifications" || item.path === "/messages";

            // Skip items without an icon
            if (!item.icon) return null;

            // If auth is required and user is not connected, show button that opens wallet modal
            if (requiresAuth && !isConnected) {
              return (
                <button
                  key={item.path}
                  onClick={() => openWalletModal()}
                  className="flex h-full w-full flex-1 items-center justify-center"
                >
                  <div className="relative">
                    <Icon
                      name={item.icon}
                      className={cn(
                        "h-[26px] w-[26px]",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                    {item.count && item.count > 0 && (
                      <div className="absolute -right-[5px] -top-[5px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#1d9bf0] px-[4px] text-[10px] font-bold text-white">
                        {item.count > 9 ? "9+" : item.count}
                      </div>
                    )}
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex h-full w-full flex-1 items-center justify-center"
                onClick={() => handleNavClick(item.path)}
              >
                <div className="relative">
                  <Icon
                    name={item.icon}
                    className={cn(
                      "h-[26px] w-[26px]",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  {item.count && item.count > 0 && (
                    <div className="absolute -right-[5px] -top-[5px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#1d9bf0] px-[4px] text-[10px] font-bold text-white">
                      {item.count > 9 ? "9+" : item.count}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

        {/* Floating compose button for mobile */}
        <Link
          href="/compose"
          className="absolute -top-16 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          style={{
            height: "56px",
            width: "56px",
            right: "16px",
          }}
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {/* Wallet Connection Modal */}
      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </>
  );
}
