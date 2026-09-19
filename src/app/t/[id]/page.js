import { list } from "@vercel/blob";
import TranscriptDocxViewer from "../../components/TranscriptDocxViewer";
import { getTranscriptData } from "../../../lib/serverStore";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: `Transcript - ${params.id}`,
    description: `Official Transcript Record`,
  };
}

async function getTranscriptBlobData(id) {
  let docxUrl = null;
  let photoBlobUrl = null;
  let initialParsedData = null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({
        prefix: `transcripts/${id}/`,
      });

      const modifiedBlob =
        blobs.find((b) => b.pathname.includes("/modified-") && b.pathname.endsWith(".docx")) ||
        blobs.find((b) => b.pathname.endsWith(".docx"));

      const photoBlob =
        blobs.find((b) => b.pathname.includes("/photo.") || b.pathname.includes("photo.jpg") || b.pathname.includes("photo.png"));

      const parsedDataBlob = blobs.find((b) => b.pathname.endsWith("parsedData.json"));
      if (parsedDataBlob) {
        try {
          const pRes = await fetch(parsedDataBlob.downloadUrl || parsedDataBlob.url);
          if (pRes.ok) {
            initialParsedData = await pRes.json();
          }
        } catch (e) {}
      }

      docxUrl = modifiedBlob?.downloadUrl || modifiedBlob?.url || null;
      photoBlobUrl = photoBlob?.downloadUrl || photoBlob?.url || null;
    } catch (err) {
      console.warn("Blob fetch in page.js failed, falling back to serverStore:", err);
    }
  }

  // Fallback to server-side persistent store
  if (!initialParsedData) {
    try {
      const localEntry = await getTranscriptData(id);
      if (localEntry) {
        initialParsedData = localEntry.parsedData || null;
        if (!docxUrl && localEntry.modifiedDocxBase64) {
          docxUrl = `/api/transcript/${id}/download`;
        }
        if (!photoBlobUrl && localEntry.photoBase64) {
          photoBlobUrl = `data:image/jpeg;base64,${localEntry.photoBase64}`;
        }
      }
    } catch (e) {}
  }

  return {
    docxUrl: docxUrl || `/api/transcript/${id}/download`,
    photoBlobUrl,
    initialParsedData,
  };
}

export default async function TranscriptPage({ params }) {
  const { id } = params;
  const { docxUrl, photoBlobUrl, initialParsedData } = await getTranscriptBlobData(id);

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-2 sm:p-6 animate-unveil">
      <TranscriptDocxViewer
        id={id}
        docxUrl={docxUrl}
        photoBlobUrl={photoBlobUrl}
        initialData={initialParsedData}
      />
    </main>
  );
}
