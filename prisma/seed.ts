import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const collegesData = [
  {
    name: "IIT Madras",
    location: "Chennai, Tamil Nadu",
    rating: 4.9,
    fees: 220000,
    description: "Indian Institute of Technology Madras is a public technical and research university located in Chennai, Tamil Nadu, India. It is consistently ranked as the top engineering institute in India.",
    image: "/images/iitm.jpg",
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
    image: "/images/nitt.jpg",
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
    description: "Anna University is one of India's most respected public technical universities. Established in 1978 and headquartered in Chennai, it oversees 500+ affiliated colleges while maintaining world-class constituent campuses. Recognized by NAAC with A++ accreditation.",
    image: "/images/anna.png",
    courses: [
      { name: "B.E. Computer Science Engineering", duration: "4 Years", fees: 55000 },
      { name: "B.E. Electronics & Communication Engineering", duration: "4 Years", fees: 55000 },
      { name: "B.E. Information Technology", duration: "4 Years", fees: 55000 },
      { name: "M.E. Computer Science & Engineering", duration: "2 Years", fees: 65000 },
      { name: "M.B.A. General Management", duration: "2 Years", fees: 75000 },
      { name: "Ph.D. Research Programs", duration: "3-5 Years", fees: 20000 },
    ],
    reviews: [
      { rating: 5, comment: "Highly experienced faculty and a prestigious academic brand. The affordability is unmatched for a NAAC A++ institution." },
      { rating: 4, comment: "Excellent placement records for CSE and IT students. Government recognition makes this one of the best public engineering universities in South India." },
    ],
  },
  {
    name: "VIT Vellore",
    location: "Vellore, Tamil Nadu",
    rating: 4.6,
    fees: 198000,
    description: "Vellore Institute of Technology is a private deemed university. It is famous for its state-of-the-art infrastructure and flexible credit system.",
    image: "/images/vit.jpg",
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
    name: "SRM Institute of Science and Technology",
    location: "Kattankulathur, Chennai, Tamil Nadu",
    rating: 4.6,
    fees: 250000,
    description: "SRM Institute of Science and Technology is one of India's top-ranked private universities, offering world-class programs in engineering, technology, management, medicine, and research. Known for strong placements, modern infrastructure, and global exposure.",
    image: "/images/srm.jpg",
    courses: [
      { name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 250000 },
      { name: "B.Tech CSE (AI & Machine Learning)", duration: "4 Years", fees: 300000 },
      { name: "B.Tech Electronics & Communication", duration: "4 Years", fees: 250000 },
      { name: "B.Tech Cyber Security", duration: "4 Years", fees: 280000 },
      { name: "M.Tech Software Engineering", duration: "2 Years", fees: 150000 },
      { name: "MBA General Management", duration: "2 Years", fees: 350000 },
    ],
    reviews: [
      { rating: 5, comment: "Excellent infrastructure and world-class labs. The campus life at SRM is incredible with Aaruush and Milan festivals. Placements are very strong especially for CSE." },
      { rating: 4, comment: "Great industry connections and strong placement support. The AI & ML program is outstanding. Fee structure is on the higher side but worth it for the exposure." },
    ],
  },
  {
    name: "Sathyabama Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    rating: 4.5,
    fees: 175000,
    description: "Sathyabama Institute of Science and Technology is one of Chennai's most respected private universities, known for engineering, aerospace, architecture, science, and research. Recognized by NAAC with A++ accreditation and strong industry connections.",
    image: "/images/sathyabama.jpg",
    courses: [
      { name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 175000 },
      { name: "B.Tech AI & Data Science", duration: "4 Years", fees: 185000 },
      { name: "B.Tech Aerospace Engineering", duration: "4 Years", fees: 185000 },
      { name: "B.Tech Cyber Security", duration: "4 Years", fees: 180000 },
      { name: "M.E. Computer Science & Engineering", duration: "2 Years", fees: 120000 },
      { name: "MBA General Management", duration: "2 Years", fees: 200000 },
    ],
    reviews: [
      { rating: 5, comment: "Excellent infrastructure and strong research orientation. The Aerospace Engineering program is outstanding. Placement support is very good, especially for CSE and AI branches." },
      { rating: 4, comment: "Very disciplined environment, good lab facilities, and active student community. NAAC A++ accreditation reflects the academic quality well." },
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
  const srmId = getCollegeId("SRM Institute of Science and Technology");
  const sathyabamaId = getCollegeId("Sathyabama Institute of Science and Technology");

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
      { exam: "VITEEE", minRank: 1, maxRank: 100000, collegeId: vitId }
    );
  }
  if (srmId) {
    predictors.push(
      { exam: "SRMJEEE", minRank: 1, maxRank: 50000, collegeId: srmId },
      { exam: "JEE Main", minRank: 10000, maxRank: 50000, collegeId: srmId }
    );
  }
  if (sathyabamaId) {
    predictors.push(
      { exam: "TNEA", minRank: 10000, maxRank: 45000, collegeId: sathyabamaId },
      { exam: "JEE Main", minRank: 15000, maxRank: 45000, collegeId: sathyabamaId },
      { exam: "SAEEE", minRank: 1, maxRank: 50000, collegeId: sathyabamaId }
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
