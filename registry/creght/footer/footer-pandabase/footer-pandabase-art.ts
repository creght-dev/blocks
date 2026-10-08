// Procedural panda-head artwork, drawn in the hero's 1200×477 coordinate space and
// cropped to the head (x 240–960, y 60–477). The outline is the smooth union of two ear
// circles and a rounded head; the rim light is a stack of inset strokes whose widths
// follow the distance from the edge, so the falloff has round, band-free contours.
const OUTLINE =
  "M326 600 326 420 326.5 401 328 383 330.5 365 334.1 347 336.8 336 340.2 324 340.7 320 340.6 317 340 314.1 339.2 312 337.4 309 335.8 307 333 304.3 326 298.9 320 293.5 314.6 288 309.5 282 305.8 277 302 271.1 299 265.9 296 259.8 293 252.6 290.5 245 288.7 238 287.2 230 286.4 223 286 215 286.2 207 287 199 288.9 189 291.4 180 294.8 171 299.1 162 304 153.7 310 145.4 316.5 138 323.8 131 331.4 125 340 119.3 348.1 115 357.4 111 367 107.9 376 105.8 386 104.5 396 104 402 104.2 408 104.7 414 105.5 420 106.7 426 108.2 432 110.1 438 112.3 443 114.5 448 117.1 453.1 120 458 123.1 463.3 127 471 133.5 480 142.8 484 146.2 488 148.4 490 149 493 149.5 496 149.5 500 148.7 514 143.8 525 140.4 539 136.8 551 134.4 562 132.6 577 131 589 130.2 600 130 611 130.2 623 131 638 132.6 649 134.4 661 136.8 675 140.4 686 143.8 700 148.7 704 149.5 708 149.4 712 148.4 716 146.2 720 142.8 729 133.5 736.7 127 746 120.5 756 115 761 112.8 767 110.4 778 107.1 789 105 795 104.4 801 104 807 104 813 104.4 824 105.8 835 108.5 845.2 112 851 114.5 856 117.1 865.8 123 870 126 875 130 883 137.5 890.5 146 896.8 155 902 164 906.5 174 909.8 184 912.3 195 913.6 205 914 216 913.6 223 913 229 911.8 236 910.4 242 908.6 248 906.5 254 903.9 260 900.9 266 897.5 272 894.2 277 890.5 282 886 287.3 878 295.4 873.8 299 867 304.3 863.3 308 861.9 310 860.8 312 860 314.1 859.4 317 859.3 320 859.8 324 863.2 336 865.9 347 869.5 365 872 383 873.5 401 874 420 874 600V700H326Z"

// [distance from edge, stroke opacity] pairs that compose an exponential falloff.
const RIM_LAYERS = [[2,0.1764],[5,0.2008],[8,0.1587],[11,0.1297],[14,0.1086],[17,0.0926],[20,0.08],[23,0.0699],[26,0.0616],[29,0.0547],[32,0.0489],[35,0.0439],[38,0.0396],[41,0.0359],[44,0.0326],[47,0.0297],[50,0.0272],[53,0.0249],[56,0.0228],[59,0.021],[62,0.0194],[65,0.0179],[68,0.0165],[71,0.0153],[74,0.0141],[77,0.0131],[80,0.0122],[83,0.0113],[86,0.0105],[89,0.0098],[92,0.0091],[95,0.0085],[98,0.0079],[101,0.0074],[104,0.0069],[107,0.0064],[110,0.006],[113,0.0056],[116,0.0052],[119,0.0049],[122,0.0046],[125,0.0043],[128,0.004],[131,0.0037],[134,0.0035],[137,0.0033],[140,0.0031],[143,0.0029],[146,0.0027],[149,0.0025],[152,0.0024],[155,0.0022],[158,0.0021],[161,0.002],[164,0.0018],[167,0.0017],[170,0.0016],[173,0.0015],[176,0.0014],[179,0.0013],[182,0.0012],[185,0.0012],[188,0.0011],[191,0.001],[194,0.001],[197,0.0009],[200,0.0139]]

const RIM_STROKES = RIM_LAYERS.map(([d, a]) => `<use href="#o" stroke-width="${d * 2}" stroke-opacity="${a}"/>`).join("")

const PANDA_HEAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="240 60 720 417" width="720" height="417">
<defs>
  <path id="o" d="${OUTLINE}"/>
  <clipPath id="c"><use href="#o"/></clipPath>
  <filter id="soft" filterUnits="userSpaceOnUse" x="200" y="40" width="800" height="700"><feGaussianBlur stdDeviation="2"/></filter>
  <radialGradient id="ear" fx=".46" fy=".3">
    <stop offset="0" stop-color="#fff" stop-opacity=".24"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <filter id="grain" filterUnits="userSpaceOnUse" x="240" y="60" width="720" height="417">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 -.35"/>
  </filter>
  <mask id="m" maskUnits="userSpaceOnUse" x="200" y="40" width="800" height="700">
    <g clip-path="url(#c)">
      <g fill="none" stroke="#fff" stroke-linejoin="round" filter="url(#soft)">${RIM_STROKES}</g>
      <circle cx="396" cy="214" r="140" fill="url(#ear)"/>
      <circle cx="804" cy="214" r="140" fill="url(#ear)"/>
    </g>
  </mask>
  <linearGradient id="light" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="477">
    <stop offset="0" stop-color="#5cffb4"/>
    <stop offset=".34" stop-color="#47ea96"/>
    <stop offset=".6" stop-color="#1b6e48"/>
    <stop offset=".78" stop-color="#0b2b1f"/>
    <stop offset="1" stop-color="#030b0c"/>
  </linearGradient>
</defs>
<use href="#o" fill="#04060a"/>
<rect x="240" y="60" width="720" height="417" fill="url(#light)" mask="url(#m)"/>
<rect x="240" y="60" width="720" height="417" filter="url(#grain)" clip-path="url(#c)" opacity=".025"/>
</svg>`

export const DEFAULT_PANDA_HEAD_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PANDA_HEAD_SVG)}`
