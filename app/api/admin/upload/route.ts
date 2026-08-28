import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { hasValidOrigin } from "@/lib/origin-check";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  if (!(await requireAdmin())) {
    return unauthorized();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file was uploaded." }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 10 MB." },
        { status: 413 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, {
      limitInputPixels: 40000000,
      failOn: "warning"
    });

    const metadata = await image.metadata();

    if (!["jpeg", "png", "webp", "gif"].includes(metadata.format ?? "")) {
      return NextResponse.json({ error: "Invalid image data." }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    const fileName = `${randomUUID()}.webp`;

    await mkdir(uploadsDir, { recursive: true });
    await image
      .rotate()
      .webp({ quality: 82 })
      .toFile(join(uploadsDir, fileName));

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Image upload/processing failed:", error);
    return NextResponse.json({ error: "Failed to process image." }, { status: 400 });
  }
}
