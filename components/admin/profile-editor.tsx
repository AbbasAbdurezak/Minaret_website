import { Save, ShieldCheck } from "lucide-react";
import { TextField, PasswordField } from "./editor-fields";
import type { AdminProfile } from "./admin-api";

export function ProfileEditor({
  profile,
  setProfile,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  saveProfile,
  disabled = false
}: {
  profile: AdminProfile;
  setProfile: (profile: AdminProfile) => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  saveProfile: () => void;
  disabled?: boolean;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const effectiveDisabled = disabled || isProduction;

  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
            <ShieldCheck size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-mist">Admin profile</h2>
            <p className="text-sm text-stone/65">Manage the login used for the hidden admin URL.</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-stone/70">
          Password changes require the current password, use a salted scrypt hash, and rotate the
          session secret so existing sessions are logged out.
        </p>
        {isProduction ? (
          <div className="mt-5 border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200 leading-6">
            <strong>Production Deployment Notice:</strong>
            <br />
            Profile credentials writing is disabled in production to guarantee read-only deployment
            safety. Please configure admin variables inside your server's secure configuration file
            (e.g., <code className="text-gold">/etc/minaret/minaret.env</code>).
          </div>
        ) : null}
      </article>

      <article className="grid gap-4 border border-white/10 bg-white/[0.04] p-5">
        <TextField
          label="Admin username"
          value={profile.username}
          disabled={effectiveDisabled}
          onChange={(username) => setProfile({ ...profile, username })}
        />

        <PasswordField
          label="Current password"
          value={currentPassword}
          disabled={effectiveDisabled}
          onChange={setCurrentPassword}
        />
        <PasswordField
          label="New password"
          value={newPassword}
          disabled={effectiveDisabled}
          onChange={setNewPassword}
        />
        <PasswordField
          label="Confirm new password"
          value={confirmPassword}
          disabled={effectiveDisabled}
          onChange={setConfirmPassword}
        />

        <label className="flex items-start gap-3 border border-white/10 bg-ink p-4 text-sm text-stone/70">
          <input
            className="mt-1 accent-gold"
            type="checkbox"
            checked={profile.cookieSecure}
            disabled={effectiveDisabled}
            onChange={(event) => setProfile({ ...profile, cookieSecure: event.target.checked })}
          />
          <span>
            <span className="block font-semibold text-mist">Require HTTPS secure cookie</span>
            <span className="block leading-6">
              Keep this off for local 127.0.0.1 testing. Turn it on when the site is deployed on
              HTTPS.
            </span>
          </span>
        </label>

        <button
          className="focus-ring inline-flex w-fit items-center gap-2 bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60 hover:bg-gold/90 transition"
          type="button"
          disabled={effectiveDisabled}
          onClick={saveProfile}
        >
          <Save size={16} />
          {disabled ? "Saving" : "Save profile"}
        </button>
      </article>
    </section>
  );
}
