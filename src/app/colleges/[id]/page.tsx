import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";
import Navbar from "@/components/Navbar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  // In Next.js 15+, dynamic route parameters must be awaited before access
  const { id } = await params;

  // Fetch college details along with its courses and reviews from the database
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      reviews: true,
    },
  });

  // If the college does not exist in the database, render the Next.js notFound page
  if (!college) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col">
      {/* HEADER / NAVIGATION BAR */}
      <Navbar />

      {/* BACK NAVIGATION */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-8">
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
      <main className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        
        {/* LEFT COLUMN: Hero details, Image, Description */}
        <section className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded tracking-wider">
                {college.rating >= 4.7 ? "Top Tier" : "Accredited"}
              </span>
              <span className="text-xs text-zinc-550 font-mono">ID: {college.id}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {college.name}
            </h1>

            {/* Ratings, Stats, and Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-950 pb-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-450">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(college.rating) ? "fill-current" : "stroke-current fill-none"}`}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-zinc-200">{college.rating.toFixed(1)}</span>
                  <span>({college.reviews.length} reviews)</span>
                </div>

                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{college.location}</span>
                </div>
              </div>

              <SaveButton collegeId={college.id} />
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-900 shadow-2xl bg-zinc-950">
            {college.image ? (
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                No image available
              </div>
            )}
          </div>

          {/* About / Description */}
          <article className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-white uppercase border-b border-zinc-900 pb-2">
              About the Institution
            </h2>
            <p className="text-zinc-350 text-sm leading-relaxed whitespace-pre-line">
              {college.description}
            </p>
          </article>

          {/* COURSES OFFERED SECTION */}
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-bold tracking-tight text-white uppercase border-b border-zinc-900 pb-2">
              Programs & Courses Offered
            </h2>
            {college.courses.length === 0 ? (
              <p className="text-xs text-zinc-550">No courses listed at this time.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {college.courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="bg-[#0c0c10] border border-zinc-900 hover:border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-white text-sm">{course.name}</h3>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-1">Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-950 pt-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Annual Fees</span>
                      <span className="font-mono text-xs font-semibold text-blue-400">${course.fees.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>

        {/* RIGHT COLUMN: Quick Info Panel, Student Reviews */}
        <aside className="space-y-8">
          
          {/* Quick Stats Widget */}
          <div className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Quick Stats</h3>
            
            <div className="space-y-3.5 divide-y divide-zinc-950">
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500 font-medium">Average Tuition</span>
                <span className="font-mono text-white font-semibold">${college.fees.toLocaleString()} / year</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-zinc-500 font-medium">Acceptance Level</span>
                <span className="text-white font-semibold">Competitive</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-zinc-500 font-medium">Student Reviews</span>
                <span className="text-white font-semibold">{college.reviews.length} total</span>
              </div>
            </div>

            <button className="w-full text-center py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              Apply Now
            </button>
          </div>

          {/* REVIEWS SECTION */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase block mb-1">
              Student Reviews
            </h2>

            {college.reviews.length === 0 ? (
              <div className="border border-dashed border-zinc-900 rounded-xl p-6 text-center text-zinc-550 text-xs">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              <div className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="bg-[#0c0c10] border border-zinc-900 rounded-xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "stroke-current fill-none"}`}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-550">Verified Student</span>
                    </div>
                    <p className="text-zinc-350 text-xs leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600" />
              </div>
              <span>Campus Orbit</span>
            </Link>
            <p className="text-xs text-zinc-550 leading-relaxed max-w-sm">
              Elevating the academic search experience through precise data and sophisticated discovery tools.
            </p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs font-semibold text-zinc-450">
            <Link href="/" className="hover:text-white transition-colors">About</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Help Center</span>
            <span className="hover:text-white transition-colors cursor-pointer">API</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-zinc-950 flex items-center justify-between text-[10px] font-medium text-zinc-650">
          <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
