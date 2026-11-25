import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessMedia } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const dataToUpdate: Record<string, unknown> = {};

    if (body.title !== undefined) dataToUpdate.title = body.title.trim();
    if (body.category !== undefined) dataToUpdate.category = body.category.trim();
    if (body.description !== undefined) dataToUpdate.description = body.description.trim();
    if (body.coverImage !== undefined) dataToUpdate.coverImage = body.coverImage.trim();
    if (body.order !== undefined) dataToUpdate.order = Number(body.order);

    if (body.slug !== undefined) {
      const cleanSlug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existing = await prisma.galleryFolder.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use." }, { status: 400 });
      }
      dataToUpdate.slug = cleanSlug;
    }

    const folder = await prisma.galleryFolder.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, folder });
  } catch (error) {
    console.error("Update folder error:", error);
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.galleryFolder.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Gallery folder deleted successfully" });
  } catch (error) {
    console.error("Delete gallery folder error:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
