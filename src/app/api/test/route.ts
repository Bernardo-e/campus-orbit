import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const collegeCount = await prisma.college.count();

    return NextResponse.json({
        message: "Database connected!",
        colleges: collegeCount,
    });
}