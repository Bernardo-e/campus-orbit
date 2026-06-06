"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SaveButton from "@/components/SaveButton";
import { flagshipCollegesData } from "@/data/flagshipColleges";

interface DBCollege {
  id: string;
  name: string;
  location: string;
  rating: number;
  fees: number;
  description: string;
  image: string | null;
  courses: { id: string; name: string; duration: string; fees: number }[];
  reviews: { id: string; rating: number; comment: string }[];
}

interface ClientProps {
  college: DBCollege;
}

const partnerships: Record<string, { universities: string[]; exchange: string; semester: string }> = {
  USA: {
    universities: ["State University of New York (SUNY)", "Rochester Institute of Technology", "University of Massachusetts"],
    exchange: "Dual Degree Option (2+2 Program)",
    semester: "Available (Semester Abroad Program - SAP)"
  },
  UK: {
    universities: ["Coventry University", "University of the West of England", "Newcastle University"],
    exchange: "Credit Transfer Facility",
    semester: "Available (Winter & Summer Schools)"
  },
  Germany: {
    universities: ["Karlsruhe Institute of Technology", "Technical University of Munich", "RWTH Aachen University"],
    exchange: "Research Internships & DAAD Fellowships",
    semester: "Available (Semester Abroad Program - SAP)"
  },
  Canada: {
    universities: ["University of Windsor", "Dalhousie University", "University of Waterloo"],
    exchange: "Joint Research Projects",
    semester: "Available (Semester Abroad Program - SAP)"
  },
  Australia: {
    universities: ["RMIT University", "Deakin University", "Queensland University of Technology"],
    exchange: "Study Abroad Programs (1+3 / 2+2 Options)",
    semester: "Available (Semester Abroad Program - SAP)"
  },
  Singapore: {
    universities: ["National University of Singapore (NUS)", "Nanyang Technological University (NTU)"],
    exchange: "Summer Research Internships",
    semester: "Available (Winter Schools)"
  }
};

export default function CollegeDetailClient({ college }: ClientProps) {
  const isFlagship = flagshipCollegesData[college.name] !== undefined;
  const data = flagshipCollegesData[college.name] || null;

  const [activeTab, setActiveTab] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // VIT Fee Simulator state
  const [simBranch, setSimBranch] = useState("Computer Science (CSE)");
  const [simCategory, setSimCategory] = useState("Category 1");
  const [simHostel, setSimHostel] = useState("AC 2-Sharing");

  // Global Exposure country
  const [selectedCountry, setSelectedCountry] = useState("USA");

  // Scholarship Eligibility Checker state
  const [userRank, setUserRank] = useState("");
  const [isBoardTopper, setIsBoardTopper] = useState(false);
  const [checkedScholarship, setCheckedScholarship] = useState<string | null>(null);

  const getSimulatedFees = () => {
    const isGroupA = ["Mechanical Engineering", "Biotechnology"].includes(simBranch);
    let tuition = 0;
    if (isGroupA) {
      const mapping: Record<string, number> = {
        "Category 1": 176000,
        "Category 2": 275000,
        "Category 3": 343000,
        "Category 4": 368000,
        "Category 5": 398000,
      };
      tuition = mapping[simCategory] || 176000;
    } else {
      const mapping: Record<string, number> = {
        "Category 1": 198000,
        "Category 2": 307000,
        "Category 3": 405000,
        "Category 4": 448000,
        "Category 5": 493000,
      };
      tuition = mapping[simCategory] || 198000;
    }

    let hostel = 0;
    const hostelMapping: Record<string, number> = {
      "AC 2-Sharing": 120000,
      "AC 4-Sharing": 90000,
      "Non-AC 4-Sharing": 65000,
      "Day Boarder": 0,
    };
    hostel = hostelMapping[simHostel] || 0;

    return { tuition, hostel, total: tuition + hostel };
  };

  const checkScholarshipEligibility = () => {
    if (isBoardTopper) {
      setCheckedScholarship("Congratulations! You qualify for the GV School Development Program (GVSDP): 100% Tuition & Hostel Waiver.");
      return;
    }
    const r = parseInt(userRank, 10);
    if (isNaN(r) || r <= 0) {
      setCheckedScholarship("Please enter a valid rank.");
      return;
    }
    if (r <= 100) {
      setCheckedScholarship("You qualify for the VITEEE Merit Scholarship (75% Tuition Fee Waiver).");
    } else if (r <= 500) {
      setCheckedScholarship("You qualify for the VITEEE Merit Scholarship (50% Tuition Fee Waiver).");
    } else if (r <= 1000) {
      setCheckedScholarship("You qualify for the VITEEE Merit Scholarship (25% Tuition Fee Waiver).");
    } else {
      setCheckedScholarship("Standard Tuition Fee rates apply. You may still qualify for need-based Financial Assistance Programs (25-50% waiver depending on income check).");
    }
  };

  // CTA handler
  const handleApply = () => {
    alert(
      "Application portal redirect: You will be redirected to the Joint Seat Allocation Authority (JoSAA) or appropriate entrance portal."
    );
  };

  const tabs = [
    { id: "about", label: "About" },
    { id: "programs", label: "Programs & Fees" },
    { id: "placements", label: "Placements" },
    ...(college.name === "Vellore Institute of Technology" ? [{ id: "global", label: "Global Exposure" }] : []),
    { id: "research", label: "Research & Incubation" },
    { id: "scholarships", label: "Scholarships" },
    { id: "faq", label: "FAQs & Q&A" },
    { id: "reviews", label: "Reviews" },
  ];

  const renderTabContent = () => {
    if (!isFlagship || !data) {
      // Standard fallback rendering for non-flagship colleges
      switch (activeTab) {
        case "programs":
          return (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Courses Offered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {college.courses.map((course) => (
                  <div key={course.id} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 shadow-lg">
                    <h4 className="font-semibold text-white text-sm">{course.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">Duration: {course.duration}</span>
                    <div className="border-t border-zinc-950 mt-3 pt-3 flex justify-between items-center">
                      <span className="text-[10px] text-zinc-550 uppercase">Fees</span>
                      <span className="font-mono text-xs text-blue-450">₹{course.fees.toLocaleString()} / year</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case "reviews":
          return (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Student Reviews</h3>
              <div className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 shadow-lg space-y-2">
                    <div className="flex items-center text-yellow-500 gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "stroke-current fill-none"}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-zinc-350 text-xs italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          );
        default:
          return (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Institution Details</h3>
              <p className="text-zinc-350 text-xs leading-relaxed whitespace-pre-line">{college.description}</p>
            </div>
          );
      }
    }

    // Flagship IIT Madras custom tab contents
    switch (activeTab) {
      case "about":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-4 text-zinc-350 text-xs leading-relaxed">
              {data.aboutParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-950">
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-4">
                <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">Institution Profile</span>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Established</span><span className="text-white font-semibold">{data.established}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Campus Area</span><span className="text-white font-semibold">{data.campusArea}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Faculty Size</span><span className="text-white font-semibold">{data.facultyCount}</span></div>
                </div>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-4">
                <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">Academics Environment</span>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Acceptance Rate</span><span className="text-red-400 font-semibold">Highly Competitive</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Students Enrolled</span><span className="text-white font-semibold">{data.studentsCount}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-400">Status</span><span className="text-emerald-400 font-semibold">{college.name === "SRM Institute of Science and Technology" ? "Private Deemed University" : "National Importance"}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "programs":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Courses and Tuition pricing cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Tuition Fees Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.feeCards?.map((card, idx) => (
                  <div key={idx} className="bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-zinc-900 rounded-2xl p-5 space-y-4">
                    <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded ${card.color}`}>
                      {card.type}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{card.name}</h4>
                      <span className="text-[10px] text-zinc-500 block">{card.duration}</span>
                    </div>
                    <div className="border-t border-zinc-950 pt-3 flex items-baseline gap-1">
                      <span className="text-lg font-mono font-bold text-white">{card.amount}</span>
                      <span className="text-[9px] text-zinc-500">Total fees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Specializations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">Popular Branches & Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {(data.cutoffInsights?.map((c) => c.branch) || [
                  "Computer Science Engineering",
                  "Electronics & Communication",
                  "Electrical Engineering",
                  "Mechanical Engineering",
                  "Civil Engineering",
                ]).map((spec) => (
                  <span
                    key={spec}
                    className="px-3.5 py-2 bg-[#0c0c10]/40 border border-zinc-900 text-zinc-350 hover:text-white rounded-xl text-xs font-medium cursor-default transition-colors"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Admission Process roadmap */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Admission Process</h3>
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">B.Tech Route Trajectory</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 relative justify-center">
                    {data.admissionSteps?.map((step, idx) => (
                      <div key={idx} className="bg-[#111116] border border-zinc-850 p-3.5 rounded-xl text-center flex flex-col gap-1 shadow-sm relative">
                        <span className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[9px] font-black flex items-center justify-center mx-auto mb-1">
                          {step.step}
                        </span>
                        <span className="text-xs font-bold text-white">{step.label}</span>
                        <span className="text-[8px] text-zinc-500 font-semibold">{step.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-950 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">PG Admissions</h5>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Accepts {college.name === "Anna University" ? "GATE (M.E./M.Tech), TANCET (State PG Entrance), CEETA PG, CAT/MAT (MBA)" : college.name === "SRM Institute of Science and Technology" ? "GATE (M.Tech), TANCET, CAT/MAT (MBA), MCA Entrance" : college.name === "Sathyabama Institute of Science and Technology" ? "GATE (M.E./M.Tech), TANCET, CAT/MAT (MBA)" : college.name.includes("IIT") ? "GATE (M.Tech), JAM (M.Sc), CAT/GMAT (MBA)" : "GATE (M.Tech), CAT (MBA), JAM (M.Sc), NIMCET (MCA)"}.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Minimum Eligibility</h5>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {college.name === "Anna University" || college.name === "Sathyabama Institute of Science and Technology" ? "Class 12 Board marks determine TNEA/Merit rank. No separate entrance exam required for B.E./B.Tech." : "75% marks in Class 12 Boards + qualifying entrance exam cutoff rank."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cutoff Insights */}
            {data.cutoffInsights && (
              <div className="space-y-3 pt-4 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">
                  {college.name === "Vellore Institute of Technology" ? "VITEEE" : college.name === "Anna University" || college.name === "Sathyabama Institute of Science and Technology" ? "TNEA / Merit" : college.name === "SRM Institute of Science and Technology" ? "SRMJEEE" : college.name.includes("IIT") ? "JEE Advanced" : "JEE Main"} Cutoffs (Branch-wise)
                </h3>
                <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 space-y-4">
                  {data.cutoffInsights.map((insight, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-300">{insight.branch}</span>
                        <span className="font-mono text-white">{insight.cutoff}</span>
                      </div>
                      <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/80 rounded-full"
                          style={{
                            background: data.theme ? `linear-gradient(to right, ${data.theme.brandColor}, ${data.theme.brandAccent})` : undefined,
                            width: insight.cutoff.includes("4,463") || insight.cutoff.includes("148") || insight.cutoff.includes("1,500") || insight.cutoff.includes("Top 20,000")
                              ? "15%"
                              : insight.cutoff.includes("6,947") || insight.cutoff.includes("980") || insight.cutoff.includes("3,000") || insight.cutoff.includes("Top 25,000")
                              ? "35%"
                              : insight.cutoff.includes("9,052") || insight.cutoff.includes("2500") || insight.cutoff.includes("4,500") || insight.cutoff.includes("Top 30,000")
                              ? "55%"
                              : insight.cutoff.includes("13,628") || insight.cutoff.includes("3100") || insight.cutoff.includes("7,500") || insight.cutoff.includes("Top 35,000")
                              ? "75%"
                              : "85%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Fee Simulator for VIT Vellore */}
            {college.name === "Vellore Institute of Technology" && (
              <div className="space-y-4 pt-6 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">Interactive Fee Category Simulator</h3>
                <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Branch select */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-extrabold uppercase text-zinc-550">Choose B.Tech Branch</label>
                      <div className="relative">
                        <select
                          value={simBranch}
                          onChange={(e) => setSimBranch(e.target.value)}
                          className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                        >
                          <option>Computer Science (CSE)</option>
                          <option>AI & Data Science</option>
                          <option>Electronics Engineering</option>
                          <option>Mechanical Engineering</option>
                          <option>Biotechnology</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Category select */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-extrabold uppercase text-zinc-550">Select Fee Category</label>
                      <div className="relative">
                        <select
                          value={simCategory}
                          onChange={(e) => setSimCategory(e.target.value)}
                          className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                        >
                          <option>Category 1</option>
                          <option>Category 2</option>
                          <option>Category 3</option>
                          <option>Category 4</option>
                          <option>Category 5</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Hostel choice */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-extrabold uppercase text-zinc-550">Hostel Accommodation</label>
                      <div className="relative">
                        <select
                          value={simHostel}
                          onChange={(e) => setSimHostel(e.target.value)}
                          className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                        >
                          <option>AC 2-Sharing</option>
                          <option>AC 4-Sharing</option>
                          <option>Non-AC 4-Sharing</option>
                          <option>Day Boarder (No Hostel)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Display */}
                  <div className="border-t border-zinc-950/60 pt-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 text-xs">
                      <div className="space-y-1">
                        <span className="text-zinc-500 font-semibold block">Tuition Fee</span>
                        <div className="font-mono text-white font-bold text-sm">₹{getSimulatedFees().tuition.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-zinc-500 font-semibold block">Hostel Fee</span>
                        <div className="font-mono text-white font-bold text-sm">₹{getSimulatedFees().hostel.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <span className="text-zinc-550 font-semibold block">Category Rate Group</span>
                        <div className="text-zinc-300 font-semibold mt-0.5">
                          {["Mechanical Engineering", "Biotechnology"].includes(simBranch) ? "Group A Tuition" : "Group B Tuition"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111116] p-4 rounded-xl border border-zinc-850 flex items-center justify-between gap-4 md:w-64">
                      <div>
                        <span className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">Estimated Total / Year</span>
                        <div className="font-mono text-lg font-black text-white mt-0.5">₹{getSimulatedFees().total.toLocaleString()}</div>
                      </div>
                      <span
                        style={data.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}15`, borderColor: `${data.theme.brandColor}30` } : {}}
                        className="px-2 py-0.5 text-[8px] font-extrabold uppercase border rounded"
                      >
                        {simCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Affordability Highlight for Anna University */}
            {college.name === "Anna University" && (
              <div className="space-y-4 pt-6 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">💛 Affordability Advantage</h3>
                <div
                  className="rounded-2xl p-5 md:p-6 space-y-5 border"
                  style={data.theme ? { background: `linear-gradient(135deg, ${data.theme.brandColor}10, #0c0c10)`, borderColor: `${data.theme.brandColor}25` } : {}}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black border"
                      style={data.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}20`, borderColor: `${data.theme.brandColor}30` } : {}}
                    >
                      ₹
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Premier Public Engineering at Unbeatable Costs</h4>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        Anna University offers NAAC A++ accredited engineering education at a fraction of the cost of top private universities — making it one of the best value propositions in India.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Anna University (Govt.)", fee: "₹50K–₹80K / yr", tag: "Public Tuition", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                      { label: "Top Private Colleges", fee: "₹1.5L–₹4L / yr", tag: "Private Tuition", color: "text-zinc-400", bg: "bg-zinc-800/30", border: "border-zinc-700/30" },
                      { label: "You Save (4 Years)", fee: "Up to ₹14L", tag: "Total Savings", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    ].map((item, idx) => (
                      <div key={idx} className={`${item.bg} border ${item.border} rounded-xl p-4 space-y-1.5 text-center`}>
                        <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider block">{item.tag}</span>
                        <div className={`font-mono font-black text-base ${item.color}`}>{item.fee}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">★</span>
                    <span>
                      For SC/ST, BC/MBC students, the Tamil Nadu Government covers tuition fees completely — making Anna University effectively <strong className="text-white">free of cost</strong> for eligible students.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Global Reach & Scale for SRM IST */}
            {college.name === "SRM Institute of Science and Technology" && (
              <div className="space-y-4 pt-6 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">🌐 Global Reach & Scale</h3>
                <div
                  className="rounded-2xl p-5 md:p-6 space-y-5 border"
                  style={data.theme ? { background: `linear-gradient(135deg, ${data.theme.brandColor}10, #0c0c10)`, borderColor: `${data.theme.brandColor}25` } : {}}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black border"
                      style={data.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}20`, borderColor: `${data.theme.brandColor}30` } : {}}
                    >
                      🌐
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">One of India's Largest & Most Global Private Universities</h4>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        SRM IST combines scale with quality — 50,000+ students from across India and 50+ countries, 1000+ industry partners, and consistently strong placement outcomes.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { stat: "50,000+", label: "Total Students", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                      { stat: "1,000+", label: "Industry Recruiters", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                      { stat: "50+", label: "Countries Represented", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
                      { stat: "450+", label: "Academic Programs", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    ].map((item, idx) => (
                      <div key={idx} className={`${item.bg} border ${item.border} rounded-xl p-4 space-y-1.5 text-center`}>
                        <div className={`font-mono font-black text-lg ${item.color}`}>{item.stat}</div>
                        <div className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { tier: "Top SRMJEEE Rankers", pkg: "₹12–50+ LPA", badge: "Tier 1 Packages", badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                      { tier: "Core CSE / AI & ML", pkg: "₹8–15 LPA", badge: "Tier 2 Packages", badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                      { tier: "Other Branches Average", pkg: "₹5–8 LPA", badge: "Tier 3 Packages", badgeColor: "text-zinc-400 bg-zinc-800/30 border-zinc-700/30" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-3 space-y-2">
                        <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase border rounded ${item.badgeColor}`}>{item.badge}</span>
                        <div className="font-mono font-black text-sm text-white">{item.pkg}</div>
                        <div className="text-[10px] text-zinc-550 font-medium">{item.tier}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">★</span>
                    <span>
                      SRMJEEE top rankers (Rank 1–100) receive up to <strong className="text-white">100% tuition fee waiver</strong> — making SRM IST accessible for meritorious students at no cost.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Value & Research Focus Widget for Sathyabama IST */}
            {college.name === "Sathyabama Institute of Science and Technology" && (
              <div className="space-y-4 pt-6 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">🔬 Research & Industry Integration</h3>
                <div
                  className="rounded-2xl p-5 md:p-6 space-y-5 border"
                  style={data.theme ? { background: `linear-gradient(135deg, ${data.theme.brandColor}10, #0c0c10)`, borderColor: `${data.theme.brandColor}25` } : {}}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black border"
                      style={data.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}20`, borderColor: `${data.theme.brandColor}30` } : {}}
                    >
                      🔬
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">DST-FIST Supported Research & Aerospace Center</h4>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        Sathyabama IST is designated as a category-A institution with extensive government funding for space research and deep-tech innovation, boasting a dedicated campus satellite program.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { stat: "300+", label: "Industry Partners", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
                      { stat: "₹40+ LPA", label: "Highest Package", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                      { stat: "50+", label: "Incubated Startups", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
                      { stat: "100%", label: "Placement Assistance", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    ].map((item, idx) => (
                      <div key={idx} className={`${item.bg} border ${item.border} rounded-xl p-4 space-y-1.5 text-center`}>
                        <div className={`font-mono font-black text-lg ${item.color}`}>{item.stat}</div>
                        <div className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">★</span>
                    <span>
                      Sathyabama's Research and Development centers are funded directly by national bodies like <strong className="text-white">ISRO, DRDO, and DST</strong>, providing students unmatched research exposure at the undergraduate level.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "placements":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Dashboard metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-4 text-center">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Average Package</span>
                <span className="text-2xl font-mono font-black text-white mt-1 block">{data.placementStats.averagePackage}</span>
                <span className="text-[8px] text-zinc-600 block mt-0.5">Highest in region</span>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-4 text-center">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Highest Package</span>
                <span className="text-2xl font-mono font-black text-emerald-400 mt-1 block">{data.placementStats.highestPackage}</span>
                <span className="text-[8px] text-zinc-600 block mt-0.5">Global placements offer</span>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-4 text-center">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Placement Rate</span>
                <span className="text-2xl font-mono font-black text-white mt-1 block">{data.placementStats.rate}</span>
                <span className="text-[8px] text-zinc-600 block mt-0.5">Total registered matches</span>
              </div>
            </div>

            {/* Student statistics */}
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Placements Count</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center text-xs p-3.5 bg-[#111116] rounded-xl border border-zinc-850">
                  <span className="text-zinc-400 font-semibold">Undergraduates Placed</span>
                  <span className="font-mono font-bold text-white">{data.placementStats.ugPlaced}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3.5 bg-[#111116] rounded-xl border border-zinc-850">
                  <span className="text-zinc-400 font-semibold">Postgraduates Placed</span>
                  <span className="font-mono font-bold text-white">{data.placementStats.pgPlaced}</span>
                </div>
              </div>
            </div>

            {/* Branch-wise placement averages */}
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Branch Packages Average</h4>
              <div className="space-y-3">
                {data.placementStats.branchHighlights.map((br, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-300">{br.branch}</span>
                      <span className="font-mono text-white">{br.package}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-emerald-500" : "bg-zinc-700"}`} 
                        style={{ width: idx === 0 ? "100%" : idx === 1 ? "60%" : "35%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top recruiters list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">Top Recruiter Panel</h4>
              <div className="flex flex-wrap gap-2">
                {data.placementStats.recruiters.map((rec) => (
                  <span
                    key={rec}
                    className="px-3 py-1.5 bg-[#0c0c10] border border-zinc-900 hover:border-zinc-850 text-white rounded-lg text-xs transition-colors"
                  >
                    {rec}
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Placements Visualizations for VIT Vellore */}
            {college.name === "Vellore Institute of Technology" && (
              <div className="space-y-4 pt-4 border-t border-zinc-950">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Placement Data Visualizations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Salary Distribution */}
                  <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-4">
                    <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">Salary Distribution</span>
                    <div className="space-y-3 pt-1">
                      {[
                        { label: "Super Dream Offers (>10 LPA)", pct: 35, color: "bg-emerald-500" },
                        { label: "Dream Offers (5-10 LPA)", pct: 45, color: "bg-blue-500" },
                        { label: "Regular Offers (<5 LPA)", pct: 20, color: "bg-zinc-700" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="font-mono text-white">{item.pct}%</span>
                          </div>
                          <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter Breakdown */}
                  <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-4">
                    <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">Sector Breakdown</span>
                    <div className="space-y-3 pt-1">
                      {[
                        { label: "Product & IT Companies", pct: 60, color: "bg-rose-500" },
                        { label: "Consulting & Services", pct: 25, color: "bg-amber-500" },
                        { label: "Core & Biotech Sectors", pct: 15, color: "bg-indigo-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="font-mono text-white">{item.pct}%</span>
                          </div>
                          <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branch Placement Rates */}
                  <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-4">
                    <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">Branch Placement Rates</span>
                    <div className="space-y-3 pt-1">
                      {[
                        { label: "Computer Science (CSE)", pct: 98, color: "bg-teal-500" },
                        { label: "AI & Data Science", pct: 97, color: "bg-sky-500" },
                        { label: "Electronics (ECE)", pct: 92, color: "bg-purple-500" },
                        { label: "Mechanical Engineering", pct: 88, color: "bg-zinc-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="font-mono text-white">{item.pct}%</span>
                          </div>
                          <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "global":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-gradient-to-br from-red-950/10 to-[#0c0c10] border border-red-950/20 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <span className="px-2.5 py-0.5 text-[8px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded">Global Exposure Hub</span>
              <h4 className="text-base font-bold text-white">Semester Abroad & International Collaborations</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                VIT Vellore offers a highly robust **Semester Abroad Program (SAP)** and **International Transfer Program (ITP)** in partnership with over 500 foreign universities, allowing students to study or research in top global ecosystems.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Interactive Partner University Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Countries List on Left */}
                <div className="flex flex-col gap-2">
                  {Object.keys(partnerships).map((country) => {
                    const isSelected = selectedCountry === country;
                    return (
                      <button
                        key={country}
                        onClick={() => setSelectedCountry(country)}
                        style={isSelected && data.theme ? { backgroundColor: `${data.theme.brandColor}15`, borderColor: data.theme.brandColor, color: "#ffffff" } : {}}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/10 border-blue-500 text-white"
                            : "bg-[#0c0c10] border-zinc-900 text-zinc-450 hover:text-white"
                        }`}
                      >
                        {country === "USA" && "🇺🇸 USA Partnerships"}
                        {country === "UK" && "🇬🇧 United Kingdom"}
                        {country === "Germany" && "🇩🇪 Germany & Europe"}
                        {country === "Canada" && "🇨🇦 Canada Partners"}
                        {country === "Australia" && "🇦🇺 Australia / Oceania"}
                        {country === "Singapore" && "🇸🇬 Singapore & Asia"}
                      </button>
                    );
                  })}
                </div>

                {/* Country details on Right */}
                <div className="md:col-span-2 bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-950/60 pb-3">
                    <span className="text-lg">
                      {selectedCountry === "USA" && "🇺🇸"}
                      {selectedCountry === "UK" && "🇬🇧"}
                      {selectedCountry === "Germany" && "🇩🇪"}
                      {selectedCountry === "Canada" && "🇨🇦"}
                      {selectedCountry === "Australia" && "🇦🇺"}
                      {selectedCountry === "Singapore" && "🇸🇬"}
                    </span>
                    <h4 className="font-bold text-white text-sm">Partner Institutions in {selectedCountry}</h4>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[8px] font-extrabold uppercase text-zinc-550">Prominent Partner Universities</span>
                    <div className="grid grid-cols-1 gap-2">
                      {partnerships[selectedCountry]?.universities.map((uni, idx) => (
                        <div key={idx} className="bg-[#111116] border border-zinc-850 p-3 rounded-xl text-xs text-white font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-550" />
                          {uni}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-950 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-zinc-550 block text-[9px] font-extrabold uppercase">Semester Abroad (SAP)</span>
                      <span className="text-emerald-400 font-semibold">{partnerships[selectedCountry]?.semester}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-550 block text-[9px] font-extrabold uppercase">Transfer Program (ITP)</span>
                      <span className="text-zinc-300 font-semibold">{partnerships[selectedCountry]?.exchange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "research":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Startup ecosystem */}
            <div className="bg-gradient-to-br from-emerald-950/10 to-[#0c0c10] border border-emerald-950/20 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <span className="px-2.5 py-0.5 text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">Flagship Hub</span>
              <h4 className="text-base font-bold text-white">Startup & Deep Tech Incubation</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The <strong className="text-zinc-200 font-bold">{data.researchInnovation.incubatorName}</strong> is a key driver for tech entrepreneurship. {data.researchInnovation.incubatorDescription}
              </p>
              <div className="bg-[#111116]/80 p-4 border border-zinc-850 rounded-xl mt-3 flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-semibold">Total Incubated Portfolio</span>
                <span className="font-mono font-bold text-emerald-400 text-right">{data.researchInnovation.incubatedStartups}</span>
              </div>
            </div>

            {/* Focus areas list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Key Focus & Innovation Areas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.researchInnovation.focusAreas.map((area, idx) => (
                  <div key={idx} className="bg-[#0c0c10] border border-zinc-900 p-4 rounded-xl flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs text-white font-bold">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Research Milestones</h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {data.researchInnovation.highlights.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );

      case "scholarships":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4">
            {data.scholarships.map((s, idx) => (
              <div key={idx} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <p className="text-xs text-zinc-450"><span className="text-zinc-555 font-semibold">Eligibility:</span> {s.eligibility}</p>
                </div>
                <div className="md:w-60 border-t md:border-t-0 md:border-l border-zinc-900 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center gap-0.5">
                  <span className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">Benefits</span>
                  <span className="text-xs text-emerald-400 font-semibold leading-relaxed">{s.benefits}</span>
                </div>
              </div>
            ))}

            {/* Eligibility Checker for VIT Vellore */}
            {college.name === "Vellore Institute of Technology" && (
              <div className="space-y-4 pt-4 border-t border-zinc-950">
                <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Scholarship Eligibility Checker</h3>
                <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5">
                      <label htmlFor="userRank" className="text-[9px] font-extrabold uppercase text-zinc-550">Enter your VITEEE Rank</label>
                      <input
                        id="userRank"
                        type="number"
                        placeholder="e.g. 450"
                        value={userRank}
                        onChange={(e) => setUserRank(e.target.value)}
                        className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                    <div className="flex items-center gap-2 h-10 select-none cursor-pointer" onClick={() => setIsBoardTopper(!isBoardTopper)}>
                      <input
                        type="checkbox"
                        checked={isBoardTopper}
                        onChange={() => {}}
                        className="w-4 h-4 accent-red-650 rounded bg-[#111116] border-zinc-800"
                      />
                      <span className="text-xs text-zinc-350 font-medium">State / District Board Topper</span>
                    </div>
                    <button
                      onClick={checkScholarshipEligibility}
                      style={data.theme ? { backgroundColor: data.theme.brandColor, color: "#ffffff" } : {}}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      Check Eligibility
                    </button>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {checkedScholarship && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#111116] border border-zinc-850 rounded-xl p-4 text-xs text-zinc-350 flex items-start gap-3 overflow-hidden font-medium mt-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black flex items-center justify-center select-none flex-shrink-0 mt-0.5">✓</span>
                        <span>{checkedScholarship}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "faq":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* FAQ Accordions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {data.faqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="bg-[#0c0c10] border border-zinc-900 rounded-xl overflow-hidden shadow-md">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-white hover:bg-zinc-900/20 select-none cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <svg className={`w-3.5 h-3.5 text-zinc-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden border-t border-zinc-950"
                          >
                            <p className="p-4 text-xs text-zinc-400 leading-relaxed font-medium bg-zinc-950/20">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Q&A Boards */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-wider border-t border-zinc-950 pt-4">Campus Orbit Discussions</h3>
              <div className="space-y-4">
                {data.qnas.map((qa, idx) => (
                  <div key={idx} className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black flex items-center justify-center select-none flex-shrink-0">Q</span>
                      <span className="font-bold text-xs text-white mt-0.5">{qa.question}</span>
                    </div>
                    <div className="flex gap-3 border-t border-zinc-950/40 pt-2.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center select-none flex-shrink-0">A</span>
                      <span className="text-xs text-zinc-400 font-medium leading-relaxed mt-0.5">{qa.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        );
      case "reviews":
        const avgAcademics = data.reviews.reduce((acc, r) => acc + r.academics, 0) / data.reviews.length;
        const avgPlacements = data.reviews.reduce((acc, r) => acc + r.placements, 0) / data.reviews.length;
        const avgInfrastructure = data.reviews.reduce((acc, r) => acc + r.infrastructure, 0) / data.reviews.length;
        const avgResearch = data.reviews.reduce((acc, r) => acc + r.research, 0) / data.reviews.length;

        const allStrengths = Array.from(new Set(data.reviews.flatMap((r) => r.strengths)));
        const allWeaknesses = Array.from(new Set(data.reviews.flatMap((r) => r.weaknesses)));

        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Reviews ratings overview */}
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Academic Score Matrix</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Academics</span>
                    <span className="font-bold text-white">{avgAcademics.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Placements</span>
                    <span className="font-bold text-white">{avgPlacements.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Infrastructure</span>
                    <span className="font-bold text-white">{avgInfrastructure.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Research Value</span>
                    <span className="font-bold text-white">{avgResearch.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-zinc-950 pt-4 md:pt-0 md:pl-6 space-y-4">
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider">Common Strengths</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {allStrengths.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-950/20 border border-emerald-900/10 text-emerald-400 rounded text-[9px] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-amber-400 tracking-wider">Areas of Improvement</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {allWeaknesses.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-amber-950/20 border border-amber-900/10 text-amber-400 rounded text-[9px] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated reviews cards */}
            <div className="space-y-4">
              {data.reviews.map((rev, idx) => (
                <div key={idx} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">{rev.author}</span>
                      <span className="text-[9px] text-zinc-500 font-semibold">{rev.role}</span>
                    </div>
                    <div className="flex items-center text-yellow-500 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "stroke-current fill-none"}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-350 text-xs italic font-medium leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      {/* Background glow grid */}
      <div className="bg-grid-glow" />
      {data?.theme && (
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: data.theme.brandColor }}
        />
      )}

      {/* HEADER / NAVIGATION BAR */}
      <Navbar />

      {/* BACK NAVIGATION */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-450 hover:text-white transition-colors uppercase tracking-wider group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Explorer
        </Link>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1 relative z-10">
        
        {/* LEFT TWO COLUMNS: Hero header, Featured Image, Tabs Navigator, Tab Content */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Header Title Area */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span 
                style={data?.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}15`, borderColor: `${data.theme.brandColor}30`, boxShadow: `0 0 15px ${data.theme.brandColor}1a` } : {}}
                className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg tracking-widest inline-block select-none ${data?.theme ? "border" : "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"}`}
              >
                {isFlagship ? "Flagship Institution" : "Accredited"}
              </span>
              {college.name === "IIT Madras" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg tracking-widest inline-block select-none">
                  Institute of Eminence
                </span>
              )}
              {(college.name === "Vellore Institute of Technology" || college.name === "Anna University" || college.name === "SRM Institute of Science and Technology" || college.name === "Sathyabama Institute of Science and Technology") && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg tracking-widest inline-block select-none font-sans font-bold">
                  NAAC A++ Accredited
                </span>
              )}
              {isFlagship && college.name !== "Vellore Institute of Technology" && college.name !== "Anna University" && college.name !== "SRM Institute of Science and Technology" && college.name !== "Sathyabama Institute of Science and Technology" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-lg tracking-widest inline-block select-none">
                  National Importance
                </span>
              )}
              {college.name === "Vellore Institute of Technology" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-lg tracking-widest inline-block select-none">
                  Deemed University
                </span>
              )}
              {college.name === "Anna University" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-600/10 text-amber-400 border border-amber-500/20 rounded-lg tracking-widest inline-block select-none">
                  State Public University
                </span>
              )}
              {(college.name === "SRM Institute of Science and Technology" || college.name === "Sathyabama Institute of Science and Technology") && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg tracking-widest inline-block select-none">
                  Private Deemed University
                </span>
              )}
              {college.name === "Sathyabama Institute of Science and Technology" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-rose-600/10 text-rose-400 border border-rose-500/20 rounded-lg tracking-widest inline-block select-none font-sans font-bold">
                  Engineering Excellence
                </span>
              )}
              {college.name === "SRM Institute of Science and Technology" && (
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-sky-600/10 text-sky-400 border border-sky-500/20 rounded-lg tracking-widest inline-block select-none">
                  🌐 50+ Countries
                </span>
              )}
              <span className="text-[10px] text-zinc-550 font-mono">ID: {college.id}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {college.name} {data && <span className="text-zinc-500 font-medium">({data.shortName})</span>}
            </h1>

            {/* Location & ratings metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-450 border-b border-zinc-950 pb-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(college.rating) ? "fill-current" : "stroke-current fill-none"}`} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                  </svg>
                ))}
                <span className="font-mono text-zinc-200 font-bold ml-1">{college.rating.toFixed(1)}</span>
                <span className="text-zinc-550 ml-0.5">({isFlagship ? data.reviews.length : college.reviews.length} reviews)</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="font-medium">{college.location}</span>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl bg-zinc-950 group">
            {college.image ? (
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">
                No image available
              </div>
            )}
            {/* Soft gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Flagship quick statistics grid */}
          {isFlagship && data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0c0c10] border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between h-20 shadow-md">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Campus size</span>
                <span className="text-sm font-bold text-white">{data.campusArea}</span>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between h-20 shadow-md">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Faculty</span>
                <span className="text-sm font-bold text-white">{data.facultyCount}</span>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between h-20 shadow-md">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Avg Package</span>
                <span className="text-sm font-bold text-white">{data.placementStats.averagePackage}</span>
              </div>
              <div className="bg-[#0c0c10] border border-zinc-900 p-4 rounded-2xl flex flex-col justify-between h-20 shadow-md">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Students</span>
                <span className="text-sm font-bold text-white">{data.studentsCount}</span>
              </div>
            </div>
          )}

           {/* Navigation tabs wrapper */}
          <div className="border-b border-zinc-950 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={
                  activeTab === tab.id && data?.theme
                    ? { borderColor: data.theme.brandColor, color: "#ffffff" }
                    : {}
                }
                className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider select-none transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? data?.theme ? "" : "border-blue-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-350"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-80">
            {renderTabContent()}
          </div>

        </section>

        {/* RIGHT COLUMN: Sidebar stats panel and ratings scorecard */}
        <aside className="space-y-6">
          
          {/* Action Hub Panel */}
          <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Interactive Actions</h3>
            
            <div className="space-y-3">
              {/* Save */}
              <div className="flex justify-between items-center text-xs p-3 bg-[#111116] rounded-xl border border-zinc-850 h-12">
                <span className="text-zinc-500 font-medium">Bookmark list</span>
                <SaveButton collegeId={college.id} />
              </div>
              
              {/* Compare link */}
              <Link
                href={`/compare?collegeId1=${college.id}`}
                className="w-full text-center py-3 text-xs font-bold bg-[#111116] hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-755 text-zinc-300 hover:text-white rounded-xl transition-all block"
              >
                Compare Institutions
              </Link>

              {/* Predict chances */}
              <Link
                href={`/predictor?exam=${isFlagship ? (college.name === "Vellore Institute of Technology" ? "VITEEE" : college.name === "Anna University" || college.name === "Sathyabama Institute of Science and Technology" ? "TNEA" : college.name === "SRM Institute of Science and Technology" ? "SRMJEEE" : college.name.includes("IIT") ? "JEE Advanced" : "JEE Main") : "JEE Main"}`}
                style={data?.theme ? { backgroundColor: `${data.theme.brandColor}15`, borderColor: `${data.theme.brandColor}30`, color: data.theme.brandText } : {}}
                className="w-full text-center py-3 text-xs font-bold bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-xl transition-all block shadow-[0_0_15px_rgba(59,130,246,0.05)]"
              >
                Predict Admission Trajectory
              </Link>

              {/* Apply now */}
              <button
                onClick={handleApply}
                className="w-full text-center py-3 text-xs font-black bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Campus Orbit Scorecard */}
          {isFlagship && data && (
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-950 pb-3">
                <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Campus Orbit Score</h3>
                <span 
                  style={data?.theme ? { color: data.theme.brandText, backgroundColor: `${data.theme.brandColor}15`, borderColor: `${data.theme.brandColor}30` } : {}}
                  className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-md"
                >
                  {data.scorecard.overall} / 10
                </span>
              </div>
              
              <div className="space-y-3.5">
                {[
                  { label: "Academics", score: data.scorecard.academics },
                  { label: "Placements", score: data.scorecard.placements },
                  { label: "Research", score: data.scorecard.research },
                  { label: "Innovation", score: data.scorecard.innovation },
                  { label: "Campus Life", score: data.scorecard.campusLife },
                  { label: "Infrastructure", score: data.scorecard.infrastructure },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-zinc-450">{item.label}</span>
                      <span className="font-mono text-zinc-300">{item.score} / 10</span>
                    </div>
                    {/* Visual meter bar */}
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={data?.theme ? { 
                          background: `linear-gradient(to right, ${data.theme.brandColor}, ${data.theme.brandAccent})`,
                          width: `${item.score * 10}%`
                        } : { width: `${item.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rankings Widget */}
          {isFlagship && data && (
            <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-5 shadow-2xl space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase border-b border-zinc-950 pb-3">Ranking Accolades</h3>
              <div className="space-y-3.5">
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-blue-400 tracking-wider">NIRF Rankings 2025</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {data.nirfRankings.map((rank, idx) => (
                      <div key={idx} className="bg-[#111116] border border-zinc-850 p-2 rounded-xl text-center flex flex-col justify-center">
                        <span className="text-[9px] text-zinc-500 font-semibold uppercase">{rank.category}</span>
                        <span className="font-mono text-xs font-bold text-white mt-0.5">{rank.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-950 pt-3">
                  <span className="text-[9px] font-extrabold uppercase text-purple-400 tracking-wider">QS World Rankings 2026</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {data.qsRankings.map((rank, idx) => (
                      <div key={idx} className="bg-[#111116] border border-zinc-850 p-2 rounded-xl text-center flex flex-col justify-center">
                        <span className="text-[9px] text-zinc-500 font-semibold uppercase">{rank.category}</span>
                        <span className="font-mono text-xs font-bold text-white mt-0.5">{rank.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </aside>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-12 mt-auto relative z-10 text-center text-[10px] font-medium text-zinc-650">
        <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
      </footer>
    </div>
  );
}
