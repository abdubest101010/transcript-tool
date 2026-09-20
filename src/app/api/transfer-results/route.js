import { NextResponse } from "next/server";
import { injectResultsIntoDocx, DEFAULT_TRANSCRIPT_SUBJECTS } from "../../../lib/tableFiller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const docxFile = formData.get("docxFile");
    const gradesJson = formData.get("gradesJson");

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

    let grades = DEFAULT_TRANSCRIPT_SUBJECTS;

    if (gradesJson && typeof gradesJson === "string") {
      try {
        const parsed = JSON.parse(gradesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          grades = parsed;
        }
      } catch (e) {}
    }

    // Process and inject results into Word document
    const updatedDocxBuffer = await injectResultsIntoDocx(docxBuffer, grades);

    return NextResponse.json({
      success: true,
      filename: `updated-${docxFilename}`,
      modifiedDocxBase64: updatedDocxBuffer.toString("base64"),
      message: "Scores successfully updated in Word document.",
    });
  } catch (error) {
    console.error("Error updating table results in DOCX:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update table in Word document." },
      { status: 500 }
    );
  }
}
