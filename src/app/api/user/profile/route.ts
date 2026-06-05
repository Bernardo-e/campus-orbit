import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, bio, targetExam, targetBranch } = body;

    // Perform validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must be under 500 characters." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        bio: bio ? bio.trim() : null,
        targetExam: targetExam ? targetExam.trim() : null,
        targetBranch: targetBranch ? targetBranch.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        targetExam: true,
        targetBranch: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile API update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the profile." },
      { status: 500 }
    );
  }
}
