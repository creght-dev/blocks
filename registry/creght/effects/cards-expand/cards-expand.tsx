import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/_assets/site/2064188570427461632/1782288495943__hero_04.png",
  "https://fsu.creght.com/site/2083536173505974272/1785753375309__image.png",
  "https://fsu.creght.com/site/2083536173505974272/1785589242647__hero_molecular.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1785746498550__inner_globe.png",
  "https://fsu.creght.com/site/2083536173505974272/1785746500451__sphere_wall.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1785837203261__about_cursor_trail.png",
  "https://fsu.creght.com/site/2083536173505974272/1785589257626__features_03.png",
] as const

const CARD_CONTENT = [
  {
    accent: "No. 07",
    eyebrow: "FIELD NOTES",
    footer: "Open-air studies",
    shell: "bg-[#f1f1ed] text-[#11110f]",
    title: "Quiet forms for wide horizons",
  },
  {
    accent: "MOVE",
    eyebrow: "MOTION / 01",
    footer: "Built for the long way",
    shell: "bg-[#17181a] text-white",
    title: "Objects made to keep moving",
  },
  {
    accent: "STUDIO",
    eyebrow: "PORTRAIT / 14",
    footer: "People behind the work",
    shell: "bg-[#ffc52f] text-[#15120b]",
    title: "A room full of good ideas",
  },
  {
    accent: "FORM",
    eyebrow: "DROP / 03",
    footer: "Limited material study",
    shell: "bg-[#ff8311] text-[#201007]",
    title: "Soft edges. Strong signal.",
  },
  {
    accent: "42",
    eyebrow: "OBJECT / 42",
    footer: "Archive selection",
    shell: "bg-[#efefec] text-[#151514]",
    title: "A future classic, catalogued",
  },
  {
    accent: "PULSE",
    eyebrow: "CITY / 24",
    footer: "After-dark edition",
    shell: "bg-[#b65fe8] text-[#160d1c]",
    title: "The city keeps its own rhythm",
  },
  {
    accent: "RUN",
    eyebrow: "PACE / 08",
    footer: "Everyday performance",
    shell: "bg-[#278af4] text-white",
    title: "Find another line forward",
  },
] as const

const DESKTOP_COLLAPSED_X = [-2, -5, -7, -9, -11, -13, -14] as const
const DESKTOP_COLLAPSED_Y = [-4, -7, -9, -11, -13, -14, -14] as const
const DESKTOP_EXPANDED_X = [699, 468, 234, 0, -234, -468, -703] as const
const DESKTOP_EXPANDED_Y = [342, 228, 114, 0, -114, -228, -342] as const
const MOBILE_COLLAPSED_X = [-5, -5, -4, -3.5, -2, 0, 0] as const
const MOBILE_COLLAPSED_Y = [-1, -2, -2, -2, -1, 0, 0] as const
const MOBILE_EXPANDED_X = [282, 191, 93, 0, -88, -180, -265] as const
const MOBILE_EXPANDED_Y = [101, 72, 39, 0, -31, -60, -95] as const
const COLLAPSED_ROTATION = [-5, 0, 5, 10, 15, 20, 25] as const

export type CardsExpandProps = {
  animationDuration?: number
  backgroundColor?: string
  className?: string
  imageUrls?: readonly string[]
  triggerViewportRatio?: number
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

function CardArtwork({ imageUrl, index }: { imageUrl: string; index: number }) {
  const content = CARD_CONTENT[index]

  return (
    <article
      aria-label={content.title}
      className={`absolute left-0 top-0 flex h-[358px] w-[292px] origin-top-left scale-[0.4] flex-col overflow-hidden rounded-[30px] p-5 min-[810px]:scale-100 min-[810px]:rounded-[20px] ${content.shell}`}
    >
      <header className="relative z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em]">
        <span>{content.eyebrow}</span>
        <span className="rounded-full border border-current/25 px-2 py-1">{content.accent}</span>
      </header>

      <h3 className="relative z-10 mt-4 max-w-[250px] text-[31px] font-semibold leading-[0.94] tracking-[-0.065em]">
        {content.title}
      </h3>

      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-[14px] bg-black/10">
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          loading="eager"
          decoding="async"
          className="size-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-black">
          Studio archive
        </span>
      </div>

      <footer className="relative z-10 mt-3 flex items-end justify-between gap-3 text-[10px] font-medium leading-tight">
        <span>{content.footer}</span>
        <span aria-hidden="true" className="text-[15px] leading-none">
          ↗
        </span>
      </footer>
    </article>
  )
}

export function CardsExpand({
  animationDuration = 650,
  backgroundColor = "#000000",
  className = "",
  imageUrls = DEFAULT_IMAGES,
  triggerViewportRatio = 0.5,
}: CardsExpandProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const resolvedImages = useMemo(
    () =>
      CARD_CONTENT.map(
        (_, index) => imageUrls[index % Math.max(1, imageUrls.length)] ?? DEFAULT_IMAGES[index],
      ),
    [imageUrls],
  )
  const resolvedDuration = clamp(animationDuration, 0, 2400, 650)
  const resolvedTrigger = clamp(triggerViewportRatio, 0.2, 0.8, 0.5)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const mobileQuery = window.matchMedia("(max-width: 809px)")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const update = () => {
      const prefersReducedMotion = motionQuery.matches
      setIsMobile(mobileQuery.matches)
      setReduceMotion(prefersReducedMotion)
      setExpanded(
        prefersReducedMotion ||
          stage.getBoundingClientRect().top <= window.innerHeight * resolvedTrigger,
      )
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    mobileQuery.addEventListener("change", update)
    motionQuery.addEventListener("change", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      mobileQuery.removeEventListener("change", update)
      motionQuery.removeEventListener("change", update)
    }
  }, [resolvedTrigger])

  const collapsedX = isMobile ? MOBILE_COLLAPSED_X : DESKTOP_COLLAPSED_X
  const collapsedY = isMobile ? MOBILE_COLLAPSED_Y : DESKTOP_COLLAPSED_Y
  const expandedX = isMobile ? MOBILE_EXPANDED_X : DESKTOP_EXPANDED_X
  const expandedY = isMobile ? MOBILE_EXPANDED_Y : DESKTOP_EXPANDED_Y

  return (
    <section
      className={`relative flex w-full flex-col gap-[10px] overflow-x-clip text-white ${className}`}
      style={{ backgroundColor }}
      aria-labelledby="cards-expand-title"
    >
      <h2 id="cards-expand-title" className="sr-only">
        Editorial cards that expand as the page scrolls
      </h2>
      <p className="sr-only">Scroll down to unfold the card collection.</p>

      <div className="h-[60dvh] shrink-0" aria-hidden="true" />

      <div ref={stageRef} className="relative h-dvh shrink-0">
        <div className="sticky top-0 h-dvh">
          <div className="absolute left-1/2 top-1/2 h-[143px] w-[117px] -translate-x-1/2 -translate-y-1/2 min-[810px]:h-[358px] min-[810px]:w-[292px] min-[810px]:scale-[0.8] min-[1200px]:scale-100">
            {CARD_CONTENT.map((card, index) => {
              const x = expanded ? expandedX[index] : collapsedX[index]
              const y = expanded ? expandedY[index] : collapsedY[index]
              const rotation = expanded ? 0 : COLLAPSED_ROTATION[index]
              const cardStyle: CSSProperties = {
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
                transitionDuration: reduceMotion ? "0ms" : `${resolvedDuration}ms`,
              }

              return (
                <div
                  key={card.title}
                  className="absolute inset-0 overflow-hidden rounded-[12px] shadow-[0_14px_35px_rgba(0,0,0,0.28)] transition-[transform,border-radius] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform min-[810px]:rounded-[20px]"
                  style={cardStyle}
                >
                  <CardArtwork imageUrl={resolvedImages[index]} index={index} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className="relative z-10 h-dvh shrink-0 bg-black"
        data-section-placeholder="cards-expand-followup"
        aria-hidden="true"
      />
    </section>
  )
}

export default CardsExpand
