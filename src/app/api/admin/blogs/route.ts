import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessMedia } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      category,
      coverImage,
      coverImageAlt,
      readTime,
      publishedDate,
      authorName,
      authorRole,
      authorAvatar,
      tags,
      keyTakeaways,
      sections,
      isPublished,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    if (!title || !category || !coverImage) {
      return NextResponse.json(
        { error: "Title, category, and cover image are required." },
        { status: 400 }
      );
    }

    const finalSlug =
      (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { error: "A blog with this slug already exists. Please choose a unique slug or title." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        title: title.trim(),
        excerpt: excerpt?.trim() || "",
        category: category.trim(),
        coverImage: coverImage.trim(),
        coverImageAlt: coverImageAlt?.trim() || title.trim(),
        readTime: readTime?.trim() || "5 min read",
        publishedDate:
          publishedDate?.trim() ||
          new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        authorName: authorName?.trim() || user.name || "Editorial Team",
        authorRole: authorRole?.trim() || "Housing Advisor",
        authorAvatar: authorAvatar?.trim() || null,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : typeof tags === "string" ? tags : "[]",
        keyTakeaways: Array.isArray(keyTakeaways)
          ? JSON.stringify(keyTakeaways)
          : typeof keyTakeaways === "string"
            ? keyTakeaways
            : "[]",
        sections: typeof sections === "string" ? sections : JSON.stringify(sections || []),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        featured: featured !== undefined ? Boolean(featured) : false,
        metaTitle: metaTitle?.trim() || title.trim(),
        metaDescription: metaDescription?.trim() || excerpt?.trim() || null,
        metaKeywords: metaKeywords?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
