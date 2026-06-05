import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Parse and sanitize query parameters
    const search = searchParams.get("search") || "";
    const idsParam = searchParams.get("ids") || "";
    const includeParam = searchParams.get("include") || "";
    
    // Fallback defaults to page 1 and limit 10, protecting against negative numbers
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    
    const sort = searchParams.get("sort") || "";
    const order = searchParams.get("order") || ""; // 'asc' or 'desc'

    // 2. Build dynamic filtering criteria (Search by name or filter by ID list)
    const where: Prisma.CollegeWhereInput = {};
    if (idsParam) {
      where.id = { in: idsParam.split(",") };
    } else if (search) {
      where.name = {
        contains: search,
        mode: "insensitive", // case-insensitive matching in PostgreSQL
      };
    }

    // 3. Build dynamic sorting criteria
    // - rating defaults to 'desc' (highest rating first) unless 'asc' is explicitly passed
    // - fees defaults to 'asc' (most affordable first) unless 'desc' is explicitly passed
    let orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    if (sort === "rating") {
      orderBy = { rating: order === "asc" ? "asc" : "desc" };
    } else if (sort === "fees") {
      orderBy = { fees: order === "desc" ? "desc" : "asc" };
    } else {
      // Default fallback sorting: sort by rating descending
      orderBy = { rating: "desc" };
    }

    // 4. Calculate pagination offsets
    const skip = (page - 1) * limit;
    const take = limit;

    // 5. Execute queries in parallel using Promise.all for high performance
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          fees: true,
          image: true,
          description: true,
          courses: includeParam.includes("courses"),
          reviews: includeParam.includes("reviews"),
        },
        orderBy,
        skip,
        take,
      }),
      prisma.college.count({ where }),
    ]);

    // 6. Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // 7. Return paginated JSON response
    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("College Listing API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching colleges" },
      { status: 500 }
    );
  }
}
