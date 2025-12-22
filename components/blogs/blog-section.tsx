"use client";

import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Grid3X3,
  Layers,
  List,
  Mail,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./blog-card";
import { blogPosts } from "./blogs-data";

const categories = [
  { name: "All", icon: Layers },
  { name: "Development", icon: TrendingUp },
  { name: "Design", icon: Sparkles },
  { name: "Trends", icon: Flame },
];

export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [email, setEmail] = useState("");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  const stats = [
    { icon: BookOpen, label: "Articles", value: blogPosts.length, suffix: "+" },
    {
      icon: TrendingUp,
      label: "Categories",
      value: categories.length - 1,
      suffix: "",
    },
    {
      icon: Layers,
      label: "Topics",
      value: [...new Set(blogPosts.flatMap((p) => p.tags))].length,
      suffix: "+",
    },
  ];

  const trendingTags = [...new Set(blogPosts.flatMap((p) => p.tags))].slice(
    0,
    8
  );

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-brandColor/5 to-transparent rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-brandColor/5 to-transparent rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-brandColor/20 text-primary text-sm font-medium mb-8 opacity-0 animate-fade-up border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Insights & Articles</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 opacity-0 animate-fade-up delay-100">
            <span className="block">The Creative</span>
            <span className="text-gradient">Developer Blog</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-up delay-200 leading-relaxed">
            Deep dives into modern development, design thinking, and emerging
            technologies. Written by practitioners, for practitioners.
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-12 opacity-0 animate-fade-up delay-300">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-card to-muted/50 border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
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
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12 opacity-0 animate-fade-up delay-400">
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-brandColor/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles, topics, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.name
                        ? "bg-gradient-to-r from-primary to-brandColor text-white shadow-lg shadow-primary/25"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* View mode toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
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
        </div>

        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap">
            <Flame className="w-4 h-4 text-primary" />
            Trending:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            >
              #{tag}
            </button>
          ))}
        </div>

        {featuredPosts.length > 0 && viewMode === "grid" && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-brandColor shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Featured Stories
                </h2>
                <p className="text-sm text-muted-foreground">
                  Hand-picked articles worth your time
                </p>
              </div>
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

        {regularPosts.length > 0 && (
          <div className="grid grid-cols-12 gap-6">
            {/* Main articles grid */}
            <div className="col-span-12 lg:col-span-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brandColor to-accent shadow-lg shadow-brandColor/25">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Latest Articles
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {regularPosts.length} articles to explore
                  </p>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.slice(0, 2).map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index + featuredPosts.length}
                      variant="large"
                    />
                  ))}
                  {regularPosts.slice(2).map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index + featuredPosts.length + 2}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {regularPosts.map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index + featuredPosts.length}
                      variant="horizontal"
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
              {/* Newsletter card */}
              <div className="sticky top-6">
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-brandColor to-accent" />
                  <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10 mix-blend-overlay" />

                  <div className="relative p-8 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                      <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      Stay in the loop
                    </h3>
                    <p className="text-white/80 mb-6 text-sm leading-relaxed">
                      Get the latest articles, tutorials, and insights delivered
                      straight to your inbox. No spam, unsubscribe anytime.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <button className="w-full px-4 py-3 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-white/60 mt-4 text-center">
                      Join 5,000+ developers
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Quick Reads
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post, index) => (
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

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 opacity-0 animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No articles found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for. Or browse all categories to discover new content.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
