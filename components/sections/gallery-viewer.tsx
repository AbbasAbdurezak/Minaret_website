"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { SiteContent } from "@/types";
import { cn } from "@/lib/utils";

export function GalleryViewer({
  gallery,
  projects
}: {
  gallery: SiteContent["gallery"];
  projects: SiteContent["projects"];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeImage, setActiveImage] = useState<SiteContent["gallery"]["images"][number] | null>(null);
  const projectNames = new Map(projects.map((project) => [project.slug, project.name]));
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(gallery.images.map((image) => image.category)))],
    [gallery.images]
  );
  const images = gallery.images.filter(
    (image) => activeCategory === "All" || image.category === activeCategory
  );

  return (
    <>
      <section className="container pb-24 pt-32">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Gallery</p>
            <h1 className="section-title">{gallery.title}</h1>
          </div>
          <p className="section-copy">{gallery.description}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              className={cn(
                "focus-ring border px-4 py-2 text-sm transition",
                activeCategory === category
                  ? "border-gold bg-gold text-ink"
                  : "border-white/14 text-stone/78 hover:border-gold hover:text-gold"
              )}
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <button
              className="focus-ring group relative aspect-[4/3] overflow-hidden border border-white/10 bg-white/[0.04] text-left"
              key={`${image.src}-${image.alt}`}
              type="button"
              onClick={() => setActiveImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4">
                <span className="block text-sm font-semibold text-mist">{image.alt}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-gold">
                  {image.projectSlug ? projectNames.get(image.projectSlug) : "Minaret"} | {image.category}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div className="fixed inset-0 z-[80] bg-ink/95 p-4 backdrop-blur-xl">
          <button
            className="focus-ring absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center border border-white/15 text-mist"
            type="button"
            aria-label="Close image viewer"
            onClick={() => setActiveImage(null)}
          >
            <X size={20} />
          </button>
          <div className="relative mx-auto h-full max-w-6xl">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
