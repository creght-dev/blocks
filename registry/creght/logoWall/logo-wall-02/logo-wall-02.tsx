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
  label: string
  icon: LucideIcon
}

const LOGOS: Logo[] = [
  { name: "Northframe", label: "Design systems", icon: Aperture },
  { name: "Heliox", label: "AI research", icon: Atom },
  { name: "Cubera", label: "Cloud platform", icon: Boxes },
  { name: "Senzi", label: "Customer data", icon: CircleDotDashed },
  { name: "Quorix", label: "Infrastructure", icon: Cuboid },
  { name: "Veldra", label: "Fintech", icon: Gem },
  { name: "Hexora", label: "Developer tools", icon: Hexagon },
  { name: "Endly", label: "Automation", icon: InfinityIcon },
  { name: "Orbia", label: "Analytics", icon: Orbit },
  { name: "Astera", label: "Generative media", icon: Sparkles },
  { name: "Triquo", label: "Decision AI", icon: Triangle },
  { name: "Flowen", label: "Team workflows", icon: Workflow },
]

const FIRST_ROW = LOGOS.slice(0, 6)
const SECOND_ROW = LOGOS.slice(6)

function LogoCard({ logo, duplicate = false }: { logo: Logo; duplicate?: boolean }) {
  const Icon = logo.icon

  return (
    <div
      aria-hidden={duplicate || undefined}
      className="group/card flex h-16 w-[210px] shrink-0 items-center gap-3.5 px-2 sm:w-[230px]"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center text-white/45 transition duration-300 group-hover/card:scale-105 group-hover/card:text-violet-200">
        <Icon aria-hidden="true" className="relative h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold tracking-[-0.025em] text-white/80 transition group-hover/card:text-white">
          {logo.name}
        </span>
        <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/25 transition group-hover/card:text-white/40">
          {logo.label}
        </span>
      </span>
    </div>
  )
}

function MarqueeLane({ logos, reverse = false }: { logos: Logo[]; reverse?: boolean }) {
  return (
    <div className="logo-wall-02-lane overflow-hidden">
      <div className={`logo-wall-02-track flex w-max gap-8 ${reverse ? "logo-wall-02-reverse" : ""}`}>
        {[...logos, ...logos].map((logo, index) => (
          <LogoCard key={`${logo.name}-${index}`} logo={logo} duplicate={index >= logos.length} />
        ))}
      </div>
    </div>
  )
}

export default function LogoWall02({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-02-title"
      className={`relative overflow-hidden bg-[#07080b] py-24 text-white lg:py-32 ${className}`}
    >
      <style>{`
        @keyframes logo-wall-02-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(calc(-50% - 1rem), 0, 0); }
        }
        .logo-wall-02-track {
          animation: logo-wall-02-scroll 34s linear infinite;
          will-change: transform;
        }
        .logo-wall-02-track.logo-wall-02-reverse {
          animation-direction: reverse;
          animation-duration: 39s;
        }
        .logo-wall-02-lane:hover .logo-wall-02-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .logo-wall-02-track { animation-play-state: paused; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_55%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[100px]" />

      <div className="relative mx-auto mb-12 max-w-3xl px-5 text-center sm:px-8 lg:mb-14">
            <div className="mb-5 flex items-center justify-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Customer network · Live
              </p>
            </div>
            <h2
              id="logo-wall-02-title"
              className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-[64px]"
            >
              Trusted by teams turning AI into everyday work.
            </h2>
      </div>

        <div className="relative w-full overflow-hidden py-3">
          <div
            aria-label="Customer logos"
            className="space-y-8 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          >
            <MarqueeLane logos={FIRST_ROW} />
            <MarqueeLane logos={SECOND_ROW} reverse />
          </div>
      </div>
    </section>
  )
}
