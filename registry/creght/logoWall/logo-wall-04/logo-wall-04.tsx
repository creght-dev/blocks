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
  { name: "Northframe", label: "Design intelligence", icon: Aperture },
  { name: "Heliox", label: "AI research", icon: Atom },
  { name: "Cubera", label: "Cloud platform", icon: Boxes },
  { name: "Senzi", label: "Customer data", icon: CircleDotDashed },
  { name: "Quorix", label: "Infrastructure", icon: Cuboid },
  { name: "Veldra", label: "Financial AI", icon: Gem },
  { name: "Hexora", label: "Developer tools", icon: Hexagon },
  { name: "Endly", label: "Automation", icon: InfinityIcon },
  { name: "Orbia", label: "Data analytics", icon: Orbit },
  { name: "Astera", label: "Generative media", icon: Sparkles },
  { name: "Triquo", label: "Decision systems", icon: Triangle },
  { name: "Flowen", label: "Team workflows", icon: Workflow },
]

const ROWS = [
  LOGOS,
  [...LOGOS.slice(4), ...LOGOS.slice(0, 4)],
  [...LOGOS.slice(8), ...LOGOS.slice(0, 8)],
  [...LOGOS.slice(2), ...LOGOS.slice(0, 2)],
]

function LogoTile({ logo, duplicate = false }: { logo: Logo; duplicate?: boolean }) {
  const Icon = logo.icon

  return (
    <div
      aria-hidden={duplicate || undefined}
      className="group/tile relative flex h-[84px] w-[220px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] px-4 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md transition duration-300 hover:border-cyan-200/30 hover:bg-white/[0.09] sm:w-[240px] sm:px-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/[0.07] via-transparent to-cyan-300/[0.06] opacity-0 transition duration-300 group-hover/tile:opacity-100" />
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white/55 ring-1 ring-inset ring-white/10 transition duration-300 group-hover/tile:text-cyan-100">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="relative min-w-0">
        <span className="block truncate text-sm font-semibold tracking-[-0.025em] text-white/80 transition group-hover/tile:text-white">
          {logo.name}
        </span>
        <span className="mt-1 block truncate text-[9px] font-medium uppercase tracking-[0.14em] text-white/25">
          {logo.label}
        </span>
      </span>
    </div>
  )
}

function MarqueeRow({
  logos,
  reverse = false,
  speed = "normal",
}: {
  logos: Logo[]
  reverse?: boolean
  speed?: "normal" | "slow"
}) {
  return (
    <div className="logo-wall-04-row overflow-hidden py-2">
      <div
        className={`logo-wall-04-track flex w-max gap-4 ${reverse ? "logo-wall-04-reverse" : ""} ${
          speed === "slow" ? "logo-wall-04-slow" : ""
        }`}
      >
        {[...logos, ...logos].map((logo, index) => (
          <LogoTile key={`${logo.name}-${index}`} logo={logo} duplicate={index >= logos.length} />
        ))}
      </div>
    </div>
  )
}

export default function LogoWall04({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-04-title"
      className={`relative min-h-[820px] overflow-hidden bg-[#06070b] py-24 text-white lg:min-h-[900px] lg:py-28 ${className}`}
    >
      <style>{`
        @keyframes logo-wall-04-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(calc(-50% - 0.5rem), 0, 0); }
        }
        .logo-wall-04-track {
          animation: logo-wall-04-scroll 52s linear infinite;
          will-change: transform;
        }
        .logo-wall-04-track.logo-wall-04-reverse { animation-direction: reverse; }
        .logo-wall-04-track.logo-wall-04-slow { animation-duration: 62s; }
        .logo-wall-04-row:hover .logo-wall-04-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .logo-wall-04-track { animation-play-state: paused; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[34rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.15] blur-[140px]" />
      <div className="pointer-events-none absolute left-[62%] top-[52%] h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-[110px]" />

      <div className="relative z-20 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/65">
          Moving with the world’s best teams
        </p>
        <h2
          id="logo-wall-04-title"
          className="text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl lg:text-[64px]"
        >
          The AI ecosystem moves faster together.
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-6 h-[500px] w-full overflow-hidden [perspective:1200px] sm:mt-2 sm:h-[560px]">
        <div
          aria-label="Customer logos in a three-dimensional marquee"
          className="absolute left-1/2 top-1/2 w-[190vw] min-w-[1220px] [transform:translate(-50%,-50%)_rotateX(10deg)_rotateY(-20deg)_rotateZ(-4deg)] [transform-style:preserve-3d] sm:w-[150vw]"
        >
          <div className="space-y-3">
            <MarqueeRow logos={ROWS[0]} />
            <MarqueeRow logos={ROWS[1]} reverse speed="slow" />
            <MarqueeRow logos={ROWS[2]} />
            <MarqueeRow logos={ROWS[3]} reverse speed="slow" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#06070b] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06070b] via-[#06070b]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#06070b] to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#06070b] to-transparent sm:w-40" />
      </div>
    </section>
  )
}
