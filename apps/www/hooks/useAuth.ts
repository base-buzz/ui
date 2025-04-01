/**
 * Authentication hook - Enhanced to handle both wallet connections and custom sessions
 * @file apps/www/hooks/useAuth.ts
 *
 * UPDATES:
 * - Added check for custom wallet sessions and JWT tokens
 * - Improved authentication detection with better debugging
 * - Added cookie checking for both formats (hyphen and underscore)
 */

import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface UseAuthOptions {
  /**
   * If true, redirects to home page when not authenticated
   */
  required?: boolean;

  /**
   * If provided, redirects to this path when not authenticated
   */
  redirectTo?: string;

  /**
   * If true, redirects authenticated users away from pages like login
   */
  redirectIfAuthenticated?: boolean;

  /**
   * Path to redirect authenticated users to
   */
  redirectAuthenticatedTo?: string;
}

/**
 * Authentication hook for the BaseBuzz application
 *
 * This hook provides:
 * - Authentication state (isAuthenticated, isWalletConnected, hasCustomSession)
 * - Authentication actions (login, logout, connectWallet)
 * - User session management for both Supabase and wallet-based auth
 */
export function useAuth(options = { required: false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasCustomSession, setHasCustomSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState<"supabase" | "wallet" | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();

  // Check for wallet connections directly from cookie
  const checkWalletCookies = useCallback(() => {
    const cookies = document.cookie.split(";");

    // Check for JWT token cookie (old format)
    const hasJwtToken = cookies.some((cookie) =>
      cookie.trim().startsWith("basebuzz-wallet-token="),
    );

    // Check for custom session cookie (new format)
    const hasSessionCookie = cookies.some((cookie) =>
      cookie.trim().startsWith("basebuzz_wallet_session="),
    );

    const hasCookie = hasJwtToken || hasSessionCookie;

    if (hasCookie) {
      console.log(
        `🍪 [useAuth] Found wallet ${hasJwtToken ? "JWT token" : "session cookie"}`,
      );
    }

    return hasCookie;
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      console.log("🔍 [useAuth] Checking authentication status");
      setLoading(true);

      // First check if the wallet is connected via wagmi
      if (wagmiIsConnected && wagmiAddress) {
        console.log(
          `👛 [useAuth] Wallet connected from wagmi: ${wagmiAddress}`,
        );
        setIsWalletConnected(true);

        // Store wallet connection in localStorage
        localStorage.setItem(
          "basebuzz_wallet_connected",
          JSON.stringify({
            connected: true,
            address: wagmiAddress,
          }),
        );
      }

      // Check for wallet cookies
      const hasWalletCookie = checkWalletCookies();

      if (hasWalletCookie) {
        setHasCustomSession(true);
      }

      // Call the session endpoint to check auth status
      const response = await apiFetch<{
        authenticated: boolean;
        auth_type?: string;
        user?: any;
        message?: string;
        debug?: any;
      }>("/api/auth/session");

      console.log("📋 [useAuth] Session response:", response);

      if (response.authenticated) {
        setIsAuthenticated(true);
        setAuthType(
          (response.auth_type as "supabase" | "wallet") || "supabase",
        );

        // If auth type is wallet, also set wallet connected state
        if (
          response.auth_type === "wallet" ||
          response.auth_type === "custom_wallet"
        ) {
          setIsWalletConnected(true);
          setHasCustomSession(true);
        }
      } else {
        console.log("⚠️ [useAuth] Session API reports no authentication");

        // If session API reports no auth, but we have wallet cookies,
        // check the user API as a fallback to confirm auth status
        if (hasWalletCookie) {
          try {
            console.log("🔄 [useAuth] Checking user API as fallback");
            const userResponse = await apiFetch<{
              id?: string;
              error?: string;
              authenticated?: boolean;
            }>("/api/auth/user").catch((err) => {
              console.error("❌ [useAuth] User API error:", err);
              return { error: "Failed to fetch user", authenticated: false };
            });

            if (
              userResponse &&
              "id" in userResponse &&
              userResponse.id &&
              !userResponse.error
            ) {
              console.log("✅ [useAuth] User API confirmed authentication");
              setIsAuthenticated(true);
              setAuthType("wallet");
              setHasCustomSession(true);
            } else {
              console.log("❌ [useAuth] User API confirms no authentication");
              setIsAuthenticated(false);
              setAuthType(null);

              // Only clear custom session if user API also fails
              setHasCustomSession(false);
            }
          } catch (error) {
            console.error("❌ [useAuth] Error checking user API:", error);
            // Keep the hasCustomSession true if we have cookies
            // but just couldn't verify with the user API
            setIsAuthenticated(false);
            setAuthType(null);
          }
        } else {
          setIsAuthenticated(false);
          setAuthType(null);
          setHasCustomSession(false);
        }

        // Check explicitly for wallet connection from local storage
        const walletData = localStorage.getItem("basebuzz_wallet_connected");
        if (walletData) {
          try {
            const { connected, address } = JSON.parse(walletData);
            setIsWalletConnected(connected);
            console.log(
              `👛 [useAuth] Wallet ${connected ? "connected" : "disconnected"}: ${address || "unknown"}`,
            );
          } catch (e) {
            console.error("❌ [useAuth] Error parsing wallet data:", e);
            setIsWalletConnected(false);
          }
        } else {
          // Only set to false if wagmi also reports disconnected
          if (!wagmiIsConnected) {
            setIsWalletConnected(false);
          }
        }
      }
    } catch (error) {
      console.error("❌ [useAuth] Error checking auth:", error);

      // Even if the API check fails, check for wallet cookies
      // to maintain the session if possible
      const hasWalletCookie = checkWalletCookies();

      setIsAuthenticated(false);
      setAuthType(null);

      // Only clear hasCustomSession if we don't have cookies
      if (!hasWalletCookie) {
        setHasCustomSession(false);
      }
    } finally {
      setLoading(false);
    }
  }, [wagmiIsConnected, wagmiAddress, checkWalletCookies]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Re-check auth when wallet connect status changes from wagmi
  useEffect(() => {
    if (wagmiIsConnected !== undefined) {
      console.log(`🔄 [useAuth] Wagmi connection changed: ${wagmiIsConnected}`);
      checkAuth();
    }
  }, [wagmiIsConnected, checkAuth]);

  // Redirect to login if auth is required but user is not authenticated
  useEffect(() => {
    if (
      options.required &&
      !loading &&
      !isAuthenticated &&
      pathname !== "/login"
    ) {
      router.push("/login");
      toast.error("Please sign in to continue");
    }
  }, [options.required, loading, isAuthenticated, router, pathname]);

  // Open wallet modal for easy connection
  const openWalletModal = useCallback(() => {
    try {
      // Trigger the wallet modal event
      const walletEvent = new CustomEvent("openWalletModal");
      window.dispatchEvent(walletEvent);
    } catch (error) {
      console.error("❌ [useAuth] Error opening wallet modal:", error);
      toast.error("Failed to open wallet connection modal");
    }
  }, []);

  // Log out of the current session
  const logout = useCallback(async () => {
    try {
      // Clear all wallet cookies
      document.cookie =
        "basebuzz_wallet_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "basebuzz-wallet-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Clear wallet connection from localStorage
      localStorage.removeItem("basebuzz_wallet_connected");

      // Clear Supabase session
      await apiFetch("/api/auth/signout", { method: "POST" });

      // Update state
      setIsAuthenticated(false);
      setHasCustomSession(false);
      setAuthType(null);

      // Redirect to home page
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("❌ [useAuth] Error during logout:", error);
      toast.error("Failed to log out");
    }
  }, [router]);

  return {
    isAuthenticated,
    isWalletConnected,
    hasCustomSession,
    authType,
    loading,
    openWalletModal,
    logout,
    checkAuth,
  };
}

/**
 * Utility to check if a route is protected
 */
export function isProtectedRoute(items: any[], path: string): boolean {
  const item = items.find((item) => item.path === path);
  return item ? !!item.protected : false;
}

// Also export the wallet modal hook for convenience
export function useWalletModal() {
  const openModal = useCallback(() => {
    try {
      // Trigger the wallet modal event
      const walletEvent = new CustomEvent("openWalletModal");
      window.dispatchEvent(walletEvent);
    } catch (error) {
      console.error("Failed to open wallet modal:", error);
    }
  }, []);

  return { openWalletModal: openModal };
}
