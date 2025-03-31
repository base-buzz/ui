import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  getUserById,
  getSuggestedUsers,
} from "@/services/users.service";

// GET: Get user by ID or get suggested users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const suggested = searchParams.get("suggested");

    // If 'suggested' is provided, return suggested users
    if (suggested && id) {
      const suggestedUsers = await getSuggestedUsers(id);
      return NextResponse.json(suggestedUsers);
    }

    // If 'id' is provided, return user by ID
    if (id) {
      const user = await getUserById(id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    }

    // If no parameters are provided, return error
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in users API route:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Basic validation
    if (!userData) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    const newUser = await createUser(userData);

    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error in users API route:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
