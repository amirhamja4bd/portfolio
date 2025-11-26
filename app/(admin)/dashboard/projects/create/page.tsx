"use client";

import ProjectForm from "@/components/admin/project-form";
import { useRequireAuth } from "@/contexts/auth-context";
import { projectApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Create Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new portfolio project
        </p>
      </div>
      <ProjectForm
        onSubmit={async (data) => {
          toast.success("Creating project...");
          try {
            await projectApi.create(data);
            router.push("/dashboard/projects");
          } catch (err) {
            console.error("Failed to create project", err);
            toast.error("Failed to create project");
          }
        }}
        onSuccess={() => router.push("/dashboard/projects")}
        backUrl="/dashboard/projects"
      />
    </div>
  );
}
