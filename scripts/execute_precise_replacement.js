const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function executePreciseReplacement() {
  const docPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790367197329.jpg';
  const newQrPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790367344814.jpg';

  // 1. Crop the provided new QR code image to remove its outer border/margin
  // The active QR content in media_1790367344814.jpg (300x300) spans from x: 18..282, y: 19..283 (264x264)
  // Resize this clean QR directly to the exact target size 85x85
  const croppedResizedQr = await sharp(newQrPath)
    .extract({ left: 18, top: 19, width: 264, height: 264 })
    .resize(85, 85, { kernel: 'lanczos3' })
    .toBuffer();

  // 2. Erase the old QR code in document at (left: 34, top: 828, width: 85, height: 85)
  // By placing the clean 85x85 cropped QR directly over the exact same bounding box
  const updatedDocJpg = await sharp(docPath)
    .composite([
      {
        input: croppedResizedQr,
        left: 34,
        top: 828
      }
    ])
    .jpeg({ quality: 99 })
    .toBuffer();

  const updatedDocPng = await sharp(updatedDocJpg)
    .png()
    .toBuffer();

  // Save updated document to public routes
  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  // Update routes
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), updatedDocJpg);
  fs.writeFileSync(path.join(refDir, '1184229.png'), updatedDocPng);
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), updatedDocJpg);

  // Save output in brain directory for immediate download/view
  const finalOutPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/final_updated_transcript.jpg';
  fs.writeFileSync(finalOutPath, updatedDocJpg);

  console.log('Precise QR replacement complete and saved!');
}

executePreciseReplacement().catch(console.error);
