import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getTranscriptData } from "../../../../lib/serverStore";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    let metadata = {};
    let parsedData = null;
    let blobs = [];

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const listResult = await list({
          prefix: `transcripts/${id}/`,
        });
        blobs = listResult.blobs;

        const metaBlob = blobs.find((b) => b.pathname.endsWith("metadata.json"));
        const parsedBlob = blobs.find((b) => b.pathname.endsWith("parsedData.json"));

        if (metaBlob) {
          const res = await fetch(metaBlob.downloadUrl || metaBlob.url);
          if (res.ok) {
            metadata = await res.json();
          }
        }

        if (parsedBlob) {
          const res = await fetch(parsedBlob.downloadUrl || parsedBlob.url);
          if (res.ok) {
            parsedData = await res.json();
          }
        }
      } catch (blobErr) {
        console.warn("Blob fetch failed, trying local store:", blobErr);
      }
    }

    // Fallback to server-side persistent store
    if (!parsedData) {
      const localEntry = await getTranscriptData(id);
      if (localEntry) {
        parsedData = localEntry.parsedData || null;
        metadata = localEntry.metadata || metadata;
      }
    }

    if (!parsedData && !metadata?.id) {
      return NextResponse.json(
        { id, error: "Transcript not found", verified: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id,
      verified: true,
      ...metadata,
      parsedData,
      blobs,
      docxUrl: `/api/transcript/${id}/download`,
    });
  } catch (err) {
    return NextResponse.json(
      { id, verified: false, error: err.message },
      { status: 500 }
    );
  }
}
