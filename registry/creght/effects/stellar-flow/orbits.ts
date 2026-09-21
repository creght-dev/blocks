type Point = [number, number]
type Segment = [Point, Point, Point, Point]
const TRACKS: Segment[][] = [
  [
    [
      [128, 2],
      [65, 24],
      [11, 93],
      [10, 162],
    ],
    [
      [10, 162],
      [9, 249],
      [79, 263],
      [88, 263],
    ],
    [
      [88, 263],
      [117, 263],
      [136, 244],
      [136, 221],
    ],
    [
      [136, 221],
      [136, 190],
      [103, 194],
      [103, 209],
    ],
  ],
  [
    [
      [225, 32],
      [132, 4],
      [30, 76],
      [30, 160],
    ],
    [
      [30, 160],
      [30, 248],
      [98, 260],
      [126, 248],
    ],
  ],
  [
    [
      [126, 215],
      [125, 223],
      [117, 237],
      [101, 236],
    ],
    [
      [101, 236],
      [89, 236],
      [76, 220],
      [76, 196],
    ],
    [
      [76, 196],
      [76, 166],
      [100, 143],
      [132, 143],
    ],
    [
      [132, 143],
      [172, 143],
      [213, 171],
      [213, 231],
    ],
    [
      [213, 231],
      [213, 276],
      [170, 328],
      [86, 317],
    ],
  ],
  [
    [
      [107, 237],
      [82, 240],
      [61, 223],
      [61, 185],
    ],
    [
      [61, 185],
      [61, 153],
      [92, 123],
      [132, 123],
    ],
    [
      [132, 123],
      [173, 123],
      [228, 150],
      [228, 225],
    ],
    [
      [228, 225],
      [228, 287],
      [168, 322],
      [121, 322],
    ],
    [
      [121, 322],
      [53, 322],
      [11, 265],
      [2, 208],
    ],
  ],
  [
    [
      [115, 211],
      [115, 226],
      [92, 227],
      [92, 205],
    ],
    [
      [92, 205],
      [92, 184],
      [110, 175],
      [128, 175],
    ],
    [
      [128, 175],
      [146, 175],
      [174, 196],
      [174, 231],
    ],
    [
      [174, 231],
      [174, 264],
      [148, 282],
      [134, 287],
    ],
    [
      [134, 287],
      [119, 293],
      [82, 297],
      [54, 269],
    ],
  ],
]
export const TRACK_SPEEDS = [0.025, 0.018, 0.021, 0.016, 0.03]
const DEPTH = [0.62, -0.46, 0.78, -0.7, 0.42]
const SAMPLES = 512

function pointAt(curve: Segment[], t: number): Point {
  const segment = Math.min(curve.length - 1, Math.floor(t * curve.length))
  const u = t * curve.length - segment,
    v = 1 - u,
    p = curve[segment]
  return [
    v * v * v * p[0][0] + 3 * v * v * u * p[1][0] + 3 * v * u * u * p[2][0] + u * u * u * p[3][0],
    v * v * v * p[0][1] + 3 * v * v * u * p[1][1] + 3 * v * u * u * p[2][1] + u * u * u * p[3][1],
  ]
}

// Each lane gets its own arc-length table. All tables run from the outside
// toward the center, regardless of the order of the authored control points.
export function buildTracks(aspect: number, galaxy = false) {
  const fit = Math.min(1, aspect / 0.84)
  return TRACKS.map((curve, lane) => {
    const table = new Float32Array((SAMPLES + 1) * 5)
    const raw: Point[] = [],
      lengths = [0]
    for (let i = 0; i <= 2048; i++) {
      const p = pointAt(curve, i / 2048)
      raw.push(p)
      if (i) lengths.push(lengths[i - 1] + Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]))
    }
    const radial = (p: Point) => Math.hypot(p[0] - 115, p[1] - 211)
    const reverse = radial(raw[0]) < radial(raw[2048])
    for (let i = 0; i <= SAMPLES; i++) {
      const f = i / SAMPLES,
        progress = reverse ? 1 - f : f,
        d = progress * lengths[2048]
      let lo = 0,
        hi = 2048
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (lengths[mid] < d) lo = mid
        else hi = mid
      }
      const a = (d - lengths[lo]) / (lengths[hi] - lengths[lo] || 1)
      const x = raw[lo][0] + (raw[hi][0] - raw[lo][0]) * a,
        y = raw[lo][1] + (raw[hi][1] - raw[lo][1]) * a
      if (galaxy) {
        const r = 0.48 * Math.pow(1 - f, 0.78),
          angle = (lane * Math.PI * 2) / 5 + r * 16
        table[i * 5] = Math.cos(angle) * r * fit
        table[i * 5 + 1] = Math.sin(angle) * r * 0.75 * fit
      } else {
        table[i * 5] = ((x - 115) / 325) * 0.9 * fit
        table[i * 5 + 1] = (((y - 211) / 325) * 0.9 + 0.11) * fit
      }
      table[i * 5 + 2] =
        Math.sin(progress * Math.PI) * Math.sin(progress * Math.PI * 1.35 + lane * 0.82) * DEPTH[lane] * 0.09
    }
    for (let i = 0; i <= SAMPLES; i++) {
      const a = Math.max(0, i - 1) * 5,
        b = Math.min(SAMPLES, i + 1) * 5
      const dx = table[b] - table[a],
        dy = table[b + 1] - table[a + 1],
        length = Math.hypot(dx, dy) || 1
      table[i * 5 + 3] = -dy / length
      table[i * 5 + 4] = dx / length
    }
    return table
  })
}

export interface OrbitState {
  tracks: Float32Array[]
  lanes: Int8Array
  phases: Float32Array
  offsets: Float32Array
  base: Float32Array
  centerY: number
  fit: number
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function createOrbit(count: number, aspect: number, rng: () => number, galaxy = false) {
  const points = new Float32Array(count * 3),
    colors = new Float32Array(count * 3),
    activity = new Float32Array(count * 3)
  const fit = Math.min(1, aspect / 0.84),
    centerY = galaxy ? 0 : 0.11 * fit
  const state: OrbitState = {
    tracks: buildTracks(aspect, galaxy),
    lanes: new Int8Array(count),
    phases: new Float32Array(count),
    offsets: new Float32Array(count * 2),
    base: new Float32Array(count * 3),
    centerY,
    fit,
  }
  let lane = 0
  for (let i = 0; i < count; i++) {
    state.phases[i] = rng()
    if (i >= count - 4) {
      state.lanes[i] = -3
      const a = ((i - count + 4) * Math.PI * 2) / 3,
        r = i === count - 1 ? 0 : 0.003
      points.set([Math.cos(a) * r, centerY + Math.sin(a) * r, 0], i * 3)
    } else if (i % 10 === 0) {
      state.lanes[i] = -1
      points.set([(rng() - 0.5) * aspect * 1.8, (rng() - 0.5) * 1.8, (rng() - 0.5) * 0.7], i * 3)
    } else if (i % 71 === 1) {
      state.lanes[i] = -2
      state.offsets[i * 2] = rng() * Math.PI * 2
      state.offsets[i * 2 + 1] = (rng() - 0.5) * 0.035
    } else {
      state.lanes[i] = lane++ % 5
      state.offsets[i * 2] = (rng() + rng() - 1) * 0.01 * fit
      state.offsets[i * 2 + 1] = (rng() + rng() - 1) * 0.02
    }
  }
  state.base.set(points)
  advanceOrbit(state, 0, points, activity)
  return { points, colors, activity, orbit: state }
}

export function advanceOrbit(
  state: OrbitState,
  seconds: number,
  points: Float32Array,
  activity: Float32Array,
) {
  for (let i = 0; i < state.lanes.length; i++) {
    const k = i * 3,
      lane = state.lanes[i]
    activity[k] = 1
    activity[k + 1] = 1
    activity[k + 2] = 0
    if (lane === -1 || lane === -3) {
      points[k] = state.base[k]
      points[k + 1] = state.base[k + 1]
      points[k + 2] = state.base[k + 2]
      continue
    }
    if (lane === -2) {
      const p = (state.phases[i] + seconds * 0.045) % 1,
        r = 0.045 * Math.pow(1 - p, 0.7) * state.fit
      const angle = state.offsets[i * 2] - p * Math.PI * 4
      points[k] = Math.cos(angle) * r
      points[k + 1] = state.centerY + Math.sin(angle) * r
      points[k + 2] = state.offsets[i * 2 + 1] * (1 - p)
      activity[k] = smooth(0, 0.06, p) * (1 - smooth(0.94, 1, p))
      activity[k + 1] = 0.75
      activity[k + 2] = 1
      continue
    }
    const phase = (state.phases[i] + seconds * TRACK_SPEEDS[lane]) % 1
    const progress = phase + (0.34 * Math.sin(phase * Math.PI * 2)) / (Math.PI * 2)
    const s = progress * SAMPLES,
      index = Math.min(SAMPLES - 1, Math.floor(s)),
      t = s - index,
      a = index * 5,
      b = a + 5,
      table = state.tracks[lane]
    const nx = table[a + 3] + (table[b + 3] - table[a + 3]) * t,
      ny = table[a + 4] + (table[b + 4] - table[a + 4]) * t
    const offset = state.offsets[i * 2]
    points[k] = table[a] + (table[b] - table[a]) * t + nx * offset
    points[k + 1] = table[a + 1] + (table[b + 1] - table[a + 1]) * t + ny * offset
    points[k + 2] = table[a + 2] + (table[b + 2] - table[a + 2]) * t + state.offsets[i * 2 + 1]
    activity[k] = smooth(0, 0.055, progress) * (1 - smooth(0.945, 1, progress))
    activity[k + 1] = 0.3 + 0.7 * Math.pow(Math.sin(progress * Math.PI), 0.68)
    activity[k + 2] = Math.max(0, 1 - Math.hypot(points[k], points[k + 1] - state.centerY) / 0.1)
  }
}
