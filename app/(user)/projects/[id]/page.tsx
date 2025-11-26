import ProjectDetailClient from "@/components/projects/ProjectDetailClient";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <ProjectDetailClient slug={id} />
    </div>
  );
}
