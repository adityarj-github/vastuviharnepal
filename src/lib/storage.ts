import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * File storage for uploads (blog/gallery images, resumes).
 *
 * - On Cloudflare Workers: stored in the R2 bucket bound as `UPLOADS`.
 * - Local dev (`next dev` / `next start`): stored on disk in `.local-uploads/`.
 *
 * Files are served by `GET /api/files/[...key]`. Keys in PRIVATE_FOLDERS
 * (resumes) require an HR/root admin session to read.
 */

export const UPLOAD_FOLDERS = ["blogs", "gallery", "content", "resumes"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const PRIVATE_FOLDERS: readonly UploadFolder[] = ["resumes"];

const LOCAL_DIR = ".local-uploads";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
}

export function contentTypeFor(key: string): string {
  return CONTENT_TYPES[getExtension(key)] ?? "application/octet-stream";
}

/** Returns the folder for a key, or null if the key is malformed or unsafe. */
export function parseKey(key: string): UploadFolder | null {
  const parts = key.split("/");
  if (parts.length !== 2) return null;
  const [folder, name] = parts;
  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) return null;
  if (!/^[A-Za-z0-9_-]+\.[a-z0-9]+$/.test(name)) return null;
  return folder as UploadFolder;
}

export function isPrivateFolder(folder: UploadFolder): boolean {
  return PRIVATE_FOLDERS.includes(folder);
}

/** The subset of the R2 bucket binding API used here. */
interface UploadsBucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    }
  ): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; size: number } | null>;
}

/** Thrown on Cloudflare when the `UPLOADS` R2 binding isn't configured. */
export class StorageNotConfiguredError extends Error {
  constructor() {
    super("File storage is not configured (missing UPLOADS R2 binding).");
    this.name = "StorageNotConfiguredError";
  }
}

/** True inside the Cloudflare Workers runtime, where there is no writable disk. */
function isWorkersRuntime(): boolean {
  return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
}

function getBucket(): UploadsBucket | null {
  try {
    const env = getCloudflareContext().env as unknown as { UPLOADS?: UploadsBucket };
    return env.UPLOADS ?? null;
  } catch {
    return null; // not running inside a Cloudflare context
  }
}

/** Stores a file and returns its public path (e.g. `/api/files/blogs/123-photo.jpg`). */
export async function storeFile(folder: UploadFolder, file: File): Promise<string> {
  const ext = getExtension(file.name);
  const base = file.name
    .slice(0, file.name.length - ext.length)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40) || "file";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}${ext}`;
  const bytes = await file.arrayBuffer();

  const bucket = getBucket();
  if (bucket) {
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: contentTypeFor(key) },
      customMetadata: { originalName: file.name.slice(0, 200) },
    });
  } else if (isWorkersRuntime()) {
    throw new StorageNotConfiguredError();
  } else {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const filePath = path.join(process.cwd(), LOCAL_DIR, key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, new Uint8Array(bytes));
  }

  return `/api/files/${key}`;
}

/** Reads a stored file. Returns null if it doesn't exist. */
export async function readFile(
  key: string
): Promise<{ body: ReadableStream | Uint8Array; size: number } | null> {
  const bucket = getBucket();
  if (bucket) {
    const object = await bucket.get(key);
    if (!object) return null;
    return { body: object.body, size: object.size };
  }
  if (isWorkersRuntime()) return null;

  try {
    const { readFile: fsReadFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const data = await fsReadFile(path.join(process.cwd(), LOCAL_DIR, key));
    return { body: new Uint8Array(data), size: data.byteLength };
  } catch {
    return null;
  }
}
