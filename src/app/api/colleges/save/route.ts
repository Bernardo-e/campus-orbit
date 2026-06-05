import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to extract user ID from headers or cookies
function getUserId(req: Request): string | null {
  const userIdHeader = req.headers.get("x-user-id");
  if (userIdHeader) return userIdHeader;

  // Fallback check in cookies
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/userId=([^;]+)/);
  if (match) return match[1];

  return null;
}

// 1. GET: Fetch all saved colleges for the current user
export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Missing user ID in request headers." },
        { status: 401 }
      );
    }

    // Retrieve saved colleges along with nested college details
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            rating: true,
            fees: true,
            image: true,
          },
        },
      },
      orderBy: {
        id: "desc", // Show recently saved first
      },
    });

    // Map response to return flat college objects
    const colleges = saved.map((s) => s.college);

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Fetch saved colleges error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// 2. POST: Save a college
export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Missing user ID." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.collegeId) {
      return NextResponse.json(
        { error: "Missing collegeId in request body" },
        { status: 400 }
      );
    }

    const { collegeId } = body;

    // Verify the college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Check if already saved (prevent duplicate saves)
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { message: "College is already saved", alreadySaved: true },
        { status: 200 }
      );
    }

    // Save the college
    await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
    });

    return NextResponse.json(
      { message: "College saved successfully", alreadySaved: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save college error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// 3. DELETE: Remove a saved college
export async function DELETE(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Missing user ID." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.collegeId) {
      return NextResponse.json(
        { error: "Missing collegeId in request body" },
        { status: 400 }
      );
    }

    const { collegeId } = body;

    // Delete the record
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({ message: "College removed from saves" });
  } catch (error) {
    console.error("Unsave college error:", error);
    // If record doesn't exist, handle it gracefully
    return NextResponse.json(
      { error: "Failed to remove saved college. It may have already been removed." },
      { status: 500 }
    );
  }
}
