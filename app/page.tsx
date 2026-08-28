import { AboutPreview } from "@/components/sections/about-preview";
import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { SisterCompanies } from "@/components/sections/sister-companies";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * Home Page - 3D Scroll Experience
 * 
 * This page implements a 3D scroll-based navigation experience where each
 * section transitions with depth and perspective effects. The layout is
 * organized into distinct semantic sections for maintainability.
 */
export default async function HomePage() {
  const content = await getContent();

  return (
    <main className="scene-container">
      {/* 
        Scroll Wrapper: Contains all sections with 3D transform context
        Each section below can have different depth layers for parallax
      */}
      <div className="scroll-wrapper">
        {/* Section 1: Hero - Full viewport entrance */}
        <Hero siteConfig={content.siteConfig} />
        
        {/* Section 2: Stats Band - Quick info strip */}
        <StatsBand stats={content.stats} />
        
        {/* Section 3: Featured Projects - Main content showcase */}
        <FeaturedProjects projects={content.projects} />
        
        {/* Section 4: Sister Companies - Partnership display */}
        <SisterCompanies sisterCompanies={content.sisterCompanies} />
        
        {/* Section 5: About Preview - Company introduction */}
        <AboutPreview siteConfig={content.siteConfig} />
        
        {/* Section 6: Testimonials - Social proof */}
        <Testimonials testimonials={content.testimonials} />
        
        {/* Section 7: Contact CTA - Final conversion point */}
        <ContactCta siteConfig={content.siteConfig} />
      </div>
    </main>
  );
}
