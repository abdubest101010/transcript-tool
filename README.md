# Transcript QR & Photo Replacer Tool 🎓

An automated, pixel-perfect Transcript Processing & Verification system built with **Next.js 14**, **OpenXML / JSZip**, **Sharp**, and **QRCode**.

## 🚀 Features

- **Embedded QR Code Replacement**: Automatically detects and replaces existing school QR codes inside transcript `.docx` files with a custom verification link (`/t/[id]`).
- **Optional Student Photo Placement**: Centers, crops, and embeds student portraits (`.jpg`, `.jpeg`, `.png`, `.webp`) directly inside the bordered photo box in the DOCX file (Table 0) with full DrawingML OpenXML specs.
- **Pixel-Perfect Web Viewer**: Fast, high-fidelity responsive verification page rendered at `/t/[id]` with a top-to-bottom unveiling animation on a clean white background.
- **Manual Download Controls**: Download the newly generated `.docx` document containing the updated QR and student photo.
- **Vercel Blob Storage Integration**: Ready for cloud document storage and public access.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Document Processing**: `jszip`, `sharp`, `qrcode`, `jsqr`, `pngjs`
- **Cloud Storage**: `@vercel/blob`

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/abdubest101010/transcript-tool.git
cd transcript-tool
npm install
```

### 2. Environment Variables (Optional for Cloud Blob Storage)
Create a `.env.local` file:
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License
MIT
