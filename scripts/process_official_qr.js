const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processOfficialTranscript() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790135451734.jpg';
  const targetUrl = 'https://gs.gyaschol.com/ref/1184229.png';
  
  // 1. Get image metadata
  const meta = await sharp(uploadedPath).metadata();
  console.log('Image dimensions:', meta.width, meta.height);

  // Exact QR location in uploaded image (1024 x 741):
  // left: 93, top: 43, width: 95, height: 95
  // The background of the paper around QR is slightly off-white (#fbfaf6 / #faf9f5) or pure white.
  // We place a solid background patch that completely removes the old QR code.
  const patchWidth = 101;
  const patchHeight = 101;
  const patchLeft = 90;
  const patchTop = 40;

  const cleanPatch = Buffer.from(
    `<svg width="${patchWidth}" height="${patchHeight}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${patchWidth}" height="${patchHeight}" fill="#fcfbfa" />` +
    `</svg>`
  );

  // Generate crisp, clean QR code for https://gs.gyaschol.com/ref/1184229.png
  // Exact same size (95x95)
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: 95,
    color: {
      dark: '#000000',
      light: '#fcfbfa'
    }
  });

  const compositeList = [
    {
      input: cleanPatch,
      left: patchLeft,
      top: patchTop
    },
    {
      input: qrBuffer,
      left: 93,
      top: 43
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 99 })
    .toBuffer();

  const resultPng = await sharp(resultJpg)
    .png()
    .toBuffer();

  // Save to public routes & reference folders
  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);
  fs.writeFileSync(path.join(refDir, '1184229.png'), resultPng);
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), resultJpg);

  // Preview copy
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/final_transcript_qr_update.jpg', resultJpg);

  console.log('Successfully generated updated transcript with exact QR replacement pointing to:', targetUrl);
}

processOfficialTranscript().catch(console.error);
