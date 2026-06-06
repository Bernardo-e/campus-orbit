import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.answer.deleteMany({});
  const r = await prisma.question.deleteMany({});
  console.log(`Cleared ${r.count} questions and all answers.`);
}
main().finally(() => prisma.$disconnect());
