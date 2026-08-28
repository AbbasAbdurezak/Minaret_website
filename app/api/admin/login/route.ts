import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // Rate limit login attempts to 5 requests per 5 minutes (300000ms)
  const rateLimit = checkRateLimit(`login_${ip}`, 5, 300000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password || !(await verifyPassword(username, password))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, createSessionToken(username));
  return response;
}
