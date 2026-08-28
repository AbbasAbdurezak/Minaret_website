import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Future articles, construction updates, investment notes, and project stories."
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const content = await getContent();

  return (
    <main className="bg-ink">
      <section className="container pb-24 pt-32">
        <p className="eyebrow">Blog</p>
        <h1 className="section-title max-w-4xl">Editorial space for updates and market insight.</h1>
        <div className="mt-12 grid gap-4">
          {content.blogPosts.map((post) => (
            <article className="border border-white/10 bg-white/[0.04] p-6" key={post.title}>
              <p className="text-xl font-semibold text-mist">{post.title}</p>
              <p className="mt-3 text-sm text-stone/62">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
