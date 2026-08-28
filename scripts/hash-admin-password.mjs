import { randomBytes, scrypt } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error("Usage: node scripts/hash-admin-password.mjs \"your-strong-password\"");
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");

scrypt(password, salt, 64, (error, derivedKey) => {
  if (error) {
    throw error;
  }

  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${derivedKey.toString("hex")}`);
  console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
});
