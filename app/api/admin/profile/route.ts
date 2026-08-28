import { NextResponse } from "next/server";
import { getAdminProfile, updateAdminProfile } from "@/lib/admin-profile";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { hasValidOrigin } from "@/lib/origin-check";

export async function GET() {
  if (!(await requireAdmin())) {
    return unauthorized();
  }

  return NextResponse.json(getAdminProfile());
}

export async function PUT(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  if (!(await requireAdmin())) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const result = await updateAdminProfile(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      profile: result.profile,
      passwordChanged: result.passwordChanged
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
  }
}
