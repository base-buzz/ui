import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SignupButton } from "./SignupButton";
import { toast } from "sonner";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Please enter a valid email address");
      }

      // TODO: Implement actual email signup logic here
      // For now, just redirect to /home as preview
      toast.success("Welcome to BaseBuzz!");
      router.push("/home");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-[44px] rounded-[10px] bg-background"
        required
      />
      {email && (
        <SignupButton
          icon="/email.svg"
          text={isLoading ? "Signing up..." : "Continue with Email"}
          onClick={() => {}} // Empty function since we're using form submit
          className="disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}
    </form>
  );
}
