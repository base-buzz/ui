"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Repeat, Share } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post, User } from "@/types/interfaces";
import { userApi, postApi } from "@/lib/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/new-york/ui/card";
import { Icon } from "@/components/ui/icons";

interface PostComponentProps {
  post: Post;
  currentUserId?: string;
  isComment?: boolean;
}

/**
 * Simple utility to format a date relative to now
 */
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

export default function PostComponent({
  post,
  currentUserId,
  isComment = false,
}: PostComponentProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [retweetCount, setRetweetCount] = useState(post.retweets);
  const [showComments, setShowComments] = useState(false);

  // Fetch user information when component mounts (only if needed)
  React.useEffect(() => {
    const fetchUser = async () => {
      // Only fetch if we don't already have user data in the post
      if (!post.userName || !post.userAvatar) {
        try {
          const userData = await userApi.getUserById(post.userId);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [post.userId, post.userName, post.userAvatar]);

  const handlePostClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on an interactive element
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }

    router.push(`/post/${post.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the post click handler from firing
    if (!currentUserId) return;

    try {
      if (isLiked) {
        await postApi.unlikePost(post.id, currentUserId);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await postApi.likePost(post.id, currentUserId);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the post click handler from firing
    if (!currentUserId) return;

    try {
      if (isRetweeted) {
        await postApi.unretweetPost(post.id, currentUserId);
        setRetweetCount((prev) => Math.max(0, prev - 1));
      } else {
        await postApi.retweetPost(post.id, currentUserId);
        setRetweetCount((prev) => prev + 1);
      }
      setIsRetweeted(!isRetweeted);
    } catch (error) {
      console.error("Error retweeting/unretweeting post:", error);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the post click handler from firing

    // If we're in the post detail view, just toggle the comments
    if (isComment) {
      setShowComments(!showComments);
    } else {
      // Navigate to post detail page for commenting
      router.push(`/post/${post.id}`);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the post click handler from firing
    // Share functionality would be implemented here
  };

  // Use post data if available, otherwise fall back to fetched user data
  const displayName = post.userName || user?.alias || "Anonymous";
  const displayHandle =
    post.userHandle ||
    (user?.id ? `@user_${user.id.substring(0, 6)}` : "@user");
  const avatarSrc = post.userAvatar || user?.pfp;
  const isVerified = post.verified || false;

  return (
    <Card
      className={`${isComment ? "ml-12 mt-2 border-t" : ""} cursor-pointer transition-colors hover:bg-accent/10`}
      onClick={handlePostClick}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-2">
        <Link
          href={`/profile/${post.userId}`}
          className="shrink-0"
          onClick={(e) => e.stopPropagation()} // Prevent the post click handler from firing
        >
          <Avatar>
            <AvatarImage src={avatarSrc} alt={displayName} />
            <AvatarFallback>
              {displayName.substring(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link
                href={`/profile/${post.userId}`}
                className="font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()} // Prevent the post click handler from firing
              >
                {displayName}
              </Link>
              {isVerified && (
                <Icon name="shield-check" className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm text-muted-foreground">
                {displayHandle}
              </span>
              <span className="text-sm text-muted-foreground">
                ·{" "}
                {post.createdAt ? formatTimeAgo(new Date(post.createdAt)) : ""}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>

        {post.media && post.media.length > 0 && (
          <div
            className={`mt-3 grid gap-2 ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {post.media.map((media, index) => (
              <img
                key={index}
                src={media}
                alt={`Post media ${index + 1}`}
                className="max-h-[300px] w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {post.quoteTweet && (
          <div className="mt-3 rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Quoted Tweet</p>
            {/* We'd fetch and render the quoted tweet here */}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2"
          onClick={handleComment}
        >
          <MessageCircle
            className={`h-4 w-4 ${showComments ? "text-primary" : ""}`}
          />
          <span className="text-xs">{post.comments.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex gap-2 ${isRetweeted ? "text-green-500" : ""}`}
          onClick={handleRetweet}
        >
          <Repeat className="h-4 w-4" />
          <span className="text-xs">{retweetCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex gap-2 ${isLiked ? "text-red-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-xs">{likeCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>

      {/* Comments section - only show in post detail view or when expanded */}
      {isComment && showComments && post.comments.length > 0 && (
        <div className="border-t p-4">
          <h3 className="mb-4 font-semibold">Comments</h3>
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <PostComponent
                key={comment.id}
                post={comment}
                currentUserId={currentUserId}
                isComment={true}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
