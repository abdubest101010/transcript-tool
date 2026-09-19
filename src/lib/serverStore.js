import fs from "fs";
import path from "path";
import os from "os";

// Global in-memory store for fast access across route invocations
if (!globalThis._transcriptStore) {
  globalThis._transcriptStore = new Map();
}

// Storage directories (both project-local and OS temp dir for cross-environment resilience)
const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".transcripts_data");
const TMP_STORAGE_DIR = path.join(os.tmpdir(), "transcripts_data");

function ensureDirs() {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
  } catch (e) {}

  try {
    if (!fs.existsSync(TMP_STORAGE_DIR)) {
      fs.mkdirSync(TMP_STORAGE_DIR, { recursive: true });
    }
  } catch (e) {}
}

export async function saveTranscriptData(id, data) {
  if (!id) return;
  ensureDirs();

  const entry = {
    id,
    metadata: data.metadata || null,
    parsedData: data.parsedData || null,
    modifiedDocxBase64: data.modifiedDocxBuffer ? Buffer.from(data.modifiedDocxBuffer).toString("base64") : (data.modifiedDocxBase64 || null),
    photoBase64: data.photoBuffer ? Buffer.from(data.photoBuffer).toString("base64") : (data.photoBase64 || null),
    savedAt: new Date().toISOString(),
  };

  // 1. Memory cache
  globalThis._transcriptStore.set(id, entry);

  // 2. Local disk persistence
  const jsonStr = JSON.stringify(entry);

  try {
    const localFile = path.join(LOCAL_STORAGE_DIR, `${id}.json`);
    fs.writeFileSync(localFile, jsonStr, "utf-8");
  } catch (e) {}

  try {
    const tmpFile = path.join(TMP_STORAGE_DIR, `${id}.json`);
    fs.writeFileSync(tmpFile, jsonStr, "utf-8");
  } catch (e) {}

  return entry;
}

export async function getTranscriptData(id) {
  if (!id) return null;

  // 1. Check memory cache
  if (globalThis._transcriptStore.has(id)) {
    return globalThis._transcriptStore.get(id);
  }

  // 2. Check local disk persistence
  try {
    const localFile = path.join(LOCAL_STORAGE_DIR, `${id}.json`);
    if (fs.existsSync(localFile)) {
      const content = fs.readFileSync(localFile, "utf-8");
      const entry = JSON.parse(content);
      globalThis._transcriptStore.set(id, entry);
      return entry;
    }
  } catch (e) {}

  // 3. Check tmp storage directory
  try {
    const tmpFile = path.join(TMP_STORAGE_DIR, `${id}.json`);
    if (fs.existsSync(tmpFile)) {
      const content = fs.readFileSync(tmpFile, "utf-8");
      const entry = JSON.parse(content);
      globalThis._transcriptStore.set(id, entry);
      return entry;
    }
  } catch (e) {}

  return null;
}

export async function getTranscriptDocxBuffer(id) {
  const data = await getTranscriptData(id);
  if (data && data.modifiedDocxBase64) {
    return Buffer.from(data.modifiedDocxBase64, "base64");
  }
  return null;
}
