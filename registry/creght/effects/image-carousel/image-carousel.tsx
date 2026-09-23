import type { CSSProperties } from "react"

const PANEL_ANGLES = [90, 120, 150, 180, 0, 30, 60] as const

const DEFAULT_BEFORE_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1789974850591__creght_blocks_image_carousel_after_00.png",
  "https://fsu.creght.com/site/2083536173505974272/1789974851455__creght_blocks_image_carousel_after_01.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974852311__creght_blocks_image_carousel_after_02.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974853204__creght_blocks_image_carousel_after_03.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974853991__creght_blocks_image_carousel_after_04.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974854861__creght_blocks_image_carousel_after_05.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974855726__creght_blocks_image_carousel_after_06.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974856512__creght_blocks_image_carousel_after_07.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974857386__creght_blocks_image_carousel_after_08.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974858228__creght_blocks_image_carousel_after_09.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974859089__creght_blocks_image_carousel_after_10.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974860017__creght_blocks_image_carousel_after_11.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974860961__creght_blocks_image_carousel_after_12.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974861824__creght_blocks_image_carousel_after_13.avif",
] as const

const DEFAULT_BEFORE_REMOTE_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1789974850591__creght_blocks_image_carousel_after_00.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977886634__creght_blocks_image_carousel_fallback_02.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977888323__creght_blocks_image_carousel_fallback_03.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977889527__creght_blocks_image_carousel_fallback_04.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977891424__creght_blocks_image_carousel_fallback_05.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977892893__creght_blocks_image_carousel_fallback_06.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977894094__creght_blocks_image_carousel_fallback_07.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977896039__creght_blocks_image_carousel_fallback_08.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977897851__creght_blocks_image_carousel_fallback_09.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977899184__creght_blocks_image_carousel_fallback_10.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977901225__creght_blocks_image_carousel_fallback_11.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977903273__creght_blocks_image_carousel_fallback_12.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977905525__creght_blocks_image_carousel_fallback_13.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977907539__creght_blocks_image_carousel_fallback_14.png",
] as const

const DEFAULT_AFTER_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1786355168282__creght_blocks_assets_image_intro_image_02.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355177232__creght_blocks_assets_image_intro_image_07.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974864251__creght_blocks_image_carousel_before_03.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974865170__creght_blocks_image_carousel_before_04.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974866023__creght_blocks_image_carousel_before_05.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974866923__creght_blocks_image_carousel_before_06.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974867792__creght_blocks_image_carousel_before_07.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355177751__creght_blocks_assets_image_intro_image_08.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974868962__creght_blocks_image_carousel_before_09.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974869819__creght_blocks_image_carousel_before_10.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355166308__creght_blocks_assets_image_intro_image_03.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974871099__creght_blocks_image_carousel_before_12.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974872083__creght_blocks_image_carousel_before_13.avif",
  "https://fsu.creght.com/site/2083536173505974272/1789974872996__creght_blocks_image_carousel_before_14.avif",
] as const

const DEFAULT_AFTER_REMOTE_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1789977908817__creght_blocks_image_carousel_fallback_15.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977910258__creght_blocks_image_carousel_fallback_16.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977912531__creght_blocks_image_carousel_fallback_17.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977913924__creght_blocks_image_carousel_fallback_18.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977915321__creght_blocks_image_carousel_fallback_19.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977916916__creght_blocks_image_carousel_fallback_20.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977918025__creght_blocks_image_carousel_fallback_21.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977919219__creght_blocks_image_carousel_fallback_22.png",
  "https://fsu.creght.com/site/2083536173505974272/1789977920876__creght_blocks_image_carousel_fallback_23.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1789977922237__creght_blocks_image_carousel_fallback_24.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1789977923519__creght_blocks_image_carousel_fallback_25.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1789977925556__creght_blocks_image_carousel_fallback_26.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1789977927138__creght_blocks_image_carousel_fallback_27.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1789977928583__creght_blocks_image_carousel_fallback_28.jpeg",
] as const

const ARROW_RIGHT_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 13 13'%3E%3Cpath fill='%23fff' d='M12.445 6.859 7.875 11.43a.508.508 0 0 1-.719-.719l3.704-3.703H.914a.508.508 0 0 1 0-1.016h9.946L7.156 2.289a.508.508 0 0 1 .719-.719l4.57 4.571a.508.508 0 0 1 0 .718Z'/%3E%3C/svg%3E"

const DOT_MASK_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none'%3E%3Cpath fill='%23D9D9D9' d='M0 20h100v10H0zm0 50h100v10H0z'/%3E%3C/svg%3E"

type CarouselImage = string | null

type ResolvedCarouselImage = {
  fallbackSrc?: string
  src: CarouselImage
}

export type ImageCarouselProps = {
  afterImages?: readonly CarouselImage[]
  backgroundColor?: string
  beforeImages?: readonly CarouselImage[]
  className?: string
  ctaLabel?: string
  description?: string
  onCtaClick?: () => void
  rotationDuration?: number
  title?: string | readonly [string, string]
}

function clamp(value: number, minimum: number, maximum: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(maximum, Math.max(minimum, value))
}

function resolveImages(
  images: readonly CarouselImage[] | undefined,
  fallback: readonly string[],
  remoteFallback: readonly string[],
) {
  return Array.from({ length: 14 }, (_, index) => {
    const image = images?.[index]
    return image === undefined
      ? { fallbackSrc: remoteFallback[index], src: fallback[index] }
      : { src: image }
  })
}

function CarouselFace({
  image,
  side,
}: {
  image: ResolvedCarouselImage
  side: "left" | "right"
}) {
  return (
    <div className={`creght-image-carousel__face creght-image-carousel__face--${side}`}>
      {image.src ? (
        <img
          src={image.src}
          alt=""
          decoding="async"
          draggable={false}
          loading="eager"
          onError={image.fallbackSrc
            ? (event) => {
                if (event.currentTarget.dataset.fallbackApplied) return
                event.currentTarget.dataset.fallbackApplied = "true"
                event.currentTarget.src = image.fallbackSrc ?? ""
              }
            : undefined}
        />
      ) : null}
    </div>
  )
}

function CarouselRing({
  images,
  state,
}: {
  images: readonly ResolvedCarouselImage[]
  state: "after" | "before"
}) {
  return (
    <div
      className={`creght-image-carousel__mask creght-image-carousel__mask--${state}`}
      aria-hidden="true"
    >
      <div className="creght-image-carousel__ring">
        {PANEL_ANGLES.map((angle, panelIndex) => (
          <div
            className="creght-image-carousel__panel"
            key={`panel-${angle}`}
            style={{ "--panel-angle": `${angle}deg` } as CSSProperties}
          >
            <CarouselFace
              image={images[panelIndex * 2] ?? { src: null }}
              side="left"
            />
            <CarouselFace
              image={images[panelIndex * 2 + 1] ?? { src: null }}
              side="right"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ImageCarousel({
  afterImages,
  backgroundColor = "#050505",
  beforeImages,
  className = "",
  ctaLabel = "Get started",
  description = "Turn your ideas into high-quality visuals in seconds, no design skills needed.",
  onCtaClick,
  rotationDuration = 50,
  title = ["Create Stunning Images", "with Just a Prompt"],
}: ImageCarouselProps) {
  const resolvedBeforeImages = resolveImages(
    beforeImages,
    DEFAULT_BEFORE_IMAGES,
    DEFAULT_BEFORE_REMOTE_IMAGES,
  )
  const resolvedAfterImages = resolveImages(
    afterImages,
    DEFAULT_AFTER_IMAGES,
    DEFAULT_AFTER_REMOTE_IMAGES,
  )
  const resolvedDuration = clamp(rotationDuration, 4, 240, 50)
  const titleLines = typeof title === "string" ? title.split(/\r?\n/) : title
  const rootStyle = {
    "--image-carousel-background": backgroundColor,
    "--image-carousel-duration": `${resolvedDuration}s`,
  } as CSSProperties

  return (
    <section
      aria-label="Before and after image carousel"
      className={`creght-image-carousel ${className}`.trim()}
      style={rootStyle}
    >
      <style>{IMAGE_CAROUSEL_STYLES}</style>

      <div className="creght-image-carousel__stage">
        <div className="creght-image-carousel__copy">
          <h1>
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`}>{line}</span>
            ))}
          </h1>
          <p>{description}</p>
          <button type="button" onClick={onCtaClick}>
            <span>{ctaLabel}</span>
            <img src={ARROW_RIGHT_DATA_URI} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="creght-image-carousel__viewport">
          <CarouselRing images={resolvedBeforeImages} state="before" />
          <CarouselRing images={resolvedAfterImages} state="after" />

          <div className="creght-image-carousel__glow" aria-hidden="true" />
          <div className="creght-image-carousel__dots" aria-hidden="true" />
          <div className="creght-image-carousel__divider" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}

const IMAGE_CAROUSEL_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap");

  .creght-image-carousel,
  .creght-image-carousel * {
    box-sizing: border-box;
  }

  .creght-image-carousel {
    align-items: stretch;
    background: var(--image-carousel-background);
    color: #fff;
    display: flex;
    flex-direction: column;
    font-family: "Inter", Arial, sans-serif;
    height: 100svh;
    isolation: isolate;
    justify-content: center;
    min-height: 100svh;
    overflow: hidden;
    padding-top: 124px;
    position: relative;
    width: 100%;
  }

  .creght-image-carousel__stage {
    display: flex;
    flex: 0 0 335px;
    flex-direction: column;
    height: 335px;
    justify-content: flex-end;
    position: relative;
    width: 100%;
  }

  .creght-image-carousel__copy {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 272.90625px;
    left: 50%;
    padding: 0 20px;
    position: absolute;
    text-align: center;
    top: -142px;
    transform: translateX(-50%);
    width: 1200px;
    z-index: 10;
  }

  .creght-image-carousel__copy h1 {
    color: #fff;
    font-size: 60.96px;
    font-weight: 500;
    letter-spacing: -0.6096px;
    line-height: 67.056px;
    margin: 0;
    padding: 0;
  }

  .creght-image-carousel__copy h1 span {
    display: block;
    white-space: nowrap;
  }

  .creght-image-carousel__copy p {
    color: #9ba1a5;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
    margin: 0;
    padding: 0;
    width: 408px;
  }

  .creght-image-carousel__copy button {
    align-items: center;
    appearance: none;
    background: rgba(255, 255, 255, .1);
    border: 0;
    border-radius: 118px;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    height: 36.8px;
    justify-content: center;
    line-height: 16.8px;
    padding: 0 18px;
    position: relative;
    width: 127.2px;
  }

  .creght-image-carousel__copy button::before {
    background: var(--image-carousel-background);
    border-radius: inherit;
    content: "";
    inset: 2px;
    position: absolute;
  }

  .creght-image-carousel__copy button > span,
  .creght-image-carousel__copy button > img {
    position: relative;
    z-index: 1;
  }

  .creght-image-carousel__copy button > span {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .creght-image-carousel__copy button > img {
    display: block;
    flex: 0 0 auto;
    height: 13px;
    pointer-events: none;
    width: 13px;
  }

  .creght-image-carousel__copy button:focus-visible {
    outline: 2px solid rgba(155, 225, 255, .9);
    outline-offset: 3px;
  }

  .creght-image-carousel__viewport {
    height: 400px;
    left: 50%;
    pointer-events: none;
    position: absolute;
    top: 113px;
    transform: translateX(-50%);
    width: 1200px;
  }

  .creght-image-carousel__mask {
    height: 400px;
    inset: 0;
    position: absolute;
    transform-style: preserve-3d;
    width: 1200px;
    z-index: 1;
  }

  .creght-image-carousel__mask--before {
    -webkit-mask-image: linear-gradient(to right, #000 0 50%, transparent 50% 100%);
    mask-image: linear-gradient(to right, #000 0 50%, transparent 50% 100%);
  }

  .creght-image-carousel__mask--after {
    -webkit-mask-image: linear-gradient(to right, transparent 0 50%, #000 50% 100%);
    mask-image: linear-gradient(to right, transparent 0 50%, #000 50% 100%);
  }

  .creght-image-carousel__ring {
    animation: creghtImageCarouselSpin var(--image-carousel-duration) linear infinite;
    height: 240px;
    left: 0;
    position: absolute;
    top: 200px;
    transform: translateY(-50%) perspective(800px) rotateY(0deg);
    transform-style: preserve-3d;
    width: 1200px;
    will-change: transform;
  }

  .creght-image-carousel__panel {
    align-items: center;
    display: flex;
    height: 240px;
    justify-content: space-between;
    left: -100px;
    position: absolute;
    top: 0;
    transform: rotateY(var(--panel-angle));
    transform-origin: center;
    transform-style: preserve-3d;
    width: 1400px;
  }

  .creght-image-carousel__face {
    backface-visibility: hidden;
    border-radius: 20px;
    flex: 0 0 260px;
    height: 370px;
    overflow: hidden;
    transform-style: preserve-3d;
    width: 260px;
  }

  .creght-image-carousel__mask--before .creght-image-carousel__face {
    filter: saturate(0);
  }

  .creght-image-carousel__mask--after .creght-image-carousel__face {
    filter: saturate(1.5);
  }

  .creght-image-carousel__face--left {
    transform: rotateY(90deg);
  }

  .creght-image-carousel__face--right {
    transform: rotateY(-90deg);
  }

  .creght-image-carousel__face img {
    display: block;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    width: 100%;
  }

  .creght-image-carousel__glow {
    background: radial-gradient(
      ellipse at center,
      rgba(94, 235, 255, .58) 0%,
      rgba(46, 196, 255, .4) 27%,
      rgba(24, 112, 174, .18) 50%,
      transparent 74%
    );
    filter: blur(8px);
    height: 308px;
    left: 340px;
    -webkit-mask-image: radial-gradient(ellipse at center, #000 0 32%, transparent 78%);
    mask-image: radial-gradient(ellipse at center, #000 0 32%, transparent 78%);
    mix-blend-mode: screen;
    opacity: 1;
    position: absolute;
    top: 44px;
    width: 520px;
    z-index: 0;
  }

  .creght-image-carousel__glow::after {
    animation: creghtImageCarouselLightFlip 1.5s ease-in-out infinite;
    background: radial-gradient(
      ellipse at center,
      rgba(224, 252, 255, .7) 0%,
      rgba(72, 209, 255, .34) 24%,
      transparent 67%
    );
    content: "";
    inset: 20px 48px;
    position: absolute;
    transform-origin: center;
  }

  .creght-image-carousel__dots {
    background-image: url("${DOT_MASK_DATA_URI}");
    background-position: center;
    background-repeat: repeat;
    background-size: 15px 15px;
    filter: drop-shadow(0 0 5px rgba(143, 238, 255, .75));
    height: 362px;
    left: 449px;
    -webkit-mask-image: radial-gradient(ellipse at center, #000 0 18%, rgba(0, 0, 0, .7) 42%, transparent 74%);
    mask-image: radial-gradient(ellipse at center, #000 0 18%, rgba(0, 0, 0, .7) 42%, transparent 74%);
    mix-blend-mode: screen;
    opacity: .34;
    position: absolute;
    top: 13px;
    width: 304px;
    z-index: 3;
  }

  .creght-image-carousel__divider {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(112, 206, 255, .08) 10%,
      rgba(196, 238, 255, .72) 34%,
      #fff 49%,
      rgba(180, 232, 255, .76) 66%,
      rgba(83, 186, 255, .08) 91%,
      transparent 100%
    );
    filter: blur(4px);
    height: 256px;
    left: 598px;
    opacity: .95;
    position: absolute;
    top: 72px;
    width: 4px;
    z-index: 6;
  }

  .creght-image-carousel__divider::before,
  .creght-image-carousel__divider::after,
  .creght-image-carousel__divider > span {
    content: "";
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }

  .creght-image-carousel__divider::before {
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(79, 193, 255, .72) 25%,
      #dff9ff 48%,
      rgba(76, 189, 255, .7) 75%,
      transparent
    );
    filter: blur(7px);
    height: 190px;
    top: 33px;
    width: 16px;
  }

  .creght-image-carousel__divider::after {
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(224, 249, 255, .9) 24%,
      #fff 43% 57%,
      rgba(207, 244, 255, .88) 76%,
      transparent
    );
    box-shadow: 0 0 7px rgba(107, 213, 255, .95);
    height: 160px;
    top: 48px;
    width: 1.5px;
  }

  .creght-image-carousel__divider > span {
    background: #fff;
    box-shadow: 0 0 12px 4px rgba(154, 232, 255, .9);
    height: 62px;
    top: 97px;
    width: 1px;
  }

  @keyframes creghtImageCarouselSpin {
    from {
      transform: translateY(-50%) perspective(800px) rotateY(0deg);
    }
    to {
      transform: translateY(-50%) perspective(800px) rotateY(-360deg);
    }
  }

  @keyframes creghtImageCarouselLightFlip {
    0% {
      opacity: 0;
      transform: perspective(520px) rotateX(90deg) rotate(-25deg);
    }
    33.333% {
      opacity: 1;
      transform: perspective(520px) rotateX(0deg) rotate(0deg);
    }
    66.666%, 100% {
      opacity: 0;
      transform: perspective(520px) rotateX(90deg) rotate(25deg);
    }
  }

  @media (min-width: 810px) and (max-width: 1199px) {
    .creght-image-carousel__copy h1 {
      font-size: 53.34px;
      letter-spacing: -0.5334px;
      line-height: 58.674px;
    }
  }

  @media (max-width: 809px) {
    .creght-image-carousel__copy h1 {
      font-size: 34.29px;
      letter-spacing: -0.3429px;
      line-height: 37.719px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .creght-image-carousel__ring {
      animation-play-state: paused;
    }

    .creght-image-carousel__glow::after {
      animation: none;
      opacity: .55;
      transform: none;
    }
  }
`

export default ImageCarousel
