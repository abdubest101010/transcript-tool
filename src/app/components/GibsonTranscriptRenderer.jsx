"use client";

import React from "react";

export default function GibsonTranscriptRenderer({ data }) {
  if (!data) return null;

  const bannerSrc = data.bannerDataUrl || "/gibson_banner.png";

  return (
    <div className="w-full max-w-[920px] bg-white text-black p-3 sm:p-6 font-serif text-[12px] mx-auto leading-normal select-none">
      {/* 1. Header 3-Column Section */}
      <div className="grid grid-cols-12 gap-2 pb-2 mb-2 items-center">
        {/* Left: QR Code & Short Name */}
        <div className="col-span-3 flex flex-col items-center justify-center text-center">
          {data.qrCodeDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.qrCodeDataUrl}
              alt="Transcript QR Code"
              className="w-[125px] h-[125px] object-contain block mb-1 border border-gray-100 shadow-2xs"
            />
          ) : (
            <div className="w-[125px] h-[125px] border border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500 mb-1">
              QR Code
            </div>
          )}
          <div className="font-bold text-xs tracking-wide text-gray-950 font-sans mt-0.5">
            {data.studentShortName || "Inas Z"}
          </div>
        </div>

        {/* Center: School Banner / Header */}
        <div className="col-span-6 flex flex-col items-center text-center px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerSrc}
            alt="Gibson School Systems"
            className="w-full max-h-[130px] object-contain mx-auto block mb-1"
          />
        </div>

        {/* Right: Photo with Official Seal Stamp */}
        <div className="col-span-3 flex flex-col items-center justify-center text-center">
          <div className="relative inline-block mb-1">
            {data.photoDataUrl || data.photoBlobUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.photoDataUrl || data.photoBlobUrl}
                alt="Student Photo"
                className="w-[105px] h-[125px] object-cover border border-black block shadow-xs bg-gray-50"
              />
            ) : (
              <div className="w-[105px] h-[125px] border border-black bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Photo</span>
              </div>
            )}
            {/* Authentic Circular School Stamp Overlay */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gibson_seal_stamp.png"
              alt="Official Seal"
              className="absolute -bottom-2 -left-3 w-14 h-14 object-contain pointer-events-none drop-shadow-xs opacity-95"
            />
          </div>
          <p className="text-[8.5px] text-gray-800 leading-tight text-center max-w-[125px]">
            Note: The photo is<br />
            an actual photo,<br />
            not a scanned photo.
          </p>
        </div>
      </div>

      {/* 2. Student Info Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-[13px] font-bold border-b-2 border-black pb-1 mb-2 px-1 gap-2">
        <div>
          <span>Name of the Student: </span>
          <span className="underline ml-1 font-extrabold">{data.studentName || "Inas Zakir Ahmed"}</span>
        </div>
        <div>
          <span>Age: </span>
          <span className="underline ml-1 font-extrabold">{data.age || "17"}</span>
        </div>
        <div>
          <span>Gender: </span>
          <span className="underline ml-1 font-extrabold">{data.gender || "Female"}</span>
        </div>
        <div>
          <span>Stream: </span>
          <span className="underline ml-1 font-extrabold">{data.stream || "Natural Science"}</span>
        </div>
      </div>

      {/* 3. Grades Table matching official layout */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black text-center text-[11px] leading-tight font-sans">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-white">
              <th className="border-2 border-black px-2 py-1 text-left font-bold text-xs w-[200px]">
                Student ID: <span className="underline ml-1">{data.studentId || "1121564"}</span>
              </th>
              <th colSpan={3} className="border-2 border-black px-1 py-1 font-bold text-[11px]">
                Grade: 9<br />
                <span className="font-normal text-[10px] block">
                  Aca.Year {data.years?.g9 || "2022/2023"}
                </span>
              </th>
              <th colSpan={3} className="border-2 border-black px-1 py-1 font-bold text-[11px]">
                Grade: 10<br />
                <span className="font-normal text-[10px] block">
                  Aca.Year {data.years?.g10 || "2023/2024"}
                </span>
              </th>
              <th colSpan={3} className="border-2 border-black px-1 py-1 font-bold text-[11px]">
                Grade: 11<br />
                <span className="font-normal text-[10px] block">
                  Aca.Year {data.years?.g11 || "2024/2025"}
                </span>
              </th>
              <th colSpan={3} className="border-2 border-black px-1 py-1 font-bold text-[11px]">
                Grade: 12<br />
                <span className="font-normal text-[10px] block">
                  Aca.Year {data.years?.g12 || "2025/2026"}
                </span>
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-white text-[10px] font-bold">
              <th className="border-2 border-black px-2 py-0.5 text-center">Subjects</th>
              {/* G9 */}
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">1<sup>st</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">2<sup>nd</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[52px]">Average</th>
              {/* G10 */}
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">1<sup>st</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">2<sup>nd</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[52px]">Average</th>
              {/* G11 */}
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">1<sup>st</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">2<sup>nd</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[52px]">Average</th>
              {/* G12 */}
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">1<sup>st</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[46px]">2<sup>nd</sup> Sem</th>
              <th className="border-2 border-black px-1 py-0.5 w-[52px]">Average</th>
            </tr>
          </thead>

          <tbody>
            {data.gradeRows?.map((row, idx) => {
              const lowerSub = row.subject.toLowerCase();
              const isTotalOrAvg = lowerSub === "total" || lowerSub === "average";
              const isRankOrConduct = lowerSub === "rank" || lowerSub.includes("conduct") || lowerSub.includes("absence");

              return (
                <tr
                  key={idx}
                  className={`${isTotalOrAvg || isRankOrConduct ? "font-bold" : ""}`}
                >
                  <td className="border-2 border-black px-2 py-0.5 text-left font-medium text-[11px] whitespace-nowrap">
                    {row.subject}
                  </td>
                  {/* Grade 9 */}
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g9[0]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g9[1]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g9[2]}</td>
                  {/* Grade 10 */}
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g10[0]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g10[1]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g10[2]}</td>
                  {/* Grade 11 */}
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g11[0]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g11[1]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g11[2]}</td>
                  {/* Grade 12 */}
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g12[0]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g12[1]}</td>
                  <td className="border-2 border-black px-1 py-0.5 text-[11px]">{row.g12[2]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Signatures & Authenticity Section */}
      <div className="mt-3 pt-2 text-xs font-serif">
        <p className="font-semibold mb-2">
          He/ She has completed grade 9, 10, 11 and 12.
        </p>

        <div className="grid grid-cols-12 gap-2 items-end mt-2">
          <div className="col-span-6 space-y-1.5 text-[11px]">
            <div>
              <span className="font-medium">Record Keeper’s Name: </span>
              <span className="border-b-2 border-black inline-block w-44"></span>
            </div>
            <div>
              <span className="font-medium">Signature: </span>
              <span className="border-b-2 border-black inline-block w-32"></span>
              <span className="ml-2 font-medium">Date: </span>
              <span className="border-b-2 border-black inline-block w-24"></span>
            </div>
          </div>

          <div className="col-span-6 space-y-1.5 text-[11px]">
            <div>
              <span className="font-medium">Site Director’s Name: </span>
              <span className="border-b-2 border-black inline-block w-44"></span>
            </div>
            <div>
              <span className="font-medium">Signature: </span>
              <span className="border-b-2 border-black inline-block w-32"></span>
              <span className="ml-2 font-medium">Date: </span>
              <span className="border-b-2 border-black inline-block w-24"></span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-gray-800 italic font-semibold pt-1">
          Do not accept scanned or electronic versions of this document unless sent directly from Gibson School Systems
        </div>
      </div>
    </div>
  );
}
