import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET /api/discussions — list all questions with author + answer count
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, targetExam: true } },
        _count: { select: { answers: true } },
      },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Discussions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch discussions." }, { status: 500 });
  }
}

// POST /api/discussions — create a new question (auth required)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "You must be logged in to post a question." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

    const { title, questionBody, tags } = body;
    if (!title?.trim() || !questionBody?.trim()) {
      return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
    }

    const parsedTags: string[] = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        body: questionBody.trim(),
        tags: parsedTags,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, targetExam: true } },
        _count: { select: { answers: true } },
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Discussions POST error:", error);
    return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
  }
}
