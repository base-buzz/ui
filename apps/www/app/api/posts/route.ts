import { NextRequest, NextResponse } from "next/server";
import { createPost, getTrendingPosts } from "@/services/posts.service";

// GET: Get trending posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    // Parse pagination parameters
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedPage = page ? parseInt(page, 10) : 0;

    const posts = await getTrendingPosts(parsedLimit, parsedPage);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in posts API route:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// POST: Create a new post
export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();

    // Basic validation
    if (!postData) {
      return NextResponse.json({ error: "Missing post data" }, { status: 400 });
    }

    if (!postData.user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (!postData.content && !postData.is_repost) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const newPost = await createPost(postData);

    if (!newPost) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 },
      );
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error in posts API route:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
