import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      publishedDate: p.publishedDate,
      readTime: p.readTime,
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt,
      featured: p.featured,
      author: {
        name: p.authorName,
        role: p.authorRole,
        avatar: p.authorAvatar || undefined,
      },
      tags: (() => {
        try {
          return JSON.parse(p.tags);
        } catch {
          return [];
        }
      })(),
      keyTakeaways: (() => {
        try {
          return JSON.parse(p.keyTakeaways);
        } catch {
          return [];
        }
      })(),
      sections: (() => {
        try {
          return JSON.parse(p.sections);
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json({ posts: formatted });
  } catch (error) {
    console.error("Public blogs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
