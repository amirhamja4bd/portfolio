import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/content";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

async function ProjectContent({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
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
        <h1 className="text-5xl font-bold text-foreground">{project.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {project.description}
        </p>
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

      {/* Project Details Grid */}
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.details && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.details}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Technologies */}
          <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-primary/5 text-foreground/80"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">
              Project Links
            </h3>
            <div className="space-y-3">
              {project.demoUrl && (
                <Button asChild className="w-full">
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button asChild variant="outline" className="w-full">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub Repository
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

function ProjectPageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="mb-8 h-10 w-32 bg-muted animate-pulse rounded-md" />
      <div className="space-y-6 mb-12">
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        <div className="h-12 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-6 w-full max-w-3xl bg-muted animate-pulse rounded" />
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-border mb-12 h-[500px] bg-muted animate-pulse" />
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-6 h-48 animate-pulse" />
          <div className="rounded-2xl border border-border/60 bg-background/70 p-6 h-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectContent id={id} />
      </Suspense>
    </div>
  );
}
