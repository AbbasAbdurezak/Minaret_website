"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { SiteFooter } from "@/components/ui/site-footer";
import type { SiteConfig } from "@/types";

export function SiteShell({
  children,
  siteConfig
}: {
  children: React.ReactNode;
  siteConfig: SiteConfig;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="site-shell">
      {!isAdminRoute ? <Navigation siteConfig={siteConfig} /> : null}
      {children}
      {!isAdminRoute ? <SiteFooter siteConfig={siteConfig} /> : null}
    </div>
  );
}
