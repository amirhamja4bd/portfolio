"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Github,
  Layers,
  Play,
  Star,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Project } from "./data";

interface ProjectDetailsProps {
  project: Project;
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numericValue = Number.parseInt(value.replace(/\D/g, ""));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * numericValue);
      setDisplayValue(current.toString());

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  delay: number;
}) {
  return (
    <div
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TechBadge({ tech, index }: { tech: string; index: number }) {
  const colors = [
    "from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20",
    "from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/20",
    "from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/20",
    "from-muted/30 to-muted/20 hover:from-muted/40 hover:to-muted/30",
    "from-primary/15 to-accent/15 hover:from-primary/25 hover:to-accent/25",
  ];
  const colorClass = colors[index % colors.length];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r text-foreground text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default",
        colorClass
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-60" />
      {tech}
    </span>
  );
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const allImages = [project.thumbnail, ...project.images];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                Back to Projects
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {project.githubUrls.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">{repo.label}</span>
                </a>
              ))}
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="container mx-auto px-6 pt-16 pb-12">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16 items-start">
            {/* Left: Content */}
            <div className="lg:col-span-2 lg:sticky lg:top-32">
              {/* Breadcrumb */}
              <div
                className={cn(
                  "flex items-center gap-3 mb-8 transition-all duration-700",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Star className="h-3 w-3" />
                  {project.category}
                </span>
                <span className="text-muted-foreground text-sm">
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h1
                className={cn(
                  "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 transition-all duration-700 delay-100",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                {project.title}
              </h1>

              {/* Description */}
              <p
                className={cn(
                  "text-lg text-muted-foreground leading-relaxed mb-8 transition-all duration-700 delay-200",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                {project.longDescription}
              </p>

              {/* Quick stats */}
              <div
                className={cn(
                  "flex flex-wrap gap-6 mb-8 transition-all duration-700 delay-300",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                {[
                  { icon: Clock, label: "Duration", value: project.duration },
                  { icon: Users, label: "Team", value: project.teamSize },
                  { icon: Briefcase, label: "Role", value: project.role },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">
                        {item.label}:
                      </span>{" "}
                      <span className="font-medium text-foreground">
                        {item.value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div
                className={cn(
                  "transition-all duration-700 delay-400",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Tech Stack
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <TechBadge key={tech} tech={tech} index={idx} />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div
                className={cn(
                  "relative aspect-4/3 overflow-hidden rounded-3xl bg-muted cursor-pointer group transition-all duration-700 delay-200",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                onClick={() => openLightbox(0)}
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="absolute -inset-0.5 rounded-3xl bg-linear-to-r from-primary via-accent to-primary/50 animate-border-dance" />
                  <div className="absolute inset-0 rounded-3xl bg-card" />
                </div>

                <Image
                  src={project.thumbnail || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 relative z-0"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent z-10" />

                {/* Click indicator */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Click to expand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={Calendar}
            label="Year"
            value={project.year}
            delay={100}
          />
          <InfoCard
            icon={Clock}
            label="Duration"
            value={project.duration}
            delay={200}
          />
          <InfoCard
            icon={Users}
            label="Team Size"
            value={project.teamSize}
            delay={300}
          />
          <InfoCard
            icon={Target}
            label="Role"
            value={project.role}
            delay={400}
          />
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Project Gallery
              </h2>
              <p className="text-muted-foreground">
                Screenshots and visual documentation
              </p>
            </div>
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
              {project.images.length} images
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((img, idx) => (
              <div
                key={idx}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-muted cursor-pointer opacity-0 animate-fade-up",
                  idx === 0 && project.images.length > 2
                    ? "sm:col-span-2 sm:row-span-2 aspect-square"
                    : "aspect-video"
                )}
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: "forwards",
                }}
                onClick={() => openLightbox(idx + 1)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Image number badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                  {idx + 1} / {project.images.length}
                </div>

                {/* Expand icon */}
                <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.videos.length > 0 && (
        <section className="container mx-auto px-6 py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Video Showcase
            </h2>
            <p className="text-muted-foreground">Watch the project in action</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {project.videos.map((video, idx) => {
              const videoId = getYouTubeId(video);
              return (
                <div
                  key={idx}
                  className="group relative aspect-video overflow-hidden rounded-2xl bg-muted border border-border opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Video ${idx + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Video unavailable</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="relative border-t border-border/50 bg-linear-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Ready to collaborate?
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Let&apos;s create something
              <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                extraordinary together.
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Whether you have a project in mind or just want to chat, I&apos;m
              always excited to hear about new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl"
              >
                Start a Conversation
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl border-0 bg-background/95 p-0 backdrop-blur-2xl">
          <div className="relative aspect-video">
            <Image
              src={allImages[currentImageIndex] || "/placeholder.svg"}
              alt={`Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />

            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors backdrop-blur-sm"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="h-7 w-7 text-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="h-7 w-7 text-foreground" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 backdrop-blur-sm">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentImageIndex
                      ? "bg-primary w-6"
                      : "bg-foreground/30 hover:bg-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
