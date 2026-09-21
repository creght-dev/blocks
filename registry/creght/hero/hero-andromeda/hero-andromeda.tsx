import { OrbitaHeroShell, type OrbitaHeroProps } from "../orbita-shared/orbita-hero-shell"

export type HeroAndromedaProps = OrbitaHeroProps

export function HeroAndromeda({
  brand = "ORBITA",
  className = "",
  description = "Look through a luminous, two-armed particle galaxy inspired by M31—and give the next chapter of your product room to expand.",
  eyebrow = "Beyond the local horizon / 002",
  primaryHref = "#start",
  primaryLabel = "See what is next",
  secondaryHref = "#story",
  secondaryLabel = "Read the signal",
  title = "Look farther than the next horizon.",
}: HeroAndromedaProps) {
  return (
    <OrbitaHeroShell
      brand={brand}
      className={className}
      coordinate="M31 · 2.5M LIGHT-YEARS"
      description={description}
      eyebrow={eyebrow}
      primaryHref={primaryHref}
      primaryLabel={primaryLabel}
      sceneLabel="ANDROMEDA / M31 002"
      secondaryHref={secondaryHref}
      secondaryLabel={secondaryLabel}
      telemetry="117,500 stars · two spiral arms"
      title={title}
      world="andromeda"
    />
  )
}

export default HeroAndromeda
