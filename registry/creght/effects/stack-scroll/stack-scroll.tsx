"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1787295542098__showcase_infinite_canvas_generated_initial_cabin.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295541535__showcase_infinite_canvas_generated_initial_blue.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295542575__showcase_infinite_canvas_generated_initial_interior.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787307265381__hero_flip_generated_initial_linen.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295544031__showcase_infinite_canvas_generated_initial_orange.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295543162__showcase_shared_generated_final_eye.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295543415__showcase_scramble_glitch_generated_final_motion.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295541350__showcase_scramble_glitch_generated_final_chair.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295542129__showcase_scramble_glitch_generated_final_fabric.webp",
  "https://fsu.creght.com/site/2083536173505974272/1787295541915__showcase_shared_generated_final_figure.webp",
] as const

const CARD_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 3, 1, 7, 2, 8, 4, 6, 9, 0, 5] as const

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export type StackScrollProps = {
  className?: string
  endLabel?: string
  images?: readonly string[]
}

export function StackScroll({
  className = "",
  endLabel = "super cool, right? :))",
  images = DEFAULT_IMAGES,
}: StackScrollProps) {
  const rootRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  const resolvedImages = useMemo(
    () =>
      CARD_ORDER.map((imageIndex) =>
        images[imageIndex % Math.max(images.length, 1)] ?? DEFAULT_IMAGES[imageIndex % DEFAULT_IMAGES.length],
      ),
    [images],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0

    const update = () => {
      frame = 0
      if (motionQuery.matches) {
        setProgress(0.32)
        return
      }

      const travel = 1510
      const next = clamp01(-root.getBoundingClientRect().top / travel)
      setProgress((current) => (Math.abs(current - next) < 0.0005 ? current : next))
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    motionQuery.addEventListener("change", scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      motionQuery.removeEventListener("change", scheduleUpdate)
    }
  }, [])

  const orbitOffset = 1000 - progress * 1900
  const deckOffset = -1200 + progress * 3000
  const middleLift = -20 * Math.sin(progress * Math.PI)
  const middleSlide = -12 * Math.sin(progress * Math.PI)
  const rotationShift = progress * 340

  return (
    <main ref={rootRef} className={`stack-scroll ${className}`.trim()}>
      <style>{STACK_SCROLL_STYLES}</style>

      <section className="stack-scroll__sequence" aria-label="Three-dimensional scrolling card stack">
        <p className="stack-scroll__instruction">Scroll to rotate the card stack.</p>
        <div className="stack-scroll__sticky">
          <div className="stack-scroll__perspective">
            <div
              className="stack-scroll__orbit"
              style={{
                "--stack-scroll-middle-lift": `${middleLift}px`,
                "--stack-scroll-middle-slide": `${middleSlide}px`,
                transform: `translate3d(calc(${orbitOffset}px + var(--stack-scroll-middle-slide)), calc(${orbitOffset}px + var(--stack-scroll-middle-lift)), 0) rotateY(-90deg)`,
              } as CSSProperties}
            >
              <div
                className="stack-scroll__deck"
                style={{
                  transform: `translate(-50%, -50%) translateX(${deckOffset}px) rotate(25deg) rotateX(60deg) rotateY(40deg)`,
                }}
              >
                {resolvedImages.map((src, index) => {
                  const style = {
                    "--stack-card-z": `${(index - 10) * 100}px`,
                    "--stack-card-angle": `${50 - index * 5 - rotationShift}deg`,
                  } as CSSProperties

                  return (
                    <div className="stack-scroll__card-position" key={`${src}-${index}`} style={style}>
                      <div className="stack-scroll__card" aria-hidden="true">
                        <div className="stack-scroll__image-frame">
                          <img src={src} alt="" aria-hidden="true" draggable={false} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-scroll__outro" aria-label={endLabel}>
        <p>{endLabel}</p>
      </section>
    </main>
  )
}

const STACK_SCROLL_STYLES = `
  @font-face {
    font-family: "Stack Scroll Inter";
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url("https://fsu.creght.com/site/2083536173505974272/1789974797322__creght_blocks_stack_scroll_inter.woff2") format("woff2");
  }

  .stack-scroll,
  .stack-scroll * {
    box-sizing: border-box;
  }

  .stack-scroll {
    background: #050505;
    color: #fff;
    font-family: "Stack Scroll Inter", Inter, Arial, sans-serif;
    min-height: calc(200dvh + 1510px);
    overflow: clip;
    position: relative;
    width: 100%;
  }

  .stack-scroll__sequence {
    height: calc(100dvh + 1510px);
    position: relative;
    width: 100%;
  }

  .stack-scroll__instruction {
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .stack-scroll__sticky {
    align-items: center;
    display: flex;
    height: 100dvh;
    justify-content: center;
    overflow: hidden;
    position: sticky;
    top: 0;
    width: 100%;
  }

  .stack-scroll__perspective {
    height: 100%;
    position: relative;
    transform: perspective(1500px);
    transform-style: preserve-3d;
    width: 100%;
  }

  .stack-scroll__orbit {
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .stack-scroll__deck {
    align-items: center;
    display: flex;
    height: 350px;
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    width: 294px;
    will-change: transform;
  }

  .stack-scroll__card-position {
    height: 350px;
    left: 58px;
    position: absolute;
    top: -76px;
    transform: translateZ(var(--stack-card-z)) rotate(var(--stack-card-angle));
    transform-origin: 50% 50%;
    width: 250px;
    will-change: transform;
  }

  .stack-scroll__card {
    background: rgba(255, 191, 255, .07);
    border-radius: 12px;
    box-shadow: inset 0 0 0 .5px rgb(240, 225, 185);
    height: 350px;
    margin: 0;
    overflow: hidden;
    position: relative;
    width: 250px;
  }

  .stack-scroll__image-frame {
    height: 254px;
    left: 13px;
    overflow: hidden;
    position: absolute;
    top: 15px;
    width: 224px;
  }

  .stack-scroll__image-frame img {
    display: block;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    width: 100%;
  }

  .stack-scroll__outro {
    align-items: center;
    display: flex;
    height: 100dvh;
    justify-content: center;
    min-height: 560px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .stack-scroll__outro p {
    color: #fff;
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 31.2px;
    margin: 0;
  }

  @media (max-width: 809px) {
    .stack-scroll__orbit {
      --stack-scroll-middle-lift: 0px !important;
      --stack-scroll-middle-slide: 0px !important;
    }
  }
`

export default StackScroll
