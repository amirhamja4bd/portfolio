"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectItem } from "@/lib/content";

interface ProjectModalProps {
  project: ProjectItem;
}

export function ProjectModal({ project }: ProjectModalProps) {
  const router = useRouter();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-lg transition-colors hover:bg-background"
          aria-label="Close project details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative overflow-hidden rounded-t-3xl">
          <Image
            src={project.image}
            alt={project.title}
            width={1600}
            height={900}
            className="w-full max-h-[400px] object-cover"
          />
          {project.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-emerald-500/90 text-white shadow-lg">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-6 p-8">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              {project.category}
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
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

          {project.details ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Project Details
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.details}
              </p>
            </div>
          ) : null}

          <div className="flex gap-3 border-t border-border pt-4">
            {project.demoUrl ? (
              <Button asChild className="flex-1">
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  Visit Live Demo
                </a>
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button asChild variant="outline" className="flex-1">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  View on GitHub
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
