"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on path change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-zinc-900/60 bg-[#08080a]/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white group">
            <div className="w-5 h-5 rounded-full border border-blue-500/80 flex items-center justify-center p-0.5 group-hover:border-blue-400/80 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-blue-600 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:to-white transition-all duration-350">
              Campus Orbit
            </span>
          </Link>

          {/* DESKTOP NAV LINKS WITH SPRING PILL ANIMATION */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Explore" },
              { href: "/compare", label: "Comparisons" },
              { href: "/predictor", label: "🎯 Predictor" },
              { href: "/discussions", label: "💬 Community" },
            ].map((item) => {
              const isActive = 
                item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full tracking-wide transition-colors duration-200 z-10 ${
                    isActive ? "text-white" : "text-zinc-450 hover:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-zinc-900/80 border border-zinc-800/50 rounded-full -z-10 shadow-inner"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* AUTHENTICATION STATE */}
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-zinc-900/40 animate-pulse" />
          ) : user ? (
            /* USER DROPDOWN */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-zinc-800 bg-[#0c0c10] hover:bg-zinc-900/60 text-zinc-300 hover:text-white rounded-full select-none cursor-pointer transition-all duration-200"
              >
                <span>{user.name}</span>
                <svg
                  className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-250 ${
                    dropdownOpen ? "transform rotate-180 text-white" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown Menu Container with Framer Motion Animation */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-[#0c0c10]/95 border border-zinc-850/80 rounded-xl shadow-2xl p-1.5 space-y-0.5 z-50 backdrop-blur-md"
                  >
                    <Link
                      href="/profile"
                      className="flex w-full items-center px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-lg transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard/saved"
                      className="flex w-full items-center px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-lg transition-colors"
                    >
                      Saved Colleges
                    </Link>
                    <Link
                      href="/compare"
                      className="flex w-full items-center px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-lg transition-colors"
                    >
                      Compare Colleges
                    </Link>
                    <div className="h-px bg-zinc-900/50 my-1 mx-1" />
                    <button
                      onClick={logout}
                      className="flex w-full items-center px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/10 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* SIGN IN & SIGN UP BUTTONS */
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-xs font-semibold bg-white text-black hover:bg-zinc-200 rounded-full transition-all duration-350 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-450 hover:text-white rounded-lg hover:bg-zinc-900/30 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-900 bg-[#08080a] px-6 py-4 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  pathname === "/" ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                Explore
              </Link>
              <Link
                href="/compare"
                className={`text-sm font-medium ${
                  pathname.startsWith("/compare") ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                Comparisons
              </Link>
              <Link
                href="/predictor"
                className={`text-sm font-medium ${
                  pathname.startsWith("/predictor") ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                🎯 Predictor
              </Link>
              <Link
                href="/discussions"
                className={`text-sm font-medium ${
                  pathname.startsWith("/discussions") ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                💬 Community
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium ${
                  pathname.startsWith("/profile") ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                My Profile
              </Link>
            </nav>

            <div className="h-px bg-zinc-900" />

            {loading ? (
              <div className="w-full h-8 rounded-lg bg-zinc-900 animate-pulse" />
            ) : user ? (
              <div className="space-y-3">
                <div className="text-xs text-zinc-500 font-semibold px-1">Logged in as {user.name}</div>
                <button
                  onClick={logout}
                  className="w-full text-center py-2.5 text-xs font-semibold bg-red-950/20 text-red-400 rounded-lg hover:bg-red-950/40 border border-red-900/10 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-all border border-zinc-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
