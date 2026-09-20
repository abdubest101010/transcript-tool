"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ResultTransferPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [docxFile, setDocxFile] = useState(null);

  const [dragActiveImg, setDragActiveImg] = useState(false);
  const [dragActiveDocx, setDragActiveDocx] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const imageInputRef = useRef(null);
  const docxInputRef = useRef(null);

  const handleImageChange = (file) => {
    setError(null);
    if (!file) return;
    const valid = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!valid.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|docx)$/i)) {
      setError("Please select a valid image (.jpg, .png, .webp) or source document.");
      return;
    }
    setImageFile(file);
    if (file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleDocxChange = (file) => {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a Word Document (.docx) file.");
      return;
    }
    setDocxFile(file);
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please upload the image containing the student results table.");
      return;
    }
    if (!docxFile) {
      setError("Please upload the target Word document (.docx).");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const formData = new FormData();
      formData.append("imageFile", imageFile);
      formData.append("docxFile", docxFile);

      const response = await fetch("/api/transfer-results?format=json", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update table in Word document.");
      }

      // Create download blob from base64
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
        extractedCount: (data.extractedGrades || []).length,
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
            Extract subject scores from an <strong className="text-primary-300">image or document</strong> and inject them into a <strong className="text-primary-300">Word (.docx) template</strong>.
            All formatting, fonts, borders, signatures, stamps, and layout remain <strong className="text-green-400">100% untouched</strong> &mdash; only the result numbers are overwritten.
          </p>
        </div>

        {/* Upload Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Results Image Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                1. Upload Image of Results Table <span className="text-red-400">*</span>
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
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActiveImg
                    ? "border-primary-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,.docx"
                  onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Results Table"
                      className="max-h-40 rounded-lg border border-gray-700 object-contain shadow"
                    />
                    <p className="text-xs text-green-400 font-medium">{imageFile.name} loaded</p>
                    <span className="text-xs text-primary-400 underline">Click to change image</span>
                  </div>
                ) : imageFile ? (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{imageFile.name}</p>
                    <p className="text-gray-400 text-xs">Ready for extraction</p>
                    <span className="inline-block mt-2 text-xs text-primary-400 underline">Click to change</span>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 mb-2 mx-auto rounded-full bg-purple-900/30 border border-purple-600/30 flex items-center justify-center text-primary-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-sm mb-1">
                      Drag and drop <span className="text-primary-400 font-semibold">results table image</span> here
                    </p>
                    <p className="text-gray-500 text-xs">Supports PNG, JPG, JPEG, WEBP or DOCX</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Target Word Document Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                2. Upload Target Word Document (.docx) <span className="text-red-400">*</span>
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
                    ? "border-secondary-500 bg-pink-500/10"
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

                <div className="w-10 h-10 mb-2 rounded-full bg-pink-900/30 border border-pink-600/30 flex items-center justify-center text-pink-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {docxFile ? (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{docxFile.name}</p>
                    <p className="text-gray-400 text-xs">{(docxFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for injection</p>
                    <span className="inline-block mt-2 text-xs text-secondary-400 underline">Click to change DOCX</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Drag and drop your <span className="text-secondary-400 font-semibold">.docx</span> document here
                    </p>
                    <p className="text-gray-500 text-xs">or click to browse from computer</p>
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
              disabled={!imageFile || !docxFile || loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                !imageFile || !docxFile || loading
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
                  <span>Extracting Scores & Updating Document...</span>
                </>
              ) : (
                <>
                  <span>Extract & Overwrite Table Scores in DOCX</span>
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
                      Matched and updated subjects table without changing any formatting or layout.
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
