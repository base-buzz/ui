"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
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

export default function HomePage() {
  const { isAuthenticated, loading: authLoading } = useAuth({ required: true });
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

  // Don't render not-logged-in message, let the useAuth hook handle redirection
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
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
      {/* Tabs navigation */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md">
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
              <div key={post.id} className="p-4">
                <PostComponent post={post} currentUserId={user?.id} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                No posts yet. Be the first to post!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating action button */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link href="/compose">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </>
  );
}
