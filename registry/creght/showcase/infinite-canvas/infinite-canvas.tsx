import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react"

const DEFAULT_ITEMS = [
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295542098__showcase_infinite_canvas_generated_initial_cabin.webp",
    title: "House Fun fact",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 59,
    anchorY: 46,
    width: 244,
    height: 344.188,
    imageHeight: 305,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295544093__showcase_infinite_canvas_flower_custom.jpg",
    title: "Flower Power",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 50,
    anchorY: 2,
    width: 212,
    height: 303.984,
    imageHeight: 264.8,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295543162__showcase_shared_generated_final_eye.webp",
    title: "Love Makes Your Crazy",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 72,
    anchorY: 61,
    width: 273,
    height: 380.438,
    imageHeight: 341.25,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295541535__showcase_infinite_canvas_generated_initial_blue.webp",
    title: "Blue Is The Sky Color",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 91,
    anchorY: 52,
    width: 238,
    height: 277.188,
    imageHeight: 238,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295542575__showcase_infinite_canvas_generated_initial_interior.webp",
    title: "White Peace",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 21,
    anchorY: 12,
    width: 162,
    height: 197.359,
    imageHeight: 150.375,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295549367__showcase_infinite_canvas_lotus_custom.jpg",
    title: "Lotus Flower Bnw",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 31,
    anchorY: 65,
    width: 143,
    height: 198.016,
    imageHeight: 151.031,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295544031__showcase_infinite_canvas_generated_initial_orange.webp",
    title: "Orange Is The New Black",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 19,
    anchorY: 81,
    width: 256,
    height: 357.992,
    imageHeight: 318.8,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295540843__showcase_infinite_canvas_bloom_custom.jpg",
    title: "Bloom",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus and additional artist Proof",
    year: "2024",
    anchorX: 3,
    anchorY: 34,
    width: 174,
    height: 285.289,
    imageHeight: 246.094,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295541915__showcase_shared_generated_final_figure.webp",
    title: "Pneumatici Pirelli",
    detail: "12 x 6 inch C type hand print",
    edition: "Edition of 1 Plus",
    year: "2024",
    anchorX: 83,
    anchorY: 24,
    width: 114,
    height: 197.977,
    imageHeight: 158.789,
  },
] as const

const COPY_OFFSETS = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
] as const

export type InfiniteCanvasItem = {
  image: string
  title: string
  detail?: string
  edition?: string
  year?: string
  anchorX: number
  anchorY: number
  width: number
  height: number
  imageHeight: number
}

export type InfiniteCanvasProps = {
  className?: string
  items?: readonly InfiniteCanvasItem[]
  instruction?: string
}

type MotionState = {
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  velocityX: number
  velocityY: number
  stiffness: number
  damping: number
  frame: number
  lastFrameTime: number
}

type DragState = {
  active: boolean
  pointerId: number
  lastX: number
  lastY: number
  lastTime: number
  velocityX: number
  velocityY: number
  totalX: number
  totalY: number
}

type PointerParallaxState = {
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  canvasDeltaX: number
  canvasDeltaY: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function wrapCanvasPosition(value: number, size: number) {
  if (size <= 0 || Math.abs(value) < 0.001) return 0
  const wrapped = ((value % size) + size) % size
  return wrapped === 0 ? 0 : wrapped - size
}

export function InfiniteCanvas({
  className = "",
  items = DEFAULT_ITEMS,
  instruction = "SCROLL/DRAG TO MOVE",
}: InfiniteCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotionRef = useRef(false)
  const motionRef = useRef<MotionState>({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    stiffness: 160,
    damping: 24,
    frame: 0,
    lastFrameTime: 0,
  })
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
    totalX: 0,
    totalY: 0,
  })
  const pointerParallaxRef = useRef<PointerParallaxState>({
    currentX: 0.5,
    currentY: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    canvasDeltaX: 0,
    canvasDeltaY: 0,
  })

  const applyPosition = useCallback(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const motion = motionRef.current
    const parallax = pointerParallaxRef.current
    const x = wrapCanvasPosition(motion.currentX, root.clientWidth)
    const y = wrapCanvasPosition(motion.currentY, root.clientHeight)
    canvas.style.setProperty("--infinite-canvas-x", `${x}px`)
    canvas.style.setProperty("--infinite-canvas-y", `${y}px`)

    const pointerX = (parallax.currentX - 0.5) * 60
    const pointerY = (parallax.currentY - 0.5) * 60
    canvas
      .querySelectorAll<HTMLElement>(".infinite-canvas__item")
      .forEach((element) => {
        const ease = Number(element.dataset.parallaxEase) || 0.75
        const inertiaX = parallax.canvasDeltaX * ease * 5
        const inertiaY = parallax.canvasDeltaY * ease * 5
        element.style.setProperty(
          "--item-parallax-x",
          `calc(${pointerX}% + ${inertiaX}px)`,
        )
        element.style.setProperty(
          "--item-parallax-y",
          `calc(${pointerY}% + ${inertiaY}px)`,
        )
      })
  }, [])

  const animatePosition = useCallback(
    (time: number) => {
      const motion = motionRef.current
      const parallax = pointerParallaxRef.current
      const deltaTime = motion.lastFrameTime
        ? Math.min(32, Math.max(1, time - motion.lastFrameTime)) / 1000
        : 0.016
      motion.lastFrameTime = time
      const previousCanvasX = motion.currentX
      const previousCanvasY = motion.currentY

      if (prefersReducedMotionRef.current) {
        motion.currentX = motion.targetX
        motion.currentY = motion.targetY
        motion.velocityX = 0
        motion.velocityY = 0
        parallax.currentX = 0.5
        parallax.currentY = 0.5
        parallax.canvasDeltaX = 0
        parallax.canvasDeltaY = 0
      } else {
        motion.velocityX +=
          ((motion.targetX - motion.currentX) * motion.stiffness -
            motion.velocityX * motion.damping) *
          deltaTime
        motion.velocityY +=
          ((motion.targetY - motion.currentY) * motion.stiffness -
            motion.velocityY * motion.damping) *
          deltaTime
        motion.currentX += motion.velocityX * deltaTime
        motion.currentY += motion.velocityY * deltaTime

        const parallaxEase = 1 - Math.pow(0.96, deltaTime * 60)
        parallax.currentX +=
          (parallax.targetX - parallax.currentX) * parallaxEase
        parallax.currentY +=
          (parallax.targetY - parallax.currentY) * parallaxEase
        const canvasStepX = motion.currentX - previousCanvasX
        const canvasStepY = motion.currentY - previousCanvasY
        parallax.canvasDeltaX +=
          (canvasStepX - parallax.canvasDeltaX) * parallaxEase
        parallax.canvasDeltaY +=
          (canvasStepY - parallax.canvasDeltaY) * parallaxEase
      }

      applyPosition()

      const remainingX = Math.abs(motion.targetX - motion.currentX)
      const remainingY = Math.abs(motion.targetY - motion.currentY)
      const movingX = Math.abs(motion.velocityX)
      const movingY = Math.abs(motion.velocityY)
      const remainingPointerX = Math.abs(parallax.targetX - parallax.currentX)
      const remainingPointerY = Math.abs(parallax.targetY - parallax.currentY)
      const parallaxMoving =
        Math.abs(parallax.canvasDeltaX) > 0.002 ||
        Math.abs(parallax.canvasDeltaY) > 0.002
      if (
        remainingX > 0.05 ||
        remainingY > 0.05 ||
        movingX > 0.2 ||
        movingY > 0.2 ||
        remainingPointerX > 0.0001 ||
        remainingPointerY > 0.0001 ||
        parallaxMoving
      ) {
        motion.frame = window.requestAnimationFrame(animatePosition)
      } else {
        motion.currentX = motion.targetX
        motion.currentY = motion.targetY
        motion.velocityX = 0
        motion.velocityY = 0
        parallax.currentX = parallax.targetX
        parallax.currentY = parallax.targetY
        parallax.canvasDeltaX = 0
        parallax.canvasDeltaY = 0
        motion.lastFrameTime = 0
        motion.frame = 0
        applyPosition()
      }
    },
    [applyPosition],
  )

  const scheduleMotion = useCallback(() => {
    const motion = motionRef.current
    if (motion.frame) return
    motion.lastFrameTime = 0
    motion.frame = window.requestAnimationFrame(animatePosition)
  }, [animatePosition])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return

    const motion = motionRef.current
    if (motion.frame) {
      window.cancelAnimationFrame(motion.frame)
      motion.frame = 0
    }
    motion.targetX = motion.currentX
    motion.targetY = motion.currentY
    motion.velocityX = 0
    motion.velocityY = 0
    motion.stiffness = 80
    motion.damping = 16

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocityX: 0,
      velocityY: 0,
      totalX: 0,
      totalY: 0,
    }
    event.currentTarget.classList.add("is-dragging")
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (root && event.pointerType === "mouse") {
      const bounds = root.getBoundingClientRect()
      const parallax = pointerParallaxRef.current
      parallax.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
      parallax.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1)
      scheduleMotion()
    }

    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.lastX
    const deltaY = event.clientY - drag.lastY
    const deltaTime = Math.max(8, event.timeStamp - drag.lastTime)
    const nextVelocityX = deltaX / deltaTime
    const nextVelocityY = deltaY / deltaTime
    drag.velocityX = drag.velocityX * 0.35 + nextVelocityX * 0.65
    drag.velocityY = drag.velocityY * 0.35 + nextVelocityY * 0.65
    drag.totalX += deltaX
    drag.totalY += deltaY
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastTime = event.timeStamp

    motionRef.current.targetX += deltaX
    motionRef.current.targetY += deltaY
    scheduleMotion()
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.active = false
    drag.pointerId = -1
    event.currentTarget.classList.remove("is-dragging")
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    motionRef.current.targetX += clamp(drag.totalX * 0.32, -180, 180)
    motionRef.current.targetY += clamp(drag.totalY * 0.19, -180, 180)
    scheduleMotion()
  }

  const moveWithWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    motionRef.current.stiffness = 160
    motionRef.current.damping = 24
    motionRef.current.targetX -= event.deltaX * 0.735
    motionRef.current.targetY -= event.deltaY * 0.735
    scheduleMotion()
  }

  const moveWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const amount = event.shiftKey ? 120 : 48
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return
    event.preventDefault()
    motionRef.current.stiffness = 160
    motionRef.current.damping = 24
    if (event.key === "ArrowLeft") motionRef.current.targetX += amount
    if (event.key === "ArrowRight") motionRef.current.targetX -= amount
    if (event.key === "ArrowUp") motionRef.current.targetY += amount
    if (event.key === "ArrowDown") motionRef.current.targetY -= amount
    scheduleMotion()
  }

  useEffect(() => {
    const motion = motionRef.current
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const observer = new ResizeObserver(applyPosition)
    if (rootRef.current) observer.observe(rootRef.current)

    return () => {
      observer.disconnect()
      if (motion.frame) {
        window.cancelAnimationFrame(motion.frame)
      }
    }
  }, [applyPosition])

  return (
    <main
      ref={rootRef}
      aria-label="Interactive infinite image canvas"
      className={`infinite-canvas ${className}`.trim()}
      onKeyDown={moveWithKeyboard}
      onPointerCancel={endDrag}
      onPointerDown={startDrag}
      onPointerMove={movePointer}
      onPointerUp={endDrag}
      onWheel={moveWithWheel}
      tabIndex={0}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{INFINITE_CANVAS_STYLES}</style>

      <div ref={canvasRef} className="infinite-canvas__canvas">
        {items.map((item, itemIndex) =>
          COPY_OFFSETS.map((copy, copyIndex) => {
            const itemStyle = {
              "--item-left": `calc(${item.anchorX}vw - ${item.width / 2}px)`,
              "--item-top": `calc(${item.anchorY}vh - ${item.height / 2}px)`,
              "--item-width": `${item.width}px`,
              "--item-height": `${item.height}px`,
              "--item-image-height": `${item.imageHeight}px`,
              "--copy-x": copy.x ? "100vw" : "0px",
              "--copy-y": copy.y ? "100svh" : "0px",
              "--item-parallax-x": "0px",
              "--item-parallax-y": "0px",
            } as CSSProperties
            const isPrimary = copyIndex === 0
            const parallaxEase = 0.5 + (((itemIndex * 37 + 19) % 50) / 100)

            return (
              <article
                aria-hidden={!isPrimary}
                className="infinite-canvas__item"
                data-parallax-ease={parallaxEase}
                key={`${item.title}-${copy.x}-${copy.y}-${itemIndex}`}
                style={itemStyle}
              >
                <img
                  alt={isPrimary ? item.title : ""}
                  decoding="async"
                  draggable={false}
                  loading="eager"
                  src={item.image}
                />
                <div className="infinite-canvas__caption">
                  <p>{item.title}</p>
                  {item.detail ? <p>{item.detail}</p> : null}
                  {item.edition ? <p>{item.edition}</p> : null}
                  {item.year ? <p>{item.year}</p> : null}
                </div>
              </article>
            )
          }),
        )}
      </div>

      <div aria-hidden="true" className="infinite-canvas__instruction">
        <svg viewBox="0 0 20 20">
          <path d="M7.5 4.583 9.117 2.967a1.25 1.25 0 0 1 1.766 0L12.5 4.583M4.583 7.5 2.967 9.117a1.25 1.25 0 0 0 0 1.766L4.583 12.5M15.417 7.5l1.616 1.617a1.25 1.25 0 0 1 0 1.766L15.417 12.5M12.5 15.417l-1.617 1.616a1.25 1.25 0 0 1-1.766 0L7.5 15.417M10 3.333V10m0 0v6.667M10 10H3.333M10 10h6.667" />
        </svg>
        <span>{instruction}</span>
      </div>
    </main>
  )
}

const INFINITE_CANVAS_STYLES = `
  .infinite-canvas,
  .infinite-canvas * {
    box-sizing: border-box;
  }

  .infinite-canvas {
    background: #050505;
    color: #fff;
    cursor: grab;
    height: 100svh;
    overflow: hidden;
    position: relative;
    touch-action: none;
    user-select: none;
    width: 100%;
  }

  .infinite-canvas:focus-visible {
    outline: 1px solid rgba(255, 255, 255, .36);
    outline-offset: -6px;
  }

  .infinite-canvas.is-dragging {
    cursor: grabbing;
  }

  .infinite-canvas__canvas {
    --infinite-canvas-x: 0px;
    --infinite-canvas-y: 0px;
    height: 100%;
    left: 0;
    overflow: visible;
    position: absolute;
    top: 0;
    transform: translate3d(var(--infinite-canvas-x), var(--infinite-canvas-y), 0);
    width: 100%;
    will-change: transform;
  }

  .infinite-canvas__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: var(--item-height);
    left: calc(var(--item-left) + var(--copy-x));
    overflow: clip;
    pointer-events: none;
    position: absolute;
    top: calc(var(--item-top) + var(--copy-y));
    transform: translate3d(
      var(--item-parallax-x),
      var(--item-parallax-y),
      0
    );
    width: var(--item-width);
    will-change: transform;
  }

  .infinite-canvas__item img {
    display: block;
    flex: 0 0 auto;
    height: var(--item-image-height);
    object-fit: cover;
    pointer-events: none;
    width: 100%;
  }

  .infinite-canvas__caption {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  .infinite-canvas__caption p {
    color: #fff;
    font-family: "Roboto Mono", monospace;
    font-size: 6px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.3;
    margin: 0;
  }

  .infinite-canvas__instruction {
    align-items: center;
    bottom: 40px;
    color: #fff;
    display: flex;
    gap: 12px;
    left: 50%;
    mix-blend-mode: difference;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 20;
  }

  .infinite-canvas__instruction svg {
    display: block;
    flex: 0 0 auto;
    height: 20px;
    image-rendering: pixelated;
    width: 20px;
  }

  .infinite-canvas__instruction path {
    fill: transparent;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
  }

  .infinite-canvas__instruction span {
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -.02em;
    line-height: .9;
  }
`
