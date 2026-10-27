# FallSense V4 — motion audit

## Scope and actual machine

User directly requested an animation upgrade **and a new PowerPoint**. That direct request overrides the attached prompt's no-PPT restriction; only the new editable PPTX was created. Original source PPTX files and existing app/deck source were preserved. Existing V3 MP4 and source are available; no reconstruction from an unprovided source is claimed.

Runtime observed: Linux x86_64, Node 24.19.0, Remotion/@remotion/three 4.0.373, R3F 9.1.2, Three 0.176.0, FFmpeg 7.1.5. Machine reported 33GiB RAM / about 30GiB available and 29GiB free disk at inspection. These are cloud figures, **not Mac M2 specifications**. `sw_vers` is not available here. Native macOS 27, GPU-core count, thermals, Metal and VideoToolbox were not verified. Mac diagnostic scripts are supplied to measure the user's actual device; no hardware-acceleration claim is made.

## Input decode / timestamps

V3 input: H.264 1920×1080, yuv420p BT.709, 60 FPS, 2580 video frames / 43.000s; AAC stereo 48kHz, container 43.008s. Full decode/framemd5 passed. Best-effort timestamps were strictly monotonic, spacing 0.016665999999997183–0.016667000000005316s (ordinary rounding around 1/60s). No exact repeated decoded-content run ≥12 frames was found; lossy compression means that result alone does not prove smooth motion. A source hold is not a dropped-frame report. No real Mac QuickTime playback trace was provided; player-specific cause is not diagnosed.

## Source-timestamped findings

| Time / frame | Severity | Evidence and interpretation | Implemented fix |
|---|---|---|---|
| 0.750 / 45, 1.517 / 91, 2.250 / 135 | Medium | V3 intentional macro/wide edit cuts change camera pose in one frame. This is editorial discontinuity, not decoder corruption. It may feel too abrupt for the requested softer V4. | Continuous global camera curve through macro, eyes and reveal |
| 19.183 / 1151 | High for a continuous runway | Previous camera ends near a settled view; next starts at a new x/z pose. Page motion starts with nonzero cubic ease-out derivative after a hold. | Shared page-index curve, zero endpoint velocity/acceleration; camera is not reset per shot |
| 23.317 / 1399, 25.700 / 1542, 28.683 / 1721 | High for a continuous runway | Same camera reset / ease-out start pattern around new UI arrivals | One 3D plane system and global C2 travel |
| 33.150 / 1989, 34.650 / 2079 | Medium | V3 purposeful shape/scale match edits jump viewpoint. Not proven a rendering bug. | Spatial pose thread, fold and mascot return without abrupt scene mount/camera relocation |
| Eyelid windows around 1.75s / 6.17s / 35.58s | Low | V3 Boolean scale/glint visibility changes are abrupt source decisions | Smooth Gaussian eyelid closure; glint geometry remains mounted and scales continuously |
| Whole 43s | Risk, not proven failure | Thin planes/edges and moving texture minification can shimmer; 60fps alone cannot exclude it | MSAA, trilinear mipmaps, anisotropy 8, conservative viewpoint changes, no full-canvas blur resets |

## Quantified source-space trajectories

These numbers are **world-space source metrics**, not perceptual smoothness percentages or app performance metrics. V3 contains deliberate hard cuts; comparing maxima reflects that editorial change as well as animation continuity.

| Metric | V3 | V4 |
|---|---:|---:|
| Max camera position step (units/frame) | 7.614607 | 0.082139 |
| Max camera discrete change in velocity | 7.629379 | 0.002107 |
| Max normalized page-index change in velocity | 0.03895657 | 0.00046008 |

Global quintic position tracks have matched zero velocity/acceleration at holds; camera quaternion slerp uses the same smooth remap. The UI chapter adds a bounded slow orbit with vanishing boundary derivatives. This creates deliberate pauses, not an arbitrary demand for constant camera motion. Full metrics and high-step boundary list: `v4/trajectory-metrics.json`.

## Actual repeated-render tests

V3 and V4 frames **650, 1100, 1900, 2150** were rendered forward at concurrency 1, then in reverse order in concurrent batches of 2, PNG at 960×540. Every selected pair was **pixel-identical**, mean/max delta 0.0 / 0; tolerance was set at MAE ≤0.05 to permit minor subpixel effects if they occurred, but none did. This is evidence for those frames/settings only, not all GPU backends or native M2. It does not identify nondeterminism as the cause of the prior appearance.

## Visual review / A–B limits

A/B filenames were masked; contact strips use identical global timestamps 16.867, 17.767, 18.767, 19.767s and a 19.0–19.3s boundary neighborhood. Before revealing the mapping, A showed a more abrupt change in camera framing between 19.107 and 19.197s; B retained gradual framing. Revealed mapping: {"A": "previous", "B": "new"}. Internal reviewer familiarity with previous designs can unblind the content, so this is **not an independent blinded user study**. Panel timing differs by editorial design; no claim is made that both versions show identical UI state at every timestamp. Source metrics and deterministic image capture provide additional evidence. Actual clips: `out/v4/V3_Matched_Proof.mp4`, `V4_Motion_Proof.mp4`; visual strip `AB_Comparison.jpg`.

Full V4 review checks: 18 hero/scene samples, plus ±6 frames around 21 editorial/keyframe boundaries. Those images are inspected for layout/geometry loading, and final MP4 decoding checks are reported separately in `render_validation.md`. No real-time full-film human playback/listening claim is made.

## Technical tradeoffs

One persistent ThreeCanvas; original extruded shield with memoized bevel geometry, soft PBR/clearcoat, layered light and 1024px shadow map. Five actual JPGs remain loaded on scene-space meshes, with a Settings privacy mask. Persistent meshes avoid mount/pop across chapters. Pose tube geometry is built once, not per frame. No dynamic render-target resize, no SSAO/SSR/DOF, no random/time-based animation, no hardware encoding mixed with CRF. Native-resolution 1080p MSAA is used instead of costly 4K supersampling. Primary is genuine 3D; V3's opt-in 2.5D source remains available as an explicit fallback, not silently used in V4.

References blocked earlier were not retried or described as watched. Technical implementation was based on installed package declarations/source. Music is the supplied first 43s, gain .4 with fades; unchanged source hash and measured transients appear in `v4/music-timing.json`. No new medical, accuracy, classifier or emergency-call claims.
