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
    const response = await fetch(`${API_URL}/users?id=${id}`);
    return handleResponse(response);
  },

  // Update user profile
  updateUser: async (user: Partial<User> & { id: string }): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
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
    // In a real app, we would call an API endpoint here
    // For now, return mock data
    const mockPosts: Post[] = [
      {
        id: "1",
        userId: "user1",
        userName: "Elon Musk",
        userHandle: "@elonmusk",
        userAvatar: "https://i.pravatar.cc/150?img=11",
        verified: true,
        content: "The age of AI has begun.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 1420,
        retweets: 243,
        comments: [
          {
            id: "1-reply-1",
            userId: "user5",
            userName: "kitze",
            userHandle: "@thekitze",
            userAvatar: "https://i.pravatar.cc/150?img=45",
            verified: true,
            content: "100%. It's moving way faster than most people realize.",
            createdAt: new Date(Date.now() - 3400000).toISOString(),
            likes: 89,
            retweets: 12,
            comments: [],
          },
          {
            id: "1-reply-2",
            userId: "user4",
            userName: "Crypto Barista",
            userHandle: "@CryptoBarista",
            userAvatar: "https://i.pravatar.cc/150?img=33",
            verified: false,
            content:
              "What do you think will be the most transformative AI use case in the next 5 years?",
            createdAt: new Date(Date.now() - 3300000).toISOString(),
            likes: 42,
            retweets: 5,
            comments: [],
          },
        ],
        media: [
          "https://pbs.twimg.com/media/F_k1OvZWgAAm8tz?format=jpg&name=medium",
        ],
      },
      {
        id: "2",
        userId: "user2",
        userName: "Vitalik Buterin",
        userHandle: "@VitalikButerin",
        userAvatar: "https://i.pravatar.cc/150?img=15",
        verified: true,
        content:
          "Decentralized social media is the future. Layer 2 chains are going to change the game.",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 892,
        retweets: 145,
        comments: [
          {
            id: "2-reply-1",
            userId: "user3",
            userName: "BasedGhoul",
            userHandle: "@BasedGhoul",
            userAvatar: "https://i.pravatar.cc/150?img=23",
            verified: true,
            content:
              "Base is perfectly positioned for this. Social media on L2s is going to be huge.",
            createdAt: new Date(Date.now() - 7000000).toISOString(),
            likes: 201,
            retweets: 31,
            comments: [],
          },
          {
            id: "2-reply-2",
            userId: "user7",
            userName: "Lord Bebo",
            userHandle: "@MyLordBebo",
            userAvatar: "https://i.pravatar.cc/150?img=62",
            verified: true,
            content:
              "What role do you see for ETH in social media monetization?",
            createdAt: new Date(Date.now() - 6900000).toISOString(),
            likes: 123,
            retweets: 17,
            comments: [],
          },
        ],
      },
      {
        id: "3",
        userId: "user3",
        userName: "BasedGhoul",
        userHandle: "@BasedGhoul",
        userAvatar: "https://i.pravatar.cc/150?img=23",
        verified: true,
        content: "BaseBuzz going intergalactic 🚀 Join the revolution now!",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        likes: 573,
        retweets: 98,
        comments: [
          {
            id: "3-reply-1",
            userId: "user8",
            userName: "Velina Tchakarova",
            userHandle: "@vtchakarova",
            userAvatar: "https://i.pravatar.cc/150?img=69",
            verified: false,
            content: "Just signed up. Love what you're building!",
            createdAt: new Date(Date.now() - 10200000).toISOString(),
            likes: 32,
            retweets: 2,
            comments: [],
          },
        ],
        media: [
          "https://pbs.twimg.com/media/GHd1-64a0AAoRYC?format=jpg&name=large",
        ],
      },
      {
        id: "4",
        userId: "user4",
        userName: "Crypto Barista",
        userHandle: "@CryptoBarista",
        userAvatar: "https://i.pravatar.cc/150?img=33",
        verified: false,
        content:
          "Coffee and crypto - the two things that keep me going through bear markets. Who else is stacking sats while sipping their morning brew? ☕️💰",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        likes: 321,
        retweets: 42,
        comments: [
          {
            id: "4-reply-1",
            userId: "user5",
            userName: "kitze",
            userHandle: "@thekitze",
            userAvatar: "https://i.pravatar.cc/150?img=45",
            verified: true,
            content: "This is literally me every morning.",
            createdAt: new Date(Date.now() - 14200000).toISOString(),
            likes: 78,
            retweets: 5,
            comments: [],
          },
          {
            id: "4-reply-2",
            userId: "user1",
            userName: "Elon Musk",
            userHandle: "@elonmusk",
            userAvatar: "https://i.pravatar.cc/150?img=11",
            verified: true,
            content: "I prefer Dogecoin with my coffee ☕️🐕",
            createdAt: new Date(Date.now() - 14100000).toISOString(),
            likes: 542,
            retweets: 123,
            comments: [],
          },
        ],
      },
      {
        id: "5",
        userId: "user5",
        userName: "kitze",
        userHandle: "@thekitze",
        userAvatar: "https://i.pravatar.cc/150?img=45",
        verified: true,
        content: "gm",
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        likes: 48,
        retweets: 0,
        comments: [
          {
            id: "5-reply-1",
            userId: "user6",
            userName: "CNW",
            userHandle: "@CANews Watch",
            userAvatar: "https://i.pravatar.cc/150?img=51",
            verified: false,
            content: "gm frens",
            createdAt: new Date(Date.now() - 17800000).toISOString(),
            likes: 12,
            retweets: 0,
            comments: [],
          },
        ],
        media: [
          "https://pbs.twimg.com/media/GDZvGt4bUAE4t_a?format=jpg&name=medium",
        ],
      },
      {
        id: "6",
        userId: "user6",
        userName: "CNW",
        userHandle: "@CANews Watch",
        userAvatar: "https://i.pravatar.cc/150?img=51",
        verified: false,
        content: "#BREAKING Insane Pursuit Ends in Major Crash in Long Beach.",
        createdAt: new Date(Date.now() - 21600000).toISOString(),
        likes: 67,
        retweets: 24,
        comments: [],
        media: [
          "https://pbs.twimg.com/media/GC7yVfHbgAAPDlC?format=jpg&name=small",
        ],
      },
      {
        id: "7",
        userId: "user7",
        userName: "Lord Bebo",
        userHandle: "@MyLordBebo",
        userAvatar: "https://i.pravatar.cc/150?img=62",
        verified: true,
        content: "🇬🇧 🇺🇦 ‼️ Russia started a big drone raid on Ukraine!",
        createdAt: new Date(Date.now() - 25200000).toISOString(),
        likes: 114,
        retweets: 28,
        comments: [],
      },
      {
        id: "8",
        userId: "user8",
        userName: "Velina Tchakarova",
        userHandle: "@vtchakarova",
        userAvatar: "https://i.pravatar.cc/150?img=69",
        verified: false,
        content:
          "The one fact I can immediately agree is that we can't ignore the Chinese-Russian encroachment anymore and Europe did exactly that. Nobody in Europe paid attention to the DragonBear.",
        createdAt: new Date(Date.now() - 28800000).toISOString(),
        likes: 342,
        retweets: 56,
        comments: [],
      },
    ];

    return mockPosts;
  },

  // Get post by ID
  getPostById: async (id: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts?id=${id}`);
    return handleResponse(response);
  },

  // Get posts by user ID
  getPostsByUserId: async (userId: string): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts?userId=${userId}`);
    return handleResponse(response);
  },

  // Create a new post
  createPost: async (post: {
    userId: string;
    content: string;
    media?: string[];
    quoteTweet?: string;
  }): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    return handleResponse(response);
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
  likePost: async (
    postId: string,
    userId: string,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/posts/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    return handleResponse(response);
  },

  // Unlike a post
  unlikePost: async (
    postId: string,
    userId: string,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/posts/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, unlike: true }),
    });
    return handleResponse(response);
  },

  // Retweet a post
  retweetPost: async (
    postId: string,
    userId: string,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/posts/retweet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });
    return handleResponse(response);
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
