import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/discussions/[id]/answers — post an answer to a question
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "You must be logged in to answer." }, { status: 401 });
    }

    const { id: questionId } = await params;

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.answerBody?.trim()) {
      return NextResponse.json({ error: "Answer body is required." }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        body: body.answerBody.trim(),
        authorId: userId,
        questionId,
      },
      include: {
        author: { select: { id: true, name: true, targetExam: true } },
      },
    });

    return NextResponse.json({ answer }, { status: 201 });
  } catch (error) {
    console.error("Answer POST error:", error);
    return NextResponse.json({ error: "Failed to post answer." }, { status: 500 });
  }
}
