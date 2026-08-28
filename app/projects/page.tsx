import type { Metadata } from "next";
import { ProjectsDirectory } from "@/components/sections/projects-directory";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse Minaret Engineering projects, apartment plans, specs, and gallery previews."
};

export default async function ProjectsPage() {
  const content = await getContent();

  return (
    <main className="bg-ink">
      <ProjectsDirectory
        apartmentTypes={content.apartmentTypes}
        projects={content.projects}
      />
    </main>
  );
}
