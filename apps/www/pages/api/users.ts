import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { User } from "@/types/interfaces";

const dataPath = path.join(process.cwd(), "data", "users.json");

/**
 * Helper function to read users data
 */
async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users data:", error);
    return [];
  }
}

/**
 * Helper function to write users data
 */
async function writeUsers(users: User[]): Promise<boolean> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing users data:", error);
    return false;
  }
}

/**
 * Users API handler
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
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handle GET requests
 * GET /api/users - Get all users
 * GET /api/users?id=123 - Get user by ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await getUsers();
    const { id } = req.query;

    if (id) {
      const user = users.find((u) => u.id === id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

/**
 * Handle PUT requests
 * PUT /api/users - Update a user profile
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await getUsers();
    const { id, alias, pfp, dob, location, headerImage, bio } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: "Missing required field: id" });
    }

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    users[userIndex] = {
      ...users[userIndex],
      alias: alias || users[userIndex].alias,
      pfp: pfp || users[userIndex].pfp,
      dob: dob || users[userIndex].dob,
      location: location || users[userIndex].location,
      headerImage: headerImage || users[userIndex].headerImage,
      bio: bio || users[userIndex].bio,
    };

    const success = await writeUsers(users);

    if (!success) {
      return res.status(500).json({ error: "Failed to update user" });
    }

    return res.status(200).json(users[userIndex]);
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
}

/**
 * Configuration for the users API
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Increase limit for profile picture uploads
    },
  },
};
