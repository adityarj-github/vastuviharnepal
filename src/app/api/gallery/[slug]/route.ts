import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const folder = await prisma.galleryFolder.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Gallery folder not found" }, { status: 404 });
    }

    const formatted = {
      slug: folder.slug,
      title: folder.title,
      category: folder.category,
      description: folder.description,
      coverImage: folder.coverImage,
      images: folder.images.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        caption: img.caption || undefined,
      })),
    };

    return NextResponse.json({ folder: formatted });
  } catch (error) {
    console.error("Gallery folder fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery folder" }, { status: 500 });
  }
}
