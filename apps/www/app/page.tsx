import { Metadata } from "next";
import NotLoggedInLayout from "@/components/layout/auth/NotLoggedInLayout";

export const metadata: Metadata = {
  title: "BaseBuzz - Join the conversation",
  description: "Join BaseBuzz today to be part of the conversation.",
};

export default function Home() {
  // TODO: Add authentication check here
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <NotLoggedInLayout />;
  }

  // TODO: Add authenticated layout here
  return null;
}
