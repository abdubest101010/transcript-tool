import { NextResponse } from "next/server";
import { extractTableFromImageBuffer, injectResultsIntoDocx, parseTextIntoGradeRows } from "../../../lib/tableFiller";
import JSZip from "jszip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const docxFile = formData.get("docxFile") || formData.get("fileB");
    const imageFile = formData.get("imageFile") || formData.get("sourceFile") || formData.get("fileA");
    const manualGradesJson = formData.get("gradesJson");

    if (!docxFile || typeof docxFile === "string") {
      return NextResponse.json(
        { error: "Please upload the target Word document (.docx)." },
        { status: 400 }
      );
    }

    const docxFilename = docxFile.name || "document.docx";
    if (!docxFilename.toLowerCase().endsWith(".docx")) {
      return NextResponse.json(
        { error: "The document file must be in .docx format." },
        { status: 400 }
      );
    }

    const docxBuffer = Buffer.from(await docxFile.arrayBuffer());

    let grades = [];

    // 1. If manual / parsed grades JSON is provided directly
    if (manualGradesJson && typeof manualGradesJson === "string") {
      try {
        grades = JSON.parse(manualGradesJson);
      } catch (e) {}
    }

    // 2. If an image file is uploaded
    if (grades.length === 0 && imageFile && typeof imageFile !== "string") {
      const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imgName = (imageFile.name || "").toLowerCase();

      if (imgName.endsWith(".png") || imgName.endsWith(".jpg") || imgName.endsWith(".jpeg") || imgName.endsWith(".webp")) {
        grades = await extractTableFromImageBuffer(imgBuffer);
      } else if (imgName.endsWith(".docx")) {
        // Extract from source DOCX
        const { parseDocxTranscript } = await import("../../../lib/transcriptParser");
        const parsed = await parseDocxTranscript(imgBuffer);
        if (parsed.gradeRows) {
          grades = parsed.gradeRows.map((r) => ({
            subject: r.subject,
            scores: [...(r.g9 || []), ...(r.g10 || []), ...(r.g11 || []), ...(r.g12 || [])],
          }));
        }
      }
    }

    if (grades.length === 0) {
      return NextResponse.json(
        { error: "Could not detect subject scores from the provided image. Please check the image or provide the score table." },
        { status: 400 }
      );
    }

    // Inject the results into the DOCX
    const updatedDocxBuffer = await injectResultsIntoDocx(docxBuffer, grades);

    const format = request.nextUrl.searchParams.get("format");
    const acceptHeader = request.headers.get("accept") || "";

    if (format === "json" || acceptHeader.includes("application/json")) {
      return NextResponse.json({
        success: true,
        filename: `updated-${docxFilename}`,
        extractedGrades: grades,
        modifiedDocxBase64: updatedDocxBuffer.toString("base64"),
      });
    }

    const safeFilename = encodeURIComponent(`updated-${docxFilename}`);
    return new Response(updatedDocxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error) {
    console.error("Error updating table results in DOCX:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update table in Word document." },
      { status: 500 }
    );
  }
}
