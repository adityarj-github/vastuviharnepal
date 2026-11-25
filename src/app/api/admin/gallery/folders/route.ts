import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessMedia } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const folders = await prisma.galleryFolder.findMany({
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: { images: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ folders });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  try {
    const { title, slug, category, description, coverImage } = await request.json();

    if (!title || !category || !coverImage) {
      return NextResponse.json(
        { error: "Title, category, and cover image are required." },
        { status: 400 }
      );
    }

    const cleanSlug =
      (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const existing = await prisma.galleryFolder.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json(
        { error: "A gallery folder with this slug already exists." },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.galleryFolder.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const folder = await prisma.galleryFolder.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        category: category.trim(),
        description: description?.trim() || "",
        coverImage: coverImage.trim(),
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, folder }, { status: 201 });
  } catch (error) {
    console.error("Create gallery folder error:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
