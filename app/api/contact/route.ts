import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { hasValidOrigin } from "@/lib/origin-check";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(2000),
  website: z.string().trim().max(100).optional() // Honeypot field
});

const messagesPath = join(process.cwd(), "data", "messages.json");

// Mutex chain to prevent race conditions when appending contact messages
let messagesMutex = Promise.resolve();

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  // Rate limit submissions to 3 inquiries per 1 hour (3600000ms)
  const rateLimit = checkRateLimit(`contact_${ip}`, 3, 3600000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many inquiries. Please try again in an hour." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data.", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, message, website } = result.data;

    // Honeypot spam check: If bot filled this field, return silent success
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // Append to messages.json atomically using write mutex
    messagesMutex = messagesMutex.then(async () => {
      try {
        await mkdir(dirname(messagesPath), { recursive: true });

        let messages: any[] = [];
        try {
          const raw = await readFile(messagesPath, "utf8");
          messages = JSON.parse(raw);
          if (!Array.isArray(messages)) {
            messages = [];
          }
        } catch {
          // File does not exist yet or has corrupt JSON
          messages = [];
        }

        const newMessage = {
          id: randomUUID(),
          name,
          phone: phone || "",
          email,
          message,
          createdAt: new Date().toISOString()
        };

        messages.push(newMessage);

        // Cap messages at 1000 items to avoid infinite disk usage growth
        if (messages.length > 1000) {
          messages = messages.slice(-1000);
        }

        const serialized = `${JSON.stringify(messages, null, 2)}\n`;
        const tempPath = `${messagesPath}.${randomUUID()}.tmp`;

        await writeFile(tempPath, serialized, { encoding: "utf8", mode: 0o600 });
        await rename(tempPath, messagesPath);
      } catch (error) {
        console.error("Atomic message persistence failed:", error);
        throw error;
      }
    });

    // Wait for the mutex lock writing to complete
    await messagesMutex;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process contact inquiry:", error);
    return NextResponse.json({ error: "Failed to process inquiry." }, { status: 400 });
  }
}
