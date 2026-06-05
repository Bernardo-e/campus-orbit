import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const collegesData = [
  {
    name: "IIT Madras",
    location: "Chennai, Tamil Nadu",
    rating: 4.9,
    fees: 220000,
    description: "Indian Institute of Technology Madras is a public technical and research university located in Chennai, Tamil Nadu, India. It is consistently ranked as the top engineering institute in India.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 Years", fees: 220000 },
      { name: "M.Tech Data Science", duration: "2 Years", fees: 120000 },
      { name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 220000 },
    ],
    reviews: [
      { rating: 5, comment: "World-class education and outstanding research facilities." },
      { rating: 5, comment: "Amazing campus life and placement opportunities." },
    ],
  },
  {
    name: "NIT Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    rating: 4.7,
    fees: 145000,
    description: "National Institute of Technology, Tiruchirappalli is a public technical and research university. It is known for its strong academic curriculum and vibrant campus environment.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 145000 },
      { name: "B.Tech Electronics & Communication", duration: "4 Years", fees: 145000 },
    ],
    reviews: [
      { rating: 5, comment: "Great campus atmosphere and extremely helpful seniors." },
      { rating: 4, comment: "Excellent labs and sports facilities. Hostel facilities could be slightly improved." },
    ],
  },
  {
    name: "Anna University",
    location: "Chennai, Tamil Nadu",
    rating: 4.5,
    fees: 55000,
    description: "Anna University is a public state university located in Tamil Nadu, India. The main campus is in Guindy, Chennai, offering high-quality education at affordable fees.",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.E. Information Technology", duration: "4 Years", fees: 55000 },
      { name: "M.B.A. General Management", duration: "2 Years", fees: 40000 },
    ],
    reviews: [
      { rating: 4, comment: "Highly experienced faculty and historical campus." },
      { rating: 5, comment: "Affordable and excellent placement records for IT students." },
    ],
  },
  {
    name: "VIT Vellore",
    location: "Vellore, Tamil Nadu",
    rating: 4.6,
    fees: 198000,
    description: "Vellore Institute of Technology is a private deemed university. It is famous for its state-of-the-art infrastructure and flexible credit system.",
    image: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 Years", fees: 198000 },
      { name: "B.Tech Bio-Technology", duration: "4 Years", fees: 175000 },
      { name: "M.Tech Software Engineering", duration: "5 Years Integrated", fees: 150000 },
    ],
    reviews: [
      { rating: 5, comment: "Awesome infrastructure and modern curriculum." },
      { rating: 4, comment: "Great college life, but highly crowded." },
    ],
  },
  {
    name: "SRM Institute",
    location: "Kattankulathur, Tamil Nadu",
    rating: 4.3,
    fees: 250000,
    description: "SRM Institute of Science and Technology is a top-ranked private university. It offers a wide range of undergraduate, postgraduate, and doctoral programs.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.Tech CSE (AI & ML)", duration: "4 Years", fees: 300000 },
      { name: "B.Tech Civil Engineering", duration: "4 Years", fees: 250000 },
    ],
    reviews: [
      { rating: 4, comment: "Huge campus with a diverse crowd and good cultural festivals." },
      { rating: 4, comment: "Decent placements and very friendly faculty." },
    ],
  },
  {
    name: "Sathyabama Institute",
    location: "Chennai, Tamil Nadu",
    rating: 4.1,
    fees: 175000,
    description: "Sathyabama Institute of Science and Technology is a premier private university. It is known for its research output and strong industry connections.",
    image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600",
    courses: [
      { name: "B.Tech Aeronautical Engineering", duration: "4 Years", fees: 185000 },
      { name: "B.Tech Information Technology", duration: "4 Years", fees: 175000 },
    ],
    reviews: [
      { rating: 4, comment: "Excellent placement opportunities and structured schedule." },
      { rating: 4, comment: "Very disciplined environment and good lab infrastructure." },
    ],
  },
];

async function main() {
  console.log("Start seeding database...");

  for (const c of collegesData) {
    // Check if the college already exists by its name
    const existingCollege = await prisma.college.findFirst({
      where: { name: c.name },
    });

    if (existingCollege) {
      console.log(`College "${c.name}" already exists. Cleaning and re-creating associated courses/reviews...`);
      
      // Clean existing nested relations to prevent duplicates
      await prisma.course.deleteMany({ where: { collegeId: existingCollege.id } });
      await prisma.review.deleteMany({ where: { collegeId: existingCollege.id } });

      // Update the college entry and populate relations
      await prisma.college.update({
        where: { id: existingCollege.id },
        data: {
          location: c.location,
          rating: c.rating,
          fees: c.fees,
          description: c.description,
          image: c.image,
          courses: {
            create: c.courses,
          },
          reviews: {
            create: c.reviews,
          },
        },
      });
    } else {
      console.log(`Creating college "${c.name}" along with its courses and reviews...`);
      
      // Create new college along with nested relations in a single transaction
      await prisma.college.create({
        data: {
          name: c.name,
          location: c.location,
          rating: c.rating,
          fees: c.fees,
          description: c.description,
          image: c.image,
          courses: {
            create: c.courses,
          },
          reviews: {
            create: c.reviews,
          },
        },
      });
    }
  }

  console.log("Seeding predictors...");
  const dbColleges = await prisma.college.findMany();
  
  const getCollegeId = (name: string) => {
    return dbColleges.find((c) => c.name === name)?.id;
  };

  const iitId = getCollegeId("IIT Madras");
  const nitId = getCollegeId("NIT Trichy");
  const annaId = getCollegeId("Anna University");
  const vitId = getCollegeId("VIT Vellore");
  const srmId = getCollegeId("SRM Institute");
  const sathyabamaId = getCollegeId("Sathyabama Institute");

  // Clean existing predictors
  await prisma.collegePredictor.deleteMany({});

  const predictors = [];

  if (iitId) {
    predictors.push(
      { exam: "JEE Advanced", minRank: 1, maxRank: 5000, collegeId: iitId },
      { exam: "JEE Main", minRank: 1, maxRank: 2000, collegeId: iitId }
    );
  }
  if (nitId) {
    predictors.push(
      { exam: "JEE Main", minRank: 1, maxRank: 15000, collegeId: nitId }
    );
  }
  if (annaId) {
    predictors.push(
      { exam: "TNEA", minRank: 1, maxRank: 25000, collegeId: annaId }
    );
  }
  if (vitId) {
    predictors.push(
      { exam: "JEE Main", minRank: 5000, maxRank: 35000, collegeId: vitId }
    );
  }
  if (srmId) {
    predictors.push(
      { exam: "JEE Main", minRank: 10000, maxRank: 50000, collegeId: srmId }
    );
  }
  if (sathyabamaId) {
    predictors.push(
      { exam: "TNEA", minRank: 10000, maxRank: 45000, collegeId: sathyabamaId },
      { exam: "JEE Main", minRank: 15000, maxRank: 45000, collegeId: sathyabamaId }
    );
  }

  for (const pred of predictors) {
    await prisma.collegePredictor.create({
      data: pred
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
