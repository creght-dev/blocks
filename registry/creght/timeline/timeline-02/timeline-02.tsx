import { useEffect, useMemo, useRef } from "react"

export type Timeline02Props = {
  className?: string
  labels?: string[]
  descriptions?: string[]
}

const FALLBACK_LABELS = [
  "STEP 01\nDefine Goals",
  "STEP 02\nBuild Prototype",
  "STEP 03\nTest & Iterate",
  "STEP 04\nLaunch & Learn",
]

const FALLBACK_DESCRIPTIONS = [
  "Align on the business context, target audience, and core problem. Define the assumptions this stage must validate and the criteria that will guide every design decision.",
  "Turn the core journey into an interactive prototype. Complete the essential screens, content, and states so the idea becomes a coherent experience the team can review.",
  "Invite real users to complete key tasks. Capture moments of confusion and friction, then refine the information architecture, interaction details, and visual hierarchy.",
  "Validate responsive behavior, performance, and accessibility. Prepare a clear handoff, launch with confidence, and keep learning from real-world product data.",
]

const BASE_ROTATIONS = [0, 90, 180, -90]
const INITIAL_ROTATION_CLASSES = [
  "[transform:perspective(1200px)_rotate(0deg)]",
  "[transform:perspective(1200px)_rotate(90deg)]",
  "[transform:perspective(1200px)_rotate(180deg)]",
  "[transform:perspective(1200px)_rotate(-90deg)]",
]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

export function Timeline02({
  className = "",
  labels = [
    "STEP 01\nDefine Goals",
    "STEP 02\nBuild Prototype",
    "STEP 03\nTest & Iterate",
    "STEP 04\nLaunch & Learn",
  ],
  descriptions = [
    "Align on the business context, target audience, and core problem. Define the assumptions this stage must validate and the criteria that will guide every design decision.",
    "Turn the core journey into an interactive prototype. Complete the essential screens, content, and states so the idea becomes a coherent experience the team can review.",
    "Invite real users to complete key tasks. Capture moments of confusion and friction, then refine the information architecture, interaction details, and visual hierarchy.",
    "Validate responsive behavior, performance, and accessibility. Prepare a clear handoff, launch with confidence, and keep learning from real-world product data.",
  ],
}: Timeline02Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const triggerRefs = useRef<Array<HTMLDivElement | null>>([])
  const armRefs = useRef<Array<HTMLDivElement | null>>([])
  const descriptionRefs = useRef<Array<HTMLParagraphElement | null>>([])

  const items = useMemo(
    () =>
      FALLBACK_LABELS.map((fallbackLabel, index) => ({
        label: labels[index]?.trim() || fallbackLabel,
        description: descriptions[index]?.trim() || FALLBACK_DESCRIPTIONS[index],
      })),
    [descriptions, labels],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    let currentStage = 0
    let targetStage = 0
    let lastTime = performance.now()

    const measureStage = () => {
      const viewportHeight = window.innerHeight
      return triggerRefs.current.reduce((total, trigger) => {
        if (!trigger) return total
        const triggerRect = trigger.getBoundingClientRect()
        return total + clamp((viewportHeight - triggerRect.top) / Math.max(triggerRect.height, 1))
      }, 0)
    }

    const renderStage = (stageProgress: number) => {
      const rotation = stageProgress * -90
      const compact = window.innerWidth < 768
      const minimumOffset = compact ? -196 : -245

      armRefs.current.forEach((arm, index) => {
        if (!arm) return
        arm.style.transform = `perspective(1200px) rotate(${rotation + BASE_ROTATIONS[index]}deg)`
      })

      descriptionRefs.current.forEach((description, index) => {
        if (!description) return
        const distance = index - stageProgress
        const offset = clamp(distance * 200, minimumOffset, 200)
        description.style.opacity = String(clamp(1 - Math.abs(distance)))
        description.style.transform = `translate3d(0, ${offset.toFixed(3)}px, 0)`
      })
    }

    const animate = (time: number) => {
      const elapsed = Math.min(Math.max(time - lastTime, 0), 64)
      lastTime = time
      const distance = targetStage - currentStage
      const damping = 1 - Math.pow(0.88, elapsed / (1000 / 60))

      if (Math.abs(distance) < 0.0005) {
        currentStage = targetStage
        renderStage(currentStage)
        frame = 0
        return
      }

      currentStage += distance * damping
      renderStage(currentStage)
      frame = window.requestAnimationFrame(animate)
    }

    const scheduleUpdate = () => {
      targetStage = measureStage()
      if (frame) return
      lastTime = performance.now()
      frame = window.requestAnimationFrame(animate)
    }

    currentStage = measureStage()
    targetStage = currentStage
    renderStage(currentStage)
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [items.length])

  return (
    <section
      className={`relative overflow-clip bg-[#050505] [--node-size:180px] [--orbit-size:250vw] [font-family:Inter,ui-sans-serif,system-ui,sans-serif] md:[--node-size:200px] md:[--orbit-size:150vw] ${className}`}
      aria-label="Rotating timeline"
    >
      <ol className="sr-only">
        {items.map((item) => (
          <li key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </li>
        ))}
      </ol>

      <div className="h-[50vh]" aria-hidden="true" />

      <div ref={trackRef} className="relative h-[4000px]" aria-hidden="true">
        <div className="sticky top-0 h-dvh overflow-hidden">
          <div className="absolute left-1/2 top-[55.7vh] z-0 w-[min(652px,calc(100%-32px))] -translate-x-1/2 md:top-[60vh]">
            {items.map((item, index) => (
              <p
                key={item.description}
                ref={(node) => {
                  descriptionRefs.current[index] = node
                }}
                className={`absolute left-0 top-0 w-full text-center text-[20px] font-normal leading-[30px] text-[#9ba1a5] will-change-transform ${index === 0 ? "opacity-100" : "opacity-0"}`}
              >
                {item.description}
              </p>
            ))}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[31.11vh] z-10 size-[var(--orbit-size)] -translate-x-1/2 rounded-full">
            <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(34,36,38,0.5)_0%,rgba(34,36,38,0)_24.9512%)] after:absolute after:inset-0 after:rounded-full after:border-2 after:border-white after:content-['']" />

            {items.map((item, index) => (
              <div
                key={item.label}
                ref={(node) => {
                  armRefs.current[index] = node
                }}
                className={`absolute left-1/2 top-[-100px] ml-[calc(var(--node-size)/-2)] h-[calc(var(--orbit-size)+200px)] w-[var(--node-size)] origin-center will-change-transform ${INITIAL_ROTATION_CLASSES[index]}`}
              >
                <div className="grid size-[var(--node-size)] place-items-center overflow-hidden rounded-full bg-white text-center text-black">
                  <p className="w-[120px] whitespace-pre-line text-[18px] font-semibold leading-[23.4px] md:w-[176px] md:text-[21px] md:leading-[25.2px]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={(node) => {
            triggerRefs.current[0] = node
          }}
          className="h-[800px]"
        />
        <div className="h-[250px]" />
        <div
          ref={(node) => {
            triggerRefs.current[1] = node
          }}
          className="h-[800px]"
        />
        <div className="h-[250px]" />
        <div
          ref={(node) => {
            triggerRefs.current[2] = node
          }}
          className="h-[800px]"
        />
      </div>

      <div className="h-dvh" aria-hidden="true" />
    </section>
  )
}

export default Timeline02
