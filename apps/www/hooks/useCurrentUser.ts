import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { User } from "@/types/interfaces";
import { userApi } from "@/lib/api";

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
 * Hook to get the current user's information
 * If the user is not found in the database, a placeholder is created
 */
export function useCurrentUser() {
  const { address, isConnected } = useAccount();
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

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (!isConnected || !address) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check local storage first
        const localUserData = checkLocalStorage(address);

        if (localUserData) {
          console.log("Using locally stored user data", localUserData);
          setUser(localUserData);
          setLoading(false);
          return;
        }

        // Fetch all users and find the one matching the current address
        const users = await userApi.getUsers();

        // Look for the user by address as ID (same as wallet address)
        const foundUser = users.find((u) => u.id === address);

        if (foundUser) {
          setUser(foundUser);
        } else {
          // If user is not found, create a placeholder object
          // This would ideally be stored in the database, but for this mock
          // we'll just create a client-side representation
          const placeholderUser: User = {
            id: address,
            alias: `user_${address.substring(0, 6)}`,
            pfp: getRandomProfileImage(),
            dob: new Date().toISOString().split("T")[0],
            location: "Web3 Land",
            headerImage: getRandomHeaderImage(),
            bio: "Just joined BaseBuzz!",
          };

          setUser(placeholderUser);

          // Save the placeholder user to local storage
          if (typeof window !== "undefined") {
            const localStorageKey = `basebuzz_user_${address}`;
            localStorage.setItem(
              localStorageKey,
              JSON.stringify(placeholderUser),
            );
          }

          // In a real application, we would save this user to the database
          // await userApi.createUser(placeholderUser);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [address, isConnected]);

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return null;

    try {
      // Create a merged user object
      const updatedUser = {
        ...user,
        ...updatedData,
      };

      // Save to local storage
      if (typeof window !== "undefined") {
        const localStorageKey = `basebuzz_user_${user.id}`;
        localStorage.setItem(localStorageKey, JSON.stringify(updatedUser));
      }

      // In a real app, this would call the API
      // const apiUpdatedUser = await userApi.updateUser({
      //   id: user.id,
      //   ...updatedData,
      // });

      // Update the state with the local version
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err : new Error("Failed to update user"));
      return null;
    }
  };

  return { user, loading, error, updateUserProfile };
}
