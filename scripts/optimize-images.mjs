/**
 * Converts heavy PNG/JPG assets to WebP for production performance.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../src");

/**
 * Each entry:  { src: relative-to-src, quality }
 * Output is placed beside the source with .webp extension.
 */
const IMAGES = [
  // ── Hero / backgrounds ──────────────────────────────────────────────────
  { src: "imports/image.png",       quality: 80 }, // 4.18 MB → hero bg + competitor texture
  { src: "imports/blur.png",        quality: 75 }, // 862 KB  → headline blur overlay

  // ── Hero team profile ────────────────────────────────────────────────────
  { src: "imports/MainContainer/ecc192fa4213baaac273888921a1551274ec058a.png", quality: 82 },

  // ── ASCII canvas mask ─────────────────────────────────────────────────────
  { src: "imports/widget4.png",     quality: 80 }, // 229 KB

  // ── Projects section ──────────────────────────────────────────────────────
  { src: "assets/banner.png",       quality: 82 }, // 667 KB  metric card bg
  { src: "assets/rege.png",         quality: 82 }, // 1.03 MB
  { src: "assets/selfcheck.png",    quality: 82 }, // 458 KB
  { src: "assets/d0cc88609464830db5a519803d66b943f3a8741e.png", quality: 80 }, // 3.95 MB Silencio
  { src: "assets/e456a14899251227c4ec37785838c3ea552f7971.png", quality: 82 }, // 695 KB Realitiez
  { src: "assets/ccbe4b5cf5687edf1efe0a848055c6d13b9a393f.png", quality: 80 }, // 1.23 MB AccuWeather
  { src: "assets/5befbd932cd55a328c20d0b015fe5afc87e4ad6f.png", quality: 80 }, // 2.34 MB Spotify

  // ── About / Team section ──────────────────────────────────────────────────
  { src: "imports/MainContainer-2/d3cc047f1a595cb3f0387d0955e6730e6c665758.png", quality: 82 }, // 867 KB
  { src: "imports/MainContainer-2/c6085f260fd9c0ba4788039a74aabfe2a7c5edce.png", quality: 82 }, // 958 KB
  { src: "imports/MainContainer-2/99e69596bfd47f32feaf8f5fa9b959e58b0a5201.png", quality: 82 }, // 347 KB
  { src: "imports/MainContainer-2/7cdfc9cdb7fbe3d70aa2bee8d0424356fd95b0d6.png", quality: 82 }, // 1.02 MB
  { src: "imports/MainContainer-2/99cf73b51a4c59b3d9120e0891819b22ba7a2ac9.png", quality: 80 }, // 3.63 MB
];

let totalSavedBytes = 0;

for (const { src, quality } of IMAGES) {
  const inputPath  = path.join(SRC, src);
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");

  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠  SKIP (not found): ${src}`);
    continue;
  }

  const inputSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .webp({ quality, effort: 6 })
    .toFile(outputPath);

  const outputSize = fs.statSync(outputPath).size;
  const saved = inputSize - outputSize;
  totalSavedBytes += saved;

  const pct = Math.round((saved / inputSize) * 100);
  console.log(
    `✓  ${src.padEnd(72)} ${kb(inputSize).padStart(8)} → ${kb(outputSize).padStart(8)}  (−${pct}%)`
  );
}

console.log(`\nTotal saved: ${mb(totalSavedBytes)}`);

function kb(bytes) { return `${Math.round(bytes / 1024)} KB`; }
function mb(bytes) { return `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
