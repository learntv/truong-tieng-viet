import { mkdir, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";

const LOCK_DIR = "/tmp/tanstack-start-build.lock";
const STALE_MS = 5 * 60 * 1000;
const mode = process.argv[2];

async function acquireLock() {
  while (true) {
    try {
      await mkdir(LOCK_DIR);
      return;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      try {
        const info = await stat(LOCK_DIR);
        if (Date.now() - info.mtimeMs > STALE_MS) {
          await rm(LOCK_DIR, { recursive: true, force: true });
          continue;
        }
      } catch {
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

await acquireLock();

try {
  const args = ["vite", "build"];
  if (mode) args.push("--mode", mode);

  const child = spawn("bunx", args, { stdio: "inherit", shell: false });
  const code = await new Promise((resolve) => child.on("close", resolve));
  process.exitCode = code ?? 1;
} finally {
  await rm(LOCK_DIR, { recursive: true, force: true });
}