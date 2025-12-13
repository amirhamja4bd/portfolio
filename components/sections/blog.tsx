"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogApi } from "@/lib/api-client";
import type { BlogPostPreview } from "@/lib/content";

export function BlogSection() {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogPosts", { limit: 6 }],
    queryFn: async () => (await blogApi.getAll({ limit: 6 })).data,
    // Keep a small cache window for navigation
    staleTime: 1000 * 30,
    retry: 1,
  });

  // API returns: { data: { data: Post[], pagination } }
  const posts: BlogPostPreview[] = apiResponse?.data || [];

  return (
    <section id="blog" className="scroll-mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold lg:text-4xl">Blog</h2>
          <p className="max-w-xl text-muted-foreground">
            Technical deep dives on platform strategy, DX, and scaling
            engineering teams.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0 group">
          <Link href="/blogs" className="flex items-center gap-2">
            View all posts <ArrowRight className="h-4 w-4 group-hover:-rotate-45 transition-all ease-in-out" />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {(isLoading ? [] : posts).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="group flex flex-col rounded-3xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </span>
              <span>{post.readingTime}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground transition group-hover:text-brand">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2 mb-1">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="mt-auto w-fit px-0 text-sm"
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="flex items-center gap-2"
              >
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
