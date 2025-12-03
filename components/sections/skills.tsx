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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-2/3 bg-linear-to-r from-transparent via-emerald-400/80 to-transparent" />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center p-6">
                      {/* Logo or Icon */}
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-transparent shadow-lg ring-1 ring-white/10 group-hover:ring-emerald-500/50 group-hover:shadow-emerald-500/20 transition-all duration-500">
                        {skill.logo ? (
                          <img
                            src={skill.logo}
                            alt={skill.name}
                            className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <DynamicIcon
                            name={skill.icon}
                            className="h-8 w-8 text-emerald-400 group-hover:scale-110 transition-transform duration-500"
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
                    <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-transparent blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
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

// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { Atom } from "lucide-react";

// import * as LucideIcons from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// import { skillApi } from "@/lib/api-client";
// import { skills } from "@/lib/content";
// import SkillsSkeleton from "../skeleton/SkillsSkeleton";

// type CategoryType =
//   | "all"
//   | "frontend"
//   | "backend"
//   | "devops"
//   | "database"
//   | "tooling"
//   | "leadership";

// const DynamicIcon = ({
//   name,
//   className,
// }: {
//   name: string;
//   className?: string;
// }) => {
//   const IconComponent = (LucideIcons as any)[name];
//   if (!IconComponent) return <Atom className={className} />;
//   return <IconComponent className={className} />;
// };

// export function SkillsSection() {
//   const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
//   const [fetchedSkills, setFetchedSkills] = useState<typeof skills>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await skillApi.getAll();
//         if (response.success && response.data) {
//           setFetchedSkills(response.data);
//         } else {
//           setError("Failed to fetch skills data");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching skills");
//         console.error("Error fetching skills:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSkills();
//   }, []);

//   const dynamicSkillsData = useMemo(() => {
//     // Get unique categories from fetched skills
//     const uniqueCategories = Array.from(
//       new Set(fetchedSkills.map((skill) => skill.category))
//     );

//     // Create category objects
//     const categories = [
//       { id: "all" as CategoryType, label: "All" },
//       ...uniqueCategories.map((category) => ({
//         id: category as CategoryType,
//         label: category.charAt(0).toUpperCase() + category.slice(1),
//       })),
//     ];

//     // Create category labels mapping
//     const categoryLabels = uniqueCategories.reduce(
//       (acc, category) => {
//         acc[category as CategoryType] =
//           category.charAt(0).toUpperCase() + category.slice(1);
//         return acc;
//       },
//       { all: "All" } as Record<CategoryType, string>
//     );

//     return {
//       title: "Skills & Technologies",
//       description:
//         "A stack shaped by years of building platform experiences, shipping user-facing products, and enabling teams to move confidently.",
//       categories,
//       categoryLabels,
//     };
//   }, [fetchedSkills]);

//   const filteredSkills = useMemo(() => {
//     return fetchedSkills.filter((skill) => {
//       return activeCategory === "all"
//         ? true
//         : skill.category === activeCategory;
//     });
//   }, [activeCategory, fetchedSkills]);

//   return (
//     <section id="skills" className="scroll-mt-24">
//       <div className="space-y-3">
//         <h2 className="text-3xl font-semibold lg:text-4xl">
//           {dynamicSkillsData.title}
//         </h2>
//         <p className="max-w-2xl text-muted-foreground">
//           {dynamicSkillsData.description}
//         </p>
//       </div>

//       {/* Animated Category Tabs */}
//       <div className=" flex justify-center">
//         <div className="mt-8 rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur w-fit">
//           <div className="relative flex flex-wrap gap-1">
//             {dynamicSkillsData.categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setActiveCategory(category.id)}
//                 className={`relative z-10 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
//                   activeCategory === category.id
//                     ? "text-foreground"
//                     : "text-muted-foreground hover:text-foreground/80"
//                 }`}
//               >
//                 {activeCategory === category.id && (
//                   <motion.div
//                     layoutId="activeSkillCategory"
//                     className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
//                     transition={{
//                       type: "spring",
//                       stiffness: 500,
//                       damping: 30,
//                     }}
//                   />
//                 )}
//                 <span className="relative z-10">{category.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Skills Grid with AnimatePresence */}
//       <div className="mt-8">
//         {loading && <SkillsSkeleton />}

//         {error && (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-red-500">{error}</div>
//           </div>
//         )}

//         {!loading && !error && (
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeCategory}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               layout
//               className="grid gap-5 md:grid-cols-2"
//             >
//               {filteredSkills.map((skill, index) => {
//                 return (
//                   <motion.div
//                     key={skill.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 p-6 shadow-2xl hover:border-white/20 transition-all duration-300"
//                   >
//                     {/* Partial Top Border */}
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-60" />

//                     {/* Glass Effect Gradient */}
//                     <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                     <div className="relative z-10">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                           {skill.logo ? (
//                             <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-2">
//                               <img
//                                 src={skill.logo}
//                                 alt={`${skill.name} logo`}
//                                 className="w-full h-full object-contain"
//                               />
//                             </div>
//                           ) : (
//                             <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20">
//                               <DynamicIcon
//                                 name={skill.icon}
//                                 className="h-7 w-7 text-primary"
//                               />
//                             </div>
//                           )}
//                           <div>
//                             <p className="text-base font-semibold text-foreground mb-0.5">
//                               {skill.name}
//                             </p>
//                             <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
//                               {
//                                 dynamicSkillsData.categoryLabels[
//                                   skill.category as CategoryType
//                                 ]
//                               }
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex flex-col items-end gap-1.5">
//                           {skill.experienceLevel && (
//                             <span className="text-xs font-medium text-primary/80 capitalize px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
//                               {skill.experienceLevel}
//                             </span>
//                           )}
//                           {skill.experienceYear && (
//                             <span className="text-[10px] text-muted-foreground/50">
//                               {new Date().getFullYear() -
//                                 new Date(skill.experienceYear).getFullYear()}
//                               + years
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-muted-foreground/70">
//                             Proficiency
//                           </span>
//                           <span className="text-primary font-semibold">
//                             {skill.proficiency}%
//                           </span>
//                         </div>
//                         <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${skill.proficiency}%` }}
//                             transition={{
//                               duration: 0.8,
//                               ease: "easeOut",
//                               delay: index * 0.05 + 0.2,
//                             }}
//                             className="h-full rounded-full bg-linear-to-r from-primary to-primary/60 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </div>
//     </section>
//   );
// }
