import { OrbitaHeroShell, type OrbitaHeroProps } from "../orbita-shared/orbita-hero-shell"

export type HeroGargantuaProps = OrbitaHeroProps

export function HeroGargantua({
  brand = "ORBITA",
  className = "",
  description = "A real-time accretion disk and ray-bending shader turn the edge of the unknown into a cinematic stage for your boldest idea.",
  eyebrow = "Beyond the event horizon / 003",
  primaryHref = "#start",
  primaryLabel = "Cross the horizon",
  secondaryHref = "#story",
  secondaryLabel = "Study the anomaly",
  title = "Where gravity bends the future.",
}: HeroGargantuaProps) {
  return (
    <OrbitaHeroShell
      brand={brand}
      className={className}
      coordinate="BH 003 · SCHWARZSCHILD FIELD"
      description={description}
      eyebrow={eyebrow}
      primaryHref={primaryHref}
      primaryLabel={primaryLabel}
      sceneLabel="GARGANTUA / BH 003"
      secondaryHref={secondaryHref}
      secondaryLabel={secondaryLabel}
      telemetry="ray bending · realtime accretion disk"
      title={title}
      world="blackhole"
    />
  )
}

export default HeroGargantua
