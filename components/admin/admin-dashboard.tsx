"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import type { ProjectStatus, SiteContent } from "@/types";
import { cn } from "@/lib/utils";
import {
  saveContentApi,
  uploadImageApi,
  saveProfileApi,
  logoutApi,
  type AdminProfile
} from "./admin-api";
import { SiteEditor } from "./site-editor";
import { ProjectsEditor } from "./projects-editor";
import { GalleryEditor } from "./gallery-editor";
import { ProfileEditor } from "./profile-editor";
import { TextField, TextArea } from "./editor-fields";

type Tab = "site" | "projects" | "gallery" | "group" | "sections" | "profile";

function updateArray<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeArray<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("site");
  const [status, setStatus] = useState("Loading content...");
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<AdminProfile>({ username: "admin", cookieSecure: false });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "site", label: "Site Text" },
    { id: "projects", label: "Projects" },
    { id: "gallery", label: "Gallery" },
    { id: "group", label: "Our Group" },
    { id: "sections", label: "Sections" },
    { id: "profile", label: "Profile" }
  ];

  useEffect(() => {
    fetch("/api/admin/content")
      .then((response) => {
        if (response.status === 401) {
          window.location.assign("/admin/login");
          return null;
        }
        return response.json();
      })
      .then((data: SiteContent | null) => {
        if (data) {
          setContent(data);
          setStatus("Loaded editable website content.");
        }
      })
      .catch(() => setStatus("Could not load content."));

    fetch("/api/admin/profile")
      .then((response) => {
        if (response.status === 401) {
          return null;
        }
        return response.json();
      })
      .then((data: AdminProfile | null) => {
        if (data) {
          setProfile(data);
        }
      })
      .catch(() => setStatus("Content loaded, but profile settings could not be loaded."));
  }, []);

  const galleryProjects = useMemo(
    () => content?.projects.map((project) => ({ slug: project.slug, name: project.name })) ?? [],
    [content?.projects]
  );

  async function save() {
    if (!content) return;
    setSaving(true);
    setStatus("Saving changes...");

    try {
      const ok = await saveContentApi(content);
      setStatus(
        ok ? "Saved. Refresh the public site or pages to see changes." : "Save failed."
      );
    } catch (error: any) {
      console.error(error);
      setStatus(error.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File, onUploaded: (url: string) => void) {
    setStatus("Uploading image...");
    try {
      const url = await uploadImageApi(file);
      onUploaded(url);
      setStatus(`Uploaded image path: ${url}`);
    } catch (error: any) {
      console.error(error);
      setStatus(error.message || "Image upload failed.");
    }
  }

  async function logout() {
    setStatus("Logging out...");
    try {
      await logoutApi();
    } catch (error: any) {
      console.error(error);
      setStatus(error.message || "Logout failed.");
    }
  }

  async function saveProfile() {
    if (newPassword && newPassword !== confirmPassword) {
      setStatus("New password and confirmation do not match.");
      return;
    }

    setProfileSaving(true);
    setStatus("Saving admin profile...");

    try {
      const result = await saveProfileApi(
        profile.username,
        profile.cookieSecure,
        currentPassword || undefined,
        newPassword || undefined
      );

      setProfile(result.profile);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (result.passwordChanged) {
        setStatus("Profile saved and sessions invalidated. Log in again with your new password.");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1200);
      } else {
        setStatus("Profile saved.");
      }
    } catch (error: any) {
      console.error(error);
      setStatus(error.message || "Profile save failed.");
    } finally {
      setProfileSaving(false);
    }
  }

  if (!content) {
    return (
      <main className="container min-h-screen pt-32">
        <p className="section-copy">{status}</p>
      </main>
    );
  }

  return (
    <main className="bg-ink">
      <section className="container pb-24 pt-32">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="eyebrow">Admin backend</p>
            <h1 className="section-title">Website control room.</h1>
          </div>
          <div className="glass-panel p-5">
            <p className="text-sm leading-7 text-stone/75">
              Edit text, replace image paths, upload new images, manage projects, and maintain the
              public gallery. Changes are saved to
              <span className="text-gold"> data/content.json</span>.
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-stone/60">{status}</p>
              <div className="flex items-center gap-3">
                <button
                  className="focus-ring inline-flex items-center gap-2 bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60 transition hover:bg-gold/90"
                  type="button"
                  disabled={saving}
                  onClick={save}
                >
                  <Save size={16} />
                  {saving ? "Saving" : "Save"}
                </button>
                <button
                  className="focus-ring inline-flex items-center gap-2 border border-white/14 px-4 py-2 text-sm font-semibold text-mist hover:border-gold/60 hover:text-gold transition"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {tabs.map((item) => (
            <button
              className={cn(
                "focus-ring border px-4 py-2 text-sm transition",
                tab === item.id
                  ? "border-gold bg-gold text-ink"
                  : "border-white/14 text-stone/78 hover:border-gold hover:text-gold"
              )}
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "site" ? (
          <SiteEditor
            content={content}
            setContent={setContent}
            upload={upload}
            disabled={saving}
          />
        ) : null}

        {tab === "projects" ? (
          <ProjectsEditor
            content={content}
            setContent={setContent}
            upload={upload}
            disabled={saving}
          />
        ) : null}

        {tab === "gallery" ? (
          <GalleryEditor
            content={content}
            setContent={setContent}
            upload={upload}
            galleryProjects={galleryProjects}
            disabled={saving}
          />
        ) : null}

        {tab === "group" ? (
          <section className="mt-8 grid gap-5">
            <button
              className="focus-ring inline-flex w-fit items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
              type="button"
              disabled={saving}
              onClick={() =>
                setContent({
                  ...content,
                  sisterCompanies: [
                    ...content.sisterCompanies,
                    {
                      name: `Sister Company ${content.sisterCompanies.length + 1}`,
                      discipline: "Company discipline",
                      description: "Short company description."
                    }
                  ]
                })
              }
            >
              <Plus size={16} />
              Add sister company
            </button>

            <div className="grid gap-4 lg:grid-cols-2">
              {content.sisterCompanies.map((company, index) => (
                <article className="border border-white/10 bg-white/[0.04] p-5" key={index}>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-mist">
                      {company.name || `Sister Company ${index + 1}`}
                    </h2>
                    <button
                      className="focus-ring text-stone/60 hover:text-gold transition disabled:opacity-60"
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        setContent({
                          ...content,
                          sisterCompanies: removeArray(content.sisterCompanies, index)
                        })
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <TextField
                    label="Name"
                    value={company.name}
                    disabled={saving}
                    onChange={(name) =>
                      setContent({
                        ...content,
                        sisterCompanies: updateArray(content.sisterCompanies, index, {
                          ...company,
                          name
                        })
                      })
                    }
                  />
                  <TextField
                    label="Discipline"
                    value={company.discipline}
                    disabled={saving}
                    onChange={(discipline) =>
                      setContent({
                        ...content,
                        sisterCompanies: updateArray(content.sisterCompanies, index, {
                          ...company,
                          discipline
                        })
                      })
                    }
                  />
                  <TextArea
                    label="Description"
                    value={company.description}
                    disabled={saving}
                    onChange={(description) =>
                      setContent({
                        ...content,
                        sisterCompanies: updateArray(content.sisterCompanies, index, {
                          ...company,
                          description
                        })
                      })
                    }
                  />
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "sections" ? (
          <section className="mt-8 grid gap-6">
            <EditablePairs
              addLabel="Add stat"
              description="Homepage counters"
              items={content.stats}
              disabled={saving}
              onChange={(stats) => setContent({ ...content, stats })}
            />

            <EditableCards
              addLabel="Add testimonial"
              description="Testimonials"
              items={content.testimonials.map((testimonial) => ({
                title: testimonial.name,
                body: testimonial.quote,
                meta: testimonial.role
              }))}
              labels={{ title: "Name", body: "Quote", meta: "Role" }}
              disabled={saving}
              onChange={(items) =>
                setContent({
                  ...content,
                  testimonials: items.map((item) => ({
                    name: item.title,
                    quote: item.body,
                    role: item.meta
                  }))
                })
              }
            />

            <EditableCards
              addLabel="Add service"
              description="Services page"
              items={content.services.map((service) => ({
                title: service.title,
                body: service.body,
                meta: ""
              }))}
              labels={{ title: "Service title", body: "Description", meta: "Unused" }}
              disabled={saving}
              onChange={(items) =>
                setContent({
                  ...content,
                  services: items.map((item) => ({
                    title: item.title,
                    body: item.body
                  }))
                })
              }
            />

            <EditableCards
              addLabel="Add blog item"
              description="Blog page"
              items={content.blogPosts.map((post) => ({
                title: post.title,
                body: post.excerpt,
                meta: ""
              }))}
              labels={{ title: "Post title", body: "Excerpt", meta: "Unused" }}
              disabled={saving}
              onChange={(items) =>
                setContent({
                  ...content,
                  blogPosts: items.map((item) => ({
                    title: item.title,
                    excerpt: item.body
                  }))
                })
              }
            />
          </section>
        ) : null}

        {tab === "profile" ? (
          <ProfileEditor
            profile={profile}
            setProfile={setProfile}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            saveProfile={saveProfile}
            disabled={profileSaving}
          />
        ) : null}
      </section>
    </main>
  );
}

function EditablePairs({
  addLabel,
  description,
  items,
  onChange,
  disabled = false
}: {
  addLabel: string;
  description: string;
  items: { label: string; value: string }[];
  onChange: (items: { label: string; value: string }[]) => void;
  disabled?: boolean;
}) {
  return (
    <article className="border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-mist">{description}</h2>
        <button
          className="focus-ring inline-flex items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
          type="button"
          disabled={disabled}
          onClick={() => onChange([...items, { label: "Label", value: "0" }])}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" key={index}>
            <input
              className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
              value={item.label}
              disabled={disabled}
              onChange={(event) =>
                onChange(updateArray(items, index, { ...item, label: event.target.value }))
              }
            />
            <input
              className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
              value={item.value}
              disabled={disabled}
              onChange={(event) =>
                onChange(updateArray(items, index, { ...item, value: event.target.value }))
              }
            />
            <button
              className="focus-ring border border-white/10 px-3 text-stone/70 hover:text-gold transition disabled:opacity-60"
              type="button"
              disabled={disabled}
              onClick={() => onChange(removeArray(items, index))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

type CardItem = { title: string; body: string; meta: string };

function EditableCards({
  addLabel,
  description,
  items,
  labels,
  onChange,
  disabled = false
}: {
  addLabel: string;
  description: string;
  items: CardItem[];
  labels: { title: string; body: string; meta: string };
  onChange: (items: CardItem[]) => void;
  disabled?: boolean;
}) {
  return (
    <article className="border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-mist">{description}</h2>
        <button
          className="focus-ring inline-flex items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
          type="button"
          disabled={disabled}
          onClick={() => onChange([...items, { title: "New item", body: "Description", meta: "" }])}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <div className="border border-white/10 p-4 bg-ink/30" key={index}>
            <div className="mb-4 flex justify-end">
              <button
                className="focus-ring text-stone/60 hover:text-gold transition disabled:opacity-60"
                type="button"
                disabled={disabled}
                onClick={() => onChange(removeArray(items, index))}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <TextField
              label={labels.title}
              value={item.title}
              disabled={disabled}
              onChange={(title) => onChange(updateArray(items, index, { ...item, title }))}
            />
            <TextArea
              label={labels.body}
              value={item.body}
              disabled={disabled}
              onChange={(body) => onChange(updateArray(items, index, { ...item, body }))}
            />
            {labels.meta !== "Unused" ? (
              <TextField
                label={labels.meta}
                value={item.meta}
                disabled={disabled}
                onChange={(meta) => onChange(updateArray(items, index, { ...item, meta }))}
              />
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
