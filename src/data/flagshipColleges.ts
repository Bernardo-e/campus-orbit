export interface Scholarship {
  name: string;
  eligibility: string;
  benefits: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  academics: number;
  placements: number;
  infrastructure: number;
  campusLife: number;
  research: number;
  comment: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface CutoffInsight {
  branch: string;
  cutoff: string;
}

export interface AdmissionStep {
  step: string;
  label: string;
  sub: string;
}

export interface FeeCard {
  type: string;
  name: string;
  duration: string;
  amount: string;
  color: string;
}

export interface CollegeTheme {
  brandColor: string;
  brandAccent: string;
  brandText: string;
  glowClass: string;
}

export interface FlagshipCollegeDetails {
  shortName: string;
  established: number;
  campusArea: string;
  studentsCount: string;
  facultyCount: string;
  staffCount: string;
  theme?: CollegeTheme;
  nirfRankings: { category: string; rank: string }[];
  qsRankings: { category: string; rank: string }[];
  placementStats: {
    ugPlaced: number;
    pgPlaced: number;
    rate: string;
    averagePackage: string;
    highestPackage: string;
    recruiters: string[];
    branchHighlights: { branch: string; package: string }[];
  };
  cutoffInsights?: CutoffInsight[];
  admissionSteps?: AdmissionStep[];
  feeCards?: FeeCard[];
  campusLife: {
    hostels: string;
    facilities: string[];
    festivals: { name: string; type: string; description: string }[];
    activities: string[];
  };
  researchInnovation: {
    highlights: string[];
    incubatedStartups: string;
    focusAreas: string[];
    incubatorName: string;
    incubatorDescription: string;
  };
  scholarships: Scholarship[];
  scorecard: {
    academics: number;
    placements: number;
    research: number;
    innovation: number;
    campusLife: number;
    infrastructure: number;
    overall: number;
  };
  faqs: FAQ[];
  qnas: QA[];
  aboutParagraphs: string[];
  reviews: Review[];
}

export const flagshipCollegesData: Record<string, FlagshipCollegeDetails> = {
  "IIT Madras": {
    shortName: "IITM",
    established: 1959,
    campusArea: "618 Acres",
    studentsCount: "8,000+",
    facultyCount: "550+",
    staffCount: "1,250+",
    theme: {
      brandColor: "#3b82f6",
      brandAccent: "#6366f1",
      brandText: "#93c5fd",
      glowClass: "bg-blue-950/10"
    },
    nirfRankings: [
      { category: "Overall", rank: "#1" },
      { category: "Engineering", rank: "#1" },
      { category: "Research", rank: "#2" },
      { category: "Management", rank: "#13" },
    ],
    qsRankings: [
      { category: "Global", rank: "#180" },
      { category: "Engineering & Tech", rank: "#62" },
      { category: "Computer Science", rank: "#79" },
      { category: "Natural Sciences", rank: "#156" },
    ],
    placementStats: {
      ugPlaced: 890,
      pgPlaced: 943,
      rate: "80%+",
      averagePackage: "₹22 LPA",
      highestPackage: "₹1.3 Crore+",
      recruiters: [
        "Google",
        "Microsoft",
        "Amazon",
        "Qualcomm",
        "Adobe",
        "Goldman Sachs",
        "Samsung",
        "Intel",
        "Oracle",
        "Uber",
      ],
      branchHighlights: [
        { branch: "Computer Science (CSE)", package: "₹53.2 LPA" },
        { branch: "Electrical Engineering", package: "₹28.8 LPA" },
        { branch: "Mechanical Engineering", package: "₹16.9 LPA" },
        { branch: "Civil Engineering", package: "₹17.5 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science (CSE)", cutoff: "Closing Rank 148" },
      { branch: "Electrical Engineering", cutoff: "Closing Rank 980" },
      { branch: "Mechanical Engineering", cutoff: "Closing Rank 2500" },
      { branch: "Aerospace Engineering", cutoff: "Closing Rank 3100" },
    ],
    admissionSteps: [
      { step: "1", label: "JEE Main", sub: "Screening" },
      { step: "2", label: "JEE Advanced", sub: "Cutoff Match" },
      { step: "3", label: "JoSAA Counselling", sub: "Options Registry" },
      { step: "4", label: "Seat Allotment", sub: "Allocation" },
      { step: "5", label: "Admission", sub: "Verification" },
    ],
    feeCards: [
      { type: "UG Programs", name: "B.Tech / BS / Dual Degree", duration: "Duration: 4-5 Years", amount: "₹8.74L", color: "from-blue-500/10 to-blue-500/20 text-blue-400 border-blue-500/20" },
      { type: "PG Engineering", name: "M.Tech Program", duration: "Duration: 2 Years", amount: "₹1.52L", color: "from-emerald-500/10 to-emerald-500/20 text-emerald-400 border-emerald-500/20" },
      { type: "PG Business", name: "MBA Program", duration: "Duration: 2 Years", amount: "₹12.22L", color: "from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20" }
    ],
    campusLife: {
      hostels: "20+ Hostels on campus",
      facilities: [
        "High-speed Campus WiFi",
        "Olympic-sized Sports Complex",
        "Advanced Research Labs",
        "Student Innovation Centers",
        "Central Library (5-story)",
        "Multi-cuisine Cafeterias",
        "24/7 Medical Center",
      ],
      festivals: [
        {
          name: "Shaastra",
          type: "Technical",
          description: "India's largest student-run technical festival, ISO certified.",
        },
        {
          name: "Saarang",
          type: "Cultural",
          description: "India's largest student-run cultural festival, hosting 70,000+ footfalls.",
        },
      ],
      activities: [
        "Coding Clubs (CFI)",
        "Robotics Club",
        "Entrepreneurship Cell (E-Cell)",
        "Inter-IIT Sports Training",
        "Theatricals & Music Societies",
      ],
    },
    researchInnovation: {
      highlights: [
        "IIT Madras Research Park (India's first university-based park)",
        "Deep Tech & Semiconductor Lab Ecosystem",
        "Electric Vehicle (EV) and Battery Research Initiatives",
        "Sustainable Energy & Carbon Neutrality Hubs",
      ],
      incubatedStartups: "350+ startups incubated with a combined valuation of ₹45,000 Cr+",
      focusAreas: [
        "Artificial Intelligence & ML",
        "Robotics & Automation",
        "Semiconductor Design",
        "Deep Tech Incubator",
        "Electric Mobility",
      ],
      incubatorName: "IIT Madras Research Park",
      incubatorDescription: "The IIT Madras Research Park is India's first university-based research park. It bridges academic ideas with industrial ventures."
    },
    scholarships: [
      {
        name: "Merit-cum-Means Scholarship",
        eligibility: "UG students with family income < ₹4.5 LPA.",
        benefits: "Full tuition fee waiver + ₹1,000 monthly allowance.",
      },
      {
        name: "Institute Free Studentship",
        eligibility: "UG students with family income < ₹4.5 LPA (up to 25% of students).",
        benefits: "Exemption from tuition fees.",
      },
      {
        name: "Aditya Birla Scholarship",
        eligibility: "Top rankers in JEE Advanced.",
        benefits: "₹1.5 Lakhs per annum, renewable based on CGPA.",
      },
      {
        name: "ST Engineering Scholarship",
        eligibility: "B.Tech students with excellent academic records.",
        benefits: "Covers tuition fees and provides a living stipend.",
      },
      {
        name: "Indian Women's Association Scholarship",
        eligibility: "Deserving female UG students based on merit and financial need.",
        benefits: "Annual financial support and mentorship.",
      },
    ],
    scorecard: {
      academics: 10,
      placements: 10,
      research: 10,
      innovation: 10,
      campusLife: 9.8,
      infrastructure: 10,
      overall: 9.9,
    },
    faqs: [
      {
        question: "How are placements at IIT Madras?",
        answer: "IIT Madras placements are outstanding. In recent cycles, the average package stood at ₹22 LPA, with the highest package exceeding ₹1.3 Crore. Over 80% of students were placed, with recruiters like Google, Microsoft, and Qualcomm participating.",
      },
      {
        question: "What is the JEE Advanced cutoff?",
        answer: "Cutoffs vary by branch. For Computer Science (CSE), the closing rank is typically within the top 150 ranks in JEE Advanced. For other core branches, it ranges from 500 to 5000.",
      },
      {
        question: "Can I join IIT Madras without JEE?",
        answer: "Yes, for specific programs. PG programs accept GATE (M.Tech), CAT (MBA), and JAM (M.Sc). Additionally, IIT Madras offers a popular online B.S. in Data Science which has a qualifier-based entry process instead of JEE.",
      },
      {
        question: "Which courses are offered?",
        answer: "IIT Madras offers B.Tech, B.S., and Dual Degrees at the UG level. For PG, it offers M.Tech, MBA, M.Sc, M.A., and M.S. (by research). It also offers extensive Ph.D. research fellowships.",
      },
      {
        question: "Does IIT Madras have a dress code?",
        answer: "No, there is no official dress code for students on campus. Casual, comfortable clothing is standard, though formal attire may be expected during placements or official presentation ceremonies.",
      },
      {
        question: "Is IIT Madras safe for girls?",
        answer: "Yes, the campus is extremely safe. It has 24/7 security patrol, well-lit forest pathways, emergency response numbers, and dedicated women's hostels with strict access controls.",
      },
      {
        question: "What is IIT Madras ranking?",
        answer: "IIT Madras is consistently ranked #1 Overall and #1 in Engineering by the NIRF (Govt of India). Globally, it ranks #180 in the QS World Rankings 2026 and #62 for Engineering & Technology.",
      },
      {
        question: "What is the campus area?",
        answer: "The campus spans 618 acres of lush, forest-protected environment in Chennai, home to blackbucks, spotted deer, and rich biodiversity alongside world-class academic infrastructure.",
      },
    ],
    qnas: [
      {
        question: "Why is IIT Madras famous?",
        answer: "IIT Madras is famous for its academic excellence, top engineering national rankings (consistently #1), rich research culture, the IITM Research Park ecosystem, and strong placement records with global tech giants.",
      },
      {
        question: "Is IIT Madras good for startups?",
        answer: "Absolutely. IIT Madras has India's leading startup incubation cell and research park. It has nurtured over 350 startups with a combined market valuation of over ₹45,000 Crores, particularly in deep tech, EV, and semiconductors.",
      },
      {
        question: "What makes campus life unique?",
        answer: "The campus is a unique combination of a forest sanctuary (home to wild deer) and a modern technological hub. Annual student-run festivals like Shaastra and Saarang, alongside active hobby clubs (CFI), make student life highly vibrant.",
      },
    ],
    aboutParagraphs: [
      "Indian Institute of Technology Madras (IIT Madras) is India's premier engineering institution and one of the country's most prestigious universities.",
      "The institute is recognized globally for excellence in technical education, research, innovation, entrepreneurship, and industrial consultancy.",
      "Known for world-class faculty, cutting-edge research, elite placements, startup culture, and academic excellence, IIT Madras consistently ranks among the top institutions in India.",
      "The campus is located inside a protected forest ecosystem and offers a unique blend of nature, innovation, and world-class infrastructure, home to wild spotted deer and rich biodiversity."
    ],
    reviews: [
      {
        id: "rev-iitm-1",
        author: "Aditya Verma",
        role: "B.Tech CSE Student",
        rating: 5,
        academics: 5,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 5,
        comment: "The placement records and coding culture at IIT Madras are unmatched. The peer group drives you to excel. IITM Research Park is an amazing asset for anyone looking to innovate.",
        strengths: ["Excellent Faculty", "Strong Placements", "Elite Peer Group", "Research Hub"],
        weaknesses: ["More Industry Internships", "Curriculum Load"]
      },
      {
        id: "rev-iitm-2",
        author: "Pooja Hegde",
        role: "M.Tech Research Fellow",
        rating: 5,
        academics: 5,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 5,
        comment: "Superb research laboratories and guidance. The forest campus is incredibly peaceful and offers an environment focused on engineering innovation.",
        strengths: ["Excellent Faculty", "Research Hub"],
        weaknesses: ["Curriculum Load"]
      }
    ],
  },
  "NIT Trichy": {
    shortName: "NIT Trichy",
    established: 1964,
    campusArea: "800 Acres",
    studentsCount: "6,496+",
    facultyCount: "252+",
    staffCount: "500+",
    theme: {
      brandColor: "#0ea5e9",
      brandAccent: "#2563eb",
      brandText: "#7dd3fc",
      glowClass: "bg-sky-950/10"
    },
    nirfRankings: [
      { category: "Engineering", rank: "#9" },
      { category: "Overall", rank: "#30" },
      { category: "Architecture", rank: "#9" },
      { category: "Research", rank: "#31" },
      { category: "Management", rank: "#57" },
    ],
    qsRankings: [
      { category: "Global", rank: "#731-740" },
      { category: "Computer Science", rank: "#751-850" },
    ],
    placementStats: {
      ugPlaced: 779,
      pgPlaced: 655,
      rate: "80%+",
      averagePackage: "₹22 LPA",
      highestPackage: "₹52.89 LPA+",
      recruiters: [
        "Google",
        "Microsoft",
        "Amazon",
        "Oracle",
        "Infosys",
        "TCS",
        "Wipro",
        "Qualcomm",
        "Samsung",
        "Intel",
      ],
      branchHighlights: [
        { branch: "Computer Science (CSE) Average", package: "₹27.2 LPA" },
        { branch: "Electronics & Communication Average", package: "₹21.5 LPA" },
        { branch: "Electrical & Electronics Average", package: "₹18.9 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science (CSE)", cutoff: "Closing Rank 4,463" },
      { branch: "Electronics & Communication (ECE)", cutoff: "Closing Rank 6,947" },
      { branch: "Electrical & Electronics (EEE)", cutoff: "Closing Rank 9,052" },
      { branch: "Mechanical Engineering", cutoff: "Closing Rank 13,628" },
      { branch: "Civil Engineering", cutoff: "Closing Rank 27,257" },
    ],
    admissionSteps: [
      { step: "1", label: "JEE Main", sub: "Qualifying Entrance" },
      { step: "2", label: "JoSAA Counselling", sub: "Choice Registration" },
      { step: "3", label: "Seat Allotment", sub: "Verification" },
      { step: "4", label: "Admission Confirmation", sub: "Enrollment" },
    ],
    feeCards: [
      { type: "UG Programs", name: "B.Tech / B.Arch Program", duration: "Duration: 4-5 Years", amount: "₹6.43L", color: "from-blue-500/10 to-blue-500/20 text-blue-400 border-blue-500/20" },
      { type: "PG & Others Range", name: "M.Tech / MCA / MBA / MSc", duration: "Duration: 2-3 Years", amount: "₹1.08L - ₹7.88L", color: "from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20" }
    ],
    campusLife: {
      hostels: "22 Hostels (17 Boys, 5 Girls)",
      facilities: [
        "Central Library (Modern Resource)",
        "Spacious Hostels Rooms",
        "Sports Complex & Playgrounds",
        "Fully equipped Gymnasium",
        "Advanced Research & Engineering Labs",
        "High-speed WiFi Campus Network",
        "24/7 Health Center Care",
        "In-campus Banking & ATMs",
        "Multi-shop Shopping Complex",
      ],
      festivals: [
        {
          name: "Festember",
          type: "Cultural",
          description: "One of South India's largest student-run cultural festivals.",
        },
        {
          name: "Pragyan",
          type: "Technical",
          description: "Largest student-run technical festival in the country.",
        },
      ],
      activities: [
        "Spider Coding Club",
        "Robotics Association (RMI)",
        "Entrepreneurship Cell (E-Cell)",
        "Cultural Music and Drama societies",
        "Technical Branch Associations",
      ],
    },
    researchInnovation: {
      highlights: [
        "Advanced Core Engineering Research Facilities",
        "Industry-Sponsored Collaborative Research Projects",
        "State-sponsored Technology Development Schemes",
        "Incubation and startup enablement culture",
      ],
      incubatedStartups: "50+ startups successfully incubated through CEDI cell",
      focusAreas: [
        "IoT & Smart Sensors",
        "Renewable Energy Systems",
        "Advanced Materials Engineering",
        "Industrial Process Automation",
      ],
      incubatorName: "Center for Entrepreneurship Development and Incubation (CEDI)",
      incubatorDescription: "CEDI NIT Trichy facilitates the incubation of technological start-ups and provides access to mentoring, seed funding, and corporate networks."
    },
    scholarships: [
      {
        name: "Merit Scholarships",
        eligibility: "Top academic performers maintaining CGPA > 8.5.",
        benefits: "Cash grant of ₹50,000 per annum.",
      },
      {
        name: "Government Scholarships",
        eligibility: "Central Sector Scheme / state schemes based on quota categories.",
        benefits: "Covers complete tuition and boarding fees.",
      },
      {
        name: "SC/ST Scholarships",
        eligibility: "All registered SC/ST candidates under eligible income bounds.",
        benefits: "100% Tuition Fee Waiver.",
      },
      {
        name: "Minority Scholarships",
        eligibility: "Deserving students matching religious/linguistic minority guidelines.",
        benefits: "Up to ₹1.0 Lakh per annum to cover fees.",
      },
      {
        name: "Financial Assistance Programs",
        eligibility: "Students facing sudden household financial emergencies.",
        benefits: "Need-based partial tuition waivers and book allowances.",
      },
    ],
    scorecard: {
      academics: 9.8,
      placements: 9.7,
      research: 9.5,
      innovation: 9.4,
      infrastructure: 9.3,
      campusLife: 9.4,
      overall: 9.6,
    },
    faqs: [
      {
        question: "What is NIT Trichy ranking?",
        answer: "NIT Trichy is ranked #9 in Engineering and #30 Overall in India by the NIRF 2025. Globally, it sits in the #731-740 range in the QS World Rankings 2026.",
      },
      {
        question: "What is the CSE cutoff?",
        answer: "For round 1 in the JEE Main 2025, the closing cutoff rank for Computer Science Engineering (CSE) was 4,463.",
      },
      {
        question: "Is NIT Trichy government or private?",
        answer: "NIT Trichy is a public technical university funded by the Government of India and recognized as an Institute of National Importance.",
      },
      {
        question: "Which branch is best?",
        answer: "Computer Science (CSE), Electronics (ECE), and Electrical (EEE) are highly sought after due to their excellent placement records and high recruiter demand.",
      },
      {
        question: "How are placements?",
        answer: "Placements are outstanding. The highest package exceeds ₹52.89 LPA, with the average package for CSE standing at ₹27.2 LPA. Key recruiters include Google, Microsoft, Qualcomm, and Amazon.",
      },
      {
        question: "What is the campus size?",
        answer: "The campus spans an expansive 800 acres of land in Tiruchirappalli, Tamil Nadu, housing advanced sports, hostel, and academic facilities.",
      },
      {
        question: "What are the admission requirements?",
        answer: "Admission to B.Tech requires a valid JEE Main score and registering through JoSAA/CSAB counselling. Candidates must also have completed 10+2 with at least 75% marks.",
      },
      {
        question: "Which exams are accepted?",
        answer: "Exams accepted include: JEE Main (B.Tech), GATE (M.Tech), CAT (MBA), NIMCET (MCA), and JAM (M.Sc).",
      },
    ],
    qnas: [
      {
        question: "Why is NIT Trichy famous?",
        answer: "NIT Trichy is famous for its academic excellence, top national rankings among NITs, outstanding placements, and rich student activities hosted across its 800-acre campus.",
      },
      {
        question: "Which branch is best?",
        answer: "Computer Science Engineering (CSE), ECE, and EEE consistently lead in placements, showing the highest average packages and quick placement rates.",
      },
      {
        question: "Is NIT Trichy worth joining?",
        answer: "Absolutely. It is consistently rated as the top National Institute of Technology (NIT) in India, offering placement statistics and credentials competitive with top-tier IITs.",
      },
    ],
    aboutParagraphs: [
      "National Institute of Technology Tiruchirappalli (NIT Trichy) is one of India's oldest and most prestigious public technical universities, recognized as an Institute of National Importance.",
      "The university is renowned for its strong academic curriculum, state-of-the-art engineering laboratories, and robust research collaborations with public and private sector companies.",
      "NIT Trichy consistently ranks as the top National Institute of Technology (NIT) in India, attracting elite students from across the country.",
      "Spanning a massive 800 acres, the campus provides a highly vibrant environment with active student clubs, world-class sports facilities, and exceptional placements with top-tier global corporations."
    ],
    reviews: [
      {
        id: "rev-nitt-1",
        author: "Rohan Sharma",
        role: "B.Tech CSE Student",
        rating: 5,
        academics: 5,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 4.5,
        comment: "The coding culture at NIT Trichy is fantastic. Dynamic peer environment. Top recruiters visit every year and CEDI provides good mentorship for startup enthusiasts.",
        strengths: ["Excellent Faculty", "Coding Culture", "Strong Placements"],
        weaknesses: ["Hostel Amenities", "Academic Pressure"]
      },
      {
        id: "rev-nitt-2",
        author: "Divya Nair",
        role: "M.Tech Research Fellow",
        rating: 4,
        academics: 4.5,
        placements: 4,
        infrastructure: 4,
        campusLife: 4.5,
        research: 4.5,
        comment: "Very supportive research guide. The laboratories are well equipped. Pragyan and Festember make campus life unforgettable.",
        strengths: ["Research Labs", "Vibrant Campus Life"],
        weaknesses: ["Summer Heat"]
      }
    ],
  },
  "VIT Vellore": {
    shortName: "VIT Vellore",
    established: 1984,
    campusArea: "372 Acres",
    studentsCount: "70,000+",
    facultyCount: "1,800+",
    staffCount: "1,000+",
    theme: {
      brandColor: "#800020",
      brandAccent: "#c41e3a",
      brandText: "#f87171",
      glowClass: "bg-red-950/10"
    },
    nirfRankings: [
      { category: "Universities", rank: "#10" },
      { category: "Engineering", rank: "#11" },
      { category: "Overall", rank: "#19" },
    ],
    qsRankings: [
      { category: "Global", rank: "#791-800" },
      { category: "Asia", rank: "#150" },
    ],
    placementStats: {
      ugPlaced: 7450,
      pgPlaced: 1820,
      rate: "90%+",
      averagePackage: "₹9.5 LPA",
      highestPackage: "₹1.02 Crore",
      recruiters: [
        "Microsoft",
        "Google",
        "Amazon",
        "Adobe",
        "PayPal",
        "Qualcomm",
        "Intel",
        "Deloitte",
        "Accenture",
        "Infosys",
        "TCS",
      ],
      branchHighlights: [
        { branch: "Computer Science (CSE) Average", package: "₹14.5 LPA" },
        { branch: "AI & Data Science Average", package: "₹12.0 LPA" },
        { branch: "Electronics & Communication", package: "₹9.2 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science (CSE) Category 1", cutoff: "Closing Rank 1,500" },
      { branch: "AI & Data Science Category 1", cutoff: "Closing Rank 3,000" },
      { branch: "Information Technology Category 1", cutoff: "Closing Rank 4,500" },
      { branch: "Electronics Engineering Category 1", cutoff: "Closing Rank 7,500" },
      { branch: "Mechanical Engineering Category 1", cutoff: "Closing Rank 12,000" },
    ],
    admissionSteps: [
      { step: "1", label: "VITEEE", sub: "Entrance Exam" },
      { step: "2", label: "Rank List", sub: "Merit Generation" },
      { step: "3", label: "Counselling", sub: "Phase Selection" },
      { step: "4", label: "Branch & Category", sub: "Seat Allocation" },
      { step: "5", label: "Confirmation", sub: "Fee Payment" },
    ],
    feeCards: [
      { type: "Category 1 Tuition", name: "B.Tech Group A/B", duration: "Duration: 4 Years", amount: "₹1.98L", color: "from-blue-500/10 to-blue-500/20 text-blue-400 border-blue-500/20" },
      { type: "Category 2 Tuition", name: "B.Tech Group A/B", duration: "Duration: 4 Years", amount: "₹3.07L", color: "from-emerald-500/10 to-emerald-500/20 text-emerald-400 border-emerald-500/20" },
      { type: "Category 3 Tuition", name: "B.Tech Group A/B", duration: "Duration: 4 Years", amount: "₹4.05L", color: "from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20" },
    ],
    campusLife: {
      hostels: "24 Hostels (18 Boys, 6 Girls) - Highly Secured",
      facilities: [
        "Smart Classrooms",
        "Massive Central Library",
        "Advanced Research Labs",
        "Innovation & Tech Centers",
        "Outdoor Sports Complex",
        "Indoor AC Sports Stadium",
        "On-campus Medical Center",
        "Multi-cuisine Cafeterias",
        "Shopping Areas & ATMs",
      ],
      festivals: [
        {
          name: "Riviera",
          type: "Cultural",
          description: "International cultural and sports carnival, attracting 40,000+ students globally.",
        },
        {
          name: "Gravitas",
          type: "Technical",
          description: "Annual technical festival featuring international hackathons and drone racing.",
        },
      ],
      activities: [
        "Android/Web Coding Clubs",
        "Robotics Association (RMI)",
        "E-Cell Startup Club",
        "Drama & Music Societies",
        "International Student Associations",
      ],
    },
    researchInnovation: {
      highlights: [
        "1500+ Patents Filed & Registered",
        "200+ Active Collaborative Research Projects",
        "Govt-sponsored Advanced Research Hubs",
        "State-of-the-art incubation facilities",
      ],
      incubatedStartups: "100+ active startups supported by VITTBI cell",
      focusAreas: [
        "Biomedical Technology",
        "IoT & Smart Sensors",
        "Renewable Energy Hub",
        "Artificial Intelligence & ML",
        "Automotive Engineering",
      ],
      incubatorName: "VIT Technology Business Incubator (VITTBI)",
      incubatorDescription: "VITTBI provides infrastructure, seed funding, and business mentoring to student and faculty startups in ICT, biotech, and engineering sectors."
    },
    scholarships: [
      {
        name: "GV School Development Program (GVSDP)",
        eligibility: "State/District Board Toppers & Top rankers in VITEEE.",
        benefits: "100% Tuition Fee Waiver + free hostel accommodation.",
      },
      {
        name: "VITEEE Merit Scholarship",
        eligibility: "VITEEE ranks 1 to 1000.",
        benefits: "Up to 75% Tuition Fee Waiver for B.Tech.",
      },
      {
        name: "Financial Assistance Program",
        eligibility: "Students with parent income < ₹3.5 LPA demonstrating need.",
        benefits: "Partial tuition fee waiver of 25% to 50%.",
      },
      {
        name: "SC/ST Central Government Scheme",
        eligibility: "Registered SC/ST candidates meeting federal guidelines.",
        benefits: "Full reimbursement of fees.",
      },
      {
        name: "Endowment Awards",
        eligibility: "Deserving students based on specialized academic parameters.",
        benefits: "One-off cash grants and gold medals.",
      },
    ],
    scorecard: {
      academics: 9.3,
      placements: 9.6,
      research: 9.0,
      innovation: 9.7,
      campusLife: 9.2,
      infrastructure: 9.6,
      overall: 9.4,
    },
    faqs: [
      {
        question: "What is VIT Vellore ranking?",
        answer: "VIT Vellore is ranked #11 in Engineering, #10 in Universities, and #19 Overall in India by the NIRF 2025. It is also QS globally ranked.",
      },
      {
        question: "Does VIT accept JEE Main?",
        answer: "No, VIT Vellore does not use JEE Main for B.Tech admissions. B.Tech admissions are based solely on merit in the VITEEE entrance exam.",
      },
      {
        question: "How good are placements?",
        answer: "VIT has exceptional placements. In the recent cycle, over 1000 recruiters visited campus, offering packages up to ₹1.02 Crore. The B.Tech CSE average package stands at ₹14.5 LPA.",
      },
      {
        question: "What is VITEEE?",
        answer: "VITEEE is the Vellore Institute of Technology Engineering Entrance Examination, conducted annually online for B.Tech admissions across campuses.",
      },
      {
        question: "Is hostel compulsory?",
        answer: "Hostel is not strictly compulsory for local residents of Vellore, but highly recommended for others to experience the large residential smart campus life.",
      },
      {
        question: "What are the fee categories?",
        answer: "VIT has a Category 1 to 5 pricing system. Based on VITEEE ranks and choice preferences, candidates are allocated Category 1 (lowest fees) to Category 5 (highest fees) seats.",
      },
      {
        question: "Is VIT worth joining?",
        answer: "Yes. VIT is widely considered among India's strongest private engineering institutions, boasting excellent placements, research resources, and international partnerships.",
      },
      {
        question: "What scholarships are available?",
        answer: "Scholarships include the GVSDP (100% waiver for state/district board toppers), VITEEE ranks merit awards (up to 75% waivers), and need-based financial assistance.",
      },
    ],
    qnas: [
      {
        question: "What is VIT famous for?",
        answer: "Placements, modern infrastructure, industry exposure, and global opportunities.",
      },
      {
        question: "Is VIT better than many private colleges?",
        answer: "Yes. VIT is widely considered among India's strongest private engineering institutions.",
      },
      {
        question: "Why do students choose VIT?",
        answer: "Strong placements, large recruiter network, research opportunities, and international exposure.",
      },
    ],
    aboutParagraphs: [
      "Vellore Institute of Technology (VIT) is one of India's leading private engineering and technology universities, recognized as a Deemed University with NAAC A++ accreditation.",
      "Known for its strong placement ecosystem, extensive industry collaborations, international exposure, and modern smart campus infrastructure, VIT consistently ranks among top universities.",
      "VIT has built a formidable reputation for producing highly employable graduates, attracting over 1,000 top recruiters from India and abroad every year.",
      "The massive residential campus in Vellore features smart classrooms, extensive research labs, innovation hubs, and a multicultural community representing over 100 countries."
    ],
    reviews: [
      {
        id: "rev-vit-1",
        author: "Siddharth Goel",
        role: "B.Tech CSE (AI) Student",
        rating: 5,
        academics: 5,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 4,
        comment: "Excellent Placements and opportunities. The coding culture is extremely strong with frequent hackathons. Huge global exposure and state-of-the-art facilities.",
        strengths: ["Excellent Placements", "Strong Coding Culture", "Modern Infrastructure"],
        weaknesses: ["Large Student Population", "Competitive Environment"]
      },
      {
        id: "rev-vit-2",
        author: "Anjali Mehta",
        role: "B.Tech Biotech Alumna",
        rating: 4,
        academics: 4.5,
        placements: 4.5,
        infrastructure: 5,
        campusLife: 4,
        research: 4.5,
        comment: "Great research labs and supportive professors. The campus life is amazing, but it can feel quite crowded during peak hours. Placements are solid if you maintain a high CGPA.",
        strengths: ["Modern Labs", "International Exposure"],
        weaknesses: ["Category-Based Fees", "Crowded Campus"]
      }
    ],
  },
  "Anna University": {
    shortName: "AU",
    established: 1978,
    campusArea: "189 Acres",
    studentsCount: "5,00,000+ (Network)",
    facultyCount: "1,000+ Researchers",
    staffCount: "500+",
    theme: {
      brandColor: "#7B1C1C",
      brandAccent: "#C9A84C",
      brandText: "#f59e0b",
      glowClass: "bg-amber-950/10"
    },
    nirfRankings: [
      { category: "Engineering", rank: "Top 15-20" },
      { category: "University", rank: "Top 20" },
      { category: "Research", rank: "Nationally Recognized" },
      { category: "Affiliated Colleges", rank: "500+" },
    ],
    qsRankings: [
      { category: "Int'l Collaborations", rank: "Active" },
      { category: "Research Output", rank: "High" },
      { category: "Industry Tie-ups", rank: "250+" },
      { category: "Govt. Recognition", rank: "A++ NAAC" },
    ],
    placementStats: {
      ugPlaced: 4200,
      pgPlaced: 1100,
      rate: "75%+",
      averagePackage: "₹6 LPA",
      highestPackage: "₹30+ LPA",
      recruiters: [
        "TCS",
        "Infosys",
        "Wipro",
        "Accenture",
        "Cognizant",
        "Amazon",
        "Zoho",
        "HCL",
        "Capgemini",
        "IBM",
      ],
      branchHighlights: [
        { branch: "Computer Science (CSE) Average", package: "₹8.5 LPA" },
        { branch: "Electronics & Communication Average", package: "₹6.2 LPA" },
        { branch: "Information Technology Average", package: "₹7.8 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science Engineering (CSE)", cutoff: "Cutoff: 197+ / 200" },
      { branch: "Information Technology (IT)", cutoff: "Cutoff: 196+ / 200" },
      { branch: "AI & Data Science (AI & DS)", cutoff: "Cutoff: 195+ / 200" },
      { branch: "Electronics & Communication (ECE)", cutoff: "Cutoff: 193+ / 200" },
      { branch: "Electrical Engineering (EEE)", cutoff: "Cutoff: 191+ / 200" },
      { branch: "Mechanical Engineering", cutoff: "Cutoff: 188+ / 200" },
    ],
    admissionSteps: [
      { step: "1", label: "Class 12", sub: "Completion" },
      { step: "2", label: "TNEA Portal", sub: "Registration" },
      { step: "3", label: "Rank Generation", sub: "Merit-Based" },
      { step: "4", label: "Choice Filling", sub: "Branch & College" },
      { step: "5", label: "Seat Allotment", sub: "Confirmation" },
    ],
    feeCards: [
      { type: "B.E. / B.Tech", name: "Undergraduate Engineering", duration: "Duration: 4 Years", amount: "₹50K–₹80K", color: "from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20" },
      { type: "PG Programs", name: "M.E. / M.Tech / MBA / MCA", duration: "Duration: 2 Years", amount: "₹60K–₹1L", color: "from-orange-500/10 to-orange-500/20 text-orange-400 border-orange-500/20" },
      { type: "Research", name: "Ph.D. / Research Programs", duration: "Duration: 3–5 Years", amount: "Fellowship Funded", color: "from-rose-500/10 to-rose-500/20 text-rose-400 border-rose-500/20" },
    ],
    campusLife: {
      hostels: "Separate Hostels for Men & Women on Campus",
      facilities: [
        "Central Library (Vast Collection)",
        "Advanced Research Laboratories",
        "Innovation Centers",
        "Sports Complex & Playgrounds",
        "Medical Center & Healthcare",
        "High-speed WiFi Campus",
        "Auditoriums & Seminar Halls",
        "Multi-cuisine Canteens",
      ],
      festivals: [
        {
          name: "Techofes",
          type: "Technical",
          description: "Anna University's prestigious technical symposium attracting participants from across South India.",
        },
        {
          name: "Kurukshetra",
          type: "Technical & Cultural",
          description: "Asia's largest university-level technical symposium with over 35,000 participants annually.",
        },
      ],
      activities: [
        "Coding & Competitive Programming Clubs",
        "Robotics & AI Research Groups",
        "Entrepreneurship Cell (E-Cell)",
        "Cultural Associations & Music Clubs",
        "NSS / NCC Chapters",
        "Sports Teams (State & National Competitions)",
      ],
    },
    researchInnovation: {
      highlights: [
        "Centre for Artificial Intelligence & Research Computing",
        "Anna University Transportation Engineering Research Hub",
        "Smart Cities & Urban Mobility Research Centre",
        "Renewable Energy & Sustainable Engineering Projects",
        "National Science Foundation (DST) Funded Projects",
        "Active collaboration with DRDO, ISRO & national labs",
      ],
      incubatedStartups: "100+ startups supported through AU-KBC Research Centre",
      focusAreas: [
        "Artificial Intelligence & Deep Learning",
        "Smart City & Transportation Systems",
        "Renewable Energy & Clean Tech",
        "Biomedical & Healthcare Engineering",
        "Aerospace & Defence Research",
      ],
      incubatorName: "AU-KBC Research Centre",
      incubatorDescription: "The Anna University–KBC Research Centre is a pioneering technology incubation hub, facilitating innovation in AI, IoT, and engineering with industry and government partnerships."
    },
    scholarships: [
      {
        name: "First Graduate Scholarship",
        eligibility: "Students who are the first graduates in their family.",
        benefits: "₹10,000 – ₹25,000 per annum to support educational expenses.",
      },
      {
        name: "BC / MBC Community Scholarship",
        eligibility: "Students from Backward Classes and Most Backward Classes meeting income criteria.",
        benefits: "Full or partial tuition fee reimbursement from Tamil Nadu Government.",
      },
      {
        name: "SC / ST Government Scholarship",
        eligibility: "All registered SC/ST candidates meeting Tamil Nadu eligibility criteria.",
        benefits: "100% Tuition Fee Reimbursement + ₹1,200/month maintenance allowance.",
      },
      {
        name: "Merit Scholarship (University Toppers)",
        eligibility: "Top-ranking students in semester examinations (CGPA ≥ 9.0).",
        benefits: "Cash awards and certificate recognition from Anna University.",
      },
      {
        name: "Tamil Nadu Government Financial Assistance",
        eligibility: "Students with annual family income less than ₹2.5 LPA.",
        benefits: "Covers tuition, examination fees, and a monthly book allowance.",
      },
    ],
    scorecard: {
      academics: 9.4,
      placements: 8.8,
      research: 9.1,
      innovation: 9.5,
      campusLife: 9.0,
      infrastructure: 9.0,
      overall: 9.2,
    },
    faqs: [
      {
        question: "What is Anna University famous for?",
        answer: "Anna University is famous for being Tamil Nadu's premier public engineering university. It oversees 500+ affiliated colleges and has produced thousands of engineers, scientists, and entrepreneurs who lead major organizations globally. Its Guindy campus is historically prestigious.",
      },
      {
        question: "How does TNEA counselling work?",
        answer: "TNEA (Tamil Nadu Engineering Admissions) is a centralized counselling process. Students register on the TNEA portal after Class 12 results. A merit rank is generated based on 12th Board marks (PCM/PCB weighted). Students fill choices and seats are allotted in rounds based on rank.",
      },
      {
        question: "What are the top branches at Anna University?",
        answer: "Computer Science Engineering (CSE), Information Technology (IT), AI & Data Science (AI & DS), and Electronics & Communication Engineering (ECE) are the most sought-after branches at Anna University's constituent colleges and its affiliated network.",
      },
      {
        question: "How are placements at Anna University?",
        answer: "Placements are solid, especially for top branches. The average package hovers around ₹6 LPA while highest offers exceed ₹30 LPA. Major recruiters include TCS, Infosys, Wipro, Zoho, HCL, IBM, and Cognizant. Anna University's brand name carries significant weight across South India.",
      },
      {
        question: "Is Anna University a government or private institution?",
        answer: "Anna University is a fully government-funded public state technical university. It is one of the largest public technical universities in India, governed by the Tamil Nadu Government and recognized by NAAC with A++ accreditation.",
      },
      {
        question: "What scholarships are available?",
        answer: "Multiple scholarships are available through the Tamil Nadu Government: SC/ST tuition reimbursements, BC/MBC community grants, First Graduate scholarships, and merit-based cash awards. Most government-aided colleges in Anna University's network have near-zero fees for eligible students.",
      },
      {
        question: "What is the fee structure?",
        answer: "Tuition fees at Anna University's constituent colleges range from ₹50,000 to ₹80,000 per year for B.E./B.Tech programs. This is significantly lower than most private universities. MBA programs range from ₹60,000 to ₹1,00,000 per year. Affiliated colleges may differ.",
      },
      {
        question: "Which entrance exams are accepted?",
        answer: "For B.E./B.Tech (UG): TNEA merit-based counselling (no separate entrance exam — Class 12 marks determine rank). For PG programs: GATE (M.Tech / M.E.), TANCET (state-level PG entrance), and CEETA PG. For MBA: MAT / CAT / TANCET.",
      },
    ],
    qnas: [
      {
        question: "Why is Anna University popular?",
        answer: "Anna University is the academic backbone of engineering education in Tamil Nadu. Its strong academic reputation, affordability, vast network of 500+ affiliated engineering colleges, NAAC A++ accreditation, and large alumni base make it one of the most trusted names in South Indian higher education.",
      },
      {
        question: "Is Anna University good for Computer Science?",
        answer: "Yes. CSE, IT, and AI-related programs at Anna University's constituent colleges (MIT, CEG, SAP) and affiliated institutions are among the most competitive and sought-after programs in South India. CSE graduates from Anna University are well-regarded by top tech companies.",
      },
      {
        question: "Is Anna University worth joining?",
        answer: "Absolutely. Anna University remains one of South India's strongest public technical universities. For students seeking quality engineering education at an affordable cost with government recognition and a trusted brand name, Anna University is an excellent choice.",
      },
    ],
    aboutParagraphs: [
      "Anna University is one of India's most respected public technical universities and serves as the academic backbone of engineering education in Tamil Nadu.",
      "Established in 1978 and headquartered in the historic Guindy campus in Chennai, Anna University oversees hundreds of affiliated colleges while maintaining world-class constituent campuses like College of Engineering Guindy (CEG), Madras Institute of Technology (MIT), and School of Architecture and Planning.",
      "The university is recognized by NAAC with A++ accreditation and is known for its engineering excellence, research output, industry collaboration, vast alumni network, and strong government recognition.",
      "Anna University has produced thousands of engineers, entrepreneurs, researchers, and technology leaders who work across the globe, making it a cornerstone of South India's technological progress."
    ],
    reviews: [
      {
        id: "rev-au-1",
        author: "Priya Subramaniam",
        role: "B.E. CSE Student, CEG Campus",
        rating: 5,
        academics: 5,
        placements: 4,
        infrastructure: 4,
        campusLife: 5,
        research: 5,
        comment: "The quality of education at Anna University's main campus is exceptional. The faculty are experienced and supportive. Being a government institution, the affordability is unmatched. The peer competition is extremely high, which pushes you to excel.",
        strengths: ["Affordable Education", "Strong Academic Brand", "Experienced Faculty", "Government Recognition"],
        weaknesses: ["Large Student Population", "Infrastructure Varies Across Campuses"]
      },
      {
        id: "rev-au-2",
        author: "Karthik Ramesh",
        role: "M.E. Research Scholar",
        rating: 4,
        academics: 5,
        placements: 4,
        infrastructure: 4,
        campusLife: 4,
        research: 5,
        comment: "Excellent research facilities and guidance from professors actively working in cutting-edge domains. The AU-KBC Research Centre is a great place to work on real-world engineering problems. Kurukshetra and Techofes festivals are highlights of campus life.",
        strengths: ["Research Opportunities", "Strong Alumni Network", "Affordable Fees"],
        weaknesses: ["Competitive Admissions", "Administrative Processes"]
      }
    ],
  },
  "SRM Institute of Science and Technology": {
    shortName: "SRMIST",
    established: 1985,
    campusArea: "250+ Acres",
    studentsCount: "50,000+",
    facultyCount: "3,500+",
    staffCount: "2,000+",
    theme: {
      brandColor: "#1D4ED8",
      brandAccent: "#F59E0B",
      brandText: "#93C5FD",
      glowClass: "bg-blue-950/10"
    },
    nirfRankings: [
      { category: "Engineering", rank: "Top 15-20" },
      { category: "University", rank: "Top 15-20" },
      { category: "Innovation", rank: "Nationally Recognized" },
      { category: "Affiliated Programs", rank: "450+" },
    ],
    qsRankings: [
      { category: "Int'l Collaborations", rank: "50+ Countries" },
      { category: "Student Diversity", rank: "International" },
      { category: "Industry Tie-ups", rank: "1000+" },
      { category: "Accreditation", rank: "NAAC A++" },
    ],
    placementStats: {
      ugPlaced: 15000,
      pgPlaced: 3000,
      rate: "92%+",
      averagePackage: "₹7–10 LPA",
      highestPackage: "₹50+ LPA",
      recruiters: [
        "Amazon",
        "Microsoft",
        "Google",
        "TCS",
        "Infosys",
        "Cognizant",
        "Accenture",
        "Capgemini",
        "Zoho",
        "HCL",
        "Deloitte",
        "Wipro",
      ],
      branchHighlights: [
        { branch: "Computer Science Engineering Average", package: "₹10.5 LPA" },
        { branch: "AI & Machine Learning Average", package: "₹12 LPA" },
        { branch: "Electronics & Communication Average", package: "₹7.5 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science Engineering (CSE)", cutoff: "SRMJEEE Rank: Top 5,000" },
      { branch: "AI & Machine Learning (AI & ML)", cutoff: "SRMJEEE Rank: Top 3,000" },
      { branch: "Data Science", cutoff: "SRMJEEE Rank: Top 4,000" },
      { branch: "Information Technology (IT)", cutoff: "SRMJEEE Rank: Top 8,000" },
      { branch: "Cyber Security", cutoff: "SRMJEEE Rank: Top 6,000" },
      { branch: "Electronics & Communication (ECE)", cutoff: "SRMJEEE Rank: Top 12,000" },
    ],
    admissionSteps: [
      { step: "1", label: "Apply Online", sub: "srmist.edu.in" },
      { step: "2", label: "SRMJEEE Exam", sub: "Online CBT" },
      { step: "3", label: "Rank Card", sub: "Result" },
      { step: "4", label: "Counseling", sub: "Choice Filling" },
      { step: "5", label: "Seat Allotment", sub: "Confirmation" },
    ],
    feeCards: [
      { type: "B.Tech", name: "Undergraduate Engineering", duration: "Duration: 4 Years", amount: "₹2.5L–₹5L / yr", color: "from-blue-500/10 to-blue-500/20 text-blue-400 border-blue-500/20" },
      { type: "MBA / MCA", name: "Postgraduate Programs", duration: "Duration: 2 Years", amount: "₹3L–₹6L / yr", color: "from-amber-500/10 to-amber-500/20 text-amber-400 border-amber-500/20" },
      { type: "Research", name: "Ph.D. / Research Programs", duration: "Duration: 3–5 Years", amount: "Fellowship + Stipend", color: "from-indigo-500/10 to-indigo-500/20 text-indigo-400 border-indigo-500/20" },
    ],
    campusLife: {
      hostels: "Fully Residential Smart Hostels (AC & Non-AC for Men & Women)",
      facilities: [
        "Smart Classrooms & e-Learning Centers",
        "Central Library with Digital Archives",
        "Innovation & Research Labs",
        "Startup Incubation Center (SRM Incubator)",
        "Sports Complex & Olympic-Grade Facilities",
        "Medical Center & Hospital on Campus",
        "High-Speed Fiber Optic Network",
        "Shopping Center & Banking on Campus",
      ],
      festivals: [
        {
          name: "Aaruush",
          type: "Technical",
          description: "One of Asia's largest student-run technical fests, attracting 50,000+ participants from across India and abroad.",
        },
        {
          name: "Milan",
          type: "Cultural",
          description: "SRM's flagship cultural extravaganza featuring music, dance, fashion shows, and celebrity performances.",
        },
      ],
      activities: [
        "Coding & Competitive Programming Clubs",
        "AI & Robotics Research Groups",
        "Entrepreneurship & E-Cell",
        "Cultural & Music Associations",
        "NSS / NCC Chapters",
        "Sports Teams (National & International Competitions)",
      ],
    },
    researchInnovation: {
      highlights: [
        "SRM Research Institute (SRMRI) — Dedicated Research Hub",
        "Centre for Artificial Intelligence & Deep Learning Research",
        "Cyber Security & Blockchain Research Centre",
        "Renewable Energy & Green Technology Projects",
        "Biomedical & Healthcare Engineering Innovation",
        "International Research Collaborations (MIT, NUS, Cambridge Partners)",
      ],
      incubatedStartups: "100+ startups incubated at SRM TBI (Technology Business Incubator)",
      focusAreas: [
        "Artificial Intelligence & Machine Learning",
        "Cyber Security & Blockchain",
        "Robotics & Automation",
        "Renewable Energy",
        "Biomedical Engineering",
        "Smart Cities & IoT",
      ],
      incubatorName: "SRM Technology Business Incubator (TBI)",
      incubatorDescription: "The SRM TBI supports early-stage startups with mentorship, funding connections, and state-of-the-art lab access, fostering an innovation ecosystem in South India."
    },
    scholarships: [
      {
        name: "SRMJEEE Rank Scholarship",
        eligibility: "Students scoring in the top ranks of SRMJEEE (Rank 1–100).",
        benefits: "Up to 100% Tuition Fee Waiver for top rankers; 50% waiver for Rank 101–500.",
      },
      {
        name: "Merit Scholarship (Academic Excellence)",
        eligibility: "Students with CGPA ≥ 9.0 in semester examinations.",
        benefits: "₹50,000 – ₹1,00,000 per year cash scholarship and certificate recognition.",
      },
      {
        name: "Founder's Scholarship",
        eligibility: "Outstanding students demonstrating all-round excellence in academics and leadership.",
        benefits: "Full tuition waiver + mentoring by SRM leadership.",
      },
      {
        name: "Sports Scholarship",
        eligibility: "National/State-level athletes and sports achievers.",
        benefits: "Fee concession up to 50% + dedicated sports coaching and facilities.",
      },
      {
        name: "International Student Scholarship",
        eligibility: "Students from partner countries and international applicants.",
        benefits: "Special fee concessions and dedicated support services for global students.",
      },
    ],
    scorecard: {
      academics: 9.1,
      placements: 9.3,
      research: 8.9,
      innovation: 9.5,
      campusLife: 9.7,
      infrastructure: 9.8,
      overall: 9.4,
    },
    faqs: [
      {
        question: "What is SRMJEEE?",
        answer: "SRMJEEE (SRM Joint Engineering Entrance Examination) is the university-level entrance exam conducted by SRM IST for admission to B.Tech programs. It is an online computer-based test covering Physics, Chemistry, and Mathematics/Biology.",
      },
      {
        question: "Is SRM good for CSE?",
        answer: "Yes. SRM IST is one of the top private universities for Computer Science Engineering in India. The CSE, AI & ML, and Data Science programs are highly popular with excellent placement records. Average packages for CSE graduates exceed ₹10 LPA.",
      },
      {
        question: "How are placements at SRM?",
        answer: "Placements at SRM IST are excellent. The university records 92%+ placement rates with an average package of ₹7–10 LPA. Top recruiters include Amazon, Microsoft, Google, TCS, and Zoho. Highest packages have crossed ₹50 LPA.",
      },
      {
        question: "What scholarships are available at SRM?",
        answer: "SRM IST offers SRMJEEE Rank Scholarships (up to 100% fee waiver for top rankers), Merit Scholarships for academic excellence, Founder's Scholarships, Sports Scholarships, and special International Student Scholarships.",
      },
      {
        question: "What is the fee structure at SRM IST?",
        answer: "B.Tech tuition fees range from ₹2.5L to ₹5L per year depending on the branch. MBA/MCA fees range from ₹3L to ₹6L per year. Scholarship holders get significant reductions. Total 4-year B.Tech investment ranges from ₹10L to ₹20L.",
      },
      {
        question: "Can students get international opportunities at SRM?",
        answer: "Yes. SRM IST has active collaborations with institutions in the USA, UK, Germany, Canada, Australia, and Singapore. Students can participate in semester abroad programs, joint research projects, international internships, and dual degree options.",
      },
    ],
    qnas: [
      {
        question: "Is SRM worth joining?",
        answer: "Yes. SRM IST offers strong placements, modern infrastructure, excellent industry exposure, and a highly vibrant campus life. With 1000+ recruiters, international collaborations, and top research labs, it is one of India's most preferred private engineering universities.",
      },
      {
        question: "Which branch is most popular at SRM?",
        answer: "Computer Science Engineering, AI & Machine Learning, Data Science, and Information Technology are among the most demanded programs at SRM IST. These branches also have the highest placement rates and salary packages.",
      },
      {
        question: "How is campus life at SRM IST?",
        answer: "SRM has one of India's most vibrant student communities. Aaruush (one of Asia's largest tech fests) and Milan (flagship cultural fest) attract tens of thousands of participants. The campus has world-class sports facilities, a startup incubator, and numerous active student clubs.",
      },
    ],
    aboutParagraphs: [
      "SRM Institute of Science and Technology (SRMIST) is one of India's leading private deemed-to-be universities, consistently ranked among the top 15-20 engineering universities in India.",
      "Established in 1985 and located at Kattankulathur, Chennai, SRMIST has grown into a global education hub attracting students from across India and over 50 countries, offering programs in engineering, technology, management, medicine, and research.",
      "The university is recognized by NAAC with A++ accreditation and is known for its world-class infrastructure, strong industry partnerships with 1000+ recruiters, cutting-edge research labs, and a highly active student community.",
      "SRM IST's commitment to innovation is reflected in its state-of-the-art research centers, the SRM Technology Business Incubator, international research collaborations, and consistently strong placement outcomes that make it one of the most preferred destinations for engineering education in South India."
    ],
    reviews: [
      {
        id: "rev-srm-1",
        author: "Arjun Krishnamurthy",
        role: "B.Tech CSE (AI & ML) Student",
        rating: 5,
        academics: 5,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 4,
        comment: "SRM is an incredible place. The infrastructure is world-class — our labs have cutting-edge AI workstations and the Smart Classroom experience is unmatched. Aaruush is the highlight of the year. Placements are very strong for CSE and AI branches with Amazon, Google recruiters visiting regularly.",
        strengths: ["World-class Infrastructure", "Strong Placements", "Vibrant Campus Life", "International Exposure"],
        weaknesses: ["High Fee Structure", "Very Large Student Population"]
      },
      {
        id: "rev-srm-2",
        author: "Meenakshi Venkataraman",
        role: "M.Tech Graduate, Placed at Microsoft",
        rating: 4,
        academics: 4,
        placements: 5,
        infrastructure: 5,
        campusLife: 5,
        research: 4,
        comment: "The placement cell at SRM is exceptional. I was placed at Microsoft through campus recruitment. The industry readiness training, hackathons, and certification programs really prepare you well. The campus itself is like a mini-city with everything you need.",
        strengths: ["Excellent Placement Cell", "Industry Certifications", "Campus Facilities", "Faculty Quality"],
        weaknesses: ["Competitive Environment", "Higher Fees Than Government Colleges"]
      }
    ],
  },
  "Sathyabama Institute of Science and Technology": {
    shortName: "SIST",
    established: 1987,
    campusArea: "140+ Acres",
    studentsCount: "15,000+",
    facultyCount: "1,000+",
    staffCount: "500+",
    theme: {
      brandColor: "#B91C1C",
      brandAccent: "#1E3A5F",
      brandText: "#FCA5A5",
      glowClass: "bg-red-950/10"
    },
    nirfRankings: [
      { category: "Engineering", rank: "Top 60–70" },
      { category: "University", rank: "Top 50–60" },
      { category: "Research", rank: "Nationally Recognized" },
      { category: "Innovation", rank: "Industry-Oriented" },
    ],
    qsRankings: [
      { category: "Research Output", rank: "Active" },
      { category: "Industry Tie-ups", rank: "300+" },
      { category: "Accreditation", rank: "NAAC A++" },
      { category: "Int'l Collaborations", rank: "Active" },
    ],
    placementStats: {
      ugPlaced: 3500,
      pgPlaced: 600,
      rate: "80%+",
      averagePackage: "₹5–7 LPA",
      highestPackage: "₹40+ LPA",
      recruiters: [
        "Amazon",
        "TCS",
        "Infosys",
        "Cognizant",
        "Accenture",
        "Capgemini",
        "HCL",
        "Wipro",
        "Deloitte",
        "Zoho",
        "Tech Mahindra",
        "IBM",
      ],
      branchHighlights: [
        { branch: "Computer Science Engineering Average", package: "₹7 LPA" },
        { branch: "AI & Data Science Average", package: "₹8 LPA" },
        { branch: "Aerospace Engineering Average", package: "₹6.5 LPA" },
      ],
    },
    cutoffInsights: [
      { branch: "Computer Science Engineering (CSE)", cutoff: "Merit + TNEA Rank: Top 20,000" },
      { branch: "AI & Data Science (AI & DS)", cutoff: "Merit + TNEA Rank: Top 22,000" },
      { branch: "AI & Machine Learning (AI & ML)", cutoff: "Merit + TNEA Rank: Top 25,000" },
      { branch: "Cyber Security", cutoff: "Merit + TNEA Rank: Top 28,000" },
      { branch: "Information Technology (IT)", cutoff: "Merit + TNEA Rank: Top 30,000" },
      { branch: "Aerospace Engineering", cutoff: "Merit + TNEA Rank: Top 35,000" },
    ],
    admissionSteps: [
      { step: "1", label: "Apply Online", sub: "University Portal" },
      { step: "2", label: "Eligibility Check", sub: "12th Marks" },
      { step: "3", label: "Merit Selection", sub: "Board Score" },
      { step: "4", label: "Counseling", sub: "Branch Choice" },
      { step: "5", label: "Confirmation", sub: "Fee Payment" },
    ],
    feeCards: [
      { type: "B.E. / B.Tech", name: "Undergraduate Engineering", duration: "Duration: 4 Years", amount: "₹1.5L–₹2.5L / yr", color: "from-red-500/10 to-red-500/20 text-red-400 border-red-500/20" },
      { type: "MBA / MCA", name: "Postgraduate Programs", duration: "Duration: 2 Years", amount: "₹1.5L–₹3L / yr", color: "from-blue-500/10 to-blue-500/20 text-blue-400 border-blue-500/20" },
      { type: "Research", name: "Ph.D. / M.Phil. Programs", duration: "Duration: 3–5 Years", amount: "Fellowship Supported", color: "from-purple-500/10 to-purple-500/20 text-purple-400 border-purple-500/20" },
    ],
    campusLife: {
      hostels: "Separate Residential Hostels for Men & Women on Campus",
      facilities: [
        "Smart Classrooms & Digital Learning Centers",
        "Central Library & Digital Resources",
        "Advanced Research & Project Laboratories",
        "Innovation Hub & Entrepreneurship Center",
        "Sports Complex & Athletic Facilities",
        "Medical Center & Healthcare",
        "Auditorium & Seminar Halls",
        "Multi-cuisine Cafeterias",
      ],
      festivals: [
        {
          name: "Sathyabama Fest",
          type: "Cultural & Technical",
          description: "Sathyabama's annual flagship event combining technical innovation, cultural performances, and inter-college competitions.",
        },
        {
          name: "Technical Symposiums",
          type: "Technical",
          description: "Department-level technical symposiums and paper presentation events drawing participants from across Tamil Nadu.",
        },
      ],
      activities: [
        "Coding & Competitive Programming Clubs",
        "Robotics & Automation Clubs",
        "Entrepreneurship Cell (E-Cell)",
        "Photography & Media Clubs",
        "Cultural & Literary Associations",
        "Sports Teams (State & National Competitions)",
      ],
    },
    researchInnovation: {
      highlights: [
        "Government-Funded Research Projects (DST, DBT, DRDO)",
        "Centre for AI & Data Science Research",
        "Aerospace & Aeronautical Engineering Research Hub",
        "Renewable Energy & Sustainability Research",
        "Biotechnology & Life Sciences Research Centre",
        "International Research Collaborations & Joint Publications",
      ],
      incubatedStartups: "50+ student startups supported through the Innovation & Entrepreneurship Cell",
      focusAreas: [
        "Artificial Intelligence & Data Science",
        "Aerospace & Aeronautical Engineering",
        "Renewable Energy & Clean Tech",
        "Robotics & Automation",
        "Cyber Security",
        "Biotechnology & Life Sciences",
      ],
      incubatorName: "Sathyabama Innovation & Entrepreneurship Cell",
      incubatorDescription: "The Sathyabama Innovation Cell supports student entrepreneurs and researchers with lab access, mentorship, seed funding connections, and startup development programs."
    },
    scholarships: [
      {
        name: "Merit Scholarship",
        eligibility: "Students with outstanding 10th and 12th academic records (90%+ marks).",
        benefits: "Tuition fee concession of ₹25,000 – ₹50,000 per year based on academic merit.",
      },
      {
        name: "Academic Excellence Award",
        eligibility: "Top-performing students in semester examinations (CGPA ≥ 9.0).",
        benefits: "Cash awards and certificate recognition from the university leadership.",
      },
      {
        name: "Sports Scholarship",
        eligibility: "State/National level athletes and sports achievers.",
        benefits: "Fee concession and dedicated sports training support.",
      },
      {
        name: "Special Category Scholarship",
        eligibility: "Students from economically weaker sections meeting university eligibility criteria.",
        benefits: "Fee reduction and government scholarship linkages facilitated by the university.",
      },
      {
        name: "Research Fellowship",
        eligibility: "Outstanding PG and PhD scholars pursuing research in priority areas.",
        benefits: "Monthly stipend + lab access + research travel support.",
      },
    ],
    scorecard: {
      academics: 8.9,
      placements: 8.8,
      research: 8.6,
      innovation: 8.8,
      campusLife: 9.1,
      infrastructure: 9.4,
      overall: 8.9,
    },
    faqs: [
      {
        question: "Is Sathyabama good for CSE?",
        answer: "Yes. Sathyabama IST offers excellent CSE, AI & Data Science, AI & ML, and Cyber Security programs with strong faculty, modern labs, and active placement support. CSE and AI-related branches consistently achieve good placement outcomes with average packages of ₹5–8 LPA.",
      },
      {
        question: "How are placements at Sathyabama?",
        answer: "Placements are solid with 300+ recruiting companies visiting campus regularly. Average packages range from ₹5–7 LPA with the highest offers exceeding ₹40 LPA. Major recruiters include Amazon, TCS, Infosys, Cognizant, HCL, Zoho, and Wipro. The placement cell provides dedicated training and internship support.",
      },
      {
        question: "What is the admission process at Sathyabama?",
        answer: "Admissions for B.E./B.Tech programs are primarily merit-based through 12th Board marks. TNEA counselling (for Tamil Nadu students) and direct university admissions are both accepted. The process involves online application, eligibility verification, counseling, and fee payment.",
      },
      {
        question: "Are scholarships available at Sathyabama?",
        answer: "Yes. Sathyabama IST offers Merit Scholarships, Academic Excellence Awards, Sports Scholarships, Special Category Scholarships, and Research Fellowships. Eligible students can also link with government scholarship schemes facilitated by the university.",
      },
      {
        question: "How is hostel life at Sathyabama?",
        answer: "Sathyabama provides separate residential hostels for men and women with modern amenities. The on-campus accommodation offers a disciplined and supportive environment with 24/7 security, medical facilities, and canteen services within the campus.",
      },
      {
        question: "What are the top recruiters at Sathyabama?",
        answer: "Top recruiters include Amazon, TCS, Infosys, Cognizant, Accenture, Capgemini, HCL, Wipro, Deloitte, Zoho, Tech Mahindra, and IBM. The university hosts regular campus drives and job fairs attracting 300+ companies annually.",
      },
    ],
    qnas: [
      {
        question: "Is Sathyabama worth joining?",
        answer: "Yes. Sathyabama IST offers strong academics, modern infrastructure, good placements, and a vibrant student community. Its NAAC A++ accreditation, research focus, unique Aerospace Engineering programs, and affordable fees compared to top private universities make it a strong choice for engineering in Chennai.",
      },
      {
        question: "Which branch is most popular at Sathyabama?",
        answer: "Computer Science Engineering, AI & Data Science, AI & Machine Learning, Cyber Security, and Information Technology are the most sought-after programs. Sathyabama also has a distinguished Aerospace Engineering program that is unique among Chennai institutions.",
      },
      {
        question: "How is campus life at Sathyabama?",
        answer: "Students enjoy an active campus culture with technical symposiums, hackathons, coding clubs, robotics clubs, cultural festivals, sports events, and entrepreneurship activities throughout the year. The Innovation & Entrepreneurship Cell actively supports student startups and projects.",
      },
    ],
    aboutParagraphs: [
      "Sathyabama Institute of Science and Technology (SIST) is one of Chennai's most respected private deemed-to-be universities, established in 1987 and recognized by NAAC with A++ accreditation.",
      "Located in Chennai, Tamil Nadu, Sathyabama IST offers comprehensive programs in engineering, technology, architecture, management, science, and research across a 140+ acre campus, with over 15,000 students and 1,000+ faculty members.",
      "The university is known for its industry-oriented curriculum, modern research laboratories, government-funded research projects, strong placement ecosystem, and one of South India's few dedicated Aerospace Engineering programs.",
      "Sathyabama has consistently produced skilled graduates who contribute across technology, aerospace, business, research, and entrepreneurship sectors globally, making it a cornerstone of technical education in the Chennai ecosystem."
    ],
    reviews: [
      {
        id: "rev-sist-1",
        author: "Preethi Rajendran",
        role: "B.Tech CSE Student, Final Year",
        rating: 5,
        academics: 5,
        placements: 4,
        infrastructure: 5,
        campusLife: 5,
        research: 4,
        comment: "Sathyabama has exceeded my expectations. The labs are modern and well-equipped. The placement cell is very active — TCS, Cognizant, HCL all recruited from my batch. The Sathyabama Fest is one of the best events I've attended. Overall an excellent experience for a private university in Chennai.",
        strengths: ["Excellent Infrastructure", "Active Placement Cell", "Modern Labs", "NAAC A++ Accreditation"],
        weaknesses: ["Strict Academic Schedule", "Competitive Environment"]
      },
      {
        id: "rev-sist-2",
        author: "Aakash Sundaramurthy",
        role: "B.Tech Aerospace Engineering Graduate",
        rating: 4,
        academics: 4,
        placements: 4,
        infrastructure: 5,
        campusLife: 4,
        research: 5,
        comment: "The Aerospace Engineering program at Sathyabama is genuinely one of the best in South India. The research labs are DST-funded and the faculty bring real industry experience. Getting into Aerospace-related roles after graduation has been solid. The campus is slightly smaller than some competitors but is modern and well-maintained.",
        strengths: ["Strong Aerospace Program", "Government-Funded Research", "Modern Infrastructure", "Strong Alumni in Tech"],
        weaknesses: ["Smaller Campus Area", "Limited Nightlife Options Around Campus"]
      }
    ],
  },
};
