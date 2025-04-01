import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { User } from "@/types/interfaces";
import { useAuth } from "@/contexts/auth-context";

// Array of realistic profile pictures from pravatar.cc
const PROFILE_IMAGES = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=14",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=17",
  "https://i.pravatar.cc/150?img=18",
  "https://i.pravatar.cc/150?img=19",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=21",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=23",
  "https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=25",
  "https://i.pravatar.cc/150?img=26",
  "https://i.pravatar.cc/150?img=27",
  "https://i.pravatar.cc/150?img=28",
  "https://i.pravatar.cc/150?img=29",
  "https://i.pravatar.cc/150?img=30",
  "https://i.pravatar.cc/150?img=31",
  "https://i.pravatar.cc/150?img=32",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=34",
  "https://i.pravatar.cc/150?img=35",
  "https://i.pravatar.cc/150?img=36",
  "https://i.pravatar.cc/150?img=37",
  "https://i.pravatar.cc/150?img=38",
  "https://i.pravatar.cc/150?img=39",
  "https://i.pravatar.cc/150?img=40",
  "https://i.pravatar.cc/150?img=41",
  "https://i.pravatar.cc/150?img=42",
  "https://i.pravatar.cc/150?img=43",
  "https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=45",
  "https://i.pravatar.cc/150?img=46",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=48",
  "https://i.pravatar.cc/150?img=49",
  "https://i.pravatar.cc/150?img=50",
  "https://i.pravatar.cc/150?img=51",
  "https://i.pravatar.cc/150?img=52",
  "https://i.pravatar.cc/150?img=53",
  "https://i.pravatar.cc/150?img=54",
  "https://i.pravatar.cc/150?img=55",
  "https://i.pravatar.cc/150?img=56",
  "https://i.pravatar.cc/150?img=57",
  "https://i.pravatar.cc/150?img=58",
  "https://i.pravatar.cc/150?img=59",
  "https://i.pravatar.cc/150?img=60",
  "https://i.pravatar.cc/150?img=61",
  "https://i.pravatar.cc/150?img=62",
  "https://i.pravatar.cc/150?img=63",
  "https://i.pravatar.cc/150?img=64",
  "https://i.pravatar.cc/150?img=65",
  "https://i.pravatar.cc/150?img=66",
  "https://i.pravatar.cc/150?img=67",
  "https://i.pravatar.cc/150?img=68",
  "https://i.pravatar.cc/150?img=69",
  "https://i.pravatar.cc/150?img=70",
];

// Array of header images
const HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1500&h=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1500&h=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1500&h=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=1500&h=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1500&h=500&auto=format&fit=crop",
];

/**
 * Constants for profile image and default avatar
 */
const DEFAULT_AVATAR = "/anonymous-avatar.png";

/**
 * Helper function to check if a custom wallet session exists
 */
async function checkCustomWalletSession() {
  try {
    const response = await fetch("/api/auth/session");
    if (response.ok) {
      const data = await response.json();
      if (data.authenticated && data.auth_type === "custom_wallet") {
        return {
          exists: true,
          userId: data.user_id,
          walletAddress: data.wallet_address,
        };
      }
    }
    return { exists: false };
  } catch (error) {
    console.error("Error checking custom session:", error);
    return { exists: false };
  }
}

/**
 * Hook to get the current user's information from the Supabase session
 * This is a simplified version that integrates with our wallet-based auth
 */
export function useCurrentUser() {
  const { address, isConnected } = useAccount();
  const { user: authUser, session, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check local storage for user data
  const checkLocalStorage = (userId: string): User | null => {
    if (typeof window !== "undefined") {
      const localStorageKey = `basebuzz_user_${userId}`;
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData) {
        try {
          return JSON.parse(storedData) as User;
        } catch (e) {
          console.error("Error parsing local storage data:", e);
        }
      }
    }
    return null;
  };

  // Get a random profile image
  const getRandomProfileImage = () => {
    return PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)];
  };

  // Get a random header image
  const getRandomHeaderImage = () => {
    return HEADER_IMAGES[Math.floor(Math.random() * HEADER_IMAGES.length)];
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        let userFromApiOrStorage: User | null = null;
        let userId: string | undefined = authUser?.id;
        let walletAddr = address;

        // Check for custom wallet session if no standard session is available
        if (!isAuthenticated || !authUser) {
          const customSession = await checkCustomWalletSession();
          if (customSession.exists) {
            userId = customSession.userId;
            walletAddr = customSession.walletAddress;
            console.log("🔐 Using custom wallet session for user:", userId);
          }
        }

        if (!userId && !walletAddr) {
          setUser(null);
          return;
        }

        // Check local storage cache first
        if (userId) {
          const cachedUser = checkLocalStorage(userId);
          if (cachedUser) {
            console.log("📋 Using cached user data from localStorage");
            userFromApiOrStorage = cachedUser;
          }
        }

        // If no cached data, try to fetch from API
        if (!userFromApiOrStorage) {
          try {
            // Try to get user data from the API
            const response = await fetch(`/api/auth/user`);

            if (response.ok) {
              const userData = await response.json();
              console.log("👤 Fetched user data from API:", userData);
              userFromApiOrStorage = userData;

              // Cache in localStorage
              if (userId && typeof window !== "undefined") {
                const localStorageKey = `basebuzz_user_${userId}`;
                localStorage.setItem(localStorageKey, JSON.stringify(userData));
              }
            } else {
              const errorData = await response.json();
              console.warn("API returned error:", errorData);

              // If wallet is connected but no user exists, create a placeholder user
              if (isConnected && walletAddr) {
                console.log(
                  "🔄 Creating placeholder user for wallet:",
                  walletAddr,
                );
                userFromApiOrStorage = {
                  id: userId || "placeholder-id",
                  address: walletAddr,
                  display_name: `Wallet ${walletAddr.slice(0, 6)}`,
                  avatar_url: getRandomProfileImage(),
                  bio: null,
                  email: null,
                  tier: "blue",
                  buzz_balance: 0,
                  ens_name: null,
                  location: null,
                  header_url: getRandomHeaderImage(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              }
            }
          } catch (err) {
            console.error("Error fetching user:", err);
            if (err instanceof Error) {
              setError(err);
            } else {
              setError(new Error("Failed to fetch user data"));
            }
          }
        }

        setUser(userFromApiOrStorage);
      } catch (err) {
        console.error("Error in useCurrentUser:", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unexpected error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, authUser, isConnected, address]);

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return null;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  };

  /**
   * Helper function to consistently handle user avatar URL
   * This ensures all components use the same avatar URL logic
   */
  const getUserAvatar = (user?: User | null) => {
    if (!user) return DEFAULT_AVATAR;

    // Use user's avatar_url if available
    if (user.avatar_url) return user.avatar_url;

    // Otherwise use default avatar
    return DEFAULT_AVATAR;
  };

  return {
    user,
    loading,
    error,
    updateUserProfile,
    checkCustomWalletSession,
    getUserAvatar,
  };
}
