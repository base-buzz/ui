/**
 * User interface
 * @note For Supabase integration, ensure to map these fields to the users table.
 */
export interface User {
  id: string;
  alias: string;
  pfp: string; // Public URL to profile image
  dob: string; // Date of birth (ISO string)
  location: string;
  headerImage: string; // Public URL to header image
  bio: string;
}

/**
 * Post interface
 * @note Future Supabase integration should create relational links between posts and users.
 */
export interface Post {
  id: string;
  userId: string;
  // Additional user data for display
  userName?: string;
  userHandle?: string;
  userAvatar?: string;
  verified?: boolean;
  content: string;
  createdAt: string;
  likes: number;
  retweets: number;
  media?: string[]; // Array of media URLs (images/videos)
  comments: Post[]; // Nested replies (each comment is a Post)
  quoteTweet?: string; // Reference to another post's id (for quote tweets)
}

/**
 * Direct Message (DM) interface
 * @note Ensure DM data maps to a dedicated messages table in Supabase.
 */
export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  sentAt: string;
}

/**
 * Notification interface
 * @note Supabase integration should use triggers or realtime subscriptions for notifications.
 */
export interface Notification {
  id: string;
  userId: string; // The user receiving the notification
  type: "like" | "retweet" | "reply" | "quoteTweet";
  postId: string; // Related post id
  read: boolean;
  createdAt: string;
}

/**
 * Listing (for Free Listings app) interface
 * @note Future integration should map this to a listings table in Supabase.
 */
export interface Listing {
  id: string;
  userId: string; // User who created the listing
  title: string;
  description: string;
  category: "meme" | "project";
  createdAt: string;
  media?: string[]; // Optional images or videos
}
