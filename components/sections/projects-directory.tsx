"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import type { ApartmentType, Project, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const filters: Array<ProjectStatus | "All"> = ["All", "Finishing", "Ongoing", "Planning"];

export function ProjectsDirectory({
  projects,
  apartmentTypes
}: {
  projects: Project[];
  apartmentTypes: ApartmentType[];
}) {
  const [active, setActive] = useState<ProjectStatus | "All">("All");
  const visibleProjects = useMemo(
    () => projects.filter((project) => active === "All" || project.status === active),
    [active]
  );

  return (
    <div className="container pb-24 pt-32">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="eyebrow">Projects / Properties</p>
          <h1 className="section-title">Filterable project portfolio.</h1>
        </div>
        <p className="section-copy">
          Browse current Minaret developments, apartment plan types, status,
          core specs, and gallery-ready visuals from the existing asset library.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm text-stone/70">
          <SlidersHorizontal size={16} className="text-gold" />
          Filter
        </span>
        {filters.map((filter) => (
          <button
            className={cn(
              "focus-ring border px-4 py-2 text-sm transition",
              active === filter
                ? "border-gold bg-gold text-ink"
                : "border-white/14 text-stone/78 hover:border-gold hover:text-gold"
            )}
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <article
            className="overflow-hidden border border-white/10 bg-white/[0.04]"
            id={project.slug}
            key={project.slug}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={project.image}
                alt={`${project.name} project`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-semibold text-mist">{project.name}</h2>
                <span className="border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gold">
                  {project.status}
                </span>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-stone/62">
                <MapPin size={15} />
                {project.location}
              </p>
              <p className="mt-5 text-sm leading-7 text-stone/72">{project.summary}</p>
              <div className="mt-6 grid gap-3">
                {project.specs.map((spec) => (
                  <div
                    className="flex justify-between border-t border-white/10 pt-3 text-sm"
                    key={spec.label}
                  >
                    <span className="text-stone/55">{spec.label}</span>
                    <span className="text-mist">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {project.gallery.map((image) => (
                  <div className="relative aspect-square overflow-hidden" key={image}>
                    <Image
                      src={image}
                      alt={`${project.name} gallery preview`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-14 border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-semibold text-mist">Apartment plans</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {apartmentTypes.map((plan) => (
            <article className="border border-white/10 p-5" key={plan.name}>
              <p className="text-xl font-semibold text-mist">{plan.name}</p>
              <p className="mt-2 text-sm text-gold">{plan.totalArea}</p>
              <p className="mt-2 text-sm text-stone/60">
                {plan.locations.join(", ")} | {plan.status}
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-stone/72">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
