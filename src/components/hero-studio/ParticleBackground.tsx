import { useEffect, useRef } from "react"

export interface ParticleBackgroundProps {
  /** 配色顺序：顶部底色、柔光中间色、底部强调色、粒子和光线颜色。 */
  colors?: string[]
  /** 桌面粒子数量，0–300；窄屏会按宽度减少。 */
  particleCount?: number
  /** 粒子半径，单位为 CSS px，0.3–4。 */
  particleSize?: number
  /** 粒子透明度，0–1。 */
  particleOpacity?: number
  /** 动画速度，0–3；0 为静止。 */
  speed?: number
  /** 透视光线数量，0–16。 */
  rayCount?: number
  /** 光线透明度，0–1。 */
  rayOpacity?: number
  /** 光线亮芯宽度，单位为 CSS px，0.3–3。 */
  rayWidth?: number
  /** 光线外围柔光强度，0–1；0 只保留清晰亮芯。 */
  rayGlow?: number
  /** 柔光强度，0–1。 */
  glowIntensity?: number
  /** 顶部留白范围，占背景高度的比例，0.05–0.65。 */
  topFade?: number
  /** 光线汇聚点，均以背景宽高的比例表示。 */
  focusX?: number
  focusY?: number
  /** 关闭后保留静态效果。自动遵循系统的减少动态效果设置。 */
  animated?: boolean
  /** 固定种子使编辑器重绘和尺寸变化时的分布可预测。 */
  seed?: number
  className?: string
}

const DEFAULT_COLORS = ["#fffefd", "#ffcea0", "#f4936e", "#ffffff"]
const TAU = Math.PI * 2

function bounded(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
}

function randomSequence(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let n = state
    n = Math.imul(n ^ (n >>> 15), n | 1)
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61)
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296
  }
}

function smoothstep(from: number, to: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - from) / (to - from)))
  return x * x * (3 - 2 * x)
}

/** 放在 relative + isolate 的容器中，背景自动填满父容器。无图片、外部依赖或网络请求。 */
export default function ParticleBackground({
  colors = ["#fffefd", "#ffcea0", "#f4936e", "#ffffff"],
  particleCount = 150,
  particleSize = 2.3,
  particleOpacity = 0.95,
  speed = 0.45,
  rayCount = 8,
  rayOpacity = 0.9,
  rayWidth = 1.4,
  rayGlow = 0.5,
  glowIntensity = 0.45,
  topFade = 0.2,
  focusX = 0.5,
  focusY = 0.96,
  animated = true,
  seed = 42,
  className = "",
}: ParticleBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<HTMLCanvasElement>(null)
  const [baseColor, warmColor, accentColor, lightColor] = DEFAULT_COLORS.map((fallback, i) => colors?.[i] || fallback)

  useEffect(() => {
    const host = hostRef.current
    const background = backgroundRef.current
    const canvas = particlesRef.current
    if (!host || !background || !canvas) return
    const bg = background.getContext("2d")
    const ctx = canvas.getContext("2d")
    if (!bg || !ctx) return

    // Canvas ignores invalid CSS colors, leaving the known fallback in place.
    const color = (value: string, fallback: string) => {
      bg.fillStyle = fallback
      bg.fillStyle = value
      return String(bg.fillStyle)
    }
    const palette = [baseColor, warmColor, accentColor, lightColor].map((value, i) => color(value, DEFAULT_COLORS[i]))
    // Canvas gradients need a transparent stop of the same hue, otherwise
    // interpolation toward transparent black can leave grey edges.
    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const probeContext = probe.getContext("2d")
    const transparentPalette = palette.map((tint) => {
      if (!probeContext) return "rgba(255,255,255,0)"
      probeContext.clearRect(0, 0, 1, 1)
      probeContext.fillStyle = tint
      probeContext.fillRect(0, 0, 1, 1)
      const [r, g, b] = probeContext.getImageData(0, 0, 1, 1).data
      return `rgba(${r},${g},${b},0)`
    })
    const count = Math.round(bounded(particleCount, 150, 0, 300))
    const size = bounded(particleSize, 2.3, 0.3, 4)
    const opacity = bounded(particleOpacity, 0.95, 0, 1)
    const pace = bounded(speed, 0.45, 0, 3)
    const rays = Math.round(bounded(rayCount, 8, 0, 16))
    const rayAlpha = bounded(rayOpacity, 0.9, 0, 1)
    const rayThickness = bounded(rayWidth, 1.4, 0.3, 3)
    const rayBloom = bounded(rayGlow, 0.5, 0, 1)
    const glow = bounded(glowIntensity, 0.45, 0, 1)
    const fade = bounded(topFade, 0.2, 0.05, 0.65)
    const focalX = bounded(focusX, 0.5, 0, 1)
    const focalY = bounded(focusY, 0.96, 0.2, 1.2)
    const random = randomSequence(bounded(seed, 42, 0, 0xffffffff))
    const particles = Array.from({ length: count }, () => ({
      x: random(),
      y: 0.1 + random() * 0.77,
      radius: size * (0.38 + random() * 0.82),
      phase: random() * TAU,
      depth: 0.4 + random() * 0.6,
    }))
    const rayWeights = Array.from({ length: rays }, () => 0.82 + random() * 0.18)
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let width = 0
    let height = 0
    let inView = true
    let disposed = false
    let frame = 0
    let previousTime = 0
    let elapsed = 0

    // Pre-render one reusable glow sprite, rather than creating shadows per frame.
    const sprite = document.createElement("canvas")
    sprite.width = sprite.height = 40
    const spriteContext = sprite.getContext("2d")
    if (spriteContext) {
      const halo = spriteContext.createRadialGradient(20, 20, 0, 20, 20, 20)
      halo.addColorStop(0, palette[3])
      halo.addColorStop(0.15, palette[3])
      halo.addColorStop(1, transparentPalette[3])
      spriteContext.fillStyle = halo
      spriteContext.fillRect(0, 0, 40, 40)
    }

    const paintBackground = () => {
      bg.clearRect(0, 0, width, height)
      const wash = bg.createLinearGradient(0, 0, 0, height)
      wash.addColorStop(0, palette[0])
      wash.addColorStop(fade * 0.36, palette[0])
      wash.addColorStop(Math.min(0.88, fade + 0.27), palette[1])
      wash.addColorStop(1, palette[2])
      bg.fillStyle = wash
      bg.fillRect(0, 0, width, height)

      const paintGlow = (x: number, y: number, rx: number, ry: number, colorIndex: number, alpha: number) => {
        bg.save()
        bg.translate(x, y)
        bg.scale(rx, ry)
        const light = bg.createRadialGradient(0, 0, 0, 0, 0, 1)
        light.addColorStop(0, palette[colorIndex])
        light.addColorStop(1, transparentPalette[colorIndex])
        bg.globalAlpha = alpha
        bg.fillStyle = light
        bg.fillRect(-1, -1, 2, 2)
        bg.restore()
      }
      paintGlow(width * 0.5, height * 0.3, width * 0.55, height * 0.46, 0, glow * 0.72)
      paintGlow(width * 0.48, height * 0.68, width * 0.65, height * 0.46, 1, glow)
      paintGlow(width * 0.02, height * 0.78, width * 0.5, height * 0.38, 2, glow * 0.3)
      paintGlow(width * 0.98, height * 0.76, width * 0.45, height * 0.4, 2, glow * 0.26)

      // Keep the long diagonals on the sides, with the convergence behind the UI.
      // A crisp core and low-opacity wider strokes retain detail on pale colors.
      const endX = width * focalX
      const endY = height * focalY
      rayWeights.forEach((weight, i) => {
        const left = i % 2 === 0
        const level = Math.floor(i / 2)
        const sideCount = Math.ceil((rays - (left ? 0 : 1)) / 2)
        const spread = sideCount <= 1 ? 0.5 : level / (sideCount - 1)
        const startX = width * (left ? -0.65 + spread * 0.72 : 1.65 - spread * 0.72)
        const startY = height * (-0.08 + (1 - spread) * 0.24)
        const line = bg.createLinearGradient(startX, startY, endX, endY)
        line.addColorStop(0, transparentPalette[3])
        line.addColorStop(Math.min(0.75, fade + 0.02), palette[3])
        line.addColorStop(0.78, palette[3])
        line.addColorStop(1, transparentPalette[3])
        bg.strokeStyle = line
        bg.lineCap = "round"
        bg.beginPath()
        bg.moveTo(startX, startY)
        bg.lineTo(endX, endY)
        if (rayBloom > 0) {
          bg.globalAlpha = rayAlpha * weight * rayBloom * 0.055
          bg.lineWidth = rayThickness * 12
          bg.stroke()
          bg.globalAlpha = rayAlpha * weight * rayBloom * 0.16
          bg.lineWidth = rayThickness * 4
          bg.stroke()
        }
        bg.globalAlpha = rayAlpha * weight
        bg.lineWidth = rayThickness * (0.85 + weight * 0.15)
        bg.stroke()
      })
      bg.globalAlpha = 1
    }

    const paintParticles = () => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      const visibleCount = Math.round(count * Math.min(1, Math.max(0.3, width / 1100)))
      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i]
        const seconds = elapsed * pace
        const normalizedY = 0.07 + ((p.y - 0.07 - seconds * 0.004 * p.depth) % 0.83 + 0.83) % 0.83
        const x = p.x * width + Math.sin(seconds * 0.22 + p.phase) * 9 * p.depth
        const y = normalizedY * height
        const entrance = smoothstep(0.07, fade, normalizedY)
        const exit = 1 - smoothstep(0.82, 0.9, normalizedY)
        // Leave a quieter area behind the headline and supporting paragraph.
        const center = 1 - smoothstep(0.1, 0.27, Math.abs(p.x - 0.5))
        const quiet = 1 - center * (1 - smoothstep(0.33, 0.48, normalizedY)) * 0.8
        const twinkle = 0.82 + Math.sin(seconds * 0.7 + p.phase) * 0.18
        const alpha = opacity * entrance * exit * quiet * twinkle
        ctx.globalAlpha = alpha
        ctx.fillStyle = palette[3]
        ctx.beginPath()
        ctx.arc(x, y, p.radius * 0.72, 0, TAU)
        ctx.fill()
        if (p.radius > size * 0.82 && spriteContext) {
          ctx.globalAlpha = alpha * 0.48
          const diameter = p.radius * 7
          ctx.drawImage(sprite, x - diameter / 2, y - diameter / 2, diameter, diameter)
        }
      }
      ctx.globalAlpha = 1
    }

    const shouldAnimate = () => !disposed && animated && pace > 0 && count > 0 && opacity > 0 && !motion.matches && inView && !document.hidden && width > 0 && height > 0
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
    }
    const tick = (now: number) => {
      frame = 0
      if (!shouldAnimate()) return
      if (!previousTime) previousTime = now
      const delta = now - previousTime
      // 30 fps is sufficient for slow decorative motion.
      if (delta >= 1000 / 30) {
        elapsed += Math.min(delta, 100) / 1000
        previousTime = now
        paintParticles()
      }
      frame = requestAnimationFrame(tick)
    }
    const syncMotion = () => {
      stop()
      if (disposed) return
      paintParticles()
      if (shouldAnimate()) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      if (disposed) return
      const rect = host.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        width = height = 0
        stop()
        return
      }
      width = rect.width
      height = rect.height
      // Bound both pixel density and total buffer area for large containers.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(4_000_000 / (width * height)))
      for (const layer of [background, canvas]) {
        layer.width = Math.max(1, Math.round(width * ratio))
        layer.height = Math.max(1, Math.round(height * ratio))
      }
      bg.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      paintBackground()
      syncMotion()
    }

    resize()
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize)
    resizeObserver?.observe(host)
    window.addEventListener("resize", resize)
    const intersectionObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncMotion()
    })
    intersectionObserver?.observe(host)
    motion.addEventListener("change", syncMotion)
    document.addEventListener("visibilitychange", syncMotion)

    return () => {
      disposed = true
      stop()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener("resize", resize)
      motion.removeEventListener("change", syncMotion)
      document.removeEventListener("visibilitychange", syncMotion)
    }
  }, [baseColor, warmColor, accentColor, lightColor, particleCount, particleSize, particleOpacity, speed, rayCount, rayOpacity, rayWidth, rayGlow, glowIntensity, topFade, focusX, focusY, animated, seed])

  return (
    <div ref={hostRef} className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#fffefd] ${className}`} aria-hidden="true">
      <canvas ref={backgroundRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={particlesRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
