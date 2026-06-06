import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Canonical college names we want to keep
const CANONICAL_NAMES = [
  "IIT Madras",
  "NIT Trichy",
  "Anna University",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "Sathyabama Institute of Science and Technology",
];

async function main() {
  console.log("Starting duplicate cleanup...\n");

  const all = await prisma.college.findMany({ orderBy: { name: "asc" } });
  console.log(`Total colleges before cleanup: ${all.length}`);
  all.forEach((c) => console.log(`  [${c.id}] ${c.name} | image: ${c.image}`));

  // For each canonical name, keep the one with a local /images/ path, delete the rest
  for (const name of CANONICAL_NAMES) {
    const matches = all.filter(
      (c) => c.name === name || c.name.startsWith(name.split(" ")[0] + " Institute") && c.name !== name
        ? false
        : c.name === name
    );

    // Actually: find all colleges whose name matches (exact) or is a partial/old version
    const exact = all.filter((c) => c.name === name);
    
    if (exact.length <= 1) continue; // no duplicate for this name

    // Prefer the one with a local image path
    const preferred = exact.find((c) => c.image?.startsWith("/images/")) ?? exact[0];
    const toDelete = exact.filter((c) => c.id !== preferred.id);

    console.log(`\nDuplicate found: "${name}" (${exact.length} entries)`);
    console.log(`  Keeping : [${preferred.id}] image=${preferred.image}`);

    for (const dup of toDelete) {
      console.log(`  Deleting: [${dup.id}] image=${dup.image}`);
      // Delete relations first
      await prisma.collegePredictor.deleteMany({ where: { collegeId: dup.id } });
      await prisma.course.deleteMany({ where: { collegeId: dup.id } });
      await prisma.review.deleteMany({ where: { collegeId: dup.id } });
      await prisma.savedCollege.deleteMany({ where: { collegeId: dup.id } });
      await prisma.college.delete({ where: { id: dup.id } });
    }
  }

  // Also delete any colleges NOT in the canonical list (stray/test entries)
  const remaining = await prisma.college.findMany();
  const stray = remaining.filter((c) => !CANONICAL_NAMES.includes(c.name));
  if (stray.length > 0) {
    console.log(`\nDeleting ${stray.length} non-canonical college(s):`);
    for (const s of stray) {
      console.log(`  Deleting stray: [${s.id}] "${s.name}"`);
      await prisma.collegePredictor.deleteMany({ where: { collegeId: s.id } });
      await prisma.course.deleteMany({ where: { collegeId: s.id } });
      await prisma.review.deleteMany({ where: { collegeId: s.id } });
      await prisma.savedCollege.deleteMany({ where: { collegeId: s.id } });
      await prisma.college.delete({ where: { id: s.id } });
    }
  }

  const final = await prisma.college.findMany({ orderBy: { name: "asc" } });
  console.log(`\nTotal colleges after cleanup: ${final.length}`);
  final.forEach((c) => console.log(`  ✓ [${c.id}] ${c.name}`));
  console.log("\nCleanup complete!");
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
