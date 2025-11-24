"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogPostsData } from "@/lib/content";

type SortOption = "latest" | "oldest" | "popular";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPostsData.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = blogPostsData;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      posts = posts.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    // Sort posts
    posts = [...posts].sort((a, b) => {
      if (sortBy === "latest") {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      } else if (sortBy === "popular") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

    return posts;
  }, [searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="">
          {/* Results Count and Filters Row */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "article" : "articles"} found
            </p>
            {/* Shadcn UI Selects for Sort and Tag */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 flex items-center md:justify-end">
                <div className="relative w-full md:w-80 bg-muted/30">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-9 pr-3 text-sm rounded-lg border-muted-foreground/20"
                  />
                </div>
              </div>
              {/* Sort Select */}
              <div className="">
                <Select
                  value={sortBy}
                  onValueChange={(v: string) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Tag Select */}
              <div className="">
                <Select
                  value={selectedTags[0] || "all"}
                  onValueChange={(tag: string) =>
                    setSelectedTags(tag === "all" ? [] : [tag])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Posts Grid: 3 cards per row on desktop */}
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed p-12 text-center"
            >
              <p className="text-muted-foreground">
                No articles found matching your criteria. Try adjusting your
                search or filters.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-xl"
                >
                  {/* Cover Image */}
                  {(post.thumbnail || (post as any).coverImage) && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={post.thumbnail || (post as any).coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt}
                      </span>
                      {post.views && (
                        <span className="flex items-center gap-1">
                          👁️ {post.views.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 text-xl font-semibold leading-tight transition-colors group-hover:text-primary md:text-2xl">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Category or Tags Preview */}
                    {post.category && (
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {post.category}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                    >
                      Read article <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
