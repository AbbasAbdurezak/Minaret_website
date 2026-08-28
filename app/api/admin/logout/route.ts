import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { hasValidOrigin } from "@/lib/origin-check";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
