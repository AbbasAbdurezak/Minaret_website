"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { Project } from "@/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="bg-ink" delay={0.05}>
      <div className="container" id="featured-projects">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="eyebrow">Featured projects</p>
            <h2 className="section-title">Addresses built with discipline.</h2>
          </div>
          <p className="section-copy">
            Existing Minaret projects from the previous site are carried into the
            new experience with cleaner presentation, stronger conversion paths,
            and CMS-ready content.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              className="group relative min-h-[520px] overflow-hidden border border-white/10 bg-coal"
              key={project.slug}
              initial={reducedMotion ? false : { opacity: 0, y: 38 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              whileHover={reducedMotion ? undefined : { y: -8 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
            >
              <Image
                src={project.image}
                alt={`${project.name} project render`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.05)_0%,rgba(8,9,11,0.42)_45%,rgba(8,9,11,0.94)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-4 inline-flex items-center gap-2 bg-ink/72 px-3 py-2 text-xs uppercase tracking-[0.14em] text-stone backdrop-blur-xl">
                  <MapPin size={14} className="text-gold" />
                  {project.location}
                </div>
                <h3 className="text-3xl font-semibold text-mist">{project.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-stone/78">
                  {project.summary}
                </p>
                <div className="mt-5 grid gap-2">
                  {project.specs.slice(0, 2).map((spec) => (
                    <div
                      className="flex items-center justify-between border-t border-white/12 pt-2 text-sm"
                      key={spec.label}
                    >
                      <span className="text-stone/60">{spec.label}</span>
                      <span className="text-mist">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold"
                  href={`/projects#${project.slug}`}
                >
                  Explore project
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
