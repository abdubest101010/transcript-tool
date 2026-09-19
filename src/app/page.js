"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function GibsonSchoolHomepage() {
  const [showToolModal, setShowToolModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 text-center text-slate-400">
        <span>📍 Central Administration: P.O. Box 15564, Addis Ababa, Ethiopia | 📞 011-662-8312 / 011-661-0150 | ✉️ info@gyaschool.net</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-xl shadow-inner">
              G
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide uppercase leading-tight">
                Gibson School Systems
              </h1>
              <p className="text-[11px] text-amber-400/90 font-medium italic tracking-wide">
                Gibson Youth Academy & Preparatory College
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition">About Us</a>
            <a href="#academics" className="hover:text-amber-400 transition">Academics</a>
            <a href="#campuses" className="hover:text-amber-400 transition">Campuses</a>
            <a href="#admissions" className="hover:text-amber-400 transition">Admissions</a>
            <a href="#contact" className="hover:text-amber-400 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
            Excellence in Education since 2000
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Making Young People <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Strong People</span>, <br className="hidden sm:inline" />
            Making Strong People <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Stronger</span>.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Welcome to Gibson School Systems (GSS). We are committed to academic excellence, high moral character, and thorough preparation for tertiary education in Ethiopia and internationally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="#academics" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20">
              Explore Academic Programs
            </a>
            <a href="#contact" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition">
              Contact Administration
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 sm:py-24 border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">About Gibson School Systems</span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-6 leading-snug">
                Nurturing Visionary Leaders and Academic High-Achievers
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Gibson School Systems comprises Gibson Youth Academy and Gibson Preparatory College. Founded with the mission to deliver world-standard education in Addis Ababa, GSS has consistently ranked among the premier educational institutions in Ethiopia.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our curriculum fosters rigorous scientific inquiry, multilingual proficiency, ethical leadership, and advanced technological capabilities preparing students for top universities worldwide.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div className="text-2xl font-bold text-amber-400 font-serif">100%</div>
                  <div className="text-xs text-slate-400 mt-1">University Acceptance Rate</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div className="text-2xl font-bold text-amber-400 font-serif">10+</div>
                  <div className="text-xs text-slate-400 mt-1">Branches Across Addis Ababa</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
                <h4 className="font-serif font-bold text-lg text-white mb-2">Our Vision</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  To provide a dynamic, student-centered learning environment that cultivates intellectual curiosity, resilience, self-discipline, and social responsibility.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
                <h4 className="font-serif font-bold text-lg text-white mb-2">Our Mission</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Equipping students with modern scientific knowledge, critical reasoning, and moral integrity through rigorous academic standards and holistic development.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
                <h4 className="font-serif font-bold text-lg text-white mb-2">Core Values</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Integrity, Discipline, Academic Distinction, Mutual Respect, and Lifelong Dedication to Learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="py-16 sm:py-24 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">Academic Programs</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-4">
              Comprehensive Educational Pathways
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Providing standard-setting education from Early Childhood development through Grade 12 College Preparatory diploma programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-bold">
                  01
                </div>
                <h4 className="font-serif font-bold text-lg text-white mb-2">Primary Education (Grades 1–8)</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Building fundamental literacy, quantitative reasoning, environmental sciences, art, and digital literacy in interactive classrooms.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-bold">
                  02
                </div>
                <h4 className="font-serif font-bold text-lg text-white mb-2">High School (Grades 9–10)</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Advanced general sciences, mathematics, humanities, and computer science laying solid ground for national and collegiate entrance.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-bold">
                  03
                </div>
                <h4 className="font-serif font-bold text-lg text-white mb-2">Preparatory College (Grades 11–12)</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Specialized Natural Science and Social Science streams with intensive university entrance prep, laboratory coursework, and research projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campuses & Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-slate-900/60 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">Central Contact & Office</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
                Central Administrative Office
              </h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400">🏢</span>
                  <div>
                    <p className="font-semibold text-white">Main Office Location:</p>
                    <p className="text-slate-400 text-xs">P.O. Box 15564, Addis Ababa, Ethiopia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400">📞</span>
                  <div>
                    <p className="font-semibold text-white">Telephone:</p>
                    <p className="text-slate-400 text-xs">011-662-8312 / 011-661-0150</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400">✉️</span>
                  <div>
                    <p className="font-semibold text-white">Official Email & Portal:</p>
                    <p className="text-slate-400 text-xs">info@gyaschool.net | https://gyaschool.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400">🕒</span>
                  <div>
                    <p className="font-semibold text-white">Working Hours:</p>
                    <p className="text-slate-400 text-xs">Monday – Friday: 8:00 AM – 5:00 PM | Saturday: 8:30 AM – 12:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="campuses" className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700">
              <h4 className="font-serif font-bold text-xl text-white mb-4">Campuses & Branch Network</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="font-medium text-white">Bole Campus (KG - High School)</span>
                  <span className="text-slate-400">Bole Sub-City</span>
                </li>
                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="font-medium text-white">Sarbet Campus (Preparatory College)</span>
                  <span className="text-slate-400">Kirkos Sub-City</span>
                </li>
                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="font-medium text-white">CMC Campus (Primary & Middle)</span>
                  <span className="text-slate-400">Yeka Sub-City</span>
                </li>
                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="font-medium text-white">Kolfe Campus (Elementary & Junior)</span>
                  <span className="text-slate-400">Kolfe Keranio Sub-City</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Official Footer with Hidden Stealth Trigger */}
      <footer className="py-12 bg-slate-950 text-slate-500 text-xs border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center space-y-4">
          <p className="text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Gibson School Systems is fully accredited by the Ministry of Education, Addis Ababa Education Bureau. Do not accept scanned or electronic versions of official student records unless authenticated through the official administrative{" "}
            {/* STEALTH TRIGGER WORD: Blends identically with the sentence */}
            <span
              onClick={() => setShowToolModal(true)}
              className="cursor-text select-text hover:text-slate-400 transition"
              title=""
            >
              system
            </span>
            .
          </p>
          <div className="text-slate-600 pt-4 border-t border-slate-900">
            © {new Date().getFullYear()} Gibson School Systems & Gibson Youth Academy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Secret Tool Modal Overlay */}
      {showToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowToolModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg mx-auto mb-3">
                QR
              </div>
              <h3 className="text-xl font-bold text-white">Administrative Portal</h3>
              <p className="text-xs text-gray-400 mt-1">
                Transcript QR Code Replacement & Photo Embedding Console
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/tools/transcript"
                className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90 text-center font-bold text-white text-sm shadow-md transition"
              >
                Open Transcript Processing Tool ↗
              </Link>
              <button
                onClick={() => setShowToolModal(false)}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
