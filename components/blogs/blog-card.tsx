"use client";

import {
  ArrowRight,
  Bookmark,
  Calendar,
  Eye,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";

interface BlogCardProps {
  post: any; // Using any temporarily to handle both types, or I can define a union
  index: number;
  variant?: "default" | "featured" | "large" | "horizontal";
}

export function BlogCard({ post, index, variant = "large" }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryConfig = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("dev")) {
      return {
        icon: Zap,
        gradient: "from-primary/80 to-brandColor/80",
        bg: "bg-primary/10 text-primary",
      };
    }
    if (cat.includes("design")) {
      return {
        icon: Sparkles,
        gradient: "from-brandColor/80 to-accent/80",
        bg: "bg-brandColor/10 text-brandColor",
      };
    }
    if (cat.includes("trend") || cat.includes("hot")) {
      return {
        icon: TrendingUp,
        gradient: "from-accent/80 to-primary/80",
        bg: "bg-accent/10 text-accent",
      };
    }
    // Default config
    return {
      icon: Bookmark,
      gradient: "from-primary/80 to-accent/80",
      bg: "bg-primary/10 text-primary",
    };
  };
  const config = getCategoryConfig(post.category);
  const CategoryIcon = config.icon;
  const thumbnail = post.thumbnail || post.coverImage || "/placeholder.svg";
  const authorAvatar = post.author?.avatar || "/placeholder.svg";
  const authorName = post.author?.name || "Anonymous";
  const authorRole = post.author?.role || "Contributor";

  if (variant === "featured") {
    return (
      <Link href={`/blogs/${post.slug}`} className="block group col-span-full">
        <article
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative h-[500px] rounded-3xl overflow-hidden opacity-0 animate-fade-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          {/* Background image with parallax */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              transform: isHovered
                ? `scale(1.05) translate(${(mousePosition.x - 0.5) * -10}px, ${
                    (mousePosition.y - 0.5) * -10
                  }px)`
                : "scale(1)",
            }}
          >
            <Image
              src={thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
          <div
            className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          />

          {/* Floating spotlight */}
          {isHovered && (
            <div
              className="absolute pointer-events-none transition-opacity duration-300"
              style={{
                left: `${mousePosition.x * 100}%`,
                top: `${mousePosition.y * 100}%`,
                width: "400px",
                height: "400px",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, var(--primary) / 0.15, transparent 50%)`,
              }}
            />
          )}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            {/* Top badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} backdrop-blur-md border border-white/10`}
                >
                  <CategoryIcon className="w-4 h-4" />
                  {post.category || "Development"}
                </span>
                {post.featured && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/20">
                    <Sparkles className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookmarked(!isBookmarked);
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isBookmarked
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Title and excerpt */}
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors duration-300 text-balance">
                {post.title}
              </h2>
              <p className="text-lg text-white/70 mb-6 line-clamp-2 max-w-2xl">
                {post.excerpt}
              </p>

              {/* Author and meta */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-white/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{authorName}</p>
                    <p className="text-sm text-white/60">{authorRole}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {post.views || 0} views
                  </div>
                </div>

                <div className="ml-auto">
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-background font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={`/blogs/${post.slug}`} className="block group">
        <article
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative h-[400px] rounded-2xl overflow-hidden opacity-0 animate-fade-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <Image
              src={thumbnail}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
          <div
            className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} backdrop-blur-sm w-fit mb-4`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              {post.category || "Development"}
            </span>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-white/60 line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3">
              <Image
                src={authorAvatar}
                alt={authorName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm text-white/80">{authorName}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/blogs/${post.slug}`} className="block group">
        <article
          className="relative flex gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 opacity-0 animate-fade-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
            <Image
              src={thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${config.bg} px-2 py-0.5 rounded-full w-fit mb-2`}
            >
              {post.category || "Development"}
            </span>
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm mb-1">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blogs/${post.slug}`} className="block group">
      <article
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className="relative h-full rounded-2xl overflow-hidden bg-card border border-border/50 opacity-0 animate-fade-up transition-all duration-500 hover:border-primary/30"
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: "forwards",
          transform: isHovered
            ? `perspective(1000px) rotateX(${
                (mousePosition.y - 0.5) * -5
              }deg) rotateY(${(mousePosition.x - 0.5) * 5}deg) translateZ(10px)`
            : "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)",
          transition: "transform 0.3s ease-out, border-color 0.3s ease",
        }}
      >
        {/* Animated border gradient */}
        {/* <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"> */}
        <div
          className={`absolute -inset-0.5 rounded-2xl bg-linear-to-r from-primary to-brandColor animate-border-dance group-hover:opacity-100`}
          style={{ backgroundSize: "300% 100%" }}
        />
        <div className="absolute inset-0 rounded-2xl bg-card" />
        {/* </div> */}

        {/* Spotlight effect */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${
                mousePosition.x * 100
              }% ${
                mousePosition.y * 100
              }%, var(--primary) / 0.1, transparent 40%)`,
            }}
          />
        )}

        <div className="relative z-10">
          {/* Image container */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
            <div
              className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} backdrop-blur-md border border-white/10`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                {post.category || "Development"}
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${
                isBookmarked
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/30 text-white hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="relative p-5">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags?.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-secondary/50 text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2.5">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-border"
                />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {authorName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {authorRole}
                  </p>
                </div>
              </div>

              <div
                className={`w-10 h-10 rounded-full bg-linear-to-br ${config.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300`}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
