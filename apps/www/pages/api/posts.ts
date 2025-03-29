import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { Post } from "@/types/interfaces";
import { generateId } from "@/utils/mockDataGenerator";

const dataPath = path.join(process.cwd(), "data", "posts.json");

/**
 * Helper function to read posts data
 */
async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading posts data:", error);
    return [];
  }
}

/**
 * Helper function to write posts data
 */
async function writePosts(posts: Post[]): Promise<boolean> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing posts data:", error);
    return false;
  }
}

/**
 * Posts API handler
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Ensure data directory exists
  try {
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
  }

  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);
    case "PUT":
      return await handlePut(req, res);
    case "DELETE":
      return await handleDelete(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handle GET requests
 * GET /api/posts - Get all posts
 * GET /api/posts?userId=123 - Get posts by user ID
 * GET /api/posts?id=123 - Get post by ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await getPosts();
    const { id, userId } = req.query;

    if (id) {
      const post = posts.find((p) => p.id === id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(200).json(post);
    }

    if (userId) {
      const userPosts = posts.filter((p) => p.userId === userId);
      return res.status(200).json(userPosts);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}

/**
 * Handle POST requests
 * POST /api/posts - Create a new post
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await getPosts();
    const { userId, content, media, quoteTweet } = req.body;

    // Validate required fields
    if (!userId || !content) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, content" });
    }

    const newPost: Post = {
      id: generateId(),
      userId,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      comments: [],
      media: media || undefined,
      quoteTweet: quoteTweet || undefined,
    };

    posts.unshift(newPost); // Add to beginning of array
    const success = await writePosts(posts);

    if (!success) {
      return res.status(500).json({ error: "Failed to create post" });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to create post" });
  }
}

/**
 * Handle PUT requests
 * PUT /api/posts - Update a post
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await getPosts();
    const { id, content, media } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: "Missing required field: id" });
    }

    const postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update fields
    posts[postIndex] = {
      ...posts[postIndex],
      content: content || posts[postIndex].content,
      media: media || posts[postIndex].media,
    };

    const success = await writePosts(posts);

    if (!success) {
      return res.status(500).json({ error: "Failed to update post" });
    }

    return res.status(200).json(posts[postIndex]);
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return res.status(500).json({ error: "Failed to update post" });
  }
}

/**
 * Handle DELETE requests
 * DELETE /api/posts?id=123 - Delete a post by ID
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await getPosts();
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Missing required query parameter: id" });
    }

    const postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    posts.splice(postIndex, 1);
    const success = await writePosts(posts);

    if (!success) {
      return res.status(500).json({ error: "Failed to delete post" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return res.status(500).json({ error: "Failed to delete post" });
  }
}

/**
 * Additional action endpoints for the posts API
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Increase limit for media uploads
    },
  },
};
