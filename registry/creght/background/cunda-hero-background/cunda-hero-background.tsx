import { type ReactNode } from "react"
import SideRays from "./SideRays"

export type CundaHeroSettings = {
  speed: number
  rayColor1: string
  rayColor2: string
  intensity: number
  spread: number
  origin: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  tilt: number
  saturation: number
  blend: number
  falloff: number
  opacity: number
  gridOpacity: number
}

export const CUNDA_HERO_DEFAULTS: CundaHeroSettings = {
  speed: 4,
  rayColor1: "#eab308",
  rayColor2: "#0079ff",
  intensity: 3,
  spread: 3,
  origin: "top-right",
  tilt: -3,
  saturation: 2,
  blend: 1,
  falloff: 1.5,
  opacity: 1,
  gridOpacity: 0.25,
}

export type CundaHeroBackgroundProps = Partial<CundaHeroSettings> & {
  children?: ReactNode
  className?: string
}

export function CundaHeroBackgroundLayers(props: Partial<CundaHeroSettings> = {}) {
  const { gridOpacity, ...rays } = { ...CUNDA_HERO_DEFAULTS, ...props }
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1080px]"
        aria-hidden="true"
      >
        <SideRays
          {...rays}
          className="[mask-image:linear-gradient(to_bottom,#000_0%,#000_58%,transparent_100%)]"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-16 z-0 mx-auto h-[560px] max-w-[1400px] opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_12%,transparent_72%)]"
        style={{ opacity: gridOpacity }}
        aria-hidden="true"
      />
    </>
  )
}

export default function CundaHeroBackground({
  children,
  className = "",
  ...settings
}: CundaHeroBackgroundProps) {
  return (
    <section
      className={`relative isolate min-h-dvh w-full overflow-hidden bg-[#040506] ${className}`}
      aria-label="Cunda animated hero background"
    >
      <CundaHeroBackgroundLayers {...settings} />
      {children ? <div className="relative z-10 min-h-dvh">{children}</div> : null}
    </section>
  )
}

export const metadata = {
  title: "Cunda Hero Background",
  description: "Animated blue and gold rays with a subtle grid background for dark hero sections.",
}
