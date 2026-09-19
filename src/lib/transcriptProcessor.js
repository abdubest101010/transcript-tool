import JSZip from "jszip";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";

// 10-character URL-friendly alphanumeric ID generator
const generateNanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

/**
 * Attempts to decode a QR code from any image format (PNG, JPEG, WebP, etc.).
 */
async function decodeQrFromAnyImage(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    return code ? code.data : null;
  } catch (err) {
    return null;
  }
}

/**
 * Generates a crisp, high-resolution PNG buffer of a QR code.
 */
async function generateQrCodePng(url, width = 600) {
  return await QRCode.toBuffer(url, {
    type: "png",
    width: width,
    margin: 3,
    errorCorrectionLevel: "M",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

/**
 * Processes a DOCX buffer and optional student photo:
 * 1. Replaces the QR code pointing to https://transcript-tool-liart.vercel.app/t/{id}
 * 2. If photo is provided, center-crops/resizes it and places it in the photo box
 * 3. Saves documents, photo, and metadata to Vercel Blob
 */
export async function processTranscriptDocx(
  fileBuffer,
  originalFilename = "transcript.docx",
  photoBuffer = null,
  photoFilename = "photo.jpg",
  customBaseUrl = null
) {
  const id = generateNanoid();
  const baseUrl =
    customBaseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://transcript-tool-liart.vercel.app";

  const newQrUrl = `${baseUrl.replace(/\/$/, "")}/t/${id}`;

  const zip = await JSZip.loadAsync(fileBuffer);

  let targetImagePath = null;
  let originalQrData = null;
  let qrCodeLocation = null;
  let targetImageBuffer = null;
  let targetImageInfo = null;

  // Extract all media files from the DOCX zip
  const mediaFiles = [];
  zip.folder("word/media")?.forEach((relativePath, file) => {
    mediaFiles.push({ path: `word/media/${relativePath}`, file });
  });

  // Scan all media images to find the exact QR code
  for (const item of mediaFiles) {
    if (
      item.path.toLowerCase().endsWith(".png") ||
      item.path.toLowerCase().endsWith(".jpg") ||
      item.path.toLowerCase().endsWith(".jpeg") ||
      item.path.toLowerCase().endsWith(".webp")
    ) {
      try {
        const imgBuf = await item.file.async("nodebuffer");
        if (imgBuf.length > 0) {
          const { data, info } = await sharp(imgBuf)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

          const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
          if (code) {
            originalQrData = code.data;
            targetImagePath = item.path;
            qrCodeLocation = code.location;
            targetImageBuffer = imgBuf;
            targetImageInfo = info;
            break;
          }
        }
      } catch (e) {}
    }
  }

  let documentPageDataUrl = null;
  let documentPageBuffer = null;

  if (targetImagePath && targetImageBuffer && qrCodeLocation && targetImageInfo) {
    const minX = Math.min(qrCodeLocation.topLeftCorner.x, qrCodeLocation.bottomLeftCorner.x);
    const maxX = Math.max(qrCodeLocation.topRightCorner.x, qrCodeLocation.bottomRightCorner.x);
    const minY = Math.min(qrCodeLocation.topLeftCorner.y, qrCodeLocation.topRightCorner.y);
    const maxY = Math.max(qrCodeLocation.bottomLeftCorner.y, qrCodeLocation.bottomRightCorner.y);

    const qrW = maxX - minX;
    const qrH = maxY - minY;
    const qrSize = Math.round(Math.max(qrW, qrH));

    const isFullPageScan = qrSize / targetImageInfo.width < 0.75;

    if (isFullPageScan) {
      // It's a scanned page containing the QR code inside it!
      // Overlay the new QR code onto the exact QR bounding box on the original scanned page!
      const left = Math.max(0, Math.round(minX));
      const top = Math.max(0, Math.round(minY));

      const newQrPng = await QRCode.toBuffer(newQrUrl, {
        type: "png",
        width: qrSize,
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const newQrResized = await sharp(newQrPng)
        .resize(qrSize, qrSize, { fit: "fill" })
        .toBuffer();

      const isTargetJpg =
        targetImagePath.toLowerCase().endsWith(".jpg") ||
        targetImagePath.toLowerCase().endsWith(".jpeg");

      let composited;
      if (isTargetJpg) {
        composited = await sharp(targetImageBuffer)
          .composite([{ input: newQrResized, left, top }])
          .jpeg({ quality: 95 })
          .toBuffer();
      } else {
        composited = await sharp(targetImageBuffer)
          .composite([{ input: newQrResized, left, top }])
          .png()
          .toBuffer();
      }

      zip.file(targetImagePath, composited);
      documentPageBuffer = composited;
      const mime = isTargetJpg ? "image/jpeg" : "image/png";
      documentPageDataUrl = `data:${mime};base64,${composited.toString("base64")}`;
    } else {
      // Standalone QR image file: replace the image directly
      const isTargetJpg =
        targetImagePath.toLowerCase().endsWith(".jpg") ||
        targetImagePath.toLowerCase().endsWith(".jpeg");
      let newQrBuffer = await generateQrCodePng(newQrUrl, 600);
      if (isTargetJpg) {
        newQrBuffer = await sharp(newQrBuffer).jpeg({ quality: 95 }).toBuffer();
      }
      zip.file(targetImagePath, newQrBuffer);
    }
  } else {
    // Fallback: target image2.png
    targetImagePath = "word/media/image2.png";
    const newQrBuffer = await generateQrCodePng(newQrUrl, 600);
    zip.file(targetImagePath, newQrBuffer);
  }

  // Process optional Student Photo
  let processedPhotoBuffer = null;
  let photoBlobUrl = null;

  if (photoBuffer && photoBuffer.length > 0) {
    try {
      // Resize & center-crop photo to exact portrait dimensions (300x360 px, 5:6 aspect ratio)
      processedPhotoBuffer = await sharp(photoBuffer)
        .resize(300, 360, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Place image inside zip
      zip.file("word/media/image_photo.jpg", processedPhotoBuffer);

      // Ensure [Content_Types].xml has jpg / jpeg
      const ctPath = "[Content_Types].xml";
      let ctXml = (await zip.file(ctPath)?.async("text")) || "";
      if (ctXml && !ctXml.includes('Extension="jpg"')) {
        ctXml = ctXml.replace("<Types", '<Types><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="jpeg" ContentType="image/jpeg"/>');
        zip.file(ctPath, ctXml);
      }

      // Add relationship to word/_rels/document.xml.rels
      const relsPath = "word/_rels/document.xml.rels";
      let relsXml = (await zip.file(relsPath)?.async("text")) || "";
      if (relsXml && !relsXml.includes("image_photo.jpg")) {
        const photoRel = `<Relationship Id="rIdPhoto" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image_photo.jpg"/>`;
        relsXml = relsXml.replace("</Relationships>", `${photoRel}</Relationships>`);
        zip.file(relsPath, relsXml);
      }

      // Insert photo drawing XML inside photo box in word/document.xml
      const docPath = "word/document.xml";
      let docXml = (await zip.file(docPath)?.async("text")) || "";
      if (docXml) {
        // Ensure root <w:document> includes wp, pic, a, and r namespaces if missing
        if (!docXml.includes('xmlns:wp=')) {
          docXml = docXml.replace('<w:document ', '<w:document xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ');
        }

        const photoDrawingXml = `<w:p w:rsidR="003576BC" w:rsidRDefault="00F428F1"><w:pPr><w:jc w:val="center"/><w:spacing w:after="0" w:before="0"/></w:pPr><w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:extent cx="1069354" cy="1283225"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="99" name="Student Photo"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="99" name="student_photo.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rIdPhoto" cstate="print"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1069354" cy="1283225"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;

        // Target the bordered photo box cell in Table 0
        const boxBorderMarker = 'w:sz="7" w:space="0" w:color="000000"';
        const boxIdx = docXml.indexOf(boxBorderMarker);
        if (boxIdx !== -1) {
          const afterPr = docXml.indexOf('</w:tcPr>', boxIdx);
          if (afterPr !== -1) {
            const pEnd = docXml.indexOf('</w:p>', afterPr) + 6;
            // Replace the empty paragraph inside the bordered photo cell with our photo drawing paragraph
            docXml = docXml.substring(0, afterPr + 9) + photoDrawingXml + docXml.substring(pEnd);
            zip.file(docPath, docXml);
          }
        } else {
          // Fallback: Insert before "Note: The photo is"
          const noteIdx = docXml.indexOf("Note: The photo is");
          if (noteIdx !== -1) {
            const pStart = docXml.lastIndexOf("<w:p", noteIdx);
            if (pStart !== -1) {
              docXml = docXml.slice(0, pStart) + photoDrawingXml + docXml.slice(pStart);
              zip.file(docPath, docXml);
            }
          }
        }
      }
    } catch (photoErr) {
      console.warn("Could not process photo for DOCX:", photoErr.message);
    }
  }

  // Generate modified DOCX buffer
  const modifiedDocxBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  // Extract structured parsed transcript data directly from the generated buffer
  const { parseDocxTranscript } = await import("./transcriptParser");
  const { saveTranscriptData } = await import("./serverStore");
  const parsedData = await parseDocxTranscript(modifiedDocxBuffer);
  if (documentPageDataUrl) {
    parsedData.documentPageDataUrl = documentPageDataUrl;
  }
  if (processedPhotoBuffer && !parsedData.photoDataUrl) {
    parsedData.photoDataUrl = `data:image/jpeg;base64,${processedPhotoBuffer.toString("base64")}`;
  }

  // Upload to Vercel Blob
  let originalBlobUrl = null;
  let modifiedBlobUrl = null;
  let metadataBlobUrl = null;
  let parsedBlobUrl = null;

  const metadata = {
    id,
    originalFilename,
    originalQrData: originalQrData || "N/A",
    newQrUrl,
    processedAt: new Date().toISOString(),
    targetImageReplaced: targetImagePath,
    hasPhoto: !!processedPhotoBuffer,
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const origBlob = await put(`transcripts/${id}/original-${originalFilename}`, fileBuffer, {
        access: "public",
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      originalBlobUrl = origBlob.url;

      const modBlob = await put(`transcripts/${id}/modified-${originalFilename}`, modifiedDocxBuffer, {
        access: "public",
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      modifiedBlobUrl = modBlob.url;

      if (processedPhotoBuffer) {
        const photoBlob = await put(`transcripts/${id}/photo.jpg`, processedPhotoBuffer, {
          access: "public",
          contentType: "image/jpeg",
        });
        photoBlobUrl = photoBlob.url;
        metadata.photoBlobUrl = photoBlobUrl;
      }

      metadata.originalBlobUrl = originalBlobUrl;
      metadata.modifiedBlobUrl = modifiedBlobUrl;

      const metaBlob = await put(`transcripts/${id}/metadata.json`, JSON.stringify(metadata, null, 2), {
        access: "public",
        contentType: "application/json",
      });
      metadataBlobUrl = metaBlob.url;

      const pBlob = await put(`transcripts/${id}/parsedData.json`, JSON.stringify(parsedData, null, 2), {
        access: "public",
        contentType: "application/json",
      });
      parsedBlobUrl = pBlob.url;
    } catch (blobErr) {
      console.error("Vercel Blob upload warning:", blobErr.message);
    }
  }

  // Persist locally / server memory so any browser or mobile phone gets real data even if Vercel Blob is not configured
  try {
    await saveTranscriptData(id, {
      metadata: {
        ...metadata,
        originalBlobUrl,
        modifiedBlobUrl,
        metadataBlobUrl,
        photoBlobUrl,
        parsedBlobUrl,
      },
      parsedData,
      modifiedDocxBuffer,
      photoBuffer: processedPhotoBuffer,
    });
  } catch (storeErr) {
    console.warn("Could not save to local serverStore:", storeErr);
  }

  return {
    id,
    newQrUrl,
    originalQrData,
    targetImagePath,
    modifiedDocxBuffer,
    photoBuffer: processedPhotoBuffer,
    photoBlobUrl,
    parsedData,
    metadata: {
      ...metadata,
      originalBlobUrl,
      modifiedBlobUrl,
      metadataBlobUrl,
      photoBlobUrl,
      parsedBlobUrl,
    },
  };
}
