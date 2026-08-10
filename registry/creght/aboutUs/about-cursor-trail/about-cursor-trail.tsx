"use client"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react"

const TRAIL_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1786355882171__creght_blocks_external_047.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355885097__creght_blocks_external_044.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355882901__creght_blocks_external_043.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355881657__creght_blocks_external_048.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355873913__creght_blocks_external_042.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355878294__creght_blocks_external_046.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355856051__creght_blocks_external_030.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355886578__creght_blocks_external_045.jpg",
]

const IMAGE_WIDTH = 250
const IMAGE_HEIGHT = 400
const SPAWN_DISTANCE = 96
const VISIBLE_FOR_MS = 520
const MAX_VISIBLE_IMAGES = 7

type TrailImage = {
  id: number
  imageIndex: number
  x: number
  y: number
}

type Point = {
  x: number
  y: number
}

export default function AboutCursorTrail() {
  const [trail, setTrail] = useState<TrailImage[]>([])
  const prefersReducedMotion = useReducedMotion()
  const imageIndexRef = useRef(0)
  const itemIdRef = useRef(0)
  const lastPointRef = useRef<Point | null>(null)
  const removalTimersRef = useRef<number[]>([])

  useEffect(() => {
    for (const src of TRAIL_IMAGES) {
      const image = new Image()
      image.src = src
    }
  }, [])

  useEffect(
    () => () => {
      for (const timer of removalTimersRef.current) {
        window.clearTimeout(timer)
      }
    },
    [],
  )

  const addTrailImage = useCallback((x: number, y: number) => {
    const id = itemIdRef.current++
    const item: TrailImage = {
      id,
      imageIndex: imageIndexRef.current,
      x,
      y,
    }

    imageIndexRef.current = (imageIndexRef.current + 1) % TRAIL_IMAGES.length
    setTrail((current) => [...current.slice(-(MAX_VISIBLE_IMAGES - 1)), item])

    const timer = window.setTimeout(() => {
      setTrail((current) => current.filter((image) => image.id !== id))
      removalTimersRef.current = removalTimersRef.current.filter(
        (activeTimer) => activeTimer !== timer,
      )
    }, VISIBLE_FOR_MS)

    removalTimersRef.current.push(timer)
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const point = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }
    const lastPoint = lastPointRef.current
    const movedFarEnough =
      !lastPoint ||
      Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) >= SPAWN_DISTANCE

    if (!movedFarEnough) return

    lastPointRef.current = point
    addTrailImage(point.x, point.y)
  }

  const resetTrailOrigin = () => {
    lastPointRef.current = null
  }

  return (
    <section
      aria-labelledby="about-cursor-trail-title"
      className="relative flex h-[90svh] min-h-[620px] max-h-[900px] w-full select-none items-center justify-center overflow-hidden bg-[#131415] font-sans text-white"
    >
      <h2
        id="about-cursor-trail-title"
        aria-label="About us"
        className="relative z-0 whitespace-nowrap text-[clamp(5.5rem,18vw,15rem)] font-normal leading-[0.82] tracking-[-0.075em]"
      >
        <span aria-hidden="true" className="text-[#fcd43b]">
          About
        </span>
        <span aria-hidden="true">.</span>
        <span aria-hidden="true" className="text-[#fcd43b]">
          us
        </span>
        <span aria-hidden="true">.</span>
      </h2>

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-11 items-center justify-center gap-2 bg-[#fcd43b] text-sm font-semibold text-[#050505] sm:text-base">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
        >
          <path
            d="M24.198 9.911 1.836 1.836 9.91 24.198l4.348-9.939 9.94-4.348Z"
            fill="currentColor"
          />
        </svg>
        <span>Move your cursor to meet the team</span>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 hidden cursor-crosshair overflow-hidden md:block"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTrailOrigin}
      >
        <AnimatePresence>
          {trail.map((item) => (
            <motion.figure
              key={item.id}
              className="pointer-events-none absolute left-0 top-0 h-[400px] w-[250px] overflow-hidden bg-transparent"
              initial={{
                opacity: 0,
                scale: 0.5,
                x: item.x - IMAGE_WIDTH / 2,
                y: item.y - IMAGE_HEIGHT / 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: item.x - IMAGE_WIDTH / 2,
                y: item.y - IMAGE_HEIGHT / 2,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 0.18, ease: "easeOut" },
                scale: { type: "spring", stiffness: 500, damping: 42 },
              }}
            >
              <img
                src={TRAIL_IMAGES[item.imageIndex]}
                alt=""
                draggable={false}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
