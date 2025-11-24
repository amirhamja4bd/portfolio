import { blogPostsData } from "@/lib/content";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const description =
    post.excerpt || post.category || post.tags.slice(0, 3).join(", ");
  const image = post.thumbnail || post.coverImage;

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: image ? [image] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
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
