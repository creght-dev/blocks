import { useEffect, useMemo, useRef, type CSSProperties } from "react"

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1750655785331-0ef8b1996fa5?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1706699293255-ec640a083fd3?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1624814851118-05103382a770?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1760800185531-2b1da99d7538?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607332646831-1a8e7f017533?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1748582903437-d9c814153423?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527428741670-f0bfe11e32f8?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1706973899797-7d02779f5126?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=82&auto=format&fit=crop",
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
