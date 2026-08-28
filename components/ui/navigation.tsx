"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export function Navigation({ siteConfig }: { siteConfig: SiteConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-ink/72 backdrop-blur-2xl">
      <nav className="container flex h-20 items-center justify-between">
        <Link className="focus-ring flex items-center gap-3" href="/">
          <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-white">
            <Image
              src={siteConfig.logo}
              alt="Minaret Engineering logo"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-mist">
              Minaret
            </span>
            <span className="block text-xs text-stone/70">Engineering</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              className="focus-ring text-sm text-stone/78 transition hover:text-gold"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-mist transition hover:border-gold/60 hover:text-gold"
            href={`tel:${siteConfig.phonePrimary}`}
          >
            <Phone size={16} />
            {siteConfig.phonePrimary}
          </Link>
        </div>

        <button
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-mist lg:hidden"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="container flex flex-col gap-2 border-t border-white/10 py-4">
            {links.map((link) => (
              <Link
                className="focus-ring rounded-md px-2 py-3 text-sm text-stone/80"
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
