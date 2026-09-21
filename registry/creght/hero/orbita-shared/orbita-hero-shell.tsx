"use client"

import { OrbitaHeroScene, type OrbitaWorld } from "./orbita-hero-scene"

export type OrbitaHeroProps = {
  brand?: string
  className?: string
  description?: string
  eyebrow?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  title?: string
}

type OrbitaHeroShellProps = OrbitaHeroProps & {
  coordinate: string
  sceneLabel: string
  telemetry: string
  world: OrbitaWorld
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-none stroke-current stroke-[1.5]">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  )
}

function CrosshairMark() {
  return (
    <span className="relative block size-7 rounded-full border border-white/28" aria-hidden="true">
      <span className="absolute left-1/2 top-[-5px] h-[35px] w-px -translate-x-1/2 bg-white/18" />
      <span className="absolute left-[-5px] top-1/2 h-px w-[35px] -translate-y-1/2 bg-white/18" />
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </span>
  )
}

export function OrbitaHeroShell({
  brand = "ORBITA",
  className = "",
  coordinate,
  description,
  eyebrow,
  primaryHref = "#start",
  primaryLabel,
  sceneLabel,
  secondaryHref = "#story",
  secondaryLabel,
  telemetry,
  title,
  world,
}: OrbitaHeroShellProps) {
  const warm = world === "blackhole"
  const purple = world === "andromeda"
  const accentText = warm ? "text-[#ffc27e]" : purple ? "text-[#c7b9ff]" : "text-[#a9d3ff]"
  const accentBorder = warm ? "border-[#ffc27e]/35" : purple ? "border-[#c7b9ff]/35" : "border-[#a9d3ff]/35"
  const accentBackground = warm ? "bg-[#ffc27e]" : purple ? "bg-[#c7b9ff]" : "bg-[#a9d3ff]"

  return (
    <section
      className={`relative isolate flex min-h-[max(720px,100svh)] w-full overflow-hidden bg-[#020307] text-white ${className}`}
      aria-labelledby={`orbita-${world}-title`}
    >
      <OrbitaHeroScene world={world} className="left-0 md:left-[16%]" />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#020307_0%,rgba(2,3,7,0.96)_18%,rgba(2,3,7,0.72)_38%,rgba(2,3,7,0.08)_72%),linear-gradient(180deg,rgba(2,3,7,0.72)_0%,transparent_24%,transparent_68%,#020307_100%)] max-md:bg-[linear-gradient(180deg,rgba(2,3,7,0.36)_0%,rgba(2,3,7,0.2)_34%,rgba(2,3,7,0.82)_62%,#020307_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(90deg,black,transparent_74%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[max(720px,100svh)] w-full max-w-[1480px] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a href="#" className="flex items-center gap-3 text-white" aria-label={`${brand} home`}>
            <CrosshairMark />
            <span className="text-sm font-semibold tracking-[0.28em]">{brand}</span>
          </a>
          <div className="hidden items-center gap-8 text-[10px] uppercase tracking-[0.22em] text-white/42 sm:flex">
            <span>{coordinate}</span>
            <span className="flex items-center gap-2 text-white/62">
              <span className={`size-1.5 rounded-full ${accentBackground} shadow-[0_0_12px_currentColor]`} />
              Live render
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-end pb-14 pt-24 sm:items-center sm:py-20">
          <div className="max-w-[680px]">
            <p className={`mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] ${accentText}`}>
              <span className={`h-px w-10 ${accentBackground}`} />
              {eyebrow}
            </p>
            <h1
              id={`orbita-${world}-title`}
              className="max-w-[650px] text-[clamp(3.2rem,7vw,7.2rem)] font-medium leading-[0.92] tracking-[-0.065em] text-white"
            >
              {title}
            </h1>
            <p className="mt-7 max-w-[560px] text-base leading-7 text-white/58 sm:text-lg sm:leading-8">
              {description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={primaryHref}
                className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold text-[#05070c] transition duration-300 hover:-translate-y-0.5 ${accentBackground}`}
              >
                {primaryLabel}
                <ArrowIcon />
              </a>
              <a
                href={secondaryHref}
                className={`inline-flex min-h-12 items-center justify-center rounded-full border bg-black/18 px-6 text-sm font-medium text-white/76 backdrop-blur-sm transition hover:bg-white/8 hover:text-white ${accentBorder}`}
              >
                {secondaryLabel}
              </a>
            </div>
          </div>
        </div>

        <footer className="flex items-end justify-between border-t border-white/10 pt-5 text-[9px] uppercase tracking-[0.2em] text-white/34">
          <div>
            <p className={`mb-1.5 ${accentText}`}>{sceneLabel}</p>
            <p>{telemetry}</p>
          </div>
          <p className="hidden text-right sm:block">
            {world === "andromeda" ? "Dragless canvas · responsive viewport" : "Move or drag to explore"}<br />
            WebGL realtime background
          </p>
        </footer>
      </div>
    </section>
  )
}
