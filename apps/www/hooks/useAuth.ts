import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export function useAuth(options: UseAuthOptions = {}) {
  const {
    required = false,
    redirectTo = "/",
    redirectIfAuthenticated = false,
    redirectAuthenticatedTo = "/home",
  } = options;

  const { isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initially set loading to true
    setLoading(true);

    // Small delay to ensure wallet connection state is processed
    const timeoutId = setTimeout(() => {
      if (required && !isConnected) {
        // If authentication is required and user is not connected, redirect
        router.push(redirectTo);
      } else if (redirectIfAuthenticated && isConnected) {
        // If user should be redirected when authenticated
        router.push(redirectAuthenticatedTo);
      }

      setLoading(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    isConnected,
    required,
    redirectTo,
    redirectIfAuthenticated,
    redirectAuthenticatedTo,
    router,
  ]);

  return { isAuthenticated: isConnected, loading };
}

/**
 * Utility to check if a route is protected
 */
export function isProtectedRoute(items: any[], path: string): boolean {
  const item = items.find((item) => item.path === path);
  return item ? !!item.protected : false;
}

/**
 * Hook to handle wallet modal state
 */
export function useWalletModal() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  return { isWalletModalOpen, openWalletModal, closeWalletModal };
}
