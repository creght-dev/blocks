"use client"

import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react"
import { twMerge } from "tailwind-merge"

export type WizaButtonTone = "violet" | "neutral"

export type WizaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glowIntensity?: number
  particleCount?: number
  particleSpeed?: number
  tone?: WizaButtonTone
}

type Spark = {
  x: number
  y: number
  radius: number
  alpha: number
  phase: number
  speed: number
  drift: number
}

const TONES: Record<
  WizaButtonTone,
  { surface: string; glow: string; particle: [number, number, number] }
> = {
  violet: {
    surface: "#271950",
    glow: "#7043e0",
    particle: [218, 206, 255],
  },
  neutral: {
    surface: "#131415",
    glow: "#51565a",
    particle: [226, 231, 235],
  },
}

function createRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function ParticleCanvas({
  color,
  count,
  layer,
  speed,
}: {
  color: [number, number, number]
  count: number
  layer: 1 | 2
  speed: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    let animationFrame = 0
    let width = 0
    let height = 0
    let sparks: Spark[] = []
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const random = createRandom(layer === 1 ? 0x7f4a7c15 : 0x42b06c9d)
      sparks = Array.from({ length: count }, (_, index) => ({
        x: 4 + random() * Math.max(1, width - 8),
        y: 3 + random() * Math.max(1, height - 6),
        radius: index % 7 === 0 ? 0.8 + random() * 0.45 : 0.28 + random() * 0.5,
        alpha: 0.2 + random() * 0.65,
        phase: random() * Math.PI * 2,
        speed: 0.7 + random() * 1.6,
        drift: 0.3 + random() * 0.8,
      }))
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const elapsed = reduceMotion ? 0 : (time / 1000) * speed

      for (const spark of sparks) {
        const x = spark.x + Math.sin(elapsed * 0.45 + spark.phase) * spark.drift
        const y =
          ((spark.y - elapsed * spark.speed + height + 4) % (height + 8)) - 4
        const twinkle = 0.68 + Math.sin(elapsed * 1.75 + spark.phase) * 0.24
        const edgeFade = Math.max(
          0.35,
          Math.min(1, y / 6, (height - y) / 6),
        )
        const alpha = Math.max(0, spark.alpha * twinkle * edgeFade)

        if (alpha < 0.025) continue

        const haloRadius = spark.radius * (layer === 1 ? 4.8 : 3.2)
        const halo = context.createRadialGradient(x, y, 0, x, y, haloRadius)
        halo.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`)
        halo.addColorStop(
          0.28,
          `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.42})`,
        )
        halo.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`)
        context.fillStyle = halo
        context.beginPath()
        context.arc(x, y, haloRadius, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = `rgba(255, 255, 255, ${Math.min(0.92, alpha + 0.12)})`
        context.beginPath()
        context.arc(x, y, spark.radius, 0, Math.PI * 2)
        context.fill()
      }

      if (!reduceMotion && speed > 0) {
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    draw(0)

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [color, count, layer, speed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  )
}

export function WizaButton({
  children = "Get started",
  className,
  disabled,
  glowIntensity = 1,
  particleCount = 26,
  particleSpeed = 1,
  style,
  tone = "violet",
  type = "button",
  ...props
}: WizaButtonProps) {
  const palette = TONES[tone]
  const normalizedParticleCount = Math.max(8, Math.min(120, Math.round(particleCount)))
  const backParticleCount = Math.round(normalizedParticleCount * (15 / 26))
  const frontParticleCount = normalizedParticleCount - backParticleCount
  const normalizedParticleSpeed = Math.max(0, Math.min(4, particleSpeed))
  const normalizedGlowIntensity = Math.max(0, Math.min(2, glowIntensity))
  const paletteStyle = {
    "--wiza-glow-hover": Math.min(1, 0.8 * normalizedGlowIntensity),
    "--wiza-glow-idle": Math.min(1, 0.25 * normalizedGlowIntensity),
    "--wiza-surface": palette.surface,
    "--wiza-glow": palette.glow,
    fontFamily: 'Arial, "Helvetica Neue", sans-serif',
    letterSpacing: "-0.017em",
    ...style,
  } as CSSProperties

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      data-testid="wiza-button"
      data-tone={tone}
      style={paletteStyle}
      className={twMerge(
        "group relative isolate inline-flex h-11 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-white/[0.05] bg-transparent px-6 font-sans text-base font-bold leading-[1.2] text-white transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[var(--wiza-surface)]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] rounded-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_100%)]"
        style={{ inset: 2 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] rounded-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.25)_100%)] opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ inset: 2 }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[3] rounded-[9px] bg-[var(--wiza-surface)]"
        style={{ inset: 3 }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-33px] left-[-10px] right-[-10px] top-[39px] z-[4] rounded-[9px] bg-[var(--wiza-glow)] opacity-[var(--wiza-glow-idle)] blur-[15px] transition-opacity duration-250 ease-out group-hover:opacity-[var(--wiza-glow-hover)] group-focus-visible:opacity-[var(--wiza-glow-hover)]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[5] overflow-hidden rounded-[9px]"
        style={{ inset: 3 }}
      >
        <ParticleCanvas
          color={palette.particle}
          count={backParticleCount}
          layer={1}
          speed={normalizedParticleSpeed}
        />
        <span className="pointer-events-none absolute inset-0 z-[1] rounded-[9px] bg-white/[0.01] backdrop-blur-[1px]" />
        <span className="pointer-events-none absolute inset-0 z-[2]">
          <ParticleCanvas
            color={palette.particle}
            count={frontParticleCount}
            layer={2}
            speed={normalizedParticleSpeed}
          />
        </span>
      </span>

      <span className="relative z-[6] select-none whitespace-nowrap">
        {children}
      </span>
    </button>
  )
}

export default WizaButton
