import { blogPostsData } from "@/lib/content";
import { notFound } from "next/navigation";
import BlogPostClient from "./blog-post-client";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Calculate related posts (same tags)
  const relatedPosts = blogPostsData
    .filter(
      (p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 3);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
