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
