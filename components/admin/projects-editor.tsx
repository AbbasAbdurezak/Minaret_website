import { Plus, Trash2 } from "lucide-react";
import type { ProjectStatus, SiteContent } from "@/types";
import { TextField, TextArea, ImageField, ListEditor, ImageListEditor } from "./editor-fields";

const statuses: ProjectStatus[] = ["Planning", "Ongoing", "Finishing"];

const emptyProject = {
  slug: "new-project",
  name: "New Project",
  location: "Addis Ababa, Ethiopia",
  status: "Planning" as ProjectStatus,
  image: "/assets/site render (1).jpg",
  summary: "Short project summary.",
  specs: [{ label: "Project type", value: "Residential development" }],
  gallery: []
};

function updateArray<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeArray<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function ProjectsEditor({
  content,
  setContent,
  upload,
  disabled = false
}: {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  upload: (file: File, onUploaded: (url: string) => void) => void;
  disabled?: boolean;
}) {
  return (
    <section className="mt-8 grid gap-5">
      <button
        className="focus-ring inline-flex w-fit items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
        type="button"
        disabled={disabled}
        onClick={() =>
          setContent({
            ...content,
            projects: [
              ...content.projects,
              { ...emptyProject, slug: `project-${Date.now()}` }
            ]
          })
        }
      >
        <Plus size={16} />
        Add project
      </button>

      {content.projects.map((project, index) => (
        <article className="border border-white/10 bg-white/[0.04] p-5" key={project.slug}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-mist">{project.name}</h2>
            <button
              className="focus-ring text-stone/60 hover:text-gold transition disabled:opacity-60"
              type="button"
              disabled={disabled}
              onClick={() => setContent({ ...content, projects: removeArray(content.projects, index) })}
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <TextField
              label="Slug"
              value={project.slug}
              disabled={disabled}
              onChange={(slug) =>
                setContent({
                  ...content,
                  projects: updateArray(content.projects, index, { ...project, slug })
                })
              }
            />
            <TextField
              label="Name"
              value={project.name}
              disabled={disabled}
              onChange={(name) =>
                setContent({
                  ...content,
                  projects: updateArray(content.projects, index, { ...project, name })
                })
              }
            />
            <TextField
              label="Location"
              value={project.location}
              disabled={disabled}
              onChange={(location) =>
                setContent({
                  ...content,
                  projects: updateArray(content.projects, index, { ...project, location })
                })
              }
            />
            <label className="grid gap-2 text-sm text-stone/70">
              Status
              <select
                className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
                value={project.status}
                disabled={disabled}
                onChange={(event) =>
                  setContent({
                    ...content,
                    projects: updateArray(content.projects, index, {
                      ...project,
                      status: event.target.value as ProjectStatus
                    })
                  })
                }
              >
                {statuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <TextArea
              label="Summary"
              value={project.summary}
              disabled={disabled}
              onChange={(summary) =>
                setContent({
                  ...content,
                  projects: updateArray(content.projects, index, { ...project, summary })
                })
              }
            />
            <ImageField
              label="Main image"
              value={project.image}
              upload={upload}
              disabled={disabled}
              onChange={(image) =>
                setContent({
                  ...content,
                  projects: updateArray(content.projects, index, { ...project, image })
                })
              }
            />
          </div>

          <ListEditor
            label="Specs"
            values={project.specs.map((spec) => `${spec.label}: ${spec.value}`)}
            placeholder="Label: Value"
            disabled={disabled}
            onChange={(values) =>
              setContent({
                ...content,
                projects: updateArray(content.projects, index, {
                  ...project,
                  specs: values.map((value) => {
                    const [label, ...rest] = value.split(":");
                    return {
                      label: label.trim() || "Spec",
                      value: rest.join(":").trim() || "Value"
                    };
                  })
                })
              })
            }
          />

          <ImageListEditor
            label="Project gallery images"
            values={project.gallery}
            upload={upload}
            disabled={disabled}
            onChange={(gallery) =>
              setContent({
                ...content,
                projects: updateArray(content.projects, index, { ...project, gallery })
              })
            }
          />
        </article>
      ))}
    </section>
  );
}
