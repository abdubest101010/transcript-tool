"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ResultTransferPage() {
  const [sourceFile, setSourceFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);

  const [dragActiveSource, setDragActiveSource] = useState(false);
  const [dragActiveTarget, setDragActiveTarget] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const sourceInputRef = useRef(null);
  const targetInputRef = useRef(null);

  const handleSourceChange = (file) => {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Source file must be a Word Document (.docx).");
      return;
    }
    setSourceFile(file);
  };

  const handleTargetChange = (file) => {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Target template file must be a Word Document (.docx).");
      return;
    }
    setTargetFile(file);
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!sourceFile) {
      setError("Please upload the Source Results Document (.docx).");
      return;
    }
    if (!targetFile) {
      setError("Please upload the Target Transcript Document (.docx).");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const formData = new FormData();
      formData.append("sourceFile", sourceFile);
      formData.append("targetFile", targetFile);

      const response = await fetch("/api/transfer-results?format=json", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update target document.");
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
        filename: data.filename || "Updated_Student_Transcript.docx",
        downloadUrl,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while processing.");
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
            Upload two Word documents. The tool extracts all results from the <strong className="text-primary-300">Source Document</strong> and overwrites only the result scores in the <strong className="text-primary-300">Target Document</strong>.
            All Target formatting, logos, fonts, borders, photos, stamps, and layout remain <strong className="text-green-400">100% untouched</strong>.
          </p>
        </div>

        {/* Upload Container */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Source Results Document Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-900/50 border border-primary-500 text-primary-300 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Source Results Document <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-gray-400">(.docx with correct grades)</span>
              </div>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActiveSource(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveSource(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragActiveSource(true); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveSource(false);
                  if (e.dataTransfer.files?.[0]) handleSourceChange(e.dataTransfer.files[0]);
                }}
                onClick={() => sourceInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActiveSource
                    ? "border-primary-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={sourceInputRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => e.target.files?.[0] && handleSourceChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-10 h-10 mb-2 rounded-full bg-purple-900/30 border border-purple-600/30 flex items-center justify-center text-primary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {sourceFile ? (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{sourceFile.name}</p>
                    <p className="text-gray-400 text-xs">{(sourceFile.size / (1024 * 1024)).toFixed(2)} MB • Source results loaded</p>
                    <span className="inline-block mt-2 text-xs text-primary-400 underline">Click to change Source DOCX</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Upload <span className="text-primary-400 font-semibold">Source Results Document</span> (.docx)
                    </p>
                    <p className="text-gray-500 text-xs">Contains the correct academic scores to copy</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Target Transcript Document Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary-900/50 border border-secondary-500 text-secondary-300 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Target Transcript Document <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-gray-400">(.docx template to preserve)</span>
              </div>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActiveTarget(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveTarget(false); }}
                onDragOver={(e) => { e.preventDefault(); setDragActiveTarget(true); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveTarget(false);
                  if (e.dataTransfer.files?.[0]) handleTargetChange(e.dataTransfer.files[0]);
                }}
                onClick={() => targetInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActiveTarget
                    ? "border-secondary-500 bg-pink-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={targetInputRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => e.target.files?.[0] && handleTargetChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-10 h-10 mb-2 rounded-full bg-pink-900/30 border border-pink-600/30 flex items-center justify-center text-pink-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>

                {targetFile ? (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{targetFile.name}</p>
                    <p className="text-gray-400 text-xs">{(targetFile.size / (1024 * 1024)).toFixed(2)} MB • Target template ready</p>
                    <span className="inline-block mt-2 text-xs text-secondary-400 underline">Click to change Target DOCX</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Upload <span className="text-secondary-400 font-semibold">Target Transcript Template</span> (.docx)
                    </p>
                    <p className="text-gray-500 text-xs">100% of layout, stamps, fonts, and photos are preserved</p>
                  </div>
                )}
              </div>
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
              disabled={!sourceFile || !targetFile || loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                !sourceFile || !targetFile || loading
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
                  <span>Copying Results & Updating Document...</span>
                </>
              ) : (
                <>
                  <span>Copy Results to Target Document (.docx)</span>
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
                      Success! Results Copied to Target Document
                    </h3>
                    <p className="text-green-400/80 text-xs mt-0.5">
                      Matched and updated scores while preserving 100% of Target formatting, fonts, stamps, and layout.
                    </p>
                  </div>
                </div>

                {successResult.downloadUrl && (
                  <a
                    href={successResult.downloadUrl}
                    download={successResult.filename}
                    className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-center font-semibold text-white text-sm shadow-md hover:opacity-90 transition"
                  >
                    Download {successResult.filename}
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
