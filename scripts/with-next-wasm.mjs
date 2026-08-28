import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const command = process.argv[2] || "dev";
const args = process.argv.slice(3);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBinary = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

process.env.NEXT_TEST_WASM_DIR = join(
  root,
  "node_modules",
  "@next",
  "swc-wasm-nodejs"
);

const child = spawn(nextBinary, [command, ...args], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
