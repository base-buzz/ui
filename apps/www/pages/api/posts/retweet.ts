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
 * Retweet API handler
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
    const { postId, userId, unretweet } = req.body;

    // Validate required fields
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: postId, userId" });
    }

    const posts = await getPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Handle retweet or unretweet
    if (unretweet) {
      // Decrement retweet count
      posts[postIndex].retweets = Math.max(0, posts[postIndex].retweets - 1);

      // Remove the retweet post
      const retweetIndex = posts.findIndex(
        (p) =>
          p.userId === userId &&
          p.content === posts[postIndex].content &&
          p.quoteTweet === postId,
      );

      if (retweetIndex !== -1) {
        posts.splice(retweetIndex, 1);
      }
    } else {
      // Increment retweet count
      posts[postIndex].retweets += 1;

      // Create a new post as a retweet
      const newPost: Post = {
        id: generateId(),
        userId,
        content: posts[postIndex].content,
        createdAt: new Date().toISOString(),
        likes: 0,
        retweets: 0,
        comments: [],
        quoteTweet: postId,
      };

      // Add media if original post had it
      if (posts[postIndex].media) {
        newPost.media = [...posts[postIndex].media];
      }

      // Add the retweet to the top of the posts
      posts.unshift(newPost);

      // Create notification (only when retweeting, not unretweeting)
      if (userId !== posts[postIndex].userId) {
        const notifications = await getNotifications();
        const newNotification: Notification = {
          id: generateId(),
          userId: posts[postIndex].userId, // the owner of the post receives the notification
          type: "retweet",
          postId,
          read: false,
          createdAt: new Date().toISOString(),
        };

        notifications.unshift(newNotification);
        await writeNotifications(notifications);
      }
    }

    const success = await writePosts(posts);

    if (!success) {
      return res.status(500).json({ error: "Failed to update post" });
    }

    return res.status(200).json({
      message: unretweet
        ? "Post unretweeted successfully"
        : "Post retweeted successfully",
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to retweet/unretweet post" });
  }
}
