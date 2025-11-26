"use client";

import ProjectSkeleton from "@/components/skeleton/ProjectSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api-client";
import MarkdownPreview from "@/lib/MarkdownPreview";
import { useQuery } from "@tanstack/react-query";
import "highlight.js/styles/github-dark.css";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

interface Props {
  slug: string;
}

export default function ProjectDetailClient({ slug }: Props) {
  const htmlContentRef = useRef<HTMLDivElement | null>(null);
  type ProjectUI = {
    title: string;
    description: string;
    details?: string;
    image: string;
    demoUrl?: string;
    githubUrl?: string;
    technologies: string[];
    category?: string;
    featured?: boolean;
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => (await projectApi.getBySlug(slug)).data,
    staleTime: 1000 * 60 * 2,
    enabled: !!slug,
  });

  const project = useMemo<ProjectUI | null>(() => {
    if (!data) return null;
    // API returns a single project object directly
    const p: any = data;
    return {
      title: p.title,
      description: p.description,
      details: p.details,
      image:
        p.image ||
        p.thumbnail ||
        (p.images && p.images[0]) ||
        "/placeholder-project.jpg",
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl || (p.githubUrls && p.githubUrls[0]?.url),
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      category: p.category,
      featured: !!p.featured,
    };
  }, [data]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="container mx-auto px-6 max-w-6xl py-12 text-center">
        <p className="text-destructive">Project not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Back Button */}
      <Link href="/#projects">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </Link>

      {/* Project Header */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground/70">
            {project.category}
          </div>
          {project.featured && (
            <Badge className="bg-emerald-500/90 text-white">Featured</Badge>
          )}
        </div>

        {/* Project Image */}
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl mb-12">
          <Image
            src={project.image}
            alt={project.title}
            width={1600}
            height={900}
            className="w-full object-cover"
            priority
          />
        </div>
        <h1 className="text-5xl font-bold text-foreground">{project.title}</h1>
        <div className="text-xl text-muted-foreground prose prose-invert">
          <MarkdownPreview
            data={project.description}
            htmlContentRef={htmlContentRef}
          />
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="space-y-12">
        {/* Technologies and Links Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Technologies */}
          <div className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-base font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-primary/10 text-foreground/90 px-2.5 py-1 text-sm font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-base font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Project Links
            </h3>
            <div className="space-y-3">
              {project.demoUrl && (
                <Button asChild className="w-full h-10 text-sm">
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 text-sm"
                >
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
