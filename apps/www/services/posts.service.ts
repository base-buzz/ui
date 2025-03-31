import { supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type TrendingPost = Database["public"]["Views"]["trending_posts"]["Row"];

// Get trending posts
export async function getTrendingPosts(
  limit = 20,
  page = 0,
): Promise<TrendingPost[]> {
  try {
    const { data, error } = await supabaseServer
      .from("trending_posts")
      .select("*")
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting trending posts:", error);
    return [];
  }
}

// Get a user's feed (posts from people they follow)
export async function getUserFeed(
  userId: string,
  limit = 20,
  page = 0,
): Promise<Post[]> {
  try {
    // Get IDs of users the current user follows
    const { data: followingData, error: followingError } = await supabaseServer
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (followingError) throw followingError;

    // Extract the following IDs
    const followingIds = followingData.map((item) => item.following_id);
    // Include the user's own posts
    followingIds.push(userId);

    // Query posts from followed users
    const { data, error } = await supabaseServer
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          avatar_url,
          address,
          tier
        )
      `,
      )
      .in("user_id", followingIds)
      .is("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user feed:", error);
    return [];
  }
}

// Get posts from a specific user
export async function getUserPosts(
  userId: string,
  limit = 20,
  page = 0,
): Promise<Post[]> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          avatar_url,
          address,
          tier
        )
      `,
      )
      .eq("user_id", userId)
      .is("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user posts:", error);
    return [];
  }
}

// Get a single post by ID
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          avatar_url,
          address,
          tier
        )
      `,
      )
      .eq("id", id)
      .is("is_deleted", false)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting post by ID:", error);
    return null;
  }
}

// Get replies to a post
export async function getPostReplies(
  postId: string,
  limit = 20,
  page = 0,
): Promise<Post[]> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          avatar_url,
          address,
          tier
        )
      `,
      )
      .eq("reply_to_id", postId)
      .is("is_deleted", false)
      .order("created_at", { ascending: true })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting post replies:", error);
    return [];
  }
}

// Create a new post
export async function createPost(post: PostInsert): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

// Create a reply to a post
export async function createReply(
  userId: string,
  postId: string,
  content: string,
): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .insert({
        user_id: userId,
        content,
        reply_to_id: postId,
      })
      .select()
      .single();

    if (error) throw error;

    // Update reply count on the original post
    await supabaseServer
      .from("posts")
      .update({ replies_count: supabaseServer.rpc("increment", { count: 1 }) })
      .eq("id", postId);

    return data;
  } catch (error) {
    console.error("Error creating reply:", error);
    return null;
  }
}

// Create a repost
export async function createRepost(
  userId: string,
  postId: string,
): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .insert({
        user_id: userId,
        is_repost: true,
        repost_id: postId,
        content: "", // Repost has no content
      })
      .select()
      .single();

    if (error) throw error;

    // Update repost count on the original post
    await supabaseServer
      .from("posts")
      .update({ reposts_count: supabaseServer.rpc("increment", { count: 1 }) })
      .eq("id", postId);

    return data;
  } catch (error) {
    console.error("Error creating repost:", error);
    return null;
  }
}

// Update a post
export async function updatePost(
  id: string,
  updates: PostUpdate,
): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

// Soft delete a post (mark as deleted)
export async function deletePost(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer
      .from("posts")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

// Search for posts by content
export async function searchPosts(
  query: string,
  limit = 20,
  page = 0,
): Promise<Post[]> {
  try {
    const { data, error } = await supabaseServer
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          avatar_url,
          address,
          tier
        )
      `,
      )
      .ilike("content", `%${query}%`)
      .is("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
