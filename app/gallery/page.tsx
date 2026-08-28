import type { Metadata } from "next";
import { GalleryViewer } from "@/components/sections/gallery-viewer";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse Minaret Engineering project renders, site photos, and interiors."
};

export default async function GalleryPage() {
  const content = await getContent();

  return (
    <main className="bg-ink">
      <GalleryViewer gallery={content.gallery} projects={content.projects} />
    </main>
  );
}
