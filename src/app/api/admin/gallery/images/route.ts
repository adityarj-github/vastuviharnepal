import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessMedia } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  try {
    const { folderId, images } = await request.json();

    if (!folderId || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Folder ID and at least one image are required." },
        { status: 400 }
      );
    }

    const folder = await prisma.galleryFolder.findUnique({ where: { id: folderId } });
    if (!folder) {
      return NextResponse.json({ error: "Gallery folder not found" }, { status: 404 });
    }

    const currentCount = await prisma.galleryImageItem.count({ where: { folderId } });

    const dataToCreate = images.map((img: { src: string; alt?: string; caption?: string }, idx: number) => ({
      folderId,
      src: img.src.trim(),
      alt: img.alt?.trim() || `${folder.title} photo`,
      caption: img.caption?.trim() || null,
      order: currentCount + idx + 1,
    }));

    await prisma.galleryImageItem.createMany({
      data: dataToCreate,
    });

    const updatedFolder = await prisma.galleryFolder.findUnique({
      where: { id: folderId },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, folder: updatedFolder }, { status: 201 });
  } catch (error) {
    console.error("Add gallery images error:", error);
    return NextResponse.json({ error: "Failed to add images" }, { status: 500 });
  }
}
