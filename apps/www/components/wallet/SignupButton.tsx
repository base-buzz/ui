import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";
import { toast } from "sonner";

export interface SignupButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const SignupButton = ({
  icon,
  text,
  onClick,
  className,
}: SignupButtonProps) => {
  const { openConnectModal } = useConnectModal();
  const { status, error } = useConnect();
  const { isConnected } = useAccount();

  // Handle connection errors
  if (error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("rejected")) {
      toast.error("Connection rejected. Please try again.");
    } else if (errorMessage.includes("not installed")) {
      toast.error(
        "Wallet not installed. Please install the wallet to continue.",
      );
    } else {
      toast.error("Failed to connect. Please try again.");
    }
  }

  const handleClick = () => {
    onClick?.();
    openConnectModal?.();
  };

  const isConnecting = status === "pending";

  return (
    <button
      className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#536471]/25 bg-white text-[15px] font-medium leading-5 text-[#3c4043] transition-colors hover:bg-[#e6e6e6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d9bf0] disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      onClick={handleClick}
      disabled={isConnecting || isConnected}
    >
      <div className="rounded-[15px] bg-white p-1">
        <Image
          src={icon}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7"
          aria-hidden="true"
        />
      </div>
      {isConnecting ? "Connecting..." : isConnected ? "Connected" : text}
    </button>
  );
};
