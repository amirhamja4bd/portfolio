"use client";

import { projectApi } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Filter, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";

const categories = [
  "All",
  "Web Application",
  "Mobile App",
  "Data & AI",
  "Productivity",
  "IoT",
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch projects from API
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", { all: true }],
    queryFn: async () => {
      const response = await projectApi.getAll({ all: true });
      return response;
    },
  });

  const projects = apiResponse?.data?.data || [];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p:any) => p.category === activeCategory);

  const featuredProjects = filteredProjects.filter((p:any) => p.featured);
  const regularProjects = filteredProjects.filter((p:any) => !p.featured);

  return (
    <section className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-linear-to-r from-primary/3 to-transparent blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 pb-8">
        {/* Header section */}
        <div
          className={`max-w-6xl mx-auto mb-20 text-center transition-all duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 opacity-0 animate-fade-up"
            style={{ animationFillMode: "forwards" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new projects
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-8 opacity-0 animate-fade-up delay-100"
            style={{ animationFillMode: "forwards" }}
          >
            Crafting digital
            <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              experiences
            </span>
            that matter.
          </h2>

          <p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-5xl mx-auto opacity-0 animate-fade-up delay-200 text-center"
            style={{ animationFillMode: "forwards" }}
          >
            A curated collection of projects showcasing innovative solutions,
            from full-stack applications to AI-powered platforms. Each project
            represents a unique challenge conquered with creativity and
            precision.
          </p>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-8 mt-12 justify-center opacity-0 animate-fade-up delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "30+", label: "Happy Clients" },
              { value: "5+", label: "Years Experience" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 opacity-0 animate-fade-up delay-400"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 text-sm rounded-full transition-all duration-300",
                    activeCategory === category
                      ? "bg-foreground text-background shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Featured projects */}
          {featuredProjects.length > 0 && (
            <div className="grid gap-6">
              {featuredProjects.map((project:any, index:any) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  variant="featured"
                />
              ))}
            </div>
          )}

          {/* Regular projects grid */}
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            {regularProjects.map((project:any, index:any) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index + featuredProjects.length}
                variant={viewMode === "list" ? "featured" : "default"}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium text-foreground mb-2">
              No projects found
            </p>
            <p className="text-muted-foreground">
              Try selecting a different category.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
            <p className="text-xl font-medium text-foreground mb-2">
              Loading projects...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
              <Filter className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-xl font-medium text-foreground mb-2">
              Failed to load projects
            </p>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        )}
      </div>

      <footer className="relative border-t border-border/50">
        <div className="container mx-auto px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-4">
                Let&apos;s collaborate
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
                Have a project in mind?
                <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Let&apos;s build it together.
                </span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start a Conversation
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M17 7H7M17 7V17"
      />
    </svg>
  );
}
