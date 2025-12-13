"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Atom } from "lucide-react";

import * as LucideIcons from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { skillApi } from "@/lib/api-client";
import { skills } from "@/lib/content";
import SkillsSkeleton from "../skeleton/SkillsSkeleton";

// Expected Skill data structure from API:
// {
//   id: string;
//   name: string;
//   category: "frontend" | "backend" | "devops" | "database" | "tooling" | "leadership";
//   experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
//   proficiency: number;
//   icon: string;
//   logo?: string;
//   experienceYear?: Date;
//   order: number;
//   isActive: boolean;
// }

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
        {loading && <SkillsSkeleton />}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              layout
              className="flex flex-wrap justify-center gap-5"
            >
              {filteredSkills.map((skill, index) => {
                // Calculate years of experience
                const calculateYearsOfExp = (
                  startDate: string | Date | undefined
                ) => {
                  if (!startDate) return "1 year exp";
                  const start = new Date(startDate);
                  const now = new Date();
                  const years = now.getFullYear() - start.getFullYear();
                  const months = now.getMonth() - start.getMonth();
                  const totalMonths = years * 12 + months;

                  if (totalMonths < 12) return "< 1 year exp";
                  if (totalMonths < 24) return "1 year exp";
                  if (totalMonths % 12 === 0) return `${years} years exp`;
                  return `${years} years exp`;
                };

                // Get experience level label
                const experienceLevel = skill.experienceLevel
                  ? skill.experienceLevel.charAt(0).toUpperCase() +
                    skill.experienceLevel.slice(1)
                  : "Intermediate";

                const yearsExp = calculateYearsOfExp(skill.experienceYear);

                // Determine badge color based on experience level
                const getBadgeColor = (level: string) => {
                  const lowerLevel = level.toLowerCase();
                  if (lowerLevel === "expert")
                    return "border-amber-500/50 text-amber-400 bg-amber-500/10";
                  if (lowerLevel === "advanced")
                    return "border-purple-500/50 text-purple-400 bg-purple-500/10";
                  if (lowerLevel === "intermediate")
                    return "border-blue-500/50 text-blue-400 bg-blue-500/10";
                  return "border-green-500/50 text-green-400 bg-green-500/10"; // beginner
                };

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-transparent backdrop-blur-[2px] shadow-2xl hover:shadow-emerald-500/0 transition-all duration-500 w-[180px]"
                  >
                    {/* Partial top border */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-2/3 bg-linear-to-r from-transparent via-brand/80 to-transparent" />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center p-6">
                      {/* Logo or Icon */}
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-transparent shadow-lg ring-1 ring-white/10 group-hover:ring-brand/50 group-hover:shadow-brand/20 transition-all duration-500">
                        {skill.logo ? (
                          <img
                            src={skill.logo}
                            alt={skill.name}
                            className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <DynamicIcon
                            name={skill.icon}
                            className="h-8 w-8 text-brand group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Skill Name */}
                      <h3 className="text-base font-semibold text-white mb-3">
                        {skill.name}
                      </h3>

                      {/* Experience Level Badge */}
                      <Badge
                        variant="outline"
                        className={`mb-2 px-3 py-1 text-xs font-medium border ${getBadgeColor(
                          experienceLevel
                        )}`}
                      >
                        ● {experienceLevel}
                      </Badge>

                      {/* Years of Experience */}
                      <p className="text-xs text-slate-500 font-medium">
                        {yearsExp}
                      </p>
                    </div>

                    {/* Decorative glow effect */}
                    <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-transparent blur-3xl group-hover:bg-brand/20 transition-all duration-500" />
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
