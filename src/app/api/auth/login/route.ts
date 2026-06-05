import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { NextResponse } from "next/server";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // User lookup: Query the database for a user matching the provided email address.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, return a 401 Unauthorized response to prevent user enumeration.
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Password verification: Compare the plain-text password with the stored hashed password.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password hashes do not match, return a 401 Unauthorized response.
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Success response: Return user details and set session cookie.
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("userId", user.id, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",
      httpOnly: true,
    });

    return response;
  } catch (error) {
    // Error handling: Log server-side exceptions and return a generic 500 status.
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
