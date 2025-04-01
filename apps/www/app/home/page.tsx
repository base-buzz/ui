"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ComposeBox } from "@/components/home/ComposeBox";
import { ShowPostsCount } from "@/components/home/ShowPostsCount";
import { useAuth, useWalletModal } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types/interfaces";
import { postApi, apiFetch } from "@/lib/api";
import { UnauthenticatedHomeView } from "@/components/auth/UnauthenticatedHomeView";
import { PostsSection } from "@/components/home/PostsSection";
import { HomeTabs } from "@/components/home/HomeTabs";

export default function HomePage() {
  const {
    isAuthenticated,
    isWalletConnected,
    hasCustomSession: initialHasCustomSession,
    loading: authLoading,
  } = useAuth({
    required: false,
  });
  const { openWalletModal } = useWalletModal();
  const { user, loading: userLoading } = useCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCustomSession, setHasCustomSession] = useState(
    initialHasCustomSession,
  );
  const [authType, setAuthType] = useState<string | null>(null);
  const pathname = usePathname();

  // Check for active session on component mount
  useEffect(() => {
    async function checkSession() {
      try {
        console.log("🔍 Checking session status...");
        if (isWalletConnected) {
          console.log("👛 Wallet is connected");

          // Check for any valid session (both custom and JWT)
          const sessionResponse = await apiFetch<{
            authenticated: boolean;
            auth_type: string | null;
            debug_info?: any;
          }>("/api/auth/session");

          console.log("📋 Session status:", sessionResponse);

          if (sessionResponse.authenticated) {
            console.log(
              `✅ User authenticated via ${sessionResponse.auth_type || "unknown"}`,
            );
            setHasCustomSession(true);
            setAuthType(sessionResponse.auth_type);
          } else {
            console.log("⚠️ No active session found");
            // Check if we have user information even without a valid session
            const userResponse = await apiFetch<{
              id: string;
              auth_type: string | null;
              error?: string;
            }>("/api/auth/user").catch((err) => {
              console.log("User API error:", err);
              return { error: "No user found", id: "", auth_type: null };
            });

            if (userResponse && !userResponse.error) {
              console.log("🔑 User found despite session check failure");
              setHasCustomSession(true);
              setAuthType(userResponse.auth_type);
            } else {
              console.log("❌ No user session found");
              setHasCustomSession(false);
            }
          }
        } else {
          console.log("👛 Wallet not connected");
          setHasCustomSession(false);
        }
      } catch (error) {
        console.error("❌ Error checking session:", error);
        setHasCustomSession(false);
      }
    }

    checkSession();
  }, [isWalletConnected]);

  // Fetch posts when authentication status changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Log auth status
        console.log("🔐 Auth status:", {
          isWalletConnected,
          isAuthenticated,
          hasCustomSession,
          authType,
        });

        if (isWalletConnected && (isAuthenticated || hasCustomSession)) {
          console.log(
            `📊 Fetching posts with auth... (${authType || "unknown"} authentication)`,
          );
          const fetchedPosts = await postApi.getPosts();

          console.log(`📝 Received ${fetchedPosts.length} posts`);
          setPosts(fetchedPosts);
        } else {
          console.log("⚠️ Not authenticated, skipping post fetch");
          setPosts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
        setError("Failed to fetch posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, isWalletConnected, hasCustomSession, authType]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Show loading state while auth or user data is loading
  if (authLoading || userLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show the authenticated view if we have either standard auth or a custom session
  // AND the wallet is connected (this ensures we have both pieces in place)
  if (isWalletConnected && (isAuthenticated || hasCustomSession)) {
    if (error) {
      return (
        <div className="flex h-full items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Desktop tabs - visible on md screens and above */}
        <div className="hidden md:block">
          <HomeTabs />
        </div>

        <div className="divide-y divide-border">
          {/* Post creation area with collapsible form */}
          {user && (
            <div className="hidden p-4 md:block">
              <ComposeBox user={user} onPostCreated={handlePostCreated} />
              <ShowPostsCount count={posts.length} />
            </div>
          )}

          {/* Posts feed with loading state */}
          <PostsSection
            posts={posts.map((post, index) => ({
              ...post,
              showPostCount: index === 0, // Only show post count on first post
            }))}
            loading={loading}
            currentUserId={user?.id}
            className="divide-y divide-border"
          />
        </div>
      </>
    );
  }

  // Show the unauthenticated home view component
  return <UnauthenticatedHomeView onConnectWallet={openWalletModal} />;
}
