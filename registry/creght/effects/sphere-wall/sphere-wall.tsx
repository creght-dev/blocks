import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1786355882171__creght_blocks_external_047.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355885097__creght_blocks_external_044.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355882901__creght_blocks_external_043.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355881657__creght_blocks_external_048.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355873913__creght_blocks_external_042.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355878294__creght_blocks_external_046.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355856051__creght_blocks_external_030.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1786355886578__creght_blocks_external_045.jpg",
] as const

const VISIBLE_HALF_WINDOW = 1.3

type Column = {
  c: number
  end: number
  start: number
}

type Layout = {
  cardH: number
  cardW: number
  columns: Column[]
  panEnd: number
  perspective: number
  radius: number
  rows: number[]
  rowSpacing: number
  rowSlotOffset: number
  sphereRadius: number
  stepLon: number
}

export type SphereWallProps = {
  backgroundColor?: string
  cardAspect?: number
  className?: string
  columnGap?: number
  columns?: number
  cornerRadius?: number
  duration?: number
  gap?: number
  images?: readonly string[]
  interactive?: boolean
  padding?: number
  rows?: number
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

function computeLayout(
  width: number,
  height: number,
  options: {
    cardAspect: number
    columnGap: number
    columns: number
    cornerRadius: number
    gap: number
    imageCount: number
    padding: number
    rows: number
  },
): Layout {
  const minDimension = Math.max(1, Math.min(width, height))
  const unit = minDimension / 100
  const gap = unit * options.gap
  const columnGap = unit * options.columnGap
  const padding = unit * options.padding
  const availableHeight = Math.max(
    100,
    height - padding * 2 - (options.rows - 1) * gap,
  )
  const rowCardH = availableHeight / options.rows
  const columnCardW = Math.max(
    80,
    (width - (options.columns - 1) * columnGap) / options.columns,
  )
  const useColumnSizing = width >= height
  const cardW = useColumnSizing
    ? columnCardW
    : rowCardH * options.cardAspect
  const cardH = useColumnSizing
    ? columnCardW / options.cardAspect
    : rowCardH
  const sphereRadius = minDimension * 1.1
  const stepLon = (cardW + columnGap) / sphereRadius
  const rowSpacing = cardH + gap
  const panEnd = stepLon * options.imageCount
  const rows: number[] = []
  const maxRow = Math.ceil((height / 2 + cardH) / rowSpacing)

  for (let row = -maxRow; row <= maxRow; row += 1) {
    rows.push(row)
  }

  const columns: Column[] = []
  const minColumn = Math.ceil(-VISIBLE_HALF_WINDOW / stepLon)
  const maxColumn = Math.floor(
    options.imageCount + VISIBLE_HALF_WINDOW / stepLon,
  )

  for (let column = minColumn; column <= maxColumn; column += 1) {
    const start = Math.max(
      0,
      (column * stepLon - VISIBLE_HALF_WINDOW) / panEnd,
    )
    const end = Math.min(
      1,
      (column * stepLon + VISIBLE_HALF_WINDOW) / panEnd,
    )
    if (end > start) columns.push({ c: column, start, end })
  }

  return {
    cardH,
    cardW,
    columns,
    panEnd,
    perspective: sphereRadius * 1.5,
    radius: unit * options.cornerRadius,
    rows,
    rowSpacing,
    rowSlotOffset: Math.max(1, Math.round(options.imageCount / options.rows)),
    sphereRadius,
    stepLon,
  }
}

function wrap(value: number, length: number) {
  return ((value % length) + length) % length
}

export function SphereWall({
  backgroundColor = "#101014",
  cardAspect = 1,
  className = "",
  columnGap = 2,
  columns = 5,
  cornerRadius = 0.5,
  duration = 20,
  gap = 2,
  images = DEFAULT_IMAGES,
  interactive = true,
  padding = 13,
  rows = 5,
}: SphereWallProps) {
  const rootRef = useRef<HTMLElement>(null)
  const rotorRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef(new Map<number, HTMLDivElement>())
  const layoutRef = useRef<Layout | null>(null)
  const progressRef = useRef(0)
  const reduceMotionRef = useRef(false)
  const pauseAutoUntilRef = useRef(0)
  const [viewport, setViewport] = useState<{ height: number; width: number }>()
  const [grabbing, setGrabbing] = useState(false)
  const gestureRef = useRef({
    dragging: false,
    lastTime: 0,
    lastX: 0,
    velocity: 0,
  })

  const resolvedImages = useMemo(() => {
    const usableImages = images.filter((image) => image.trim().length > 0)
    return usableImages.length > 0 ? usableImages : DEFAULT_IMAGES
  }, [images])

  const resolvedOptions = useMemo(
    () => ({
      cardAspect: clamp(cardAspect, 0.75, 3, 1),
      columnGap: clamp(columnGap, 0, 16, 2),
      columns: Math.round(clamp(columns, 3, 12, 5)),
      cornerRadius: clamp(cornerRadius, 0, 12, 0.5),
      duration: clamp(duration, 6, 180, 20),
      gap: clamp(gap, 0, 24, 2),
      padding: clamp(padding, 0, 40, 13),
      rows: Math.round(clamp(rows, 2, 12, 5)),
    }),
    [cardAspect, columnGap, columns, cornerRadius, duration, gap, padding, rows],
  )

  const layout = useMemo(() => {
    if (!viewport) return null
    return computeLayout(viewport.width, viewport.height, {
      ...resolvedOptions,
      imageCount: resolvedImages.length,
    })
  }, [resolvedImages.length, resolvedOptions, viewport])

  layoutRef.current = layout

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const update = () => {
      const bounds = root.getBoundingClientRect()
      setViewport({ height: bounds.height, width: bounds.width })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const rotor = rotorRef.current
    if (!layout || !rotor) return
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => {
      reduceMotionRef.current = motionQuery.matches
    }
    updateMotionPreference()
    motionQuery.addEventListener("change", updateMotionPreference)

    progressRef.current = wrap(progressRef.current, layout.panEnd)
    let previousTime = performance.now()
    let frame = 0

    const renderFrame = (now: number) => {
      const deltaTime = Math.min(50, now - previousTime)
      previousTime = now
      const gesture = gestureRef.current

      if (!gesture.dragging) {
        if (!reduceMotionRef.current && Math.abs(gesture.velocity) >= 0.02) {
          gesture.velocity *= Math.exp(-deltaTime / 325)
          progressRef.current +=
            (-gesture.velocity * deltaTime) / layout.sphereRadius
        } else {
          gesture.velocity = 0
          if (!reduceMotionRef.current && now >= pauseAutoUntilRef.current) {
            progressRef.current +=
              (layout.panEnd / (resolvedOptions.duration * 1000)) * deltaTime
          }
        }
      }

      progressRef.current = wrap(progressRef.current, layout.panEnd)
      const progress = progressRef.current
      const sphereRadius = layout.sphereRadius.toFixed(2)
      rotor.style.transform = `translateZ(${sphereRadius}px) rotateY(${progress.toFixed(6)}rad) translateZ(-${sphereRadius}px)`

      layout.columns.forEach((column) => {
        const element = columnRefs.current.get(column.c)
        if (!element) return
        const effectiveLongitude = column.c * layout.stepLon - progress
        element.style.visibility =
          Math.abs(effectiveLongitude) <= VISIBLE_HALF_WINDOW
            ? "visible"
            : "hidden"
      })

      frame = window.requestAnimationFrame(renderFrame)
    }

    frame = window.requestAnimationFrame(renderFrame)
    return () => {
      window.cancelAnimationFrame(frame)
      motionQuery.removeEventListener("change", updateMotionPreference)
    }
  }, [layout, resolvedOptions.duration])

  const panByPixels = useCallback((pixels: number) => {
    const currentLayout = layoutRef.current
    if (!currentLayout) return
    progressRef.current = wrap(
      progressRef.current + pixels / currentLayout.sphereRadius,
      currentLayout.panEnd,
    )
  }, [])

  const stopInertia = useCallback(() => {
    gestureRef.current.velocity = 0
    pauseAutoUntilRef.current = 0
  }, [])

  const startInertia = useCallback(() => {
    if (reduceMotionRef.current) gestureRef.current.velocity = 0
  }, [])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!interactive || (event.pointerType === "mouse" && event.button !== 0)) {
        return
      }

      const gesture = gestureRef.current
      stopInertia()
      gesture.dragging = true
      gesture.lastX = event.clientX
      gesture.lastTime = event.timeStamp
      gesture.velocity = 0
      setGrabbing(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [interactive, stopInertia],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const gesture = gestureRef.current
      if (!gesture.dragging) return

      const deltaX = event.clientX - gesture.lastX
      const deltaTime = Math.max(1, event.timeStamp - gesture.lastTime)
      gesture.lastX = event.clientX
      gesture.lastTime = event.timeStamp
      gesture.velocity = Math.max(
        -3,
        Math.min(3, gesture.velocity * 0.7 + (deltaX / deltaTime) * 0.3),
      )
      panByPixels(-deltaX)
    },
    [panByPixels],
  )

  const onPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const gesture = gestureRef.current
      if (!gesture.dragging) return

      gesture.dragging = false
      setGrabbing(false)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      startInertia()
    },
    [startInertia],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root || !interactive) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (gestureRef.current.dragging) return

      const scale = event.deltaMode === 1 ? 16 : 1
      const dominantDelta =
        (Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY) * scale
      stopInertia()
      panByPixels(dominantDelta)
      pauseAutoUntilRef.current = performance.now() + 1200
    }

    root.addEventListener("wheel", onWheel, { passive: false })
    return () => root.removeEventListener("wheel", onWheel)
  }, [interactive, panByPixels, stopInertia])

  return (
    <section
      ref={rootRef}
      aria-label="Interactive rotating sphere wall"
      className={`relative h-dvh min-h-[560px] w-full select-none overflow-hidden ${
        interactive ? (grabbing ? "cursor-grabbing touch-none" : "cursor-grab touch-none") : ""
      } ${className}`}
      style={{ backgroundColor }}
      onPointerCancel={onPointerEnd}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
    >
      {layout ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ perspective: `${layout.perspective.toFixed(2)}px` }}
        >
          <div
            ref={rotorRef}
            className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
          >
            {layout.columns.map((column) => {
              const longitude = column.c * layout.stepLon

              return (
                <div
                  key={column.c}
                  ref={(element) => {
                    if (element) columnRefs.current.set(column.c, element)
                    else columnRefs.current.delete(column.c)
                  }}
                  className="absolute inset-0 [transform-style:preserve-3d]"
                  style={{
                    transform: `translateZ(${layout.sphereRadius.toFixed(2)}px) rotateY(${(-longitude).toFixed(6)}rad) translateZ(-${layout.sphereRadius.toFixed(2)}px)`,
                  }}
                >
                  {layout.rows.map((row) => {
                    const imageIndex = wrap(
                      column.c + row * layout.rowSlotOffset,
                      resolvedImages.length,
                    )

                    return (
                      <div
                        key={row}
                        className="absolute left-1/2 top-1/2 overflow-hidden bg-zinc-800"
                        style={{
                          borderRadius: layout.radius,
                          height: layout.cardH,
                          marginLeft: -layout.cardW / 2,
                          marginTop: -layout.cardH / 2,
                          transform: `translateY(${(row * layout.rowSpacing).toFixed(2)}px)`,
                          width: layout.cardW,
                        }}
                      >
                        <img
                          alt=""
                          className="block size-full object-cover"
                          decoding="async"
                          draggable={false}
                          loading="eager"
                          src={resolvedImages[imageIndex]}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default SphereWall
