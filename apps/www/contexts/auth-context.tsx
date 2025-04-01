import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { useAccount, useDisconnect } from "wagmi";
import { supabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Define types for our auth context
interface AuthContextType {
  // Auth state
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Wallet state
  walletAddress: string | null;
  isWalletConnected: boolean;

  // Authentication methods
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  connectWallet: (address: string) => Promise<void>;
  linkWalletToAccount: (address: string) => Promise<void>;
  unlinkWallet: (address: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Wallet methods
  getLinkedWallets: () => Promise<string[]>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  // State for auth
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get wallet state from wagmi
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(
          async (event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          },
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast.error("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Connect wallet (simplified - no signature required)
  const connectWallet = async (address: string) => {
    try {
      // Call our simplified endpoint that handles wallet connection without SIWE
      const response = await fetch("/api/auth/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect wallet");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  };

  // Link wallet to account
  const linkWalletToAccount = async (address: string) => {
    try {
      const response = await fetch("/api/auth/link/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to link wallet");
      }
    } catch (error) {
      console.error("Link wallet error:", error);
      throw error;
    }
  };

  // Unlink wallet
  const unlinkWallet = async (address: string) => {
    try {
      const response = await fetch("/api/auth/unlink/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unlink wallet");
      }
    } catch (error) {
      console.error("Unlink wallet error:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      disconnect();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Get linked wallets
  const getLinkedWallets = async () => {
    try {
      const response = await fetch("/api/auth/user/wallets", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get linked wallets");
      }

      const data = await response.json();
      return data.wallets || [];
    } catch (error) {
      console.error("Get linked wallets error:", error);
      throw error;
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    walletAddress: address ?? null,
    isWalletConnected: isConnected,
    signUpWithEmail,
    signInWithEmail,
    connectWallet,
    linkWalletToAccount,
    unlinkWallet,
    signOut,
    getLinkedWallets,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
