# FallSense V4 — actual export validation

## Delivered video

`out/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4`

- Actual stream: H.264, 1920×1080, 60/1 FPS, yuv420p, BT.709/video range.
- Exactly 2,580 decoded frames, **43.000000s** video. Container 43.008000s (AAC packet padding).
- Audio: AAC, 48000Hz, 2 channels; decoded peak -11.1dB. Not silent or clipped. Existing soundtrack first 43s, gain .4, 1.2s / 3s fades; no invented narration/SFX.
- Render completed with 2 workers / software WebGL `swangle`, CRF17 software H.264 in **760.3s**. No encoder hardware-acceleration/CRF conflict.
- Final stream-copy remux enabled fast-start and trimmed packet tail; no video re-encoding in delivery remux.
- Full decode: passed. Blackdetect on every frame: no ≥98%-black interval at threshold .02 lasting ≥16ms.
- Video timestamps: 2,580 strictly increasing samples; spacing 0.016665999999997183–0.016667000000005316s around 1/60s. No packet-time drop anomaly detected. This does not prove subjective smoothness on every player.
- Actual output samples at 0, 2.7, 9.9, 17.3, 24.9, 35.5 and 42.95s passed nonblank/variation checks. End PNG exported. Full human real-time playback or listening is not claimed.
- SHA-256: `730e3ba4854372144f62b7219b1a126af5e270b4ab9a1111dbb7358afd44b7f4`.

Commands actually used:

```sh
node scripts/v4-determinism.mjs
node scripts/v4-review.mjs
node scripts/v4-render.mjs --proof
node scripts/v4-boundaries.mjs
node scripts/v4-render.mjs
ffmpeg -i out/v4/Render_Raw.mp4 -map 0 -c copy -t 43 -movflags +faststart out/FallSense_Cinematic_Intro_V4_Smooth3D_1080p60.mp4
python scripts/v4-verify.py
```

Short proof covered frames 1006–1246 (241 frames / 4.017s video, about 4.075s AAC-padded container), around the UI runway. 18 scene/hero samples plus ±6-frame neighborhoods around 21 boundaries were rendered and visually inspected. Both V3 and V4 selected-frame determinism tests were pixel-identical across forward/concurrency1 vs reverse/concurrency2. Full details and scope limits: `motion_audit.md` and `v4/*.json`.

Recovery preview: `node scripts/v4-fallback-proof.mjs` rendered a separate explicit 2.5D fallback frame successfully. **The final film does not use that fallback.** Geometry, position, eyelids, camera quaternion, FOV, textures, shadows and typography use frame-derived state; no live clocks / useFrame / random production animation. No expensive physical DOF or shutter sampling is claimed. ProRes was not produced; the tested H.264 delivery is supplied.

## Editable PowerPoint

`out/FallSense_Academic_13_Slides_Editable.pptx`

- 13 slides, 13 notes pages and click-advance native Fade transitions. Native editable text, vectors/connectors and one editable table; one supplied real Live Monitor image is embedded with editable callouts.
- ZIP integrity and native slide/notes count passed. Weighted features sum 1.00; hypothetical example recalculates to .521.
- Text geometry bounds check found no out-of-page text. Table body font is ≥15pt, other primary copy mostly 17–32pt, cover 62pt; source footnotes 10pt. No claim of exhaustive PowerPoint layout-engine text-fit proof is made.
- LibreOffice opened the deck and exported a **13-page PDF**. All slide previews/contact sheet reviewed; no visible clipping found at inspected preview scale. Final notes/core-metadata-only edits preserved identical slide XML to that rendered preview.
- The two original PPTX files match their preserved source hashes. The new deck does not overwrite them.
- The photo's .60 marker versus the document's .68 threshold is explicitly noted as unresolved in speaker notes. No source-app/email/clinical effectiveness verification was invented.
- PowerPoint SHA-256: `5fb218f8b599ad0ada161c1658fc7383c39d1d377a8802d11399f662719b329b`.

The user directly requested a PPTX; that instruction takes precedence over the attached V4 no-PPT scope. Only the new deck was created; original slide sources/app code were not changed.

## Mac / delivery limits

Cloud OS is Linux x86_64; actual macOS 27/M2 configuration and native PowerPoint/QuickTime playback were **not** tested. Codec/ZIP structure, Linux decode, LibreOffice PDF rendering and source checks are verified. Mac diagnostic / launch scripts are provided. User-supplied soundtrack public/commercial clearance remains unverified; no Apple footage or uncaptured reference observations were used.

The verified video, PPTX, PDF preview, source and reports are delivered on a separate GitHub branch. Root `main` stays unchanged. GitHub download links are used because workspace artifact downloads failed in this client earlier. Source commit is identified in the delivery reply after the remote ref is verified.
