"use client";

import { blogApi } from "@/lib/api-client";
import type { BlogPost } from "@/lib/content";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Eye, Heart, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import BlogListSkeleton from "@/components/skeleton/BlogListSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeAgo } from "@/lib/utils";

type SortOption = "latest" | "oldest" | "popular";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  // Fetch published posts via API and derive tags
  const {
    data: postsResp,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blogPosts", { page, limit, searchQuery, selectedTags, sortBy }],
    queryFn: () =>
      blogApi.getAll({
        page,
        limit,
        search: searchQuery || undefined,
        tag: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
        sort: sortBy,
      }),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const posts = (postsResp?.data?.data as BlogPost[]) || [];
  const pagination = postsResp?.data?.pagination;

  // Get all unique tags from API
  const { data: tagsResp } = useQuery({
    queryKey: ["blogTags"],
    queryFn: () => blogApi.getTags(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
  const allTags = ((tagsResp as any)?.data as string[]) || [];

  // Server-side returns posts already filtered and sorted. Use directly as filteredPosts
  const filteredPosts = posts;

  // Helpers
  const formatDate = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (post: BlogPost) => {
    if ((post as any).excerpt) return (post as any).excerpt;
    if (post.content) {
      // strip simple HTML and trim to ~140 chars
      const plain = post.content
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      return plain.length > 140 ? `${plain.slice(0, 140).trim()}...` : plain;
    }
    return post.category || post.tags?.join(", ") || "";
  };

  const getReactionsCount = (post: BlogPost): number => {
    const rCandidate =
      (post as any).reactionsCount || (post.reactionsCount as any);
    if (!rCandidate) return 0;
    if (typeof rCandidate === "number") return rCandidate;
    const r = rCandidate as Record<string, number>;
    return Object.values(r).reduce(
      (sum: number, v) => sum + (Number(v) || 0),
      0
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset page when filters change
  const resetPage = () => setPage(1);

  return (
    <div className="min-h-screen">
      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="">
          {/* Results Count and Filters Row */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {pagination?.total ?? filteredPosts.length}{" "}
              {(pagination?.total ?? filteredPosts.length) === 1
                ? "article"
                : "articles"}{" "}
              found
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      resetPage();
                    }}
                    className="h-10 pl-9 pr-3 text-sm rounded-lg border-muted-foreground/20"
                  />
                </div>
              </div>
              {/* Sort Select */}
              <div className="">
                <Select
                  value={sortBy}
                  onValueChange={(v: string) => {
                    setSortBy(v as SortOption);
                    resetPage();
                  }}
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
                  onValueChange={(tag: string) => {
                    setSelectedTags(tag === "all" ? [] : [tag]);
                    resetPage();
                  }}
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
          {isLoading ? (
            <BlogListSkeleton count={limit} />
          ) : isError ? (
            <div className="container mx-auto px-4 max-w-4xl py-12 text-center">
              <p className="text-destructive mb-4">Failed to load posts.</p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => void refetch()}
                >
                  Retry
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed p-12 text-center"
            >
              <p className="text-muted-foreground">
                No articles found matching your criteria. Try adjusting your
                search or filters.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                    resetPage();
                  }}
                >
                  Clear filters
                </Button>
                <Button size="sm" asChild>
                  <Link href="/">Return home</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-xl hover:scale-[1.01]"
                >
                  {/* Top image */}
                  {post.thumbnail || (post as any).coverImage ? (
                    <div className="relative w-full overflow-hidden bg-muted aspect-video">
                      <img
                        src={post.thumbnail || (post as any).coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-36 bg-linear-to-r from-primary/5 to-primary/10 rounded-t-3xl" />
                  )}

                  {/* Body */}
                  <div className="p-4 md:p-5">
                    {/* Meta Info */}
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {post.author?.name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {post.author.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{" "}
                        {timeAgo(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />{" "}
                        {(post as any).viewsCount ?? post.views ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {getReactionsCount(post)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary md:text-xl">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Category */}
                    {post.category && (
                      <p className="mb-2 text-sm text-muted-foreground/80 uppercase tracking-wide text-[11px]">
                        {post.category}
                      </p>
                    )}

                    {/* Tags: show up to 3, and a +N badge for the rest */}
                    <div className="flex flex-wrap gap-2">
                      {((post.tags || []) as string[])
                        .slice(0, 3)
                        .map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-1 cursor-pointer"
                            onClick={() => {
                              toggleTag(tag);
                              resetPage();
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      {((post.tags || []) as string[]).length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1 cursor-pointer"
                          onClick={() => {
                            // select all tags from the post when clicking +N
                            setSelectedTags(post.tags || []);
                            resetPage();
                          }}
                          title={`Show all ${post.tags?.length ?? 0} tags`}
                        >
                          +{(post.tags || []).length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* CTA removed: title and image are clickable; keep spacing */}
                    <div className="mt-2" />
                  </div>
                </motion.article>
              ))}
            </div>
          )}
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
