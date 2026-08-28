import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/types";

export function SiteFooter({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] py-10">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-lg font-semibold text-mist">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-stone/70">
            {siteConfig.tagline}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Explore
          </p>
          <div className="mt-4 grid gap-2 text-sm text-stone/72">
            <Link href="/projects">Projects</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Contact
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-sm text-stone/72 transition hover:text-gold"
            href="/contact"
          >
            Start an inquiry
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
