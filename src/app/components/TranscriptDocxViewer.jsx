"use client";

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { parseDocxTranscript, getDefaultTranscriptData } from "../../lib/transcriptParser";
import GibsonTranscriptRenderer from "./GibsonTranscriptRenderer";

export default function TranscriptDocxViewer({ id, docxUrl, photoBlobUrl, initialData = null }) {
  const [loading, setLoading] = useState(true);
  const [useDocxPreview, setUseDocxPreview] = useState(false);
  const [transcriptData, setTranscriptData] = useState(initialData);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDocument() {
      try {
        setLoading(true);

        let arrayBuffer = null;

        // 1. Try to get base64 docx from localStorage or sessionStorage
        if (typeof window !== "undefined") {
          try {
            const savedB64 =
              localStorage.getItem(`transcript_doc_b64_${id}`) ||
              sessionStorage.getItem(`transcript_doc_b64_${id}`);
            if (savedB64) {
              const byteCharacters = atob(savedB64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              arrayBuffer = byteArray.buffer;
            }
          } catch (e) {
            console.warn("Could not read base64 docx from storage:", e);
          }
        }

        // 2. If not in local storage, fetch from serverless blob / API download
        if (!arrayBuffer) {
          const fileUrl = docxUrl || `/api/transcript/${id}/download`;
          try {
            const response = await fetch(fileUrl);
            if (response.ok) {
              arrayBuffer = await response.arrayBuffer();
            }
          } catch (fetchErr) {
            console.warn("Could not fetch docx binary from API:", fetchErr);
          }
        }

        // 3. If arrayBuffer is available, render natively with docx-preview for 100% exact fidelity!
        if (arrayBuffer && containerRef.current) {
          try {
            const docx = await import("docx-preview");
            if (containerRef.current && isMounted) {
              containerRef.current.innerHTML = "";
              await docx.renderAsync(arrayBuffer, containerRef.current, null, {
                className: "docx-exact-view",
                inWrapper: false,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: false,
                renderHeaders: true,
                renderFooters: true,
                useBase64URL: true,
              });

              if (isMounted) {
                setUseDocxPreview(true);
                setLoading(false);
              }
              return;
            }
          } catch (docxPreviewErr) {
            console.warn("docx-preview render error, falling back to parsed renderer:", docxPreviewErr);
          }
        }

        // 4. Fallback: Parse structured data or use stored parsedData
        let data = initialData ? { ...initialData } : null;

        if (!data && arrayBuffer) {
          data = await parseDocxTranscript(arrayBuffer);
        }

        if (!data && typeof window !== "undefined") {
          try {
            const savedParsed =
              localStorage.getItem(`transcript_parsed_${id}`) ||
              sessionStorage.getItem(`transcript_parsed_${id}`);
            if (savedParsed) {
              data = JSON.parse(savedParsed);
            }
          } catch (e) {}
        }

        if (!data) {
          try {
            const metaRes = await fetch(`/api/transcript/${id}`);
            if (metaRes.ok) {
              const metaJson = await metaRes.json();
              if (metaJson.parsedData) {
                data = metaJson.parsedData;
              }
            }
          } catch (apiErr) {}
        }

        if (!data) {
          data = getDefaultTranscriptData();
        }

        if (photoBlobUrl && !data.photoDataUrl) {
          data.photoBlobUrl = photoBlobUrl;
        }

        if (!data.qrCodeDataUrl) {
          try {
            const currentUrl =
              typeof window !== "undefined"
                ? window.location.href
                : `https://transcript-tool-liart.vercel.app/t/${id}`;
            data.qrCodeDataUrl = await QRCode.toDataURL(currentUrl, {
              margin: 2,
              errorCorrectionLevel: "M",
              width: 400,
            });
          } catch (qrErr) {}
        }

        if (isMounted) {
          setTranscriptData(data);
          setUseDocxPreview(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("General render error:", err);
        if (isMounted) {
          setTranscriptData(getDefaultTranscriptData());
          setUseDocxPreview(false);
          setLoading(false);
        }
      }
    }

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [id, docxUrl, photoBlobUrl, initialData]);

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-white text-black py-4 sm:py-8 px-2 sm:px-4">
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-sm font-medium">Loading official transcript...</p>
        </div>
      )}

      {/* Main Document Viewport with Left-to-Right Horizontal Scrolling Support & Unveiling Animation */}
      <div
        className={`w-full overflow-x-auto docx-scroll-wrapper pb-10 flex flex-col items-start sm:items-center animate-unveil ${
          loading ? "hidden" : "block"
        }`}
      >
        <div className="min-w-fit mx-auto bg-white">
          {/* Exact DOCX DOM Container */}
          <div
            ref={containerRef}
            className={`docx-exact-container ${useDocxPreview ? "block" : "hidden"}`}
          />

          {/* Backup Structured Renderer */}
          {!useDocxPreview && transcriptData && (
            <GibsonTranscriptRenderer data={transcriptData} />
          )}
        </div>
      </div>
    </div>
  );
}
