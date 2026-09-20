const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processNewRouteAndImage() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789933080727.jpg';
  
  // New unique ID
  const newRefId = '1184229'; // Student ID matching the transcript
  const targetUrl = `https://www.gyaschol.com/ref/${newRefId}.png`;
  
  console.log('Generating QR code pointing to:', targetUrl);
  
  // 1. Generate new QR Code
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 96,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // 2. Composite onto the uploaded image at QR box location (left: 114, top: 92)
  const compositeList = [
    {
      input: qrBuffer,
      left: 114,
      top: 92
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 98 })
    .toBuffer();

  const resultPng = await sharp(resultJpg)
    .png()
    .toBuffer();

  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  // Save new reference ID (1184229)
  fs.writeFileSync(path.join(refDir, `${newRefId}.jpg`), resultJpg);
  fs.writeFileSync(path.join(refDir, `${newRefId}.png`), resultPng);

  // Also update default / 1121890 so any previous links also render this latest image
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);
  fs.writeFileSync(path.join(refDir, '1121890.jpg'), resultJpg);
  fs.writeFileSync(path.join(refDir, '1121890.png'), resultPng);

  console.log('Successfully saved updated images for new ID:', newRefId);
}

processNewRouteAndImage().catch(console.error);
