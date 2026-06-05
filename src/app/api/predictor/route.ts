import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam");
    const rankStr = searchParams.get("rank");

    if (!exam || !rankStr) {
      return NextResponse.json(
        { error: "Missing exam or rank query parameter." },
        { status: 400 }
      );
    }

    const rank = parseInt(rankStr, 10);
    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json(
        { error: "Rank must be a positive integer." },
        { status: 400 }
      );
    }

    const validExams = ["JEE Main", "JEE Advanced", "TNEA"];
    if (!validExams.includes(exam)) {
      return NextResponse.json(
        { error: `Invalid exam. Supported exams are: ${validExams.join(", ")}` },
        { status: 400 }
      );
    }

    // Query database for matching predictor ranges
    const predictions = await prisma.collegePredictor.findMany({
      where: {
        exam,
        minRank: { lte: rank },
        maxRank: { gte: rank },
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            rating: true,
            fees: true,
            image: true,
            description: true,
          },
        },
      },
    });

    const colleges = predictions.map((p) => p.college);

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Predictor API GET error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
