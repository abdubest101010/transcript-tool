"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function GibsonSchoolDashboard() {
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);

  // Keyboard shortcut (Ctrl + Shift + A) to open tools
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        setShowToolModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased selection:bg-[#0F4392] selection:text-white">
      {/* 1. TOP HEADER & NAVIGATION (Page 1) */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <a href="https://gyaschool.com/" className="inline-block">
                <img
                  src="https://gyaschool.com/wp-content/uploads/2023/09/1-1.png"
                  alt="Gibson School Systems Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#0F4392] p-2 focus:outline-none"
                aria-label="Toggle Navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Right Side Header Items */}
            <div className="flex flex-col items-end gap-2">
              {/* Red Utility Pill Badges (EMPLOYMENT, CALENDAR, ALUMNI, LOGIN) */}
              <div className="hidden lg:flex items-center gap-2">
                <a
                  href="https://gyaschool.com/?page_id=27"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#DD1717] hover:bg-[#c01414] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded transition"
                >
                  Employment
                </a>
                <a
                  href="https://gyaschool.com/events"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#DD1717] hover:bg-[#c01414] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded transition"
                >
                  Calendar
                </a>
                <a
                  href="https://gyaschool.com/?page_id=123"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#DD1717] hover:bg-[#c01414] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded transition"
                >
                  Alumni
                </a>
                <a
                  href="https://elearning.gyaschool.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#DD1717] hover:bg-[#c01414] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded transition"
                >
                  Login
                </a>
              </div>

              {/* Main Desktop Horizontal Nav Bar */}
              <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold tracking-wider uppercase">
                <a href="#" className="text-[#DD1717] border-b-2 border-[#DD1717] pb-0.5">
                  Home
                </a>

                {/* About Us with Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                >
                  <button className="text-[#0F4392] hover:text-[#DD1717] flex items-center gap-1 transition pb-0.5">
                    About Us
                    <svg className="w-3.5 h-3.5 fill-current opacity-70" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>

                  {aboutDropdownOpen && (
                    <div className="absolute top-full left-0 w-60 bg-white border border-slate-200 shadow-xl rounded-md py-2 z-50 normal-case text-xs">
                      <a href="https://gyaschool.com/?page_id=31" className="block px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold">
                        History
                      </a>
                      <a href="https://gyaschool.com/?page_id=33" className="block px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold">
                        Clubs
                      </a>
                      <div className="border-t border-slate-100 my-1"></div>
                      <div className="px-4 py-1 text-[11px] font-bold text-[#0F4392] uppercase tracking-wider">
                        Campuses
                      </div>
                      <a href="https://gyaschool.com/?page_id=35" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Bole Campus</a>
                      <a href="https://gyaschool.com/?page_id=36" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Bole 24 Campus</a>
                      <a href="https://gyaschool.com/?page_id=37" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">CMC Campus</a>
                      <a href="https://gyaschool.com/?page_id=677" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Jigjiga Campus</a>
                      <a href="https://gyaschool.com/?page_id=38" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Kolfe Campus</a>
                      <a href="https://gyaschool.com/?page_id=39" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Lafto Campus</a>
                      <a href="https://gyaschool.com/?page_id=40" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Mekanessa Campus</a>
                      <a href="https://gyaschool.com/?page_id=41" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Sarbet Campus</a>
                      <div className="border-t border-slate-100 my-1"></div>
                      <div className="px-4 py-1 text-[11px] font-bold text-[#0F4392] uppercase tracking-wider">
                        Programs
                      </div>
                      <a href="https://gyaschool.com/?page_id=324" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">French Language</a>
                      <a href="https://gyaschool.com/?page_id=325" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">Arabic Language</a>
                      <a href="https://gyaschool.com/?page_id=327" className="block px-6 py-1.5 hover:bg-slate-50 text-slate-600">ASP</a>
                    </div>
                  )}
                </div>

                <a href="#contact-section" className="text-[#0F4392] hover:text-[#DD1717] transition pb-0.5">
                  Contact Us
                </a>
                <a href="https://gyaschool.com/?page_id=30" className="text-[#0F4392] hover:text-[#DD1717] transition pb-0.5">
                  Admission
                </a>
                <a href="https://gyaschool.com/?page_id=677" className="text-[#0F4392] hover:text-[#DD1717] transition pb-0.5">
                  Jigjiga Campus
                </a>
                <a href="https://gyaschool.com/?page_id=1814" className="text-[#0F4392] hover:text-[#DD1717] transition pb-0.5">
                  Curriculum
                </a>
              </nav>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 text-sm font-semibold">
              <a href="#" className="block py-1 text-[#DD1717]">Home</a>
              <a href="https://gyaschool.com/?page_id=31" className="block py-1 text-[#0F4392]">About Us</a>
              <a href="#contact-section" className="block py-1 text-[#0F4392]">Contact Us</a>
              <a href="https://gyaschool.com/?page_id=30" className="block py-1 text-[#0F4392]">Admission</a>
              <a href="https://gyaschool.com/?page_id=677" className="block py-1 text-[#0F4392]">Jigjiga Campus</a>
              <a href="https://gyaschool.com/?page_id=1814" className="block py-1 text-[#0F4392]">Curriculum</a>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <a href="https://gyaschool.com/?page_id=27" className="bg-[#DD1717] text-white text-xs px-3 py-1 rounded">Employment</a>
                <a href="https://gyaschool.com/events" className="bg-[#DD1717] text-white text-xs px-3 py-1 rounded">Calendar</a>
                <a href="https://gyaschool.com/?page_id=123" className="bg-[#DD1717] text-white text-xs px-3 py-1 rounded">Alumni</a>
                <a href="https://elearning.gyaschool.com/" className="bg-[#DD1717] text-white text-xs px-3 py-1 rounded">Login</a>
              </div>
            </div>
          )}
        </div>

        {/* Blue decorative top divider band with subtle wave */}
        <div className="h-2 bg-[#0F4392] w-full"></div>
      </header>

      {/* 2. HERO SCIENCE LAB IMAGE WITH OVERLAPPING WAVE (Page 1) */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[540px]">
          <img
            src="https://gyaschool.com/wp-content/uploads/2023/09/3W3A6714-scaled.jpg"
            alt="Gibson School Systems Science Laboratory Students"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Wave divider at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-10 sm:h-16 text-[#0F4392] fill-current"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <path
              opacity="0.33"
              d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V100h1000V59.7c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
            />
            <path
              opacity="0.66"
              d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V100h1000V36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
            />
            <path d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,100,0,100h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z" />
          </svg>
        </div>
      </section>

      {/* 3. OUR VISION, OUR MISSION, OUR VALUES (Page 1) */}
      <section className="bg-[#0F4392] text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="max-w-[1000px] mx-auto space-y-12">
          {/* Our Vision */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mb-3">
              Our Vision
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed font-normal max-w-3xl mx-auto">
              Enabling the rising generation, by way of quality education, so as to become productive, socially competent, problem solvers, Developing well -rounded personalities with humane characters, thereby, producing full-fledged, matured Ethiopian citizens who can successfully live and work in peace and harmony both at home and internationally.
            </p>
          </div>

          {/* Our Mission */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mb-3">
              Our Mission
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed font-normal max-w-3xl mx-auto">
              Based on the curriculum and policy of the land, providing adequate knowledge, skills, information, talent, attitudes, vision and values for those students enrolled in all grades and levels which will assist them in the building of the nation.
            </p>
          </div>

          {/* Our Values */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mb-3">
              Our Values
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed font-normal max-w-3xl mx-auto">
              Patriotism , decisiveness, honesty, patience, freedom of expression, commitment, equity, effectiveness, quality, participation, excellence, punctuality and strong work ethic.
            </p>
          </div>
        </div>

        {/* Pagination arrows */}
        <div className="max-w-[1000px] mx-auto flex items-center justify-start gap-2 pt-6 text-xs text-white/70">
          <span className="cursor-pointer hover:text-white">&lt;</span>
          <span className="cursor-pointer hover:text-white">&gt;</span>
        </div>
      </section>

      {/* 4. NEWS SECTION (Pages 1 & 2) */}
      <section className="py-12 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000249] mb-8">
            News
          </h2>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Image */}
            <div className="md:col-span-6 overflow-hidden rounded shadow-sm border border-slate-100">
              <img
                src="https://gyaschool.com/wp-content/uploads/2024/05/picture2___16165810797.webp"
                alt="Manhattanville University Presented The 2024 President's Prize to Edelawit Fikru Yishak"
                className="w-full h-auto object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* Text details */}
            <div className="md:col-span-6 flex flex-col justify-start">
              <h3 className="text-lg sm:text-xl font-bold text-[#DD1717] hover:underline cursor-pointer leading-snug">
                <a href="https://gyaschool.com/?p=1839" target="_blank" rel="noreferrer">
                  Manhattanville University Presented The 2024 President’s Prize to Edelawit Fikru Yishak
                </a>
              </h3>
              <span className="text-xs text-slate-400 mt-2 block">
                May 25, 2024
              </span>
              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                Manhattanville University Presented The 2024 President’s Prize to Edelawit Fikru Yishak Manhattanville University Presented The 2024 President’s Prize to Edelawit Fikru Yishak (former GSS student). Edelawit, who majored in Computer
              </p>
              <div className="mt-4">
                <a
                  href="https://gyaschool.com/?p=1839"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#0F4392] hover:text-[#DD1717] font-semibold"
                >
                  Read More »
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHARACTER COUNTS SALUTING STUDENT BANNER (Page 2) */}
      <section className="w-full bg-white">
        <div className="w-full h-[240px] sm:h-[360px] lg:h-[440px] overflow-hidden">
          <img
            src="https://gyaschool.com/wp-content/uploads/2023/09/20230429204909_3W3A0711-scaled-e1695110424370-1024x401.jpg"
            alt="Gibson School Student Saluting"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Clean Light Blue Bar directly below photo */}
        <div className="bg-[#F0F6FF] py-6 text-center border-y border-blue-100">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F4392] tracking-wider uppercase">
            2024/2025 CHARACTER COUNTS PROGRAM TRAITS
          </h2>
        </div>
      </section>

      {/* 6. CHARACTER TRAITS 2x2 GRID WITH FAINT BACKGROUND (Pages 2 & 3) */}
      <section
        className="py-16 bg-white relative bg-no-repeat bg-right-bottom"
        style={{
          backgroundImage: "url('https://gyaschool.com/wp-content/uploads/2023/09/Background-Pic.png')",
          backgroundSize: "contain",
        }}
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl">
            {/* September */}
            <div>
              <h3 className="text-lg font-bold text-[#000249] leading-tight">
                September:
                <br />
                <span className="text-[#0F4392]">READINESS</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The state of being fully prepared for something or to do something.
              </p>
            </div>

            {/* October */}
            <div>
              <h3 className="text-lg font-bold text-[#000249] leading-tight">
                October:
                <br />
                <span className="text-[#0F4392]">DETERMINATION</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The quality that involves firmness and perseverance to achieve goals and overcome obstacle..
              </p>
            </div>

            {/* November */}
            <div>
              <h3 className="text-lg font-bold text-[#000249] leading-tight">
                November:
                <br />
                <span className="text-[#0F4392]">TRUST WORTHINESS</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The ability to be relied on as honest or truthful.
              </p>
            </div>

            {/* December */}
            <div>
              <h3 className="text-lg font-bold text-[#000249] leading-tight">
                December:
                <br />
                <span className="text-[#0F4392]">DIPLOMACY</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The art of conducting negotiations, agreements, and relations between two parties.
              </p>
            </div>
          </div>

          {/* All CCP Traits Button */}
          <div className="mt-12 text-left sm:text-center max-w-3xl">
            <a
              href="https://gyaschool.com/?page_id=923"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#0F4392] hover:bg-[#000249] text-white text-xs font-bold px-6 py-2.5 rounded shadow transition"
            >
              All CCP Traits
            </a>
          </div>
        </div>
      </section>

      {/* 7. THREE QUICK ACTION CARDS (Page 3) */}
      <section className="bg-[#F0F4F8] border-y border-slate-200 py-8">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-center">
            {/* Box 1 */}
            <div className="py-4 md:py-0 md:px-6">
              <h4 className="text-sm font-bold text-[#0F4392] tracking-wider uppercase">
                VISIT OUR SCHOOL
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                We employ only the best of the best
              </p>
            </div>

            {/* Box 2 */}
            <div className="py-4 md:py-0 md:px-6">
              <h4 className="text-sm font-bold text-[#0F4392] tracking-wider uppercase">
                INQUIRE
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                info@gyaschool.com
              </p>
            </div>

            {/* Box 3 */}
            <div className="py-4 md:py-0 md:px-6">
              <h4 className="text-sm font-bold text-[#0F4392] tracking-wider uppercase">
                ONLINE APPLICATION
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Send you CV hr@gyaschool.com for job vacancies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SOLID BLUE STATS & FACTS 6-BOX GRID (Page 3) */}
      <section className="bg-[#0F4392] text-white py-16">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Col 1, Row 1: FOUNDED 2000 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DD1717] flex items-center justify-center text-white flex-shrink-0 text-lg shadow">
                📅
              </div>
              <div>
                <h5 className="font-bold text-sm tracking-wide uppercase">
                  FOUNDED 2000
                </h5>
                <p className="text-xs text-slate-100 mt-1.5 leading-relaxed">
                  Gibson School Systems was founded in 2000 by Dr. Leea Gibson and Mr. Mohammed Aden.
                </p>
              </div>
            </div>

            {/* Col 2, Row 1: STUDENTS */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FDCB66] text-[#000249] flex items-center justify-center flex-shrink-0 text-lg shadow">
                📖
              </div>
              <div>
                <h5 className="font-bold text-sm tracking-wide uppercase">
                  STUDENTS
                </h5>
                <p className="text-xs text-slate-100 mt-1.5 leading-relaxed">
                  The first year, the school had 330 students, but has since grown to almost 10,000 students.
                </p>
              </div>
            </div>

            {/* Col 3, Row 1: GRADUATES */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white text-[#0F4392] flex items-center justify-center flex-shrink-0 text-lg shadow">
                🎓
              </div>
              <div>
                <h5 className="font-bold text-sm tracking-wide uppercase">
                  GRADUATES
                </h5>
                <p className="text-xs text-slate-100 mt-1.5 leading-relaxed">
                  Since Gibson School Systems uses English as the language of instruction, many of our students have received scholarships to study abroad while many others have been accepted into the top universities in Ethiopia.
                </p>
              </div>
            </div>

            {/* Col 1, Row 2: LOCATION */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DD1717] flex items-center justify-center text-white flex-shrink-0 text-lg shadow">
                📍
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-xs tracking-wide uppercase">
                    LOCATION: ADDIS ABABA, ETHIOPIA
                  </h5>
                  <p className="text-xs text-slate-100 mt-1 leading-relaxed">
                    Our head office is located along Airport Road in Bole, Addis Ababa.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-xs tracking-wide uppercase">
                    LOCATION: JIGJIGA, ETHIOPIA
                  </h5>
                  <p className="text-xs text-slate-100 mt-1 leading-relaxed">
                    Our head office is located behind Jigjiga University on the road to Wuchale.
                  </p>
                </div>
              </div>
            </div>

            {/* Col 2, Row 2: TEACHER-STUDENT: 1:5 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FDCB66] text-[#000249] flex items-center justify-center flex-shrink-0 text-lg shadow">
                🔍
              </div>
              <div>
                <h5 className="font-bold text-sm tracking-wide uppercase">
                  TEACHER-STUDENT: 1:5
                </h5>
                <p className="text-xs text-slate-100 mt-1.5 leading-relaxed">
                  We understand the importance of teacher to student ratio. That is why we strive to maintain a 1:5 ratio at all times.
                </p>
              </div>
            </div>

            {/* Col 3, Row 2: CAMPUSES / DIVISIONS */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white text-[#0F4392] flex items-center justify-center flex-shrink-0 text-lg shadow">
                🏛️
              </div>
              <div>
                <h5 className="font-bold text-sm tracking-wide uppercase">
                  CAMPUSES / DIVISIONS
                </h5>
                <p className="text-xs text-slate-100 mt-1.5 leading-relaxed">
                  Since it&#8217;s inception with a single campus in Bole, GSS now has 7 different campuses with 19 divisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHOLE CHILD APPROACH WITH WATERMARK STUDENTS (Page 3) */}
      <section
        className="py-24 bg-white relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://gyaschool.com/wp-content/uploads/2023/09/Background.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000249] uppercase tracking-wide leading-tight">
                OUR SYSTEM CAN BE
                <br />
                SUMMED UP AS
              </h2>
            </div>

            {/* Right */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#DD1717] tracking-wide">
                Whole Child Approach
              </h3>
              <p className="text-xl sm:text-2xl font-serif italic text-[#0F4392] mt-2">
                : caring about every aspect of a child.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONTACT US FORM (Page 4) */}
      <section id="contact-section" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[650px] mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000249] text-center uppercase tracking-wide mb-8">
            CONTACT US
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you. Your message has been sent to Gibson School Systems.");
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#0F4392]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#0F4392]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder=""
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#0F4392]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason
              </label>
              <select className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#0F4392] bg-white">
                <option value="General">General</option>
                <option value="Academics">Academics</option>
                <option value="Current Student">Current Student</option>
                <option value="Parents">Parents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Message"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#0F4392]"
              ></textarea>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-[#0F4392] hover:bg-[#000249] text-white text-xs font-bold uppercase tracking-wider px-8 py-2.5 rounded shadow transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 11. FOUR-COLUMN FOOTER (Page 4) */}
      <footer className="bg-[#0F4392] text-white pt-14 pb-8 relative overflow-hidden">
        {/* Top Wave Divider */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-6 text-white fill-current" viewBox="0 0 283.5 19.6" preserveAspectRatio="none">
            <path opacity="0.33" d="M0 0L0 18.8 141.8 4.1 283.5 18.8 283.5 0z" />
            <path opacity="0.33" d="M0 0L0 12.6 141.8 4 283.5 12.6 283.5 0z" />
            <path d="M0 0L0 1.2 141.8 4 283.5 1.2 283.5 0z" />
          </svg>
        </div>

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/20">
            {/* Col 1: Logo & Office */}
            <div className="space-y-3">
              <img
                src="https://gyaschool.com/wp-content/uploads/2023/09/Gray-GSS-Logo_1@4x-1024x220.png"
                alt="Gibson School Systems Logo"
                className="w-44 h-auto object-contain brightness-200"
              />
              <p className="text-xs text-slate-200 leading-relaxed pt-2">
                101 Ras-Dashen, Africa Avenue, Addis Ababa, Ethiopia
              </p>
              <p className="text-xs text-slate-200">
                <b>Phone:</b> 011 662 8312 | 011 661 8315
              </p>
              <p className="text-xs text-slate-200">
                <b>P.O Box:</b> 15564
              </p>
            </div>

            {/* Col 2: Telegram Channels */}
            <div>
              <h5 className="font-bold text-sm tracking-wider uppercase mb-3 text-[#7AD1FF]">
                Telegram Channels
              </h5>
              <ul className="text-xs space-y-1.5 text-slate-100">
                <li><a href="https://t.me/GSSKGDivision" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> KG Division</a></li>
                <li><a href="https://t.me/GSSgrade1to4" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grades 1-4 Division</a></li>
                <li><a href="https://t.me/GSSgrade5" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grade 5</a></li>
                <li><a href="https://t.me/GSSgrade6" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grade 6</a></li>
                <li><a href="https://t.me/GSSgrade7to8" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grades 7-8</a></li>
                <li><a href="https://t.me/GSSgrade_9" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grade 9</a></li>
                <li><a href="https://t.me/GSSgrade10" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grade 10</a></li>
                <li><a href="https://t.me/GSSgrade11to12" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5"><span>✈️</span> Grades 11-12</a></li>
              </ul>
            </div>

            {/* Col 3: Campuses */}
            <div>
              <h5 className="font-bold text-sm tracking-wider uppercase mb-3 text-[#7AD1FF]">
                CAMPUSES
              </h5>
              <ul className="text-xs space-y-1.5 text-slate-100">
                <li><a href="https://gyaschool.com/?page_id=35" className="hover:underline">Bole Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=36" className="hover:underline">Bole 24 Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=37" className="hover:underline">CMC Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=38" className="hover:underline">Kolfe Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=677" className="hover:underline">Jigjiga Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=39" className="hover:underline">Lafto Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=40" className="hover:underline">Mekanessa</a></li>
                <li><a href="https://gyaschool.com/?page_id=41" className="hover:underline">Sarbet Campus</a></li>
              </ul>
            </div>

            {/* Col 4: Leadership Bio & Socials */}
            <div>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                Gibson School Systems was founded in 2000 by Dr. Leea Gibson and Mr. Mohammed Aden. Dr. Leea Gibson is an American who came to Ethiopia in 1998 G.C. to join her family and contribute to the quality of education in Africa. Dr. Leea Gibson is a holder of the Ed. D (Doctorate of Education) in Educational Leadership.
              </p>
              <p className="text-xs text-slate-200 leading-relaxed mb-4">
                Mr. Mohammed Aden is a proud Ethiopian businessman who operates successfully in various sectors in Ethiopia. He has a master's degree in Economics.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <a href="https://gyaschool.com/gallery" className="hover:underline">Gallery</a>
                <span>|</span>
                <a href="https://gyaschool.com/events" className="hover:underline">Calendar</a>
                <a
                  href="https://www.facebook.com/GibsonSchoolSystems"
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-[#1877F2] text-white flex items-center justify-center ml-2 text-xs"
                >
                  f
                </a>
                <a
                  href="https://www.youtube.com/c/GibsonSchoolSystems"
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-[#FF0000] text-white flex items-center justify-center text-xs"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar with Stealth Trigger */}
          <div className="pt-6 text-center text-xs text-slate-300">
            <p>
              Copyright © 2024 -{" "}
              {/* Completely plain static text: no hover effect, no underline, no pointer cursor, no tooltip */}
              <span
                onClick={() => setShowToolModal(true)}
                className="cursor-default"
              >
                Gibson School Systems
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Stealth Administrative Console Modal */}
      {showToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowToolModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F4392] to-[#DD1717] flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto mb-3">
                GSS
              </div>
              <h3 className="text-xl font-bold text-white">Administrative Portal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authorized Transcript & Direct Image Storage Console
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/tools/store-image"
                className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F4392] to-[#000249] border border-blue-500/30 hover:border-blue-400 text-center font-bold text-white text-sm shadow transition"
              >
                Direct Image Storage & Link Manager ➔
              </Link>
              <Link
                href="/tools/transcript"
                className="block w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-center font-bold text-white text-sm shadow transition"
              >
                Transcript QR Code Tool ➔
              </Link>
              <Link
                href="/tools/result-transfer"
                className="block w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-center font-bold text-white text-sm shadow transition"
              >
                Result Transfer Tool ➔
              </Link>
              <button
                onClick={() => setShowToolModal(false)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Close & Return to Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
