import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.isPublished) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const formatted = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      publishedDate: post.publishedDate,
      readTime: post.readTime,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      featured: post.featured,
      author: {
        name: post.authorName,
        role: post.authorRole,
        avatar: post.authorAvatar || undefined,
      },
      tags: (() => {
        try {
          return JSON.parse(post.tags);
        } catch {
          return [];
        }
      })(),
      keyTakeaways: (() => {
        try {
          return JSON.parse(post.keyTakeaways);
        } catch {
          return [];
        }
      })(),
      sections: (() => {
        try {
          return JSON.parse(post.sections);
        } catch {
          return [];
        }
      })(),
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
    };

    return NextResponse.json({ post: formatted });
  } catch (error) {
    console.error("Blog post fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
