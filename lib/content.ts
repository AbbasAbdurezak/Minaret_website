import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { SiteContent } from "@/types";
import { SiteContentSchema } from "./content-validation";

const contentPath = join(process.cwd(), "data", "content.json");

// In-memory cache and last-known-good store
let cachedContent: SiteContent | null = null;
let lastKnownGoodContent: SiteContent | null = null;

// Lock mechanism to prevent race conditions during concurrent file updates
let writeMutex = Promise.resolve();

export async function getContent(): Promise<SiteContent> {
  if (cachedContent) {
    return cachedContent;
  }

  try {
    const raw = await readFile(contentPath, "utf8");
    const parsed = JSON.parse(raw);
    const result = SiteContentSchema.safeParse(parsed);

    if (result.success) {
      cachedContent = result.data as SiteContent;
      lastKnownGoodContent = result.data as SiteContent;
      return cachedContent;
    } else {
      console.error("Content JSON failed validation. Issues:", result.error.format());
      if (lastKnownGoodContent) {
        console.warn("Falling back to last-known-good content in memory.");
        return lastKnownGoodContent;
      }
      // If validation fails on startup, fall back to parsed raw content to avoid outage,
      // but warn heavily.
      console.warn("No last-known-good configuration in memory. Returning parsed raw content.");
      return parsed as SiteContent;
    }
  } catch (error) {
    console.error("Failed to read or parse content file:", error);
    if (lastKnownGoodContent) {
      console.warn("Falling back to last-known-good content in memory.");
      return lastKnownGoodContent;
    }
    throw error;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  // Validate the content before attempting to write it
  const result = SiteContentSchema.safeParse(content);
  if (!result.success) {
    throw new Error("Cannot save invalid site content format.");
  }

  const validatedContent = result.data as SiteContent;

  // Add write operation to the mutex chain to avoid concurrent write corruption
  writeMutex = writeMutex.then(async () => {
    try {
      await mkdir(dirname(contentPath), { recursive: true });

      const serialized = `${JSON.stringify(validatedContent, null, 2)}\n`;
      const tempPath = `${contentPath}.${randomUUID()}.tmp`;

      // Write atomically to temp file first with read/write owner-only permissions (0o600)
      await writeFile(tempPath, serialized, { encoding: "utf8", mode: 0o600 });
      // Atomically replace the destination file
      await rename(tempPath, contentPath);

      // Update in-memory caches
      cachedContent = validatedContent;
      lastKnownGoodContent = validatedContent;
    } catch (error) {
      console.error("Atomic content write failed:", error);
      throw error;
    }
  });

  return writeMutex;
}

export async function getAssets() {
  const content = await getContent();
  return {
    images: [
      content.siteConfig.logo,
      ...content.projects.flatMap((project) => [project.image, ...project.gallery]),
      ...content.gallery.images.map((image) => image.src)
    ].filter((value, index, values) => value && values.indexOf(value) === index)
  };
}
