"use client"

import { useEffect, useRef, type CSSProperties } from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1789974877456__creght_blocks_unroll_scroll_image_01.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974878337__creght_blocks_unroll_scroll_image_02.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974880191__creght_blocks_unroll_scroll_image_04.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974879277__creght_blocks_unroll_scroll_image_03.avif",
] as const

const ROW_POSITIONS = ["30%", "59.5%", ".5%", "59.5%"] as const

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export type UnrollScrollProps = {
  className?: string
  description?: string
  eyebrow?: string
  headline?: string
  images?: readonly string[]
}

export function UnrollScroll({
  className = "",
  description = "A sequence of images unrolling, guided by scroll, angle and animation.",
  eyebrow = "Framer Component",
  headline = "Image Unroll Scroll",
  images = DEFAULT_IMAGES,
}: UnrollScrollProps) {
  const rootRef = useRef<HTMLElement>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0

    const update = () => {
      frame = 0
      const localScroll = Math.max(0, -root.getBoundingClientRect().top)

      pageRefs.current.forEach((page, index) => {
        if (!page) return
        const start = 180 + index * 350
        const progress = motionQuery.matches
          ? 1
          : clamp01((localScroll - start) / 650)
        const curl = 92 - progress * 70
        const foldOpacity = 0.34 + progress * 0.46
        const foldShade = 0.52 + progress * 0.3

        page.style.setProperty("--unroll-curl", `${curl}%`)
        page.style.setProperty("--unroll-fold-opacity", `${foldOpacity}`)
        page.style.setProperty("--unroll-fold-shade", `${foldShade}`)
      })
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

  const resolvedImages = Array.from(
    { length: 4 },
    (_, index) => images[index] ?? DEFAULT_IMAGES[index],
  )

  const headlineWords = headline.trim().split(/\s+/)
  const firstLine = headlineWords[0] ?? "Image"
  const remainingLines = headlineWords.slice(1)
  const eyebrowWords = eyebrow.trim().split(/\s+/)

  return (
    <main
      className={`unroll-scroll ${className}`.trim()}
      data-testid="unroll-scroll-root"
      ref={rootRef}
    >
      <style>{UNROLL_SCROLL_STYLES}</style>

      <section
        aria-label="Images unrolling as the page scrolls"
        className="unroll-scroll__sequence"
      >
        <div className="unroll-scroll__sticky">
          <div className="unroll-scroll__hero">
            <div className="unroll-scroll__hero-left">
              <p className="unroll-scroll__eyebrow" aria-label={eyebrow}>
                <span>{eyebrowWords[0] ?? "Framer"}</span>
                <span>{eyebrowWords.slice(1).join(" ") || "Component"}</span>
              </p>

              <h1 className="unroll-scroll__headline">
                <span>{firstLine}</span>
                <span className="unroll-scroll__headline-tail">
                  {remainingLines.map((word, index) => (
                    <span key={`${word}-${index}`}>{word}</span>
                  ))}
                </span>
              </h1>
            </div>

            <p className="unroll-scroll__description">{description}</p>
          </div>
        </div>

        <div className="unroll-scroll__images" aria-hidden="true">
          {resolvedImages.map((src, index) => {
            const pageStyle = {
              left: ROW_POSITIONS[index],
              top: `calc(100svh + ${25 + index * 350}px)`,
            } as CSSProperties

            return (
              <div
                className="unroll-scroll__page"
                key={`${src}-${index}`}
                ref={(node) => {
                  pageRefs.current[index] = node
                }}
                style={pageStyle}
              >
                <img
                  alt=""
                  className="unroll-scroll__page-main"
                  decoding="async"
                  draggable={false}
                  src={src}
                />
                <img
                  alt=""
                  className="unroll-scroll__page-fold"
                  decoding="async"
                  draggable={false}
                  src={src}
                />
                <span className="unroll-scroll__page-crease" />
              </div>
            )
          })}
        </div>
      </section>

    </main>
  )
}

const UNROLL_SCROLL_STYLES = `
  @font-face {
    font-display: swap;
    font-family: "Unroll Inter Display";
    font-style: normal;
    font-weight: 600;
    src: url("https://fsu.creght.com/site/2083536173505974272/1789974881082__creght_blocks_unroll_scroll_inter_display_semibold.woff2") format("woff2");
  }

  @font-face {
    font-display: swap;
    font-family: "Unroll Inter";
    font-style: normal;
    font-weight: 500;
    src: url("https://fsu.creght.com/site/2075503192795254784/1783673565691__inter_500.woff2") format("woff2");
  }

  @font-face {
    font-display: swap;
    font-family: "Unroll Bebas Neue";
    font-style: normal;
    font-weight: 400;
    src: url("https://fsu.creght.com/site/2083536173505974272/1789974876653__creght_blocks_unroll_scroll_bebas_neue.woff2") format("woff2");
  }

  .unroll-scroll,
  .unroll-scroll * {
    box-sizing: border-box;
  }

  .unroll-scroll {
    background: #000;
    color: #fff;
    min-height: calc(300svh + 1500px);
    overflow: clip;
    position: relative;
    width: 100%;
  }

  .unroll-scroll__sequence {
    height: calc(200svh + 1500px);
    position: relative;
    width: 100%;
  }

  .unroll-scroll__sticky {
    height: 100svh;
    overflow: hidden;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 5;
  }

  .unroll-scroll__hero {
    bottom: 32px;
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 4.063fr) minmax(0, 1fr);
    left: 24px;
    position: absolute;
    right: 24px;
  }

  .unroll-scroll__hero-left {
    min-width: 0;
    overflow: clip;
    padding-bottom: 44px;
  }

  .unroll-scroll__eyebrow {
    color: #fff;
    display: flex;
    flex-direction: column;
    font-family: "Unroll Bebas Neue", Impact, sans-serif;
    font-size: 36px;
    font-weight: 400;
    height: 68px;
    line-height: .8;
    margin: 0;
    text-transform: uppercase;
  }

  .unroll-scroll__eyebrow span:last-child {
    color: #9ba1a5;
  }

  .unroll-scroll__headline {
    color: #fff;
    display: flex;
    flex-direction: column;
    font-family: "Unroll Inter Display", Inter, Arial, sans-serif;
    font-size: clamp(82px, 10vw, 145px);
    font-weight: 600;
    letter-spacing: -.03em;
    line-height: .88;
    margin: 0;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .unroll-scroll__headline-tail {
    display: flex;
    gap: .22em;
  }

  .unroll-scroll__description {
    align-self: end;
    color: #9ba1a5;
    font-family: "Unroll Inter", Inter, Arial, sans-serif;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 1.3;
    margin: 0 0 43px;
  }

  .unroll-scroll__images {
    display: contents;
    pointer-events: none;
  }

  .unroll-scroll__page {
    --unroll-curl: 92%;
    --unroll-fold-opacity: .34;
    --unroll-fold-shade: .52;
    height: 400px;
    position: absolute;
    transform: scale(.62);
    transform-origin: 50% 50%;
    width: 40%;
    will-change: transform;
    z-index: 6;
  }

  .unroll-scroll__page-main,
  .unroll-scroll__page-fold {
    border-bottom-right-radius: 28px;
    display: block;
    height: 100%;
    inset: 0;
    object-fit: cover;
    position: absolute;
    width: 100%;
  }

  .unroll-scroll__page-main {
    clip-path: polygon(
      0 0,
      100% 0,
      100% calc(100% - var(--unroll-curl)),
      calc(100% - var(--unroll-curl)) 100%,
      0 100%
    );
  }

  .unroll-scroll__page-fold {
    clip-path: polygon(
      100% calc(100% - var(--unroll-curl)),
      100% calc(108% - var(--unroll-curl)),
      calc(108% - var(--unroll-curl)) 100%,
      calc(100% - var(--unroll-curl)) 100%
    );
    filter: brightness(var(--unroll-fold-shade)) saturate(.86);
    opacity: .9;
    transform: scale(.992);
    transform-origin: 100% 100%;
  }

  .unroll-scroll__page-crease {
    display: none;
  }

  @media (max-width: 809px) {
    .unroll-scroll__hero {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .unroll-scroll__headline {
      font-size: 87px;
      line-height: .897;
      margin-top: 10px;
      white-space: normal;
    }

    .unroll-scroll__hero-left {
      padding-bottom: 0;
    }

    .unroll-scroll__eyebrow {
      transform: translateY(5px);
    }

    .unroll-scroll__headline-tail {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .unroll-scroll__description {
      margin: 17px 0 43px;
      max-width: 327px;
    }
  }

  @media (max-width: 360px) {
    .unroll-scroll__hero {
      left: 18px;
      right: 18px;
    }

    .unroll-scroll__headline {
      font-size: 72px;
    }

    .unroll-scroll__description {
      font-size: 18px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .unroll-scroll__page {
      transition: none;
    }
  }
`

export default UnrollScroll
