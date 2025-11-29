import { notFound } from "next/navigation";
import BlogPostClient from "./blog-post-client";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Server-side fetch: include approved comments snapshot (no-store cache)
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const makeUrl = (endpoint: string) =>
    endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  // Fetch the post without comments — comments are fetched separately by the client
  const postRes = await fetch(makeUrl(`/api/blogs/${slug}`), {
    cache: "no-store",
  });
  if (!postRes.ok) {
    if (postRes.status === 404) return notFound();
    throw new Error("Failed to fetch blog post");
  }

  const postJson = await postRes.json();
  const post = postJson?.data;
  if (!post) return notFound();

  // Calculate related posts using the API; fallback: empty array
  let relatedPosts: any[] = [];
  const tags = post.tags || [];
  if (tags.length > 0) {
    // Use the first tag to fetch related posts. We limit to 4 here and filter duplicate slug later
    const tag = encodeURIComponent(tags[0]);
    const relatedRes = await fetch(makeUrl(`/api/blogs?tag=${tag}&limit=4`), {
      cache: "no-store",
    });
    if (relatedRes.ok) {
      const relatedJson = await relatedRes.json();
      // API returns either a paginated object (data.data) or an array (data)
      const list = Array.isArray(relatedJson?.data)
        ? relatedJson.data
        : relatedJson?.data?.data || [];
      relatedPosts = (list || [])
        .filter((p: any) => p.slug !== post.slug)
        .slice(0, 3);
    }
  }

  return (
    <BlogPostClient post={post as any} relatedPosts={relatedPosts as any} />
  );
}
