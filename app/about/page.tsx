import type { Metadata } from "next";
import { AboutPreview } from "@/components/sections/about-preview";
import { SisterCompanies } from "@/components/sections/sister-companies";
import { siteConfig } from "@/data/site";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description
};

export default async function AboutPage() {
  const content = await getContent();

  return (
    <main className="bg-ink pt-20">
      <section className="container py-20">
        <p className="eyebrow">About us</p>
        <h1 className="section-title max-w-5xl">
          Engineering-led development for homes that hold their value.
        </h1>
        <p className="section-copy mt-7 max-w-3xl">{content.siteConfig.description}</p>
      </section>
      <AboutPreview siteConfig={content.siteConfig} />
      <SisterCompanies sisterCompanies={content.sisterCompanies} />
    </main>
  );
}
