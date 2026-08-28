import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteConfig } from "@/types";

export function AboutPreview({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <AnimatedSection className="bg-[#101216]">
      <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative min-h-[520px] overflow-hidden border border-white/10">
          <Image
            src="/assets/site photo (23).jpg"
            alt="Minaret Engineering site progress"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.05),rgba(8,9,11,0.55))]" />
        </div>
        <div>
          <p className="eyebrow">About Minaret</p>
          <h2 className="section-title">Trust, honesty, accountability, reliability.</h2>
          <p className="section-copy mt-6">
            {siteConfig.description} The company combines local delivery
            experience with modern planning and construction practices, keeping
            clients informed from early inquiry through handover.
          </p>
          <Link
            className="focus-ring mt-8 inline-flex h-12 items-center gap-2 border border-white/15 px-5 text-sm font-semibold text-mist transition hover:border-gold hover:text-gold"
            href="/about"
          >
            Read company story
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
