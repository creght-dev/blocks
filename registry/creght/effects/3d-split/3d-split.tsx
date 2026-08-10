import {
  Orbit,
  type LucideIcon,
} from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
} from "react"

export type SplitCard = {
  description: string
  icon?: LucideIcon
  iconSrc?: string
  title: string
  tone: "light" | "blue" | "dark"
}

export type ThreeDSplitEffectProps = {
  cards?: readonly SplitCard[]
  className?: string
  endingLabel?: string
  heading?: string
  imageAlt?: string
  imageSrc?: string
  scrollLabel?: string
}

const DEFAULT_CARDS: readonly SplitCard[] = [
  {
    description:
      "If you've navigating a new business unit,\nor a new venture entirely, or breaking into\na new market",
    iconSrc:
      "https://fsu.creght.com/site/2083536173505974272/1786355145554__creght_blocks_assets_3d_split_trend_up.svg",
    title: "Going\nZero to One",
    tone: "light",
  },
  {
    description:
      "If you've achieved Product/ Service Market\nFit, and are looking to scale your business\nto new heights",
    icon: Orbit,
    title: "Scaling from\nOne to N",
    tone: "blue",
  },
  {
    description:
      "If you know exactly what you want and\nneed a team that can step in and quickly\nhelp you with it",
    iconSrc:
      "https://fsu.creght.com/site/2083536173505974272/1786355147646__creght_blocks_assets_3d_split_sparkle.svg",
    title: "Need Quick\nSolutions",
    tone: "dark",
  },
]

const DEFAULT_HEADING = "Where are you in your journey?"

const TONES: Record<
  SplitCard["tone"],
  { background: string; description: string; foreground: string }
> = {
  light: {
    background: "linear-gradient(180deg, #e0e0e0 0%, #858585 100%)",
    description: "#050505",
    foreground: "#050505",
  },
  blue: {
    background: "linear-gradient(180deg, #1f5fd2 0%, #061a69 100%)",
    description: "#9ba1a5",
    foreground: "#ffffff",
  },
  dark: {
    background: "linear-gradient(180deg, #1d1d1d 0%, #131313 100%)",
    description: "#9ba1a5",
    foreground: "#ffffff",
  },
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress

function smoothStep(from: number, to: number, value: number) {
  const progress = clamp((value - from) / (to - from))
  return progress * progress * (3 - 2 * progress)
}

function SplitCardFace({ card }: { card: SplitCard }) {
  const Icon = card.icon
  const tone = TONES[card.tone]

  return (
    <div
      className="absolute inset-0 overflow-hidden p-8"
      style={{
        backfaceVisibility: "hidden",
        background: tone.background,
        border: "1px solid rgba(255,255,255,0.11)",
        borderRadius: "12px",
        boxShadow:
          card.tone === "light"
            ? "inset 0 1px 0 rgba(255,255,255,.62), 0 28px 60px rgba(0,0,0,.32)"
            : "inset 0 1px 0 rgba(255,255,255,.12), 0 28px 60px rgba(0,0,0,.38)",
        color: tone.foreground,
        transform: "rotateY(180deg)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 24% 18%, rgba(255,255,255,.55), transparent 1px), radial-gradient(circle at 76% 68%, rgba(0,0,0,.55), transparent 1px)",
          backgroundSize: "4px 4px, 5px 5px",
          mixBlendMode: "soft-light",
        }}
      />
      {card.iconSrc ? (
        <img
          src={card.iconSrc}
          alt=""
          aria-hidden="true"
          className="relative h-[19px] w-auto"
        />
      ) : Icon ? (
        <Icon className="relative size-[19px] stroke-[1.5]" aria-hidden="true" />
      ) : null}
      <h2 className="absolute left-[30px] top-[39%] whitespace-pre-line text-[25px] font-normal leading-[30px] tracking-[-0.04em]">
        {card.title}
      </h2>
      <p
        className="absolute bottom-6 left-[30px] right-6 whitespace-pre-line text-[12px] leading-[16.8px] tracking-[-0.025em]"
        style={{ color: tone.description }}
      >
        {card.description}
      </p>
    </div>
  )
}

export function ThreeDSplitEffect({
  cards = DEFAULT_CARDS,
  className = "",
  endingLabel = "So cool, right?",
  heading = DEFAULT_HEADING,
  imageAlt = "Warm surreal desert landscape",
  imageSrc =
    "https://fsu.creght.com/site/2083536173505974272/1786355142115__creght_blocks_assets_3d_split_desert_road.avif",
  scrollLabel = "Scroll",
}: ThreeDSplitEffectProps) {
  const sequenceRef = useRef<HTMLElement>(null)
  const frameRef = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sequence = sequenceRef.current
    if (!sequence) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const desktopQuery = window.matchMedia("(min-width: 1024px)")

    const update = () => {
      frameRef.current = 0
      if (!desktopQuery.matches) {
        setProgress(0)
        return
      }
      if (motionQuery.matches) {
        setProgress(0.95)
        return
      }

      const top = sequence.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(1, sequence.offsetHeight - window.innerHeight)
      setProgress(clamp((window.scrollY - top) / distance))
    }

    const requestUpdate = () => {
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    motionQuery.addEventListener("change", requestUpdate)
    desktopQuery.addEventListener("change", requestUpdate)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      motionQuery.removeEventListener("change", requestUpdate)
      desktopQuery.removeEventListener("change", requestUpdate)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const resizeProgress = smoothStep(0.12, 0.5, progress)
  const splitProgress = smoothStep(0.52, 0.64, progress)
  const flipProgress = smoothStep(0.7, 0.8, progress)
  const settleProgress = smoothStep(0.72, 0.8, progress)
  const headingProgress = smoothStep(0.43, 0.53, progress)
  const cardWidth = mix(360, 300, resizeProgress)
  const cardHeight = mix(480, 400, resizeProgress)
  const cardGap = Math.max(0, 30 * splitProgress - 16 * settleProgress)
  const imageWidth = cardWidth * 3
  const stageWidth = imageWidth + cardGap * 2
  const cardSet = Array.from({ length: 3 }, (_, index) =>
    cards[index] ?? DEFAULT_CARDS[index],
  )

  return (
    <main
      className={`w-full overflow-clip bg-[#050505] text-white ${className}`}
      style={{ fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&display=swap");

        @media (prefers-reduced-motion: reduce) {
          .split-mobile-card {
            transform: rotateY(180deg) !important;
          }
        }
      `}</style>

      <section className="relative grid h-dvh min-h-[560px] place-items-center">
        <p
          className="text-[44px] leading-[1.2]"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          {scrollLabel}
        </p>
      </section>

      <section ref={sequenceRef} className="relative hidden h-[555dvh] lg:block">
        <div className="sticky top-0 h-dvh min-h-[560px] overflow-hidden">
          <p
            className="pointer-events-none absolute left-1/2 top-[calc(50%_-_250px)] z-20 whitespace-nowrap text-[44px] leading-[1.2]"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              letterSpacing: "-0.18px",
              opacity: headingProgress,
              transform: `translate(-50%, ${mix(30, 0, headingProgress)}px)`,
            }}
          >
            {heading === DEFAULT_HEADING ? (
              <>
                Where are you <em>in your</em> journey?
              </>
            ) : heading}
          </p>

          <div
            className="absolute left-1/2 top-[calc(50%_+_50px)]"
            style={{
              height: cardHeight,
              perspective: "1200px",
              transform: "translate(-50%, -50%)",
              transformStyle: "preserve-3d",
              width: stageWidth,
            }}
          >
            <div
              className="flex h-full"
              style={{
                gap: cardGap,
                transformStyle: "preserve-3d",
              }}
            >
              {cardSet.map((card, index) => {
                const tilt = index === 0 ? 12 : index === 2 ? -12 : 0
                const outerRadius = splitProgress < 0.04
                  ? index === 0
                    ? "12px 0 0 12px"
                    : index === 2
                      ? "0 12px 12px 0"
                      : "0"
                  : "12px"

                return (
                  <article
                    key={`${card.title}-${index}`}
                    className="relative shrink-0"
                    style={{
                      height: cardHeight,
                      transform: `rotateY(${flipProgress * 180}deg) rotateZ(${tilt * settleProgress}deg)`,
                      transformStyle: "preserve-3d",
                      width: cardWidth,
                    }}
                  >
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        borderRadius: outerRadius,
                        transform: "rotateY(0deg)",
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt={index === 1 ? imageAlt : ""}
                        aria-hidden={index !== 1}
                        draggable={false}
                        className="pointer-events-none absolute top-0 max-w-none select-none object-cover"
                        style={{
                          height: cardHeight,
                          left: -index * cardWidth,
                          width: imageWidth,
                        }}
                      />
                    </div>

                    <SplitCardFace card={card} />
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-[38dvh] pt-16 lg:hidden">
        <p
          className="mx-auto max-w-[360px] text-center text-[36px] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          {heading === DEFAULT_HEADING ? (
            <>
              Where are you <em>in your</em> journey?
            </>
          ) : heading}
        </p>

        <div className="mx-auto mt-14 max-w-[340px]">
          {cardSet.map((card, index) => {
            const mobileTilt = index === 0 ? -2.5 : index === 1 ? 1.5 : -1

            return (
              <article
                key={`mobile-${card.title}-${index}`}
                className="split-mobile-card sticky mb-[42dvh] aspect-[3/4] w-full last:mb-[12dvh]"
                style={{
                  perspective: "1200px",
                  top: `calc(72px + ${index * 14}px)`,
                  transform: `rotateY(180deg) rotateZ(${mobileTilt}deg)`,
                  transformStyle: "preserve-3d",
                  zIndex: index + 1,
                }}
              >
                <SplitCardFace card={card} />
              </article>
            )
          })}
        </div>
      </section>

      <section className="relative grid h-dvh min-h-[560px] place-items-center">
        <p
          className="text-[32px] leading-[1.2]"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          {endingLabel}
        </p>
      </section>
    </main>
  )
}

export default ThreeDSplitEffect
