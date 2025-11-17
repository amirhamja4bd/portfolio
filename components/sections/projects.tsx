"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/content";

const projectsData = {
  title: "Projects",
  description:
    "Case studies that demonstrate a balance of technical craftsmanship, product thinking, and cross-functional leadership.",
};

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="max-w-2xl space-y-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">
          {projectsData.title}
        </h2>
        <p className="text-muted-foreground">{projectsData.description}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-background/95 via-background/90 to-background/95 shadow-xl backdrop-blur transition-all duration-300 hover:shadow-2xl hover:border-primary/30"
          >
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-emerald-500/90 text-white shadow-lg">
                  Featured
                </Badge>
              </div>
            )}

            {/* Project Image */}
            <ProjectMedia project={project} />

            {/* Project Content */}
            <div className="flex flex-1 flex-col gap-5 p-8">
              {/* Category & Title */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                  {project.category}
                </div>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-primary/5 text-foreground/80 hover:bg-primary/10 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border/50">
                {project.demoUrl && (
                  <Button asChild size="sm" className="flex-1">
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" /> GitHub
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

function ProjectMedia({ project }: { project: (typeof projects)[number] }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group/image relative overflow-hidden bg-muted block"
    >
      <Image
        src={project.image}
        alt={project.title}
        width={1200}
        height={800}
        className="h-72 w-full object-cover transition-all duration-500 group-hover/image:scale-110 group-hover/image:brightness-75"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
      <span className="absolute bottom-4 right-4 rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 text-xs font-medium text-foreground shadow-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
        View Details
      </span>
    </Link>
  );
}
