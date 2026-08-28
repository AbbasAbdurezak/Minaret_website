import { AnimatedSection } from "@/components/ui/animated-section";
import type { Testimonial } from "@/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <AnimatedSection className="bg-ink">
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title">Confidence before handover.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              className="border border-white/10 bg-white/[0.04] p-7"
              key={testimonial.name}
            >
              <blockquote className="text-xl leading-9 text-mist">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="font-semibold text-gold">{testimonial.name}</p>
                <p className="mt-1 text-sm text-stone/60">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
