import { NextResponse } from "next/server";
import { getAuthenticatedUser, canAccessMedia, canAccessHR } from "@/lib/auth";
import {
  getExtension,
  storeFile,
  StorageNotConfiguredError,
  type UploadFolder,
} from "@/lib/storage";

// Strict 10MB file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Safe allowed extensions (disallow .svg to prevent XSS)
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];
const ALLOWED_FOLDERS: UploadFolder[] = ["blogs", "gallery", "content", "resumes"];

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only Media team, HR team, or Root Admin can upload files
  if (!canAccessMedia(user.role) && !canAccessHR(user.role)) {
    return NextResponse.json(
      { error: "Forbidden: insufficient permissions to upload files." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = String(formData.get("folder") || "blogs").trim().toLowerCase();

    if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 10MB limit (uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    // Allowed extensions check
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File type "${ext}" is not supported. Allowed formats: JPG, PNG, WEBP, GIF, PDF.` },
        { status: 400 }
      );
    }

    const safeFolder = (ALLOWED_FOLDERS as string[]).includes(requestedFolder)
      ? (requestedFolder as UploadFolder)
      : "blogs";

    const publicUrl = await storeFile(safeFolder, file);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: publicUrl.split("/").pop(),
      originalName: file.name,
      size: file.size,
    });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { error: "File uploads are temporarily unavailable: file storage is not configured yet." },
        { status: 503 }
      );
    }
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
