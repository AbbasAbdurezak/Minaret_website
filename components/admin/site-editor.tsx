import type { SiteContent } from "@/types";
import { TextField, TextArea, ImageField } from "./editor-fields";

export function SiteEditor({
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
    <section className="mt-8 grid gap-4 lg:grid-cols-2">
      <TextField
        label="Company name"
        value={content.siteConfig.name}
        disabled={disabled}
        onChange={(name) => setContent({ ...content, siteConfig: { ...content.siteConfig, name } })}
      />
      <TextField
        label="Tagline"
        value={content.siteConfig.tagline}
        disabled={disabled}
        onChange={(tagline) => setContent({ ...content, siteConfig: { ...content.siteConfig, tagline } })}
      />
      <TextArea
        label="Company description"
        value={content.siteConfig.description}
        disabled={disabled}
        onChange={(description) =>
          setContent({ ...content, siteConfig: { ...content.siteConfig, description } })
        }
      />
      <ImageField
        label="Logo"
        value={content.siteConfig.logo}
        upload={upload}
        disabled={disabled}
        onChange={(logo) => setContent({ ...content, siteConfig: { ...content.siteConfig, logo } })}
      />
      <TextField
        label="Primary phone"
        value={content.siteConfig.phonePrimary}
        disabled={disabled}
        onChange={(phonePrimary) =>
          setContent({ ...content, siteConfig: { ...content.siteConfig, phonePrimary } })
        }
      />
      <TextField
        label="Secondary phone"
        value={content.siteConfig.phoneSecondary}
        disabled={disabled}
        onChange={(phoneSecondary) =>
          setContent({ ...content, siteConfig: { ...content.siteConfig, phoneSecondary } })
        }
      />
      <TextField
        label="Email"
        value={content.siteConfig.email}
        disabled={disabled}
        onChange={(email) => setContent({ ...content, siteConfig: { ...content.siteConfig, email } })}
      />
    </section>
  );
}
