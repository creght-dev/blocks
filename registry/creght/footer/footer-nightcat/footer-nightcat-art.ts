// Rim-lit cat head artwork for footer-nightcat, drawn in the hero's 1200×477 coordinate
// space and cropped to x 200–1000, y 30–477. The rim light is a stack of inset strokes whose
// widths follow the distance from the edge, so the falloff has round, band-free contours.

// <generated-outline> Regenerate with: node scripts/generate-animal-head-outlines.mjs
const OUTLINE =
  "M304 620 304 395 304.3 384 305 373 306.6 357 307.9 348 309.8 338 311.9 329 314.1 321 317 312 320 304 323.5 296 326.9 289 328.4 285 329.8 280 332.3 268 336.8 254 339.2 244 340.3 238 362.3 91 362.9 89 364 86.8 365.3 85 367.3 83 369 81.9 371 80.9 373 80.3 376 80 379 80.3 381 80.9 383 81.9 384.7 83 500 172 505 175.5 513 180 517 181.8 522 183.6 527 185 535 186.7 539 187.3 543 187.6 576 186.3 600 186 624 186.3 658 187.6 663 187.1 668 186.1 675 184.5 680 182.9 685 180.9 690 178.5 695 175.5 699 172.7 816.8 82 819 80.9 821 80.3 823 80 826 80.1 828 80.6 830 81.4 832 82.5 834 84.2 835.5 86 836.6 88 837.4 90 837.9 92 859.7 238 861 245 863.5 255 867.7 268 870.2 280 871.6 285 873.1 289 877.9 299 881.2 307 884.4 316 886.8 324 889.3 334 891.2 343 892.8 353 894 362 895.4 378 896 395 896 620V900H304Z"
const SPOTS = [[400,220,120],[800,220,120]]
// </generated-outline>

/** Rim light from the lit top edge down to the shadowed bottom of the head. */
const LIGHT = ["#d4c4ff", "#a688ff", "#4a3192", "#21164a", "#07050f"]
const BASE = "#06050b"

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

export const DEFAULT_NIGHTCAT_HEAD_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(HEAD_SVG)}`
