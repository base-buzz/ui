import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usersApi, User } from "@/lib/api-client";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (address: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check for user on initial load (e.g., from local storage)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
          setIsLoading(true);

          // Fetch user data from API
          const userData = await usersApi.getUser(storedUserId);
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        // Clear stored user ID if it's invalid
        localStorage.removeItem("userId");
        setError(err instanceof Error ? err : new Error("Failed to load user"));
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, we would:
      // 1. Verify the wallet signature
      // 2. Call an authentication API endpoint
      // 3. Receive a user object or token

      // For demo purposes, we'll just simulate by fetching a user
      // or creating one if it doesn't exist

      // Normally this would be part of your auth API
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          display_name: `User_${address.substring(0, 6)}`,
        }),
      });

      if (!response.ok) throw new Error("Authentication failed");

      const userData = await response.json();
      setUser(userData);

      // Store user ID for persistence
      localStorage.setItem("userId", userData.id);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err : new Error("Authentication failed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the user context
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
