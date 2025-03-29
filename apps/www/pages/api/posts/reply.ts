import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { Post, Notification } from "@/types/interfaces";
import { generateId } from "@/utils/mockDataGenerator";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const notificationsPath = path.join(
  process.cwd(),
  "data",
  "notifications.json",
);

/**
 * Helper function to read posts data
 */
async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsPath, "utf8");
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
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing posts data:", error);
    return false;
  }
}

/**
 * Helper function to read notifications data
 */
async function getNotifications(): Promise<Notification[]> {
  try {
    const data = await fs.readFile(notificationsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading notifications data:", error);
    return [];
  }
}

/**
 * Helper function to write notifications data
 */
async function writeNotifications(
  notifications: Notification[],
): Promise<boolean> {
  try {
    await fs.writeFile(
      notificationsPath,
      JSON.stringify(notifications, null, 2),
    );
    return true;
  } catch (error) {
    console.error("Error writing notifications data:", error);
    return false;
  }
}

/**
 * Reply to post API handler
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

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { postId, userId, content, media } = req.body;

    // Validate required fields
    if (!postId || !userId || !content) {
      return res
        .status(400)
        .json({ error: "Missing required fields: postId, userId, content" });
    }

    const posts = await getPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new comment
    const newComment: Post = {
      id: generateId(),
      userId,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      comments: [],
      media: media || undefined,
    };

    // Add the comment to the post's comments array
    posts[postIndex].comments.push(newComment);

    // Create notification if the reply is from a different user
    if (userId !== posts[postIndex].userId) {
      const notifications = await getNotifications();
      const newNotification: Notification = {
        id: generateId(),
        userId: posts[postIndex].userId, // the owner of the post receives the notification
        type: "reply",
        postId,
        read: false,
        createdAt: new Date().toISOString(),
      };

      notifications.unshift(newNotification);
      await writeNotifications(notifications);
    }

    const success = await writePosts(posts);

    if (!success) {
      return res.status(500).json({ error: "Failed to add reply to post" });
    }

    return res.status(201).json({
      message: "Reply added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to reply to post" });
  }
}
