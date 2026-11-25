import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessMedia } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.galleryImageItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
