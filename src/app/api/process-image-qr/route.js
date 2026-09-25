import { NextResponse } from "next/server";
import { processSurgicalQrReplacement } from "../../../lib/imageProcessor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") || formData.get("file");
    const customId = formData.get("id") || formData.get("customId") || "1184229";

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { error: "Please upload a valid transcript image file (.jpg, .jpeg, .png, .webp)." },
        { status: 400 }
      );
    }

    const filename = imageFile.name || "transcript_image.jpg";
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Host domain (default to gs.gyaschol.com)
    const domainBaseUrl = `https://gs.gyaschol.com`;

    const result = await processSurgicalQrReplacement(
      imageBuffer,
      filename,
      customId,
      domainBaseUrl
    );

    return NextResponse.json({
      success: true,
      id: result.id,
      newQrUrl: result.newQrUrl,
      detection: result.detection,
      filename: result.filename,
      updatedImageBase64: result.updatedImageBase64,
      downloadUrl: result.downloadUrl,
    });
  } catch (error) {
    console.error("Error in process-image-qr route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transcript image." },
      { status: 500 }
    );
  }
}
