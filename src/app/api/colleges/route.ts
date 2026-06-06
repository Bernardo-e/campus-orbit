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

    const location = searchParams.get("location") || "";
    const programTypes = searchParams.get("programTypes") || "";
    const rankingRange = searchParams.get("rankingRange") || "";
    const minFees = searchParams.get("minFees") || "";
    const maxFees = searchParams.get("maxFees") || "";

    // 2. Build dynamic filtering criteria (Search by name or filter by ID list)
    const where: Prisma.CollegeWhereInput = {};
    if (idsParam) {
      where.id = { in: idsParam.split(",") };
    } else {
      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive", // case-insensitive matching in PostgreSQL
        };
      }

      // Location filter
      if (location && location !== "All Locations") {
        if (location === "Tamil Nadu, India") {
          where.location = { contains: "Tamil Nadu", mode: "insensitive" };
        } else if (location === "Chennai / Madras") {
          // IIT Madras, Anna University, SRM (Kattankulathur Chennai), Sathyabama all contain "Chennai"
          where.location = { contains: "Chennai", mode: "insensitive" };
        } else if (location === "Tiruchirappalli / Trichy") {
          where.location = { contains: "Tiruchirappalli", mode: "insensitive" };
        } else if (location === "Vellore") {
          where.location = { contains: "Vellore", mode: "insensitive" };
        } else if (location === "Kattankulathur") {
          where.location = { contains: "Kattankulathur", mode: "insensitive" };
        } else {
          where.location = { contains: location, mode: "insensitive" };
        }
      }

      // Program Types filter
      if (programTypes) {
        const typesList = programTypes.split(",");
        const courseConditions: Prisma.CourseWhereInput[] = [];
        if (typesList.includes("Undergraduate")) {
          courseConditions.push({
            OR: [
              { name: { contains: "B.Tech", mode: "insensitive" } },
              { name: { contains: "B.E.", mode: "insensitive" } },
              { name: { contains: "BS", mode: "insensitive" } },
              { name: { contains: "Bachelor", mode: "insensitive" } },
            ],
          });
        }
        if (typesList.includes("Postgraduate")) {
          courseConditions.push({
            OR: [
              { name: { contains: "M.Tech", mode: "insensitive" } },
              { name: { contains: "M.E.", mode: "insensitive" } },
              { name: { contains: "MBA", mode: "insensitive" } },
              { name: { contains: "M.B.A.", mode: "insensitive" } },
              { name: { contains: "M.Sc", mode: "insensitive" } },
              { name: { contains: "Master", mode: "insensitive" } },
              { name: { contains: "MCA", mode: "insensitive" } },
              { name: { contains: "Integrated", mode: "insensitive" } },
            ],
          });
        }
        if (typesList.includes("PhD / Research")) {
          courseConditions.push({
            OR: [
              { name: { contains: "Ph.D.", mode: "insensitive" } },
              { name: { contains: "PhD", mode: "insensitive" } },
              { name: { contains: "Research", mode: "insensitive" } },
            ],
          });
        }

        if (courseConditions.length > 0) {
          where.courses = {
            some: {
              OR: courseConditions.flatMap(c => c.OR || []),
            },
          };
        }
      }

      // Min/Max Fees filter
      if (minFees || maxFees) {
        where.fees = {};
        if (minFees) {
          where.fees.gte = parseInt(minFees, 10);
        }
        if (maxFees) {
          where.fees.lte = parseInt(maxFees, 10);
        }
      }

      // Ranking Range filter
      if (rankingRange) {
        const maxRank = parseInt(rankingRange, 10);
        const collegeRanks: Record<string, number> = {
          "IIT Madras": 1,
          "NIT Trichy": 9,
          "VIT Vellore": 11,
          "Anna University": 15,
          "SRM Institute of Science and Technology": 18,
          "Sathyabama Institute of Science and Technology": 65,
        };

        const allowedCollegeNames = Object.entries(collegeRanks)
          .filter(([_, rank]) => rank <= maxRank)
          .map(([name]) => name);

        if (search) {
          where.AND = [
            { name: { contains: search, mode: "insensitive" } },
            { name: { in: allowedCollegeNames } }
          ];
          delete where.name;
        } else {
          where.name = { in: allowedCollegeNames };
        }
      }
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
