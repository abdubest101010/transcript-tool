const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processImage() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789930735587.jpg';
  
  // 1. Generate QR Code pointing to https://www.gyaschol.com/ref/1121890.png
  const targetUrl = 'https://www.gyaschol.com/ref/1121890.png';
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 96,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Let's create an SVG overlay for Male
  const maleSvg = Buffer.from(
    `<svg width="70" height="24" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="70" height="24" fill="#ffffff" />` +
      `<text x="2" y="17" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="normal" fill="#000000">Male</text>` +
    `</svg>`
  );

  const compositeList = [
    {
      input: qrBuffer,
      left: 114,
      top: 92
    },
    {
      input: maleSvg,
      left: 618,
      top: 326
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 98 })
    .toBuffer();

  const publicPath = path.resolve('public');
  if (!fs.existsSync(path.join(publicPath, 'ref'))) {
    fs.mkdirSync(path.join(publicPath, 'ref'), { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);
  fs.writeFileSync(path.join(publicPath, 'ref', '1121890.jpg'), resultJpg);

  const resultPng = await sharp(resultJpg).png().toBuffer();
  fs.writeFileSync(path.join(publicPath, 'ref', '1121890.png'), resultPng);

  console.log('Successfully created and updated image files with Male and QR code!');
}

processImage().catch(console.error);
