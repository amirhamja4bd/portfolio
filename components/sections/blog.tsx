"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/content";

export function BlogSection() {
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
        <Button asChild variant="outline">
          <Link href="/blogs" className="flex items-center gap-2">
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="group flex flex-col rounded-3xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              <span>{post.publishedAt}</span>
              <span>{post.readingTime}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground transition group-hover:text-emerald-400">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2 mb-1">
              {post.tags.map((tag) => (
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
