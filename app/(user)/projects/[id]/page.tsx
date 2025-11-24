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
      <div className="space-y-12">
        {/* Main Content - Full Width Overview */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
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

      {/* Related Projects */}
      <div className="mt-20">
        <h2 className="text-3xl font-semibold mb-8">Related Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((p) => {
              // Exclude current project
              if (p.id === project.id) return false;

              // Include projects from same category or with overlapping technologies
              const sameCategory = p.category === project.category;
              const sharedTech = p.technologies.some((tech) =>
                project.technologies.includes(tech)
              );

              return sameCategory || sharedTech;
            })
            .slice(0, 3)
            .map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/projects/${relatedProject.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedProject.image}
                      alt={relatedProject.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
                      {relatedProject.category}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedProject.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {relatedProject.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-primary/5 text-foreground/80 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {relatedProject.technologies.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-foreground/80 text-xs"
                        >
                          +{relatedProject.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
      <div className="space-y-12">
        <div className="space-y-8">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            <div className="h-5 w-full bg-muted animate-pulse rounded" />
            <div className="h-5 w-full bg-muted animate-pulse rounded" />
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-6 h-32 bg-muted animate-pulse" />
          <div className="rounded-xl border border-border/60 p-6 h-32 bg-muted animate-pulse" />
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
