"use client";

import React, { useState } from "react";
import { Image, Smile, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/api";
import { Post } from "@/types/interfaces";
import { Button } from "@/registry/new-york/ui/button";
import { Card } from "@/registry/new-york/ui/card";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { cn } from "@/lib/utils";

interface CreatePostFormProps {
  userId: string;
  onPostCreated?: (post: Post) => void;
  quoteTweetId?: string;
  replyToId?: string;
  className?: string;
}

export default function CreatePostForm({
  userId,
  onPostCreated,
  quoteTweetId,
  replyToId,
  className,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const router = useRouter();

  const handleAddMedia = () => {
    // In a real app, you'd implement a file upload functionality
    // This is a simplified mock version that adds a random image URL
    const newMediaUrl = `https://source.unsplash.com/random/800x600?sig=${Math.random()}`;
    setMedia((prev) => [...prev, newMediaUrl]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && media.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      let newPost;

      if (replyToId) {
        // If it's a reply, use the reply API
        const response = await postApi.replyToPost(
          replyToId,
          userId,
          content,
          media.length > 0 ? media : undefined,
        );
        newPost = response.comment;
      } else if (quoteTweetId) {
        // If it's a quote tweet, use the quote tweet API
        const response = await postApi.quoteTweet(
          quoteTweetId,
          userId,
          content,
          media.length > 0 ? media : undefined,
        );
        newPost = response.post;
      } else {
        // Regular post
        newPost = await postApi.createPost({
          userId,
          content,
          media: media.length > 0 ? media : undefined,
        });
      }

      // Reset form
      setContent("");
      setMedia([]);
      setIsTextareaFocused(false);

      // Call the onPostCreated callback if provided
      if (onPostCreated && newPost) {
        onPostCreated(newPost);
      }

      // Refresh the page to show the new post
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder={
            replyToId
              ? "Write your reply..."
              : quoteTweetId
                ? "Add a comment..."
                : "What's happening?"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => content.length === 0 && setIsTextareaFocused(false)}
          className="min-h-[100px] resize-none border-0 bg-transparent p-0 text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {media.length > 0 && (
          <div
            className={`mt-3 grid gap-2 ${media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {media.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="max-h-[200px] w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 rounded-full bg-background/80 p-1"
                  onClick={() => handleRemoveMedia(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Reply settings - only show when textarea is focused or has content */}
        {(isTextareaFocused || content.length > 0) && (
          <div className="my-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full px-3 text-sm text-primary"
            >
              <Globe className="mr-1 h-4 w-4" />
              Everyone can reply
            </Button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAddMedia}
              disabled={media.length >= 4}
              title={
                media.length >= 4 ? "Maximum 4 images allowed" : "Add image"
              }
              className="rounded-full text-primary"
            >
              <Image className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Add emoji"
              className="rounded-full text-primary"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || (!content.trim() && media.length === 0)}
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting
              ? "Posting..."
              : replyToId
                ? "Reply"
                : quoteTweetId
                  ? "Quote"
                  : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
