// Rim-lit fox head artwork for footer-foxline, drawn in the hero's 1200×477 coordinate
// space and cropped to x 200–1000, y 30–477. The rim light is a stack of inset strokes whose
// widths follow the distance from the edge, so the falloff has round, band-free contours.

// <generated-outline> Regenerate with: node scripts/generate-animal-head-outlines.mjs
const OUTLINE =
  "M322 346 322.3 344 323 342.7 324 341.5 346 324.6 349.9 321 353 317.6 357.3 312 360.8 306 363.5 300 365.4 294 366.5 289 367.3 283 388.2 68 389.1 65 391 62.1 393.4 60 396 58.7 399 58 402 58.2 405 59.1 408 61.1 537 186.3 543.2 191 550 194.9 557 197.8 564 199.7 569 200.7 574 201.1 600 200 623 201.1 628 201 635 200 642.5 198 649 195.4 655 192.2 661 188 666 183.6 792 61.1 795 59.1 798 58.2 800 58 802 58.2 804 58.7 806.6 60 808 61.1 809.7 63 810.9 65 811.6 67 820 152 832.8 284 833.7 290 835.2 296 837.3 302 840.3 308 843.4 313 848 318.8 851.1 322 854 324.6 876 341.5 877.2 343 877.9 345 877.9 347 877.2 349 876 350.5 874 351.7 827.7 360 828 361 851.2 389 851.9 391 851.9 393 851.7 394 850.5 396 849.3 397 848 397.7 772 407.8 702 443.7 602 477.7 601 477.9 599 477.9 498 443.7 428 407.8 353 397.9 351 397.2 349.5 396 348.3 394 348.1 393 348.1 391 348.8 389 372 361 372.3 360 326 351.7 324 350.5 323 349.3 322.3 348Z"
const SPOTS = [[400,220,110],[800,220,110]]
// </generated-outline>

/** Rim light from the lit top edge down to the shadowed bottom of the head. */
const LIGHT = ["#ffd6a1", "#ffa14a", "#91450f", "#3e1f0a", "#0c0604"]
const BASE = "#090604"

// [distance from edge, stroke opacity] pairs that add up to an exponential falloff.
const RIM_LAYERS = Array.from({ length: 67 }, (_, i) => 2 + i * 3).map((d, i, all) => {
  const falloff = (distance: number) => 0.84 * Math.exp(-distance / 48)
  const inner = falloff(i ? all[i - 1] : 0)
  const outer = i + 1 < all.length ? falloff(d) : 0
  return [d, +(1 - (1 - inner) / (1 - outer)).toFixed(4)] as const
})

const RIM_STROKES = RIM_LAYERS.map(([d, a]) => `<use href="#o" stroke-width="${d * 2}" stroke-opacity="${a}"/>`).join("")
const SPOT_FILLS = SPOTS.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#spot)"/>`).join("")

const HEAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="200 30 800 447" width="800" height="447">
<defs>
  <path id="o" d="${OUTLINE}"/>
  <clipPath id="c"><use href="#o"/></clipPath>
  <filter id="soft" filterUnits="userSpaceOnUse" x="160" y="0" width="880" height="940"><feGaussianBlur stdDeviation="2"/></filter>
  <radialGradient id="spot" fx=".46" fy=".3">
    <stop offset="0" stop-color="#fff" stop-opacity=".24"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <filter id="grain" filterUnits="userSpaceOnUse" x="200" y="30" width="800" height="447">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 -.35"/>
  </filter>
  <mask id="m" maskUnits="userSpaceOnUse" x="160" y="0" width="880" height="940">
    <g clip-path="url(#c)">
      <g fill="none" stroke="#fff" stroke-linejoin="round" filter="url(#soft)">${RIM_STROKES}</g>
      ${SPOT_FILLS}
    </g>
  </mask>
  <linearGradient id="light" gradientUnits="userSpaceOnUse" x1="0" y1="70" x2="0" y2="477">
    <stop offset="0" stop-color="${LIGHT[0]}"/>
    <stop offset=".36" stop-color="${LIGHT[1]}"/>
    <stop offset=".62" stop-color="${LIGHT[2]}"/>
    <stop offset=".8" stop-color="${LIGHT[3]}"/>
    <stop offset="1" stop-color="${LIGHT[4]}"/>
  </linearGradient>
</defs>
<use href="#o" fill="${BASE}"/>
<rect x="200" y="30" width="800" height="447" fill="url(#light)" mask="url(#m)"/>
<rect x="200" y="30" width="800" height="447" filter="url(#grain)" clip-path="url(#c)" opacity=".025"/>
</svg>`

export const DEFAULT_FOXLINE_HEAD_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(HEAD_SVG)}`
