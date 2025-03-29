import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { Listing } from "@/types/interfaces";
import { generateId } from "@/utils/mockDataGenerator";

const dataPath = path.join(process.cwd(), "data", "listings.json");

/**
 * Helper function to read listings data
 */
async function getListings(): Promise<Listing[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading listings data:", error);
    return [];
  }
}

/**
 * Helper function to write listings data
 */
async function writeListings(listings: Listing[]): Promise<boolean> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(listings, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing listings data:", error);
    return false;
  }
}

/**
 * Listings API handler
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
    case "DELETE":
      return await handleDelete(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handle GET requests
 * GET /api/listings - Get all listings
 * GET /api/listings?id=123 - Get listing by ID
 * GET /api/listings?userId=123 - Get listings by user ID
 * GET /api/listings?category=meme - Get listings by category
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const listings = await getListings();
    const { id, userId, category } = req.query;

    if (id) {
      const listing = listings.find((l) => l.id === id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      return res.status(200).json(listing);
    }

    if (userId) {
      const userListings = listings.filter((l) => l.userId === userId);
      return res.status(200).json(userListings);
    }

    if (category) {
      const categoryListings = listings.filter((l) => l.category === category);
      return res.status(200).json(categoryListings);
    }

    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return res.status(500).json({ error: "Failed to fetch listings" });
  }
}

/**
 * Handle POST requests
 * POST /api/listings - Create a new listing
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const listings = await getListings();
    const { userId, title, description, category, media } = req.body;

    // Validate required fields
    if (!userId || !title || !description || !category) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: userId, title, description, category",
        });
    }

    // Validate category
    if (category !== "meme" && category !== "project") {
      return res
        .status(400)
        .json({
          error: 'Invalid category. Must be either "meme" or "project"',
        });
    }

    const newListing: Listing = {
      id: generateId(),
      userId,
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
      media: media || undefined,
    };

    listings.unshift(newListing);
    const success = await writeListings(listings);

    if (!success) {
      return res.status(500).json({ error: "Failed to create listing" });
    }

    return res.status(201).json(newListing);
  } catch (error) {
    console.error("Error handling POST request:", error);
    return res.status(500).json({ error: "Failed to create listing" });
  }
}

/**
 * Handle DELETE requests
 * DELETE /api/listings?id=123 - Delete a listing by ID
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const listings = await getListings();
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Missing required query parameter: id" });
    }

    const listingIndex = listings.findIndex((l) => l.id === id);
    if (listingIndex === -1) {
      return res.status(404).json({ error: "Listing not found" });
    }

    listings.splice(listingIndex, 1);
    const success = await writeListings(listings);

    if (!success) {
      return res.status(500).json({ error: "Failed to delete listing" });
    }

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return res.status(500).json({ error: "Failed to delete listing" });
  }
}

/**
 * Configuration for the listings API
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Increase limit for media uploads
    },
  },
};
