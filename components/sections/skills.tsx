"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Cloud,
  Cpu,
  Database,
  Rocket,
  Sparkles,
  Type,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/content";

type CategoryType =
  | "all"
  | "frontend"
  | "backend"
  | "devops"
  | "database"
  | "tooling"
  | "leadership";

const skillsData = {
  title: "Skills & Technologies",
  description:
    "A stack shaped by years of building platform experiences, shipping user-facing products, and enabling teams to move confidently.",

  categories: [
    { id: "all" as CategoryType, label: "All" },
    { id: "frontend" as CategoryType, label: "Frontend" },
    { id: "backend" as CategoryType, label: "Backend" },
    { id: "devops" as CategoryType, label: "DevOps" },
    { id: "database" as CategoryType, label: "Databases" },
    { id: "tooling" as CategoryType, label: "Tooling" },
    { id: "leadership" as CategoryType, label: "Leadership" },
  ],

  categoryLabels: {
    all: "All",
    frontend: "Frontend",
    backend: "Backend",
    devops: "DevOps",
    database: "Databases",
    tooling: "Tooling",
    leadership: "Leadership",
  } as Record<CategoryType, string>,
};

const iconMap = {
  Atom,
  Rocket,
  Type,
  Cpu,
  Database,
  Cloud,
  Sparkles,
};

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      return activeCategory === "all"
        ? true
        : skill.category === activeCategory;
    });
  }, [activeCategory]);

  return (
    <section id="skills" className="scroll-mt-24">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold lg:text-4xl">
          {skillsData.title}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          {skillsData.description}
        </p>
      </div>

      {/* Animated Category Tabs */}
      <div className=" flex justify-center">
        <div className="mt-8 rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur w-fit">
          <div className="relative flex flex-wrap gap-1">
            {skillsData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative z-10 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeSkillCategory"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid with AnimatePresence */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
            className="grid gap-5 md:grid-cols-2"
          >
            {filteredSkills.map((skill, index) => {
              const Icon = iconMap[skill.icon as keyof typeof iconMap] ?? Atom;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
                >
                  <div className="absolute inset-0 -z-10 bg-linear-to-tr from-emerald-500/0 via-emerald-500/5 to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {skill.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                          {
                            skillsData.categoryLabels[
                              skill.category as CategoryType
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{skill.proficiency}%</Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                  <div className="mt-5 h-2 w-full rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: index * 0.05 + 0.2,
                      }}
                      className="h-full rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
