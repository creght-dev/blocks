import { OrbitaHeroScene } from "../orbita-shared/orbita-hero-scene"

export type HeroMilkyWayProps = {
  brand?: string
  className?: string
  description?: string
  eyebrow?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  title?: string
  titleLineOne?: string
  titleLineTwo?: string
}

export function HeroMilkyWay({
  brand = "ORBITA",
  className = "",
  description = "Navigate a living field of 117,500 stars and dust particles, built for ambitious products exploring what comes next.",
  eyebrow = "Deep-space systems / 001",
  primaryHref = "#start",
  primaryLabel = "Begin the journey",
  secondaryHref = "#story",
  secondaryLabel = "Explore the system",
  title,
  titleLineOne = "A universe.",
  titleLineTwo = "Within reach.",
}: HeroMilkyWayProps) {
  const resolvedTitleLineOne = title ?? titleLineOne
  const resolvedTitleLineTwo = title ? undefined : titleLineTwo

  return (
    <section
      className={`relative isolate min-h-[100dvh] w-full overflow-hidden bg-black font-[Arial,sans-serif] text-white ${className}`}
      aria-labelledby="hero-milky-way-title"
    >
      <OrbitaHeroScene world="milkyway" className="scale-[1.16]" />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#020307_0%,rgba(2,3,7,0.96)_18%,rgba(2,3,7,0.72)_38%,rgba(2,3,7,0.08)_72%),linear-gradient(180deg,rgba(2,3,7,0.72)_0%,transparent_24%,transparent_68%,#020307_100%)] max-md:bg-[linear-gradient(180deg,rgba(2,3,7,0.36)_0%,rgba(2,3,7,0.2)_34%,rgba(2,3,7,0.82)_62%,#020307_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(90deg,black,transparent_74%)]"
        aria-hidden="true"
      />

      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-black/25 px-4 backdrop-blur-[20px] sm:px-8">
        <a
          href="#"
          className="font-[Inter,Arial,sans-serif] text-xl font-black tracking-[-0.03em] text-white no-underline"
          aria-label={`${brand} home`}
        >
          {brand}
        </a>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex list-none items-center gap-8 p-0 text-sm text-white/65">
            <li>Field</li>
            <li>system</li>
            <li>mission</li>
            <li>journal</li>
          </ul>
        </nav>

        <a
          href={primaryHref}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/35 px-3 text-[11px] font-medium tracking-[0.04em] text-white no-underline transition-opacity hover:opacity-75 sm:px-5 sm:text-[13px]"
        >
          View live field
        </a>
      </header>

      <div className="relative z-10 flex min-h-[100dvh] w-full items-start justify-center px-6 pb-24 pt-24 text-center md:items-center md:px-12 md:py-24">
        <div className="w-full max-w-[1100px]">
          <p className="mb-5 text-[12.48px] uppercase leading-5 tracking-[0.22em] text-[#8a8f96]">
            {eyebrow}
          </p>
          <h1
            id="hero-milky-way-title"
            className="mb-7 font-[Inter,Arial,sans-serif] text-[clamp(3.25rem,15.4vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] md:text-[6.5rem] md:leading-[1.03] xl:text-[7.5rem] xl:leading-[126px]"
          >
            {resolvedTitleLineOne}
            {resolvedTitleLineTwo ? (
              <>
                <br />
                {resolvedTitleLineTwo}
              </>
            ) : null}
          </h1>
          <p className="mx-auto mb-9 max-w-[480px] text-[17.6px] leading-5 text-[#b9c0ca]">
            {description}
          </p>
          <div id="start" className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={primaryHref}
              className="inline-flex min-h-[45px] items-center justify-center rounded-full bg-[#e8eaee] px-7 text-sm text-black no-underline transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              className="inline-flex min-h-[49px] items-center justify-center rounded-full border-2 border-white/[0.14] px-7 text-sm text-white no-underline transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 right-6 z-20 font-[Inter,Arial,sans-serif] text-[10px] uppercase leading-5 tracking-[1.5px] text-white/75">
        117,500 stars · <strong className="font-bold text-white">WebGL realtime</strong>
      </p>
    </section>
  )
}

export default HeroMilkyWay
