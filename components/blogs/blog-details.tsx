"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  ChevronUp,
  Clock,
  Copy,
  Heart,
  Lightbulb,
  Linkedin,
  LinkIcon,
  List,
  Share2,
  Sparkles,
  ThumbsUp,
  Twitter,
  Volume2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { BlogPost, getRelatedPosts } from "./blogs-data";

interface BlogDetailsProps {
  post: BlogPost;
}

const reactions = [
  {
    id: "like",
    icon: Heart,
    label: "Love",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "insightful",
    icon: Lightbulb,
    label: "Insightful",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "mindblown",
    icon: Zap,
    label: "Mind Blown",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "helpful",
    icon: ThumbsUp,
    label: "Helpful",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export function BlogDetails({ post }: BlogDetailsProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [showToc, setShowToc] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const relatedPosts = getRelatedPosts(post.slug, post.category);

  const tableOfContents = post.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => ({
      id: line.slice(3).toLowerCase().replace(/\s+/g, "-"),
      title: line.slice(3),
    }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 500);

      // Calculate time remaining
      const wordsPerMinute = 200;
      const words = post.content.split(/\s+/).length;
      const totalMinutes = words / wordsPerMinute;
      const minutesRead = (progress / 100) * totalMinutes;
      const remaining = Math.max(0, Math.ceil(totalMinutes - minutesRead));
      setTimeRemaining(remaining > 0 ? `${remaining} min left` : "Done!");

      // Track active section
      const sections = document.querySelectorAll("h2[id]");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 0) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post.content]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setShowToc(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categoryColors: Record<
    string,
    { gradient: string; bg: string; text: string }
  > = {
    Development: {
      gradient: "from-cyan-400 to-blue-500",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
    },
    Design: {
      gradient: "from-pink-400 to-rose-500",
      bg: "bg-pink-500/10",
      text: "text-pink-400",
    },
    Trends: {
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
    },
  };

  const categoryStyle =
    categoryColors[post.category] || categoryColors.Development;

  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "";
    let codeBlockId = 0;

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = "";
        } else {
          const currentCodeId = `code-${codeBlockId++}`;
          const currentCode = codeContent.trim();
          elements.push(
            <div
              key={i}
              className="my-8 rounded-2xl overflow-hidden border border-border group"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {codeLanguage || "code"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyCodeToClipboard(currentCode, currentCodeId)
                  }
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                >
                  {copiedCode === currentCodeId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 bg-card overflow-x-auto">
                <code className="text-sm font-mono text-foreground leading-relaxed">
                  {currentCode}
                </code>
              </pre>
            </div>,
          );
          inCodeBlock = false;
          codeContent = "";
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      // Headers with IDs for TOC
      if (line.startsWith("## ")) {
        const title = line.slice(3);
        const id = title.toLowerCase().replace(/\s+/g, "-");
        elements.push(
          <h2
            key={i}
            id={id}
            className="text-2xl sm:text-3xl font-bold text-foreground mt-16 mb-6 scroll-mt-24 opacity-0 animate-fade-up flex items-center gap-3 group"
            style={{
              animationDelay: `${i * 20}ms`,
              animationFillMode: "forwards",
            }}
          >
            <span
              className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${categoryStyle.gradient}`}
            />
            {title}
          </h2>,
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <div
            key={i}
            className="flex gap-4 my-3 opacity-0 animate-fade-up"
            style={{
              animationDelay: `${i * 20}ms`,
              animationFillMode: "forwards",
            }}
          >
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${categoryStyle.gradient} text-white text-sm font-bold flex items-center justify-center shadow-lg`}
            >
              {line.match(/^\d+/)?.[0]}
            </span>
            <p className="text-muted-foreground leading-relaxed pt-1">
              {line.replace(/^\d+\.\s/, "")}
            </p>
          </div>,
        );
        return;
      }

      // Bullet lists
      if (line.startsWith("- ")) {
        elements.push(
          <div
            key={i}
            className="flex gap-4 my-3 opacity-0 animate-fade-up"
            style={{
              animationDelay: `${i * 20}ms`,
              animationFillMode: "forwards",
            }}
          >
            <span
              className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br ${categoryStyle.gradient} mt-2.5`}
            />
            <p
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: line
                  .slice(2)
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong class='text-foreground font-semibold'>$1</strong>",
                  ),
              }}
            />
          </div>,
        );
        return;
      }

      // Regular paragraphs
      if (line.trim()) {
        elements.push(
          <p
            key={i}
            className="text-muted-foreground leading-relaxed my-5 text-lg opacity-0 animate-fade-up"
            style={{
              animationDelay: `${i * 20}ms`,
              animationFillMode: "forwards",
            }}
            dangerouslySetInnerHTML={{
              __html: line.replace(
                /\*\*(.*?)\*\*/g,
                "<strong class='text-foreground font-semibold'>$1</strong>",
              ),
            }}
          />,
        );
      }
    });

    return elements;
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-muted">
          <div
            className={`h-full bg-gradient-to-r ${categoryStyle.gradient} transition-all duration-150`}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        {scrollProgress > 5 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border text-xs font-medium text-muted-foreground shadow-lg opacity-0 animate-fade-up">
            {timeRemaining}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowToc(!showToc)}
        className="fixed top-20 right-6 z-40 p-3 rounded-xl bg-card border border-border shadow-lg hover:border-primary/50 transition-all hidden lg:flex items-center gap-2"
      >
        <List className="w-5 h-5 text-foreground" />
      </button>

      {showToc && (
        <div className="fixed top-32 right-6 z-40 w-72 p-4 rounded-2xl bg-card border border-border shadow-xl hidden lg:block opacity-0 animate-fade-up">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <List className="w-4 h-4" />
            Table of Contents
          </h4>
          <nav className="space-y-1">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeSection === item.id
                    ? `${categoryStyle.bg} ${categoryStyle.text} font-medium`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br ${categoryStyle.gradient} opacity-5 rounded-full blur-3xl`}
        />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <article className="relative z-10">
        <header className="relative pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-8 opacity-0 animate-fade-up"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category and meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6 opacity-0 animate-fade-up delay-100">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${categoryStyle.bg} ${categoryStyle.text} border border-current/20`}
              >
                <Sparkles className="w-4 h-4" />
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight opacity-0 animate-fade-up delay-150 text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl leading-relaxed opacity-0 animate-fade-up delay-200">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-2xl bg-card border border-border opacity-0 animate-fade-up delay-300">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={
                      post.author.avatar ||
                      "https://raw.githubusercontent.com/amirhamja4bd/public_images/refs/heads/main/Amir_Hamza.png"
                    }
                    alt={post.author.name}
                    width={56}
                    height={56}
                    className="rounded-2xl ring-2 ring-border"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.role}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Listen</span>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isBookmarked
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <button className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative max-w-5xl mx-auto px-4 mb-16">
          <div className="relative aspect-[2/1] rounded-3xl overflow-hidden opacity-0 animate-scale-in delay-400 shadow-2xl">
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-background/30 to-transparent`}
            />
          </div>
        </div>

        <div ref={contentRef} className="max-w-3xl mx-auto px-4 pb-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderContent(post.content)}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              How did you find this article?
            </p>
            <div className="flex items-center justify-center gap-3">
              {reactions.map((reaction) => {
                const Icon = reaction.icon;
                return (
                  <button
                    key={reaction.id}
                    onClick={() =>
                      setActiveReaction(
                        activeReaction === reaction.id ? null : reaction.id,
                      )
                    }
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl transition-all ${
                      activeReaction === reaction.id
                        ? `${reaction.bg} ${reaction.color} scale-110`
                        : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${activeReaction === reaction.id ? "fill-current" : ""}`}
                    />
                    <span className="text-xs font-medium">
                      {reaction.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-card to-muted/30 border border-border">
            <h3 className="font-bold text-foreground text-lg mb-2">
              Enjoyed this article?
            </h3>
            <p className="text-muted-foreground mb-6">
              Share it with your network and help others discover it too.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity">
                <Twitter className="w-4 h-4" />
                Tweet
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] text-white hover:opacity-90 transition-opacity">
                <Linkedin className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <LinkIcon className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-3xl bg-card border border-border relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${categoryStyle.gradient} opacity-5 rounded-full blur-3xl`}
            />
            <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <Image
                src={
                  post.author.avatar ||
                  "https://raw.githubusercontent.com/amirhamja4bd/public_images/refs/heads/main/Amir_Hamza.png"
                }
                alt={post.author.name}
                width={96}
                height={96}
                className="rounded-3xl ring-4 ring-border"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${categoryStyle.text} mb-1`}
                >
                  About the Author
                </p>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {post.author.name}
                </h3>
                <p className="text-muted-foreground mb-4">{post.author.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Passionate about building great products and sharing knowledge
                  with the developer community. Always exploring new
                  technologies and best practices to create better user
                  experiences.
                </p>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <button
                    className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${categoryStyle.gradient} text-white font-medium hover:opacity-90 transition-opacity`}
                  >
                    Follow
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                    View Articles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-20">
            <div className="border-t border-border pt-16">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Continue Reading
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      More articles you might enjoy
                    </p>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <article
                      className="relative h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-up"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.thumbnail || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>
                      <div className="p-5">
                        <span
                          className={`inline-block text-xs font-semibold ${categoryColors[relatedPost.category]?.text || categoryStyle.text} mb-2`}
                        >
                          {relatedPost.category}
                        </span>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-2xl bg-gradient-to-br ${categoryStyle.gradient} text-white shadow-lg transition-all duration-300 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
