import { getRecentPosts } from "@/data/blog";
import { BlogSectionClient } from "./BlogSectionClient";

export function BlogSection() {
  const posts = getRecentPosts(3);
  return <BlogSectionClient posts={posts} />;
}
