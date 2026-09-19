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

    async function loadDocument() {
      try {
        if (!initialData) {
          setLoading(true);
        }

        let data = initialData ? { ...initialData } : null;

        // 1. Try to get parsed data or base64 docx from localStorage
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

        if (!data && typeof window !== "undefined") {
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
              data = await parseDocxTranscript(byteArray.buffer);
            }
          } catch (e) {}
        }

        // 2. Query API for parsedData or metadata
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

        // 3. Fetch docx binary from API if available
        if (!data) {
          const fileUrl = docxUrl || `/api/transcript/${id}/download`;
          try {
            const response = await fetch(fileUrl);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              data = await parseDocxTranscript(arrayBuffer);
            }
          } catch (fetchErr) {}
        }

        // 4. Default authentic Gibson transcript template
        if (!data) {
          data = getDefaultTranscriptData();
        }

        if (photoBlobUrl && !data.photoDataUrl) {
          data.photoBlobUrl = photoBlobUrl;
        }

        // Ensure QR code is present and high resolution
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
          setLoading(false);
        }
      } catch (err) {
        console.error("General render error:", err);
        if (isMounted) {
          setTranscriptData(getDefaultTranscriptData());
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
    <div className="w-full flex flex-col items-center min-h-screen bg-white text-black py-2 sm:py-6 px-1 sm:px-4">
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-sm font-medium">Loading official transcript...</p>
        </div>
      )}

      {/* Main Document Viewport matching gs.gyaschool.com/ref reference */}
      {!loading && transcriptData && (
        <div className="w-full overflow-x-auto docx-scroll-wrapper pb-10 flex flex-col items-start sm:items-center animate-unveil">
          <div className="min-w-fit mx-auto bg-white border border-gray-100 shadow-sm p-2 sm:p-4 rounded-xs">
            <GibsonTranscriptRenderer data={transcriptData} />
          </div>
        </div>
      )}
    </div>
  );
}
