import fs from "node:fs";
import path from "node:path";

const webRoot = path.resolve(import.meta.dirname, "..");
const workRoot = path.resolve(webRoot, "..", "work");

const mediaDir = path.join(webRoot, "public", "media");
const voicesDir = path.join(webRoot, "public", "voices");
const dataDir = path.join(webRoot, "src", "data");

fs.mkdirSync(mediaDir, { recursive: true });
fs.mkdirSync(voicesDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

// 1. Copy visual plates
for (const file of ["film-start.webp", "film-pump.webp", "film-end.webp"]) {
  fs.copyFileSync(path.join(workRoot, file), path.join(mediaDir, file));
}

// 2. Copy all MP3 narrations
const voiceFiles = fs
  .readdirSync(path.join(workRoot, "voices"))
  .filter((name) => name.endsWith(".mp3"));
for (const file of voiceFiles) {
  fs.copyFileSync(
    path.join(workRoot, "voices", file),
    path.join(voicesDir, file),
  );
}

// 3. Extract embedded Ankara schematic base WebP from work/atlas.js
const atlasSrc = fs.readFileSync(path.join(workRoot, "atlas.js"), "utf8");
const atlasMatch = atlasSrc.match(
  /baseImage\.src\s*=\s*"data:image\/webp;base64,([^"]+)"/,
);
if (!atlasMatch) {
  throw new Error("Could not locate baseImage WebP in work/atlas.js");
}
fs.writeFileSync(
  path.join(mediaDir, "ankara-atlas.webp"),
  Buffer.from(atlasMatch[1], "base64"),
);

// 4. Extract baked storm surface data from work/front.js
const frontSrc = fs.readFileSync(path.join(workRoot, "front.js"), "utf8");
const surfaceMatch = frontSrc.match(/const packedSurface\s*=\s*'([^']+)';/);
const lengthsMatch = frontSrc.match(
  /const groupLengths\s*=\s*\[([^\]]+)\];/,
);
if (!surfaceMatch || !lengthsMatch) {
  throw new Error("Could not locate packedSurface or groupLengths in work/front.js");
}

const stormTs = `// Extracted from work/front.js baked storm particle surface (read-only mirror)
export const PACKED_STORM_B64 = "${surfaceMatch[1]}";
export const STORM_GROUP_LENGTHS = [${lengthsMatch[1]}] as const;
`;
fs.writeFileSync(path.join(dataDir, "storm-surface.ts"), stormTs, "utf8");

// 5. Verify extraction counts
console.log(
  JSON.stringify({
    media: fs.readdirSync(mediaDir),
    voicesCount: fs.readdirSync(voicesDir).length,
    stormB64Length: surfaceMatch[1].length,
  }),
);
