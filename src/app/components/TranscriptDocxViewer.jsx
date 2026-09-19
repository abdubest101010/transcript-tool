"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { parseDocxTranscript, getDefaultTranscriptData } from "../../lib/transcriptParser";
import GibsonTranscriptRenderer from "./GibsonTranscriptRenderer";

export default function TranscriptDocxViewer({ id, docxUrl, photoBlobUrl }) {
  const [loading, setLoading] = useState(true);
  const [transcriptData, setTranscriptData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAndParse() {
      try {
        setLoading(true);

        let data = null;
        const fileUrl = docxUrl || `/api/transcript/${id}/download`;

        try {
          const response = await fetch(fileUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            data = await parseDocxTranscript(arrayBuffer);
          }
        } catch (fetchErr) {
          console.warn("Could not fetch uploaded docx, using fallback data:", fetchErr);
        }

        if (!data) {
          data = getDefaultTranscriptData();
        }

        if (photoBlobUrl && !data.photoDataUrl) {
          data.photoBlobUrl = photoBlobUrl;
        }

        // Ensure QR code is present for verification
        if (!data.qrCodeDataUrl) {
          try {
            const currentUrl = typeof window !== "undefined" ? window.location.href : `https://transcript-tool-liart.vercel.app/t/${id}`;
            data.qrCodeDataUrl = await QRCode.toDataURL(currentUrl, {
              margin: 1,
              errorCorrectionLevel: "H",
              width: 250,
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
  }, [id, docxUrl, photoBlobUrl]);

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
