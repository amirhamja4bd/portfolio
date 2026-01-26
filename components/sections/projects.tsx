"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api-client";
import { ProjectCard } from "../projects/ProjectCard";

const projectsData = {
  title: "Projects",
  description:
    "Case studies that demonstrate a balance of technical craftsmanship, product thinking, and cross-functional leadership.",
};

export function ProjectsSection() {
  // fetch projects from API (public: only published projects are returned by default)
  const {
    data: projectsDataFromApi,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", { limit: 9 }],
    queryFn: async () => (await projectApi.getAll({ limit: 9 })).data,
    staleTime: 1000 * 60 * 2,
  });
  console.log({ projectsDataFromApi });

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

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold lg:text-4xl">
            {projectsData.title}
          </h2>
          <p className="text-muted-foreground">{projectsData.description}</p>
        </div>
        <Button asChild className="shrink-0 group" variant="outline">
          <Link href="/projects" className="flex items-center gap-2">
            View all projects{" "}
            <ArrowRight className="h-4 w-4 group-hover:-rotate-45 transition-all ease-in-out" />
          </Link>
        </Button>
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
          projectsDataFromApi?.data?.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={index + projectsDataFromApi?.data?.length}
            />
          ))}
      </div>
    </section>
  );
}
