// Rim-lit rabbit head artwork for footer-hopstack, drawn in the hero's 1200×477 coordinate
// space and cropped to x 200–1000, y 30–477. The rim light is a stack of inset strokes whose
// widths follow the distance from the edge, so the falloff has round, band-free contours.

// <generated-outline> Regenerate with: node scripts/generate-animal-head-outlines.mjs
const OUTLINE =
  "M410 620 409.9 588 409.2 580 407.9 572 405.3 562 401.4 551 396.1 539 383 512 380.2 505 377.7 497 375.5 487 374.7 482 374.2 476 374 471 374.1 465 374.6 459 375.3 454 376.7 447 378.3 441 380.6 434 383 428 385.9 422 389.1 416 398.8 400 442.3 334 451 321.3 456 314.8 463 306.7 468.6 301 478.1 292 482.6 287 484.9 284 486.8 281 488.3 278 489.4 275 490.1 272 490.6 268 490.5 265 489.9 261 488.6 256 482.2 237 477.7 221 473.6 203 470.2 184 468.2 168 466.8 152 466.3 137 466.5 123 467.7 108 469.7 95 471.1 89 472.7 83 474.5 78 476.6 73 478.6 69 481 65.2 484 61.5 486.6 59 490 56.6 493 55.3 496 54.5 499 54.2 504 54.8 507 55.7 510 57 513 58.8 516 60.8 522 66.1 528 72.8 534 81 539.6 90 544.9 100 551.3 114 557.1 129 562.4 145 567 161.9 570.4 177 573.3 193 575.7 211 577.4 230 578 233.7 578.9 237 580.2 240 582 242.9 583.8 245 586 246.8 589 248.6 592 249.9 595 250.8 598 251.2 602 251.2 605 250.7 609 249.5 612.2 248 615 246.1 617.1 244 619.3 241 620.7 238 621.7 235 622.5 231 624.7 207 626.1 197 627.9 186 632 166 637 147.1 640.1 137 643.6 127 647 118 650.8 109 655 100.1 658.7 93 663 85.7 667 79.5 671 74.1 675 69.3 679 65.1 683 61.6 687 58.8 691 56.6 695 55 698 54.4 702 54.2 705 54.7 709 56.1 712 57.9 715 60.4 718 63.8 720.2 67 722.5 71 725.5 78 728.1 86 730.3 95 731.9 105 733 116 733.6 127 733.7 139 733.2 152 732.3 163 731.1 174 729.6 185 727.6 197 724.4 212 720.7 227 716.8 240 711.4 256 710.3 260 709.6 264 709.4 267 709.7 271 710.3 274 711.3 277 712.7 280 715 283.9 717.4 287 721.9 292 732 301.6 739 309 744.1 315 750.9 324 794.7 390 803.7 404 808.6 412 813.1 420 816.1 426 818.6 432 820.8 438 822.8 445 824.2 451 825.3 458 826 468 825.9 474 825.6 479 824.2 489 821.7 499 819.4 506 816.5 513 804 538.7 799 550 795 561 792.3 571 790.9 579 790.1 588 790 620V900H410Z"
const SPOTS = [[516,170,90],[684,170,90]]
// </generated-outline>

/** Rim light from the lit top edge down to the shadowed bottom of the head. */
const LIGHT = ["#bdeeff", "#5ccaff", "#155b8a", "#0a2a44", "#030a12"]
const BASE = "#03060b"

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

export const DEFAULT_HOPSTACK_HEAD_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(HEAD_SVG)}`
