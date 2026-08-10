import { useEffect, useMemo, useRef, type CSSProperties } from "react"

const DEFAULT_PHOTOS = [
  "https://fsu.creght.com/site/2083536173505974272/1786355882171__creght_blocks_external_047.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355885097__creght_blocks_external_044.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355882901__creght_blocks_external_043.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355881657__creght_blocks_external_048.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355873913__creght_blocks_external_042.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355878294__creght_blocks_external_046.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355856051__creght_blocks_external_030.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355886578__creght_blocks_external_045.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355820574__creght_blocks_external_017.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355847431__creght_blocks_external_026.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355850990__creght_blocks_external_029.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355842882__creght_blocks_external_019.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355819465__creght_blocks_external_013.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355865911__creght_blocks_external_035.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355851525__creght_blocks_external_025.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355863946__creght_blocks_external_031.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355866684__creght_blocks_external_032.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355843207__creght_blocks_external_022.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355850433__creght_blocks_external_027.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355840494__creght_blocks_external_021.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355863397__creght_blocks_external_033.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355820622__creght_blocks_external_015.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355810766__creght_blocks_external_012.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355838641__creght_blocks_external_024.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355810548__creght_blocks_external_008.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355820914__creght_blocks_external_018.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355800182__creght_blocks_external_006.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355813458__creght_blocks_external_011.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355830944__creght_blocks_external_020.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355809038__creght_blocks_external_010.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355853937__creght_blocks_external_028.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355865937__creght_blocks_external_034.jpg",
] as const

const GLOBE_RINGS = [
  { longitude: 0, start: 0, arms: [0, 40, 80, 120, 160, 200, 240, 280, 320] },
  { longitude: -90, start: 9, arms: [0, 40, 80, 120, 160, 200, 240, 280, 320] },
  { longitude: -45, start: 18, arms: [0, 40, 80, 120, 240, 280, 320] },
  { longitude: -130, start: 25, arms: [0, 40, 80, 120, 240, 280, 320] },
] as const

const preserve3d: CSSProperties = { transformStyle: "preserve-3d" }

export type InnerGlobeProps = {
  backgroundColor?: string
  centerLabel?: string
  className?: string
  photos?: readonly string[]
  rotationDuration?: number
}

function safeDuration(value: number) {
  if (!Number.isFinite(value)) return 40
  return Math.min(180, Math.max(8, value))
}

export function InnerGlobe({
  backgroundColor = "#050505",
  centerLabel = "Creght AI",
  className = "",
  photos = DEFAULT_PHOTOS,
  rotationDuration = 40,
}: InnerGlobeProps) {
  const spaceRef = useRef<HTMLDivElement>(null)
  const coreArmRef = useRef<HTMLDivElement>(null)
  const resolvedPhotos = useMemo(
    () => (photos.length > 0 ? photos : DEFAULT_PHOTOS),
    [photos],
  )

  useEffect(() => {
    const space = spaceRef.current
    const coreArm = coreArmRef.current
    if (!space || !coreArm) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      space.style.transform = "perspective(500px) rotateY(-28deg)"
      coreArm.style.transform = "rotateY(-34deg)"
      return
    }

    const globeAnimation = space.animate(
      [
        { transform: "perspective(500px) rotateY(0deg)" },
        { transform: "perspective(500px) rotateY(-360deg)" },
      ],
      {
        duration: safeDuration(rotationDuration) * 1000,
        easing: "linear",
        iterations: Infinity,
      },
    )
    const coreAnimation = coreArm.animate(
      [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-360deg)" }],
      { duration: 5000, easing: "linear", iterations: Infinity },
    )

    return () => {
      globeAnimation.cancel()
      coreAnimation.cancel()
    }
  }, [rotationDuration])

  return (
    <section
      className={`relative h-dvh min-h-[640px] w-full overflow-hidden text-white ${className}`}
      style={{ backgroundColor }}
      aria-label="Rotating photo globe"
    >
      <div className="absolute inset-0 grid place-items-center overflow-visible">
        <div
          className="absolute left-0 top-1/2 h-[1316px] w-full -translate-y-1/2 overflow-clip"
          aria-hidden="true"
        >
          <div ref={spaceRef} className="absolute inset-0" style={preserve3d}>
            {GLOBE_RINGS.map((ring) => (
              <div
                key={ring.longitude}
                className="absolute bottom-0 top-0 w-[243px]"
                style={{
                  ...preserve3d,
                  left: "calc(50% - 121.5px)",
                  transform: `rotateY(${ring.longitude}deg)`,
                }}
              >
                {ring.arms.map((angle, armIndex) => {
                  const isFlipped = angle >= 160 && angle <= 240
                  const photo = resolvedPhotos[(ring.start + armIndex) % resolvedPhotos.length]

                  return (
                    <div
                      key={angle}
                      className="absolute inset-0 flex items-end justify-center"
                      style={{ ...preserve3d, transform: `rotateX(${-angle}deg)` }}
                    >
                      <div
                        className="relative size-[243px] shrink-0 overflow-hidden rounded-full will-change-transform"
                        style={{
                          ...preserve3d,
                          transform: `rotateX(${isFlipped ? -90 : 90}deg)`,
                        }}
                      >
                        <img
                          src={photo}
                          alt=""
                          draggable={false}
                          loading="eager"
                          className="block size-full select-none rounded-full object-cover"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-[5] flex h-[62px] w-px items-center justify-center overflow-visible"
          style={{
            ...preserve3d,
            transform: "translate(-50%, -50%) perspective(1200px) translateZ(200px) scale(2)",
          }}
          aria-label={centerLabel}
        >
          <div
            className="relative z-[4] flex size-[62px] items-center justify-center overflow-visible"
            style={preserve3d}
          >
            <div
              className="relative size-[62px]"
              style={{ ...preserve3d, transform: "scale(1.8)" }}
            >
              <div
                className="absolute inset-0 z-[1] flex size-[62px] items-center justify-center overflow-visible rounded-full"
                style={{ ...preserve3d, transform: "perspective(500px)" }}
              >
                <div className="absolute inset-0 z-[3] overflow-clip rounded-full bg-white" />
                <div
                  className="relative z-[4] flex h-6 w-[72px] items-center justify-center overflow-visible"
                  style={{
                    ...preserve3d,
                    transform: "rotate(11deg) rotateX(12deg) rotateY(17deg)",
                  }}
                >
                  <div
                    ref={coreArmRef}
                    className="relative z-[2] flex h-6 min-h-6 w-[72px] items-center justify-end overflow-visible"
                    style={preserve3d}
                  >
                    <span
                      className="absolute right-[-10px] top-1/2 z-[1] w-[27px] whitespace-nowrap text-[12px] font-semibold leading-[14.4px] tracking-[-0.02em] text-[#050505]"
                      style={{
                        backfaceVisibility: "visible",
                        transform: "translateY(-50%) rotateY(90deg)",
                      }}
                    >
                      {centerLabel}
                    </span>
                    <span
                      className="absolute left-[-10px] top-1/2 z-[1] w-[27px] whitespace-nowrap text-[12px] font-semibold leading-[14.4px] text-[#050505]"
                      style={{
                        backfaceVisibility: "visible",
                        transform: "translateY(-50%) rotateY(-90deg)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InnerGlobe
