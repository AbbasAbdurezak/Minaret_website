"use client";

import { motion, useReducedMotion } from "framer-motion";

export function StatsBand({
  stats
}: {
  stats: {
    label: string;
    value: string;
  }[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-y border-white/10 bg-mist text-ink">
      <div className="container grid grid-cols-2 gap-px md:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            className="py-8 md:py-10"
            key={item.label}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <p className="text-4xl font-semibold md:text-5xl">{item.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-ink/55">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
