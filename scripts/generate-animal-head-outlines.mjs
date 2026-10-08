// Generates the silhouette outlines used by footer-nightcat, footer-foxline and footer-hopstack.
//
// Each animal is a smooth union of simple shapes (domes, rounded polygons, ellipses)
// evaluated as a signed distance field in the footer hero's 1200×477 coordinate space.
// The zero contour is traced with marching squares, simplified, and written as an SVG
// path into the block's art file, between its <generated-outline> markers.
//
//   node scripts/generate-animal-head-outlines.mjs
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const FOOTER_DIR = path.join(process.cwd(), "registry/creght/footer")
const BLOCKS = { cat: "footer-nightcat", fox: "footer-foxline", rabbit: "footer-hopstack" }

// Grid bounds; every silhouette must leave through the bottom edge so the traced
// contour is an open curve that the path closes below the visible area.
const X0 = 200
const X1 = 1000
const Y0 = 30
const Y1 = 620

const mirror = (points) => [...points, ...points.slice().reverse().map(([x, y]) => [1200 - x, y])]

function cubic(p0, p1, p2, p3, steps = 80) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const u = 1 - t
    return [
      u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
      u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
    ]
  })
}

function polygon(points, round = 0) {
  const segments = points.map((a, i) => [a, points[(i + 1) % points.length]])
  return (x, y) => {
    let best = Infinity
    let inside = false
    for (const [[ax, ay], [bx, by]] of segments) {
      const dx = bx - ax
      const dy = by - ay
      const len = dx * dx + dy * dy
      const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len)) : 0
      const d = (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2
      if (d < best) best = d
      if (ay > y !== by > y && x < ax + ((y - ay) * dx) / dy) inside = !inside
    }
    return (inside ? -Math.sqrt(best) : Math.sqrt(best)) - round
  }
}

// A head whose sides fall vertically below `shoulder` and arc into a flat crown.
function dome({ halfWidth, top, shoulder, crown = 0.55 }) {
  const left = 600 - halfWidth
  const reach = halfWidth * crown
  const side = cubic([left, shoulder], [left, shoulder - (shoulder - top) * 0.7], [600 - reach, top], [600, top])
  return polygon([[left, 900], ...mirror(side).slice(0, -1), [1200 - left, 900]])
}

function ellipse(cx, cy, rx, ry, degrees = 0) {
  const a = (degrees * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  return (x, y) => {
    const px = (x - cx) * cos + (y - cy) * sin
    const py = -(x - cx) * sin + (y - cy) * cos
    return (Math.hypot(px / rx, py / ry) - 1) * Math.min(rx, ry)
  }
}

function smoothUnion(shapes, k) {
  return (x, y) =>
    shapes.reduce((acc, shape) => {
      const d = shape(x, y)
      const h = Math.max(k - Math.abs(acc - d), 0) / k
      return Math.min(acc, d) - (h * h * k) / 4
    }, Infinity)
}

const flip = (points) => points.map(([x, y]) => [1200 - x, y])

const catEar = [[350, 268], [376, 94], [516, 202]]
// The fox is a closed silhouette: wide ears, cheek tufts and a pointed muzzle.
const foxEar = [[652, 214], [800, 70], [824, 318]]
const foxFace = [
  [600, 206], [684, 210], [762, 242], [812, 300], [872, 346], [816, 356], [846, 392],
  [770, 402], [700, 438], [600, 472],
]

const ANIMALS = {
  cat: {
    sdf: smoothUnion([
      dome({ halfWidth: 296, top: 186, shoulder: 400, crown: 0.72 }),
      polygon(catEar, 14),
      polygon(flip(catEar), 14),
    ], 20),
    // Soft fill centres that brighten the inside of narrow features (ears).
    spots: [[400, 220, 120], [800, 220, 120]],
  },
  fox: {
    sdf: smoothUnion([
      polygon(mirror(foxFace), 6),
      polygon(foxEar, 12),
      polygon(flip(foxEar), 12),
    ], 20),
    spots: [[400, 220, 110], [800, 220, 110]],
  },
  rabbit: {
    sdf: smoothUnion([
      dome({ halfWidth: 190, top: 252, shoulder: 470 }),
      ellipse(600, 470, 226, 150),
      ellipse(522, 190, 50, 138, -11),
      ellipse(678, 190, 50, 138, 11),
    ], 26),
    spots: [[516, 170, 90], [684, 170, 90]],
  },
}

function trace(sdf) {
  const nx = X1 - X0 + 1
  const ny = Y1 - Y0 + 1
  const field = Array.from({ length: ny }, (_, j) => Float64Array.from({ length: nx }, (_, i) => sdf(X0 + i, Y0 + j)))

  const segments = []
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]
      const values = corners.map(([a, b]) => field[b][a])
      const hits = []
      for (let c = 0; c < 4; c++) {
        const a = values[c]
        const b = values[(c + 1) % 4]
        if (a < 0 !== b < 0) {
          const p = corners[c]
          const q = corners[(c + 1) % 4]
          const t = a / (a - b)
          hits.push([X0 + p[0] + (q[0] - p[0]) * t, Y0 + p[1] + (q[1] - p[1]) * t])
        }
      }
      if (hits.length === 2) segments.push(hits)
      else if (hits.length === 4) segments.push([hits[0], hits[1]], [hits[2], hits[3]])
    }
  }

  const key = (p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`
  const adjacency = new Map()
  const coords = new Map()
  for (const [a, b] of segments) {
    if (key(a) === key(b)) continue
    for (const [p, q] of [[a, b], [b, a]]) {
      coords.set(key(p), p)
      if (!adjacency.has(key(p))) adjacency.set(key(p), [])
      adjacency.get(key(p)).push(key(q))
    }
  }

  const ends = [...adjacency].filter(([, n]) => n.length === 1).map(([k]) => k)
  const closed = ends.length === 0
  let current = closed
    ? [...coords.keys()].sort((a, b) => coords.get(a)[0] - coords.get(b)[0])[0]
    : ends.sort((a, b) => coords.get(a)[0] - coords.get(b)[0])[0]
  const seen = new Set([current])
  const points = [coords.get(current)]
  for (;;) {
    const next = adjacency.get(current).find((k) => !seen.has(k))
    if (!next) break
    seen.add(next)
    current = next
    points.push(coords.get(next))
  }
  return { points, closed }
}

function simplify(points, epsilon) {
  if (points.length < 3) return points
  const a = points[0]
  const b = points[points.length - 1]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  let max = 0
  let index = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - points[i][1]) - (a[0] - points[i][0]) * (b[1] - a[1])) / len
    if (d > max) {
      max = d
      index = i
    }
  }
  if (max <= epsilon) return [a, b]
  return [...simplify(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplify(points.slice(index), epsilon)]
}

const fmt = (v) => String(+v.toFixed(1))
for (const [name, animal] of Object.entries(ANIMALS)) {
  const { points: traced, closed } = trace(animal.sdf)
  // A closed loop has identical end points, so simplify it as two open halves.
  const half = traced.length >> 1
  const points = closed
    ? [...simplify(traced.slice(0, half + 1), 0.15).slice(0, -1), ...simplify([...traced.slice(half), traced[0]], 0.15).slice(0, -1)]
    : simplify(traced, 0.15)
  const tail = closed ? "Z" : `V900H${fmt(points[0][0])}Z`
  const d = `M${points.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(" ")}${tail}`

  const file = path.join(FOOTER_DIR, BLOCKS[name], `${BLOCKS[name]}-art.ts`)
  const source = await readFile(file, "utf8")
  const generated = `const OUTLINE =\n  "${d}"\nconst SPOTS = ${JSON.stringify(animal.spots)}\n`
  const updated = source.replace(/(\/\/ <generated-outline>[^\n]*\n)[\s\S]*?(\/\/ <\/generated-outline>)/, `$1${generated}$2`)
  if (updated === source && !source.includes(generated)) throw new Error(`No <generated-outline> markers in ${file}`)
  await writeFile(file, updated)
  console.log(`${BLOCKS[name]}: ${points.length} points`)
}
