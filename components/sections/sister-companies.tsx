"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Hexagon } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SisterCompany } from "@/types";

export function SisterCompanies({
  sisterCompanies
}: {
  sisterCompanies: SisterCompany[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="relative bg-mist text-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-ink/10" />
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-copper">
              Our group
            </p>
            <h2 className="mt-4 max-w-lg text-[clamp(2.25rem,5vw,5rem)] font-semibold leading-[0.94] text-ink">
              Five connected companies. One delivery standard.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-ink/62">
              Replace these placeholders with the final sister-company names,
              logos, and short descriptions when the group identity is ready.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sisterCompanies.map((company, index) => (
              <motion.article
                className="border border-ink/10 bg-white p-6 shadow-[0_24px_70px_rgba(11,13,15,0.08)]"
                key={company.name}
                initial={reducedMotion ? false : { opacity: 0, y: 36 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.65, delay: index * 0.06 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-16 w-16 place-items-center border border-ink/12 bg-mist">
                    <Hexagon size={28} className="text-copper" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/42">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.15em] text-copper">
                  {company.discipline}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-ink">
                  {company.name}
                </h3>
                <p className="mt-4 min-h-24 text-sm leading-7 text-ink/62">
                  {company.description}
                </p>
                <button
                  className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink"
                  type="button"
                >
                  Placeholder logo
                  <ArrowUpRight size={15} />
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
