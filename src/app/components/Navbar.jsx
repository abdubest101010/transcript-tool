"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed mx-auto border-b border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212]/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
            QR
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Transcript<span className="text-primary-400">Tool</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
}
