import { AboutPreview } from "@/components/sections/about-preview";
import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { SisterCompanies } from "@/components/sections/sister-companies";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();

  return (
    <main>
      <Hero siteConfig={content.siteConfig} />
      <StatsBand stats={content.stats} />
      <FeaturedProjects projects={content.projects} />
      <SisterCompanies sisterCompanies={content.sisterCompanies} />
      <AboutPreview siteConfig={content.siteConfig} />
      <Testimonials testimonials={content.testimonials} />
      <ContactCta siteConfig={content.siteConfig} />
    </main>
  );
}
