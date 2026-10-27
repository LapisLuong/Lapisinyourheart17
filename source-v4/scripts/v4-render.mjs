import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderMedia,
} from "@remotion/renderer";
import { resolveBrowser } from "./browser.mjs";
import { mkdir } from "node:fs/promises";
const proof = process.argv.includes("--proof");
const serveUrl = await bundle({ entryPoint: "src/v4/index.tsx" });
const browser = await openBrowser("chrome", {
  browserExecutable: resolveBrowser(),
  chromiumOptions: { gl: process.env.V4_GL || "swangle" },
});
const output = proof
  ? "out/v4/V4_Motion_Proof.mp4"
  : "out/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4";
await mkdir("out/v3", { recursive: true });
try {
  const composition = await selectComposition({
    serveUrl,
    id: "FallSenseCinematicIntroV4",
    puppeteerInstance: browser,
  });
  const start = performance.now();
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    puppeteerInstance: browser,
    outputLocation: output,
    codec: "h264",
    crf: 17,
    pixelFormat: "yuv420p",
    colorSpace: "bt709",
    concurrency: Number(process.env.V4_CONCURRENCY || 2),
    frameRange: proof ? [1006, 1246] : undefined,
    scale: proof ? 0.5 : 1,
    onProgress: (p) => {
      const n = Math.floor(p.progress * 20);
      if (n !== last) {
        console.log(
          `V4 ${proof ? "proof" : "final"} ${n * 5}% | frames ${p.renderedFrames} | elapsed ${((performance.now() - start) / 1000).toFixed(1)}s`,
        );
        last = n;
      }
    },
  });
  console.log("Rendered " + output);
} finally {
  await browser.close({ silent: true });
}
