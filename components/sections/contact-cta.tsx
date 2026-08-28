import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import type { SiteConfig } from "@/types";

export function ContactCta({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section className="bg-gold py-16 text-ink">
      <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/55">
            Begin your inquiry
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Discuss a project, apartment plan, or partnership opportunity.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link
            className="focus-ring inline-flex h-13 items-center justify-center gap-2 bg-ink px-6 text-sm font-semibold text-mist"
            href="/contact"
          >
            Send inquiry
            <ArrowUpRight size={17} />
          </Link>
          <Link
            className="focus-ring inline-flex h-13 items-center justify-center gap-2 border border-ink/25 px-6 text-sm font-semibold text-ink"
            href={`tel:${siteConfig.phonePrimary}`}
          >
            <Phone size={17} />
            {siteConfig.phonePrimary}
          </Link>
        </div>
      </div>
    </section>
  );
}
