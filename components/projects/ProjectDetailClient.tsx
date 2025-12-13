"use client";

import ProjectSkeleton from "@/components/skeleton/ProjectSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api-client";
import MarkdownPreview from "@/lib/MarkdownPreview";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import "highlight.js/styles/github-dark.css";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

interface Props {
  slug: string;
}

export default function ProjectDetailClient({ slug }: Props) {
  const htmlContentRef = useRef<HTMLDivElement | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  type ProjectUI = {
    title: string;
    description: string;
    details?: string;
    image: string;
    images: string[];
    demoUrl?: string;
    githubUrl?: string;
    technologies: string[];
    category?: string;
    featured?: boolean;
    videos?: string[];
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

    // Handle images array
    let projectImages: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      projectImages = p.images;
    } else if (p.image) {
      projectImages = [p.image];
    } else if (p.thumbnail) {
      projectImages = [p.thumbnail];
    } else {
      projectImages = ["/placeholder-project.jpg"];
    }

    return {
      title: p.title,
      description: p.description,
      details: p.details,
      image: projectImages[0],
      images: projectImages,
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl || (p.githubUrls && p.githubUrls[0]?.url),
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      category: p.category,
      featured: !!p.featured,
      videos: Array.isArray(p.videos) ? p.videos : [],
    };
  }, [data]);

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const handlePreviousImage = () => {
    if (!project) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!project) return;
    setSelectedImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

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

        {/* Video Section */}
        {project.videos && project.videos.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-base font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Project Demo Videos
            </h3>
            <div className="grid gap-6">
              {project.videos.map((video, index) => {
                const youtubeId = getYouTubeId(video);
                if (youtubeId) {
                  return (
                    <div
                      key={index}
                      className="aspect-video rounded-xl overflow-hidden border border-border/50"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={`${project.title} Demo ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Dynamic Project Gallery */}
        {project.images.length > 1 && (
          <div className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
            <h3 className="text-base font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Project Gallery
            </h3>

            {/* Main Preview Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 group bg-muted mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  className="relative w-full h-full cursor-pointer"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(selectedImageIndex)}
                >
                  <Image
                    src={project.images[selectedImageIndex]}
                    alt={`${project.title} screenshot ${
                      selectedImageIndex + 1
                    }`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {project.images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-3 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    onClick={handlePreviousImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-3 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    onClick={handleNextImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-background/80 text-foreground px-3 py-1 rounded-full text-sm border border-border/50 backdrop-blur-sm">
                {selectedImageIndex + 1} / {project.images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {project.images.map((image, index) => (
                <motion.button
                  key={index}
                  className={`relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index
                      ? "border-brand ring-2 ring-brand/50"
                      : "border-border hover:border-brand/50"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  {selectedImageIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-brand/20"
                      layoutId="thumbnail-highlight"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button
              className="absolute top-6 right-6 bg-card hover:bg-accent text-foreground p-3 rounded-full border border-border"
              onClick={() => setIsLightboxOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  className="relative max-w-full max-h-[90vh] aspect-video"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={project.images[selectedImageIndex]}
                    alt={`${project.title} screenshot ${
                      selectedImageIndex + 1
                    }`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="90vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lightbox Navigation */}
              {project.images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-6 bg-card hover:bg-accent text-foreground p-4 rounded-full border border-border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousImage();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>
                  <motion.button
                    className="absolute right-6 bg-card hover:bg-accent text-foreground p-4 rounded-full border border-border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>
                </>
              )}

              {/* Lightbox Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card text-foreground px-4 py-2 rounded-full text-sm border border-border">
                {selectedImageIndex + 1} / {project.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
