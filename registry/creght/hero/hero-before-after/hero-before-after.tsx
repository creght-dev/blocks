import { useEffect, useRef } from "react"

const defaultBeforeImageUrl =
  "https://ugc.talizen.com/_assets/site/2065353296729608192/1781491402429__before.png"
const defaultAfterImageUrl =
  "https://ugc.talizen.com/_assets/site/2064928373028687872/1781253416601__after.png"

export type HeroBeforeAfterProps = {
  className?: string
  beforeImageUrl?: string
  afterImageUrl?: string
  ctaHref?: string
}

export function HeroBeforeAfter({
  className = "",
  beforeImageUrl = defaultBeforeImageUrl,
  afterImageUrl = defaultAfterImageUrl,
  ctaHref = "/works",
}: HeroBeforeAfterProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const afterRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const hero = heroRef.current
    const after = afterRef.current
    if (!hero || !after) return

    let targetX = 30
    let targetY = 54
    let currentX = 30
    let currentY = 54
    let frameId = 0

    const clampPercent = (value: number) => Math.min(100, Math.max(0, value))

    const updateTarget = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      targetX = clampPercent(((event.clientX - rect.left) / rect.width) * 100)
      targetY = clampPercent(((event.clientY - rect.top) / rect.height) * 100)
    }

    const animateMask = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12

      const compact = window.matchMedia("(max-width: 860px)").matches
      const mask = compact
        ? `radial-gradient(circle 240px at ${currentX}% ${currentY}%, rgb(0 0 0) 0%, rgb(0 0 0 / 0.82) 48%, rgb(0 0 0 / 0.2) 78%, transparent 100%)`
        : `radial-gradient(circle 360px at ${currentX}% ${currentY}%, rgb(0 0 0) 0%, rgb(0 0 0 / 0.98) 36%, rgb(0 0 0 / 0.7) 57%, rgb(0 0 0 / 0.24) 78%, transparent 100%)`

      after.style.webkitMaskImage = mask
      after.style.maskImage = mask
      frameId = requestAnimationFrame(animateMask)
    }

    hero.addEventListener("pointermove", updateTarget)
    animateMask()

    return () => {
      hero.removeEventListener("pointermove", updateTarget)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className={`relative isolate h-[100dvh] min-h-[620px] w-full overflow-hidden bg-[#f3f1ed] text-neutral-950 ${className}`}
    >
      <img
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full select-none object-cover object-center brightness-[1.04] saturate-[.9]"
        src={beforeImageUrl}
        alt="Before renovation"
      />
      <img
        ref={afterRef}
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-cover object-center opacity-[.98] brightness-[1.02] saturate-[.98]"
        src={afterImageUrl}
        alt="After renovation"
      />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(245,240,233,.62)_0%,rgba(245,240,233,.28)_28%,rgba(245,240,233,0)_62%)]" />

      <div className="pointer-events-none absolute bottom-5 right-5 z-[9] hidden text-xs uppercase tracking-[.2em] text-neutral-950/60 md:block">
        Move cursor to reveal after
      </div>

      <div className="absolute left-7 right-7 top-1/2 z-[9] max-w-xl -translate-y-[35%] md:left-[72px] md:right-auto md:-translate-y-[40%]">
        <h1 className="m-0 text-4xl font-medium leading-[1.16] tracking-normal md:text-5xl lg:text-6xl">
          Designing Spaces,
          <br />
          Elevating Life.
        </h1>
        <p className="my-8 text-lg font-normal tracking-[.16em] md:mb-[46px] md:text-2xl">
          設計空間，提升生活質感。
        </p>
        <div className="mb-5 h-px w-[118px] bg-black/45" />
        <a
          className="inline-flex items-center gap-2 bg-neutral-950 px-[18px] py-[11px] text-xs uppercase tracking-[.08em] text-white transition hover:bg-neutral-800"
          href={ctaHref}
        >
          <span>View our works</span>
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8h8M8.5 4.5 12 8l-3.5 3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}

export default HeroBeforeAfter
