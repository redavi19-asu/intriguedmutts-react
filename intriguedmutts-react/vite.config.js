import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const packageInfo = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

export default defineConfig({
  base: "./",
  plugins: [react(), {
    name: "release-manifest",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "release.json", source: JSON.stringify({
        version: packageInfo.version, commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
      }) });
    },
  }],
});
