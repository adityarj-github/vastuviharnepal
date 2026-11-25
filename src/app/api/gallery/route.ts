import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const folders = await prisma.galleryFolder.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    const formatted = folders.map((f) => ({
      slug: f.slug,
      title: f.title,
      category: f.category,
      description: f.description,
      coverImage: f.coverImage,
      images: f.images.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        caption: img.caption || undefined,
      })),
    }));

    return NextResponse.json({ folders: formatted });
  } catch (error) {
    console.error("Public gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
