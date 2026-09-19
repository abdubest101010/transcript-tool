import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getTranscriptData, getTranscriptDocxBuffer } from "../../../../../lib/serverStore";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing transcript ID" }, { status: 400 });
  }

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: `transcripts/${id}/`,
        });

        const modifiedBlob =
          blobs.find((b) => b.pathname.includes("/modified-") && b.pathname.endsWith(".docx")) ||
          blobs.find((b) => b.pathname.endsWith(".docx"));

        if (modifiedBlob) {
          return NextResponse.redirect(modifiedBlob.downloadUrl || modifiedBlob.url, 307);
        }
      } catch (blobErr) {
        console.warn("Blob download redirect failed, checking local store:", blobErr);
      }
    }

    // Check server persistent store
    const docxBuffer = await getTranscriptDocxBuffer(id);
    if (docxBuffer) {
      const data = await getTranscriptData(id);
      const filename = data?.metadata?.originalFilename ? `modified-${data.metadata.originalFilename}` : `transcript-${id}.docx`;
      const safeFilename = encodeURIComponent(filename);

      return new Response(docxBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        },
      });
    }

    return NextResponse.json(
      { error: "Transcript file not found for this ID." },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
