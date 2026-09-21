"use client"

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react"
import { twMerge } from "tailwind-merge"

export type ButtonGalaxyProps = ButtonHTMLAttributes<HTMLButtonElement>

type Particle = {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  phase: number
  opacity: number
}

const GLOW_SHADOW = [
  "0 4px 15px -8px rgb(255 255 255)",
  "0 1px 1px -0.4px rgb(63 63 232 / 19%)",
  "0 2px 2px -0.8px rgb(63 63 232 / 19%)",
  "0 4px 4px -1.2px rgb(63 63 232 / 19%)",
  "0 7px 7px -1.6px rgb(63 63 232 / 18%)",
  "0 11px 11px -2px rgb(63 63 232 / 18%)",
  "0 18px 18px -2.4px rgb(63 63 232 / 17%)",
  "0 30px 30px -2.8px rgb(63 63 232 / 15%)",
  "0 55px 55px -3.25px rgb(63 63 232 / 11%)",
  "0 0 10px -4px rgb(82 130 235 / 60%)",
].join(", ")

function GalaxyParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const startAnimationRef = useRef<(() => void) | null>(null)
  const stopAnimationRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    activeRef.current = active
    if (active) {
      startAnimationRef.current?.()
    } else {
      stopAnimationRef.current?.()
    }
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    let animationFrame: number | null = null
    let disposed = false
    let width = 0
    let height = 0
    let particles: Particle[] = []
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Number.isFinite(bounds.width) ? Math.max(0, bounds.width) : 0
      height = Number.isFinite(bounds.height) ? Math.max(0, bounds.height) : 0
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (width === 0 || height === 0) {
        particles = []
        return
      }

      let seed = 0x6d2b79f5
      const random = () => {
        seed += 0x6d2b79f5
        let value = seed
        value = Math.imul(value ^ (value >>> 15), value | 1)
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296
      }

      const visibleStart = 40
      const visibleHeight = height / 3

      particles = Array.from({ length: 128 }, (_, index) => ({
        x: random() * width,
        y: visibleStart + random() * visibleHeight,
        radius: index % 13 === 0 ? 1.9 + random() : 0.45 + random() * 1.25,
        speed: 8 + random() * 24,
        drift: 2 + random() * 8,
        phase: random() * Math.PI * 2,
        opacity: 0.28 + random() * 0.72,
      }))
    }

    const schedule = () => {
      if (disposed || !activeRef.current || reduceMotion || animationFrame !== null) return

      animationFrame = window.requestAnimationFrame((time) => {
        animationFrame = null
        draw(time)
      })
    }

    const stop = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = null
      }
    }

    function draw(time: number) {
      if (disposed) return

      context.clearRect(0, 0, width, height)

      // The canvas can briefly have no layout size while a preview mounts or
      // switches devices. Modulo by a zero visible height would make y `NaN`
      // and cause createRadialGradient to throw on the next line that uses it.
      if (width === 0 || height === 0) {
        schedule()
        return
      }

      const elapsed = time / 1000
      const visibleStart = 40
      const visibleHeight = height / 3

      for (const particle of particles) {
        // `%` keeps the sign of its left operand in JavaScript. Once the
        // animation has run for longer than one loop, the old expression
        // therefore produced negative y values and every particle faded out.
        // Reduce the travelled distance first, then wrap into [0, visibleHeight).
        const loopOffset = (elapsed * particle.speed) % visibleHeight
        const y =
          visibleStart +
          ((particle.y - visibleStart - loopOffset + visibleHeight) % visibleHeight)
        const x = particle.x + Math.sin(elapsed * 0.7 + particle.phase) * particle.drift
        const twinkle = 0.62 + Math.sin(elapsed * 2.2 + particle.phase) * 0.38
        const visibleBand = Math.max(
          0,
          1 - Math.abs(y - (visibleStart + visibleHeight * 0.62)) / (visibleHeight * 0.68),
        )
        const alpha = particle.opacity * twinkle * visibleBand

        if (alpha <= 0.02) continue

        const halo = context.createRadialGradient(x, y, 0, x, y, particle.radius * 4.5)
        halo.addColorStop(0, `rgb(238 242 255 / ${Math.min(1, alpha)})`)
        halo.addColorStop(0.2, `rgb(163 181 255 / ${alpha * 0.72})`)
        halo.addColorStop(1, "rgb(93 91 245 / 0)")
        context.fillStyle = halo
        context.beginPath()
        context.arc(x, y, particle.radius * 4.5, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = `rgb(248 250 255 / ${Math.min(1, alpha + 0.18)})`
        context.beginPath()
        context.arc(x, y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }

      schedule()
    }

    startAnimationRef.current = schedule
    stopAnimationRef.current = stop
    resize()
    draw(0)

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    return () => {
      disposed = true
      observer.disconnect()
      stop()
      startAnimationRef.current = null
      stopAnimationRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={twMerge(
        "pointer-events-none absolute -top-10 left-0 h-[300%] w-full transition-opacity duration-700",
        active ? "opacity-100" : "opacity-0",
      )}
    />
  )
}

export function ButtonGalaxy({
  children = "Generate",
  className,
  disabled,
  onBlur,
  onFocus,
  onPointerCancel,
  onPointerEnter,
  onPointerLeave,
  type = "button",
  ...props
}: ButtonGalaxyProps) {
  const [pointerActive, setPointerActive] = useState(false)
  const [focusActive, setFocusActive] = useState(false)
  const active = !disabled && (pointerActive || focusActive)

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      data-active={active ? "true" : "false"}
      data-testid="galaxy-button"
      className={twMerge(
        "group relative isolate inline-flex aspect-[72/23] w-[432px] max-w-full flex-none cursor-pointer items-center justify-center overflow-visible rounded-full border-0 bg-transparent p-0 font-sans transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9b1ff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0609] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onPointerEnter={(event) => {
        setPointerActive(true)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setPointerActive(false)
        onPointerLeave?.(event)
      }}
      onPointerCancel={(event) => {
        setPointerActive(false)
        onPointerCancel?.(event)
      }}
      onFocus={(event) => {
        setFocusActive(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocusActive(false)
        onBlur?.(event)
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#7e85b5]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full transition-[background,box-shadow] duration-700 ease-out"
        style={{
          background: active
            ? "linear-gradient(180deg, rgb(126 133 181) 0%, rgb(201 245 255) 100%)"
            : "linear-gradient(180deg, rgb(126 133 181) 0%, rgb(126 133 181) 100%)",
          boxShadow: active ? GLOW_SHADOW : "none",
        }}
      />

      <span
        aria-hidden="true"
        data-galaxy-surface="true"
        className="pointer-events-none absolute inset-[2px] overflow-hidden rounded-full bg-[#0a0609] shadow-[inset_0_0_2px_3px_rgba(0,0,0,0.3),inset_0_0_4px_8px_rgba(89,98,201,0.25)]"
      >
        <span
          className="absolute inset-0 z-[1] rounded-full transition-[background,box-shadow,opacity] duration-700"
          style={{
            background: active
              ? "radial-gradient(53% 100% at 50% 77.7%, rgb(31 26 105) 0%, rgb(21 18 84 / 0%) 100%)"
              : "radial-gradient(53% 100% at 50% 77.7%, rgb(31 26 105 / 0%) 0%, rgb(21 18 84 / 0%) 100%)",
            boxShadow: active
              ? "inset 0 -27px 27px -10px rgb(36 31 184 / 46%)"
              : "inset 0 0 0 0 rgb(36 31 184 / 0%)",
            opacity: active ? 0.55 : 1,
          }}
        />

        <span
          className={twMerge(
            "absolute inset-0 z-[2] rounded-full blur-[5px] transition-[background,opacity] duration-1000",
            active ? "animate-pulse opacity-60" : "opacity-0",
          )}
          style={{
            background: active
              ? "radial-gradient(129% 219% at 50% 88.7%, rgb(32 69 138 / 0%) 0%, rgb(38 118 209 / 50%) 93.4%, rgb(32 69 138 / 0%) 97%)"
              : "radial-gradient(129% 219% at 50% 88.7%, rgb(38 118 209 / 0%) 0%, rgb(32 69 138 / 0%) 2.7%)",
          }}
        />

        <span
          className="absolute inset-0 z-[3] rounded-full transition-[background,box-shadow] duration-700"
          style={{
            background: active
              ? "radial-gradient(58% 75% at 50% 100%, rgb(19 49 112) 0%, rgb(21 18 84 / 0%) 100%)"
              : "radial-gradient(58% 75% at 50% 100%, rgb(19 49 112 / 0%) 0%, rgb(21 18 84 / 0%) 100%)",
            boxShadow: active
              ? "inset 0 -12px 12px -7px rgb(93 91 245 / 72%)"
              : "inset 0 0 0 0 rgb(93 91 245 / 0%)",
          }}
        />

        <span
          className="absolute inset-0 z-[4] overflow-hidden rounded-full [mask-image:radial-gradient(50%_142%_at_50%_100%,#000_0%,transparent_100%)]"
        >
          <GalaxyParticles active={active} />
        </span>

        <span className="absolute inset-0 z-[7] rounded-full shadow-[inset_0_0_2px_3px_rgba(0,0,0,0.3),inset_0_0_4px_8px_rgba(89,98,201,0.25)]" />
      </span>

      <span className="relative z-[9] select-none whitespace-nowrap bg-[linear-gradient(0deg,#9699a8_20%,#fff_42%)] bg-clip-text text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.2] tracking-[-0.01em] text-transparent">
        {children}
      </span>
    </button>
  )
}

export default ButtonGalaxy
