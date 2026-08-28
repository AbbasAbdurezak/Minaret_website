import type { Metadata } from "next";
import { SiteShell } from "@/components/ui/site-shell";
import { getContent } from "@/lib/content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: {
      default: `${content.siteConfig.name} | Real Estate Development & Engineering`,
      template: `%s | ${content.siteConfig.name}`
    },
    description: content.siteConfig.description,
    metadataBase: new URL("https://minaretrealstate.com"),
    openGraph: {
      title: content.siteConfig.name,
      description: content.siteConfig.description,
      images: ["/assets/site render (7).jpg"]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html lang="en">
      <body>
        <SiteShell siteConfig={content.siteConfig}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
