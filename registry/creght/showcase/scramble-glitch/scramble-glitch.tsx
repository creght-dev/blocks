"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react"

const DEFAULT_ITEMS = [
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295543162__showcase_shared_generated_final_eye.webp",
    label: "PORTRAITS",
    number: "01",
    depth: 650,
    top: 115,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295543415__showcase_scramble_glitch_generated_final_motion.webp",
    label: "PLACES",
    number: "02",
    depth: 450,
    top: 0,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295541350__showcase_scramble_glitch_generated_final_chair.webp",
    label: "MOMENTS",
    number: "03",
    depth: 250,
    top: -160,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295542129__showcase_scramble_glitch_generated_final_fabric.webp",
    label: "LIGHT",
    number: "04",
    depth: 50,
    top: -300,
  },
  {
    image: "https://fsu.creght.com/site/2083536173505974272/1787295541915__showcase_shared_generated_final_figure.webp",
    label: "DETAIL",
    number: "05",
    depth: -250,
    top: -515,
  },
] as const

const GLITCH_CHARACTERS = "!<>-_\\/[]{}—=+*^?#▒|"

export type ScrambleGlitchItem = {
  image: string
  label: string
  number?: string
}

export type ScrambleGlitchProps = {
  className?: string
  items?: readonly ScrambleGlitchItem[]
  mobileMessage?: string
}

export function ScrambleGlitch({
  className = "",
  items,
  mobileMessage =
    "Explore portraits, places, and quiet moments.\nSwitch to desktop to view the full effect.",
}: ScrambleGlitchProps) {
  const timerRef = useRef<ReturnType<typeof window.setInterval> | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrambledText, setScrambledText] = useState("")
  const responsiveMobileMessage = mobileMessage

  const resolvedItems = DEFAULT_ITEMS.map((fallback, index) => ({
    ...fallback,
    ...(items?.[index] ?? {}),
    number: items?.[index]?.number ?? fallback.number,
  }))

  const stopTimer = () => {
    if (timerRef.current === null) return
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  const startScramble = (index: number) => {
    const label = resolvedItems[index].label.toUpperCase()
    stopTimer()
    setActiveIndex(index)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScrambledText(label)
      return
    }

    let elapsed = 0
    timerRef.current = window.setInterval(() => {
      elapsed += 42
      const building = elapsed < 360
      const visibleCharacters = building
        ? Math.min(
            label.length,
            Math.ceil(Math.pow(elapsed / 360, 1.6) * label.length),
          )
        : label.length
      const settledCharacters = building ? 0 : Math.floor((elapsed - 360) / 55)
      const nextText = label
        .slice(0, visibleCharacters)
        .split("")
        .map((character, characterIndex) => {
          if (characterIndex < settledCharacters) return character
          return GLITCH_CHARACTERS[
            Math.floor(Math.random() * GLITCH_CHARACTERS.length)
          ]
        })
        .join("")

      setScrambledText(nextText)

      if (settledCharacters >= label.length) {
        stopTimer()
        setScrambledText(label)
      }
    }, 42)
  }

  const resetScramble = (index: number, event?: PointerEvent<HTMLElement>) => {
    if (event?.pointerType === "touch") return
    if (activeIndex !== index) return
    stopTimer()
    setActiveIndex(null)
    setScrambledText("")
  }

  useEffect(() => stopTimer, [])

  return (
    <main
      className={`scramble-glitch ${className}`.trim()}
      aria-label="Photography portfolio showcase with scrambled hover labels"
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{SCRAMBLE_GLITCH_STYLES}</style>

      <div className="scramble-glitch__content">
        <p className="scramble-glitch__mobile-message">
          {responsiveMobileMessage}
        </p>

        <div className="scramble-glitch__scale-stage">
          <div className="scramble-glitch__layout">
            <div className="scramble-glitch__scene">
              {resolvedItems.map((item, index) => {
                const isActive = activeIndex === index
                const positionStyle = {
                  "--scramble-depth": `${item.depth}px`,
                  "--scramble-top": `${item.top}px`,
                } as CSSProperties

                return (
                  <article
                    aria-label={`${item.number} ${item.label}`}
                    className={`scramble-glitch__position ${
                      index === 1 ? "is-anchor" : ""
                    } ${isActive ? "is-active" : ""}`.trim()}
                    key={`${item.number}-${item.label}`}
                    onBlur={() => resetScramble(index)}
                    onFocus={() => startScramble(index)}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "touch") startScramble(index)
                    }}
                    onPointerLeave={(event) => resetScramble(index, event)}
                    style={positionStyle}
                    tabIndex={0}
                  >
                    <div className="scramble-glitch__card">
                      <div className="scramble-glitch__number-mask">
                        <p className="scramble-glitch__number">{item.number}</p>
                      </div>

                      <div className="scramble-glitch__image-plane">
                        <img
                          alt=""
                          aria-hidden="true"
                          decoding="async"
                          draggable={false}
                          onDragStart={(event) => event.preventDefault()}
                          src={item.image}
                        />
                      </div>
                    </div>

                    <div className="scramble-glitch__tag" aria-hidden="true">
                      <span className="scramble-glitch__line">
                        <span />
                      </span>
                      <span className="scramble-glitch__tag-text">
                        {isActive ? scrambledText : ""}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const SCRAMBLE_GLITCH_STYLES = `
  .scramble-glitch,
  .scramble-glitch * {
    box-sizing: border-box;
  }

  .scramble-glitch {
    background: #050505;
    color: #fff;
    height: 100svh;
    min-height: 800px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .scramble-glitch__content {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    overflow: clip;
    position: relative;
    width: 100%;
  }

  .scramble-glitch__mobile-message {
    display: none;
  }

  .scramble-glitch__scale-stage {
    flex: 1 0 0;
    height: 1px;
    position: relative;
    transform: scale(.8);
    width: 100%;
  }

  .scramble-glitch__layout {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: visible;
    padding: 0 0 0 535px;
    position: relative;
    width: 100%;
  }

  .scramble-glitch__scene {
    flex: 0 0 auto;
    height: 384px;
    position: relative;
    transform: perspective(1200px) rotateY(-28deg);
    transform-style: preserve-3d;
    width: 316px;
    z-index: 1;
  }

  .scramble-glitch__position {
    height: 384px;
    left: 0;
    outline: none;
    position: absolute;
    right: 0;
    top: var(--scramble-top);
    transform: translateZ(var(--scramble-depth));
    width: 316px;
  }

  .scramble-glitch__position.is-anchor {
    position: relative;
  }

  .scramble-glitch__card {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    width: 316px;
  }

  .scramble-glitch__number-mask {
    align-items: flex-start;
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-start;
    overflow: clip;
    width: 100%;
  }

  .scramble-glitch__number {
    color: #fff;
    font-family: "Roboto Mono", monospace;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
    user-select: none;
    white-space: pre;
  }

  .scramble-glitch__image-plane {
    filter: drop-shadow(30px 30px 26px rgba(0, 0, 0, .35));
    flex: 0 0 auto;
    height: 385px;
    position: relative;
    transform: translateZ(125px);
    user-select: none;
    width: 316px;
    z-index: 2;
  }

  .scramble-glitch__image-plane img {
    display: block;
    height: 100%;
    object-fit: cover;
    overflow: clip;
    pointer-events: auto;
    user-select: none;
    width: 100%;
  }

  .scramble-glitch__tag {
    align-items: center;
    display: flex;
    gap: 12px;
    left: 340px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: calc(50% + 2px);
    transform: translateY(-50%);
    transition: opacity .12s ease;
    width: max-content;
    z-index: 1;
  }

  .scramble-glitch__line {
    display: block;
    flex: 0 0 auto;
    height: 1px;
    overflow: hidden;
    position: relative;
    width: 130px;
  }

  .scramble-glitch__line > span {
    background: #fff;
    display: block;
    height: 1px;
    transition: width .65s cubic-bezier(.16, 1, .3, 1);
    width: 1px;
  }

  .scramble-glitch__tag-text {
    color: #fff;
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    min-width: 1ch;
    text-transform: uppercase;
    user-select: none;
    white-space: pre;
  }

  .scramble-glitch__position.is-active .scramble-glitch__tag {
    opacity: 1;
  }

  .scramble-glitch__position.is-active .scramble-glitch__card {
    left: 0;
    position: absolute;
    right: 0;
    top: -30px;
  }

  .scramble-glitch__position.is-active .scramble-glitch__line > span {
    width: 100%;
  }

  .scramble-glitch__position:focus-visible .scramble-glitch__image-plane {
    outline: 1px solid rgba(255, 255, 255, .9);
    outline-offset: 4px;
  }

  @media (max-width: 809.98px) {
    .scramble-glitch {
      min-height: 800px;
    }

    .scramble-glitch__content {
      padding-top: 155px;
    }

    .scramble-glitch__mobile-message {
      color: rgba(255, 255, 255, .6);
      display: block;
      flex: 0 0 auto;
      font-family: Geist, Inter, Arial, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.2;
      margin: 0;
      max-width: 308px;
      text-align: center;
      white-space: pre-line;
    }

    .scramble-glitch__scale-stage {
      transform: scale(.4);
    }

    .scramble-glitch__position {
      pointer-events: none;
    }

    .scramble-glitch__tag {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scramble-glitch__line > span,
    .scramble-glitch__tag {
      transition: none;
    }
  }
`

export default ScrambleGlitch
