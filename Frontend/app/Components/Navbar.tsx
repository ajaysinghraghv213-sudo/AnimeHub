"use client";

import Link from "next/link";
import logout from "../function/logout";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Liked Posts", href: "/main/likedposts" },
  { name: "Posts", href: "/main/posts" },
  { name: "Profile", href: "/main/profile" },
  { name: "Chats", href: "/chat" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
 const [access, setAccess] = useState<string | null>(null);


 useEffect(() => {
   setAccess(localStorage.getItem("accessToken"));
 }, []);

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-pink-500 bg-[#0b0d24]/95 shadow-[0_4px_0_rgba(139,92,246,0.35)] backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
            <span className="text-xl sm:text-2xl font-black italic tracking-tight text-white drop-shadow-[2px_2px_0_#ec4899]">
              AnimeHub
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-bold text-indigo-200 transition-colors hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {access ? (
              <button
                onClick={() => logout()}
                className="font-bold text-indigo-200 transition-colors hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="font-bold text-indigo-200 transition-colors hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
              >
                Login
              </Link>
            )}
            <Link
              href="/main/createpost"
              className="rounded-full border-2 border-red-400 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 px-4 py-2 font-bold text-white shadow-[3px_3px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Write Post
            </Link>
            <Link
              href="/main/selfposts"
              className="rounded-full border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-4 py-2 font-bold text-white shadow-[3px_3px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              My Posts
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md border-2 border-violet-500/60 p-2 text-cyan-200 transition-colors hover:border-pink-400 hover:bg-pink-400/10 hover:text-pink-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

     




{/* Mobile Menu */}
<div
  id="mobile-menu"
  className={`md:hidden absolute inset-x-0 top-full transition-[visibility] duration-300 ${
    isOpen ? "visible" : "invisible"
  }`}
>
  {/* Backdrop */}
  <div
    onClick={() => setIsOpen(false)}
    aria-hidden="true"
    className={`fixed inset-x-0 top-14 bottom-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
      isOpen ? "opacity-100" : "opacity-0"
    }`}
  />

  {/* Panel */}
  <div
    className={`relative grid transition-[grid-template-rows] duration-300 ease-out ${
      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
    }`}
  >
    <div className="overflow-hidden">
      <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b-2 border-pink-500 bg-[linear-gradient(180deg,#12143a_0%,#191349_100%)] shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
        <div className="px-4 pt-4 pb-6">
          {/* Section: Navigate */}
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300/70">
            Navigate
          </p>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex min-h-12 items-center justify-between rounded-xl border-l-4 border-transparent px-3 font-bold text-indigo-100 transition active:bg-pink-500/20 hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  <span>{link.name}</span>
                  <svg
                    className="h-4 w-4 text-violet-400 transition-transform group-hover:translate-x-1 group-hover:text-pink-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="my-5 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          {/* Section: Your space */}
          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300/70">
            Your Space
          </p>
          <div className="space-y-3">
            <Link
              href="/main/createpost"
              onClick={() => setIsOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-4 font-bold text-white shadow-[3px_3px_0_#22d3ee] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
              Write Post
            </Link>

            <Link
              href="/main/selfposts"
              onClick={() => setIsOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-violet-400/70 bg-violet-500/10 px-4 font-bold text-violet-100 transition active:bg-violet-500/30 hover:border-pink-400 hover:bg-pink-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 012 2v14l-7-3-7 3V6a2 2 0 012-2z" />
              </svg>
              My Posts
            </Link>
          </div>

          {/* Auth */}
          <div className="mt-5 border-t-2 border-dashed border-violet-500/40 pt-5">
            {access ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-rose-400/70 bg-rose-500/10 px-4 font-bold text-rose-200 transition active:bg-rose-500/30 hover:bg-rose-500/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-cyan-300 bg-cyan-300/10 px-4 font-bold text-cyan-200 transition active:bg-cyan-300/30 hover:bg-cyan-300/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</nav>
  );
}


