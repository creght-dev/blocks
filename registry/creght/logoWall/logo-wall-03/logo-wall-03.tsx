"use client"

import { useRef, useState, type PointerEvent } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Aperture,
  Atom,
  Boxes,
  CircleDotDashed,
  Cuboid,
  Gem,
  Hexagon,
  Infinity as InfinityIcon,
  Orbit,
  Sparkles,
  Triangle,
  Workflow,
} from "lucide-react"

type Logo = {
  name: string
  icon: LucideIcon
  note: string
}

const LOGOS: Logo[] = [
  { name: "Northframe", icon: Aperture, note: "Design intelligence" },
  { name: "Heliox", icon: Atom, note: "Scientific workflows" },
  { name: "Cubera", icon: Boxes, note: "Infrastructure automation" },
  { name: "Senzi", icon: CircleDotDashed, note: "Customer research" },
  { name: "Quorix", icon: Cuboid, note: "Spatial computing" },
  { name: "Veldra", icon: Gem, note: "Financial operations" },
  { name: "Hexora", icon: Hexagon, note: "Developer tooling" },
  { name: "Endly", icon: InfinityIcon, note: "Continuous delivery" },
  { name: "Orbia", icon: Orbit, note: "Data orchestration" },
  { name: "Astera", icon: Sparkles, note: "Generative media" },
  { name: "Triquo", icon: Triangle, note: "Decision systems" },
  { name: "Flowen", icon: Workflow, note: "Team productivity" },
]

export default function LogoWall03({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [spotlight, setSpotlight] = useState({ x: "50%", y: "46%" })
  const activeLogo = LOGOS[activeIndex]

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = sectionRef.current?.getBoundingClientRect()
    if (!bounds) return
    setSpotlight({
      x: `${event.clientX - bounds.left}px`,
      y: `${event.clientY - bounds.top}px`,
    })
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="logo-wall-03-title"
      onPointerMove={handlePointerMove}
      className={`relative overflow-hidden bg-[#070711] px-5 py-24 text-white sm:px-8 lg:py-32 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 transition-[background] duration-200"
        style={{
          background: `radial-gradient(520px circle at ${spotlight.x} ${spotlight.y}, rgba(109, 91, 255, 0.18), transparent 68%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end lg:mb-18">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Built for intelligent business
            </p>
            <h2
              id="logo-wall-03-title"
              className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              AI leaders choose infrastructure that thinks ahead.
            </h2>
          </div>

          <div className="min-w-52 rounded-2xl border border-violet-300/15 bg-violet-400/[0.06] p-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Selected team</p>
            <p className="mt-2 text-lg font-semibold text-white">{activeLogo.name}</p>
            <p className="mt-1 text-sm text-violet-200/60">{activeLogo.note}</p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] sm:grid-cols-3 lg:grid-cols-4">
          {LOGOS.map(({ name, icon: Icon }, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={name}
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`group relative flex min-h-32 items-center justify-center gap-3 border-b border-r border-white/10 px-4 text-left outline-none transition duration-300 sm:min-h-36 ${
                  isActive ? "bg-violet-400/[0.11]" : "hover:bg-white/[0.045]"
                } focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-5 rounded-full bg-violet-500/20 blur-3xl transition duration-500 ${
                    isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                />
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition duration-300 ${
                    isActive
                      ? "border-violet-300/35 bg-violet-400/15 text-violet-200 shadow-[0_0_30px_rgba(124,92,255,0.22)]"
                      : "border-white/10 bg-white/[0.035] text-white/35 group-hover:text-white/70"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span
                  className={`relative text-sm font-medium tracking-[-0.02em] transition duration-300 sm:text-base ${
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
