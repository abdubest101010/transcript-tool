"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DirectImageStoragePage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [customRoute, setCustomRoute] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conflictModal, setConflictModal] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const fileInputRef = useRef(null);

  // Load storage history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("direct_image_store_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load storage history:", e);
    }
  }, []);

  const saveToHistory = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h.slugId !== item.slugId)].slice(0, 15);
      try {
        localStorage.setItem("direct_image_store_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("direct_image_store_history");
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

  const validateAndSetImage = (file) => {
    setError(null);
    setResult(null);
    setConflictModal(null);
    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      setError("Please select a valid image file (.png, .jpg, .jpeg, .webp).");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleStore = async (overwriteConfirmed = false) => {
    if (!imageFile) {
      setError("Please select an image file first.");
      return;
    }

    setLoading(true);
    setError(null);
    if (!overwriteConfirmed) {
      setConflictModal(null);
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      if (customRoute.trim()) {
        formData.append("route", customRoute.trim());
      }
      if (overwriteConfirmed) {
        formData.append("overwrite", "true");
      }

      const response = await fetch("/api/store-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to store image.");
      }

      // Check if server detected route conflict
      if (data.requireConfirmation && data.exists) {
        setConflictModal({
          slugId: data.slugId,
          publicUrl: data.publicUrl,
          message: data.message,
          existingInfo: data.existingInfo,
        });
        setLoading(false);
        return;
      }

      // Success
      setConflictModal(null);
      const resItem = {
        slugId: data.slugId,
        publicUrl: data.publicUrl,
        downloadUrl: data.downloadUrl,
        filename: data.filename,
        overwritten: data.overwritten,
        previewUrl: imagePreview,
        timestamp: data.timestamp,
      };

      setResult(resItem);
      saveToHistory(resItem);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while storing the image.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 mt-28 mb-16 flex-1">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Direct Image Hosting & Route Registry
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Direct Image
            </span>{" "}
            Storage
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Upload any image and store it directly on your website with zero modifications (no edits, no QR changes).
            Optionally specify a custom URL/route (e.g. <code className="text-blue-400 font-mono">1184229</code> or{" "}
            <code className="text-blue-400 font-mono">https://gs.gyaschol.com/ref/1184229.png</code>). If the route exists, you will be prompted before overwriting.
          </p>
        </div>

        {/* Upload Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#181818] border border-[#33353F] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* 1. Image Drag & Drop Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                1. Select Image to Store <span className="text-red-400">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-500 bg-[#121212]/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mb-3 rounded-full bg-blue-900/30 border border-blue-600/30 flex items-center justify-center text-blue-400">
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
                        className="w-48 h-32 object-contain rounded-lg border border-blue-500/30 mb-3 shadow"
                      />
                    )}
                    <p className="text-white font-medium text-base mb-1">{imageFile.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to store
                    </p>
                    <span className="inline-block mt-2 text-xs text-blue-400 underline">
                      Click to choose another image
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      Drag and drop your image file here
                    </p>
                    <p className="text-gray-500 text-xs">Supports PNG, JPG, JPEG, WebP, SVG</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Optional Custom Route Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                2. Custom Storage Route / Link <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1184229 or https://gs.gyaschol.com/ref/1184229.png"
                value={customRoute}
                onChange={(e) => {
                  setCustomRoute(e.target.value);
                  setConflictModal(null);
                }}
                className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to automatically assign a random 7-digit ID.
              </p>
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

            {/* Conflict Overwrite Modal Alert */}
            {conflictModal && (
              <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-600/60 text-amber-200 animate-fadeIn space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 font-bold">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-300 text-base">Route Already Exists</h3>
                    <p className="text-xs text-amber-300/80 mt-1">
                      An image is already registered at <span className="font-mono font-bold text-white">{conflictModal.publicUrl}</span>.
                    </p>
                    <p className="text-xs text-amber-400 mt-1 font-semibold">
                      Do you want to overwrite the existing image at this route?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStore(true)}
                    className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs shadow transition"
                  >
                    Yes, Overwrite It
                  </button>
                  <button
                    type="button"
                    onClick={() => setConflictModal(null)}
                    className="flex-1 py-2 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition"
                  >
                    Cancel / Choose Another Route
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {!conflictModal && (
              <button
                onClick={() => handleStore(false)}
                disabled={!imageFile || loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                  !imageFile || loading
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-500/20"
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
                    <span>Saving to Server & Registry...</span>
                  </>
                ) : (
                  <>
                    <span>Store Image Automatically</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}

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
                      {result.overwritten ? "Image Successfully Overwritten!" : "Image Successfully Stored!"}
                    </h3>
                    <p className="text-green-400/80 text-xs mt-0.5">
                      Your image is stored unmodified and is now active at your website route.
                    </p>
                  </div>
                </div>

                {/* Stored Route Information */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="bg-[#121212] p-3.5 rounded-xl border border-gray-800 flex flex-col gap-2">
                    <span className="text-gray-400 font-medium">Live Website Image Link:</span>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={result.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-blue-400 hover:underline truncate text-xs sm:text-sm font-semibold"
                      >
                        {result.publicUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(result.publicUrl)}
                        className="text-gray-300 hover:text-white px-2.5 py-1 bg-gray-800 rounded-lg text-xs flex-shrink-0 border border-gray-700 transition"
                      >
                        {copiedUrl ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={result.downloadUrl}
                    download={result.filename}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-center font-semibold text-white text-sm shadow-md hover:opacity-90 transition"
                  >
                    Download Image
                  </a>
                  <a
                    href={result.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#222430] hover:bg-[#2b2e3d] text-center font-medium text-gray-200 text-sm border border-[#3b3e4f] transition"
                  >
                    Open Live Image ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* History List */}
          {history.length > 0 && (
            <div className="mt-10 bg-[#181818] border border-[#33353F] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recently Stored Images</h2>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-400 transition"
                >
                  Clear History
                </button>
              </div>

              <div className="divide-y divide-gray-800">
                {history.map((item) => (
                  <div key={item.slugId} className="py-3 flex items-center justify-between gap-4">
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {item.filename || `Image /ref/${item.slugId}.png`}
                      </p>
                      <p className="text-xs text-blue-400 font-mono truncate">
                        {item.publicUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={item.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-blue-400 hover:bg-gray-700 font-medium transition"
                      >
                        View Link
                      </a>
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
