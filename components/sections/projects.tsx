"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api-client";
import DOMPurify from "dompurify";

const projectsData = {
  title: "Projects",
  description:
    "Case studies that demonstrate a balance of technical craftsmanship, product thinking, and cross-functional leadership.",
};

export function ProjectsSection() {
  // fetch projects from API (public: only published projects are returned by default)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", { limit: 9 }],
    queryFn: async () => (await projectApi.getAll({ limit: 9 })).data,
    staleTime: 1000 * 60 * 2,
  });

  type ProjectUI = {
    id: string;
    title: string;
    summary: string;
    image: string;
    category: string;
    featured: boolean;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
  };

  const projectsDataFromApi = useMemo<ProjectUI[]>(() => {
    if (!data) return [];
    // API returns pagination shape with `data` inside
    const items = (data as any).data ?? [];

    return items.map((p: any) => ({
      id: p.slug || p._id || p.id,
      title: p.title,
      summary: p.summary || (p.description ? p.description.slice(0, 140) : ""),
      image:
        p.image ||
        p.thumbnail ||
        (p.images && p.images[0]) ||
        "/placeholder-project.jpg",
      category: p.category || "Other",
      featured: !!p.featured,
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      githubUrl: p.githubUrl || (p.githubUrls && p.githubUrls[0]?.url),
      demoUrl: p.demoUrl,
    }));
  }, [data]);
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="max-w-2xl space-y-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">
          {projectsData.title}
        </h2>
        <p className="text-muted-foreground">{projectsData.description}</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-2xl border border-border/40 bg-linear-to-br from-card/90 via-card to-card shadow-sm backdrop-blur-sm animate-pulse"
            />
          ))}

        {isError && (
          <div className="col-span-full text-center text-sm text-destructive">
            Failed to load projects. Please try again later.
          </div>
        )}

        {!isLoading &&
          !isError &&
          projectsDataFromApi.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-card/90 via-card to-card shadow-sm backdrop-blur-sm transition-all duration-400 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1"
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-20">
                  <Badge className="bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md border-0 px-2 py-0.5 text-xs font-medium">
                    Featured
                  </Badge>
                </div>
              )}

              {/* Compact Image Section */}
              <div className="relative aspect-video overflow-hidden">
                <Link
                  href={`/projects/${project.id}`}
                  className="block h-full w-full"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-all duration-600 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30">
                    <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-3 w-3 fill-current" />
                      View Project
                    </div>
                  </div>
                </Link>
              </div>

              {/* Compact Content */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium text-muted-foreground border-border px-2 py-0 h-5"
                    >
                      {project.category}
                    </Badge>

                    {/* Quick Action Icons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.githubUrl && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-sm"
                          asChild
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-sm"
                          asChild
                        >
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Summary */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(project.summary),
                    }}
                  />
                </p>

                {/* Technologies - Ultra Compact */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="inline-block text-xs text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded-md border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="inline-block text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 px-2 flex-1 justify-start"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1"
                    >
                      Case study
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>

                  {project.demoUrl && (
                    <Button
                      asChild
                      size="sm"
                      className="h-7 px-2 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border-0"
                    >
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
      </div>
    </section>
  );
}
