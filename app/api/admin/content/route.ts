import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import { hasValidOrigin } from "@/lib/origin-check";
import { SiteContentSchema } from "@/lib/content-validation";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return unauthorized();
  }

  const content = await getContent();
  return NextResponse.json(content);
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
    const result = SiteContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid content payload.", details: result.error.format() },
        { status: 400 }
      );
    }

    await saveContent(result.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Content save failed:", error);
    return NextResponse.json({ error: "Failed to save content." }, { status: 400 });
  }
}
