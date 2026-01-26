"use client";

import { blogApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Grid3X3,
  Layers,
  List,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { BlogCard } from "@/components/blogs/blog-card";
import { BlogSubscription } from "@/components/blogs/blog-subscription";

import BlogListSkeleton from "@/components/skeleton/BlogListSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogPost } from "@/lib/content";

type SortOption = "latest" | "oldest" | "popular";

const ScrollContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/scroll flex-1 min-w-0">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-background/95 border border-border backdrop-blur-md text-foreground shadow-xl hover:bg-primary hover:text-primary-foreground transition-all -translate-x-1/2 opacity-0 group-hover/scroll:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1 ${className}`}
      >
        {children}
        {/* Spacer to ensure the last item isn't cropped and has room for the arrow */}
        <div className="shrink-0 w-8 h-px" />
      </div>
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-background/95 border border-border backdrop-blur-md text-foreground shadow-xl hover:bg-primary hover:text-primary-foreground transition-all translate-x-1/2 opacity-0 group-hover/scroll:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("All");

  // New: refs & state for cursor glow overlay inside filters
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [glow, setGlow] = useState({ x: 0, y: 0, opacity: 0 });

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleFiltersMouseMove = (e: any) => {
    if (!filtersRef.current) return;
    const rect = filtersRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGlow({ x, y, opacity: 1 });
    });
  };

  const handleFiltersMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // fade out
    setGlow((g) => ({ ...g, opacity: 0 }));
  };

  // Fetch published posts via API and derive tags
  const {
    data: postsResp,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "blogPosts",
      { page, limit, searchQuery, selectedTags, sortBy, activeCategory },
    ],
    queryFn: () =>
      blogApi.getAll({
        page,
        limit,
        search: searchQuery || undefined,
        tag: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
        sort: sortBy,
        category: activeCategory === "All" ? undefined : activeCategory,
      }),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const posts = (postsResp?.data?.data as BlogPost[]) || [];
  const pagination = postsResp?.data?.pagination;

  // Get all unique tags from API
  const { data: tagsResp } = useQuery({
    queryKey: ["blogTags", { activeCategory }],
    queryFn: () =>
      blogApi.getTags({
        category: activeCategory === "All" ? undefined : activeCategory,
      }),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
  const allTags = ((tagsResp as any)?.data as string[]) || [];

  // Get all unique categories from API
  const { data: categoriesResp } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: () => blogApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
  const dynamicCategories = ((categoriesResp as any)?.data as string[]) || [];

  const categories = useMemo(() => {
    const baseCategories = [{ name: "All", icon: Layers }];
    const mappedCategories = dynamicCategories.map((cat) => {
      // Map icons based on category name
      let icon = BookOpen;
      if (cat.toLowerCase().includes("dev")) icon = TrendingUp;
      if (cat.toLowerCase().includes("design")) icon = Sparkles;
      if (cat.toLowerCase().includes("trend")) icon = Flame;
      if (cat.toLowerCase().includes("tech")) icon = Layers;

      return { name: cat, icon };
    });

    // Combine and remove duplicates (if "All" was somehow in the dynamic list)
    const combined = [...baseCategories];
    mappedCategories.forEach((cat) => {
      if (!combined.find((c) => c.name === cat.name)) {
        combined.push(cat);
      }
    });
    return combined;
  }, [dynamicCategories]);

  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  const stats = [
    {
      icon: BookOpen,
      label: "Articles",
      value: pagination?.total || 0,
      suffix: "+",
    },
    {
      icon: TrendingUp,
      label: "Categories",
      value: categories.length - 1,
      suffix: "",
    },
    { icon: Layers, label: "Topics", value: allTags.length, suffix: "+" },
  ];

  const trendingTags = allTags.slice(0, 8);

  // Reset page when filters change
  const resetPage = () => setPage(1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-2 lg:px-0">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-primary/20 to-brandColor/20 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Insights & Articles</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6"
          >
            <span className="block">The Creative</span>
            <span className="text-gradientg text-primary">Developer Blog</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Deep dives into modern development, design thinking, and emerging
            technologies. Written by practitioners, for practitioners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-8 sm:gap-12 mt-12"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-card to-muted/50 border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-12">
          {/* Frosted glass container with cursor glow overlay */}
          <div
            ref={filtersRef}
            onMouseMove={handleFiltersMouseMove}
            onMouseLeave={handleFiltersMouseLeave}
            className="relative rounded-2xl bg-card/5 border border-border p-4 shadow-sm backdrop-blur-sm overflow-hidden"
          >
            {/* Subtle gradient overlay to enhance glass effect */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/5 to-white/3 mix-blend-overlay" />

            {/* Cursor-following glowing radial */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(240px circle at ${glow.x}px ${glow.y}px, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.08) 15%, transparent 40%)`,
                filter: "blur(30px)",
                opacity: glow.opacity,
                transition: "opacity 160ms linear",
              }}
            />

            {/* Row 1: Search + View */}
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative w-full lg:w-96 group">
                  {/* Decorative gradient that appears on hover (kept but softened for glass) */}
                  <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-brandColor/12 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        resetPage();
                      }}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-card border border-border shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-border/50 pt-4">
              {/* Row 2: Categories */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                  <Layers className="w-4 h-4 text-primary" />
                  Categories
                </span>
                <div className="flex-1 min-w-0">
                  <ScrollContainer className="flex-nowrap">
                    {categories.map((category) => {
                      if (!category || !category.name) return null;
                      const Icon = category.icon || BookOpen;
                      return (
                        <button
                          key={category.name}
                          onClick={() => {
                            setActiveCategory(category.name);
                            resetPage();
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-24 ${
                            activeCategory === category.name
                              ? "bg-linear-to-r from-primary/50 to-brandColor text-white shadow-md shadow-primary/20"
                              : "bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {category.name}
                        </button>
                      );
                    })}
                  </ScrollContainer>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-border/50 pt-4">
              {/* Row 3: Trending Tags */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap shrink-0">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Trending
                </span>
                <div className="flex-1 min-w-0">
                  <ScrollContainer className="flex-nowrap">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag) ? [] : [tag],
                          );
                          resetPage();
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                          selectedTags.includes(tag)
                            ? "bg-primary/10 text-primary-foreground border border-primary scale-105"
                            : "bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </ScrollContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <BlogListSkeleton count={limit} />
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Failed to load posts.</p>
            <Button onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No articles found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSelectedTags([]);
                resetPage();
              }}
              className="mt-6"
            >
              Browse All Articles
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              {/* Featured Posts in Grid Mode */}
              {featuredPosts.length > 0 &&
                viewMode === "grid" &&
                page === 1 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-primary to-brandColor shadow-lg shadow-primary/25">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        Featured Stories
                      </h2>
                    </div>
                    <div className="space-y-8">
                      {featuredPosts.map((post, index) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          index={index}
                          variant="featured"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Latest Articles */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-brandColor to-accent shadow-lg shadow-brandColor/25">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Latest Articles
                </h2>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index}
                      variant="horizontal"
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrev}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!pagination.hasNext}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4 space-y-6">
              <div className="sticky top-24">
                <BlogSubscription />

                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Quick Reads
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post, index) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        index={index}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
