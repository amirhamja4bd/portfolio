import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Use the API to fetch the post metadata instead of direct DB access.
  // This keeps server components decoupled from backend models and avoids
  // requiring database access in layout metadata generation.
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const makeUrl = (endpoint: string) =>
    endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const postRes = await fetch(makeUrl(`/api/blogs/${slug}`), {
    cache: "no-store",
  });
  if (!postRes.ok) {
    if (postRes.status === 404) {
      return { title: "Article Not Found" };
    }
    throw new Error("Failed to fetch blog post for metadata");
  }
  const postJson = await postRes.json();
  const post = postJson?.data;
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  // `excerpt` was removed from the schema; use category or tags as a
  // fallback description. Avoid deriving a description from `content` here
  // because it contains raw HTML and may be large.
  const description =
    post?.category || (post?.tags || []).slice(0, 3).join(", ");
  const image =
    post?.thumbnail || (post as any)?.coverImage || post?.images?.[0];

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: image ? [image] : undefined,
      type: "article",
      publishedTime: (post as any)?.publishedAt,
      authors: [(post as any)?.author?.name].filter(Boolean) as
        | string[]
        | undefined,
      tags: (post as any)?.tags || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: image ? [image] : undefined,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
