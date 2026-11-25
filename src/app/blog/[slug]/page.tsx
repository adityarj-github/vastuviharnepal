import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import { getLiveBlogPost, getLiveBlogPosts } from "@/lib/data-fetchers";
import { blogPosts } from "@/data/blog";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLiveBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Vastu Vihar Nepal",
    };
  }

  return {
    title: `${post.title} | Vastu Vihar Nepal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage,
          alt: post.coverImageAlt,
        },
      ],
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const post = await getLiveBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getLiveBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aSame = a.category === post.category ? 1 : 0;
      const bSame = b.category === post.category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, 3);

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category },
        ]}
        bgImage="/hero/blog-hero.webp"
        bgImageAlt={post.title}
        headingLine1="Engineering &"
        headingLine2="Design Insights"
      />
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />
    </main>
  );
}
