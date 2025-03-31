import { useState } from "react";
import { useUser } from "@/contexts/user-context";

export function ConnectWalletButton() {
  const { user, isLoading, login, logout } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue.",
        );
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        // Use the first account
        const address = accounts[0];

        // Call the login function from user context
        await login(address);
      } else {
        throw new Error("No accounts found. Please connect to MetaMask.");
      }
    } catch (err) {
      console.error("Wallet connection error:", err);

      let errorMessage = "Failed to connect wallet";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    logout();
  };

  // If user is logged in, show their address and a disconnect button
  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
          {user.address
            ? `${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`
            : "Connected"}
        </div>
        <button
          onClick={handleDisconnect}
          className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Show connect button if user is not logged in
  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isLoading || isConnecting}
        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
