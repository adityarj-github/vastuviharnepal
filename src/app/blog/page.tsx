import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { blogPosts, getAllCategories } from "@/data/blog";
import { BlogPageClient } from "@/components/blog/BlogPageClient";

export const metadata: Metadata = {
  title: "Blog & Insights | Vastu Vihar Nepal",
  description:
    "Read the latest articles on monolithic RCC construction, earthquake-resilient home design, planned township living, and Vastu principles in Nepal.",
};

export default function BlogPage() {
  const categories = getAllCategories();

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog & Insights" },
        ]}
        bgImage="/brand-bg.webp"
        bgImageAlt="Vastu Vihar Nepal Engineering and Architecture Blog"
        headingLine1="Insights, Articles,"
        headingLine2="& Perspectives"
      />
      <BlogPageClient allPosts={blogPosts} categories={categories} />
    </main>
  );
}
