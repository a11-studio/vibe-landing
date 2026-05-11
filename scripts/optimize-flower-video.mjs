#!/usr/bin/env node
// Re-encode src/assets/flower.mp4 for the ASCII footer overlay.
//
// Why these knobs:
// - Output is consumed by an ASCII grid renderer that samples a coarse mesh
//   (~14px per cell). Anything above ~640px wide is wasted detail.
// - The footer plays muted, so the audio track is dead weight.
// - Backward "ping‑pong" playback seeks via currentTime; denser keyframes
//   (short GOP) keep that scrubbing smooth even on slow CPUs.
// - +faststart moves the `moov` atom to the front, so the browser can start
//   decoding before the entire file has been downloaded.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
const input = resolve(projectRoot, "src/assets/flower.mp4");
const backup = resolve(projectRoot, "src/assets/flower.original.mp4");
const tmpOut = resolve(projectRoot, "src/assets/.flower.tmp.mp4");

if (!ffmpegPath) {
  console.error("ffmpeg-static did not provide a binary path.");
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

if (!existsSync(backup)) {
  copyFileSync(input, backup);
  console.log(`Backed up original to ${backup}`);
}

const args = [
  "-y",
  "-i", backup,
  "-an",
  "-vf", "scale=640:-2:flags=lanczos",
  "-r", "24",
  "-c:v", "libx264",
  "-profile:v", "main",
  "-level", "3.1",
  "-preset", "slow",
  "-crf", "26",
  "-pix_fmt", "yuv420p",
  "-g", "6",
  "-keyint_min", "1",
  "-sc_threshold", "0",
  "-movflags", "+faststart",
  tmpOut,
];

console.log("ffmpeg", args.join(" "));
const res = spawnSync(ffmpegPath, args, { stdio: "inherit" });
if (res.status !== 0) {
  console.error("ffmpeg exited with status", res.status);
  process.exit(res.status ?? 1);
}

copyFileSync(tmpOut, input);
const before = statSync(backup).size;
const after = statSync(input).size;
console.log(
  `Done. ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB ` +
    `(${(((before - after) / before) * 100).toFixed(1)}% smaller)`
);
