# V3 actual-render QA

## Final artifact

- File: `out/FallSense_Cinematic_Intro_FINAL.mp4`.
- H.264, 1920×1080, 60/1 FPS, yuv420p, BT.709/video range.
- Exactly 2,580 decoded video frames = **43.000s** video; AAC stereo 48kHz, 43.008s container (8ms packet padding).
- H.264 CRF17 render, 2 workers, ThreeCanvas/R3F, software `swangle`. Primary `useFallback=false`: actual extruded meshes, not the 2.5D fallback.
- SHA-256: `ba7c73c2a6a74b43bd4c8af2fbee224bc953cd27bef3293586ef0b2082b0cce4`.

## Commands actually run / outcomes

```sh
npm run typecheck
node scripts/v3-review.mjs --stress
node scripts/v3-render.mjs --proof
node scripts/v3-review.mjs
node scripts/v3-render.mjs
ffmpeg -i out/v3/V3_Raw_Render.mp4 -map 0 -c copy -t 43 -movflags +faststart out/FallSense_Cinematic_Intro_FINAL.mp4
python scripts/v3-verify.py
```

- Strict TypeScript: pass in the existing checkout and in an independently extracted/installed V3-only source directory. An unused conditional after a shot revision was found and corrected before packaging.
- Initial `gl=angle` stress render failed with `THREE.WebGLRenderer: Error creating WebGL context`. Installed renderer guidance suggested software `swangle`; retry passed. No 3D fallback substituted. Failed log: `out/v3/stress.log`; successful logs: `stress-swangle.log`, `stress-final.log`, `whip-check.log`.
- Five scene stress categories rendered: shield macro; action close-up; directional whip/multi-panel scene; folding UI/mascot transformation; final title. Additional before/after match frames were inspected.
- Short motion proof: frames 100–340, 241 frames at 60 FPS (4.017s video, AAC-padded 4.075s container); macro/eye → wide arrival → gesture → close action. `out/v3/V3_Motion_Proof.mp4` rendered and representative image inspected.
- Full film render completed in **753.3s**, 2,580 frames. No render failures in full encode. Delivery was remuxed with fast-start; video packets were not re-encoded.
- FFprobe confirms actual width/height/FPS/codec/frame count/audio, not only configured composition values. Full FFmpeg decode passed without errors.
- Blackdetect applied to every decoded frame: no interval with ≥98% black pixels at threshold .02 lasting ≥16ms. Logs: `out/v3/full-decode.log`.
- Actual output sampled at 0 / 2.7 / 9.9 / 17.3 / 24.9 / 35.5 / 42.95s: nonblank pixels and distinct image content. First and end PNGs visually inspected. This is not a claim of frame-by-frame human viewing.
- Audio stream present; decoded maximum volume **-11.1dB**, not silent or clipped. Source first 43s at gain .4; fade-in 1.2s / fade-out 3s; no extra SFX or voiceover.
- Contact sheet has one reviewed frame for every final shot (30). Before/after edge and round-shape match frames reviewed. Typography/diacritics and Settings privacy mask inspected at selected frames. Last title holds 3.5s; exported matching PNG.
- Source integrity check: existing `src/video.tsx` is byte-identical to the V2 backup after excluding the two V3 imports and new composition-registration line. Other existing compositions were not rebuilt/rendered as part of V3.

## Editing and 3D evidence

30 actual shots, 29 cuts aligned to measured log-spectral-flux transients, quantified to the nearest 60fps frame. Measured pulse estimate 107.67 BPM is approximate; no invented downbeat annotations or manual listening claim. Key boundaries: .750, 1.517, 2.250, 9.700, 11.567, 19.183, 23.317, 28.683, 31.667, 34.650, 37.633 and 39.500s. Full EDL and asset/path/FOV notes: `V3_SHOT_LIST.md` / `beat-map.json`.

Original beveled ExtrudeGeometry shield, layered pearl inset, sphere eyes/glints, cheek meshes, capsule limbs, smile torus; MeshPhysicalMaterial satin/clearcoat. Frame-based turn, gesture, blink and short squash/stretch. Ambient/hemisphere/key/rim/point lighting, received contact shadow. Camera moves use eased positions/targets and quadratic Bézier arcs. UI textures are on separate thick plane meshes along one shared spatial system; Settings is masked by opaque scene geometry. Pose motif is original illustrative sphere/cylinder geometry, not a measured result. Directional blur is a brief SVG composite, not a physical shutter simulation. No physical DOF, SSS simulation or borrowed GLB is claimed.

## Limits / no false pass

Apple/YouTube pages were blocked (403) and NOT WATCHED; the user explicitly authorized proceeding from the concrete specification. No Apple footage/marks or video frames were copied. User-supplied music's public/commercial clearance remains unverified. No SFX or narration assets were provided/added. Geometric match cuts use approximate screen-space shape alignment, not an exact mesh morph. No human-verified beat/downbeat grid or continuous real-time playback/listening review was performed. Native macOS 27 was not available; QuickTime-oriented codecs and ZIP structure are verified, not OS-native execution. These limits remain explicit rather than being declared passed.

The final verified film, source, matching end PNG and Mac ZIP are published on a separate GitHub download branch after validation; `main` remains unchanged. GitHub URLs are the retrieval route because this cloud session does not provide downloadable workspace artifacts.
