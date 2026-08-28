import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const scrypt = promisify(scryptCallback);
const cookieName = "minaret_admin_session";
const maxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  user: string;
  exp: number;
  nonce: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set to a strong random value.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function useSecureCookie() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  return process.env.ADMIN_COOKIE_SECURE === "true";
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): SessionPayload | null {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expected = sign(body);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export async function verifyPassword(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (username !== expectedUser || !passwordHash) {
    return false;
  }

  const [algorithm, salt, hash] = passwordHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    throw new Error("ADMIN_PASSWORD_HASH must use the format scrypt:salt:hash.");
  }

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export function createSessionToken(username: string) {
  return encode({
    user: username,
    exp: Date.now() + maxAgeSeconds * 1000,
    nonce: randomBytes(16).toString("hex")
  });
}

export async function getAdminSession() {
  const token = (await cookies()).get(cookieName)?.value;
  return token ? decode(token) : null;
}

export async function requireAdmin() {
  return Boolean(await getAdminSession());
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie(),
    path: "/",
    maxAge: maxAgeSeconds
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie(),
    path: "/",
    maxAge: 0
  });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
