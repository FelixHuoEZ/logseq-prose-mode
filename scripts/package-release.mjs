import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const distDir = path.join(rootDir, "dist");
const releaseDir = path.join(rootDir, "release");
const zipPath = path.join(rootDir, "logseq-prose-mode.zip");

if (!existsSync(distDir)) {
  throw new Error("Missing dist/. Run `npm run build` before packaging a release.");
}

rmSync(releaseDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(releaseDir, { recursive: true });

cpSync(distDir, path.join(releaseDir, "dist"), { recursive: true });

for (const filename of ["package.json", "README.md", "LICENSE", "icon.png"]) {
  cpSync(path.join(rootDir, filename), path.join(releaseDir, filename));
}

execFileSync("zip", ["-r", zipPath, "."], {
  cwd: releaseDir,
  stdio: "inherit",
});
