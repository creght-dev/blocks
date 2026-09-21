> Workspace cleanup (2026-09-18): local screenshot, source-capture, comparison,
> and prototype directories were removed. Paths below are historical QA records;
> their referenced images may no longer exist locally. Source URLs, findings,
> and implementation notes are retained for maintenance.
> Follow-up cleanup (2026-09-19): historical screenshots under `docs/*-evidence/`
> and `docs/*-qa/`, unused local asset copies, and unselected local cover variants
> were also removed. Current local runtime assets and CDN mappings are retained.

**Design QA — 3D Split Effect**

**Comparison Target**

- Source URL: `https://3d-split.learnframer.site/`
- Source visual truth for the desktop animation:
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/source-desktop-top.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/source-desktop-image.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/source-desktop-split.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/source-desktop-cards.png`
- The original mobile captures remain historical reference only. Mobile behavior now intentionally diverges from the source in favor of a readable sticky-card stack.
- Rendered implementation: `http://127.0.0.1:4173/preview/3d-split`
- Desktop implementation screenshots:
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/implementation-desktop-0.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/implementation-desktop-1800.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/implementation-desktop-3600.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/implementation-desktop-4200.png`
  - `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/implementation-desktop-end.png`

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px, `1440 × 900` PNG px, device scale factor `1`.
- Responsive behavior was verified at `390 × 844`; desktop behavior was rechecked at `1440 × 900`.
- Images were compared without density scaling. Browser chrome was excluded; the page viewport was captured directly.
- Desktop states compared: initial scroll prompt, intact image, three-way split, flipped card state, and final message. Mobile states checked: default content face, two-card stack, three-card stack, and exit into the ending section.

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/compare-desktop-top.png`
- `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/compare-desktop-image.png`
- `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/compare-desktop-split.png`
- `/Users/liaomeirong/dev/blocks/docs/3d-split-evidence/compare-desktop-cards.png`

**Focused Region Comparison Evidence**

- The desktop split comparison checks image crop continuity, panel width, 30 px split spacing, corner radii, heading baseline, and sticky-stage placement.
- The desktop card comparison checks 300 × 400 card geometry, ±12° side-card rotations, gradients, text baselines, icon placement, and perspective.
- On viewports below `1024px`, the source-style horizontal split is replaced by a native sticky stack. Cards start on their content face and progressively cover each other while retaining visible top edges.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: Instrument Serif regular/italic and Inter are local source-matched assets. The final heading measures `468.09 px` versus the source `467.73 px`; the `0.36 px` difference is accepted as P3 rasterization variance.
- Spacing and layout rhythm: the intact image differs by less than `1 px`; the split panels and gaps match measured source geometry. The ending scroll extent differs by `1 px` (`5895` vs `5896`) and is accepted as P3 viewport rounding.
- Colors and visual tokens: background, card gradients, foreground colors, muted text, borders, and shadows match the source palette.
- Image quality and asset fidelity: the source AVIF is copied locally and remains sharp at every state. The source trend and sparkle SVGs are copied locally. The middle three-circle mark was not exposed as a standalone source asset, so the closest available icon-library glyph is used; accepted as P3.
- Copy and content: source headings, card titles, card descriptions, and ending label are matched, including the italic heading phrase.

**Comparison History**

1. Initial pass found the heading double-translated horizontally, the side cards tilted in the opposite direction, the image resizing too late, and mobile flipping too early.
2. Fixes: removed the duplicate translation, matched the heading's 200–230 px vertical motion, reversed side-card tilt signs, measured and matched the 1048.4 × 465.96 intact-image frame, introduced the 30 px split gap that settles to 14 px, moved the flip window to `0.70–0.80`, and added the source italic font plus original SVG assets.
3. Post-fix evidence: the desktop image/split/card comparisons show the revised source-matched result with no remaining P0/P1/P2 mismatch.
4. Responsive follow-up: tablet and mobile now use a separate no-JavaScript sticky stack, while desktop keeps the measured source animation unchanged.

**Interactions And Runtime Checks**

- Tested desktop split and flipped states at `1440 × 900` and mobile entry, first card, two-card stack, three-card stack, and ending transition at `390 × 844`.
- Tested the `effects` category filter and confirmed the `Effects · 3D Split` registry card appears.
- Tested the direct preview route and responsive viewport override.
- Checked browser console warnings/errors after the final render: none.
- Verified reduced-motion handling presents a stable desktop card state and removes mobile card tilt.

**Implementation Checklist**

- [x] Local source image, fonts, and available SVG assets.
- [x] Scroll prompt and final message.
- [x] Sticky image-resize, split, flip, and settle sequence.
- [x] Source-matched desktop timing.
- [x] Responsive tablet/mobile content-face cards with sticky scroll stacking.
- [x] Effects-category registry entry and generated install JSON.
- [x] Browser console and production build verification.

**Follow-up Polish**

- P3: replace the middle Orbit glyph if an exact standalone source asset becomes available.

final result: passed

---

**Design QA — Infinite Particles Hero Source Recreation**

**Comparison Target**

- Source URL: `https://particle-background-a3e85d.webflow.io/`.
- Source visual truth: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/source-desktop-1440x900-ui.png` and `/Users/liaomeirong/dev/blocks/artifacts/particle-background/source-mobile-390x844-ui.png`.
- Browser-rendered implementation: `http://127.0.0.1:4174/preview/hero-infinite-particles`.
- Final implementation screenshots: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/implementation-desktop-1440x900-final.png` and `/Users/liaomeirong/dev/blocks/artifacts/particle-background/implementation-mobile-390x844-final.png`.
- States compared: settled desktop animation, mobile layout, both local CTA hash states, continuous animation, and pointer disturbance.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px, `1440 × 900` screenshot px, device scale factor `1`.
- Mobile source and implementation were opened at `390 × 844` CSS px, device scale factor `1`.
- The source mobile page expands to `620 px` and its browser-only capture is `375 × 812 px` after scrollbars/browser viewport exclusion. It was padded to `390 × 844` only for the side-by-side comparison; the implementation capture is a native `390 × 844` image with `scrollWidth: 390` and no density scaling.
- Browser chrome was excluded from all visual evidence.

**Full-View Comparison Evidence**

- Desktop: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/comparison-desktop-final.png`.
- Mobile: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/comparison-mobile-final.png`.

**Focused Region Comparison Evidence**

- Hero typography, particle band, description, and CTAs: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/comparison-desktop-focus-hero-final.png`.
- Navigation spacing, border, logo, and top CTA: `/Users/liaomeirong/dev/blocks/artifacts/particle-background/comparison-desktop-focus-nav-final.png`.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Fonts and typography: the source uses Droid Sans for display text and Arial for smaller UI copy. The implementation uses the closest already-available project font, Inter, for the display/logo treatment and Arial for UI copy. Display scale, weight, two-line desktop composition, letter spacing, and vertical landmarks match; the remaining glyph-shape difference is accepted as P3 because packaging the source-hosted font would violate the portable Creght registry constraint.
- Spacing and layout rhythm: the `64 px` translucent navigation, centered `120 px / 126 px` desktop headline, `480 px` description measure, `14 px` CTA gap, and `24 px` lower-right attribution placement match the source. The implementation intentionally replaces the source's `620 px`-wide broken mobile layout with a readable `390 px` layout while preserving content order and visual hierarchy.
- Colors and visual tokens: true-black background, white particle cores, silver mid-depth particles, muted eyebrow/body copy, translucent borders, and off-white primary button match the captured source palette.
- Image quality and asset fidelity: the source contains no visible image or icon assets. The implementation uses the source page's Canvas 2D infinity-curve algorithm and captured particle constants rather than a raster, SVG, CSS, or placeholder substitute. The live phase and randomized band distribution vary frame to frame as they do on the source.
- Copy and content: brand, navigation labels, eyebrow, headline, description, CTAs, and attribution text match the source.
- Behavior and accessibility: continuous motion, pointer disturbance, resize handling, local `#work` CTA states, reduced-motion pacing, semantic links, and visible keyboard focus states are implemented. The mobile layout has no horizontal overflow and keeps practical tap targets.

**Comparison History**

1. The first desktop pass showed P2 typography-width drift in navigation, buttons, and attribution because all copy inherited the repository's Inter default; the initial mobile source also exposed a `620 px` layout inside a `390 px` viewport.
2. Fixes: assigned source-matched Arial to small UI copy, used the closest project-local Inter display face for the Droid Sans treatment, recalibrated attribution size, kept the captured desktop measurements, and added a deliberate mobile reflow that hides the non-interactive center nav labels without inventing a new control.
3. Post-fix desktop and focused comparisons show matching hierarchy, placement, contrast, particle density, button geometry, and copy. The mobile comparison confirms the source composition is retained without the source's horizontal clipping.

**Interactions And Runtime Checks**

- Tested `View Work` and `Start a project`; both resolve to the source-matched `#work` state.
- Captured three different animation/pointer frames; their distinct hashes confirm the canvas continues to animate and respond after load.
- Browser console inspection reported `0` warnings and `0` errors.
- Confirmed the local library's `hero` filter reports `16` items and includes `Hero · Infinite Particles`.
- Targeted ESLint, registry generation, shadcn registry build, and Vite production build passed. Vite reports only the repository's existing large-chunk advisory.
- The new hosted-site component is byte-identical to the registry source. The repository-wide strict sync report still flags unrelated pre-existing drift and registry-only sections outside this task.
- A standalone `tsc --noEmit` invocation is not usable in this repository because of the existing referenced-project settings (`TS6305`, `TS6306`, and `TS6310`); the production build is the applicable compile gate and passed.

**Implementation Checklist**

- [x] Reusable React hero component with editable copy props.
- [x] Source-matched Canvas 2D infinity-particle animation and pointer response.
- [x] Desktop fidelity and responsive mobile reflow.
- [x] Hero-category registry item, install JSON, cover, hosted-site mirror, and preview route.
- [x] Browser visual comparison, interaction checks, console check, lint, registry build, and production build.

**Follow-up Polish**

- P3: if the deployment later permits bundling Droid Sans through an approved project asset pipeline, replacing the Inter display fallback would remove the last small glyph-shape difference.

final result: passed

---

**Design QA — Rotating Timeline Source Recreation**

**Comparison Target**

- Source URL: `https://rotating-section.learnframer.site/`.
- Source visual truth: `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/source/desktop-top-1440x900.png`, `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/source/desktop-stage-y1200-settled.png`, `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/source/mobile-top-390x844.png`, and `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/source/mobile-stage-y2200-settled.png`.
- Implementation: `registry/creght/timeline/timeline-02/timeline-02.tsx`.
- Preview route: `http://127.0.0.1:4173/preview/timeline-02`.
- States compared: desktop top and settled scroll `1200`; mobile top and settled scroll `2200`.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px, with `1425 × 891` screenshot content after the in-app browser's scrollbar/chrome exclusion.
- Mobile source and implementation: `390 × 844` CSS px, with `375 × 812` screenshot content after the same exclusion.
- Source and implementation were captured in the same approved in-app browser at DPR `1`, identical viewport overrides, matching scroll positions, and settled animation states.
- The page height matches the source structure: `50vh` lead-in, a `4000 px` timeline track, and a `100vh` exit section.

**Full-View Comparison Evidence**

- Desktop top: `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/comparison-desktop-top.png`.
- Desktop scroll `1200`: `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/comparison-desktop-focus-y1200-final.png`.
- Mobile top: `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/comparison-mobile-top.png`.
- Mobile scroll `2200`: `/Users/liaomeirong/dev/blocks/artifacts/rotating-timeline/comparison-mobile-y2200-settled.png`.

**Focused Region Comparison Evidence**

- The desktop scroll `1200` comparison is the focused animation-state check: it compares the active node at the arc apex, adjacent node angles, 200 px ring geometry, label baseline, description fade, and sticky-stage position at 1:1 scale.
- The mobile scroll `2200` comparison checks the 180 px nodes, 250vw orbit, text measure, arc curvature, and responsive clipping at 1:1 scale.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Fonts and typography: Inter, the `21 px / 25.2 px` desktop and `18 px / 23.4 px` mobile labels, and the `20 px / 30 px` muted descriptions match the source hierarchy and wrapping.
- Spacing and layout rhythm: the `150vw` desktop / `250vw` mobile orbit, node size, `2 px` white rings, fixed sticky viewport, trigger spacing, and page scroll extent match measured source geometry.
- Colors and surfaces: the `#050505` canvas, white outlines and labels, `#9ba1a5` descriptions, and dark radial node fill match the source palette.
- Image and asset fidelity: the effect contains no raster image, icon, or external media asset. Its circle, ring, orbit, and gradient are the source's native DOM/CSS geometry, so no placeholder or approximation asset is used.
- Copy and content: the source placeholder copy was intentionally replaced at the user's request with a four-step English product workflow: Define Goals, Build Prototype, Test & Iterate, and Launch & Learn. Each stage includes a detailed action-and-outcome description and remains overridable through component props.
- P3: sub-pixel antialiasing can vary slightly between frames while the measured geometry and settled states remain matched.

**Comparison History**

1. The initial implementation used one linear page-progress value, which put the active node and copy transition ahead of the source at intermediate scroll positions, a P2 timing mismatch.
2. Fix: reproduced the source's three `800 px` trigger regions with `250 px` spacers and summed their clamped viewport progress into the four-node rotation sequence.
3. The first corrected pass snapped too quickly when jumping between captured scroll positions, unlike Framer's visible spring-like settling.
4. Fix: added frame-rate-independent exponential smoothing and captured the comparison only after the stage settled. Final desktop and mobile comparisons show matching node angles, apex alignment, and description state.
5. Content follow-up: added explicit `STEP 01–04` labels and longer English descriptions. Reordered the hidden orbit positions so each numbered node arrives with its matching description while preserving the original arc geometry and motion timing.

**Interactions And Runtime Checks**

- Scrolled through all four timeline stages on desktop and mobile, returned to the top, and verified responsive recomputation after viewport changes.
- Confirmed the source exposes no hover-specific state; the reconstruction preserves scroll as the only primary interaction.
- Browser console inspection found 0 warnings and 0 errors on the final preview.
- Registry generation, shadcn registry build, and Vite production build pass. Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `timeline-02`, install JSON `public/r/timeline-02.json`, and cover `public/covers/timeline-02.png` are present in the `timeline` category.

**Implementation Checklist**

- [x] Reusable `Timeline02` React component in the timeline registry category.
- [x] Source-matched desktop and mobile orbit geometry, scroll triggers, synchronized four-step copy transitions, and easing.
- [x] Direct preview route, Timeline category metadata, cover, localized description, and generated install JSON.
- [x] Desktop/mobile side-by-side visual comparison, console check, and production build.

final result: passed

---

**Design QA — Gradient Border Button Source Recreation**

**Comparison Target**

- Source URL: `https://gradient-border-v2.learnframer.site/`.
- Source visual truth: `/Users/liaomeirong/dev/blocks/artifacts/gradient-border-button-source-final.png`.
- Rendered implementation: `http://127.0.0.1:4174/preview/button-gradient-border`.
- Implementation screenshot: `/Users/liaomeirong/dev/blocks/artifacts/gradient-border-button-implementation-final.png`.
- State: default continuous animation. The source and implementation frames are intentionally at different animation phases; geometry, layer treatment, particle style, and measured motion trajectory were compared rather than requiring identical instantaneous particle positions.

**Viewport And Normalization**

- Desktop source and implementation use a `1280 × 720` CSS viewport and report DPR 2. The approved in-app browser returns `1280 × 720` capture artifacts with the same DPR-scaled visual crop for both pages, so both were compared with identical normalization.
- Mobile source and implementation were measured at `390 × 844` CSS px and DPR 1. Both buttons measure `275.0859375 × 74 px` at `x = 57.453125`, `y = 385`; document `scrollWidth` remains `390 px`.
- Desktop source and implementation buttons both measure `275.0859375 × 74 px` at `x = 502.453125`, `y = 323`. Their inner surfaces both measure `267.0859375 × 66 px` at `x = 506.453125`, `y = 327`.

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/artifacts/gradient-border-button-comparison.png` places the source on the left and implementation on the right under the same capture normalization.

**Focused Region Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/artifacts/gradient-border-button-focused-comparison.png` compares the readable button edge, corner radius, surface gradient, label raster, and surrounding particle field at 1:1 scale.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the source Satoshi Bold font is stored locally and loads successfully. Source and implementation both render `700 24px / 28.8px`; the label width is `211.0859375 px`, with matching color `rgb(5, 5, 5)`, baseline, tracking, and no wrapping.
- Spacing and layout rhythm: the 4 px outer inset, 66 px inner surface, 19 px outer radius, 16 px inner radius, 28 px horizontal label padding, half-pixel outer border, one-pixel inner border, and three-part shadow match the measured source geometry.
- Colors and visual tokens: the implementation preserves the source white-to-80%-white surface, 10%-white shell, 20%-white outer line, 50%-white inner line, 30%-opacity `rgb(0, 153, 255)` bottom glow, and `#050505` preview canvas.
- Image quality and asset fidelity: the source contains no button image, icon, or SVG asset. The exact source font is local. Its two animated particle canvases are recreated as DPR-aware Canvas layers with matched `0.3` / `0.7` opacity and measured `22.7 s` / `15.1 s` rotations; no hotlinked visual asset or placeholder is used.
- Copy and content: `Start for free today` matches exactly and remains overridable through `children`.
- P3: particle locations vary by animation phase and deterministic seed, while density, sharp four-point shape, opacity, and orbital behavior remain source-consistent.

**Comparison History**

1. The first implementation measured `277.0859375 px` wide versus the source's `275.0859375 px`, a P2 geometry mismatch caused by a layout-affecting inner border.
2. Fix: moved the inner border to an absolute pseudo-element. Post-fix desktop and mobile measurements match the source exactly, including the `267.0859375 px` inner surface.
3. The initial border highlight used a centered rotating conic layer and produced a visibly broader top flare than the source, a P2 motion-treatment mismatch.
4. Fix: sampled the source animation and reproduced its moving conic center (`13.4503% → 86.5497%`) plus angle trajectory over the measured `4.8 s` loop.
5. The first particle pass was denser and blurrier than the source. Fix: reduced the two orbit populations and changed each particle to a sharper four-point Canvas star with a restrained halo. The final focused comparison shows no remaining P2 mismatch.

**Interactions And Runtime Checks**

- The semantic button is visible, enabled, clickable, and retains focus after click; the direct preview route does not navigate.
- Verified desktop `1280 × 720` and mobile `390 × 844` layouts, continuous conic and dual-particle motion, and reduced-motion pause rules.
- Browser console inspection found 0 warnings and 0 errors after the final desktop and mobile renders.
- Targeted ESLint, registry generation, shadcn registry build, and Vite production build pass. Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `button-gradient-border`, install JSON `public/r/button-gradient-border.json`, and local Satoshi font asset are present.

**Implementation Checklist**

- [x] Source-matched button geometry, typography, radii, borders, and surface.
- [x] Measured moving conic highlight and blue bottom glow.
- [x] Dual DPR-aware Canvas particle orbits and reduced-motion support.
- [x] Desktop/mobile preview, semantic interaction, console, lint, registry, and production-build verification.

**Follow-up Polish**

- P3: an exact particle position is frame-dependent; use the source's original particle component only if the user later supplies reusable source code for that private effect.

Current QA target: Gradient Border Button Source Recreation.

final result: passed

---

**Design QA — Stack Scroll Source Recreation**

**Comparison Target**

- Source URL: `https://stack-scroll.learnframer.site/`
- Implementation: `registry/creght/effects/stack-scroll/stack-scroll.tsx`
- Preview route: `http://127.0.0.1:4173/preview/stack-scroll`
- States compared: desktop top, scroll `480`, scroll `960`, blank transition, and outro; mobile top, scroll `450`, scroll `900`, blank transition, outro, and navigation menu open/closed.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px and `1440 × 900` capture px.
- Mobile source and implementation: `390 × 844` CSS px and `390 × 844` capture px.
- Source and implementation screenshots were captured at matching CSS sizes and arranged source-above / implementation-below at 1:1 scale. No density normalization was required.
- The source page and implementation both measure exactly `3310 px` tall on desktop and `3198 px` tall on mobile.

**Full-View Comparison Evidence**

- Desktop sequence comparison: `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/comparison-desktop-sequence-final.png`.
- Mobile sequence comparison: `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/comparison-mobile-sequence-final.png`.
- Desktop source frames: `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/source-desktop-top-1440x900.png`, `source-desktop-480-1440x900.png`, and `source-desktop-960-1440x900.png`.
- Final desktop implementation frames: `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/implementation-desktop-top-final4-1440x900.png`, `implementation-desktop-480-final4-1440x900.png`, and `implementation-desktop-960-final4-1440x900.png`.
- Mobile source and implementation menu evidence: `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/source-mobile-menu-open-390x844.png` and `/Users/liaomeirong/dev/blocks/design-qa-assets/stack-scroll/implementation-mobile-menu-open-final-390x844.png`.

**Focused Region Comparison Evidence**

- The mobile menu frames are the focused navigation/control comparison: they show the source logo, `46 × 46 px` close target, `Original` link, blue Remix pill, source Remix icon, spacing, and focus outline at 1:1 scale.
- Separate card crops were not needed because the `1440 × 900` scroll frames render the `250 × 350 px` card surfaces and `224 × 254 px` image windows clearly enough to inspect borders, radii, crop, and image order.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the exact source Inter variable font is bundled locally. The outro matches the source's `26 px / 31.2 px`, weight `500`, normal tracking, and measured `250.73 px` desktop width. Navigation uses the same source font at `14 px / 17 px`.
- Spacing and layout rhythm: the sequence is `100dvh + 1510 px`, followed by a `100dvh` outro; the sticky frame, `1500 px` perspective, `294 × 350 px` deck, `250 × 350 px` cards, `100 px` Z spacing, 12 px radii, and mobile `46 px` / desktop `60 px` navigation match the source geometry.
- Colors and visual tokens: `#050505` canvas, `rgba(19,20,21,.96)` blurred navigation, `#4384f5` Remix pill, translucent violet card surfaces, and source gold hairline borders match the captured page.
- Image quality and asset fidelity: all nine source JPEGs, the source Remix SVG, source logo SVG, and source Inter font are stored locally. The 21-card order and source `object-fit: cover` crop are preserved; no source assets are hotlinked.
- Copy and content: `Original`, `Remix`, and `super cool, right? :))` match exactly. Links preserve the source destinations.
- Behavior and responsiveness: the scroll-driven 3D fan, blank transition, outro, responsive hamburger, menu open/close, Escape close, and reduced-motion static composition are functional. Mobile has no horizontal overflow.
- P3: the final desktop `scroll 480` non-black card bounding box is `(562, 284)–(1300, 890)` versus source `(568, 293)–(1312, 890)`; the residual `6–12 px` edge difference is a minor perspective/rasterization variation and does not change the composition or interaction.

**Comparison History**

1. Initial implementation used an existing local display-font fallback; the mobile outro measured about `208 px` wide versus the source's `250.73 px`, a P2 typography mismatch.
2. Fix: bundled the exact source Inter variable font and restored `26 px / 31.2 px`, weight `500`, normal tracking. Post-fix mobile and desktop outro frames match the source width and baseline.
3. Initial desktop `scroll 480` frame placed the card fan about `20 px` below the source, a P2 motion-path mismatch.
4. Fix: added a source-measured sinusoidal desktop midpoint lift while preserving the mobile path. The final `scroll 480` and `scroll 960` comparisons reduce the visible edge drift to P3-only tolerances.
5. Initial mobile close button used the correct glyph position but an `18 px` focus target instead of the source's full `46 px` header cell.
6. Fix: expanded the semantic button to `46 × 46 px`. The final open-menu comparison matches the source focus outline and control placement.

**Interactions And Runtime Checks**

- Scrolled through the complete desktop and mobile sequences in small increments and captured all visible animation states, blank transition, and outro.
- Opened the mobile menu, verified `aria-expanded`, closed it with Escape, and confirmed the button returns to the `Open menu` state.
- Verified the `Original` and `Remix` link destinations from the rendered DOM.
- Browser console inspection found 0 warnings and 0 errors on the final preview.
- Targeted ESLint, registry generation/build, shadcn registry output, and Vite production build passed. Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `stack-scroll`, install JSON `public/r/stack-scroll.json`, and PNG cover `public/covers/stack-scroll.png`.

**Implementation Checklist**

- [x] Reusable `StackScroll` React component under the `effects` category.
- [x] Source-localized images, logo, Remix icon, and font.
- [x] Source-matched 21-card 3D scroll sequence and responsive mobile path.
- [x] Desktop/mobile navigation, mobile menu, semantic links, Escape handling, and reduced-motion behavior.
- [x] Desktop/mobile browser verification, side-by-side sequence comparisons, registry metadata, cover, and install JSON.

**Follow-up Polish**

- P3: if exact sub-10-pixel parity is required for one fixed desktop viewport, the midpoint X/Y correction can be tuned further, but the current responsive implementation better preserves the source composition across widths.

Current QA target: Stack Scroll Source Recreation.

final result: passed

---

**Design QA — Generate Button Reference Adjustment**

**Comparison Target**

- Source visual truth: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-97508583-62ca-409f-8204-0688c15642b1.jpg`.
- Rendered implementation: `http://127.0.0.1:5173/preview/button-generate`.
- Implementation evidence: `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-final-viewport.png` and `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-transition-1080x1920.png`.
- The source capture shows a mid-letter-transition frame; the implementation was checked in both idle (`Generate`) and active (`Generating`) states.

**Viewport And Normalization**

- Source: `1080 × 1920` JPEG px.
- Implementation CSS viewport: `1080 × 1920`, device scale factor `1`; the browser's visible screenshot artifact is `1080 × 1228` px, so `/Users/liaomeirong/dev/blocks/artifacts/button-generate/source-top-1080x1228.jpg` is the matched top crop used for full-view comparison.
- Focused source and implementation crops are both `380 × 140` px: `/Users/liaomeirong/dev/blocks/artifacts/button-generate/source-focus-380x140.jpg` and `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-focus-380x140.png`.
- The button measures `320 × 78` CSS px at `x = 380`, `y = 921`; the surrounding black canvas and center placement match the source capture.

**Full-View Comparison Evidence**

- Source top crop: `/Users/liaomeirong/dev/blocks/artifacts/button-generate/source-top-1080x1228.jpg`.
- Implementation top crop: `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-final-viewport.png`.

**Focused Region Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/artifacts/button-generate/source-focus-380x140.jpg` and `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-focus-380x140.png` compare the complete capsule, silver edge, inner glass surface, blue bottom glow, star icon, and label at 1:1 scale.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the implementation uses the existing sans stack at `23 px` / medium weight with tight tracking, matching the source's compact white CTA label. The source screenshot is a transition frame with intentional text blur; the implementation preserves that effect during the per-letter swap and returns to a crisp idle label.
- Spacing and layout rhythm: the component is a centered `320 × 78 px` pill with full-width responsive clamping, a 3 px inset, and a bottom glow line. The measured center position and capsule proportions match the source.
- Colors and visual tokens: the preview uses a true black canvas, translucent charcoal glass layers, a soft silver outer edge, cool blue base line, and restrained blue shadow instead of the previous purple filled surface.
- Image quality and asset fidelity: the source has no raster asset. The closest available icon-library sparkle is used as a real vector icon; no handcrafted SVG, text glyph, or placeholder image is introduced.
- Copy and content: `Generate` and `Generating` are the source-matched labels, with an accessible live status and configurable async callback.

**Comparison History**

1. Initial pass used a purple `196 × 56 px` button with a boxed sparkle icon, which was a P1 visual mismatch against the glass capsule source.
2. Fix: matched the `320 × 78 px` capsule geometry, removed the icon box, added silver/charcoal glass layers, blue bottom glow, larger sparkle, and black preview background.
3. Post-fix evidence: the focused crop shows matching capsule proportions, centered placement, dark glass treatment, and blue edge glow. The remaining source-vs-idle text blur difference is an expected state difference because the source capture is mid-transition.

**Interactions And Runtime Checks**

- Click transitions `Generate → Generating` with staggered letter transforms, blur, opacity, and sparkle rotation, then returns to idle after the minimum async display time.
- Focus remains on the semantic button during the active state; `aria-busy` and `aria-disabled` reflect the current state without removing keyboard focus.
- Reduced-motion utilities disable the letter and sparkle motion while preserving the state change.
- Browser console inspection found 0 warnings and 0 errors.
- Targeted ESLint, registry generation/build, and the Vite production build passed. Vite reports only the repository's existing large-chunk advisory.

**Implementation Checklist**

- [x] Reference-matched black glass capsule and blue bottom glow.
- [x] Star icon placement without the previous square container.
- [x] Responsive `320 × 78 px` geometry and focused/active states.
- [x] Letter-by-letter `Generate` / `Generating` swap with async callback support.
- [x] Creght mirror, registry metadata, preview background, and install JSON updated.
- [x] Browser visual comparison, interaction check, console check, lint, and production build.

**Follow-up Polish**

- P3: if the exact source sparkle path or source font becomes available, swap those two assets while preserving the current measured geometry and state behavior.

final result: passed

---

**Design QA — Galaxy Button Source Recreation**

**Comparison Target**

- Source URL: `https://galaxy-wow.learnframer.site/`
- Source default-state capture: `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/source-default-desktop.png`
- Density/offset-normalized desktop source: `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/source-desktop-normalized.png`
- Desktop implementation: `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/implementation-default-full-v2.png`
- Hover implementation: `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/implementation-hover-full-v2.png`
- Mobile implementation: `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/implementation-mobile-default.png` and `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/implementation-mobile-hover.png`

**Viewport And Normalization**

- Desktop source and implementation use a `1440 × 900` CSS viewport. The source browser reported DPR 2 while returning a CSS-sized viewport image with a DPR-scaled visual offset, so the valid `721 × 437` source-region capture was placed at the measured DOM crop origin (`359, 231`) to create the normalized `1440 × 900` reference.
- The implementation screenshots are `1440 × 900` pixels at device scale factor 1. The measured button is `432 × 138` CSS px at `x = 504`, `y = 381`, matching the source DOM bounds within source subpixel rounding.
- Mobile implementation is `390 × 844` CSS/capture px at device scale factor 1. The responsive button is `326 × 104.13` px with `scrollWidth = innerWidth = 390`.
- Compared desktop state: default, pointer outside. Hover styling was measured from the source DOM, but the source particle canvas did not produce a valid visible hover frame in the approved browser.

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/qa-default-full.png`

**Focused Region Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/artifacts/galaxy-button/qa-default-focused.png`
- The focused comparison keeps the complete button at 1:1 scale and checks the 432 × 138 geometry, border, radius, inner edge, text raster, and surrounding background.

**Findings**

- Default desktop state has no actionable P0, P1, or P2 mismatch.
- Fonts and typography: both use Inter Medium at `56 px`, `1.2` line height, `-0.01em` tracking, and the source `#9699a8 → #ffffff` text gradient. Text width and baseline align in the focused comparison.
- Spacing and layout rhythm: button size, centered placement, 2 px surface inset, pill radius, and content alignment match the measured source.
- Colors and visual tokens: source `#0a0609` canvas/surface, `#7e85b5` default border, blue-purple inset edge, hover border gradient, and measured hover shadows are reproduced.
- Image quality and asset fidelity: the source uses no image or SVG asset for the button. The implementation replaces the prior CSS-dot approximation with a real DPR-aware Canvas particle renderer and uses the project's local Inter Medium font.
- Copy and content: the default `Generate` label matches the source and remains overridable through `children`.
- Blocking evidence gap: the source browser's particle canvas remained `data-generated=false`; subsequent source script/mobile capture was denied by browser security policy. A valid source hover frame and source mobile screenshot are therefore unavailable for final pixel comparison.

**Comparison History**

1. Initial implementation had an overly bright default outer glow, CSS `span` particles, source-inconsistent text line height, and a `#080c0f` preview background.
2. Fixes: rebuilt the component around source-measured border and glow layers, added deterministic DPR-aware Canvas particles, matched typography, changed the Galaxy preview canvas to `#0a0609`, and added proportional mobile sizing.
3. Post-fix default comparison shows matching desktop geometry, typography, border weight, and color with no P0/P1/P2 default-state mismatch.
4. Hover and mobile implementation states were captured and tested, but their source-side visual comparison remains blocked by the missing approved source captures.

**Interactions And Runtime Checks**

- Pointer enter/leave toggles the galaxy state and animates live particles without console warnings or errors.
- Keyboard focus keeps the same active visual state; Space activation was exercised while focus remained on the semantic button.
- Mobile default and hover states were verified at `390 × 844` with no horizontal overflow.
- Reduced-motion users receive a static particle frame instead of continuous Canvas motion.
- Scoped ESLint, registry generation/build, and the Vite production build passed. The production build reports only the repository's existing large-chunk advisory.
- Repository-wide `tsc --noEmit` remains blocked by the existing referenced-project configuration errors `TS6305`, `TS6306`, and `TS6310`, unrelated to this component.

**Implementation Checklist**

- [x] Source-matched default desktop visual.
- [x] Canvas star field, blue base glow, pulse layer, animated border, and active press feedback.
- [x] Pointer, keyboard, disabled, and reduced-motion handling.
- [x] Responsive mobile sizing with no overflow.
- [x] Updated preview background, 16:9 PNG cover, registry metadata, and install JSON.
- [ ] Source hover and source mobile pixel comparison after approved captures become available.

final result: blocked

---

**Design QA — Full AI SEO Landing Replica**

**Scope**

- Source: `https://lime-arrow-820805.framer.app/`
- Implementation: `http://127.0.0.1:5177/ai-seo-landing`
- Composition: Navbar, Hero, Companies, Bento Features, Feature List, Testimonial, Pricing, CTA, and Footer.
- Implementation model: from-scratch React components organized by registry group and recomposed by `landing-ai-seo`; Tailwind utilities provide the visible layout and styling.

**Source Truth And Normalization**

| Surface | CSS viewport | Content width | Final page height | Density |
| --- | --- | --- | --- | --- |
| Desktop source + implementation | 1440 × 900 | 1425 px | 5804 px | 1 CSS px = 1 capture px |
| Mobile source + implementation | 390 × 844 | 375 px | approximately 8562 px | 1 CSS px = 1 capture px |

The source and implementation were captured in the same in-app browser, at identical viewports and scroll positions. Each source and implementation screenshot was placed side by side before judging visible differences.

**Comparison Evidence**

- Desktop Hero and orbit system: `source-capture/full-site/qa/compare-desktop-0.jpg`
- Focused post-adjustment orbit comparison: `source-capture/full-site/qa/compare-desktop-orbit-motion.jpg`
- Local orbit motion sequence at `T+0.0s` and `T+1.5s`: `source-capture/full-site/qa/compare-local-orbit-motion-sequence.jpg`
- Desktop companies and transition: `source-capture/full-site/qa/compare-desktop-900.jpg`
- Desktop Bento grid: `source-capture/full-site/qa/compare-desktop-1485.jpg`
- Desktop feature dropdown: `source-capture/full-site/qa/compare-desktop-feature-menu.jpg`
- Desktop CTA and Footer: `source-capture/full-site/qa/compare-desktop-5447.jpg`
- Mobile menu: `source-capture/full-site/qa/compare-mobile-menu.jpg`
- Mobile Bento: `source-capture/full-site/qa/compare-mobile-1403.jpg`
- Mobile Footer: `source-capture/full-site/qa/compare-mobile-7540.jpg`
- Additional desktop and mobile section pairs remain under `source-capture/full-site/qa/` for the feature list, testimonial, pricing, and CTA boundaries.

**Required-Surface Review**

- Hero: the measured 1574 px orbit container, six 574/774/974/1174/1374/1574 px alternating solid and dashed rings, visible moving orbit nodes, radial purple field, vignette, bottom fade, type treatment, CTA, and source dashboard crop match the desktop reference. The three solid rings carry `4/6/5` nodes and rotate in approximately `60/50/40s`; the dashed rings counter-rotate in approximately `80/100/80s`, matching the measured source motion. The source hides the rings on mobile; the implementation does the same.
- Typography: local Inter 400/500/700 files are loaded from `public/assets/ai-seo-source/`. Headline, body, label, and pricing metrics were matched at the source breakpoints.
- Layout rhythm: desktop section boundaries reproduce the measured 73.6/1077.8/334/1155.6/679.6/654.6/918.4/553.8/356.5 px sequence. Mobile sections use the source's 68 px navigation and stacked card layout.
- Assets: the dashboard, feature renders, testimonial portrait, pattern, animated mark, and poster are localized copies of the user-directed source references. No Framer-generated page code is embedded.
- Responsive behavior: 320, 390, 1280, and 1440 px checks show no document-level horizontal overflow. The mobile menu closes and restores scrolling when the viewport crosses the 810 px desktop breakpoint.
- Accessibility: interactive controls use semantic links, buttons, switch state, form labels, focus-visible styles, Escape handling, and responsive menu state cleanup. The English landing route updates document language, title, and description while mounted.

**Interactions And Runtime Checks**

- Features and Company dropdowns open from hover/click, close on a second click or Escape, and preserve keyboard focus flow.
- Features hover traversal now remains open across the measured 11 px gap between the `52.59 px` button bottom and `63.59 px` panel top; the transparent bridge exactly matches the panel width and adds no visible geometry.
- Mobile navigation opens with body scroll lock, closes normally, and automatically unlocks when resized to desktop.
- Pricing switches between yearly `$29/$79/$149` and monthly `$35/$85/$160` values.
- The CTA exercises native invalid-email focus and reaches the local success state for a valid address.
- Footer links and primary CTAs navigate to existing landing-page anchors.
- Orbit node centers remain on their ring radii while their screen positions change across a two-second sample; the `T+0.0s`/`T+1.5s` focused frames visibly confirm the movement. Reduced-motion utilities disable the continuous rotation.
- Final neutral preview: 1280 × 720 viewport, 5804 px page height, no horizontal overflow, no console errors or warnings.
- Targeted ESLint, `git diff --check`, registry generation, shadcn registry build, and Vite production build passed. Vite reports only the existing large main-chunk advisory.

**Interaction Fix History**

1. P1: moving the pointer from Features to its dropdown crossed an uncovered 11 px gap, fired `mouseleave`, and removed the panel before it could be reached.
2. Fix: added an invisible `694 × 11 px` descendant bridge spanning the complete gap without changing the source-matched button or panel positions.
3. Post-fix evidence: `source-capture/full-site/qa/compare-desktop-feature-menu.jpg` shows the unchanged open visual state. Browser pointer traversal passed button → gap → panel and panel → gap → button; leaving the dropdown still closes it, and click-open/click-close remains functional.

**Residual P3 Notes**

- The source-only Framer editing badge and promotional overlay are intentionally excluded because they are hosting chrome rather than landing-page content.
- Lucide social/navigation glyphs have tiny path-shape differences from the source's embedded icons, while their size, position, weight, and interaction state are matched.
- Orbit screenshots may differ by a few rotation degrees because the rings continuously animate.
- The localized reference media requires permission or replacement before production; this is documented in `README.md`.

final result: passed

---

**Design QA — Logo Wall 06 / Floating Integrations**

**Comparison Target**

- Source image: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-ad44ec30-ed45-4d58-8009-9c34c4620bd6.png`
- Density-normalized source: `/Users/liaomeirong/dev/blocks/docs/logo-wall-06-qa/reference-normalized.png`
- Rendered implementation: `http://127.0.0.1:5174/preview/logo-wall-06`
- Final implementation screenshot: `/Users/liaomeirong/dev/blocks/docs/logo-wall-06-qa/implementation-pass2.png`

**Viewport And Normalization**

- Source: `2736 × 1342` physical px, interpreted as a 2× capture and normalized to `1368 × 671` CSS px.
- Implementation: `1368 × 671` CSS px and `1368 × 671` screenshot px.
- Compared state: desktop default view with the centered copy and all 12 decorative integration tiles visible.
- Responsive check: `390 × 844`; no horizontal overflow (`scrollWidth = innerWidth = 390`).

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/logo-wall-06-qa/comparison-pass2.png`

**Focused Region Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/logo-wall-06-qa/comparison-focus-pass2.png`
- The focused crop compares display typography, baseline spacing, paragraph wrapping, color, and horizontal alignment.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: first-line raster bounds are `420–888 × 254–289` versus source `422–887 × 253–288`. The second-line bottom matches at `356 px`; residual 1–5 px differences are accepted as P3 system-font rasterization variance.
- Spacing and layout rhythm: all 12 desktop tiles match the measured source positions and `70 × 70 px` geometry. The central content group is shifted 30 px left from the viewport midpoint to match the source composition.
- Colors and visual tokens: the off-white canvas, black display type, muted gray description, and brand-tile colors match the source palette.
- Image quality and asset fidelity: real vector brand marks from `react-icons` are used. The supplied screenshot does not expose a standalone asset for the upper-left purple petal mark, so the closest library butterfly glyph is used; accepted as P3.
- Copy and content: heading, line break, description, and description wrapping match the source.

**Comparison History**

1. Pass 1 matched the tile coordinates and sizing, but centered the copy 30 px too far right and placed the description 11–13 px too high.
2. Pass 2 moved the content group left, adjusted the heading line height and paragraph offset, applied matching horizontal typography metrics, and produced final full and focused comparisons with no P0/P1/P2 mismatch.

**Interactions And Runtime Checks**

- Verified responsive icon reflow at `390 × 844` with no text overlap or horizontal overflow.
- Verified hover scaling remains contained and does not affect document layout.
- Checked the in-app browser console after the final render: no errors.
- Scoped ESLint and the production registry build were run for the component.

**Follow-up Polish**

- P3: replace the upper-left butterfly glyph if the exact standalone brand asset becomes available.

final result: passed

---

**Design QA — Logo Wall 05 / Integration Ticker**

**Comparison Target**

- Source image: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-dbdf5c3c-125b-4c90-a104-d5e76a4ff00d.png`
- Density-normalized source: `/Users/liaomeirong/dev/blocks/docs/logo-wall-05-qa/reference-normalized.png`
- Rendered implementation: `http://127.0.0.1:5174/preview/logo-wall-05`
- Final implementation screenshot: `/Users/liaomeirong/dev/blocks/docs/logo-wall-05-qa/implementation-pass3.png`

**Viewport And Normalization**

- Source: `2952 × 1378` physical px, interpreted as a 2× capture and normalized to `1476 × 689` CSS px.
- Implementation: `1476 × 689` CSS px and `1476 × 689` screenshot px.
- Compared state: desktop default view with all four ticker columns in motion. Exact visible logo order is time-dependent by design.
- Responsive check: `390 × 844`; no horizontal overflow (`scrollWidth = innerWidth = 390`).

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/logo-wall-05-qa/comparison-pass3.png`

**Focused Region Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/logo-wall-05-qa/comparison-focus-pass3.png`
- The focused crop compares the heading baselines, copy wrapping, lower ticker rows, tile geometry, fades, and section spacing.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Desktop heading starts within `2 px` of the source. First-line raster bounds are `148–616 × 415–451` versus source `149–614 × 413–449`; the remaining delta is accepted as P3 font rasterization variance.
- Desktop second-line bottom and description bottom match the source at `516 px` and `587 px` respectively.
- Ticker geometry matches the measured source: `788 px` left edge, `536 px` total width, four `101 px` square tiles, and consistent column distribution.
- The implementation uses real brand marks from `react-icons`, continuous alternating vertical ticker directions, edge fades, hover pause, and reduced-motion support.
- The reference and implementation naturally show different logo rows at capture time because the ticker continuously advances; this is expected behavior rather than a layout mismatch.

**Comparison History**

1. Pass 1 established the four-column ticker and content layout but used `119 px` tiles, positioned the copy `37 px` too far left, and rendered the heading too wide vertically.
2. Pass 2 matched the ticker region and tile geometry, reduced the vertical rhythm, and aligned the copy start and heading cap height.
3. Pass 3 adjusted the heading horizontal metrics and two-line baseline, tightened paragraph wrapping, and produced the final full and focused comparisons.

**Interactions And Runtime Checks**

- Verified ticker movement over a `650 ms` interval; the measured tile position changed by more than `13 px`.
- Verified responsive layout at `390 × 844` with no horizontal overflow.
- Checked the in-app browser console after the final render: no errors.
- Scoped ESLint passed for `logo-wall-05.tsx`.
- Production build passed, including registry generation for all 33 blocks and `logo-wall-05` install JSON.

final result: passed

---

**Design QA — Logo Wall 07 / Integration Pills**

**Comparison Target**

- Source image: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-3685a7ce-d2e7-4166-9ed7-b83b062bebc2.png`
- Density-normalized source: `/Users/liaomeirong/dev/blocks/docs/logo-wall-07-qa/reference-normalized.png`
- Rendered implementation: `http://127.0.0.1:5174/preview/logo-wall-07`
- Final implementation screenshot: `/Users/liaomeirong/dev/blocks/docs/logo-wall-07-qa/implementation-final.png`

**Viewport And Normalization**

- Source: `2366 × 1096` physical px, interpreted as a 2× capture and normalized to `1183 × 548` CSS px.
- Implementation: `1183 × 548` CSS px and `1183 × 548` screenshot px at device scale factor `1`.
- Compared state: desktop default view with both integration-pill rows visible.
- Responsive check: `390 × 844`; `scrollWidth = innerWidth = 390`, all nine integrations remain visible, and no text or pills overlap.

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/logo-wall-07-qa/comparison-final.png`

**Focused Region Comparison Evidence**

- A separate focused crop was not needed: the normalized `1183 × 548` full-view comparison keeps the complete heading, body copy, icon circles, labels, pill edges, and row spacing clearly readable at 1:1 scale.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the source title raster is `604 × 99 px`; the implementation is `605 × 96 px`. Body copy measures `686 × 51 px` versus `687 × 52 px`. Residual 1–3 px glyph differences are accepted as P3 system-font rasterization variance.
- Spacing and layout rhythm: the final first row is `781 × 52 px` at `x = 211`, matching the source's approximately `780 × 55 px` antialiased bounds at `x = 212`. The second row is `596 × 52 px`, matching the source's `596 px` width. Desktop row starts are `y = 332.34` and `402.34`.
- Colors and visual tokens: the off-white canvas, black display copy, cool-gray description, pale-gray pill surfaces, and nine brand colors match the reference palette.
- Image quality and asset fidelity: all brand marks use real vector icons from `react-icons`; no placeholder images, CSS drawings, handcrafted SVGs, or text-glyph substitutes are present.
- Copy and content: the heading, forced title break, two-line description, integration names, capitalization, and `PayPal` spelling match the source.
- Icons and behavior: all nine icons are centered in `35 × 35 px` brand circles. Hover changes the pill surface and elevation without affecting document flow.

**Comparison History**

1. Pass 1 matched pill geometry but rendered the title and body copy too small and placed both rows about `24 px` too high.
2. Pass 2 increased and optically scaled the typography, lowered the description and rows, and matched the two-row vertical rhythm.
3. Pass 3 aligned title/body raster dimensions, label sizing, and paragraph height.
4. Final pass shifted the desktop composition `10 px` right and tuned row gaps to `12 px` and `13 px`, matching the source's measured row bounds with no remaining P0/P1/P2 mismatch.

**Interactions And Runtime Checks**

- Verified hover feedback on the Shopify pill and confirmed it does not change layout geometry.
- Verified the responsive two-column reflow at `390 × 844`, including the final centered PayPal pill and zero horizontal overflow.
- Checked the in-app browser console after the final desktop and mobile renders: no warnings or errors.
- Scoped ESLint passed for `logo-wall-07.tsx`.
- Production build passed, including registry generation and the installable `logo-wall-07` JSON artifact.

**Follow-up Polish**

- P3: font glyph shapes may vary slightly across operating systems because the source font is not bundled; measured line and block dimensions remain matched.

final result: passed

---

Current QA target: Logo Wall 07 / Integration Pills. Full evidence and findings are recorded in the corresponding section above.

final result: passed

---

**Design QA — Image Intro Effect**

**Comparison Target**

- Source URL: `https://image-intro.learnframer.site/`
- User-directed variation (`2026-08-10`): the source header and action controls are intentionally omitted; the fidelity scope is now the full-screen card and title animation.
- User-directed content variation (`2026-08-10`): the original lifestyle image set and `ASTRAL / AESTHETICS / 2025` copy are intentionally replaced with a cohesive design-object collection and `OBJECTS / IN ORBIT / EDITION 01`.
- Source visual truth:
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/source-desktop-initial.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/source-mobile-7200ms.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/source-mobile-menu-open.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/source-motion-timeline.json`
- Rendered implementation: `http://127.0.0.1:4173/preview/image-intro`
- Final implementation evidence:
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/local-desktop-final-2.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/local-mobile-7200ms.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/local-mobile-menu-loop-final.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/local-desktop-cover-no-header.png`
  - `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/local-desktop-cover-objects.png`

**Viewport And Normalization**

- Desktop source and implementation: `1280 × 720` CSS px and `1280 × 720` PNG px. The in-app browser reported DPR `2` for both desktop pages and returned viewport-normalized PNGs.
- Mobile source and implementation: `390 × 844` CSS px and `390 × 844` PNG px at DPR `1`.
- States compared: empty intro frame, central image stack, staged ring expansion, synchronized first flip, and expanded rotating ring with visible heading.
- The ring keeps rotating and opposite card pairs keep flipping, so image positions naturally vary by capture time. Geometry, radius, density, entrance timing, and motion behavior were compared rather than requiring an identical continuous-loop phase; image subject matter is now an intentional user-directed departure.

**Full-View Comparison Evidence**

- `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/compare-desktop-final.png`
- `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/compare-mobile.png`
- `/Users/liaomeirong/dev/blocks/docs/image-intro-qa/compare-mobile-menu-loop-final.png`

**Focused Region Comparison Evidence**

- The top `220 px` of `compare-mobile-menu-loop-final.png` compares the menu height, close control, action rows, button widths, icon placement, border, colors, and vertical rhythm at 1:1 scale.
- The desktop title region in `compare-desktop-final.png` compares the two display lines, year baseline, overlay order, ring radius, and card crop at 1:1 scale.

**Findings**

- No actionable P0, P1, or P2 differences remain within the current headerless scope.
- Fonts and typography: the source uses Gloock and Inter. The Gloock file was visible but could not be exported by the browser asset bundle, so the closest already-bundled open-source serif was copied locally and optically scaled. Final desktop title blocks measure `500.09 × 82 px` versus the source `500.20 × 82 px`; the mobile block is `292.67 × 48 px` versus `292.80 × 48 px`. Residual glyph-shape differences are accepted as P3.
- Spacing and layout rhythm: the desktop heading begins at `y = 251`, mobile at `y = 349`, and the year begins at `y = 445` / `475`, matching the measured source animation layout.
- Colors and visual tokens: the `#050505` canvas and white display text match the source animation area.
- Image quality and asset fidelity: eight original, locally generated `1024 × 1536` product images use alternating dark/light art direction, a shared neutral grade, and restrained orange accents. The web assets are AVIF and no hotlinked images remain.
- Copy and content: the default display copy is intentionally changed to `OBJECTS`, `IN ORBIT`, and `EDITION 01`.
- Motion timing: source cards rise from below in reverse layer order at roughly `200 ms` intervals, briefly fan at center, expand first to an approximately `140 px` compact ring, then settle at a `250 px` radius. The implementation now follows the same staged path, performs the first `rotateY(180deg)` flip in sync, and uses an approximately `18 s` ring rotation with paired follow-up flips.

**Comparison History**

1. The first implementation pass reproduced the intro stack and rotating ring, but the display face measured only `340.20 px` wide versus the source `500.20 px`; the open mobile menu also retained the logo and the copied button showed a browser focus ring.
2. Fixes: optically scaled the display face and year to the measured width, hid the logo in the open mobile variant, removed the source-inconsistent mouse focus ring, and preserved keyboard-accessible labels.
3. Post-fix evidence: `compare-desktop-final.png` and `compare-mobile-menu-loop-final.png` show matching title blocks and action-bar geometry with no remaining P0/P1/P2 mismatch.
4. Motion follow-up: replaced the simultaneous offset stack with eight sequential bottom-up arrivals, reproduced the source's compact-ring pause and second radial expansion, synchronized the first flip, slowed the ring from `11 s` to `18 s`, and grouped later flips into opposite pairs.
5. Headerless variation: removed the complete desktop/mobile header, Original/Copy/Remix actions, menu state, icon dependency, and all related CSS while keeping the animation centered in the full viewport.
6. Headerless cover refresh: replaced the old header-bearing JPEG payload with a true `1280 × 720` RGB PNG using the completed ring state and no navigation or action controls.
7. Content refresh: generated a coordinated eight-image design-object collection, optimized it to AVIF, changed the display copy to `OBJECTS / IN ORBIT / EDITION 01`, and regenerated the cover from the same final assets.

**Interactions And Runtime Checks**

- Confirmed the header, desktop actions, mobile menu, and copy/remix controls are absent from the rendered component.
- Sampled the source entrance at approximately `100 ms` intervals and checked implementation frames around `2.1 s`, `3.2 s`, `3.9 s`, `4.45 s`, `5.45 s`, and `6.2 s` in the same `1280 × 720` in-app browser viewport.
- Verified `1280 × 720` and `390 × 844` with no horizontal or vertical overflow.
- Scoped ESLint completed with no component errors.
- Production registry build passed and emitted `public/r/image-intro.json`.
- Validated `public/covers/image-intro.png` as a true `1280 × 720` RGB PNG with no header, action controls, browser chrome, or added marketing copy.
- Decoded the optimized AVIF assets and visually checked fine detail on both dark and light cards; no text, branding, or compression defects are visible at card scale.

**Implementation Checklist**

- [x] Eight cohesive generated design-object images stored locally as optimized AVIF assets.
- [x] Intro black frame, sequential image stack, two-stage expansion, loop rotation, synchronized first flip, and paired 3D follow-up flips.
- [x] Headerless desktop and mobile presentation.
- [x] Responsive full-screen animation layout.
- [x] Effects registry entry, cover image, install JSON, browser verification, and production build.

**Follow-up Polish**

- P3: replace the local serif fallback with the exact source Gloock WOFF2 if the source later exposes a downloadable font asset.

final result: passed

---

**Design QA — Image Carousel**

**Scope**

- Source: `https://imgcarousel.learnframer.site/`
- Implementation: `registry/creght/effects/image-carousel/image-carousel.tsx`
- Preview route: `http://127.0.0.1:4173/preview/image-carousel`
- State compared: initial idle state, CTA not focused, carousel animation running.

**Source Truth And Normalization**

| Surface | Source capture | Implementation capture | CSS viewport | Capture pixels | Density normalization |
| --- | --- | --- | --- | --- | --- |
| Desktop | `design-qa-assets/image-carousel/source-desktop-1440x900.png` | `design-qa-assets/image-carousel/implementation-desktop-final-1440x900.png` | 1440 × 900 | 1440 × 900 each | 1 CSS px = 1 capture px |
| Mobile | `design-qa-assets/image-carousel/source-mobile-390x844.png` | `design-qa-assets/image-carousel/implementation-mobile-final-390x844.jpg` | 390 × 844 | 390 × 844 each | 1 CSS px = 1 capture px |
| Tablet | Source responsive rules were measured in-browser | `design-qa-assets/image-carousel/implementation-tablet-1024x768.jpg` | 1024 × 768 | 1024 × 768 | 1 CSS px = 1 capture px |

Both pages were captured in the same in-app browser with the same explicit viewport override for each comparison. The animation is continuous, so card rotation phase is intentionally treated as a P3 capture-timing difference; geometry, image order, split behavior, motion duration, and visual treatment are compared instead of requiring identical frames.

**Comparison Evidence**

- Full desktop, source left / implementation right: `design-qa-assets/image-carousel/comparison-desktop-final.png`
- Full mobile, source left / implementation right: `design-qa-assets/image-carousel/comparison-mobile-final.png`
- Focused desktop copy + carousel, source left / implementation right: `design-qa-assets/image-carousel/comparison-desktop-focused-final.png`
- Hover reference: `design-qa-assets/image-carousel/source-desktop-button-hover.png`
- The full screen is a single hero/effect, so the focused desktop crop covers the only material design region; no additional isolated-region comparison is needed.

**Required-Surface Review**

- Typography: local Inter Display 400/500; exact 60.96/67.056 desktop, 53.34/58.674 tablet, and 34.29/37.719 mobile title metrics. Body is 18/27 and CTA is 14/16.8.
- Layout and spacing: 124 px root top padding, 335 px stage, fixed 1200 × 400 carousel viewport, 24 px copy gaps, 408 px description width, and 127.2 × 36.8 CTA reproduced.
- Color and effects: `#050505` background, white title, `#9ba1a5` body, grayscale/color 50% masks, cyan glow, repeated light texture, and the centered divider match the source treatment.
- Cards and assets: seven 3D arms, 260 × 370 faces, 20 px radius, 800 px perspective, exact source image set, `object-fit: cover`, and locally stored assets. Stable source-host fallbacks keep an installed registry block functional when the local public assets are absent.
- Copy and iconography: headline, description, CTA label, and the source arrow path match.
- Responsive behavior: desktop, tablet, and mobile have no document overflow or scroll; the source's deliberately clipped 408 px mobile paragraph and fixed-width carousel geometry are preserved.
- Accessibility: decorative images and effects are hidden from assistive technology; the CTA is a semantic button with a keyboard focus ring. This adds accessibility without changing the neutral visual state.

**Comparison History**

1. P2: the first desktop capture was 1280 × 720 despite its filename, so it was discarded as invalid comparison evidence. CTA text and arrow also needed a no-wrap constraint. The viewport was verified at 1440 × 900, the CTA was fixed, and `comparison-desktop-pass2.png` was reviewed.
2. P2: mobile copy initially risked responsive reflow that the source does not use. The source's fixed 1200 px copy container and 408 px paragraph were preserved, including intentional edge clipping. `comparison-mobile-pass1.png` and the final mobile composite verify the result.
3. P2: the cyan glow read too rectangular and sat in front of cards. The source-sized radial mask, repeated light texture, and divider were matched, and the broad glow moved behind both card masks. `comparison-desktop-pass3.png` and the final desktop composite verify the fix.
4. Final: neutral desktop and mobile states were re-captured and reviewed together. No actionable P0, P1, or P2 mismatch remains.

**Interactions And Runtime Checks**

- Carousel transform changed over a 500 ms sample and uses the source-matched 50 s linear infinite rotation.
- The CTA click was exercised; with no callback supplied it leaves the URL unchanged, matching the source's no-op CTA.
- The source has no drag, scroll, or carousel controls; the implementation likewise leaves the visual carousel non-interactive.
- Reduced-motion CSS pauses the ring and disables the repeated glow flip.
- Browser logs were inspected after the final mobile reload: 0 warnings and 0 errors; only Vite debug messages, React DevTools info, and the existing code-inspector log were present.
- `npm run build`, targeted ESLint, and a targeted strict TypeScript compile passed. The repository-wide `npx tsc --noEmit` remains blocked by the existing referenced-project configuration (`TS6305`, `TS6306`, `TS6310`), unrelated to this component.

**Residual P3 Notes**

- Continuous animation means source and implementation screenshots can differ by a few rotation degrees.
- The implementation adds a visible keyboard-only focus outline to the CTA; the unfocused visual state matches the source.

final result: passed

---

Current QA target: Galaxy Button Source Recreation. Full evidence, findings, and the blocking source-capture gap are recorded in the Galaxy Button section above.

final result: blocked

---

**Design QA — Wiza Button Source Recreation**

**Comparison Target**

- Source URL: `https://wiza.learnframer.site/`
- Source visual truth: `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/source-desktop-1280x720.png`, `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/source-desktop-hover-1280x720.png`, and `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/source-mobile-390x844.png`.
- Rendered implementation: `http://127.0.0.1:4173/preview/button-wiza`.
- Implementation evidence: `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/implementation-desktop-1280x720.jpg`, `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/implementation-desktop-hover-1280x720.jpg`, and `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/implementation-mobile-390x844.jpg`.
- States compared: violet default, violet hover, and mobile default. The neutral palette is the same measured component structure with the source's `#131415` surface and `#51565a` glow values.

**Viewport And Normalization**

- Desktop source and implementation: `1280 × 720` CSS px and `1280 × 720` capture px, device scale factor `1`.
- Mobile source and implementation: `390 × 844` CSS px and `390 × 844` capture px, device scale factor `1`.
- No density scaling was required. The component crops are `160 × 80` px and include the complete button plus surrounding black canvas.
- Source default button: `131.4609 × 44 px`; implementation: `131.4844 × 44 px`. The `0.0235 px` width difference is accepted as rasterization variance.

**Full-View Comparison Evidence**

- Default and hover component comparison, arranged source-left / implementation-right: `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/comparison-default-hover.png`.
- Mobile component comparison, source-left / implementation-right: `/Users/liaomeirong/dev/blocks/design-qa-assets/button-wiza/comparison-mobile.png`.

**Focused Region Comparison Evidence**

- The button itself is only `131.5 × 44 px`, and the full component crops render its typography, all three radii, one-pixel edge treatments, Canvas particles, and bottom glow clearly at 1:1 scale. A smaller crop would remove required edge/glow evidence, so no additional focused crop is needed.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the source uses Satoshi 700 at `16/19.2 px`. The source font asset could not be bundled by the approved browser, so the closest available local system sans is used with `-0.017em` tracking. This matches the measured button width within `0.03 px`; the slight glyph-shape difference is accepted as P3.
- Spacing and layout rhythm: `44 px` height, `24 px` horizontal padding, `12/10/9 px` nested radii, 2 px border inset, 3 px cover/particle inset, and vertical text centering match the source.
- Colors and visual tokens: violet `#271950` surface, `#7043e0` glow, subtle outer border, white `0.15 → 0` default inner gradient, white `0.15 → 0.25` hover gradient, and glow opacity `0.25 → 0.8` match the measured source.
- Image quality and asset fidelity: the source uses no image, icon, or SVG asset for this button. It uses two Canvas particle layers separated by a 1 px backdrop blur; the implementation reproduces that structure with deterministic, DPR-aware Canvas rendering and reduced-motion support.
- Copy and content: the default `Get started` label matches the source and remains overridable through `children`.

**Comparison History**

1. Initial implementation used Inter 700 and measured `138.9844 px` wide, a visible P2 typography/geometry mismatch against the source's `131.4609 px`.
2. Fix: switched to the closest available system sans and calibrated tracking while preserving the source's `16 px`, weight 700, and `19.2 px` line height.
3. Post-fix evidence: desktop default/hover and mobile comparisons show the revised `131.4844 × 44 px` component with matching nested borders, glow response, particle treatment, and text baseline. No P0/P1/P2 mismatch remains.

**Interactions And Runtime Checks**

- Hover was measured and reproduced as a 250 ms transition: bottom glow opacity `0.25 → 0.8` and inner gradient bottom alpha `0 → 0.25`.
- Click was exercised on desktop/mobile; it keeps the same URL and leaves focus on the semantic button, matching the source's no-op CTA.
- Reduced-motion users receive a stable particle frame instead of continuous animation.
- The final mobile viewport has no horizontal overflow and preserves the `131.4844 × 44 px` component size.
- Browser console inspection found 0 warnings and 0 errors.
- Targeted ESLint, registry generation/build, and the Vite production build passed. Vite reports only the repository's existing large-chunk advisory.

**Implementation Checklist**

- [x] Violet and neutral variants exposed through one reusable component.
- [x] Source-matched nested surfaces, radii, border gradients, and hover glow.
- [x] Two deterministic Canvas particle layers with DPR and reduced-motion handling.
- [x] Semantic button behavior, focus-visible treatment, disabled state, and overridable content.
- [x] Desktop/mobile browser verification, visual comparison, registry metadata, and install JSON.

**Follow-up Polish**

- P3: bundle Satoshi 700 if the project later adopts a registry asset-copy convention for font files.

Current QA target: Wiza Button Source Recreation.

final result: passed

Current QA target: Generate Button Reference Adjustment. Full evidence, findings, and the passing comparison are recorded in the Generate Button section above.

final result: passed

Second adjustment iteration:

1. The lower edge still read as a single hard blue line in the first reference pass.
2. Added a soft, wider blue bloom beneath the capsule and a curved blue lower rim while preserving the thin highlight line.
3. Post-fix evidence: `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-final-unfocused-v3.png` and `/Users/liaomeirong/dev/blocks/artifacts/button-generate/implementation-focus-380x140-v3.jpg` show the revised lower reflection; the button remains `320 × 78 px`, idle, centered, and console-clean.

Current QA target: Generate Button Reference Adjustment — lower-edge refinement.

final result: passed

---

**Design QA — Flip Hero Source Recreation**

**Comparison Target**

- Source URL: `https://flip-hero.learnframer.site/`
- Implementation: `registry/creght/hero/hero-flip/hero-flip.tsx`
- Preview route: `http://127.0.0.1:5176/preview/hero-flip`
- States compared: stable initial face, two-stage 3D rotation, stable final face, and reduced-width responsive layouts.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px and `1440 × 900` capture px.
- Mobile source and implementation: `390 × 844` CSS px and `390 × 844` capture px.
- All comparison images use 1:1 source-left / implementation-right presentation; no density scaling was required.

**Comparison Evidence**

- Desktop initial: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/compare-desktop-initial-fixed.png`
- Desktop final: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/compare-desktop-final.png`
- Mobile initial: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/compare-mobile-initial-fixed.png`
- Mobile final: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/compare-mobile-final.png`
- Source desktop sequence: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/source-desktop-load-00.png` through `source-desktop-load-29.png`.
- Final implementation desktop frame: `/Users/liaomeirong/dev/blocks/source-capture/flip-hero/implementation-desktop-final.png`.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Typography: exact source Latin subsets are bundled locally for Inter Display 600, Open Runde 500, and Inter 500. The final desktop heading measures `205.0625 × 53.8984 px`, paragraph `384 × 76.5 px`, and CTA `80.1719 × 40 px`, matching the source metrics.
- Layout: the ten image tiles preserve the measured fixed sizes, vertical offsets, desktop percentages, and mobile overrides. Copy remains centered in a `384 px` column, including the source's intentional edge proximity on a `390 px` viewport.
- Motion: the source's `1200 px` perspective is reproduced with an initial `0° → -115°` rotation after a `450 ms` hold and a final `-235° → -360°` rotation. Both phases run for `450 ms` with the measured ease-in/ease-out curves.
- Layering: backface visibility is applied to the child images and copy, preventing the two faces from remaining visible after the rotation. The mobile blue/interior stack uses the same source overlap order.
- Assets: nine source images are stored locally. The single source tile that could not be exported was recreated with ImageGen from the captured reference and saved as `public/assets/flip-hero/initial-interior.png`; its small decorative use has no remaining P2 mismatch.
- Accessibility: decorative images are hidden from assistive technology, the final CTA is semantic and keyboard-focusable, and reduced-motion users receive the stable final face.

**Comparison History**

1. Initial implementation matched the geometry and transforms, but child layers ignored the parent's backface visibility and left both faces visible after the flip.
2. Fix: applied backface visibility to each direct child and restored the source mobile image stack order.
3. The first local font fallback made the final heading `221.0938 px` wide versus the source's `205.0625 px`.
4. Fix: bundled the source Inter Display, Open Runde, and Inter Latin font files locally. Final desktop and mobile text metrics now match the source.
5. Post-fix desktop and mobile comparisons were reviewed at 1:1 scale; no P0/P1/P2 mismatch remains.

**Interactions And Runtime Checks**

- Sampled both transforms at roughly `50 ms` intervals and verified the hold, ease-in first face, handoff, ease-out final face, and stable endpoint.
- Verified `1440 × 900` and `390 × 844` layouts. Mobile reports `scrollWidth = 390` and `scrollHeight = 844` with no document overflow.
- Final `Remix` CTA is visible, enabled, semantic, and exposes the configured `href`.
- Browser logs for `127.0.0.1:5176` contain 0 warnings and 0 errors.
- Targeted ESLint, registry generation/build, and the Vite production build passed. Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `hero-flip`, install JSON `public/r/hero-flip.json`, and true PNG cover `public/covers/hero-flip.png`.

final result: passed

---

Current QA target: Stack Scroll Source Recreation. Full comparison evidence, findings, fixes, and runtime checks are recorded in the Stack Scroll section above.

final result: passed

---

**Design QA — Scramble Glitch Source Recreation**

**Comparison Target**

- Source URL: `https://scramb-glitch.learnframer.site/`
- Source visual truth: `/Users/liaomeirong/dev/blocks/.source-captures/scramb-glitch/source-desktop-top-1440x900.png` and `/Users/liaomeirong/dev/blocks/.source-captures/scramb-glitch/source-mobile-top-390x844.png`.
- Implementation: `registry/creght/showcase/scramble-glitch/scramble-glitch.tsx`.
- Preview route: `http://127.0.0.1:4173/preview/scramble-glitch`.
- States compared: desktop default, card 1 hover at 80 ms / 300 ms / stable, stable labels for all five cards, keyboard focus, and the mobile desktop-only notice.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 900` CSS px, `1440 × 900` capture px, DPR 1.
- Mobile source and implementation: `390 × 844` CSS px, `390 × 844` capture px, DPR 1.
- Comparisons use source on the left and implementation on the right at 1:1 CSS-pixel scale. No density normalization or screenshot resizing was required.
- Source and implementation use the same local AVIF artwork plus the source Geist Mono and Inter font files.

**Comparison Evidence**

- Desktop default full view: `/Users/liaomeirong/dev/blocks/design-qa-assets/scramble-glitch/comparison-desktop-pass1.jpg`.
- Mobile full view: `/Users/liaomeirong/dev/blocks/design-qa-assets/scramble-glitch/comparison-mobile-final.jpg`.
- Desktop hover sequence at 80 ms, 300 ms, and stable: `/Users/liaomeirong/dev/blocks/design-qa-assets/scramble-glitch/comparison-hover-sequence-final2.jpg`.
- Stable hover focused region: `/Users/liaomeirong/dev/blocks/design-qa-assets/scramble-glitch/comparison-hover-focused-final2.jpg`.
- Final implementation hover frame: `/Users/liaomeirong/dev/blocks/design-qa-assets/scramble-glitch/implementation-hover-card1-stable-final2-1440x900.jpg`.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Default geometry matches the source to within `0.02 px`: the first projected image is `321.459 × 669.677 px` at `x 324.404 / y 370.340`, with the remaining planes preserving their measured Framer depths and offsets.
- In the final active state, the first image is `321.459 × 669.677 px` at `x 324.404 / y 318.144`; the label is `106.906 × 49.388 px` at `x 895.352 / y 669.964`. The source label starts at approximately `y 669.363`, a subpixel-level difference.
- The mobile notice line breaks, `0.4` scene scale, stack position, image crops, and overflow match the `390 × 844` source capture.
- The random intermediate glitch glyph identities intentionally vary between runs; character-count buildup, line expansion, settlement cadence, final labels, and overall duration match the visible source behavior.

**Comparison History**

1. The initial implementation matched the default desktop and mobile layouts but kept the active image at its default vertical position and nested the hover tag inside the moving content, producing a P2 hover-state offset.
2. Fix: moved the tag beside the card, applied the source `-30 px` active card offset, and calibrated the tag baseline independently.
3. Post-fix source/implementation sequence and focused-region comparisons were reviewed at 1:1 scale; no P0/P1/P2 mismatch remains.

**Interactions And Runtime Checks**

- Hover and keyboard focus activate the label; pointer leave and blur reset it. All five labels settle to `PASSERBY`, `AFTERGLOW`, `PERIPHERA`, `WILDFIELD`, and `PINKFLOW`.
- Touch-size layouts suppress hover interaction and display the source desktop-only notice. Reduced-motion users receive the stable label without scrambling.
- Browser console check reports no errors. Targeted ESLint, registry generation, shadcn registry build, and Vite production build pass; Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `scramble-glitch`, install JSON `public/r/scramble-glitch.json`, and cover `public/covers/scramble-glitch.jpg` are present in the `showcase` category.

final result: passed

---

Current QA target: Gradient Border Button Source Recreation. The complete source/implementation comparison, iteration history, findings, and runtime checks are recorded in the Gradient Border Button section above.

final result: passed

---

**Design QA — Image Unroll Scroll Source Recreation**

**Comparison Target**

- Source URL: `https://unroll-scroll.learnframer.site/`.
- Source visual truth: `/Users/liaomeirong/dev/blocks/.source-captures/unroll-scroll/desktop-y-0500.png`, `/Users/liaomeirong/dev/blocks/.source-captures/unroll-scroll/desktop-y-1000.png`, `/Users/liaomeirong/dev/blocks/.source-captures/unroll-scroll/mobile-top.png`, and `/Users/liaomeirong/dev/blocks/.source-captures/unroll-scroll/mobile-y-0844.png`.
- Implementation: `registry/creght/showcase/unroll-scroll/unroll-scroll.tsx`.
- Preview route: `http://127.0.0.1:4173/preview/unroll-scroll`.
- States compared: desktop top, scroll `500`, scroll `1000`; mobile top, scroll `844`, lower sequence, and outro.

**Viewport And Normalization**

- Desktop source and implementation: `1440 × 1000` CSS px and `1425 × 990` screenshot px after browser chrome/scrollbar exclusion.
- Mobile source and implementation: `390 × 844` CSS px and `375 × 812` screenshot px after browser chrome/scrollbar exclusion.
- Source and implementation were captured in the same approved in-app browser with identical viewport overrides. Comparisons place source on the left and implementation on the right without density scaling.
- Desktop pages measure `4500 px` tall; mobile pages measure `4032 px` tall, matching the source formula of a `calc(200svh + 1500px)` sequence plus a `100svh` outro.

**Full-View Comparison Evidence**

- Desktop scroll `500`: `/Users/liaomeirong/dev/blocks/design-qa-assets/unroll-scroll-compare-final-desktop-y500.png`.
- Desktop scroll `1000`: `/Users/liaomeirong/dev/blocks/design-qa-assets/unroll-scroll-compare-final-desktop-y1000.png`.
- Mobile top: `/Users/liaomeirong/dev/blocks/design-qa-assets/unroll-scroll-compare-final-mobile-top.png`.
- Mobile scroll `844`: `/Users/liaomeirong/dev/blocks/design-qa-assets/unroll-scroll-compare-final-mobile-y844.png`.

**Focused Region Comparison Evidence**

- The desktop scroll frames compare the sticky hero baseline, four image slots, crop, diagonal curl edge, fold shading, overlap order, and scroll progression at 1:1 scale.
- The mobile frames compare the three-line headline wrap, eyebrow baseline, description measure, image widths, alternating X positions, and text/image occlusion behavior.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Fonts and typography: the exact Inter Display Semibold, Inter Medium, and Bebas Neue source font files are bundled locally. Desktop uses the measured `144 px` display scale and mobile uses `87 px / .897`, preserving the source's two-line desktop and three-line mobile hierarchy.
- Spacing and layout rhythm: the hero uses the source `24 px` side inset and `32 px` bottom inset. The four image slots begin at `100svh + 25 px` with `350 px` vertical spacing and alternate across the measured `30%`, `59.5%`, `.5%`, and `59.5%` X positions.
- Colors and surfaces: black canvas, white display text, muted gray eyebrow/body copy, clipped image corners, fold brightness, and CTA treatment match the source palette.
- Image quality and asset fidelity: all four source AVIF images are stored locally in `public/assets/unroll-scroll/`; source crop, order, aspect ratio, and responsive sharpness are preserved without hotlinking.
- Behavior and responsiveness: requestAnimationFrame-throttled scroll updates drive the image curl and fold shading, while the sticky hero and `svh`-based sequence remain stable on desktop and mobile. Decorative duplicate images are hidden from assistive technology, the outro is a semantic link with visible focus styling, and reduced-motion users receive the resolved image state.
- P3: the source uses a WebGL mesh for sub-frame curvature and light falloff; the source reconstruction uses a performant CSS polygon/fold approximation. Geometry, timing, crop, and visible hierarchy remain source-consistent, but very fine highlight deformation can differ during motion.

**Comparison History**

1. The first mobile pass rendered the display title about 6% too narrow, a P2 typography mismatch.
2. Fix: increased the source-matched mobile display size from `82 px` to `87 px` and calibrated line height and eyebrow offset. The final mobile top frame now matches the source wrap and width.
3. The first image-layer structure used full-width transparent row wrappers above the sticky hero, which incorrectly hid text outside the visible image areas during overlap, a P1 compositing mismatch.
4. Fix: promoted each clipped image page to a direct positioned sequence child and changed the wrapper to `display: contents`; only the visible image surfaces now occlude the hero, matching the source.
5. Post-fix desktop and mobile side-by-side comparisons were reviewed together at matched viewport and scroll states; no P0/P1/P2 mismatch remains.

**Interactions And Runtime Checks**

- Scrolled the complete desktop and mobile sequences and captured top, intermediate, lower, and outro states.
- Verified all eight rendered image layers finish loading; the source CTA is visible and exposes `https://framer.link/827gyPd` with `target="_blank"`.
- Tested the Showcase category filter and confirmed `Showcase · Image Unroll Scroll` is visible in the group.
- Browser console inspection found 0 errors on both the component preview and Showcase listing.
- Targeted ESLint, registry generation, shadcn registry build, and Vite production build passed. Vite reports only the repository's existing large-chunk advisory.
- Generated registry item `unroll-scroll`, install JSON `public/r/unroll-scroll.json`, local assets, and PNG cover `public/covers/unroll-scroll.png` are present.

**Implementation Checklist**

- [x] Reusable React component in the `showcase` registry category.
- [x] Source-localized AVIF images and font files.
- [x] Responsive sticky hero, four-step scroll sequence, diagonal curl/fold treatment, and outro link.
- [x] Desktop/mobile visual comparison, responsive scroll-height parity, console check, lint, registry build, and production build.

final result: passed

---

Current QA target: Infinite Particles Hero Source Recreation. The complete source/implementation comparison, responsive deviation rationale, interaction checks, and validation history are recorded in the Infinite Particles section above.

final result: passed

---

**Design QA — Stellar Flow Hero**

**Comparison Target**

- Reference route: `http://localhost:5175/preview/hero-orb-particles`.
- Source visual truth: `/Users/liaomeirong/dev/blocks/orb-particles-clone/qa-implementation-reference-layout-webgl.png` plus a fresh in-app browser capture of the current reference route.
- Implementation route: `http://localhost:5175/preview/hero-stellar-flow`.
- Implementation evidence: fresh Codex in-app browser captures at desktop and mobile; the browser surface does not expose a persistent screenshot path, so the rendered route is the durable implementation reference.
- State: settled particle formation, default English copy, closed menu. Menu-open, Chinese copy, CTA replay, and mobile states were also tested.

**Viewport And Normalization**

- Desktop reference and implementation were compared together in the same browser comparison input at `1280 × 720` CSS px and DPR `2`.
- Mobile implementation was verified at `390 × 844` CSS px and DPR `1`.
- Desktop implementation measured `1280 × 720` with `scrollWidth: 1280`; mobile measured `390 × 844` with `scrollWidth: 390` and no horizontal overflow.
- The browser viewport override was reset after responsive verification.

**Full-View Comparison Evidence**

- The fresh desktop reference capture and the settled Stellar Flow implementation capture were opened together in the same design-QA comparison input.
- The implementation preserves the reference frame, header, title block, CTA row, lower-right description, decorative plus, and overall visual hierarchy while intentionally replacing the green orb with the supplied six-lane `ParticleField` configuration.

**Focused Region Comparison Evidence**

- A separate crop was not needed because the full-view captures render the title, header controls, buttons, borders, and description at readable scale.
- Measured desktop landmarks: heading `x 81.91`, `y 174.77`, `486.4 × 189.49`; CTA row `y 600.8`, `58 px` high; description `x 814.09`, `y 584.59`, `384 × 71.41`.
- Measured mobile landmarks: heading `x 28`, `y 152.59`, `334 × 137.46`; description `x 81.2`, `y 678`, `280.8 × 54`; CTA buttons `162 × 50` at `y 760`.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the reference Inter UI face, Georgia italic display treatment, scale, three-line wrap, tracking, opacity hierarchy, and copy are preserved.
- Spacing and layout rhythm: the inset frame, header offsets, title position, CTA spacing, lower-right copy block, and full-viewport composition match the reference layout. Mobile fills the full dynamic viewport without overflow.
- Colors and visual tokens: the supplied `#03090e` background, `#a9dbff` particle color, and `#ffa66b` accent replace the green orb palette intentionally; surrounding surfaces were tuned to cool blue neutrals without changing hierarchy or contrast.
- Image quality and asset fidelity: there are no raster placeholder assets. The central visual is the supplied WebGL particle renderer and exact requested configuration, including 12,000 particles, bloom, twinkle, rays, pointer interaction, and six-lane orbital flow.
- Copy and content: reference eyebrow, headline, description, CTA labels, and bilingual content remain intact; the brand label changes from `Orb Particles` to `Stellar Flow` to identify the new block.
- Accessibility and interaction: semantic heading and controls are retained, menu expanded/collapsed state is exposed, focus treatments remain visible, the canvas has a descriptive accessible label, and reduced-motion support is inherited from `ParticleField`.

**Comparison History**

1. The first desktop render matched the reference composition and showed the intended stellar flow after its intro animation settled.
2. The first `390 × 844` mobile pass exposed a P2 height issue: the section stopped at `720 px`, revealing the page background below the Hero.
3. Fix: changed the section minimum height to `max(720px, 100dvh)`. The post-fix mobile capture fills all `844 px`, keeps both buttons visible, and reports `scrollWidth: 390`.
4. Final desktop and mobile captures show no remaining P0/P1/P2 issue.

**Interactions And Runtime Checks**

- Tested English/Chinese switching, menu open/close, a menu action, both CTA buttons, and the particle replay path.
- Verified the particle field settles from the intro starfield into the requested six-lane spiral on desktop and mobile.
- Checked browser console warnings/errors after final rendering: none.
- Targeted ESLint passed for all five new source files.
- Registry generation and `shadcn build` passed; `public/r/hero-stellar-flow.json` includes the Hero and all four transitive renderer files.
- Vite production build passed. The only output note is the repository's existing large-chunk advisory.

**Implementation Checklist**

- [x] New reusable `HeroStellarFlow` registry block.
- [x] Exact supplied `ParticleField` configuration and portable renderer dependencies.
- [x] Reference-matched desktop layout and full-height mobile reflow.
- [x] Working bilingual control, menu, CTA replay, pointer interaction, and reduced-motion behavior.
- [x] Install JSON, registry metadata, lint, browser checks, and production build.

**Follow-up Polish**

- P3: add a dedicated registry cover capture if a persistent in-app browser screenshot export becomes available.

final result: passed

---

## Hero Lodestar — source-based particle redo (2026-09-14)

Scope: the user explicitly requested the original source for the first-screen particle effect. The existing demo layout and copy are retained.

Full QA report: [docs/hero-lodestar-qa.md](docs/hero-lodestar-qa.md).

Source visual: `artifacts/lodestar-source-port/source-desktop.png`. Rendered implementation: `artifacts/lodestar-source-port/local-desktop.png`, at `http://127.0.0.1:5175/preview/hero-lodestar`.

Compared source and local at 1440 × 900 and 390 × 844 CSS px; browser-scaled source screenshots are normalized to the local dimensions. Paired evidence: `compare-desktop.png`, `compare-particle-detail.png`, `compare-hover.png`, and `compare-mobile.png` in `artifacts/lodestar-source-port/`. DPR 2 rendering was also checked at 1280 × 720.

Earlier P1 mismatch (guessed rotating volume) fixed by porting the original 66-vertex/120-triangle star, surface sampling, point shaders, twinkle, orthographic camera and pointer dynamics. Earlier overexposure fixed by matching source canvas opacity 0.6 and removing duplicate CSS illumination. The final paired particle-region review has no remaining P0/P1/P2 findings in this scoped particle task. Fonts/layout/copy intentionally remain the current demo; color and mesh/shader fidelity were checked explicitly. Background-only bloom remains a documented P3 difference.

Targeted lint/type checks, full registry and production build pass. No local-origin browser errors were observed. Physical mobile hardware and OS reduced-motion switching remain test gaps. Source attribution and the absence of a third-party license grant are recorded in the component and README; no publishing was performed.

final result: passed
