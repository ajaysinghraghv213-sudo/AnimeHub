"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RegisterCTA() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    setIsLoggedOut(!localStorage.getItem("accessToken"));
  }, []);

  if (!isLoggedOut) return null;

  return (
    <Link
      href="/register"
      className="group inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(105deg,#ec4899_0%,#a855f7_52%,#06b6d4_100%)] px-7 py-3 font-bold text-white shadow-[0_10px_35px_rgba(236,72,153,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_42px_rgba(34,211,238,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
    >
      Create an account
      <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
        -&gt;
      </span>
    </Link>
  );
}