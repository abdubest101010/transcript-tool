"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed mx-auto border-b border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212]/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
            QR
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Gibson<span className="text-primary-400">Tools</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/tools/store-image"
            className={`text-xs sm:text-sm font-medium transition px-3 py-1.5 rounded-lg ${
              pathname === "/tools/store-image"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Direct Image Store
          </Link>
          <Link
            href="/tools/transcript"
            className={`text-xs sm:text-sm font-medium transition ${
              pathname === "/tools/transcript"
                ? "text-primary-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            QR Tool
          </Link>
          <Link
            href="/tools/result-transfer"
            className={`text-xs sm:text-sm font-medium transition ${
              pathname === "/tools/result-transfer"
                ? "text-primary-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Table Copier
          </Link>
        </div>
      </div>
    </nav>
  );
}
