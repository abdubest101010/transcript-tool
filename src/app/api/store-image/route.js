import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { getTranscriptData, saveTranscriptData } from "../../../lib/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeRoute(rawRoute) {
  if (!rawRoute) return "";
  let clean = rawRoute.trim();
  clean = clean.replace(/^https?:\/\/[^\/]+/i, "");
  clean = clean.replace(/^\/+|\/+$/g, "");
  if (clean.toLowerCase().startsWith("ref/")) {
    clean = clean.substring(4);
  }
  clean = clean.replace(/\.(png|jpe?g|webp)$/i, "");
  return clean;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") || formData.get("file");
    const routeInput = formData.get("route") || formData.get("slug") || formData.get("id") || "";
    const checkOnly = formData.get("checkOnly") === "true";
    const overwrite = formData.get("overwrite") === "true";

    // 1. Validate route or generate automatic random 7-digit ID
    let slugId = sanitizeRoute(routeInput);
    if (!slugId) {
      slugId = String(Math.floor(1000000 + Math.random() * 9000000));
    }

    const publicRefJpg = path.join(process.cwd(), "public", "ref", `${slugId}.jpg`);
    const publicRefPng = path.join(process.cwd(), "public", "ref", `${slugId}.png`);

    // 2. Check if route already exists
    let exists = false;
    let existingInfo = null;

    try {
      if (fs.existsSync(publicRefJpg) || fs.existsSync(publicRefPng)) {
        exists = true;
      }
    } catch (e) {}

    const storedData = await getTranscriptData(slugId);
    if (storedData) {
      exists = true;
      existingInfo = {
        savedAt: storedData.savedAt,
        filename: storedData.metadata?.originalFilename,
      };
    }

    // If request is only checking route availability
    if (checkOnly) {
      return NextResponse.json({
        exists,
        slugId,
        publicUrl: `https://gs.gyaschol.com/ref/${slugId}.png`,
        existingInfo,
      });
    }

    // If exists and user did not confirm overwrite
    if (exists && !overwrite) {
      return NextResponse.json({
        exists: true,
        slugId,
        publicUrl: `https://gs.gyaschol.com/ref/${slugId}.png`,
        message: `The route 'ref/${slugId}.png' already exists. Do you want to overwrite it?`,
        requireConfirmation: true,
        existingInfo,
      });
    }

    // 3. Process and store image directly (as-is, zero modifications)
    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { error: "Please upload a valid image file." },
        { status: 400 }
      );
    }

    const filename = imageFile.name || "stored_image.png";
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Safe write to public/ref directory if writable
    try {
      const refDir = path.join(process.cwd(), "public", "ref");
      if (!fs.existsSync(refDir)) {
        fs.mkdirSync(refDir, { recursive: true });
      }
      fs.writeFileSync(path.join(refDir, `${slugId}.png`), imageBuffer);
      fs.writeFileSync(path.join(refDir, `${slugId}.jpg`), imageBuffer);
    } catch (fsErr) {
      console.warn("Public directory write skipped (serverless environment):", fsErr.message);
    }

    // Always persist to serverStore (/tmp + in-memory)
    await saveTranscriptData(slugId, {
      metadata: {
        originalFilename: filename,
        slugId,
        publicUrl: `https://gs.gyaschol.com/ref/${slugId}.png`,
        savedAt: new Date().toISOString(),
        directStorage: true,
      },
      photoBuffer: imageBuffer,
      photoBase64: imageBuffer.toString("base64"),
    });

    const publicUrl = `https://gs.gyaschol.com/ref/${slugId}.png`;
    const vercelUrl = `/ref/${slugId}.png`;

    return NextResponse.json({
      success: true,
      overwritten: exists,
      slugId,
      publicUrl,
      downloadUrl: vercelUrl,
      filename,
      sizeBytes: imageBuffer.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in store-image API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to store image." },
      { status: 500 }
    );
  }
}
