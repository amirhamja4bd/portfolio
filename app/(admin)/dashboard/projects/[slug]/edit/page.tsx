"use client";

import ProjectForm from "@/components/admin/project-form";
import { useRequireAuth } from "@/contexts/auth-context";
import { projectApi } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProjectPage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [project, setProject] = useState<any | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        const res = await projectApi.getBySlug(slug);
        // API responses are wrapped with `.data.data`
        setProject(res.data || null);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoadingProject(false);
      }
    };
    fetchProject();
  }, [slug]);

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

  if (loadingProject) {
    return (
      <div className="text-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Edit Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update project details
        </p>
      </div>
      <ProjectForm
        project={project}
        onSubmit={async (data) => {
          try {
            await projectApi.update(slug || project.slug, data);
            router.push("/dashboard/projects");
          } catch (err) {
            console.error("Failed to update project", err);
            toast.error("Failed to update project");
          }
        }}
        onSuccess={() => router.push("/dashboard/projects")}
        backUrl="/dashboard/projects"
      />
    </div>
  );
}
