import { NextResponse } from "next/server";
import { getAuthenticatedUser, canAccessHR } from "@/lib/auth";
import { contentTypeFor, isPrivateFolder, parseKey, readFile } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ key: string[] }>;
}

/** Serves uploaded files from Workers KV (or local disk in dev). Resumes require HR/root access. */
export async function GET(_request: Request, { params }: RouteParams) {
  const key = (await params).key.join("/");
  const folder = parseKey(key);
  if (!folder) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPrivate = isPrivateFolder(folder);
  if (isPrivate) {
    const user = await getAuthenticatedUser();
    if (!user || !canAccessHR(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const file = await readFile(key);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": contentTypeFor(key),
    "X-Content-Type-Options": "nosniff",
    // Keys are unique per upload, so public files never change.
    "Cache-Control": isPrivate ? "private, no-store" : "public, max-age=31536000, immutable",
  };
  if (file.size !== null) headers["Content-Length"] = String(file.size);

  return new Response(file.body as BodyInit, { headers });
}
