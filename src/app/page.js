"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function GyaschoolClone() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);

  // Hero slides data from gyaschool.com
  const slides = [
    {
      title: "Our Vision",
      description:
        "Enabling the rising generation, by way of quality education, so as to become productive, socially competent, problem solvers, Developing well-rounded personalities with humane characters, thereby, producing full-fledged, matured Ethiopian citizens who can successfully live and work in peace and harmony both at home and internationally.",
      image:
        "https://gyaschool.com/wp-content/uploads/2023/09/20230429204909_3W3A0711-scaled-e1695110424370-1024x401.jpg",
    },
    {
      title: "Our Mission",
      description:
        "Based on the curriculum and policy of the land, providing adequate knowledge, skills, information, talent, attitudes, vision and values for those students enrolled in all grades and levels which will assist them in the building of the nation.",
      image:
        "https://gyaschool.com/wp-content/uploads/2023/09/20230429204909_3W3A0711-scaled-e1695110424370-1024x401.jpg",
    },
    {
      title: "Our Values",
      description:
        "Patriotism, decisiveness, honesty, patience, freedom of expression, commitment, equity, effectiveness, quality, participation, excellence, punctuality and strong work ethic.",
      image:
        "https://gyaschool.com/wp-content/uploads/2023/09/20230429204909_3W3A0711-scaled-e1695110424370-1024x401.jpg",
    },
  ];

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      {/* Top Header Section with Royal Blue Wave */}
      <header className="relative bg-gradient-to-r from-[#000249] via-[#0F4392] to-[#000249] text-white pt-3 pb-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
            {/* Logo */}
            <div className="flex items-center">
              <a href="https://gyaschool.com" className="inline-block">
                <img
                  src="https://gyaschool.com/wp-content/uploads/2023/09/1-1.png"
                  alt="Gibson School Systems Logo"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </a>
            </div>

            {/* Top Utility Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
              <a
                href="https://gyaschool.com/?page_id=27"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-[#FF4949] text-white transition duration-200"
              >
                Employment
              </a>
              <a
                href="https://gyaschool.com/events"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-[#FF4949] text-white transition duration-200"
              >
                Calendar
              </a>
              <a
                href="https://gyaschool.com/?page_id=123"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-[#FF4949] text-white transition duration-200"
              >
                Alumni
              </a>
              <a
                href="https://elearning.gyaschool.com/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded bg-[#FF4949] hover:bg-[#DD1717] text-white shadow transition duration-200 flex items-center gap-1"
              >
                Login <span>➔</span>
              </a>
            </div>
          </div>

          {/* Primary Navigation Menu */}
          <nav className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 rounded hover:bg-white/10 focus:outline-none"
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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-7 text-sm font-semibold uppercase tracking-wider">
              <a href="#" className="text-[#FDCB66] border-b-2 border-[#FDCB66] pb-1 transition">
                Home
              </a>

              {/* About Us Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-white hover:text-[#FDCB66] transition pb-1">
                  About Us
                  <svg className="w-4 h-4 fill-current opacity-80" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>

                {aboutDropdownOpen && (
                  <div className="absolute top-full left-0 w-56 bg-[#0F4392] border border-white/20 shadow-2xl rounded-b-md py-2 z-50 text-xs normal-case">
                    <a
                      href="https://gyaschool.com/?page_id=31"
                      className="block px-4 py-2 hover:bg-[#000249] text-white"
                    >
                      History
                    </a>
                    <a
                      href="https://gyaschool.com/?page_id=33"
                      className="block px-4 py-2 hover:bg-[#000249] text-white"
                    >
                      Clubs
                    </a>
                    <div className="border-t border-white/10 my-1"></div>
                    <div className="px-4 py-1 text-[11px] font-bold text-[#FDCB66] uppercase tracking-wider">
                      Campuses
                    </div>
                    <a href="https://gyaschool.com/?page_id=35" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Bole Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=36" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Bole 24 Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=37" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      CMC Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=677" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Jigjiga Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=38" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Kolfe Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=39" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Lafto Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=40" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Mekanessa Campus
                    </a>
                    <a href="https://gyaschool.com/?page_id=41" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Sarbet Campus
                    </a>
                    <div className="border-t border-white/10 my-1"></div>
                    <div className="px-4 py-1 text-[11px] font-bold text-[#FDCB66] uppercase tracking-wider">
                      Programs
                    </div>
                    <a href="https://gyaschool.com/?page_id=324" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      French Language
                    </a>
                    <a href="https://gyaschool.com/?page_id=325" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      Arabic Language
                    </a>
                    <a href="https://gyaschool.com/?page_id=327" className="block px-6 py-1.5 hover:bg-[#000249] text-slate-200">
                      ASP
                    </a>
                  </div>
                )}
              </div>

              <a href="#contact" className="text-white hover:text-[#FDCB66] transition pb-1">
                Contact Us
              </a>
              <a href="https://gyaschool.com/?page_id=30" className="text-white hover:text-[#FDCB66] transition pb-1">
                Admission
              </a>
              <a href="https://gyaschool.com/?page_id=677" className="text-white hover:text-[#FDCB66] transition pb-1">
                Jigjiga Campus
              </a>
              <a href="https://gyaschool.com/?page_id=1814" className="text-white hover:text-[#FDCB66] transition pb-1">
                Curriculum
              </a>
            </div>

            {/* Inquire Button */}
            <a
              href="#contact"
              className="hidden sm:inline-block px-4 py-1.5 rounded-full bg-[#FDCB66] hover:bg-[#f5b83d] text-[#000249] font-bold text-xs uppercase tracking-wider transition shadow"
            >
              Contact School
            </a>
          </nav>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 bg-[#0F4392] rounded-lg p-4 border border-white/20 text-sm space-y-2">
              <a href="#" className="block py-1.5 text-[#FDCB66] font-bold">Home</a>
              <a href="https://gyaschool.com/?page_id=31" className="block py-1 text-white">About Us - History</a>
              <a href="https://gyaschool.com/?page_id=35" className="block py-1 text-white">Campuses</a>
              <a href="#contact" className="block py-1 text-white">Contact Us</a>
              <a href="https://gyaschool.com/?page_id=30" className="block py-1 text-white">Admission</a>
              <a href="https://gyaschool.com/?page_id=677" className="block py-1 text-white">Jigjiga Campus</a>
              <a href="https://gyaschool.com/?page_id=1814" className="block py-1 text-white">Curriculum</a>
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-xs">
                <a href="https://gyaschool.com/?page_id=27" className="px-2.5 py-1 bg-white/10 rounded text-white">Employment</a>
                <a href="https://elearning.gyaschool.com/" className="px-2.5 py-1 bg-[#FF4949] rounded text-white font-bold">Login</a>
              </div>
            </div>
          )}
        </div>

        {/* Mountain Shape Divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-8 sm:h-12 text-white fill-current"
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
      </header>

      {/* Hero Carousel Section */}
      <section className="relative bg-[#000249] text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image Overlay with Ken Burns effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-20 scale-105"
          style={{ backgroundImage: `url(${slides[activeSlide].image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#000249]/95 via-[#0F4392]/80 to-[#000249]/95"></div>

        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-[#FDCB66]/20 border border-[#FDCB66]/40 text-[#FDCB66] text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
            Making Young People Strong People
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-white mb-6 tracking-tight drop-shadow-md">
            {slides[activeSlide].title}
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-light mb-10 transition-opacity duration-700 min-h-[100px] flex items-center justify-center">
            "{slides[activeSlide].description}"
          </p>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() =>
                setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FDCB66] hover:text-[#000249] border border-white/20 flex items-center justify-center transition"
              aria-label="Previous Slide"
            >
              ❮
            </button>

            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? "w-8 bg-[#FDCB66]" : "w-2.5 bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}

            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FDCB66] hover:text-[#000249] border border-white/20 flex items-center justify-center transition"
              aria-label="Next Slide"
            >
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* News & High-Profile Achievements Section */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-extrabold text-[#000249] font-serif tracking-tight">
              Latest News & Honors
            </h2>
            <div className="w-16 h-1 bg-[#DD1717] mt-2"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Featured Article Card */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300">
              <div className="grid sm:grid-cols-2">
                <div className="relative h-64 sm:h-full">
                  <img
                    src="https://gyaschool.com/wp-content/uploads/2024/05/picture2___16165810797.webp"
                    alt="Manhattanville University Presented The 2024 President's Prize to Edelawit Fikru Yishak"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#DD1717] text-white text-xs font-bold px-2.5 py-1 rounded">
                    Alumni Spotlight
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      May 25, 2024
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#000249] mt-2 mb-3 leading-snug">
                      Manhattanville University Presented The 2024 President’s Prize to Edelawit Fikru Yishak
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Manhattanville University presented the prestigious 2024 President’s Prize to former Gibson School Systems student Edelawit Fikru Yishak, recognizing outstanding academic achievement in Computer Science.
                    </p>
                  </div>
                  <a
                    href="https://gyaschool.com/?p=1839"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-bold text-[#0F4392] hover:text-[#DD1717] transition"
                  >
                    Read More ➔
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Cards Side Panel */}
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:border-[#0F4392] transition">
                <div className="w-12 h-12 rounded-lg bg-[#0F4392]/10 text-[#0F4392] flex items-center justify-center font-bold text-xl flex-shrink-0">
                  🏫
                </div>
                <div>
                  <h4 className="font-bold text-[#000249] text-sm uppercase">Visit Our School</h4>
                  <p className="text-xs text-slate-500 mt-1">We employ only the best of the best educators in Ethiopia.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:border-[#0F4392] transition">
                <div className="w-12 h-12 rounded-lg bg-[#FF4949]/10 text-[#FF4949] flex items-center justify-center font-bold text-xl flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h4 className="font-bold text-[#000249] text-sm uppercase">Inquire</h4>
                  <p className="text-xs text-slate-500 mt-1">Direct inquiries to info@gyaschool.com or central offices.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:border-[#0F4392] transition">
                <div className="w-12 h-12 rounded-lg bg-[#FDCB66]/20 text-[#000249] flex items-center justify-center font-bold text-xl flex-shrink-0">
                  📝
                </div>
                <div>
                  <h4 className="font-bold text-[#000249] text-sm uppercase">Online Application</h4>
                  <p className="text-xs text-slate-500 mt-1">Send your CV to hr@gyaschool.com for career opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Character Counts Program Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden shadow-lg relative mb-12 text-center text-white py-12 px-6 bg-gradient-to-r from-[#000249] via-[#0F4392] to-[#000249]">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide">
              2024/2025 Character Counts Program Traits
            </h2>
            <p className="text-sm sm:text-base text-[#FDCB66] font-semibold mt-2">
              ANNUAL THEME: Reach for the STARS: S-tudy, T-ry, A-spire, R-each Goals and S-ucceed
            </p>
          </div>

          {/* Monthly Traits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-[#0F4392] transition duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4949]">
                September
              </span>
              <h3 className="text-xl font-bold text-[#000249] mt-1 mb-2">Readiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The state of being fully prepared for something or to do something effectively.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-[#0F4392] transition duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4949]">
                October
              </span>
              <h3 className="text-xl font-bold text-[#000249] mt-1 mb-2">Determination</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The quality that involves firmness and perseverance to achieve goals and overcome obstacles.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-[#0F4392] transition duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4949]">
                November
              </span>
              <h3 className="text-xl font-bold text-[#000249] mt-1 mb-2">Trustworthiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The ability to be relied upon as honest, dependable, and truthful in word and deed.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-[#0F4392] transition duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4949]">
                December
              </span>
              <h3 className="text-xl font-bold text-[#000249] mt-1 mb-2">Diplomacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The art of conducting negotiations, agreements, and mutual relations between individuals and groups.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://gyaschool.com/?page_id=923"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0F4392] hover:bg-[#000249] text-white font-bold text-xs uppercase tracking-wider transition shadow"
            >
              View All CCP Traits
            </a>
          </div>
        </div>
      </section>

      {/* School Highlights & Statistics */}
      <section className="py-16 bg-[#000249] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FDCB66]">
              By The Numbers
            </span>
            <h2 className="text-3xl font-extrabold font-serif mt-1">
              Two Decades of Educational Leadership
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">FOUNDED 2000</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Gibson School Systems was founded in 2000 by Dr. Leea Gibson and Mr. Mohammed Aden, pioneering quality English-medium education.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">10,000+ STUDENTS</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From 330 students in its inaugural year, GSS has expanded to nearly 10,000 enrolled learners across all academic divisions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">1:5 RATIO</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We prioritize individual attention and personalized guidance, upholding a strict 1:5 teacher-to-student standard.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">GLOBAL ALUMNI</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our graduates regularly receive international scholarships to elite universities worldwide and excel in national examinations.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">7 CAMPUSES</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Spanning 19 divisions across Addis Ababa (Bole, Sarbet, CMC, Kolfe, Lafto, Mekanessa) and Jigjiga, Ethiopia.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FDCB66] transition">
              <div className="text-[#FDCB66] text-3xl font-extrabold mb-2">WHOLE CHILD</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Caring about every aspect of a child: intellect, character, emotional resilience, physical fitness, and civic responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Whole Child Approach Highlight */}
      <section className="py-12 bg-[#FDCB66] text-[#000249] text-center">
        <div className="max-w-[1000px] mx-auto px-4">
          <p className="text-lg sm:text-2xl font-bold font-serif">
            Our system can be summed up as:{" "}
            <span className="text-[#DD1717] underline decoration-[#DD1717]">Whole Child Approach</span> — caring about every aspect of a child.
          </p>
        </div>
      </section>

      {/* Contact Section & Form */}
      <section id="contact" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-extrabold text-[#000249] font-serif mb-2">
                Contact Us
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Have questions regarding admissions, academics, or branch campuses? Send us a message.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you. Your message has been received by Gibson School Systems.");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F4392] focus:ring-1 focus:ring-[#0F4392]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F4392] focus:ring-1 focus:ring-[#0F4392]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="091..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F4392] focus:ring-1 focus:ring-[#0F4392]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason for Contact
                  </label>
                  <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F4392] focus:ring-1 focus:ring-[#0F4392]">
                    <option value="General">General Inquiry</option>
                    <option value="Academics">Academic Programs & Curriculum</option>
                    <option value="Admissions">Admissions & Registration</option>
                    <option value="Parents">Parent Portal & Student Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F4392] focus:ring-1 focus:ring-[#0F4392]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#0F4392] hover:bg-[#000249] text-white font-bold text-sm tracking-wide uppercase transition shadow"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Campuses & Social Feed */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-[#000249] text-base mb-3 font-serif">
                  Central Administrative Office
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>📍 <strong>Head Office:</strong> 101 Ras-Dashen, Africa Avenue, Addis Ababa, Ethiopia</p>
                  <p>📍 <strong>Jigjiga Office:</strong> Behind Jigjiga University on the road to Wuchale</p>
                  <p>📞 <strong>Phone:</strong> 011 662 8312 | 011 661 8315</p>
                  <p>✉️ <strong>Email:</strong> info@gyaschool.com | info@gyaschool.net</p>
                  <p>📮 <strong>P.O. Box:</strong> 15564 Addis Ababa, Ethiopia</p>
                </div>
              </div>

              {/* Official Facebook Social Link Box */}
              <div className="p-6 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1877F2] font-black text-2xl">f</span>
                    <span className="font-bold text-[#000249] text-sm">Official Facebook Page</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Follow @GibsonSchoolSystems for daily announcements, photos & campus news.
                  </p>
                </div>
                <a
                  href="https://www.facebook.com/GibsonSchoolSystems"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1877F2] text-white font-bold text-xs hover:bg-[#0d65d9] transition flex-shrink-0"
                >
                  Visit Page ➔
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Subtle Stealth Trigger */}
      <footer className="relative bg-[#000249] text-slate-300 pt-16 pb-12 overflow-hidden border-t-4 border-[#FDCB66]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Col 1: About & Logo */}
            <div>
              <img
                src="https://gyaschool.com/wp-content/uploads/2023/09/Gray-GSS-Logo_1@4x-1024x220.png"
                alt="Gibson School Systems Logo"
                className="w-48 h-auto mb-4 object-contain brightness-150"
              />
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                101 Ras-Dashen, Africa Avenue, Addis Ababa, Ethiopia.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p><b>Phone:</b> 011 662 8312 | 011 661 8315</p>
                <p><b>P.O Box:</b> 15564</p>
              </div>
            </div>

            {/* Col 2: Telegram Channels */}
            <div>
              <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-[#FDCB66]">
                Telegram Channels
              </h5>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li><a href="https://t.me/GSSKGDivision" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ KG Division</a></li>
                <li><a href="https://t.me/GSSgrade1to4" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grades 1-4 Division</a></li>
                <li><a href="https://t.me/GSSgrade5" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grade 5</a></li>
                <li><a href="https://t.me/GSSgrade6" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grade 6</a></li>
                <li><a href="https://t.me/GSSgrade7to8" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grades 7-8</a></li>
                <li><a href="https://t.me/GSSgrade_9" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grade 9</a></li>
                <li><a href="https://t.me/GSSgrade10" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grade 10</a></li>
                <li><a href="https://t.me/GSSgrade11to12" target="_blank" rel="noreferrer" className="hover:text-white transition">✈️ Grades 11-12</a></li>
              </ul>
            </div>

            {/* Col 3: Campuses */}
            <div>
              <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-[#FDCB66]">
                Campuses
              </h5>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li><a href="https://gyaschool.com/?page_id=35" className="hover:text-white transition">Bole Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=36" className="hover:text-white transition">Bole 24 Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=37" className="hover:text-white transition">CMC Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=38" className="hover:text-white transition">Kolfe Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=677" className="hover:text-white transition">Jigjiga Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=39" className="hover:text-white transition">Lafto Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=40" className="hover:text-white transition">Mekanessa Campus</a></li>
                <li><a href="https://gyaschool.com/?page_id=41" className="hover:text-white transition">Sarbet Campus</a></li>
              </ul>
            </div>

            {/* Col 4: Founders & Links */}
            <div>
              <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-[#FDCB66]">
                Our Leadership
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Founded in 2000 by Dr. Leea Gibson (Ed. D in Educational Leadership) and Mr. Mohammed Aden (Master’s in Economics) with dedication to world-class educational excellence.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.facebook.com/GibsonSchoolSystems"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center text-xs transition"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://www.youtube.com/c/GibsonSchoolSystems"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center text-xs transition"
                  title="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://gyaschool.com/gallery"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#FDCB66] hover:underline ml-2"
                >
                  Gallery
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar with Stealth Trigger */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>
              Copyright © 2024 -{" "}
              {/* STEALTH TRIGGER: Clicking the words 'Gibson School Systems' opens the Admin Tool console */}
              <span
                onClick={() => setShowToolModal(true)}
                className="cursor-pointer text-slate-300 hover:text-[#FDCB66] transition"
                title="Admin Authentication Console"
              >
                Gibson School Systems
              </span>
              . All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <a href="https://gyaschool.com/events" className="hover:text-white transition">Calendar</a>
              <span>•</span>
              <a href="https://gyaschool.com/gallery" className="hover:text-white transition">Photo Gallery</a>
              <span>•</span>
              {/* Hidden key indicator dot */}
              <span
                onClick={() => setShowToolModal(true)}
                className="cursor-pointer text-slate-600 hover:text-slate-400 transition"
              >
                •
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Stealth Administrative Console Modal */}
      {showToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
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
                Authorized Verification & Transcript Tool Console
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
