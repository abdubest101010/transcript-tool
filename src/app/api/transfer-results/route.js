import { NextResponse } from "next/server";
import { copyResultsBetweenDocx } from "../../../lib/tableCopier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const sourceFile = formData.get("sourceFile") || formData.get("fileA");
    const targetFile = formData.get("targetFile") || formData.get("fileB") || formData.get("docxFile");

    if (!sourceFile || typeof sourceFile === "string") {
      return NextResponse.json(
        { error: "Please upload the Source Results Document (.docx)." },
        { status: 400 }
      );
    }

    if (!targetFile || typeof targetFile === "string") {
      return NextResponse.json(
        { error: "Please upload the Target Transcript Document (.docx)." },
        { status: 400 }
      );
    }

    const sourceName = sourceFile.name || "source.docx";
    const targetName = targetFile.name || "target.docx";

    if (!sourceName.toLowerCase().endsWith(".docx") || !targetName.toLowerCase().endsWith(".docx")) {
      return NextResponse.json(
        { error: "Both files must be valid Word documents (.docx)." },
        { status: 400 }
      );
    }

    const sourceBuffer = Buffer.from(await sourceFile.arrayBuffer());
    const targetBuffer = Buffer.from(await targetFile.arrayBuffer());

    // Perform exact result copy preserving 100% of target formatting
    const updatedDocxBuffer = await copyResultsBetweenDocx(sourceBuffer, targetBuffer);

    const outputFilename = "Updated_Student_Transcript.docx";
    const format = request.nextUrl.searchParams.get("format");
    const acceptHeader = request.headers.get("accept") || "";

    if (format === "json" || acceptHeader.includes("application/json")) {
      return NextResponse.json({
        success: true,
        filename: outputFilename,
        modifiedDocxBase64: updatedDocxBuffer.toString("base64"),
        message: "Successfully transferred results while preserving 100% of target formatting.",
      });
    }

    const safeFilename = encodeURIComponent(outputFilename);
    return new Response(updatedDocxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error) {
    console.error("Error copying results between documents:", error);
    return NextResponse.json(
      { error: error.message || "Failed to copy results between documents." },
      { status: 500 }
    );
  }
}
