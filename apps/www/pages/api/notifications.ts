import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { Notification } from "@/types/interfaces";
import { generateId } from "@/utils/mockDataGenerator";

const dataPath = path.join(process.cwd(), "data", "notifications.json");

/**
 * Helper function to read notifications data
 */
async function getNotifications(): Promise<Notification[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
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
    await fs.writeFile(dataPath, JSON.stringify(notifications, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing notifications data:", error);
    return false;
  }
}

/**
 * Notifications API handler
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
    case "PUT":
      return await handlePut(req, res);
    case "POST":
      return await handlePost(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handle GET requests
 * GET /api/notifications - Get all notifications (not recommended)
 * GET /api/notifications?userId=123 - Get notifications for a user
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notifications = await getNotifications();
    const { userId } = req.query;

    if (userId) {
      const userNotifications = notifications.filter(
        (n) => n.userId === userId,
      );
      return res.status(200).json(userNotifications);
    }

    // Return all notifications (not recommended for production)
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

/**
 * Handle PUT requests
 * PUT /api/notifications - Update notification(s) read status
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notifications = await getNotifications();
    const { id, userId, read } = req.body;

    // Mark a single notification as read/unread
    if (id) {
      const notificationIndex = notifications.findIndex((n) => n.id === id);
      if (notificationIndex === -1) {
        return res.status(404).json({ error: "Notification not found" });
      }

      notifications[notificationIndex].read = read !== undefined ? read : true;

      const success = await writeNotifications(notifications);

      if (!success) {
        return res.status(500).json({ error: "Failed to update notification" });
      }

      return res.status(200).json(notifications[notificationIndex]);
    }

    // Mark all notifications for a user as read
    if (userId) {
      const updatedNotifications = notifications.map((notification) => {
        if (notification.userId === userId) {
          return { ...notification, read: read !== undefined ? read : true };
        }
        return notification;
      });

      const success = await writeNotifications(updatedNotifications);

      if (!success) {
        return res
          .status(500)
          .json({ error: "Failed to update notifications" });
      }

      return res
        .status(200)
        .json({ message: "Notifications updated successfully" });
    }

    return res
      .status(400)
      .json({ error: "Missing required parameters: id or userId" });
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return res.status(500).json({ error: "Failed to update notifications" });
  }
}

/**
 * Handle POST requests
 * POST /api/notifications - Create a new notification
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notifications = await getNotifications();
    const { userId, type, postId } = req.body;

    // Validate required fields
    if (!userId || !type || !postId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, type, postId" });
    }

    // Validate type
    const validTypes = ["like", "retweet", "reply", "quoteTweet"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          error: `Invalid notification type. Must be one of: ${validTypes.join(", ")}`,
        });
    }

    const newNotification: Notification = {
      id: generateId(),
      userId,
      type: type as "like" | "retweet" | "reply" | "quoteTweet",
      postId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(newNotification);
    const success = await writeNotifications(notifications);

    if (!success) {
      return res.status(500).json({ error: "Failed to create notification" });
    }

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to create notification" });
  }
}
