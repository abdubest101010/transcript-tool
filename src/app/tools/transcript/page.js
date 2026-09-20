"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function TranscriptImageQrToolPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [customId, setCustomId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const fileInputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("transcript_image_qr_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load history from localStorage:", e);
    }
  }, []);

  const saveToHistory = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 10);
      try {
        localStorage.setItem("transcript_image_qr_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save history:", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("transcript_image_qr_history");
    } catch (e) {}
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetImage(e.target.files[0]);
    }
  };

  const validateAndSetImage = (selectedFile) => {
    setError(null);
    setResult(null);
    const validExts = [".jpg", ".jpeg", ".png", ".webp"];
    const hasValidExt = validExts.some((ext) => selectedFile.name.toLowerCase().endsWith(ext));
    if (!hasValidExt && !selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file (.jpg, .jpeg, .png, .webp).");
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setResult(null);
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      if (customId.trim()) {
        formData.append("id", customId.trim());
      }

      const response = await fetch("/api/process-image-qr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process transcript image.");
      }

      // Convert base64 to download blob
      let downloadBlobUrl = "";
      if (data.updatedImageBase64) {
        const byteCharacters = atob(data.updatedImageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        downloadBlobUrl = URL.createObjectURL(blob);
      }

      const resultObj = {
        id: data.id,
        newQrUrl: data.newQrUrl,
        filename: data.filename || `updated-${imageFile.name}`,
        downloadUrl: downloadBlobUrl || `/ref/${data.id}.png`,
        imageBase64: data.updatedImageBase64,
        timestamp: new Date().toISOString(),
      };

      setResult(resultObj);
      saveToHistory(resultObj);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
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
              Transcript QR Code
            </span>{" "}
            Updater & Redirector
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Upload your school transcript image. The tool cleanly removes overlapping QR codes, generates a fresh barcode routing directly to{" "}
            <code className="text-primary-400 font-mono">https://www.gyaschol.com/ref/[id].png</code>, stores it, and renders the updated image.
          </p>
        </div>

        {/* Upload Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Image Drag & Drop Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                1. Upload Transcript Image <span className="text-red-400">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActive
                    ? "border-primary-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mb-3 rounded-full bg-purple-900/30 border border-purple-600/30 flex items-center justify-center text-primary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {imageFile ? (
                  <div className="flex flex-col items-center">
                    {imagePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-32 object-contain rounded-lg border border-purple-500/30 mb-3 shadow"
                      />
                    )}
                    <p className="text-white font-medium text-base mb-1">{imageFile.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                    </p>
                    <span className="inline-block mt-2 text-xs text-primary-400 underline">
                      Click to change image
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Drag and drop your transcript image (<span className="text-primary-400 font-semibold">.jpg, .png</span>) here
                    </p>
                    <p className="text-gray-500 text-xs">or click to browse your computer</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Optional Custom Reference ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                2. Custom Reference ID <span className="text-gray-500 font-normal">(optional, e.g. 1184229)</span>
              </label>
              <input
                type="text"
                placeholder="Leave blank for automatic 7-digit ID"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleProcess}
              disabled={!imageFile || loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                !imageFile || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90 shadow-lg shadow-purple-500/20"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Updating QR & Routing to Domain...</span>
                </>
              ) : (
                <>
                  <span>Process Image & Route to gyaschol.com</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Result Display */}
            {result && (
              <div className="pt-6 border-t border-gray-800 animate-fadeIn space-y-4">
                <div className="p-4 rounded-xl bg-green-950/40 border border-green-700/50 flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-green-300 text-sm">
                      Success! QR Code Updated & Stored
                    </h3>
                    <p className="text-green-400/80 text-xs mt-0.5">
                      The QR code was cleanly replaced and now routes to your website.
                    </p>
                  </div>
                </div>

                {/* Updated Image Preview */}
                {result.downloadUrl && (
                  <div className="p-3 bg-[#121212] rounded-xl border border-gray-800 text-center">
                    <p className="text-xs text-gray-400 mb-2">Updated Image Preview:</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.downloadUrl}
                      alt="Updated Transcript"
                      className="max-h-64 mx-auto rounded-lg border border-gray-700 shadow"
                    />
                  </div>
                )}

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="bg-[#121212] p-3 rounded-lg border border-gray-800 flex items-center justify-between">
                    <span className="text-gray-400">Reference ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-primary-400 font-semibold">{result.id}</span>
                      <button
                        onClick={() => copyToClipboard(result.id, "id")}
                        className="text-gray-400 hover:text-white px-2 py-0.5 bg-gray-800 rounded text-xs"
                      >
                        {copiedId ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#121212] p-3 rounded-lg border border-gray-800 flex flex-col gap-1.5">
                    <span className="text-gray-400">Live Website Image Link:</span>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={result.newQrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-pink-400 hover:underline truncate text-xs"
                      >
                        {result.newQrUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(result.newQrUrl, "url")}
                        className="text-gray-400 hover:text-white px-2 py-0.5 bg-gray-800 rounded text-xs flex-shrink-0"
                      >
                        {copiedUrl ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {result.downloadUrl && (
                    <a
                      href={result.downloadUrl}
                      download={result.filename}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-center font-semibold text-white text-sm shadow-md hover:opacity-90 transition"
                    >
                      Download Updated Image
                    </a>
                  )}
                  <a
                    href={result.newQrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#222430] hover:bg-[#2b2e3d] text-center font-medium text-gray-200 text-sm border border-[#3b3e4f] transition"
                  >
                    Open Live Image Route ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* History List */}
          {history.length > 0 && (
            <div className="mt-10 bg-[#181818] border border-[#33353F] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Processed Images</h2>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-400 transition"
                >
                  Clear History
                </button>
              </div>

              <div className="divide-y divide-gray-800">
                {history.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {item.filename || `Image Ref #${item.id}`}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {item.id} • {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={item.newQrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-primary-400 hover:bg-gray-700 font-medium transition"
                      >
                        View Route
                      </a>
                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          download={item.filename}
                          className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/40 text-purple-200 hover:bg-purple-800/40 font-medium transition"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
