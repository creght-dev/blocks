"use client"

import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
} from "react"

import "./button-gradient-border.css"

export type ButtonGradientBorderProps = ButtonHTMLAttributes<HTMLButtonElement>

type OrbitParticle = {
  angle: number
  alpha: number
  radius: number
  size: number
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

function drawSpark(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
) {
  const halo = context.createRadialGradient(x, y, 0, x, y, size * 2.4)
  halo.addColorStop(0, `rgb(255 255 255 / ${Math.min(1, alpha * 0.62)})`)
  halo.addColorStop(0.28, `rgb(219 228 239 / ${alpha * 0.22})`)
  halo.addColorStop(1, "rgb(184 199 217 / 0)")
  context.fillStyle = halo
  context.beginPath()
  context.arc(x, y, size * 2.4, 0, Math.PI * 2)
  context.fill()

  const outer = size * 2.45
  const inner = Math.max(0.35, size * 0.36)
  context.fillStyle = `rgb(255 255 255 / ${Math.min(1, alpha + 0.08)})`
  context.beginPath()
  context.moveTo(x, y - outer)
  context.lineTo(x + inner, y - inner)
  context.lineTo(x + outer, y)
  context.lineTo(x + inner, y + inner)
  context.lineTo(x, y + outer)
  context.lineTo(x - inner, y + inner)
  context.lineTo(x - outer, y)
  context.lineTo(x - inner, y - inner)
  context.closePath()
  context.fill()
}

function ParticleOrbit({ layer }: { layer: 1 | 2 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const bounds = canvas.getBoundingClientRect()
    const width = Math.max(1, bounds.width)
    const height = Math.max(1, bounds.height)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const random = createRandom(layer === 1 ? 0x27d4eb2d : 0x165667b1)
    const count = layer === 1 ? 12 : 8
    const particles: OrbitParticle[] = Array.from({ length: count }, (_, index) => ({
      angle: random() * Math.PI * 2,
      alpha: 0.18 + random() * (layer === 1 ? 0.5 : 0.72),
      radius: 73 + random() * 35,
      size: index % 7 === 0 ? 1.35 + random() * 0.9 : 0.35 + random() * 0.72,
    }))

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    for (const particle of particles) {
      const ellipse = layer === 1 ? 0.92 : 0.82
      const x = centerX + Math.cos(particle.angle) * particle.radius
      const y = centerY + Math.sin(particle.angle) * particle.radius * ellipse
      drawSpark(context, x, y, particle.size, particle.alpha)
    }
  }, [layer])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`creght-gradient-border-button__particles creght-gradient-border-button__particles--${layer}`}
    />
  )
}

export const ButtonGradientBorder = forwardRef<
  HTMLButtonElement,
  ButtonGradientBorderProps
>(function ButtonGradientBorder(
  { children = "Start for free today", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`creght-gradient-border-button ${className}`.trim()}
      data-testid="gradient-border-button"
    >
      <span
        aria-hidden="true"
        className="creght-gradient-border-button__border-mask"
      >
        <span className="creght-gradient-border-button__border-light" />
      </span>

      <ParticleOrbit layer={1} />
      <ParticleOrbit layer={2} />

      <span
        aria-hidden="true"
        className="creght-gradient-border-button__blur"
      />
      <span
        aria-hidden="true"
        className="creght-gradient-border-button__glow"
      />

      <span className="creght-gradient-border-button__content">
        <span className="creght-gradient-border-button__label">{children}</span>
      </span>
    </button>
  )
})

export default ButtonGradientBorder
