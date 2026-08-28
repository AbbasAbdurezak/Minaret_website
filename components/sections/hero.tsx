"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Building2 } from "lucide-react";
import type { SiteConfig } from "@/types";

/**
 * Hero Section - 3D Parallax Entrance
 * 
 * Features:
 * - Multi-layer parallax background with depth-based scrolling
 * - Staggered text animations for visual hierarchy
 * - Responsive design with reduced motion support
 */
export function Hero({ siteConfig }: { siteConfig: SiteConfig }) {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Parallax transforms for 3D depth effect
  const imageY = useTransform(scrollY, [0, 800], [0, reducedMotion ? 0 : 120]);
  const textY = useTransform(scrollY, [0, 700], [0, reducedMotion ? 0 : -50]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section className="relative min-h-[92svh] overflow-hidden pt-20">
      {/* Background Layer - Parallax depth layer */}
      <motion.div 
        className="absolute inset-0 depth-bg" 
        style={{ y: imageY }}
      >
        <Image
          src="/assets/site render (7).jpg"
          alt="Luxury architectural render by Minaret Engineering"
          fill
          sizes="100vw"
          className="scale-105 object-cover"
          priority
        />
      </motion.div>
      
      {/* Gradient Overlays - Create depth and readability */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.94)_0%,rgba(8,9,11,0.64)_46%,rgba(8,9,11,0.18)_100%)]"
        style={{ opacity: heroOpacity }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.1)_0%,rgba(8,9,11,0.22)_58%,#0b0d0f_100%)]" />

      {/* Foreground Content Layer */}
      <motion.div
        className="container relative z-10 flex min-h-[calc(92svh-80px)] items-center depth-fg"
        style={{ y: textY }}
      >
        <div className="max-w-4xl py-20">
          {/* Eyebrow Badge - Animated entrance */}
          <motion.div
            className="mb-7 inline-flex items-center gap-3 border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone backdrop-blur-xl"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Building2 size={16} className="text-gold" />
            Real Estate Development + Engineering
          </motion.div>

          {/* Main Headline - Primary focal point */}
          <motion.h1
            className="max-w-5xl text-[clamp(3.2rem,10vw,8.6rem)] font-semibold leading-[0.86] tracking-0 text-mist"
            initial={reducedMotion ? false : { opacity: 0, y: 34 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.name}
          </motion.h1>

          {/* Tagline - Supporting message */}
          <motion.p
            className="mt-8 max-w-2xl text-lg leading-8 text-stone/82 md:text-xl"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {siteConfig.tagline} Premium homes shaped by disciplined engineering,
            transparent delivery, and a lasting sense of place.
          </motion.p>

          {/* CTA Buttons - Conversion actions */}
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              className="focus-ring inline-flex h-13 items-center justify-center gap-2 bg-gold px-6 text-sm font-semibold text-ink transition hover:bg-mist"
              href="/projects"
            >
              View Projects
              <ArrowUpRight size={18} />
            </Link>
            <Link
              className="focus-ring inline-flex h-13 items-center justify-center gap-2 border border-white/18 px-6 text-sm font-semibold text-mist transition hover:border-gold hover:text-gold"
              href="/contact"
            >
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Navigation hint */}
      <div className="container relative z-10 -mt-20 pb-8">
        <a
          className="focus-ring inline-flex items-center gap-2 text-sm text-stone/70 transition hover:text-gold"
          href="#featured-projects"
        >
          Scroll to explore
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
