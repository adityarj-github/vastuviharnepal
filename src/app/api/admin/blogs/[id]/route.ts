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
    if (body.excerpt !== undefined) dataToUpdate.excerpt = body.excerpt.trim();
    if (body.category !== undefined) dataToUpdate.category = body.category.trim();
    if (body.coverImage !== undefined) dataToUpdate.coverImage = body.coverImage.trim();
    if (body.coverImageAlt !== undefined) dataToUpdate.coverImageAlt = body.coverImageAlt.trim();
    if (body.readTime !== undefined) dataToUpdate.readTime = body.readTime.trim();
    if (body.publishedDate !== undefined) dataToUpdate.publishedDate = body.publishedDate.trim();
    if (body.authorName !== undefined) dataToUpdate.authorName = body.authorName.trim();
    if (body.authorRole !== undefined) dataToUpdate.authorRole = body.authorRole.trim();
    if (body.authorAvatar !== undefined) dataToUpdate.authorAvatar = body.authorAvatar?.trim() || null;
    if (body.isPublished !== undefined) dataToUpdate.isPublished = Boolean(body.isPublished);
    if (body.featured !== undefined) dataToUpdate.featured = Boolean(body.featured);
    if (body.metaTitle !== undefined) dataToUpdate.metaTitle = body.metaTitle.trim();
    if (body.metaDescription !== undefined) dataToUpdate.metaDescription = body.metaDescription.trim();
    if (body.metaKeywords !== undefined) dataToUpdate.metaKeywords = body.metaKeywords.trim();

    if (body.slug !== undefined) {
      const cleanSlug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existing = await prisma.blogPost.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use by another post." }, { status: 400 });
      }
      dataToUpdate.slug = cleanSlug;
    }

    if (body.tags !== undefined) {
      dataToUpdate.tags = Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags;
    }

    if (body.keyTakeaways !== undefined) {
      dataToUpdate.keyTakeaways = Array.isArray(body.keyTakeaways)
        ? JSON.stringify(body.keyTakeaways)
        : body.keyTakeaways;
    }

    if (body.sections !== undefined) {
      dataToUpdate.sections =
        typeof body.sections === "string" ? body.sections : JSON.stringify(body.sections);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) {
    return NextResponse.json({ error: "Forbidden: media team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
