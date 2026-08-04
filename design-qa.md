# Button 01 Design QA

- Source visual truth: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-f174282a-67b3-427b-823f-3b552c4208be.png`
- Implementation screenshot: `/private/tmp/button-01-implementation-final.jpg`
- Viewport: 1040 × 674
- State: default, enabled
- Primary interaction checks: semantic button renders enabled with pointer affordance; hover, focus-visible, active, and disabled styles are defined; no browser console errors were found.

## Full-view Comparison Evidence

The source is a framed editor screenshot while the implementation preview intentionally isolates the component on the same near-black surface. The surrounding layouts are therefore not equivalent and were not treated as fidelity targets. At the matched viewport, the implementation keeps the button at its measured source size and preserves the source's visual density.

## Focused-region Comparison Evidence

The button region was compared directly from the source and implementation images in the same visual inspection pass. The source button measures approximately 186 × 74 px; the implementation measures 186.37 × 74 px. The implementation uses a 28 px line icon, 12 px icon-to-label gap, 20 px semibold label, full pill radius, 1 px blue perimeter, dark slate-to-royal-blue gradient, restrained inset highlight, and soft dark/blue elevation.

## Required Fidelity Surfaces

- Fonts and typography: 20 px semibold system sans closely matches the compact source label; the copy is exactly `Publish`.
- Spacing and layout rhythm: button height, width, pill radius, horizontal padding, icon size, and gap match the measured source proportions.
- Colors and visual tokens: the final gradient is darker and more saturated than the first pass, matching the source's slate-blue left side and royal-blue right side; the cyan perimeter and blue aura were reduced to source-like levels.
- Image quality and asset fidelity: the source contains no raster imagery inside the button. The sparkle mark uses the closest existing Lucide icon rather than a handcrafted SVG or text symbol.
- Copy and content: the visible label matches the source exactly.

## Findings

No actionable P0, P1, or P2 differences remain.

- [P3] The Lucide `Sparkles` geometry differs slightly from the bespoke sparkle mark in the mockup. This is acceptable because it preserves the same weight, size, line style, and silhouette while staying within the existing icon system.

## Comparison History

1. Initial correction replaced the unrelated small Chinese publish button with the selected `Publish` pill button and matched its measured 186 × 74 px frame.
2. First visual comparison found the gradient too bright/desaturated, the border too cyan, and the surrounding blue glow too strong.
3. The radial highlight opacity was reduced from 0.42 to 0.16, the border from 1.5 px to 1 px, the base gradient was darkened and saturated, and the blue aura was reduced.
4. Final source/implementation comparison found no remaining P0/P1/P2 mismatch.

## Follow-up Polish

- A bespoke icon asset could remove the remaining P3 geometry difference if the original vector becomes available.

final result: passed

# Sphere Wall Card Spacing Design QA

- Source visual truth: `/var/folders/7f/bvb1j4j552z0rrvk3yvzbwxc0000gn/T/codex-clipboard-041980dd-17dc-43d5-bb30-85cd3d6e3737.png`
- Implementation screenshot: `/private/tmp/sphere-wall-fixed-rows-implementation.png`
- Mobile implementation screenshot: `/private/tmp/sphere-wall-fixed-rows-mobile.png`
- Combined comparison input: `/private/tmp/sphere-wall-fixed-rows-comparison.png`
- Source pixels: 2904 × 1542, normalized to 1440 × 766 for comparison
- Implementation pixels and CSS viewport: 1440 × 766 at 1× density
- State: automatic rotation running; default 5-column desktop configuration
- Runtime checks: horizontal drag and inertia changed the sphere transform; desktop 1440 × 766 and mobile 390 × 844 showed continuous visible gutters between every adjacent row; mobile had no horizontal overflow; browser console contained no warnings or errors.

## Full-view Comparison Evidence

The normalized source and implementation were placed side by side in one 2880 × 766 comparison image. The requested fidelity target was the compact card rhythm rather than the source artwork, aspect ratio, or exact animation phase. The implementation fills the desktop width with large curved cards and narrow black gutters in both directions. Edge cards remain naturally clipped by the viewport, matching the source's curved-wall composition without letting vertically adjacent cards overlap.

## Focused-region Comparison Evidence

The center row retained the previously verified 18–23 px horizontal gaps at the matched viewport. Vertically, cards now belong to one transformed column plane and use a fixed `card height + row gap` center step. The center column measured a 15.23 px visible gap between both adjacent row pairs; neighboring curved columns retained equal top/bottom gaps within each column. The 390 × 844 mobile capture also shows uninterrupted black gutters from top to bottom. A separate focused crop was unnecessary because the full-view comparison clearly exposes every row boundary.

## Required Fidelity Surfaces

- Fonts and typography: neither the effect nor its implementation adds UI typography; text embedded in the reference artwork was not a target for this spacing-only change.
- Spacing and layout rhythm: horizontal gaps match the compact reference rhythm; rows use a fixed 2% default gap and a shared column transform so perspective scales each card and its row interval together. Desktop cards derive their size from the configured column count while mobile retains row-based sizing.
- Colors and visual tokens: the near-black stage remains consistent with the source and preserves clean separation between cards.
- Image quality and asset fidelity: the component continues to use the user-approved Inner Globe Unsplash imagery; all eight unique images loaded without broken assets. The reference's different artwork was not requested as source content.
- Copy and content: the effect contains no editable copy. Text appearing in either set belongs to the raster images.

## Findings

No actionable P0, P1, or P2 differences remain for the requested card-spacing target.

- [P3] The source uses mostly landscape artwork while the implementation intentionally keeps the previously approved 1:1 image ratio. This is an explicit product choice and does not affect the compact gutter match.

## Comparison History

1. The earlier 5-column implementation kept row-sized cards and stretched their center positions across the desktop width, producing horizontal gaps much larger than the reference.
2. Desktop sizing was changed to derive card width from `columns`, and a separate `columnGap` control with a 2% default was introduced; portrait/mobile sizing remains row-driven.
3. The first compact-spacing pass still positioned rows by spherical latitude. The resulting nonlinear projection compressed upper and lower rows enough to create visible card overlap.
4. Vertical placement was changed to a fixed `card height + gap` step, and the horizontal 3D transform was moved to the shared column plane so every row interval receives the same perspective scale as its cards.
5. The final desktop/mobile captures show uninterrupted gutters between all adjacent rows, retain the 18–23 px horizontal rhythm, and contain no broken images, console errors, or mobile overflow.

## Follow-up Polish

- None required for the requested spacing adjustment.

final result: passed

# Timeline 01 Design QA

- Source visual truth: `https://resume.site.creght.com/`
- Source screenshots: `/private/tmp/timeline01-reference-desktop-y0.png`, `/private/tmp/timeline01-reference-desktop-y450.png`, `/private/tmp/timeline01-reference-mobile-y0.png`, `/private/tmp/timeline01-reference-mobile-y600.png`
- Implementation screenshots: `/private/tmp/timeline01-local-desktop-y0-final.png`, `/private/tmp/timeline01-local-desktop-y450-final.png`, `/private/tmp/timeline01-local-mobile-y0-final.jpg`, `/private/tmp/timeline01-local-mobile-y600-final.jpg`
- Combined comparison inputs: `/private/tmp/timeline01-qa-desktop-y0.png`, `/private/tmp/timeline01-qa-desktop-y450.png`, `/private/tmp/timeline01-qa-mobile-y0.png`, `/private/tmp/timeline01-qa-mobile-y600.png`
- Viewports: desktop 1280 × 720; mobile 390 × 844
- States: initial, partially scrolled/expanded, rapid multi-step scrolling
- Runtime checks: 61 desktop and 61 mobile scroll samples each retained exactly one visible expanded node; browser console contained no errors.

## Full-view Comparison Evidence

The source and implementation were captured at identical viewports and scroll positions, then placed side by side in the same comparison images. The desktop title position, 50vh sticky title region, 16 px track gap, path scale, node placement, and title-mask overlap agree across the initial and scrolled states. The mobile two-line title, 16 px inset path stage, 200 px sticky stage origin, active-node movement, and fixed bottom information area agree across the initial and 600 px scroll states. Source-only Creght editor controls were excluded from the clone.

## Focused-region Comparison Evidence

The desktop title spans approximately x=108–1158 at y=120 with a 64 px/1.2 line box; the implementation matches the same bounds. At the 450 px scroll state, the active Age 22 content and path correctly remain underneath the title gradient instead of drawing over it. On mobile, the title block is x=24, y=60, width=327; the active Age 22 expanded node at the initial state is x=204.367, y=367.640, width=66.648, height=80. At 600 px scroll, the active Age 26 node is x=278.484, y=143.788, while the bottom content panel starts at y=700.016 and ends at the viewport bottom. These measured implementation bounds match the source measurements within subpixel rounding.

## Required Fidelity Surfaces

- Fonts and typography: desktop and mobile sizes, line heights, weights, casing, and measured tracking match the reference. The unavailable source display font is approximated with the project system sans and measured letter spacing.
- Spacing and layout rhythm: sticky title height, mask height, track top, responsive stage inset, node offsets, and mobile information padding/gaps match the captured source.
- Colors and visual tokens: black canvas, white path, orange progress/glow, white labels, orange active labels, and the measured three-stop title gradient match the source.
- Image quality and asset fidelity: the component contains no raster source imagery. Timeline marks use the existing icon construction already present in the component.
- Copy and content: desktop labels/details and the distinct mobile summaries are restored to the captured source states.
- Motion and layering: the title mask sits above every timeline layer, active content is not clipped by the stage, and immediate active-state swaps remove opacity overlap during rapid scrolling.

## Findings

No actionable P0, P1, or P2 differences remain.

- [P3] The reference title uses a private display font that was not exposed as a downloadable site asset. The implementation compensates with measured tracking and matches the captured title bounds, though individual glyph shapes differ slightly.

## Comparison History

1. The first correction restored the expanded content height but left the title and active content in separate stacking contexts, allowing expanded content to draw above the mask.
2. Source measurements established the exact desktop/mobile sticky heights, title mask gradient, path stage bounds, and mobile active-node/bottom-panel geometry.
3. The title position, responsive path scale, node anchor geometry, mobile copy, and mobile bottom panel were rebuilt against those measurements.
4. Combined desktop and mobile comparisons found the path and nodes aligned, but rapid-scroll sampling exposed a brief two-node opacity overlap.
5. Active-node opacity transitions were removed while retaining rAF-driven geometry updates; final 61-sample desktop and mobile runs each showed exactly one expanded node at every sample.
6. Final combined comparisons found no remaining P0/P1/P2 mismatch.

## Follow-up Polish

- Replacing the fallback title face with the original private font would remove the remaining P3 glyph-shape difference if that font is later provided.

final result: passed
