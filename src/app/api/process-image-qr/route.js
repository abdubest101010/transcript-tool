import { NextResponse } from "next/server";
import { processTranscriptImage } from "../../../lib/imageProcessor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") || formData.get("file");
    const customId = formData.get("id") || formData.get("customId");

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { error: "Please upload a valid transcript image file (.jpg, .jpeg, .png, .webp)." },
        { status: 400 }
      );
    }

    const filename = imageFile.name || "transcript_image.jpg";
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Host domain
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "www.gyaschol.com";
    const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const domainBaseUrl = `https://www.gyaschol.com`;

    const result = await processTranscriptImage(
      imageBuffer,
      filename,
      customId,
      domainBaseUrl
    );

    return NextResponse.json({
      success: true,
      id: result.id,
      newQrUrl: result.newQrUrl,
      originalQrData: result.originalQrData,
      filename: result.filename,
      updatedImageBase64: result.updatedImageBase64,
      downloadUrl: `/ref/${result.id}.png`,
    });
  } catch (error) {
    console.error("Error in process-image-qr route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transcript image." },
      { status: 500 }
    );
  }
}
