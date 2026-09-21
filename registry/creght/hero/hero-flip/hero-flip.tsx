"use client"

import { useEffect, useRef, useState } from "react"
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react"

type PositionedImage = {
  height: number
  offsetY: number
  src: string
  width: number
  x: number
  xMobile?: number
}

export type HeroFlipProps = {
  buttonHref?: string
  buttonLabel?: string
  className?: string
  creditHref?: string
  creditLabel?: string
  description?: string
  dragSensitivity?: number
  finalHeading?: string
  finalImages?: readonly string[]
  initialHeading?: string
  initialImages?: readonly string[]
  interactionLabel?: string
  interactive?: boolean
}

const DEFAULT_INITIAL_IMAGES = [
  "/assets/flip-hero/generated-initial-cabin.webp",
  "/assets/flip-hero/generated-initial-blue.webp",
  "/assets/flip-hero/generated-initial-interior.webp",
  "/assets/flip-hero/generated-initial-linen.webp",
  "/assets/flip-hero/generated-initial-orange.webp",
] as const

const DEFAULT_FINAL_IMAGES = [
  "/assets/flip-hero/generated-final-eye.webp",
  "/assets/flip-hero/generated-final-motion.webp",
  "/assets/flip-hero/generated-final-chair.webp",
  "/assets/flip-hero/generated-final-fabric.webp",
  "/assets/flip-hero/generated-final-figure.webp",
] as const

const INITIAL_LAYOUT = [
  { height: 177, offsetY: -226.5, width: 130, x: 35.42 },
  { height: 236, offsetY: 134, width: 168, x: 74.51, xMobile: 32.31 },
  { height: 112, offsetY: 72, width: 144, x: 23.06 },
  { height: 148, offsetY: 293, width: 207, x: 41.28 },
  { height: 195, offsetY: -292.5, width: 160, x: 64.86 },
] as const

const FINAL_LAYOUT = [
  { height: 216, offsetY: -245.6, width: 164, x: 32.04, xMobile: 58.95 },
  { height: 141, offsetY: 213.65, width: 100, x: 67.76 },
  { height: 204, offsetY: 54.64, width: 148, x: 27.1, xMobile: 42.87 },
  { height: 145, offsetY: 237.24, width: 165, x: 47.8 },
  { height: 171, offsetY: -124.7, width: 137, x: 74.49 },
] as const

function buildImages(
  sources: readonly string[],
  fallbackSources: readonly string[],
  layout: typeof INITIAL_LAYOUT | typeof FINAL_LAYOUT,
): PositionedImage[] {
  return layout.map((position, index) => ({
    ...position,
    src: sources[index] || fallbackSources[index],
  }))
}

function HeroCopy({
  buttonHref,
  buttonLabel,
  creditHref,
  creditLabel,
  description,
  heading,
}: {
  buttonHref: string
  buttonLabel: string
  creditHref: string
  creditLabel: string
  description: string
  heading: string
}) {
  return (
    <div className="creght-flip-hero__copy">
      <h1>{heading}</h1>
      <p>
        {description}{" "}
        <a href={creditHref}>{creditLabel}</a>
      </p>
      <a className="creght-flip-hero__button" href={buttonHref}>
        {buttonLabel}
      </a>
    </div>
  )
}

function HeroFace({
  ariaHidden,
  buttonHref,
  buttonLabel,
  creditHref,
  creditLabel,
  description,
  face,
  heading,
  images,
}: {
  ariaHidden: boolean
  buttonHref: string
  buttonLabel: string
  creditHref: string
  creditLabel: string
  description: string
  face: "final" | "initial"
  heading: string
  images: readonly PositionedImage[]
}) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={`creght-flip-hero__face creght-flip-hero__face--${face}`}
      inert={ariaHidden ? true : undefined}
    >
      {images.map((image, index) => (
        <img
          key={`${face}-${image.src}-${index}`}
          alt=""
          aria-hidden="true"
          className="creght-flip-hero__image"
          draggable={false}
          src={image.src}
          style={
            {
              "--flip-image-height": `${image.height}px`,
              "--flip-image-offset-y": `${image.offsetY}px`,
              "--flip-image-width": `${image.width}px`,
              "--flip-image-x": `${image.x}%`,
              "--flip-image-x-mobile": `${image.xMobile ?? image.x}%`,
            } as CSSProperties
          }
        />
      ))}

      <HeroCopy
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        creditHref={creditHref}
        creditLabel={creditLabel}
        description={description}
        heading={heading}
      />
    </div>
  )
}

export function HeroFlip({
  buttonHref = "#work",
  buttonLabel = "View work",
  className = "",
  creditHref = "#about",
  creditLabel = "Discover the story behind each frame.",
  description =
    "Portraits, places, and quiet moments photographed with natural light and honest detail.",
  dragSensitivity = 0.55,
  finalHeading = "Through My Lens",
  finalImages = DEFAULT_FINAL_IMAGES,
  initialHeading = "Stories in Light",
  initialImages = DEFAULT_INITIAL_IMAGES,
  interactionLabel =
    "Drag horizontally or use the left and right arrow keys to explore the photography portfolio",
  interactive = true,
}: HeroFlipProps) {
  const [introComplete, setIntroComplete] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState(-360)
  const activePointer = useRef<number | null>(null)
  const dragStartRotation = useRef(0)
  const dragStartX = useRef(0)
  const rotationRef = useRef(-360)

  useEffect(() => {
    if (!interactive) {
      setIntroComplete(false)
      setIsDragging(false)
      setRotation(-360)
      rotationRef.current = -360
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const timer = window.setTimeout(
      () => setIntroComplete(true),
      prefersReducedMotion ? 0 : 1400,
    )

    return () => window.clearTimeout(timer)
  }, [interactive])

  const updateRotation = (nextRotation: number) => {
    rotationRef.current = nextRotation
    setRotation(nextRotation)
  }

  const snapToNearestFace = () => {
    const snappedRotation = Math.round(rotationRef.current / 180) * 180
    updateRotation(snappedRotation)
    setIsDragging(false)
  }

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (!introComplete || !interactive) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    if ((event.target as Element).closest("a, button, input, select, textarea")) {
      return
    }

    activePointer.current = event.pointerId
    dragStartX.current = event.clientX
    dragStartRotation.current = rotationRef.current
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (activePointer.current !== event.pointerId) return

    const dragDistance = event.clientX - dragStartX.current
    updateRotation(
      dragStartRotation.current + dragDistance * dragSensitivity,
    )
  }

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (activePointer.current !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    activePointer.current = null
    snapToNearestFace()
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!introComplete || !interactive) return
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

    event.preventDefault()
    const direction = event.key === "ArrowLeft" ? -1 : 1
    updateRotation(rotationRef.current + direction * 180)
  }

  const positionedInitialImages = buildImages(
    initialImages,
    DEFAULT_INITIAL_IMAGES,
    INITIAL_LAYOUT,
  )
  const positionedFinalImages = buildImages(
    finalImages,
    DEFAULT_FINAL_IMAGES,
    FINAL_LAYOUT,
  )
  const initialFaceIsActive =
    introComplete && Math.abs(Math.round(rotation / 180)) % 2 === 1

  return (
    <section
      aria-label={interactive ? interactionLabel : undefined}
      className={`creght-flip-hero relative isolate h-dvh w-full overflow-hidden bg-white text-[#050505] ${introComplete ? "creght-flip-hero--interactive" : ""} ${isDragging ? "creght-flip-hero--dragging" : ""} ${className}`}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      style={
        {
          "--flip-drag-rotation": `${rotation}deg`,
        } as CSSProperties
      }
      tabIndex={interactive ? 0 : undefined}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Nunito+Sans:wght@500&display=swap");

        .creght-flip-hero {
          font-family: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }

        .creght-flip-hero__face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .creght-flip-hero__face > * {
          backface-visibility: hidden;
        }

        .creght-flip-hero__face--initial {
          transform: perspective(1200px) rotateY(0deg);
          animation: creght-flip-hero-initial 450ms cubic-bezier(.55, .055, .675, .19) 450ms both;
        }

        .creght-flip-hero__face--final {
          transform: perspective(1200px) rotateY(-235deg);
          animation: creght-flip-hero-final 450ms cubic-bezier(.215, .61, .355, 1) 900ms both;
        }

        .creght-flip-hero--interactive {
          cursor: grab;
          touch-action: pan-y;
        }

        .creght-flip-hero--interactive.creght-flip-hero--dragging {
          cursor: grabbing;
          user-select: none;
        }

        .creght-flip-hero--interactive .creght-flip-hero__face {
          animation: none;
          transition: transform 500ms cubic-bezier(.22, 1, .36, 1);
        }

        .creght-flip-hero--dragging .creght-flip-hero__face {
          transition: none;
        }

        .creght-flip-hero--interactive .creght-flip-hero__face--initial {
          transform: perspective(1200px) rotateY(calc(var(--flip-drag-rotation) + 180deg));
        }

        .creght-flip-hero--interactive .creght-flip-hero__face--final {
          transform: perspective(1200px) rotateY(var(--flip-drag-rotation));
        }

        .creght-flip-hero:focus-visible {
          outline: 2px solid #008cff;
          outline-offset: -4px;
        }

        .creght-flip-hero__image {
          position: absolute;
          left: var(--flip-image-x);
          top: calc(50% + var(--flip-image-offset-y));
          width: var(--flip-image-width);
          height: var(--flip-image-height);
          max-width: none;
          object-fit: cover;
          object-position: center;
          transform: translate(-50%, -50%);
          user-select: none;
          pointer-events: none;
        }

        .creght-flip-hero__face--initial .creght-flip-hero__image:nth-child(2) {
          z-index: 2;
        }

        .creght-flip-hero__face--initial .creght-flip-hero__image:nth-child(3) {
          z-index: 1;
        }

        .creght-flip-hero__copy {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 384px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
        }

        .creght-flip-hero__copy h1 {
          margin: 0;
          color: #050505;
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
          font-size: 49px;
          font-weight: 600;
          letter-spacing: -.01em;
          line-height: 1.1;
          white-space: nowrap;
        }

        .creght-flip-hero__copy p {
          width: 384px;
          margin: 20px 0 0;
          color: #666;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -.01em;
          line-height: 1.5;
        }

        .creght-flip-hero__copy p a {
          color: #008cff;
          text-decoration: none;
        }

        .creght-flip-hero__button {
          min-width: 80px;
          height: 40px;
          margin-top: 28px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #050505;
          color: white;
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -.01em;
          line-height: 1.2;
          text-decoration: none;
          transition: transform 180ms ease, background-color 180ms ease;
        }

        .creght-flip-hero__button:hover {
          background: #1b1b1b;
          transform: scale(.97);
        }

        .creght-flip-hero__button:focus-visible {
          outline: 2px solid #008cff;
          outline-offset: 4px;
        }

        @keyframes creght-flip-hero-initial {
          from { transform: perspective(1200px) rotateY(0deg); }
          to { transform: perspective(1200px) rotateY(-115deg); }
        }

        @keyframes creght-flip-hero-final {
          from { transform: perspective(1200px) rotateY(-235deg); }
          to { transform: perspective(1200px) rotateY(-360deg); }
        }

        @media (max-width: 600px) {
          .creght-flip-hero__image {
            left: var(--flip-image-x-mobile);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .creght-flip-hero__face--initial {
            display: none;
            animation: none;
          }

          .creght-flip-hero__face--final {
            animation: none;
            transform: perspective(1200px) rotateY(-360deg);
          }

          .creght-flip-hero--interactive .creght-flip-hero__face {
            transition: none;
          }

          .creght-flip-hero--interactive .creght-flip-hero__face--initial {
            display: block;
            transform: perspective(1200px) rotateY(calc(var(--flip-drag-rotation) + 180deg));
          }

          .creght-flip-hero--interactive .creght-flip-hero__face--final {
            transform: perspective(1200px) rotateY(var(--flip-drag-rotation));
          }
        }
      `}</style>

      <HeroFace
        ariaHidden={!initialFaceIsActive}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        creditHref={creditHref}
        creditLabel={creditLabel}
        description={description}
        face="initial"
        heading={initialHeading}
        images={positionedInitialImages}
      />
      <HeroFace
        ariaHidden={initialFaceIsActive}
        buttonHref={buttonHref}
        buttonLabel={buttonLabel}
        creditHref={creditHref}
        creditLabel={creditLabel}
        description={description}
        face="final"
        heading={finalHeading}
        images={positionedFinalImages}
      />
    </section>
  )
}

export default HeroFlip
