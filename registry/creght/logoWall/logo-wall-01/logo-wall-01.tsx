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
}

const LOGOS: Logo[] = [
  { name: "Northframe", icon: Aperture },
  { name: "Heliox", icon: Atom },
  { name: "Cubera", icon: Boxes },
  { name: "Senzi", icon: CircleDotDashed },
  { name: "Quorix", icon: Cuboid },
  { name: "Veldra", icon: Gem },
  { name: "Hexora", icon: Hexagon },
  { name: "Endly", icon: InfinityIcon },
  { name: "Orbia", icon: Orbit },
  { name: "Astera", icon: Sparkles },
  { name: "Triquo", icon: Triangle },
  { name: "Flowen", icon: Workflow },
]

export default function LogoWall01({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-01-title"
      className={`relative overflow-hidden bg-[#08090c] px-5 py-24 text-white sm:px-8 lg:py-32 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-18">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
            Trusted by AI-native teams
          </p>
          <h2
            id="logo-wall-01-title"
            className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
          >
            The teams building tomorrow run on our platform.
          </h2>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] sm:grid-cols-3 lg:grid-cols-4">
          {LOGOS.map(({ name, icon: Icon }) => (
            <div
              key={name}
              aria-label={name}
              className="group relative flex min-h-28 items-center justify-center gap-3 border-b border-r border-white/10 px-4 transition duration-300 last:border-r-0 hover:bg-white/[0.055] sm:min-h-32"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_center,rgba(139,92,246,0.13),transparent_68%)]" />
              <Icon
                aria-hidden="true"
                className="relative h-6 w-6 text-white/45 transition duration-300 group-hover:scale-105 group-hover:text-violet-300"
                strokeWidth={1.6}
              />
              <span className="relative text-sm font-medium tracking-[-0.02em] text-white/55 transition duration-300 group-hover:text-white sm:text-base">
                {name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-7 text-center text-xs text-white/35">
          Join more than 2,000 product teams shipping better work every week.
        </p>
      </div>
    </section>
  )
}
