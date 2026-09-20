const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processImage() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789931758035.jpg';
  
  // 1. QR Code
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

  // Header row "Grade:  Abebe" and "Grade:  9" is located around y: 350..375 in original file.
  // Let's measure: 
  // "Student ID: 1184229" is y: 350..375
  // "Grade:  Abebe" -> Grade: is x: 285..335, Abebe is x: 338..395, y: 357..373
  // "Grade:  9" -> Grade: is x: 455..505, 9 is x: 508..525, y: 357..373
  // In the uploaded image, y: 358 was placing it lower down in the table (over Biology/Chemistry).
  // "Student ID:" is at y: 362 in 1024x676, so Grade row is actually at y: 360? Wait!
  // In the image, y: 358 hit Chemistry because the table is:
  // Let's check table headers:
  // "Name of the Student: Cristian Abebe" is y: ~325
  // "Student ID: 1184229 | Grade: Abebe | Grade: 9 | Grade: 11 | Grade: 12" is at y: ~360!
  // Wait, why did y: 358 land on Biology?
  // Let's look at the uploaded image:
  // Total height is 676.
  // 0: top margin
  // ~80: "Gibson School Systems"
  // ~325: "Name of the Student: Cristian Abebe"
  // ~360: "Student ID: 1184229"
  // Wait, in the preview image, the "9" and "10" appeared at y=355 which was on line "Biology / Chemisity"!
  // That means "Student ID / Grade" row is HIGHER up, around y: 360? No, if 355 is Chemistry, then Student ID is around y: 250?
  // Let's calculate:
  // 676 total height.
  // Table starts below Student Transcript:
  // "Student Transcript" title is y ~ 200?
  // Let's inspect coordinates directly.
  
  // Let's write a script to crop regions and verify exact positions.
}
