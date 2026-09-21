# Hero Lodestar — source-based particle recreation

> Workspace cleanup (2026-09-18): the local `artifacts/lodestar-source-port/`
> screenshots were removed. Image filenames below record the historical QA run;
> source references, implementation details, and attribution remain applicable.

## Scope and result

User requested a redo focused on the hero particles, then explicitly requested source-code reuse. This supersedes the previous from-scratch implementation and QA claims.

Source: https://www.ricardochance.com/
Local preview: http://127.0.0.1:5175/preview/hero-lodestar
Scope: first-screen WebGL layer only. Existing demo typography, copy, brand, frame, buttons and layout are intentionally retained. No secondary routes, contact form, tracking, or deployment were copied.

## Source evidence

- Public bundle: https://www.ricardochance.com/_next/static/chunks/1g7zs99-fkzkz.js
- Source configuration: https://www.ricardochance.com/_next/static/chunks/0xgpw45d9mec1.js
- Graphics profiles: https://www.ricardochance.com/_next/static/chunks/012l1t63a3b_-.js
- Mesh: 66 vertices, 120 triangles; sampled by triangle surface area.
- Orthographic camera Z 800; shape scale 0.48 / 2.55; viewport fill 0.68.
- High profile: 4,000 shape particles, 10,000 background particles, 40% twinkling, intensity 3.5.
- Original point-size, depth-opacity, core/halo fragment shaders and #58467b particle color retained.
- Original WebGL parent opacity: 0.6.
- Original idle wander offset is zero. No automatic spin, breathing or click pulse.
- Mouse tilt uses quaternion look direction (0.58), response speed 9; local repulsion radius 78, force 34, return speed 5.2.

## Visual evidence and normalization

Evidence directory: /Users/liaomeirong/dev/blocks/artifacts/lodestar-source-port/

- Desktop: source-desktop.png, local-desktop.png, compare-desktop.png.
- Focused particle crop: compare-particle-detail.png.
- Pointer over headline: source-hover.png, local-hover.png, compare-hover.png.
- Narrow viewport: source-mobile.png, local-mobile.png, compare-mobile.png.
- Normal high-density rendering: local-retina.png.

Desktop CSS viewport: 1440 × 900, DPR 1. Browser returned the source image at 1425 × 891 and local at 1440 × 900. Source was normalized to 1440 × 900 before paired comparison. The source has a 15 px scrollbar; its centered object is therefore 7.5 px left of the scrollbar-free local object. Focus crops compensate for that offset.

Narrow CSS viewport: 390 × 844, DPR 1. Source capture 375 × 812, local 390 × 844; source normalized to the CSS size before comparison. This is responsive desktop-browser testing, not physical mobile hardware or coarse-pointer emulation.

High-density local check: 1280 × 720 CSS, DPR 2, actual canvas 2560 × 1440. The source point shader sizes are in physical pixels, so the higher-density display resolves the porous granular form more clearly; at DPR 1, overlapping points are visibly denser in both source and port.

All source/local image pairs were viewed together, including the focused particle crop. Animation phase and individual random sample positions are not synchronized.

## Comparison history

1. Previous build: guessed polar volume, over 11,000 points, continuous rotation, breathing and click pulse. Rejected by user.
2. Replaced geometry/shaders/parameters with source-based implementation; initial visual check found overbright particles and background.
3. Inspected source canvas ancestors: its complete WebGL layer has opacity 0.6. Applied this value and removed the previous extra CSS glow.
4. Matched canvas DPR on resize, recaptured desktop and narrow states, normalized source image sizes, and compared the particle region again.
5. Final comparison: four cusps, concave silhouette, depth, point sizes, additive lavender highlights and pointer tilt match the source's construction. Source random sampling and capture timing account for the remaining per-point differences.

## Required fidelity surfaces

- Fonts/typography: unchanged Instrument Serif and Red Hat Display demo styling; not claimed to be a new literal copy of source text.
- Spacing/layout: unchanged from the existing block; the new star is centered and sized from the source formula. No horizontal overflow at 390 × 844.
- Colors/tokens: original shader colors and 60% WebGL-layer opacity; no extra synthetic CSS aura.
- Image quality: original mesh and procedural GLSL, not a screenshot or hand-drawn approximation. No image assets required.
- Copy/content: existing Aster / Studio demo text intentionally retained for this particle-only redo.

## Verification

- Desktop resting and headline-pointer tilt states compared in a real in-app browser.
- Responsive 390 × 844 screenshot checked for complete silhouette and no horizontal overflow.
- Normal DPR 2 rendering inspected.
- A single canvas remains after reload/HMR. No local-origin WebGL/runtime warnings or errors observed; source-site warnings retained in a reused browser tab are unrelated.
- Targeted TypeScript and ESLint checks pass.
- Full registry generation, shadcn build and Vite production build pass. Existing repository large-bundle advisory remains.
- The generated hero-lodestar item includes all four TSX/TS/CSS files and the three dependency.
- Visibility/intersection pausing, complete disposal, and reduced-motion freeze implemented. Reduced-motion OS emulation and physical low-tier devices were not browser-tested.

## Residual differences / P3

- The source's background-only postprocessing Bloom pass is not bundled. Original background/point/trail GLSL is used, but peripheral star halos can differ slightly. The foreground star is rendered after bloom in the original and is unaffected by this omission.
- Entrance uses the original per-particle dissolve mapping inside the existing demo loader timing, not the source's full page-transition framework.
- Frame/copy/menu and CTA destinations remain those of the existing demo, outside this particle redo.

## Attribution

Source GLSL and mesh data are attributed to Ricardo Chance in lodestar-source.ts. Public availability does not grant a license. Redistribution/commercial use of those third-party portions requires appropriate permission. This is not a claim that the copied portions are original MIT-licensed work.

final result: passed
