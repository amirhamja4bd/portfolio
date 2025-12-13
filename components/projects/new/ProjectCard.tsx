"use client";

import type React from "react";

import { ArrowUpRight, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Project } from "./data";

interface ProjectCardProps {
  project: Project;
  index: number;
  variant?: "default" | "featured" | "compact";
}

export function ProjectCard({
  project,
  index,
  variant = "default",
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const tiltStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${
          -mousePosition.y * 10
        }deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.2s ease-out",
  };

  // Spotlight gradient position
  const spotlightStyle = {
    background: isHovered
      ? `radial-gradient(600px circle at ${(mousePosition.x + 0.5) * 100}% ${
          (mousePosition.y + 0.5) * 100
        }%, oklch(0.7 0.2 270 / 0.15), transparent 40%)`
      : "none",
  };

  if (variant === "featured") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="block col-span-full lg:col-span-2"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="group relative overflow-hidden rounded-3xl bg-card border border-border opacity-0 animate-fade-up"
        >
          {/* Spotlight overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={spotlightStyle}
          />

          {/* Animated gradient border on hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute -inset-0.5 rounded-3xl bg-linear-to-r from-primary via-accent to-primary/50 animate-border-dance" />
            <div className="absolute inset-0 rounded-3xl bg-card" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-16/10 lg:aspect-auto lg:min-h-[400px] overflow-hidden image-shine">
              <Image
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-card" />

              {/* Featured badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Featured Project
              </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 flex flex-col justify-center p-8 lg:p-12">
              <div className="space-y-6">
                {/* Category & Year */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight group-hover:bg-linear-to-r group-hover:from-primary group-hover:via-primary/80 group-hover:to-primary/60 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.longDescription}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm border border-border/50 hover:border-primary/50 hover:text-foreground transition-all duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4 pt-4">
                  <span className="inline-flex items-center gap-2 text-foreground font-medium group-hover:text-primary transition-colors">
                    View Project
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Live Demo Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border opacity-0 animate-fade-up"
        // @ts-expect-error css custom property
        style={{
          ...tiltStyle,
          animationDelay: `${index * 100}ms`,
          animationFillMode: "forwards",
        }}
      >
        {/* Spotlight overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
          style={spotlightStyle}
        />

        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden image-shine">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent opacity-60" />

          {/* Year badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-foreground">
            {project.year}
          </div>

          {/* Hover overlay with icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/10 transition-all duration-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-xl">
              <ArrowUpRight className="h-6 w-6 text-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-4">
          {/* Category */}
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {project.category}
          </span>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack - Show first 3 */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Bottom bar - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </div>
    </Link>
  );
}
