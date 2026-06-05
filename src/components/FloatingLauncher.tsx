"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FloatingLauncher() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Suppress display on authentication paths to preserve focus
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const items = [
    {
      label: "College Predictor",
      mobileLabel: "Predictor",
      icon: "🎯",
      href: "/predictor",
      color: "from-blue-600/10 to-blue-500/20 text-blue-400 border-blue-500/30",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      label: "Discussions Feed",
      mobileLabel: "Discussions",
      icon: "💬",
      href: "/discussions",
      color: "from-emerald-600/10 to-emerald-500/20 text-emerald-400 border-emerald-500/30",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
  ];

  return (
    <>
      {/* DESKTOP FLOATING BAR (Fixed Right) */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex items-center justify-end group cursor-pointer"
            >
              {/* Expandable label container */}
              <motion.div
                initial={false}
                animate={{
                  width: isHovered ? "auto" : 0,
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? -12 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="overflow-hidden whitespace-nowrap pointer-events-none"
              >
                <span className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest bg-[#0c0c10]/95 border border-zinc-850/80 text-zinc-300 backdrop-blur-md shadow-lg block">
                  {item.label}
                </span>
              </motion.div>

              {/* Icon Circle */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} border backdrop-blur-md transition-all duration-300 shadow-2xl relative`}
                style={{
                  boxShadow: isHovered ? `0 0 20px 2px ${item.glowColor}` : "none",
                }}
              >
                <span className="text-lg select-none">{item.icon}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* MOBILE FLOATING DOCK (Bottom Centered) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px] px-4">
        <div className="bg-[#0c0c10]/90 border border-zinc-850/80 backdrop-blur-lg rounded-full py-2 px-3 shadow-2xl flex items-center justify-around">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-zinc-900/40 active:bg-zinc-900/60 transition-all text-xs font-bold text-zinc-300 group"
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 group-hover:text-white transition-colors">
                {item.mobileLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
