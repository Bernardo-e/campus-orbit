import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("userId");

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Auth logout POST error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
