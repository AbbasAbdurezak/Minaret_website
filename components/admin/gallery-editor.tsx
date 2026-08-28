import { Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@/types";
import { TextField, TextArea, ImageField } from "./editor-fields";

function updateArray<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeArray<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function GalleryEditor({
  content,
  setContent,
  upload,
  galleryProjects,
  disabled = false
}: {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  upload: (file: File, onUploaded: (url: string) => void) => void;
  galleryProjects: Array<{ slug: string; name: string }>;
  disabled?: boolean;
}) {
  return (
    <section className="mt-8 grid gap-5">
      <TextField
        label="Gallery page title"
        value={content.gallery.title}
        disabled={disabled}
        onChange={(title) => setContent({ ...content, gallery: { ...content.gallery, title } })}
      />
      <TextArea
        label="Gallery page description"
        value={content.gallery.description}
        disabled={disabled}
        onChange={(description) =>
          setContent({ ...content, gallery: { ...content.gallery, description } })
        }
      />

      <button
        className="focus-ring inline-flex w-fit items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
        type="button"
        disabled={disabled}
        onClick={() =>
          setContent({
            ...content,
            gallery: {
              ...content.gallery,
              images: [
                ...content.gallery.images,
                { src: "/assets/site render (1).jpg", alt: "Gallery image", category: "Render" }
              ]
            }
          })
        }
      >
        <Plus size={16} />
        Add gallery item
      </button>

      <div className="grid gap-4 lg:grid-cols-2">
        {content.gallery.images.map((image, index) => (
          <article className="border border-white/10 bg-white/[0.04] p-5" key={`${image.src}-${index}`}>
            <div className="mb-4 flex justify-between">
              <p className="font-semibold text-mist">Gallery item {index + 1}</p>
              <button
                className="focus-ring text-stone/60 hover:text-gold transition disabled:opacity-60"
                type="button"
                disabled={disabled}
                onClick={() =>
                  setContent({
                    ...content,
                    gallery: {
                      ...content.gallery,
                      images: removeArray(content.gallery.images, index)
                    }
                  })
                }
              >
                <Trash2 size={18} />
              </button>
            </div>

            <ImageField
              label="Image"
              value={image.src}
              upload={upload}
              disabled={disabled}
              onChange={(src) =>
                setContent({
                  ...content,
                  gallery: {
                    ...content.gallery,
                    images: updateArray(content.gallery.images, index, { ...image, src })
                  }
                })
              }
            />

            <TextField
              label="Alt text"
              value={image.alt}
              disabled={disabled}
              onChange={(alt) =>
                setContent({
                  ...content,
                  gallery: {
                    ...content.gallery,
                    images: updateArray(content.gallery.images, index, { ...image, alt })
                  }
                })
              }
            />

            <TextField
              label="Category"
              value={image.category}
              disabled={disabled}
              onChange={(category) =>
                setContent({
                  ...content,
                  gallery: {
                    ...content.gallery,
                    images: updateArray(content.gallery.images, index, { ...image, category })
                  }
                })
              }
            />

            <label className="mt-4 grid gap-2 text-sm text-stone/70">
              Project
              <select
                className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
                value={image.projectSlug || ""}
                disabled={disabled}
                onChange={(event) =>
                  setContent({
                    ...content,
                    gallery: {
                      ...content.gallery,
                      images: updateArray(content.gallery.images, index, {
                        ...image,
                        projectSlug: event.target.value || undefined
                      })
                    }
                  })
                }
              >
                <option value="">No project</option>
                {galleryProjects.map((project) => (
                  <option key={project.slug} value={project.slug}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
