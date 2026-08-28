import type { SiteContent } from "@/types";

export type AdminProfile = {
  username: string;
  cookieSecure: boolean;
};

export async function saveContentApi(content: SiteContent): Promise<boolean> {
  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });

  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`Content save failed: Status ${response.status}`);
  }

  return response.ok;
}

export async function uploadImageApi(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);

  const response = await fetch("/api/admin/upload", { method: "POST", body });

  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Unauthorized");
  }

  const payload = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error || `Upload failed: Status ${response.status}`);
  }

  return payload.url;
}

export type ProfileUpdateResult = {
  profile: AdminProfile;
  passwordChanged: boolean;
};

export async function saveProfileApi(
  username: string,
  cookieSecure: boolean,
  currentPassword?: string,
  newPassword?: string
): Promise<ProfileUpdateResult> {
  const response = await fetch("/api/admin/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      cookieSecure,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined
    })
  });

  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Unauthorized");
  }

  const payload = (await response.json()) as {
    profile?: AdminProfile;
    passwordChanged?: boolean;
    error?: string;
  };

  if (!response.ok || !payload.profile) {
    throw new Error(payload.error || "Profile save failed");
  }

  return {
    profile: payload.profile,
    passwordChanged: !!payload.passwordChanged
  };
}

export async function logoutApi(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}
