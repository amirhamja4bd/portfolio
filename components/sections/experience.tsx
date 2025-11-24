"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import { experienceApi } from "@/lib/api-client";

interface ExperienceItem {
  _id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  current: boolean;
  isActive: boolean;
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experienceApi.getAll({ all: true });
        if (response.success && response.data) {
          // Filter only active experiences and sort by order/startDate
          const activeExperiences = response.data
            .filter((exp: ExperienceItem) => exp.isActive)
            .sort((a: ExperienceItem, b: ExperienceItem) => {
              // Sort by current first, then by start date descending
              if (a.current && !b.current) return -1;
              if (!a.current && b.current) return 1;
              return (
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
              );
            });
          setExperiences(activeExperiences);
        }
      } catch (err: any) {
        console.error("Failed to fetch experiences:", err);
        setError(err.message || "Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.getFullYear().toString();
  };

  if (loading) {
    return (
      <section id="experience" className="scroll-mt-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
          <p className="max-w-2xl text-muted-foreground">
            A timeline of the teams, products, and outcomes I&apos;ve helped
            shape across platform, data, and developer experience.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading experiences...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="scroll-mt-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
          <p className="max-w-2xl text-muted-foreground">
            A timeline of the teams, products, and outcomes I&apos;ve helped
            shape across platform, data, and developer experience.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-center py-12">
          <div className="text-red-500">Error loading experiences: {error}</div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return (
      <section id="experience" className="scroll-mt-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
          <p className="max-w-2xl text-muted-foreground">
            A timeline of the teams, products, and outcomes I&apos;ve helped
            shape across platform, data, and developer experience.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-center py-12">
          <div className="text-muted-foreground">
            No experiences to display.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="scroll-mt-24">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
        <p className="max-w-2xl text-muted-foreground">
          A timeline of the teams, products, and outcomes I&apos;ve helped shape
          across platform, data, and developer experience.
        </p>
      </div>
      <div className="relative mt-12">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-border/70 md:block" />
        <div className="space-y-10">
          {experiences.map((role, index) => (
            <motion.article
              key={role._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="relative md:pl-16"
            >
              <span className="absolute left-2.5 top-0 hidden h-3 w-3 rounded-full border-2 border-background bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] md:block" />
              <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background/75 p-8 shadow-lg backdrop-blur md:flex-row md:items-start">
                <div className="flex w-full shrink-0 items-center gap-4 md:w-48 md:flex-col md:items-start">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60 bg-background/80">
                    <Image
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=80&q=80"
                      alt={role.company}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground md:text-base">
                    <p className="font-semibold text-foreground">
                      {role.company}
                    </p>
                    <p>{role.location}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {role.position}
                      </h3>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground/80">
                        {formatDate(role.startDate)} –{" "}
                        {role.current
                          ? "Present"
                          : role.endDate
                          ? formatDate(role.endDate)
                          : "Present"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  {role.responsibilities &&
                    role.responsibilities.length > 0 && (
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {role.responsibilities.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  {role.technologies && role.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
                      {role.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/60 bg-background/70 px-3 py-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
