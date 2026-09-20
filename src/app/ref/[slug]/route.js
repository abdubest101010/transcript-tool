import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getTranscriptData } from "../../../lib/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const rawSlug = params?.slug || "";
    // Clean extension (.png, .jpg, etc.)
    const id = rawSlug.replace(/\.(png|jpe?g|webp)$/i, "").trim();

    // 1. Check local public/generated reference files first
    const publicRefFile = path.join(process.cwd(), "public", "ref", `${id}.jpg`);
    const publicRefFilePng = path.join(process.cwd(), "public", "ref", `${id}.png`);
    const defaultImage = path.join(process.cwd(), "public", "cristian_abebe_transcript_updated.jpg");

    if (fs.existsSync(publicRefFile)) {
      const buf = fs.readFileSync(publicRefFile);
      return new Response(buf, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (fs.existsSync(publicRefFilePng)) {
      const buf = fs.readFileSync(publicRefFilePng);
      return new Response(buf, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 2. Check server store
    const stored = await getTranscriptData(id);
    if (stored && stored.photoBase64) {
      const buf = Buffer.from(stored.photoBase64, "base64");
      return new Response(buf, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 3. Fallback to default Cristian Abebe updated transcript image if exists
    if (fs.existsSync(defaultImage)) {
      const buf = fs.readFileSync(defaultImage);
      return new Response(buf, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.json({ error: "Image reference not found" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
