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
const COLUMN_BUFFER = 2
const INITIAL_EAGER_COLUMNS = 4

type Column = {
  c: number
  slot: number
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
  dragEnabled?: boolean
  wheelEnabled?: boolean
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
  const firstRow = -Math.floor(options.rows / 2)

  for (let row = 0; row < options.rows; row += 1) {
    rows.push(firstRow + row)
  }

  const columnCount = Math.max(
    3,
    Math.ceil((VISIBLE_HALF_WINDOW * 2) / stepLon) + COLUMN_BUFFER * 2 + 1,
  )
  const firstColumn = getFirstRenderedColumn(0, stepLon)
  const columns: Column[] = []

  for (let slot = 0; slot < columnCount; slot += 1) {
    columns.push({ c: firstColumn + slot, slot })
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

function getFirstRenderedColumn(progress: number, stepLon: number) {
  return (
    Math.floor(progress / stepLon) +
    Math.ceil(-VISIBLE_HALF_WINDOW / stepLon) -
    COLUMN_BUFFER
  )
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
  dragEnabled,
  wheelEnabled,
  interactive = true,
  padding = 13,
  rows = 5,
}: SphereWallProps) {
  const resolvedDragEnabled = dragEnabled ?? interactive
  const resolvedWheelEnabled = wheelEnabled ?? interactive
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
    const root = rootRef.current
    const rotor = rotorRef.current
    if (!layout || !root || !rotor) return
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    progressRef.current = wrap(progressRef.current, layout.panEnd)
    let previousTime = performance.now()
    let frame = 0
    let isIntersecting = true
    let isDocumentVisible = !document.hidden

    const stop = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const canAnimate = () =>
      isIntersecting && isDocumentVisible && !reduceMotionRef.current

    const updateColumnImages = (column: Column, activeColumn: number) => {
      const element = columnRefs.current.get(column.slot)
      if (!element || column.c === activeColumn) return

      column.c = activeColumn
      element.querySelectorAll<HTMLImageElement>("img").forEach((image, index) => {
        const row = layout.rows[index] ?? 0
        image.src = resolvedImages[
          wrap(activeColumn + row * layout.rowSlotOffset, resolvedImages.length)
        ]
      })
    }

    const updateColumns = (progress: number) => {
      const firstColumn = getFirstRenderedColumn(progress, layout.stepLon)

      layout.columns.forEach((column) => {
        const activeColumn = firstColumn + column.slot
        const element = columnRefs.current.get(column.slot)
        if (!element) return

        updateColumnImages(column, activeColumn)
        const effectiveLongitude = activeColumn * layout.stepLon - progress
        const sphereRadius = layout.sphereRadius.toFixed(2)
        element.style.transform = `translateZ(${sphereRadius}px) rotateY(${(-activeColumn * layout.stepLon).toFixed(6)}rad) translateZ(-${sphereRadius}px)`
        element.style.visibility =
          Math.abs(effectiveLongitude) <= VISIBLE_HALF_WINDOW
            ? "visible"
            : "hidden"
      })
    }

    function schedule() {
      if (!canAnimate() || frame !== 0) return
      frame = window.requestAnimationFrame(renderFrame)
    }

    const updateMotionPreference = () => {
      reduceMotionRef.current = motionQuery.matches
      if (canAnimate()) schedule()
      else stop()
    }

    const updateDocumentVisibility = () => {
      isDocumentVisible = !document.hidden
      if (canAnimate()) schedule()
      else stop()
    }

    const renderFrame = (now: number) => {
      frame = 0
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
      rotor.style.transform = `translateZ(${layout.sphereRadius.toFixed(2)}px) rotateY(${progress.toFixed(6)}rad) translateZ(-${layout.sphereRadius.toFixed(2)}px)`
      updateColumns(progress)
      schedule()
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false
        if (canAnimate()) schedule()
        else stop()
      },
      { threshold: 0.01 },
    )

    visibilityObserver.observe(root)
    motionQuery.addEventListener("change", updateMotionPreference)
    document.addEventListener("visibilitychange", updateDocumentVisibility)
    reduceMotionRef.current = motionQuery.matches
    updateColumns(progressRef.current)
    schedule()

    return () => {
      stop()
      visibilityObserver.disconnect()
      motionQuery.removeEventListener("change", updateMotionPreference)
      document.removeEventListener("visibilitychange", updateDocumentVisibility)
    }
  }, [layout, resolvedImages, resolvedOptions.duration])

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
      if (!resolvedDragEnabled || (event.pointerType === "mouse" && event.button !== 0)) {
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
    [resolvedDragEnabled, stopInertia],
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
    if (!root || !resolvedWheelEnabled) return

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
  }, [panByPixels, resolvedWheelEnabled, stopInertia])

  return (
    <section
      ref={rootRef}
      aria-label="Interactive rotating sphere wall"
      className={`relative h-dvh min-h-[560px] w-full select-none overflow-hidden ${
        resolvedDragEnabled
          ? grabbing
            ? "cursor-grabbing touch-none"
            : "cursor-grab touch-none"
          : ""
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
                  key={column.slot}
                  ref={(element) => {
                    if (element) columnRefs.current.set(column.slot, element)
                    else columnRefs.current.delete(column.slot)
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
                          loading={column.slot < INITIAL_EAGER_COLUMNS ? "eager" : "lazy"}
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
