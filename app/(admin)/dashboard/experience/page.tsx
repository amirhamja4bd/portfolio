"use client";

import { ExperienceFormModal } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/contexts/auth-context";
import { experienceApi } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExperiencePage() {
  const { user, loading } = useRequireAuth();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchExperiences();
    }
  }, [user]);

  const fetchExperiences = async () => {
    try {
      setLoadingExperiences(true);
      const response = await experienceApi.getAll({ all: true });
      setExperiences(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoadingExperiences(false);
    }
  };

  const handleCreate = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (experience: any) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await experienceApi.delete(id);
      fetchExperiences();
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience");
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    fetchExperiences();
  };

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Experience
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your work history and experience
          </p>
        </div>
        <Button onClick={handleCreate} className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Experience
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
            placeholder="Search experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Experiences List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loadingExperiences ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading experiences...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No experiences found.</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add your first experience
            </Button>
          </div>
        ) : (
          filteredExperiences.map((exp) => (
            <div
              key={exp._id}
              className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{exp.position}</h3>
                  <p className="text-lg text-primary mb-2">{exp.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                    {exp.current && (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(exp)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(exp._id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{exp.description}</p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">
                    Key Achievements:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {exp.achievements
                      .slice(0, 3)
                      .map((achievement: string, idx: number) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    {exp.achievements.length > 3 && (
                      <li className="text-primary">
                        +{exp.achievements.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </motion.div>

      {/* Modal */}
      <ExperienceFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        experience={editingExperience}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
