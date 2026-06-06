import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

// Community seed users for preloaded Q&A
const communityUsers = [
  { name: "Rahul Sharma",  email: "rahul.sharma@community.campusorbit.in",  password: "community123", targetExam: "JEE Main",     targetBranch: "Computer Science" },
  { name: "Ananya Patel",  email: "ananya.patel@community.campusorbit.in",  password: "community123", targetExam: "JEE Advanced", targetBranch: "Computer Science" },
  { name: "Karthik Raja",  email: "karthik.raja@community.campusorbit.in",  password: "community123", targetExam: "TNEA",         targetBranch: "Information Technology" },
  { name: "Siddharth Rao", email: "siddharth.rao@community.campusorbit.in", password: "community123", targetExam: "VITEEE",       targetBranch: "Computer Science" },
  { name: "Priya Menon",   email: "priya.menon@community.campusorbit.in",   password: "community123", targetExam: "SRMJEEE",      targetBranch: "AI & Machine Learning" },
  { name: "Arjun Nair",    email: "arjun.nair@community.campusorbit.in",    password: "community123", targetExam: "JEE Main",     targetBranch: "Electrical Engineering" },
  { name: "Sneha Iyer",    email: "sneha.iyer@community.campusorbit.in",    password: "community123", targetExam: "TNEA",         targetBranch: "Electronics & Communication" },
  { name: "Dev Krishnan",  email: "dev.krishnan@community.campusorbit.in",  password: "community123", targetExam: "SAEEE",        targetBranch: "Aerospace Engineering" },
];

// Preloaded Q&A data
const qnaData = [
  {
    author: "Rahul Sharma",
    title: "JEE Main cutoff predictions for NIT Trichy CSE 2025?",
    body: "My rank in JEE Main is 1200. Do I stand a chance of securing Computer Science and Engineering at NIT Trichy under Home State quota? Or should I consider other options like NIT Surathkal or NIT Warangal? Any advice from seniors who went through JOSAA counselling would be very helpful.",
    tags: ["JEE Main", "NIT Trichy", "Admissions", "JOSAA"],
    answers: [
      { author: "Ananya Patel", body: "With JEE Main rank 1200 you have a very strong chance at NIT Trichy CSE under Home State (Tamil Nadu) quota — the closing rank for HS category hovers around 1800–2200. For Other State, it's tougher (around 600–900). Apply confidently in round 1, and keep NIT Surathkal CSE as a backup. Your rank is solid for both." },
      { author: "Arjun Nair",   body: "Agree with the above. Also check the previous 5 years' opening and closing ranks on JOSAA's official portal. The cutoffs shift slightly each year based on total candidates. Mock allotment in round 1 is a good indicator. Lock NIT Trichy CSE as your top choice if it's your dream branch." },
      { author: "Sneha Iyer",   body: "One tip: don't forget that choice-locking strategy matters a lot. Fill as many choices as possible in preference order. Many students with rank 1200 panic and fill fewer than 20 choices. Fill 40+ choices to maximize your chances across multiple NITs and IIITs." },
    ],
  },
  {
    author: "Ananya Patel",
    title: "Life at IIT Madras — campus environment & research facilities",
    body: "For anyone curious about selecting IIT Madras this year: campus life is incredibly active. The research park is second to none, and hostels are getting upgraded. I'm a second year student here. Ask me anything about courses, campus life, placements, or research opportunities!",
    tags: ["IIT Madras", "Campus Life", "Q&A", "Research"],
    answers: [
      { author: "Rahul Sharma",  body: "What's the average package for CSE students? And how competitive is it to get into research projects in your first or second year?" },
      { author: "Ananya Patel",  body: "CSE average package is around 28–35 LPA with top offers from Google, Microsoft, and Goldman Sachs going above 1 Crore. For research, you can apply to professors directly after your first semester — most are very open to motivated undergrads." },
      { author: "Karthik Raja",  body: "Is the deer actually still on campus? I heard IIT Madras has a protected forest inside. Planning to visit during open day!" },
      { author: "Ananya Patel",  body: "Yes! The campus sits inside a protected forest reserve — blackbuck deer, monkeys, and even peacocks roam freely. Open house is usually in October, highly recommend visiting." },
    ],
  },
  {
    author: "Karthik Raja",
    title: "Anna University CEG vs MIT campus — which to choose for TNEA 2025?",
    body: "Confused between CSE at CEG (College of Engineering Guindy) campus and IT at MIT (Madras Institute of Technology) campus for the upcoming TNEA counselling choice list. My cutoff score is 196.5. Which has a better placement track record for software roles?",
    tags: ["TNEA", "Anna University", "Counseling", "Placements"],
    answers: [
      { author: "Sneha Iyer",   body: "CEG CSE is the gold standard in Anna University — historically the best placements, top companies visit exclusively for CEG. With 196.5 you might just make it to CEG CSE (cutoff usually around 196–198). Prioritize CEG CSE >> MIT IT >> CEG IT in that order." },
      { author: "Siddharth Rao", body: "MIT campus is excellent for core electronics and aeronautical branches, but for software IT roles, CEG has a stronger alumni network. If your cutoff gets you CEG CSE, take it without second thoughts." },
      { author: "Rahul Sharma",  body: "Also consider that CEG is the main campus — all central facilities are there. MIT is about 30 mins away which can be inconvenient for events and inter-campus activities." },
    ],
  },
  {
    author: "Siddharth Rao",
    title: "VIT Vellore placement trends 2025 — what to expect?",
    body: "Sharing insights on placements at VIT Vellore based on my final year experience. Despite the market conditions, software product roles saw good turnout. Average package for CSE was around 9 LPA. Here's my full breakdown — feel free to ask anything.",
    tags: ["VIT Vellore", "Placements", "Insights", "VITEEE"],
    answers: [
      { author: "Priya Menon",   body: "How many students from CSE actually got placed in the 9+ LPA range? I've heard the average is pulled up by a few very high offers. What's the median package for CSE 2025?" },
      { author: "Siddharth Rao", body: "Fair point — the median is around 6.5–7 LPA for CSE. The average is pulled up by FAANG offers (40–80 LPA range) going to roughly 8–10% of the batch. Overall placement for CSE is about 85% within 6 months of graduation." },
      { author: "Arjun Nair",    body: "Is CGPA cutoff strictly enforced for placements? I've heard some companies at VIT require 8.0+. Is that standard?" },
      { author: "Siddharth Rao", body: "Top-tier product companies typically require 8.5+ CGPA. Mid-tier use 7.0–7.5 as the bar. Maintain at least 8.0+ to maximize your options. VIT's system is on a 10-point scale." },
    ],
  },
  {
    author: "Priya Menon",
    title: "SRM vs VIT for CSE AI & ML specialization — which is better?",
    body: "I have decent ranks in both SRMJEEE and VITEEE. Trying to decide between SRM's B.Tech CSE (AI & ML) and VIT's B.Tech CSE with AI specialization. Both cost around 2.5–3 LPA/year. Which has better faculty, labs, and industry exposure for AI/ML specifically?",
    tags: ["SRMJEEE", "VITEEE", "AI & ML", "Admissions"],
    answers: [
      { author: "Siddharth Rao", body: "VIT has a slight edge in research output in AI/ML. SRM's AI & ML program is newer but they've invested heavily in NVIDIA GPU clusters and industry tie-ups with IBM and Zoho. Both are solid choices." },
      { author: "Dev Krishnan",  body: "I'd look at the faculty profiles. VIT has more internationally published AI researchers. SRM has been catching up fast since 2022 with new hires. Visit both campuses and talk to current students if possible." },
      { author: "Ananya Patel",  body: "From an IIT perspective — both will prepare you well for GATE if you want an M.Tech in AI later. The specialization courses at 3rd/4th year matter more than the brand for core AI roles. Ask for their full course catalog before deciding." },
    ],
  },
  {
    author: "Dev Krishnan",
    title: "Is Sathyabama a good choice for Aerospace Engineering via SAEEE?",
    body: "Cleared SAEEE with a decent rank and Sathyabama's Aerospace Engineering is in my list. I know Sathyabama has NAAC A++ but how is the aerospace program specifically? Any alumni who can share placement data or research exposure for aerospace at Sathyabama?",
    tags: ["SAEEE", "Sathyabama", "Aerospace", "Admissions"],
    answers: [
      { author: "Karthik Raja", body: "Sathyabama's Aerospace department has collaborations with ISRO and HAL which is a big deal for an undergrad. They have wind tunnel facilities and regular workshops with DRDO. For pure aerospace roles (HAL, NAL, ISRO), alumni placement is around 60–70% in core aerospace within 1 year." },
      { author: "Sneha Iyer",   body: "The NAAC A++ accreditation matters a lot for government job eligibility and PSU recruitment. Their collaboration with ISRO Propulsion Complex gives real project exposure which is hard to get elsewhere in private universities." },
      { author: "Rahul Sharma", body: "For aerospace, IITs and NITs will always be top-tier for core research roles. Sathyabama is an excellent choice if you didn't get those, especially for the ISRO pipeline. A great option for aerospace in the private university space." },
    ],
  },
  {
    author: "Arjun Nair",
    title: "JEE Advanced prep strategy — from JEE Main AIR 4500 to IIT",
    body: "Just got AIR 4500 in JEE Main and qualified for JEE Advanced. I have about 8 weeks. My weak areas are Organic Chemistry and Integral Calculus. What study strategy worked for those who cracked Advanced from a similar JEE Main rank? Looking for realistic advice.",
    tags: ["JEE Advanced", "IIT", "Preparation", "Strategy"],
    answers: [
      { author: "Ananya Patel",  body: "For Organic Chemistry — don't try to memorize reactions. Understand the mechanism (electron push/pull, nucleophile/electrophile patterns). Solve all named reactions and NCERT thoroughly. For Advanced, mechanism-based questions require you to predict products of unseen reactions." },
      { author: "Siddharth Rao", body: "For Integral Calculus — Arihant's book by Amit Agarwal is the go-to. Spend 2 weeks doing past 10 years of JEE Advanced calculus questions sorted by topic. Substitution, parts, partial fractions, and definite integral properties appear every year. Master those 4 topics first." },
      { author: "Priya Menon",   body: "8 weeks is enough if you're strategic. Don't start new topics — only strengthen weak ones. Mock test every 3 days under real conditions. Analyze errors the day after: silly mistake, concept gap, or time management. Fix concept gaps only." },
    ],
  },
  {
    author: "Sneha Iyer",
    title: "TNEA 2025 counselling — how to prepare the choice list optimally?",
    body: "First time going through TNEA counselling and the choice list process is confusing. I have a cutoff of 194.25 and want CSE at a good college. How many choices should I fill? Should I mix safe and reach options? Any tips on the order and strategy?",
    tags: ["TNEA", "Anna University", "Counseling", "Strategy"],
    answers: [
      { author: "Karthik Raja",  body: "Fill the maximum number of choices allowed — typically 100+. Order strictly by preference, not safety. The TNEA algorithm allocates you the highest-preference seat where your cutoff qualifies. So always put your dream seat first, even if it's a reach. Filling safe seats first is the biggest mistake." },
      { author: "Rahul Sharma",  body: "With 194.25, you're in a strong range for good government colleges. CEG CSE might be a slight stretch, but put it first anyway. MIT IT, SAP ECE, and Guindy ECE should be in your top 10. Research all colleges — some hidden gems open up in later rounds." },
      { author: "Dev Krishnan",  body: "Bookmark the TNEA portal's Statistics page which shows previous year opening/closing cutoffs for every college-branch combination. Use that as your guide when ordering choices." },
    ],
  },
];

async function main() {
  console.log("Start seeding database...");

  // ── Colleges ────────────────────────────────────────────────────────────────
  for (const c of collegesData) {
    const existingCollege = await prisma.college.findFirst({ where: { name: c.name } });
    if (existingCollege) {
      console.log(`College "${c.name}" already exists. Cleaning and re-creating...`);
      await prisma.course.deleteMany({ where: { collegeId: existingCollege.id } });
      await prisma.review.deleteMany({ where: { collegeId: existingCollege.id } });
      await prisma.college.update({
        where: { id: existingCollege.id },
        data: {
          location: c.location, rating: c.rating, fees: c.fees,
          description: c.description, image: c.image,
          courses: { create: c.courses }, reviews: { create: c.reviews },
        },
      });
    } else {
      console.log(`Creating college "${c.name}"...`);
      await prisma.college.create({
        data: {
          name: c.name, location: c.location, rating: c.rating, fees: c.fees,
          description: c.description, image: c.image,
          courses: { create: c.courses }, reviews: { create: c.reviews },
        },
      });
    }
  }

  // ── Predictors ──────────────────────────────────────────────────────────────
  console.log("Seeding predictors...");
  const dbColleges = await prisma.college.findMany();
  const getCollegeId = (name: string) => dbColleges.find((c) => c.name === name)?.id;

  const iitId        = getCollegeId("IIT Madras");
  const nitId        = getCollegeId("NIT Trichy");
  const annaId       = getCollegeId("Anna University");
  const vitId        = getCollegeId("VIT Vellore");
  const srmId        = getCollegeId("SRM Institute of Science and Technology");
  const sathyabamaId = getCollegeId("Sathyabama Institute of Science and Technology");

  await prisma.collegePredictor.deleteMany({});

  const predictors: { exam: string; minRank: number; maxRank: number; collegeId: string }[] = [];
  if (iitId)        { predictors.push({ exam: "JEE Advanced", minRank: 1,     maxRank: 5000,   collegeId: iitId });
                      predictors.push({ exam: "JEE Main",     minRank: 1,     maxRank: 2000,   collegeId: iitId }); }
  if (nitId)          predictors.push({ exam: "JEE Main",     minRank: 1,     maxRank: 15000,  collegeId: nitId });
  if (annaId)         predictors.push({ exam: "TNEA",         minRank: 1,     maxRank: 25000,  collegeId: annaId });
  if (vitId)          predictors.push({ exam: "VITEEE",       minRank: 1,     maxRank: 100000, collegeId: vitId });
  if (srmId)        { predictors.push({ exam: "SRMJEEE",      minRank: 1,     maxRank: 50000,  collegeId: srmId });
                      predictors.push({ exam: "JEE Main",     minRank: 10000, maxRank: 50000,  collegeId: srmId }); }
  if (sathyabamaId) { predictors.push({ exam: "TNEA",         minRank: 10000, maxRank: 45000,  collegeId: sathyabamaId });
                      predictors.push({ exam: "JEE Main",     minRank: 15000, maxRank: 45000,  collegeId: sathyabamaId });
                      predictors.push({ exam: "SAEEE",        minRank: 1,     maxRank: 50000,  collegeId: sathyabamaId }); }

  for (const pred of predictors) {
    await prisma.collegePredictor.create({ data: pred });
  }

  // ── Community Users ─────────────────────────────────────────────────────────
  console.log("Seeding community users...");
  const userMap: Record<string, string> = {};

  for (const u of communityUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      userMap[u.name] = existing.id;
      console.log(`  User "${u.name}" already exists.`);
    } else {
      const hashed = await bcrypt.hash(u.password, 10);
      const created = await prisma.user.create({
        data: { name: u.name, email: u.email, password: hashed, targetExam: u.targetExam, targetBranch: u.targetBranch },
      });
      userMap[u.name] = created.id;
      console.log(`  Created user "${u.name}".`);
    }
  }

  // ── Preloaded Q&A ───────────────────────────────────────────────────────────
  const existingQuestions = await prisma.question.count();
  if (existingQuestions > 0) {
    console.log(`Skipping Q&A seed — ${existingQuestions} question(s) already in DB.`);
  } else {
    console.log("Seeding preloaded Q&A...");
    for (const q of qnaData) {
      const authorId = userMap[q.author];
      if (!authorId) { console.warn(`  Skipping — author "${q.author}" not found`); continue; }

      const question = await prisma.question.create({
        data: { title: q.title, body: q.body, tags: q.tags, authorId },
      });
      console.log(`  Q: "${q.title.substring(0, 55)}..."`);

      for (const a of q.answers) {
        const ansAuthorId = userMap[a.author];
        if (!ansAuthorId) { console.warn(`    Skipping answer — "${a.author}" not found`); continue; }
        await prisma.answer.create({
          data: { body: a.body, authorId: ansAuthorId, questionId: question.id },
        });
      }
    }
    console.log("Q&A seeding complete.");
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => { console.error("Seeding error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
