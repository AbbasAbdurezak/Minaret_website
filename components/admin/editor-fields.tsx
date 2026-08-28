import Image from "next/image";
import { ImagePlus, Trash2, Plus } from "lucide-react";

export function TextField({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone/70">
      {label}
      <input
        className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone/70 lg:col-span-2">
      {label}
      <textarea
        className="focus-ring min-h-32 border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone/70">
      {label}
      <input
        className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  upload,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  upload: (file: File, onUploaded: (url: string) => void) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3">
      <TextField label={label} value={value} onChange={onChange} disabled={disabled} />
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-28 overflow-hidden border border-white/10 bg-white/[0.04]">
          {value ? (
            <Image src={value} alt={label} fill sizes="112px" className="object-cover" />
          ) : null}
        </div>
        <label className="focus-ring inline-flex cursor-pointer items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition">
          <ImagePlus size={16} />
          Upload
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                upload(file, onChange);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

function updateArray<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeArray<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function ListEditor({
  label,
  values,
  onChange,
  placeholder,
  disabled = false
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 grid gap-3">
      <p className="text-sm font-semibold text-stone/70">{label}</p>
      {values.map((value, index) => (
        <div className="flex gap-2" key={`${label}-${index}`}>
          <input
            className="focus-ring min-w-0 flex-1 border border-white/10 bg-ink px-4 py-3 text-mist disabled:opacity-60"
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(updateArray(values, index, event.target.value))}
          />
          <button
            className="focus-ring border border-white/10 px-3 text-stone/70 hover:text-gold transition"
            type="button"
            disabled={disabled}
            onClick={() => onChange(removeArray(values, index))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        className="focus-ring inline-flex w-fit items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
        type="button"
        disabled={disabled}
        onClick={() => onChange([...values, ""])}
      >
        <Plus size={16} />
        Add
      </button>
    </div>
  );
}

export function ImageListEditor({
  label,
  values,
  onChange,
  upload,
  disabled = false
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  upload: (file: File, onUploaded: (url: string) => void) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 grid gap-3">
      <p className="text-sm font-semibold text-stone/70">{label}</p>
      {values.map((value, index) => (
        <ImageField
          key={`${value}-${index}`}
          label={`Image ${index + 1}`}
          value={value}
          upload={upload}
          onChange={(nextValue) => onChange(updateArray(values, index, nextValue))}
          disabled={disabled}
        />
      ))}
      <button
        className="focus-ring inline-flex w-fit items-center gap-2 border border-white/14 px-4 py-2 text-sm text-mist hover:border-gold/60 hover:text-gold transition disabled:opacity-60"
        type="button"
        disabled={disabled}
        onClick={() => onChange([...values, ""])}
      >
        <Plus size={16} />
        Add image
      </button>
    </div>
  );
}
