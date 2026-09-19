"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { parseDocxTranscript, getDefaultTranscriptData } from "../../lib/transcriptParser";
import GibsonTranscriptRenderer from "./GibsonTranscriptRenderer";

export default function TranscriptDocxViewer({ id, docxUrl, photoBlobUrl, initialData = null }) {
  const [loading, setLoading] = useState(!initialData);
  const [transcriptData, setTranscriptData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;

    async function loadAndParse() {
      try {
        if (!initialData) {
          setLoading(true);
        }

        let data = initialData ? { ...initialData } : null;

        // 1. Check localStorage / sessionStorage for saved transcript data
        if (!data && typeof window !== "undefined") {
          try {
            const savedParsed =
              localStorage.getItem(`transcript_parsed_${id}`) ||
              sessionStorage.getItem(`transcript_parsed_${id}`);
            if (savedParsed) {
              data = JSON.parse(savedParsed);
            }
          } catch (e) {
            console.warn("Could not read from local storage:", e);
          }
        }

        // 2. If base64 docx buffer was saved in localStorage, parse it
        if (!data && typeof window !== "undefined") {
          try {
            const savedB64 = localStorage.getItem(`transcript_doc_b64_${id}`);
            if (savedB64) {
              const byteCharacters = atob(savedB64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              data = await parseDocxTranscript(byteArray.buffer);
            }
          } catch (e) {
            console.warn("Could not parse docx from localStorage:", e);
          }
        }

        // 3. Query the transcript API endpoint for parsedData or metadata
        if (!data) {
          try {
            const metaRes = await fetch(`/api/transcript/${id}`);
            if (metaRes.ok) {
              const metaJson = await metaRes.json();
              if (metaJson.parsedData) {
                data = metaJson.parsedData;
              }
            }
          } catch (apiErr) {
            console.warn("Could not fetch metadata from API:", apiErr);
          }
        }

        // 4. Try fetching uploaded docx binary
        if (!data) {
          const fileUrl = docxUrl || `/api/transcript/${id}/download`;
          try {
            const response = await fetch(fileUrl);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              data = await parseDocxTranscript(arrayBuffer);
            }
          } catch (fetchErr) {
            console.warn("Could not fetch uploaded docx binary:", fetchErr);
          }
        }

        // 5. If still completely unfound, use default transcript structure
        if (!data) {
          data = getDefaultTranscriptData();
        }

        if (photoBlobUrl && !data.photoDataUrl) {
          data.photoBlobUrl = photoBlobUrl;
        }

        // 6. Ensure high-resolution, clear QR code is generated for verification
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
          } catch (qrErr) {
            console.warn("QR code generation error:", qrErr);
          }
        }

        if (isMounted) {
          setTranscriptData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Rendering error:", err);
        if (isMounted) {
          const fallback = getDefaultTranscriptData();
          setTranscriptData(fallback);
          setLoading(false);
        }
      }
    }

    loadAndParse();

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
      {!loading && transcriptData && (
        <div className="w-full overflow-x-auto docx-scroll-wrapper pb-10 flex flex-col items-start sm:items-center animate-unveil">
          <div className="min-w-fit mx-auto">
            <GibsonTranscriptRenderer data={transcriptData} />
          </div>
        </div>
      )}
    </div>
  );
}
