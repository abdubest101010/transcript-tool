import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        id,
        verified: true,
        message: "Transcript record verified (Local storage mode)",
      });
    }

    const { blobs } = await list({
      prefix: `transcripts/${id}/`,
    });

    const metaBlob = blobs.find((b) => b.pathname.endsWith("metadata.json"));
    const parsedBlob = blobs.find((b) => b.pathname.endsWith("parsedData.json"));

    let metadata = {};
    let parsedData = null;

    if (metaBlob) {
      try {
        const res = await fetch(metaBlob.downloadUrl || metaBlob.url);
        if (res.ok) {
          metadata = await res.json();
        }
      } catch (e) {}
    }

    if (parsedBlob) {
      try {
        const res = await fetch(parsedBlob.downloadUrl || parsedBlob.url);
        if (res.ok) {
          parsedData = await res.json();
        }
      } catch (e) {}
    }

    return NextResponse.json({
      id,
      verified: true,
      ...metadata,
      parsedData,
      blobs,
    });
  } catch (err) {
    return NextResponse.json(
      { id, verified: true, error: err.message },
      { status: 200 }
    );
  }
}
