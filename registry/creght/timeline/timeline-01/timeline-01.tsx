import { useLayoutEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"

type TimelinePoint = {
  percentage: number
  label: string
  subtitle: string
  details: string[]
  variant: "left" | "right"
  mobileLabel?: string
  mobileSubtitle: string
  mobileDetails: string[]
}

type PointPosition = {
  x: number
  y: number
}

export type Timeline01Props = {
  className?: string
}

const PATH_D =
  "M1 2C299.481 2 593.937 49.2507 835.5 142.213 1143.67 260.81 1365.77 453.804 1400.3 718 1403.41 741.749 1405 766.074 1405 790.972C1405 1015.35 1206.5 1177.61 971 1343.12 752.77 1496.48 502.766 1652.64 349.5 1863.6 261.584 1984.61 205.499 2123.65 205.499 2290.54C205.499 2453.35 257.153 2581.89 336.864 2690.5 493.17 2903.47 757.359 3039.79 951.5 3207.49 1091.79 3328.68 1195.5 3466.25 1195.5 3660.98C1195.5 3836.03 1099.14 3925.77 980.477 4006.5 790.36 4135.85 542.999 4242.07 542.999 4639"

const VIEWBOX_WIDTH = 1459
const VIEWBOX_HEIGHT = 4694
const INITIAL_PATH_LENGTH = 6785.34814453125

const points: TimelinePoint[] = [
  {
    percentage: 0.0001,
    label: "BORN",
    subtitle: "C-Section",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "right",
    mobileSubtitle: "C-Section",
    mobileDetails: ["Microbiome optimization", "Genetic test"],
  },
  {
    percentage: 0.12,
    label: "Age 22",
    subtitle: "Annual Superpower Baselin",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "right",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
  {
    percentage: 0.25,
    label: "Age 26",
    subtitle: "Gut health protocol",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "left",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
  {
    percentage: 0.38,
    label: "Age 31",
    subtitle: "Fertility protocol",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "left",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: ["Prevent Alzheimer’s, heart disease, cancer", "Genetic test"],
  },
  {
    percentage: 0.48,
    label: "Age 41",
    subtitle: "Hormone optimization protocol",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "left",
    mobileLabel: "AGE 41",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
  {
    percentage: 0.63,
    label: "Age 45",
    subtitle: "Disease prevention program",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "right",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
  {
    percentage: 0.73,
    label: "Age 60",
    subtitle: "Longevity protocol",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "right",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
  {
    percentage: 0.9,
    label: "Age 120",
    subtitle: "Aging goal",
    details: ["60 biomarker blood test", "60 biomarker blood test"],
    variant: "left",
    mobileSubtitle: "Longevity protocol",
    mobileDetails: [
      "Prevent Alzheimer’s, heart disease, cancer",
      "Prevent Alzheimer’s, heart disease, cancer",
    ],
  },
]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function getActiveIndex(progress: number) {
  const nextIndex = points.findIndex((point) => progress < point.percentage)
  return nextIndex === -1 ? points.length - 1 : Math.max(nextIndex - 1, 0)
}

function LifeGridIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d="M10 12V6h1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h1V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18v-3h1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 15v3h-1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 15v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 15v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3H3v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 3h3v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 21H3v-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 21h3v-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TimelineNode({
  point,
  setRef,
}: {
  point: TimelinePoint
  setRef: (node: HTMLDivElement | null) => void
}) {
  const alignLeft = point.variant === "left"

  return (
    <div
      ref={setRef}
      data-active="false"
      className="absolute z-20 size-0 [transform:translate3d(0,0,2px)] [backface-visibility:hidden]"
    >
      <div
        data-timeline-default
        className={[
          "absolute bottom-0 flex h-9 items-start gap-1 whitespace-nowrap text-white opacity-100",
          alignLeft ? "right-0 flex-row" : "left-0 flex-row",
        ].join(" ")}
      >
        {alignLeft ? (
          <span className="[font-family:Roboto] text-[16px] font-semibold leading-[1.2] tracking-[-0.575px]">
            {point.label}
          </span>
        ) : (
          <div className="-ml-3 flex h-9 flex-col items-center gap-3">
            <LifeGridIcon className="size-6 shrink-0" />
            <div className="w-px flex-1" />
          </div>
        )}

        {alignLeft ? (
          <div className="-mr-3 flex h-9 flex-col items-center gap-3">
            <LifeGridIcon className="size-6 shrink-0" />
            <div className="w-px flex-1" />
          </div>
        ) : (
          <span className="[font-family:Roboto] text-[16px] font-semibold leading-[1.2] tracking-[-0.575px]">
            {point.label}
          </span>
        )}
      </div>

      <div
        data-timeline-dot
        className="absolute left-0 top-0 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe8000] shadow-[0_0_20px_rgba(255,133,0,0.7)] transition-shadow duration-300"
      />
      <div className="absolute left-0 top-0 h-[180px] w-px -translate-x-1/2 bg-gradient-to-b from-white/50 to-black/40" />
    </div>
  )
}

function ExpandedTimelineNode({
  point,
  setRef,
}: {
  point: TimelinePoint
  setRef: (node: HTMLDivElement | null) => void
}) {
  const alignLeft = point.variant === "left"

  return (
    <div ref={setRef} data-active="false" className="absolute size-0">
      <div
        data-timeline-expanded
        className={[
          "absolute bottom-0 flex items-start gap-1 whitespace-nowrap opacity-0",
          alignLeft ? "right-0 flex-row" : "left-0 flex-row",
        ].join(" ")}
      >
        {alignLeft ? (
          <div className="flex flex-col items-end gap-1 overflow-hidden pb-5 pt-[5px] text-right">
            <p className="[font-family:Roboto] text-[16px] font-semibold leading-[1.2] tracking-[-0.575px] text-[#fe8000]">{point.label}</p>
            <div className="hidden flex-col items-end justify-center gap-1 md:flex">
              <p className="text-[16px] font-normal leading-[1.2] text-white">{point.subtitle}</p>
              {point.details.map((detail, detailIndex) => (
                <p
                  key={`${detail}-${detailIndex}`}
                  className="flex h-[16.8px] items-center justify-end text-[14px] font-normal leading-[1.2] text-white"
                >
                  <ArrowRight className="size-4 shrink-0 text-[#fe8000]" />
                  <span>{detail}</span>
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="-ml-3 flex h-20 flex-col items-center justify-center gap-3 md:h-auto md:self-stretch">
            <LifeGridIcon className="size-6 shrink-0 text-[#fe8000]" />
            <div className="w-px flex-1 bg-gradient-to-b from-[#fb5100] to-transparent" />
          </div>
        )}

        {alignLeft ? (
          <div className="-mr-3 flex h-20 flex-col items-center justify-center gap-3 md:h-auto md:self-stretch">
            <LifeGridIcon className="size-6 shrink-0 text-[#fe8000]" />
            <div className="w-px flex-1 bg-gradient-to-b from-[#fb5100] to-transparent" />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1 overflow-hidden pb-5 pt-[5px] text-left">
            <p className="[font-family:Roboto] text-[16px] font-semibold leading-[1.2] tracking-[-0.575px] text-[#fe8000]">{point.label}</p>
            <div className="hidden flex-col items-start justify-center gap-1 md:flex">
              <p className="text-[16px] font-normal leading-[1.2] text-white">{point.subtitle}</p>
              {point.details.map((detail, detailIndex) => (
                <p
                  key={`${detail}-${detailIndex}`}
                  className="flex h-[16.8px] items-center text-[14px] font-normal leading-[1.2] text-white"
                >
                  <ArrowRight className="size-4 shrink-0 text-[#fe8000]" />
                  <span>{detail}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MobilePoint({
  point,
  setRef,
}: {
  point: TimelinePoint
  setRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={setRef}
      data-active="false"
      className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 py-6 opacity-0"
    >
      <p className="w-fit [font-family:Roboto] text-[16px] font-semibold leading-[1.2] tracking-[-0.575px] text-[#ff8500]">
        {point.mobileLabel ?? point.label}
      </p>
      <p className="w-fit [font-family:Roboto] text-[16px] font-normal leading-[1.2] tracking-[-0.39px] text-white">
        {point.mobileSubtitle}
      </p>
      <div className="flex flex-col">
        {point.mobileDetails.map((detail, detailIndex) => (
          <p
            key={`${detail}-${detailIndex}`}
            className="w-fit [font-family:Roboto] text-[14px] font-normal leading-[1.2] tracking-[-0.374px] text-white"
          >
            <span>{detail}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

export function Timeline01({ className = "" }: Timeline01Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const expandedStageRef = useRef<HTMLDivElement | null>(null)
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const progressPathRefs = useRef<Array<SVGPathElement | null>>([])
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([])
  const expandedNodeRefs = useRef<Array<HTMLDivElement | null>>([])
  const mobilePanelRef = useRef<HTMLDivElement | null>(null)
  const mobilePointRefs = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const expandedStage = expandedStageRef.current
    const svgWrapper = svgWrapperRef.current
    const path = pathRef.current
    if (!track || !stage || !expandedStage || !svgWrapper || !path) return

    let frame = 0
    let pathLength = INITIAL_PATH_LENGTH
    let positions: PointPosition[] = []
    let layoutWidth = 0
    let isMobile = false
    let lastActiveIndex = -1

    const syncActivePoint = (activeIndex: number) => {
      if (activeIndex === lastActiveIndex) return

      nodeRefs.current.forEach((node, index) => {
        if (!node) return
        const isActive = index === activeIndex
        const defaultLabel = node.querySelector<HTMLElement>("[data-timeline-default]")
        const dot = node.querySelector<HTMLElement>("[data-timeline-dot]")

        node.dataset.active = String(isActive)
        node.style.zIndex = isActive ? "40" : "20"
        if (defaultLabel) {
          defaultLabel.style.opacity = isActive ? "0" : "1"
        }
        if (dot) {
          dot.style.boxShadow = isActive
            ? "0 0 42px rgba(255, 133, 0, 0.95)"
            : "0 0 20px rgba(255, 133, 0, 0.7)"
        }
      })
      expandedNodeRefs.current.forEach((node, index) => {
        if (!node) return
        const isActive = index === activeIndex
        const expanded = node.querySelector<HTMLElement>("[data-timeline-expanded]")

        node.dataset.active = String(isActive)
        node.style.zIndex = isActive ? "40" : "20"
        if (expanded) {
          expanded.style.opacity = isActive ? "1" : "0"
          expanded.style.transform = isActive ? "translateY(0)" : "translateY(-0.5rem)"
        }
      })
      mobilePointRefs.current.forEach((node, index) => {
        if (!node) return
        const isActive = index === activeIndex
        node.dataset.active = String(isActive)
        node.style.opacity = isActive ? "1" : "0"
      })
      lastActiveIndex = activeIndex
    }

    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const progress = clamp((window.innerHeight - rect.top) / Math.max(rect.height, 1))
      const scale = isMobile ? 1 : Math.max(1 - progress, 0.5)
      const scaleY = isMobile ? 0.9 : 0.4
      const svgScale = layoutWidth / VIEWBOX_WIDTH
      const currentPoint = path.getPointAtLength(pathLength * progress)
      const verticalShift = currentPoint.y * svgScale * scaleY * scale * 0.5
      const mobilePanelVisible = isMobile && rect.bottom > 0 && rect.top < window.innerHeight

      stage.style.transform = `translate3d(0, -${verticalShift.toFixed(3)}px, 0)`
      expandedStage.style.transform = `translate3d(0, -${verticalShift.toFixed(3)}px, 0)`
      svgWrapper.style.transform = `translate3d(0, 0, 1px) scale(${scale.toFixed(5)}) scaleY(${scaleY})`
      if (mobilePanelRef.current) {
        mobilePanelRef.current.style.opacity = mobilePanelVisible ? "1" : "0"
      }

      const dashOffset = (pathLength * (1 - progress)).toFixed(3)
      progressPathRefs.current.forEach((progressPath) => {
        progressPath?.setAttribute("stroke-dashoffset", dashOffset)
      })

      positions.forEach((position, index) => {
        const node = nodeRefs.current[index]
        if (!node) return
        const left = (position.x * svgScale - layoutWidth / 2) * scale + layoutWidth / 2
        const top = position.y * svgScale * scaleY * scale
        node.style.left = `${left.toFixed(3)}px`
        node.style.top = `${top.toFixed(3)}px`

        const expandedNode = expandedNodeRefs.current[index]
        if (expandedNode) {
          expandedNode.style.left = `${left.toFixed(3)}px`
          expandedNode.style.top = `${top.toFixed(3)}px`
        }
      })

      syncActivePoint(getActiveIndex(progress))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    const measure = () => {
      layoutWidth = stage.clientWidth
      isMobile = layoutWidth < 810
      pathLength = path.getTotalLength()
      positions = points.map((point) => path.getPointAtLength(pathLength * point.percentage))

      const dashArray = `${pathLength} ${pathLength}`
      progressPathRefs.current.forEach((progressPath) => {
        progressPath?.setAttribute("stroke-dasharray", dashArray)
      })
      update()
    }

    measure()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", measure)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <section className={`relative bg-black text-white ${className}`}>
      <div className="pointer-events-none sticky top-0 z-30 flex h-[50vh] items-start">
        <div className="w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.8)_65.91%,rgba(0,0,0,0.12)_100%)] px-6 pb-px pt-[60px] md:pb-0 md:pt-[120px]">
          <h2 className="mx-auto w-full max-w-[1050px] text-center text-[32px] font-normal leading-[1.2] text-white md:text-[64px]">
            <span className="md:hidden">
              <span
                data-timeline-title-mobile-line
                className="mx-auto block w-fit whitespace-nowrap tracking-[-0.635px]"
              >
                Unlock all the potential
              </span>
              <span className="mx-auto block w-fit whitespace-nowrap">your life holds</span>
            </span>
            <span data-timeline-title-text className="hidden tracking-[1.45px] md:inline">
              Unlock all the potential your life holds
            </span>
          </h2>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative mt-4 h-[3000px] bg-black md:h-[312vw] md:min-h-[460vh]"
      >
        <div className="pointer-events-none absolute inset-y-0 left-4 right-4 z-20 md:inset-0">
          <div className="sticky top-[200px] h-screen overflow-visible md:h-px">
            <div
              ref={stageRef}
              className="relative w-full will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
            >
              <div
                ref={svgWrapperRef}
                className="relative w-full origin-top will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
                style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
              >
                <svg
                  viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 overflow-visible [backface-visibility:hidden]"
                  aria-hidden
                >
                  <path ref={pathRef} d={PATH_D} stroke="white" strokeWidth="5" className="opacity-95" />
                  <path
                    ref={(node) => {
                      progressPathRefs.current[0] = node
                    }}
                    d={PATH_D}
                    stroke="#FE8000"
                    strokeWidth="5"
                    strokeDasharray={`${INITIAL_PATH_LENGTH} ${INITIAL_PATH_LENGTH}`}
                    strokeDashoffset={INITIAL_PATH_LENGTH}
                  />
                  <path
                    ref={(node) => {
                      progressPathRefs.current[1] = node
                    }}
                    d={PATH_D}
                    stroke="#FE8000"
                    strokeWidth="24"
                    strokeDasharray={`${INITIAL_PATH_LENGTH} ${INITIAL_PATH_LENGTH}`}
                    strokeDashoffset={INITIAL_PATH_LENGTH}
                    className="blur-[48px]"
                  />
                </svg>
              </div>

              {points.map((point, index) => (
                <TimelineNode
                  key={point.label}
                  point={point}
                  setRef={(node) => {
                    nodeRefs.current[index] = node
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-4 right-4 z-20 md:inset-0">
          <div className="sticky top-[200px] h-screen overflow-visible md:h-px">
            <div
              ref={expandedStageRef}
              className="relative w-full will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
            >
              {points.map((point, index) => (
                <ExpandedTimelineNode
                  key={point.label}
                  point={point}
                  setRef={(node) => {
                    expandedNodeRefs.current[index] = node
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          ref={mobilePanelRef}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[320px] overflow-hidden opacity-0 transition-opacity duration-300 md:hidden"
        >
          {points.map((point, index) => (
            <MobilePoint
              key={point.label}
              point={point}
              setRef={(node) => {
                mobilePointRefs.current[index] = node
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline01
