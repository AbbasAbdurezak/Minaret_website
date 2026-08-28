import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "@/lib/auth";

const envFile = join(process.cwd(), ".env.local");
const usernamePattern = /^[a-zA-Z0-9._-]{3,32}$/;

type ProfileUpdate = {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  cookieSecure?: boolean;
};

function publicProfile() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    cookieSecure: process.env.ADMIN_COOKIE_SECURE === "true"
  };
}

async function writeEnv(updates: Record<string, string>) {
  const raw = await readFile(envFile, "utf8").catch(() => "");
  const lines = raw.split(/\r?\n/).filter((line) => line.length > 0);
  const seen = new Set<string>();

  const next = lines.map((line) => {
    const equalsIndex = line.indexOf("=");
    const key = equalsIndex >= 0 ? line.slice(0, equalsIndex) : line;

    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      seen.add(key);
      return `${key}=${updates[key]}`;
    }

    return line;
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!seen.has(key)) {
      next.push(`${key}=${value}`);
    }
  });

  await writeFile(envFile, `${next.join("\n")}\n`, "utf8");
}

export function getAdminProfile() {
  return publicProfile();
}

export async function updateAdminProfile(update: ProfileUpdate) {
  if (process.env.NODE_ENV === "production") {
    return {
      ok: false,
      status: 403,
      error: "Profile updates are managed via deployment administration in production."
    };
  }

  const currentUsername = process.env.ADMIN_USERNAME || "admin";
  const nextUsername = (update.username || currentUsername).trim();
  const cookieSecure = Boolean(update.cookieSecure);
  const updates: Record<string, string> = {
    ADMIN_USERNAME: nextUsername,
    ADMIN_COOKIE_SECURE: String(cookieSecure)
  };
  let passwordChanged = false;

  if (!usernamePattern.test(nextUsername)) {
    return {
      ok: false,
      status: 400,
      error: "Username must be 3-32 characters and use only letters, numbers, dots, dashes, or underscores."
    };
  }

  if (nextUsername !== currentUsername) {
    updates.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");
    passwordChanged = true;
  }

  if (update.newPassword) {
    if (update.newPassword.length < 12) {
      return { ok: false, status: 400, error: "New password must be at least 12 characters." };
    }

    if (!update.currentPassword || !(await verifyPassword(currentUsername, update.currentPassword))) {
      return { ok: false, status: 403, error: "Current password is incorrect." };
    }

    updates.ADMIN_PASSWORD_HASH = await hashPassword(update.newPassword);
    updates.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");
    passwordChanged = true;
  }

  await writeEnv(updates);

  process.env.ADMIN_USERNAME = updates.ADMIN_USERNAME;
  process.env.ADMIN_COOKIE_SECURE = updates.ADMIN_COOKIE_SECURE;

  if (updates.ADMIN_PASSWORD_HASH) {
    process.env.ADMIN_PASSWORD_HASH = updates.ADMIN_PASSWORD_HASH;
  }

  if (updates.ADMIN_SESSION_SECRET) {
    process.env.ADMIN_SESSION_SECRET = updates.ADMIN_SESSION_SECRET;
  }

  return {
    ok: true,
    status: 200,
    profile: publicProfile(),
    passwordChanged
  };
}
