"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const INITIAL_SUBJECTS = [
  { subject: "Agriculture", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["92.8", "85.66", "89.23"], g12: ["85.86", "95.2", "90.53"] },
  { subject: "Afan Oromo", g9: ["-", "-", "-"], g10: ["99.41", "97.86", "98.64"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Amharic", g9: ["69.88", "79.22", "74.55"], g10: ["82.92", "83.14", "83.03"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Biology", g9: ["74.33", "79.72", "77.03"], g10: ["92.09", "84.33", "88.21"], g11: ["86.72", "89.72", "88.22"], g12: ["83.75", "96", "89.88"] },
  { subject: "Chemistry", g9: ["70", "65.03", "67.52"], g10: ["52.99", "76.46", "64.725"], g11: ["72.39", "88.92", "80.655"], g12: ["84.29", "97", "90.645"] },
  { subject: "Civics and Ethical Education", g9: ["81.76", "86.89", "84.3"], g10: ["86.16", "84.13", "85.15"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Economics", g9: ["-", "-", "-"], g10: ["77.39", "77.67", "77.53"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "English", g9: ["63.81", "79.54", "71.68"], g10: ["81.78", "76.5", "79.14"], g11: ["82.28", "84.92", "83.6"], g12: ["89.67", "96.3", "92.985"] },
  { subject: "Health and Physical Education", g9: ["100", "100", "100"], g10: ["79.6", "89.69", "84.65"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Geography", g9: ["83.71", "83.2", "83.46"], g10: ["83.35", "81.87", "82.61"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "History", g9: ["75.36", "71.22", "73.3"], g10: ["80.65", "86.15", "83.4"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "ICT", g9: ["83.23", "88.07", "85.65"], g10: ["84.27", "73.85", "79.06"], g11: ["97.19", "92.89", "95.04"], g12: ["93.69", "95", "94.345"] },
  { subject: "Mathematics", g9: ["72.28", "63.27", "67.78"], g10: ["62.2", "70.8", "66.5"], g11: ["68.34", "79.47", "73.905"], g12: ["88.68", "85", "86.84"] },
  { subject: "Physics", g9: ["72.77", "58.9", "65.84"], g10: ["71.55", "78.8", "75.18"], g11: ["74.74", "65.47", "70.105"], g12: ["89.98", "89", "89.49"] },
  { subject: "Web Design & Development", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["78.15", "78.41", "78.28"], g12: ["88.48", "90.0", "89.24"] },
  { subject: "Total", g9: ["847.13", "855.06", "851.095"], g10: ["1034.36", "1061.25", "1047.8"], g11: ["652.61", "665.46", "659.04"], g12: ["704.4", "743.5", "723.95"] },
  { subject: "Average", g9: ["77.01", "77.73", "77.37"], g10: ["79.57", "81.63", "80.60"], g11: ["81.58", "83.18", "82.38"], g12: ["88.05", "92.94", "90.49"] },
  { subject: "Rank", g9: ["10/34", "10/34", "9/34"], g10: ["4/31", "5/31", "4/31"], g11: ["8/24", "7/24", "8/24"], g12: ["14/23", "4/23", "4/23"] },
  { subject: "Conduct/Work Ethic", g9: ["", "A", ""], g10: ["", "A", ""], g11: ["", "B", ""], g12: ["", "A", ""] },
  { subject: "Absences", g9: ["", "2", ""], g10: ["", "8", ""], g11: ["", "5", ""], g12: ["", "18", ""] },
];

export default function ResultTransferPage() {
  const [docxFile, setDocxFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tableData, setTableData] = useState(INITIAL_SUBJECTS);
  const [showEditor, setShowEditor] = useState(false);

  const [dragActiveDocx, setDragActiveDocx] = useState(false);
  const [dragActiveImg, setDragActiveImg] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const docxInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleDocxChange = (file) => {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a Word Document (.docx) file.");
      return;
    }
    setDocxFile(file);
  };

  const handleImageChange = (file) => {
    setError(null);
    if (!file) return;
    setImageFile(file);
    if (file.type?.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleScoreChange = (rowIndex, gradeKey, semIndex, val) => {
    setTableData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[rowIndex][gradeKey][semIndex] = val;
      return next;
    });
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!docxFile) {
      setError("Please upload the target Word document (.docx).");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const formData = new FormData();
      formData.append("docxFile", docxFile);
      formData.append("gradesJson", JSON.stringify(tableData));

      const response = await fetch("/api/transfer-results", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update table in Word document.");
      }

      let downloadUrl = "";
      if (data.modifiedDocxBase64) {
        const byteCharacters = atob(data.modifiedDocxBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        downloadUrl = URL.createObjectURL(blob);
      }

      setSuccessResult({
        filename: data.filename || `updated-${docxFile.name}`,
        downloadUrl,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 mt-28 mb-16 flex-1">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Results Table Copier
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Upload your Word document (<code className="text-primary-400 font-semibold">.docx</code>). The tool replaces <strong>only the scores table</strong> while keeping 100% of the document layout, stamps, photo, and header completely intact.
          </p>
        </div>

        {/* Upload Container */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Target Word Document Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                1. Upload Target Word Document (.docx) <span className="text-red-400">*</span>
              </label>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActiveDocx(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveDocx(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragActiveDocx(true); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveDocx(false);
                  if (e.dataTransfer.files?.[0]) handleDocxChange(e.dataTransfer.files[0]);
                }}
                onClick={() => docxInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActiveDocx
                    ? "border-primary-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={docxInputRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => e.target.files?.[0] && handleDocxChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-10 h-10 mb-2 rounded-full bg-purple-900/30 border border-purple-600/30 flex items-center justify-center text-primary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {docxFile ? (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{docxFile.name}</p>
                    <p className="text-gray-400 text-xs">{(docxFile.size / (1024 * 1024)).toFixed(2)} MB • Document ready</p>
                    <span className="inline-block mt-2 text-xs text-primary-400 underline">Click to change DOCX</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Drag and drop your <span className="text-primary-400 font-semibold">.docx</span> document here
                    </p>
                    <p className="text-gray-500 text-xs">or click to browse from computer</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Optional Results Image Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                2. Results Table Image <span className="text-gray-500 font-normal">(optional reference)</span>
              </label>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActiveImg(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveImg(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragActiveImg(true); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveImg(false);
                  if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
                }}
                onClick={() => imageInputRef.current?.click()}
                className="p-4 border border-dashed border-gray-700 hover:border-gray-500 rounded-xl bg-[#121212]/30 flex items-center justify-between cursor-pointer transition"
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-950/30 border border-pink-700/30 flex items-center justify-center text-pink-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">
                      {imageFile ? imageFile.name : "Upload table image for reference"}
                    </p>
                    <p className="text-[11px] text-gray-500">PNG, JPG, WEBP</p>
                  </div>
                </div>

                <span className="text-xs text-primary-400 underline">Browse</span>
              </div>
            </div>

            {/* Table Review Toggle */}
            <div className="pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowEditor(!showEditor)}
                className="w-full flex items-center justify-between text-xs text-gray-300 hover:text-white p-3 rounded-xl bg-[#121212]/70 border border-gray-800 transition"
              >
                <span className="font-semibold text-primary-400">
                  {showEditor ? "▲ Hide Scores Table Editor" : "▼ Review / Edit Scores Table (20 Subjects)"}
                </span>
                <span className="text-gray-500 text-[11px]">Click to customize values</span>
              </button>

              {showEditor && (
                <div className="mt-4 overflow-x-auto border border-gray-800 rounded-xl max-h-96">
                  <table className="w-full text-xs text-left text-gray-300 border-collapse">
                    <thead className="bg-[#1e1e1e] text-gray-200 sticky top-0 border-b border-gray-700">
                      <tr>
                        <th className="p-2 border-r border-gray-700">Subject</th>
                        <th className="p-2 text-center border-r border-gray-700" colSpan={3}>Grade 9</th>
                        <th className="p-2 text-center border-r border-gray-700" colSpan={3}>Grade 10</th>
                        <th className="p-2 text-center border-r border-gray-700" colSpan={3}>Grade 11</th>
                        <th className="p-2 text-center" colSpan={3}>Grade 12</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {tableData.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/5">
                          <td className="p-2 font-medium text-white border-r border-gray-800 whitespace-nowrap">{row.subject}</td>
                          {["g9", "g10", "g11", "g12"].map((gKey) =>
                            row[gKey].map((val, sIdx) => (
                              <td key={`${gKey}-${sIdx}`} className="p-1 border-r border-gray-800 text-center">
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleScoreChange(rIdx, gKey, sIdx, e.target.value)}
                                  className="w-12 text-center bg-black/40 border border-gray-700 rounded px-1 py-0.5 text-xs text-white focus:border-primary-400 focus:outline-none"
                                />
                              </td>
                            ))
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleProcess}
              disabled={!docxFile || loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                !docxFile || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90 shadow-lg shadow-purple-500/20"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Injecting Scores & Overwriting Table...</span>
                </>
              ) : (
                <>
                  <span>Inject & Overwrite Table Scores in DOCX</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Success Result */}
            {successResult && (
              <div className="pt-6 border-t border-gray-800 animate-fadeIn space-y-4">
                <div className="p-4 rounded-xl bg-green-950/40 border border-green-700/50 flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-green-300 text-sm">
                      Success! Results Injected into Word Document
                    </h3>
                    <p className="text-green-400/80 text-xs mt-0.5">
                      All table results updated without touching any logos, fonts, borders, or signatures.
                    </p>
                  </div>
                </div>

                {successResult.downloadUrl && (
                  <a
                    href={successResult.downloadUrl}
                    download={successResult.filename}
                    className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-center font-semibold text-white text-sm shadow-md hover:opacity-90 transition"
                  >
                    Download Updated Word Document (.docx)
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
