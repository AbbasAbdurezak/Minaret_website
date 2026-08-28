import type { Metadata } from "next";
import { DraftingCompass, HardHat, Home, Landmark } from "lucide-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Engineering and real estate development services from Minaret Engineering."
};

export const dynamic = "force-dynamic";

const icons = [Landmark, HardHat, Home, DraftingCompass];

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <main className="bg-ink">
      <section className="container pb-24 pt-32">
        <p className="eyebrow">Services</p>
        <h1 className="section-title max-w-5xl">
          Engineering discipline for every development phase.
        </h1>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {content.services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article className="border border-white/10 bg-white/[0.04] p-7" key={service.title}>
                <Icon className="text-gold" size={34} />
                <h2 className="mt-8 text-2xl font-semibold text-mist">{service.title}</h2>
                <p className="mt-4 text-sm leading-7 text-stone/70">{service.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
