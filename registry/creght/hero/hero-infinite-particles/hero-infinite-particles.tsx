import { useEffect, useRef } from "react"

type Particle = {
  t: number
  scale: number
  offset: number
  twistAngle: number
  x: number
  y: number
  vx: number
  vy: number
}

type ArcPoint = {
  t: number
  length: number
}

export type HeroInfiniteParticlesProps = {
  className?: string
  brand?: string
  eyebrow?: string
  titleLineOne?: string
  titleLineTwo?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
}

function InfinityParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    const context = canvas?.getContext("2d")
    if (!canvas || !section || !context) return

    const glowCore = "#ffffff"
    const glowMid = "#c9ced6"
    const glowOuter = "#787e88"
    const springForce = 0.0058
    const springDamping = 0.92
    const mouseForce = 9
    const rotationSpeed = 0.00085
    const twistFrequency = 1.45
    const maxParticles = 18000
    const fillsPerPoint = 8
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    const depthBuckets = Array.from({ length: 8 }, () => [] as number[])
    const mouse = { x: -9999, y: -9999, previousX: -9999, previousY: -9999, speed: 0 }

    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    let baseRadius = 0
    let bandThickness = 0
    let dotRadius = 0
    let mouseRadius = 0
    let mouseRadiusSquared = 0
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    let particles: Particle[] = []
    let twistPhase = 0
    let lastTime = 0
    let animationFrame = 0

    const infinityPoint = (t: number, scale: number) => ({
      x: scale * Math.sin(t),
      y: scale * 0.5 * Math.sin(t * 2),
    })

    const infinityNormal = (t: number, scale: number) => {
      const tangentX = scale * Math.cos(t)
      const tangentY = scale * Math.cos(t * 2)
      const length = Math.hypot(tangentX, tangentY) || 1
      return { x: -tangentY / length, y: tangentX / length }
    }

    const buildArcTable = (scale: number) => {
      const points: ArcPoint[] = [{ t: 0, length: 0 }]
      let total = 0
      let previous = infinityPoint(0, scale)

      for (let index = 1; index <= 512; index += 1) {
        const t = (index / 512) * Math.PI * 2
        const point = infinityPoint(t, scale)
        total += Math.hypot(point.x - previous.x, point.y - previous.y)
        points.push({ t, length: total })
        previous = point
      }

      return { points, total }
    }

    const tAtLength = (arc: { points: ArcPoint[]; total: number }, target: number) => {
      let low = 0
      let high = arc.points.length - 1

      while (low < high - 1) {
        const middle = (low + high) >> 1
        if (arc.points[middle].length < target) low = middle
        else high = middle
      }

      const start = arc.points[low]
      const end = arc.points[high]
      const progress = (target - start.length) / (end.length - start.length || 1)
      return start.t + (end.t - start.t) * progress
    }

    const setup = () => {
      const bounds = section.getBoundingClientRect()
      width = Math.max(1, Math.round(bounds.width))
      height = Math.max(1, Math.round(bounds.height))
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      centerX = width / 2
      centerY = height / 2

      const shortSide = Math.min(width, height)
      const longSide = Math.max(width, height)
      baseRadius = Math.min(shortSide * 0.5, longSide * 0.4)
      bandThickness = baseRadius * 0.24
      dotRadius = Math.max(0.2, Math.min(0.42, baseRadius * 0.0015))
      mouseRadius = Math.max(70, Math.min(160, baseRadius * 0.75))
      mouseRadiusSquared = mouseRadius * mouseRadius

      const spacing = prefersReducedMotion
        ? 4
        : coarsePointer || width <= 600
          ? 3
          : Math.max(2, Math.round(width / 420))
      const scale = baseRadius * 1.05
      const arc = buildArcTable(scale)
      const pathCount = Math.max(280, Math.round(arc.total / spacing))
      const fillCount = pathCount * fillsPerPoint > maxParticles
        ? Math.max(3, Math.floor(maxParticles / pathCount))
        : fillsPerPoint

      particles = []
      for (let pathIndex = 0; pathIndex < pathCount; pathIndex += 1) {
        const t = tAtLength(arc, (pathIndex / pathCount) * arc.total)
        const point = infinityPoint(t, scale)

        for (let fillIndex = 0; fillIndex < fillCount; fillIndex += 1) {
          const slot = (fillIndex + 0.5) / fillCount
          const jitter = (Math.random() - 0.5) * (0.75 / fillCount)
          const fillPosition = Math.max(-1, Math.min(1, (slot + jitter) * 2 - 1))
          particles.push({
            t,
            scale,
            offset: fillPosition * bandThickness * 0.5,
            twistAngle: ((fillIndex + 0.5) / fillCount) * Math.PI * 2,
            x: centerX + point.x,
            y: centerY + point.y,
            vx: 0,
            vy: 0,
          })
        }
      }
    }

    const drawBatch = (bucket: number[], radius: number, color: string, alpha: number) => {
      if (!bucket.length) return
      context.globalCompositeOperation = "lighter"
      context.fillStyle = color
      context.globalAlpha = alpha
      context.beginPath()
      for (let index = 0; index < bucket.length; index += 2) {
        context.moveTo(bucket[index] + radius, bucket[index + 1])
        context.arc(bucket[index], bucket[index + 1], radius, 0, Math.PI * 2)
      }
      context.fill()
    }

    const drawFrame = (time: number) => {
      const frameDelta = Math.min((time - lastTime) / 16.667, 2.5)
      lastTime = time

      const mouseDeltaX = mouse.x - mouse.previousX
      const mouseDeltaY = mouse.y - mouse.previousY
      mouse.speed = mouse.x === -9999 || mouse.previousX === -9999
        ? 0
        : Math.min(1, Math.hypot(mouseDeltaX, mouseDeltaY) / 12) * 0.85
      mouse.previousX = mouse.x
      mouse.previousY = mouse.y

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.fillStyle = "#000000"
      context.fillRect(0, 0, width, height)

      twistPhase += (prefersReducedMotion ? 0.002 : 0.0065) * frameDelta
      depthBuckets.forEach((bucket) => { bucket.length = 0 })

      for (const particle of particles) {
        particle.t -= rotationSpeed * frameDelta
        const phase = twistFrequency * particle.t + twistPhase
        const loopDepth = Math.sin(particle.t * 2 + twistPhase * 0.35)
        const shimmer = Math.sin(particle.twistAngle + phase * 0.6) * 0.08
        const depth = loopDepth * 0.72 + shimmer
        const breathing = Math.sin(phase + particle.twistAngle) * bandThickness * 0.025
        const radialPosition = particle.offset + breathing
        const base = infinityPoint(particle.t, particle.scale)
        const normal = infinityNormal(particle.t, particle.scale)
        const distanceFromCenter = Math.hypot(base.x, base.y)
        const centerFade = Math.min(1, 0.4 + (distanceFromCenter / (baseRadius * 0.1)) * 0.6)
        const targetX = centerX + base.x + normal.x * radialPosition
        const targetY = centerY + base.y + normal.y * radialPosition + depth * bandThickness * 0.2

        particle.vx += (targetX - particle.x) * springForce
        particle.vy += (targetY - particle.y) * springForce

        if (mouse.x !== -9999 && mouse.speed > 0.04) {
          const deltaX = particle.x - mouse.x
          const deltaY = particle.y - mouse.y
          const distanceSquared = deltaX * deltaX + deltaY * deltaY
          if (distanceSquared < mouseRadiusSquared) {
            const distance = Math.sqrt(distanceSquared)
            const strength = 1 - distance / mouseRadius
            const force = strength * strength * mouseForce * mouse.speed * 0.4 / (distance || 1)
            particle.vx += deltaX * force
            particle.vy += deltaY * force
          }
        }

        particle.vx *= springDamping
        particle.vy *= springDamping
        particle.x += particle.vx * frameDelta
        particle.y += particle.vy * frameDelta

        const normalizedDepth = Math.max(0.45, (depth * 0.5 + 0.5) * centerFade)
        const bucketIndex = Math.min(depthBuckets.length - 1, Math.floor(normalizedDepth * depthBuckets.length))
        depthBuckets[bucketIndex].push(particle.x, particle.y)
      }

      depthBuckets.forEach((bucket, index) => {
        const normalizedDepth = (index + 0.5) / depthBuckets.length
        const coreRadius = dotRadius * (0.5 + normalizedDepth * 0.65)
        const alpha = 0.45 + normalizedDepth * normalizedDepth * 0.5
        const color = normalizedDepth > 0.6
          ? glowCore
          : normalizedDepth > 0.25
            ? glowMid
            : glowOuter
        drawBatch(bucket, coreRadius * 2.3, glowMid, alpha * 0.38)
        drawBatch(bucket, coreRadius * 1.25, color, alpha * 0.9)
        drawBatch(bucket, coreRadius * 0.55, glowCore, alpha)
      })

      context.globalCompositeOperation = "source-over"
      context.globalAlpha = 1
      animationFrame = window.requestAnimationFrame(drawFrame)
    }

    const trackPointer = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
    }

    const clearPointer = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.previousX = -9999
      mouse.previousY = -9999
      mouse.speed = 0
    }

    setup()
    const resizeObserver = new ResizeObserver(setup)
    resizeObserver.observe(section)
    window.addEventListener("pointermove", trackPointer, { passive: true })
    window.addEventListener("pointerleave", clearPointer, { passive: true })
    animationFrame = window.requestAnimationFrame(drawFrame)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("pointermove", trackPointer)
      window.removeEventListener("pointerleave", clearPointer)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
    />
  )
}

export function HeroInfiniteParticles({
  className = "",
  brand = "NOVA",
  eyebrow = "Digital design studio",
  titleLineOne = "Infinite ideas.",
  titleLineTwo = "Precise execution.",
  description = "We craft websites and brands that move — built for performance, designed for people.",
  primaryLabel = "View Work",
  secondaryLabel = "Start a project",
}: HeroInfiniteParticlesProps) {
  return (
    <section
      className={`relative isolate min-h-[100dvh] w-full overflow-hidden bg-black font-[Arial,sans-serif] text-white ${className}`}
    >
      <InfinityParticlesCanvas />

      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-black/25 px-4 backdrop-blur-[20px] sm:px-8">
        <a
          href="#"
          className="font-[Inter,Arial,sans-serif] text-xl font-black tracking-[-0.03em] text-white no-underline"
        >
          {brand}
        </a>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex list-none items-center gap-8 p-0 text-sm text-white/65">
            <li>Work</li>
            <li>studio</li>
            <li>process</li>
            <li>journal</li>
          </ul>
        </nav>

        <a
          href="https://blocks.creght.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/35 px-3 text-[11px] font-medium tracking-[0.04em] text-white no-underline transition-opacity hover:opacity-75 sm:px-5 sm:text-[13px]"
        >
          View All Animations
        </a>
      </header>

      <div className="relative z-10 flex min-h-[100dvh] w-full items-start justify-center px-6 pb-24 pt-24 text-center md:items-center md:px-12 md:py-24">
        <div className="w-full max-w-[1100px]">
          <p className="mb-5 text-[12.48px] uppercase leading-5 tracking-[0.22em] text-[#8a8f96]">
            {eyebrow}
          </p>
          <h1 className="mb-7 font-[Inter,Arial,sans-serif] text-[clamp(3.25rem,15.4vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] md:text-[6.5rem] md:leading-[1.03] xl:text-[7.5rem] xl:leading-[126px]">
            {titleLineOne}
            <br />
            {titleLineTwo}
          </h1>
          <p className="mx-auto mb-9 max-w-[480px] text-[17.6px] leading-5 text-[#b9c0ca]">
            {description}
          </p>
          <div id="work" className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#work"
              className="inline-flex min-h-[45px] items-center justify-center rounded-full bg-[#e8eaee] px-7 text-sm text-black no-underline transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {primaryLabel}
            </a>
            <a
              href="#work"
              className="inline-flex min-h-[49px] items-center justify-center rounded-full border-2 border-white/[0.14] px-7 text-sm text-white no-underline transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroInfiniteParticles
