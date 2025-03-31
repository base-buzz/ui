import {
  User,
  Post,
  DirectMessage,
  Notification,
  Listing,
} from "@/types/interfaces";

/**
 * API client for interacting with the backend
 */

// Base API URL
const API_URL = "/api";

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "An error occurred");
  }
  return response.json();
};

// User API functions
export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    return handleResponse(response);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`);
    return handleResponse(response);
  },

  // Update user profile
  updateUser: async (user: Partial<User> & { id: string }): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },
};

// Post API functions
export const postApi = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    try {
      // Use the new API endpoints
      const response = await fetch(`${API_URL}/posts?limit=20&page=0`);
      const data = await handleResponse(response);

      // Map the API response to match the existing Post interface used by UI components
      const posts = data.map((post: any) => ({
        id: post.id,
        userId: post.user_id,
        userName: post.display_name || "User",
        userHandle: post.address ? `@${post.address.substring(0, 8)}` : "@user",
        userAvatar: post.avatar_url || "https://i.pravatar.cc/150?img=1",
        verified: post.tier === "gold" || post.tier === "diamond",
        content: post.content,
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        retweets: post.reposts_count || 0,
        comments: [], // Will be populated below
        media: post.media_urls || [],
        // Add metadata for paginating replies
        _repliesMetadata: {
          hasMoreReplies: post.replies_count > 10,
          totalReplies: post.replies_count || 0,
          currentPage: 0,
        },
      }));

      // Fetch replies for each post in parallel
      if (posts.length > 0) {
        try {
          const postsWithReplies = await Promise.all(
            posts.map(async (post) => {
              try {
                // Get first page of replies (10 per page)
                const replies = await postApi.getPostReplies(post.id, 0, 10);
                return {
                  ...post,
                  comments: replies,
                };
              } catch (error) {
                console.error(
                  `Error fetching replies for post ${post.id}:`,
                  error,
                );
                return post; // Return the post without replies if there's an error
              }
            }),
          );
          return postsWithReplies;
        } catch (error) {
          console.error("Error fetching replies for posts:", error);
        }
      }

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Return empty array if API fails
      return [];
    }
  },

  // Get replies to a post
  getPostReplies: async (
    postId: string,
    page = 0,
    limit = 10,
  ): Promise<Post[]> => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/replies?limit=${limit}&page=${page}`,
      );
      const data = await handleResponse(response);

      // Map replies to the Post interface
      return data.map((reply: any) => ({
        id: reply.id,
        userId: reply.user_id,
        userName: reply.display_name || "User",
        userHandle: reply.address
          ? `@${reply.address.substring(0, 8)}`
          : "@user",
        userAvatar: reply.avatar_url || "https://i.pravatar.cc/150?img=1",
        verified: reply.tier === "gold" || reply.tier === "diamond",
        content: reply.content,
        createdAt: reply.created_at,
        likes: reply.likes_count || 0,
        retweets: reply.reposts_count || 0,
        comments: [], // We don't fetch nested replies
        media: reply.media_urls || [],
      }));
    } catch (error) {
      console.error(`Error fetching replies for post ${postId}:`, error);
      return [];
    }
  },

  // Get post by ID
  getPostById: async (id: string): Promise<Post | null> => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      const post = await handleResponse(response);

      // Map the API response to match the existing Post interface
      const mappedPost = {
        id: post.id,
        userId: post.user_id,
        userName: post.display_name || "User",
        userHandle: post.address ? `@${post.address.substring(0, 8)}` : "@user",
        userAvatar: post.avatar_url || "https://i.pravatar.cc/150?img=1",
        verified: post.tier === "gold" || post.tier === "diamond",
        content: post.content,
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        retweets: post.reposts_count || 0,
        comments: [] as Post[], // Explicitly type comments as Post[]
        media: post.media_urls || [],
        // Add metadata for paginating replies
        _repliesMetadata: {
          hasMoreReplies: post.replies_count > 10,
          totalReplies: post.replies_count || 0,
          currentPage: 0,
        },
      };

      // Fetch replies for this post
      try {
        // Get first page of replies (10 per page)
        const replies = await postApi.getPostReplies(id, 0, 10);
        mappedPost.comments = replies;
      } catch (error) {
        console.error(`Error fetching replies for post ${id}:`, error);
      }

      return mappedPost;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      return null;
    }
  },

  // Get posts by user ID
  getPostsByUserId: async (userId: string): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts?userId=${userId}`);
    return handleResponse(response);
  },

  // Create a new post
  createPost: async (
    userId: string,
    content: string,
    media?: string[],
    replyToId?: string,
    quoteTweetId?: string,
  ): Promise<Post> => {
    try {
      const postData = {
        user_id: userId,
        content,
        media_urls: media,
        reply_to_id: replyToId,
        repost_id: quoteTweetId,
      };

      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const newPost = await handleResponse(response);

      // Map the API response to match the existing Post interface
      return {
        id: newPost.id,
        userId: newPost.user_id,
        userName: newPost.display_name || "User",
        userHandle: newPost.address
          ? `@${newPost.address.substring(0, 8)}`
          : "@user",
        userAvatar: newPost.avatar_url || "https://i.pravatar.cc/150?img=1",
        verified: newPost.tier === "gold" || newPost.tier === "diamond",
        content: newPost.content,
        createdAt: newPost.created_at,
        likes: 0,
        retweets: 0,
        comments: [],
        media: newPost.media_urls || [],
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (post: {
    id: string;
    content: string;
    media?: string[];
  }): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    return handleResponse(response);
  },

  // Delete a post
  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/posts?id=${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },

  // Like a post
  likePost: async (userId: string, postId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
  },

  // Unlike a post
  unlikePost: async (userId: string, postId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
      throw error;
    }
  },

  // Retweet a post
  retweetPost: async (userId: string, postId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/posts/${postId}/repost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error(`Error retweeting post ${postId}:`, error);
      throw error;
    }
  },

  // Unretweet a post
  unretweetPost: async (
    postId: string,
    userId: string,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/posts/retweet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, unretweet: true }),
    });
    return handleResponse(response);
  },

  // Reply to a post
  replyToPost: async (
    postId: string,
    userId: string,
    content: string,
    media?: string[],
  ): Promise<{ message: string; comment: Post }> => {
    const response = await fetch(`${API_URL}/posts/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, content, media }),
    });
    return handleResponse(response);
  },

  // Quote tweet a post
  quoteTweet: async (
    postId: string,
    userId: string,
    content: string,
    media?: string[],
  ): Promise<{ message: string; post: Post }> => {
    const response = await fetch(`${API_URL}/posts/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, content, media }),
    });
    return handleResponse(response);
  },

  // Get user's posts
  getUserPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/posts?limit=20&page=0`,
      );
      const data = await handleResponse(response);

      // Map the API response to match the existing Post interface
      return data.map((post: any) => ({
        id: post.id,
        userId: post.user_id,
        userName: post.display_name || "User",
        userHandle: post.address ? `@${post.address.substring(0, 8)}` : "@user",
        userAvatar: post.avatar_url || "https://i.pravatar.cc/150?img=1",
        verified: post.tier === "gold" || post.tier === "diamond",
        content: post.content,
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        retweets: post.reposts_count || 0,
        comments: [], // Will need to be populated separately
        media: post.media_urls || [],
      }));
    } catch (error) {
      console.error(`Error fetching user ${userId} posts:`, error);
      return [];
    }
  },

  // Get more replies for a specific post (for pagination)
  getMoreReplies: async (postId: string, page: number): Promise<Post[]> => {
    try {
      return await postApi.getPostReplies(postId, page, 10);
    } catch (error) {
      console.error(`Error fetching more replies for post ${postId}:`, error);
      return [];
    }
  },
};

// Direct Messages API functions
export const dmApi = {
  // Get all DMs
  getDMs: async (): Promise<DirectMessage[]> => {
    const response = await fetch(`${API_URL}/dms`);
    return handleResponse(response);
  },

  // Get DMs for a user (both sent and received)
  getDMsByUserId: async (userId: string): Promise<DirectMessage[]> => {
    const response = await fetch(`${API_URL}/dms?userId=${userId}`);
    return handleResponse(response);
  },

  // Get conversation between two users
  getConversation: async (
    senderId: string,
    receiverId: string,
  ): Promise<DirectMessage[]> => {
    const response = await fetch(
      `${API_URL}/dms?senderId=${senderId}&receiverId=${receiverId}`,
    );
    return handleResponse(response);
  },

  // Send a new DM
  sendDM: async (dm: {
    senderId: string;
    receiverId: string;
    message: string;
  }): Promise<DirectMessage> => {
    const response = await fetch(`${API_URL}/dms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dm),
    });
    return handleResponse(response);
  },
};

// Notifications API functions
export const notificationApi = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/notifications`);
    return handleResponse(response);
  },

  // Get notifications for a user
  getNotificationsByUserId: async (userId: string): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/notifications?userId=${userId}`);
    return handleResponse(response);
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, read: true }),
    });
    return handleResponse(response);
  },

  // Mark all notifications for a user as read
  markAllAsRead: async (userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, read: true }),
    });
    return handleResponse(response);
  },

  // Create a notification
  createNotification: async (notification: {
    userId: string;
    type: "like" | "retweet" | "reply" | "quoteTweet";
    postId: string;
  }): Promise<Notification> => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
    return handleResponse(response);
  },
};

// Listings API functions
export const listingApi = {
  // Get all listings
  getListings: async (): Promise<Listing[]> => {
    const response = await fetch(`${API_URL}/listings`);
    return handleResponse(response);
  },

  // Get listing by ID
  getListingById: async (id: string): Promise<Listing> => {
    const response = await fetch(`${API_URL}/listings?id=${id}`);
    return handleResponse(response);
  },

  // Get listings by user ID
  getListingsByUserId: async (userId: string): Promise<Listing[]> => {
    const response = await fetch(`${API_URL}/listings?userId=${userId}`);
    return handleResponse(response);
  },

  // Get listings by category
  getListingsByCategory: async (
    category: "meme" | "project",
  ): Promise<Listing[]> => {
    const response = await fetch(`${API_URL}/listings?category=${category}`);
    return handleResponse(response);
  },

  // Create a new listing
  createListing: async (listing: {
    userId: string;
    title: string;
    description: string;
    category: "meme" | "project";
    media?: string[];
  }): Promise<Listing> => {
    const response = await fetch(`${API_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });
    return handleResponse(response);
  },

  // Delete a listing
  deleteListing: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/listings?id=${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
