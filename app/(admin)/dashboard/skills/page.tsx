"use client";

import { SkillFormModal } from "@/components/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/contexts/auth-context";
import { skillApi } from "@/lib/api-client";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Atom, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SkillsPage() {
  const { user, loading } = useRequireAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  // Dynamic icon component
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

  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const response = await skillApi.getAll({ all: true });
      setSkills(response.data || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await skillApi.delete(pendingDeleteId);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    fetchSkills();
  };

  const filteredSkills = skills.filter((skill) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (skill.name || "").toLowerCase().includes(q) ||
      (skill.category || "").toLowerCase().includes(q) ||
      (skill.experienceLevel || "").toLowerCase().includes(q) ||
      (skill.experienceYear || "").toString().toLowerCase().includes(q)
    );
  });

  const groupedSkills: Record<string, any[]> = filteredSkills.reduce(
    (acc, skill) => {
      const category = skill.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, any[]>
  );

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Skills
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your technical skills and expertise
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Skill
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Skills by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {loadingSkills ? (
          <div className="text-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading skills...
            </p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border bg-card p-8 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Atom className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-1">No skills found</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or clear the search to see all skills."
                : "Get started by adding your first technical skill to showcase your expertise."}
            </p>
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {searchQuery ? "Add New Skill" : "Add Your First Skill"}
            </Button>
          </motion.div>
        ) : (
          Object.entries(groupedSkills).map(([category, categorySkills]) => {
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-6 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground capitalize">
                    {category.replace("_", " ")}
                  </h3>
                  <div className="h-px bg-border flex-1 ml-2"></div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {categorySkills.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {categorySkills.map((skill) => {
                    return (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 p-2 shadow-2xl hover:border-white/20 transition-all duration-200"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-60" />
                        <div className="relative z-10 p-4">
                          {/* Header with logo/icon and name */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {skill.logo ? (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-2">
                                  <img
                                    className="w-full h-full object-contain"
                                    src={skill.logo}
                                    alt={`${skill.name} logo`}
                                  />
                                </div>
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20">
                                  <DynamicIcon
                                    name={skill.icon}
                                    className="h-7 w-7 text-primary"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                  {skill.name}
                                </h4>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {skill.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-primary">
                                {skill.proficiency}%
                              </span>
                              {skill.experienceLevel && (
                                <span className="text-xs font-medium text-primary/80 capitalize px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                                  {skill.experienceLevel}
                                </span>
                              )}
                              {skill.experienceYear && (
                                <span className="text-[10px] text-muted-foreground/50">
                                  {new Date().getFullYear() -
                                    new Date(
                                      skill.experienceYear
                                    ).getFullYear()}
                                  + years
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(skill)}
                              className="w-1/2 h-8 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(skill._id)}
                              className="w-1/2 h-8 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        {!skill.isActive && (
                          <div className="absolute top-2 right-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Modal */}
      <SkillFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        skill={editingSkill}
        onSuccess={handleSuccess}
      />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this skill? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// "use client";

// import { SkillFormModal } from "@/components/admin";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useRequireAuth } from "@/contexts/auth-context";
// import { skillApi } from "@/lib/api-client";
// import { motion } from "framer-motion";
// import { Atom, Pencil, Plus, Search, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// export default function SkillsPage() {
//   const { user, loading } = useRequireAuth();
//   const [skills, setSkills] = useState<any[]>([]);
//   const [loadingSkills, setLoadingSkills] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSkill, setEditingSkill] = useState<any>(null);

//   useEffect(() => {
//     if (user) {
//       fetchSkills();
//     }
//   }, [user]);

//   const fetchSkills = async () => {
//     try {
//       setLoadingSkills(true);
//       const response = await skillApi.getAll({ all: true });
//       setSkills(response.data || []);
//     } catch (error) {
//       console.error("Failed to fetch skills:", error);
//     } finally {
//       setLoadingSkills(false);
//     }
//   };

//   const handleCreate = () => {
//     setEditingSkill(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (skill: any) => {
//     setEditingSkill(skill);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this skill?")) return;

//     try {
//       await skillApi.delete(id);
//       fetchSkills();
//     } catch (error) {
//       console.error("Failed to delete skill:", error);
//       alert("Failed to delete skill");
//     }
//   };

//   const handleSuccess = () => {
//     setIsModalOpen(false);
//     setEditingSkill(null);
//     fetchSkills();
//   };

//   const filteredSkills = skills.filter(
//     (skill) =>
//       skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       skill.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const groupedSkills: Record<string, any[]> = filteredSkills.reduce(
//     (acc, skill) => {
//       const category = skill.category || "other";
//       if (!acc[category]) acc[category] = [];
//       acc[category].push(skill);
//       return acc;
//     },
//     {} as Record<string, any[]>
//   );

//   if (loading || !user) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="text-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
//       >
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//             Skills
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Manage your technical skills and expertise
//           </p>
//         </div>
//         <Button onClick={handleCreate} className="self-start sm:self-auto">
//           <Plus className="h-4 w-4 mr-2" />
//           New Skill
//         </Button>
//       </motion.div>

//       {/* Search */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search skills..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </motion.div>

//       {/* Skills by Category */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="space-y-6"
//       >
//         {loadingSkills ? (
//           <div className="text-center py-12">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading skills...</p>
//           </div>
//         ) : filteredSkills.length === 0 ? (
//           <div className="rounded-xl border bg-card p-12 text-center">
//             <p className="text-muted-foreground">No skills found.</p>
//             <Button onClick={handleCreate} className="mt-4">
//               <Plus className="h-4 w-4 mr-2" />
//               Add your first skill
//             </Button>
//           </div>
//         ) : (
//           Object.entries(groupedSkills).map(([category, categorySkills]) => {
//             return (
//               <div key={category} className="rounded-xl border bg-card p-6">
//                 <h3 className="text-lg font-semibold mb-4 capitalize">
//                   {category.replace("_", " ")}
//                 </h3>
//                 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//                   {categorySkills.map((skill) => {
//                     const SkillIcon = Atom;
//                     return (
//                       <div
//                         key={skill._id}
//                         className="group rounded-lg border bg-background p-4 hover:shadow-md transition-all"
//                       >
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-2xl">
//                               <SkillIcon className="h-5 w-5" />
//                             </span>
//                             <h4 className="font-semibold">{skill.name}</h4>
//                           </div>
//                           <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
//                             {skill.proficiency}%
//                           </span>
//                         </div>
//                         <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
//                           {skill.description}
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleEdit(skill)}
//                             className="flex-1"
//                           >
//                             <Pencil className="h-3 w-3 mr-1" />
//                             Edit
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleDelete(skill._id)}
//                             className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </motion.div>

//       {/* Modal */}
//       <SkillFormModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         skill={editingSkill}
//         onSuccess={handleSuccess}
//       />
//     </div>
//   );
// }
