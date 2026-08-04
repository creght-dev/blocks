import { useEffect, useRef } from "react"

type ParticleBlueprint = {
  ox: number
  oy: number
  color: string
  baseSize: number
}

const SHAPE_SIZE = 800

function getParticleBlueprints(): ParticleBlueprint[] {
  const canvas = document.createElement("canvas")
  canvas.width = SHAPE_SIZE
  canvas.height = SHAPE_SIZE

  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return []

  const cx = SHAPE_SIZE / 2
  const cy = SHAPE_SIZE / 2

  const drawWing = (flipX: boolean) => {
    ctx.save()
    if (flipX) ctx.scale(-1, 1)

    ctx.beginPath()
    ctx.moveTo(10, -50)
    ctx.bezierCurveTo(40, -180, 180, -260, 320, -200)
    ctx.bezierCurveTo(340, -150, 330, -50, 250, 20)
    ctx.bezierCurveTo(280, 50, 280, 80, 250, 120)
    ctx.bezierCurveTo(220, 220, 140, 280, 60, 260)
    ctx.bezierCurveTo(20, 220, 10, 120, 10, 50)
    ctx.fill()

    ctx.restore()
  }

  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = "white"
  drawWing(false)
  drawWing(true)
  ctx.beginPath()
  ctx.ellipse(0, 0, 12, 80, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.globalCompositeOperation = "source-in"
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400)
  gradient.addColorStop(0, "#ffffff")
  gradient.addColorStop(0.1, "#fff5ba")
  gradient.addColorStop(0.35, "#ffd700")
  gradient.addColorStop(0.65, "#ff69b4")
  gradient.addColorStop(0.9, "#da70d6")
  gradient.addColorStop(1, "#8a2be2")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, SHAPE_SIZE, SHAPE_SIZE)

  const imageData = ctx.getImageData(0, 0, SHAPE_SIZE, SHAPE_SIZE).data
  const blueprints: ParticleBlueprint[] = []
  const step = 7

  for (let y = 0; y < SHAPE_SIZE; y += step) {
    for (let x = 0; x < SHAPE_SIZE; x += step) {
      const index = (y * SHAPE_SIZE + x) * 4
      const alpha = imageData[index + 3]
      if (alpha <= 128 || Math.random() > 0.85) continue

      const red = imageData[index]
      const green = imageData[index + 1]
      const blue = imageData[index + 2]
      const distanceFromCenter = Math.hypot(x - cx, y - cy)
      const sizeFalloff = Math.max(0.4, 1 - distanceFromCenter / 350)

      blueprints.push({
        ox: x - cx,
        oy: y - cy,
        color: `rgb(${red}, ${green}, ${blue})`,
        baseSize: step * 0.45 + sizeFalloff * step * 0.35,
      })
    }
  }

  return blueprints
}

class Particle {
  private ox: number
  private oy: number
  private x: number
  private y: number
  private vx = 0
  private vy = 0
  private color: string
  private baseSize: number
  private currentSize: number
  private friction: number
  private ease: number
  private driftAngle: number
  private driftSpeed: number
  private flickerAngle: number
  private flickerSpeed: number

  constructor(blueprint: ParticleBlueprint) {
    this.ox = blueprint.ox
    this.oy = blueprint.oy
    this.color = blueprint.color
    this.baseSize = blueprint.baseSize
    this.currentSize = blueprint.baseSize

    const randomRadius = 300 + Math.random() * 500
    const randomAngle = Math.random() * Math.PI * 2
    this.x = this.ox + Math.cos(randomAngle) * randomRadius
    this.y = this.oy + Math.sin(randomAngle) * randomRadius

    this.friction = 0.82 + Math.random() * 0.08
    this.ease = 0.02 + Math.random() * 0.04
    this.driftAngle = Math.random() * Math.PI * 2
    this.driftSpeed = 0.005 + Math.random() * 0.015
    this.flickerAngle = Math.random() * Math.PI * 2
    this.flickerSpeed = 0.02 + Math.random() * 0.04
  }

  update(
    mouseX: number,
    mouseY: number,
    canvasCx: number,
    canvasCy: number,
    scale: number,
  ) {
    this.driftAngle += this.driftSpeed
    this.flickerAngle += this.flickerSpeed

    let targetX = canvasCx + this.ox * scale + Math.sin(this.driftAngle) * 12 * scale
    let targetY = canvasCy + this.oy * scale + Math.cos(this.driftAngle) * 12 * scale
    const flickerScale = 0.6 + Math.sin(this.flickerAngle) * 0.4
    this.currentSize = this.baseSize * scale * flickerScale

    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const distance = Math.hypot(dx, dy)
    const repelRadius = 150 * scale

    if (mouseX !== -1000 && distance < repelRadius) {
      const force = (repelRadius - distance) / repelRadius
      const angle = Math.atan2(dy, dx)
      targetX -= Math.cos(angle) * force * 180 * scale
      targetY -= Math.sin(angle) * force * 180 * scale
    }

    this.vx += (targetX - this.x) * this.ease
    this.vy += (targetY - this.y) * this.ease
    this.vx *= this.friction
    this.vy *= this.friction
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(Math.round(this.x), Math.round(this.y), this.currentSize, this.currentSize)
  }
}

export type ParticleButterflyProps = {
  className?: string
}

export function ParticleButterfly({ className = "" }: ParticleButterflyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d", { alpha: false })
    if (!canvas || !ctx) return

    let animationFrameId = 0
    let initTimer = 0
    let particles: Particle[] = []
    let canvasWidth = 0
    let canvasHeight = 0
    let isDestroyed = false

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvasWidth = rect.width
      canvasHeight = rect.height
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      resizeCanvas()
      particles = getParticleBlueprints().map((blueprint) => new Particle(blueprint))
    }

    const resetMouse = () => {
      mousePos.current = { x: -1000, y: -1000 }
    }

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) updatePointer(touch.clientX, touch.clientY)
    }

    const render = () => {
      if (isDestroyed) return

      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      const isMobile = canvasWidth < 768
      const baseScale = isMobile ? 650 : 850
      const scale = Math.max(0.4, Math.min(canvasWidth, canvasHeight) / baseScale)
      const cx = canvasWidth / 2
      const cy = canvasHeight / 2

      ctx.globalCompositeOperation = "lighter"
      for (const particle of particles) {
        particle.update(mousePos.current.x, mousePos.current.y, cx, cy, scale)
        particle.draw(ctx)
      }
      ctx.globalCompositeOperation = "source-over"

      animationFrameId = window.requestAnimationFrame(render)
    }

    initTimer = window.setTimeout(() => {
      if (!isDestroyed) init()
    }, 50)

    resizeCanvas()
    render()

    window.addEventListener("resize", resizeCanvas)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", resetMouse)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
    canvas.addEventListener("touchend", resetMouse)

    return () => {
      isDestroyed = true
      window.clearTimeout(initTimer)
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", resetMouse)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", resetMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full bg-black touch-none ${className}`}
    />
  )
}

export default ParticleButterfly
