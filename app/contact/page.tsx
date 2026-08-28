import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { getContent } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Minaret Engineering for property, development, and engineering inquiries."
};

export default async function ContactPage() {
  const { siteConfig } = await getContent();

  return (
    <main className="bg-ink">
      <section className="container grid gap-10 pb-24 pt-32 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="section-title">Start the conversation.</h1>
          <p className="section-copy mt-6">
            Send a property inquiry, request a project consultation, or ask about
            partnership opportunities with Minaret Engineering.
          </p>
          <div className="mt-8 grid gap-3 text-stone/75">
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-gold" />
              {siteConfig.phonePrimary}
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-gold" />
              {siteConfig.phoneSecondary}
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-gold" />
              {siteConfig.email}
            </p>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
