import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CollegeDetailClient from "./CollegeDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  // Await dynamic route parameters before access in Next.js 15+
  const { id } = await params;

  // Fetch college details along with its courses and reviews from the database
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      reviews: true,
    },
  });

  // Render notFound if record is missing
  if (!college) {
    notFound();
  }

  return <CollegeDetailClient college={college} />;
}
