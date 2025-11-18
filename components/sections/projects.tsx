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

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1"
          >
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg border-0 px-3 py-1">
                  ⭐ Featured
                </Badge>
              </div>
            )}

            {/* Project Image */}
            <ProjectMedia project={project} />

            {/* Project Content */}
            <div className="flex flex-1 flex-col gap-4 p-6">
              {/* Category & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-linear-to-r from-primary to-primary/50 rounded-full" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-primary/80">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {project.summary}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 4).map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-primary/8 text-xs text-foreground/70 hover:bg-primary/15 hover:text-foreground transition-all border border-primary/10 px-2 py-0.5"
                  >
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 4 && (
                  <Badge
                    variant="secondary"
                    className="bg-muted text-xs text-muted-foreground px-2 py-0.5"
                  >
                    +{project.technologies.length - 4}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex items-center gap-2 pt-3">
                {project.demoUrl && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 h-9 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 hover:bg-primary/5 transition-colors"
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github className="mr-1.5 h-3.5 w-3.5" /> Code
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
      className="group/image relative overflow-hidden bg-muted block aspect-video"
    >
      <Image
        src={project.image}
        alt={project.title}
        width={1200}
        height={800}
        className="h-full w-full object-cover transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-90"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover/image:opacity-100 transition-opacity duration-500" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300">
        <div className="rounded-full bg-primary/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xl transform translate-y-2 group-hover/image:translate-y-0 transition-transform duration-300">
          View Case Study →
        </div>
      </div>
    </Link>
  );
}
