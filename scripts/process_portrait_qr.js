const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processUploadedPortraitTranscript() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790274806084.jpg';
  const targetUrl = 'https://gs.gyaschol.com/ref/1184229.png';
  
  // Exact QR location in uploaded image (724 x 1024):
  // left: 34, top: 828, width: 85, height: 85
  const qrLeft = 34;
  const qrTop = 828;
  const qrWidth = 85;
  const qrHeight = 85;

  // Solid clean patch matching document paper background (#fefefe / white)
  // Clean slightly wider by 1px to ensure all edge artifacts are 100% erased
  const cleanPatch = Buffer.from(
    `<svg width="${qrWidth + 2}" height="${qrHeight + 2}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${qrWidth + 2}" height="${qrHeight + 2}" fill="#fdfdfd" />` +
    `</svg>`
  );

  // Generate crisp, clean QR code for https://gs.gyaschol.com/ref/1184229.png
  // Exact same size (85x85)
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: qrWidth,
    color: {
      dark: '#000000',
      light: '#fdfdfd'
    }
  });

  const compositeList = [
    {
      input: cleanPatch,
      left: qrLeft - 1,
      top: qrTop - 1
    },
    {
      input: qrBuffer,
      left: qrLeft,
      top: qrTop
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 99 })
    .toBuffer();

  const resultPng = await sharp(resultJpg)
    .png()
    .toBuffer();

  // Save to public routes & reference folders (overwrite existing files)
  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);
  fs.writeFileSync(path.join(refDir, '1184229.png'), resultPng);
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), resultJpg);

  // Preview copy
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/cristian_abebe_portrait_updated.jpg', resultJpg);

  console.log('Successfully replaced QR code and stored image for URL:', targetUrl);
}

processUploadedPortraitTranscript().catch(console.error);
