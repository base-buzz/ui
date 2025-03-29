import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { DirectMessage } from "@/types/interfaces";
import { generateId } from "@/utils/mockDataGenerator";

const dataPath = path.join(process.cwd(), "data", "dms.json");

/**
 * Helper function to read direct messages data
 */
async function getDMs(): Promise<DirectMessage[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DMs data:", error);
    return [];
  }
}

/**
 * Helper function to write direct messages data
 */
async function writeDMs(dms: DirectMessage[]): Promise<boolean> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(dms, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing DMs data:", error);
    return false;
  }
}

/**
 * Direct Messages API handler
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
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handle GET requests
 * GET /api/dms - Get all DMs (not recommended)
 * GET /api/dms?userId=123 - Get DMs for a user (both sent and received)
 * GET /api/dms?senderId=123&receiverId=456 - Get conversation between two users
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dms = await getDMs();
    const { userId, senderId, receiverId } = req.query;

    // Get conversation between two users
    if (senderId && receiverId) {
      const conversation = dms.filter(
        (dm) =>
          (dm.senderId === senderId && dm.receiverId === receiverId) ||
          (dm.senderId === receiverId && dm.receiverId === senderId),
      );
      return res.status(200).json(conversation);
    }

    // Get all DMs for a user (both sent and received)
    if (userId) {
      const userDMs = dms.filter(
        (dm) => dm.senderId === userId || dm.receiverId === userId,
      );
      return res.status(200).json(userDMs);
    }

    // Return all DMs (not recommended for production)
    return res.status(200).json(dms);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return res.status(500).json({ error: "Failed to fetch direct messages" });
  }
}

/**
 * Handle POST requests
 * POST /api/dms - Send a new direct message
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dms = await getDMs();
    const { senderId, receiverId, message } = req.body;

    // Validate required fields
    if (!senderId || !receiverId || !message) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: senderId, receiverId, message",
        });
    }

    const newDM: DirectMessage = {
      id: generateId(),
      senderId,
      receiverId,
      message,
      sentAt: new Date().toISOString(),
    };

    dms.push(newDM);
    const success = await writeDMs(dms);

    if (!success) {
      return res.status(500).json({ error: "Failed to send direct message" });
    }

    return res.status(201).json(newDM);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to send direct message" });
  }
}
