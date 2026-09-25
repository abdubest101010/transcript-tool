const JSZip = require('jszip');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateDocx(imageBuffer, isRotated = false) {
  const zip = new JSZip();

  // Determine page dimensions and orientation
  // A4 size: 11906 x 16838 twips (Portrait) or 16838 x 11906 twips (Landscape)
  // Image dimensions in EMU (1 inch = 914400 EMU):
  // Landscape image: 9.2 in x 6.9 in => 8412480 x 6309360 EMU
  // Portrait image: 6.9 in x 9.2 in => 6309360 x 8412480 EMU
  const isLandscape = !isRotated;
  const pageWidth = isLandscape ? '16838' : '11906';
  const pageHeight = isLandscape ? '11906' : '16838';
  const orient = isLandscape ? 'landscape' : 'portrait';

  const emuWidth = isLandscape ? '8412480' : '6309360';
  const emuHeight = isLandscape ? '6309360' : '8412480';

  // [Content_Types].xml
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
</Types>`);

  // _rels/.rels
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  // word/_rels/document.xml.rels
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdImg1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.jpeg"/>
</Relationships>`);

  // word/media/image1.jpeg
  zip.file('word/media/image1.jpeg', imageBuffer);

  // word/document.xml
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${emuWidth}" cy="${emuHeight}"/>
            <wp:docPr id="1" name="Transcript Image"/>
            <wp:cNvGraphicFramePr>
              <a:graphicFrameLocks noChangeAspect="1"/>
            </wp:cNvGraphicFramePr>
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic>
                  <pic:nvPicPr>
                    <pic:cNvPr id="0" name="Picture 1"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="rIdImg1"/>
                    <a:stretch>
                      <a:fillRect/>
                    </a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm>
                      <a:off x="0" y="0"/>
                      <a:ext cx="${emuWidth}" cy="${emuHeight}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                      <a:avLst/>
                    </a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="${pageWidth}" w:h="${pageHeight}" w:orient="${orient}"/>
      <w:pgMar w:top="360" w:right="360" w:bottom="360" w:left="360" w:header="0" w:footer="0" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`);

  return zip.generateAsync({ type: 'nodebuffer' });
}

async function run() {
  const imagePath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790359935711.jpg';
  const origBuffer = fs.readFileSync(imagePath);

  // 1. Original Orientation (.docx)
  const docx1Buffer = await generateDocx(origBuffer, false);
  const out1 = 'C:/Users/HP/Desktop/Abdu File/Abdu_Project/transcript-tool/public/Christian_Abebe_Transcript_Original.docx';
  fs.writeFileSync(out1, docx1Buffer);
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/Christian_Abebe_Transcript_Original.docx', docx1Buffer);

  // 2. Rotated 90 degrees to the right (.docx)
  const rot90Buffer = await sharp(origBuffer).rotate(90).jpeg({ quality: 99 }).toBuffer();
  const docx2Buffer = await generateDocx(rot90Buffer, true);
  const out2 = 'C:/Users/HP/Desktop/Abdu File/Abdu_Project/transcript-tool/public/Christian_Abebe_Transcript_Rotated_Right.docx';
  fs.writeFileSync(out2, docx2Buffer);
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/Christian_Abebe_Transcript_Rotated_Right.docx', docx2Buffer);

  console.log('Successfully created both DOCX files!');
}

run().catch(console.error);
