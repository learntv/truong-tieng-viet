// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // UI strings only (messages/*.json). The Vietnamese being taught is never a message.
  // Locale lives in a cookie, read on the server by the middleware in src/server.ts.
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "baseLocale"],
    }),
  ],
  vite: {
    server: {
      watch: {
        // The CMS is its own Next.js app in this repo. Watched from here, its dev server's
        // constant rewrites of cms/.next (thousands of files per compile) each fire an event,
        // and the config's awaitWriteFinish polls every one of them every 100ms, which pegged
        // the CPU whenever both dev servers ran. Nothing in src/ imports from cms/.
        // Anchored to the repo root: a bare "**/supabase/**" would also catch
        // src/integrations/supabase.
        ignored: ["cms", ".output", "supabase", "openspec"].map(
          (dir) => `${fileURLToPath(new URL(`./${dir}`, import.meta.url))}/**`,
        ),
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
