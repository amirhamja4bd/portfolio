"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Atom } from "lucide-react";

import * as LucideIcons from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { skillApi } from "@/lib/api-client";
import { skills } from "@/lib/content";

type CategoryType =
  | "all"
  | "frontend"
  | "backend"
  | "devops"
  | "database"
  | "tooling"
  | "leadership";

const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <Atom className={className} />;
  return <IconComponent className={className} />;
};

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [fetchedSkills, setFetchedSkills] = useState<typeof skills>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await skillApi.getAll();
        if (response.success && response.data) {
          setFetchedSkills(response.data);
        } else {
          setError("Failed to fetch skills data");
        }
      } catch (err) {
        setError("An error occurred while fetching skills");
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const dynamicSkillsData = useMemo(() => {
    // Get unique categories from fetched skills
    const uniqueCategories = Array.from(
      new Set(fetchedSkills.map((skill) => skill.category))
    );

    // Create category objects
    const categories = [
      { id: "all" as CategoryType, label: "All" },
      ...uniqueCategories.map((category) => ({
        id: category as CategoryType,
        label: category.charAt(0).toUpperCase() + category.slice(1),
      })),
    ];

    // Create category labels mapping
    const categoryLabels = uniqueCategories.reduce(
      (acc, category) => {
        acc[category as CategoryType] =
          category.charAt(0).toUpperCase() + category.slice(1);
        return acc;
      },
      { all: "All" } as Record<CategoryType, string>
    );

    return {
      title: "Skills & Technologies",
      description:
        "A stack shaped by years of building platform experiences, shipping user-facing products, and enabling teams to move confidently.",
      categories,
      categoryLabels,
    };
  }, [fetchedSkills]);

  const filteredSkills = useMemo(() => {
    return fetchedSkills.filter((skill) => {
      return activeCategory === "all"
        ? true
        : skill.category === activeCategory;
    });
  }, [activeCategory, fetchedSkills]);

  return (
    <section id="skills" className="scroll-mt-24">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold lg:text-4xl">
          {dynamicSkillsData.title}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          {dynamicSkillsData.description}
        </p>
      </div>

      {/* Animated Category Tabs */}
      <div className=" flex justify-center">
        <div className="mt-8 rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur w-fit">
          <div className="relative flex flex-wrap gap-1">
            {dynamicSkillsData.categories.map((category) => (
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading skills...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        {!loading && !error && (
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
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
                  >
                    <div className="absolute inset-0 -z-10 bg-linear-to-tr from-background/70 via-background/70 to-primary/12 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <DynamicIcon
                            name={skill.icon}
                            className="h-5 w-5 text-primary"
                          />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {skill.name}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                            {
                              dynamicSkillsData.categoryLabels[
                                skill.category as CategoryType
                              ]
                            }
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{skill.proficiency}%</Badge>
                    </div>
                    {skill.description && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        {skill.description}
                      </p>
                    )}
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
        )}
      </div>
    </section>
  );
}
