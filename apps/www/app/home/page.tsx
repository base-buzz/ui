"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuth, useWalletModal } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { postApi } from "@/lib/api";
import { Post } from "@/types/interfaces";
import PostComponent from "@/components/post/PostComponent";
import CreatePostForm from "@/components/post/CreatePostForm";
import { cn } from "@/lib/utils";
import { Card } from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import { ChevronDown, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { UnauthenticatedView } from "@/components/auth/UnauthenticatedView";
import MobileHeader from "@/components/layout/MobileHeader";

export default function HomePage() {
  const { isAuthenticated, loading: authLoading } = useAuth({
    required: false,
  });
  const { openWalletModal } = useWalletModal();
  const { user, loading: userLoading } = useCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("for-you");
  const [isComposeExpanded, setIsComposeExpanded] = useState(false);
  const [audience, setAudience] = useState("Everyone");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await postApi.getPosts();
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading && !userLoading) {
      fetchPosts();
    }
  }, [isAuthenticated, authLoading, userLoading]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsComposeExpanded(false); // Collapse the form after posting
  };

  // Show loading state while auth or user data is loading
  if (authLoading || userLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show the unauthenticated view component instead of redirecting
  if (!isAuthenticated || !user) {
    return <UnauthenticatedView onAuthClick={openWalletModal} />;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="rounded-lg bg-destructive/10 p-6 text-destructive">
          <p>{error}</p>
          <button
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "for-you", label: "For you" },
    { id: "following", label: "Following" },
    { id: "buildin", label: "Buildin" },
    { id: "canto", label: "Canto" },
  ];

  const toggleAudience = () => {
    // In a real app, we'd show a menu with audience options
    setAudience(audience === "Everyone" ? "Circle" : "Everyone");
  };

  return (
    <>
      {/* Mobile header with tabs - only visible on mobile */}
      <MobileHeader showTabs showProfile />

      {/* Desktop Tabs navigation - hidden on mobile */}
      <div className="sticky top-0 z-10 hidden bg-background/90 backdrop-blur-md md:block">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "flex h-[53px] items-center justify-center border-b-2 px-4 font-medium hover:bg-accent/10",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show posts count section */}
      <div className="flex items-center justify-center border-b border-border py-3.5">
        <button className="text-[15px] font-normal text-primary hover:underline">
          Show 453 posts
        </button>
      </div>

      <div className="divide-y divide-border">
        {/* Post creation area with collapsible form */}
        {user && (
          <div className="p-4">
            {isComposeExpanded ? (
              <div className="flex flex-col">
                {/* Audience selector */}
                <div className="mb-3 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary text-sm font-medium text-primary"
                    onClick={toggleAudience}
                  >
                    <Users className="mr-1 h-3 w-3" />
                    {audience}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                    {user.pfp ? (
                      <img
                        src="https://i.pravatar.cc/150?img=3"
                        alt={user.alias || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xl text-muted-foreground">
                          {user.alias?.[0] || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <CreatePostForm
                      userId={user.id}
                      onPostCreated={handlePostCreated}
                      className="border-0 p-0 shadow-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex gap-3"
                onClick={() => setIsComposeExpanded(true)}
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                  {user.pfp ? (
                    <img
                      src="https://i.pravatar.cc/150?img=3"
                      alt={user.alias || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xl text-muted-foreground">
                        {user.alias?.[0] || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex h-10 cursor-text items-center rounded-full border-0 bg-transparent px-4 text-lg text-muted-foreground">
                    What's happening?
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts feed */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                currentUserId={user?.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Icon name="sparkles" className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Welcome to BaseBuzz!</h3>
              <p className="max-w-[80%] text-muted-foreground">
                Follow other users to see their posts and start building your
                feed. Or create your first post to get started!
              </p>
              <Link href="/explore">
                <Button className="mt-2">Find people to follow</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
