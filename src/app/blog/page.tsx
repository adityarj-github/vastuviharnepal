import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { getAllCategories } from "@/data/blog";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { getLiveBlogPosts } from "@/lib/data-fetchers";

// Reads live content from the database (D1) on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Insights | Vastu Vihar Nepal",
  description:
    "Read the latest articles on monolithic RCC construction, earthquake-resilient home design, planned township living, and Vastu principles in Nepal.",
};

export default async function BlogPage() {
  const allPosts = await getLiveBlogPosts();
  const categories = getAllCategories();

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog & Insights" },
        ]}
        bgImage="/hero/blog-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Engineering and Architecture Blog"
        headingLine1="Insights, Articles,"
        headingLine2="& Perspectives"
      />
      <BlogPageClient allPosts={allPosts} categories={categories} />
    </main>
  );
}
