import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/discussions/[id] — single question with all answers
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, targetExam: true } },
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, targetExam: true } },
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Discussion detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch question." }, { status: 500 });
  }
}
