/**
 * Records a how-to walkthrough of the gallery reorder UI on
 * /dev/gallery-media (real ImageMediaFields + catalog photos).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "/opt/cursor/artifacts";
const VIDEO_DIR = path.join(OUT_DIR, "gallery-reorder-pw-video");
const URL = "http://localhost:3000/dev/gallery-media";

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  locale: "es-HN",
});
const page = await context.newPage();

async function pause(ms) {
  await page.waitForTimeout(ms);
}

async function shot(name) {
  const file = path.join(OUT_DIR, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("screenshot", file);
}

try {
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.getByRole("heading", { name: /Reordenar fotos/i }).waitFor();
  await pause(800);
  await shot("gallery_reorder_01_loaded.png");

  // Scroll gallery into view
  const galleryHeading = page.getByText("Galería (después de la portada)");
  await galleryHeading.scrollIntoViewIfNeeded();
  await pause(600);

  const list = page.getByRole("list", { name: "Fotos de la galería" });
  await list.waitFor();
  const rows = list.locator("li");
  const count = await rows.count();
  console.log("gallery rows", count);
  if (count < 2) throw new Error("Need at least 2 gallery photos for demo");

  // Capture first-row label before moves
  const firstUrlBefore = await rows.nth(0).locator("p").first().innerText();
  console.log("first before", firstUrlBefore.slice(0, 80));

  // 1) Move first photo down with ↓
  await rows.nth(0).getByRole("button", { name: /Bajar foto 1/i }).click();
  await pause(900);
  await shot("gallery_reorder_02_moved_down.png");

  // 2) Move current row 2 to the end with ⇊
  await rows.nth(1).getByRole("button", { name: /Mover foto 2 al final/i }).click();
  await pause(900);
  await shot("gallery_reorder_03_moved_to_end.png");

  // 3) Drag row via HTML5 DnD (source -> target)
  const source = rows.nth(0);
  const target = rows.nth(Math.min(2, count - 1));
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (sourceBox && targetBox) {
    await page.mouse.move(
      sourceBox.x + 20,
      sourceBox.y + sourceBox.height / 2,
    );
    await page.mouse.down();
    await pause(200);
    await page.mouse.move(
      targetBox.x + 40,
      targetBox.y + targetBox.height / 2,
      { steps: 12 },
    );
    await pause(200);
    await page.mouse.up();
    await pause(800);
  }
  await shot("gallery_reorder_04_after_drag.png");

  // 4) Promote a gallery photo to cover
  await rows.nth(0).scrollIntoViewIfNeeded();
  const heroBefore = await page.locator("#heroImageSrc").inputValue();
  await rows.nth(0).getByRole("button", { name: /Usar foto 1 como imagen principal/i }).click();
  await pause(1000);
  const heroAfter = await page.locator("#heroImageSrc").inputValue();
  console.log("hero changed", heroBefore.slice(0, 40) !== heroAfter.slice(0, 40));
  await page.locator("#heroImageSrc").scrollIntoViewIfNeeded();
  await pause(500);
  await shot("gallery_reorder_05_promoted_to_hero.png");

  // Scroll back to show dirty copy + submit demo
  await galleryHeading.scrollIntoViewIfNeeded();
  await pause(500);
  await page.getByRole("button", { name: /Guardar inmueble \(demo\)/i }).scrollIntoViewIfNeeded();
  await pause(400);
  page.once("dialog", async (dialog) => {
    console.log("alert preview", dialog.message().slice(0, 120));
    await dialog.accept();
  });
  await page.getByRole("button", { name: /Guardar inmueble \(demo\)/i }).click();
  await pause(800);
  await shot("gallery_reorder_06_saved_demo.png");

  console.log("demo steps completed");
} finally {
  const video = page.video();
  await context.close();
  await browser.close();
  if (video) {
    const rawPath = await video.path();
    const dest = path.join(OUT_DIR, "gallery_reorder_howto.webm");
    fs.renameSync(rawPath, dest);
    console.log("video", dest);
  }
}
