import { useEffect, useState, type CSSProperties } from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1786355173097__creght_blocks_assets_image_intro_objects_object_01.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355207968__creght_blocks_assets_image_intro_objects_object_02.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355208487__creght_blocks_assets_image_intro_objects_object_03.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355204564__creght_blocks_assets_image_intro_objects_object_04.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355208343__creght_blocks_assets_image_intro_objects_object_05.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355208239__creght_blocks_assets_image_intro_objects_object_06.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355208512__creght_blocks_assets_image_intro_objects_object_07.avif",
  "https://fsu.creght.com/site/2083536173505974272/1786355214377__creght_blocks_assets_image_intro_objects_object_08.avif",
] as const

const FINAL_ANGLES = [30, -15, -60, -105, -150, 165, 120, 75] as const
const FAN_ANGLES = [21, 18, 15, 12, 9, 6, 4, 1] as const

export type ImageIntroEffectProps = {
  className?: string
  heading?: readonly [string, string]
  images?: readonly string[]
  year?: string
}

export function ImageIntroEffect({
  className = "",
  heading = ["OBJECTS", "IN ORBIT"],
  images = DEFAULT_IMAGES,
  year = "EDITION 01",
}: ImageIntroEffectProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) setAnimationKey((key) => key + 1)
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [])

  const resolvedImages = Array.from({ length: 8 }, (_, index) =>
    images[index] ?? DEFAULT_IMAGES[index],
  )

  return (
    <main className={`image-intro ${className}`}>
      <style>{IMAGE_INTRO_STYLES}</style>

      <section
        key={animationKey}
        className="image-intro-stage"
        aria-label={`${heading[0]} ${heading[1]} ${year}`}
      >
        <div className="image-intro-ring-spin" aria-hidden="true">
          <div className="image-intro-ring">
            {resolvedImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="image-intro-arrival"
                style={{
                  "--arrival-delay": `${1.63 + (7 - index) * 0.2}s`,
                  zIndex: 8 - index,
                } as CSSProperties}
              >
                <div
                  className="image-intro-arm"
                  style={{
                    "--angle": `${FINAL_ANGLES[index]}deg`,
                    "--fan-angle": `${FAN_ANGLES[index]}deg`,
                    "--cycle-delay": `${(index % 4) * 2.25}s`,
                  } as CSSProperties}
                >
                  <div className="image-intro-card">
                    <img src={src} alt="" draggable={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="image-intro-heading">
          <h1>
            <span>{heading[0]}</span>
            <span>{heading[1]}</span>
          </h1>
          <p>{year}</p>
        </div>
      </section>
    </main>
  )
}

const IMAGE_INTRO_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap");

  .image-intro,
  .image-intro * {
    box-sizing: border-box;
  }

  .image-intro {
    --card-height: 150px;
    --card-width: 100px;
    --radius: 250px;
    background: #050505;
    color: #fff;
    height: 100dvh;
    min-height: 560px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .image-intro-stage {
    height: 100%;
    overflow: hidden;
    perspective: 1200px;
    position: relative;
    width: 100%;
  }

  .image-intro-ring-spin,
  .image-intro-ring {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform-style: preserve-3d;
    width: 100%;
  }

  .image-intro-ring-spin {
    animation: imageIntroSpin 18s linear 6s infinite;
  }

  .image-intro-arrival {
    animation: imageIntroArrival 1s cubic-bezier(.22, 1, .36, 1) var(--arrival-delay) both;
    height: var(--card-height);
    left: 50%;
    margin-left: calc(var(--card-width) / -2);
    margin-top: calc(var(--card-height) / -2);
    position: absolute;
    top: 50%;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    width: var(--card-width);
    will-change: transform;
  }

  .image-intro-arm {
    animation: imageIntroSpread 2.2s linear 3.75s both;
    height: 100%;
    inset: 0;
    position: absolute;
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    width: 100%;
    will-change: transform;
  }

  .image-intro-card {
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    transform-style: preserve-3d;
    width: 100%;
    animation:
      imageIntroInitialFlip .9s cubic-bezier(.22, 1, .36, 1) 5s both,
      imageIntroFaceCycle 18s linear calc(6s + var(--cycle-delay)) infinite;
    will-change: transform;
  }

  .image-intro-card img {
    display: block;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    width: 100%;
  }

  .image-intro-heading {
    align-items: center;
    animation: imageIntroHeadingIn 1.9s cubic-bezier(.18, .78, .22, 1) 5s both;
    display: flex;
    flex-direction: column;
    height: 218px;
    justify-content: flex-start;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: calc(50% - 109px);
    z-index: 5;
  }

  .image-intro-heading h1 {
    color: #fff;
    display: flex;
    flex-direction: column;
    font: 400 82px/82px "Instrument Serif", Georgia, serif;
    letter-spacing: -1.7px;
    margin: 0;
    text-align: center;
    transform: scaleX(1.47);
    white-space: nowrap;
  }

  .image-intro-heading h1 span {
    display: block;
  }

  .image-intro-heading p {
    color: #fff;
    font: 400 24px/24px "Instrument Serif", Georgia, serif;
    margin: 30px 0 0;
    transform: scaleX(1.34);
  }

  @keyframes imageIntroArrival {
    from { transform: translateY(1200px); }
    to { transform: translateY(0); }
  }

  @keyframes imageIntroSpread {
    0% { transform: rotate(0deg) translateY(0); }
    16% { transform: rotate(var(--fan-angle)) translateY(0); }
    23% { transform: rotate(calc(var(--angle) - 174deg)) translateY(-91px); }
    32% { transform: rotate(calc(var(--angle) - 86deg)) translateY(-129px); }
    41% { transform: rotate(calc(var(--angle) - 66deg)) translateY(-138px); }
    55% { transform: rotate(calc(var(--angle) - 60deg)) translateY(-140px); }
    64% { transform: rotate(calc(var(--angle) - 33deg)) translateY(-187px); }
    78% { transform: rotate(calc(var(--angle) - 4deg)) translateY(-242px); }
    87% { transform: rotate(calc(var(--angle) - 1deg)) translateY(-248px); }
    100% { transform: rotate(var(--angle)) translateY(calc(var(--radius) * -1)); }
  }

  @keyframes imageIntroSpin {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(360deg); }
  }

  @keyframes imageIntroInitialFlip {
    from { transform: perspective(700px) rotateY(0deg); }
    to { transform: perspective(700px) rotateY(180deg); }
  }

  @keyframes imageIntroFaceCycle {
    0%, 15% { transform: perspective(700px) rotateY(180deg); }
    18.5%, 65% { transform: perspective(700px) rotateY(360deg); }
    68.5%, 100% { transform: perspective(700px) rotateY(540deg); }
  }

  @keyframes imageIntroHeadingIn {
    from { opacity: .001; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 809px) {
    .image-intro {
      min-height: 620px;
    }

    .image-intro-heading {
      height: 146px;
      top: calc(50% - 73px);
    }

    .image-intro-heading h1 {
      font-size: 48px;
      letter-spacing: -1px;
      line-height: 48px;
    }

    .image-intro-heading p {
      font-size: 20px;
      line-height: 20px;
      margin-top: 30px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .image-intro-ring,
    .image-intro-ring-spin,
    .image-intro-arrival,
    .image-intro-arm,
    .image-intro-card,
    .image-intro-heading {
      animation: none !important;
    }

    .image-intro-arrival {
      transform: translateY(0);
    }

    .image-intro-arm {
      transform: rotate(var(--angle)) translateY(calc(var(--radius) * -1));
    }

    .image-intro-card {
      transform: perspective(700px) rotateY(180deg);
    }
  }
`

export default ImageIntroEffect
