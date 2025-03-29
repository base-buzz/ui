"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { userApi, postApi } from "@/lib/api";
import { Post, User } from "@/types/interfaces";
import PostComponent from "@/components/post/PostComponent";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { Button } from "@/registry/new-york/ui/button";
import { EditIcon, MoreHorizontal } from "lucide-react";
import { Card } from "@/registry/new-york/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import EditProfileModal from "@/components/modals/EditProfileModal";

export default function ProfilePage() {
  const params = useParams();
  const profileId = params?.id as string;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    user: currentUser,
    loading: currentUserLoading,
    updateUserProfile,
  } = useCurrentUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = currentUser?.id === profileId || profileId === "me";

  // Check for locally stored user data
  const checkLocalStorage = (userId: string) => {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // If the profile is 'me', use the current user's ID
        const actualProfileId =
          profileId === "me" && currentUser ? currentUser.id : profileId;

        if (!actualProfileId) {
          setError("User not found");
          setLoading(false);
          return;
        }

        // Check for locally stored data first
        const localUserData = checkLocalStorage(actualProfileId);

        if (localUserData) {
          console.log("Using locally stored user data", localUserData);
          setProfileUser(localUserData);
        } else {
          // Fetch user data from API
          const userData = await userApi.getUserById(actualProfileId);
          setProfileUser(userData);
        }

        // Fetch user's posts
        const postsData = await postApi.getPostsByUserId(actualProfileId);
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && !currentUserLoading) {
      fetchData();
    }
  }, [profileId, authLoading, currentUserLoading, currentUser]);

  const handleSaveProfile = (updatedUser: User) => {
    setProfileUser(updatedUser);

    if (isOwnProfile && updateUserProfile) {
      updateUserProfile(updatedUser);
    }
  };

  if (loading || authLoading || currentUserLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="rounded-lg bg-destructive/10 p-6 text-destructive">
          <p>{error || "User not found"}</p>
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

  return (
    <>
      <div className="container mx-auto max-w-4xl py-6">
        {/* Profile Header */}
        <div className="mb-6">
          {/* Cover Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-500">
            {profileUser.headerImage && (
              <img
                src={profileUser.headerImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="relative -mt-16 px-4">
            <div className="flex justify-between">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={profileUser.pfp} alt={profileUser.alias} />
                  <AvatarFallback className="text-3xl">
                    {profileUser.alias.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Actions */}
              <div className="mt-16 flex gap-2">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="default">Follow</Button>
                )}
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{profileUser.alias}</h1>
              {profileUser.location && (
                <p className="text-muted-foreground">{profileUser.location}</p>
              )}
              <p className="mt-2">{profileUser.bio}</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostComponent
                  key={post.id}
                  post={post}
                  currentUserId={currentUser?.id}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Media posts will appear here
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="likes" className="mt-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Liked posts will appear here
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && profileUser && (
        <EditProfileModal
          user={profileUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
