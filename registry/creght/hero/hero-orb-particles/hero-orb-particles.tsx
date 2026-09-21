import { Menu, Plus, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import {
  createOrbParticlesScene,
  type OrbParticlesSceneController,
} from "./orb-particles-scene"

type Language = "en" | "zh"

type HeroCopy = {
  eyebrow: string
  titleLineOne: string
  titleLineTwo: string
  titleLineThree: string
  description: string
  primaryLabel: string
  secondaryLabel: string
  menu: string[]
}

export type HeroOrbParticlesProps = {
  className?: string
  brand?: string
  eyebrow?: string
  titleLineOne?: string
  titleLineTwo?: string
  titleLineThree?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
}

const defaultCopy: Record<Language, HeroCopy> = {
  en: {
    eyebrow: "Interactive artist & creative developer",
    titleLineOne: "Ideas with a",
    titleLineTwo: "gravitational",
    titleLineThree: "pull.",
    description:
      "I work at the intersection of design and code, creating immersive particle worlds and motion-rich interfaces that stay with people.",
    primaryLabel: "Start a project",
    secondaryLabel: "Explore the field",
    menu: ["About", "Selected work", "Contact"],
  },
  zh: {
    eyebrow: "互动艺术家与创意开发者",
    titleLineOne: "让创意拥有",
    titleLineTwo: "自己的",
    titleLineThree: "引力场。",
    description:
      "我在设计与代码的交界处工作，用实时粒子、空间叙事和细腻动效，创造让人记住的数字体验。",
    primaryLabel: "开始一个项目",
    secondaryLabel: "探索粒子场",
    menu: ["关于", "精选作品", "联系"],
  },
}

type SceneControllerRef = {
  current: OrbParticlesSceneController | null
}

function OrbParticlesCanvas({ controllerRef }: { controllerRef: SceneControllerRef }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const cursor = cursorRef.current
    const root = wrapper?.parentElement
    if (!wrapper || !canvas || !cursor || !root) return

    const controller = createOrbParticlesScene(canvas, cursor, root)
    controllerRef.current = controller

    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [controllerRef])

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 z-0 overflow-hidden bg-[#020d09] [cursor:none]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block size-full" data-engine="three.js r170" />
      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-20 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 [background:radial-gradient(circle,rgba(160,255,215,0.95)_0%,rgba(90,230,170,0.35)_45%,transparent_70%)] shadow-[0_0_18px_4px_rgba(90,230,170,0.35)] mix-blend-screen transition-[width,height,opacity] duration-200 [.hovering_&]:size-[26px]"
      />
    </div>
  )
}

export function HeroOrbParticles({
  className = "",
  brand = "Orb Particles",
  eyebrow,
  titleLineOne,
  titleLineTwo,
  titleLineThree,
  description,
  primaryLabel,
  secondaryLabel,
}: HeroOrbParticlesProps) {
  const sceneControllerRef = useRef<OrbParticlesSceneController | null>(null)
  const menuId = useId()
  const [language, setLanguage] = useState<Language>("en")
  const [menuOpen, setMenuOpen] = useState(false)
  const localized = defaultCopy[language]
  const content = language === "en"
    ? {
        ...localized,
        eyebrow: eyebrow ?? localized.eyebrow,
        titleLineOne: titleLineOne ?? localized.titleLineOne,
        titleLineTwo: titleLineTwo ?? localized.titleLineTwo,
        titleLineThree: titleLineThree ?? localized.titleLineThree,
        description: description ?? localized.description,
        primaryLabel: primaryLabel ?? localized.primaryLabel,
        secondaryLabel: secondaryLabel ?? localized.secondaryLabel,
      }
    : localized

  const ignite = (x = 0.5, y = 0.5) => {
    sceneControllerRef.current?.ignite(x, y)
  }

  const runMenuAction = (index: number) => {
    ignite(0.47 + index * 0.035, 0.44 + index * 0.055)
    setMenuOpen(false)
  }

  return (
    <section
      className={`relative isolate min-h-[720px] w-full overflow-hidden bg-[#020d09] font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[#f4fbf6] sm:min-h-[100dvh] ${className}`}
    >
      <OrbParticlesCanvas controllerRef={sceneControllerRef} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(42%_48%_at_0%_100%,rgba(58,192,124,0.13),transparent_74%),linear-gradient(90deg,rgba(1,10,7,0.4)_0%,transparent_34%,transparent_66%,rgba(1,9,6,0.18)_100%),radial-gradient(120%_100%_at_50%_46%,transparent_48%,rgba(1,8,5,0.52)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-3 z-[2] border border-[#cdf1dc]/15 sm:inset-[22px]"
        aria-hidden="true"
      />

      <header className="absolute left-7 right-7 top-6 z-[8] flex items-center justify-between sm:left-[clamp(42px,4.5vw,74px)] sm:right-[clamp(42px,4.5vw,74px)] sm:top-[clamp(38px,4.5vw,68px)]">
        <p className="m-0 text-[15px] font-medium tracking-[-0.025em] text-[#f4fbf6]/90 sm:text-[clamp(16px,1.25vw,22px)]">
          {brand}
        </p>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setLanguage((current) => (current === "en" ? "zh" : "en"))}
            className="flex items-center gap-1.5 border-0 bg-transparent py-2 text-[11px] tracking-[0.04em] text-[#e1f0e8]/45 outline-none transition hover:text-[#e1f0e8]/75 focus-visible:ring-2 focus-visible:ring-[#8df0bc] sm:text-[13px]"
            aria-label="Switch language"
          >
            <span className={language === "en" ? "text-[#f4fbf6]" : ""}>EN</span>
            <span aria-hidden="true">/</span>
            <span className={language === "zh" ? "text-[#f4fbf6]" : ""}>ZH</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 place-items-center border-0 bg-transparent text-[#f4fbf6] outline-none transition hover:text-[#8df0bc] focus-visible:ring-2 focus-visible:ring-[#8df0bc] sm:size-[42px]"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-6 sm:size-[30px]" /> : <Menu className="size-6 sm:size-[30px]" />}
          </button>
        </div>
      </header>

      <div className="absolute left-7 top-[15%] z-[5] w-[calc(100%_-_3.5rem)] sm:left-[clamp(64px,6.4vw,132px)] sm:top-[clamp(142px,17vh,190px)] sm:w-[min(38vw,600px)]">
        <p className="mb-2.5 text-xs font-normal tracking-[-0.02em] text-[#e3f1ea]/80 sm:mb-3.5 sm:text-[clamp(13px,1.1vw,18px)]">
          {content.eyebrow}
        </p>
        <h1 className="m-0 max-w-[350px] font-[Georgia,'Times_New_Roman',serif] text-[clamp(44px,12.5vw,62px)] font-normal italic leading-[0.94] tracking-[-0.065em] text-[#f5faf7]/95 [text-shadow:0_2px_34px_rgba(0,0,0,0.32)] sm:max-w-none sm:text-[clamp(62px,5.25vw,94px)]">
          {content.titleLineOne}
          <span className="block text-[#c2dbcf]/70">{content.titleLineTwo}</span>
          <span className="block text-[#c2dbcf]/70">{content.titleLineThree}</span>
        </h1>
      </div>

      <div
        className="pointer-events-none absolute right-[22vw] top-[12%] z-[4] grid size-[30px] place-items-center text-[#f2faf6]/85 sm:right-[23.5vw] sm:top-[19%]"
        aria-hidden="true"
      >
        <Plus className="size-6" strokeWidth={1} />
      </div>

      <div className="absolute bottom-[34px] left-7 right-7 z-[5] flex gap-2.5 sm:bottom-[clamp(60px,8.5vh,96px)] sm:left-[clamp(64px,6.4vw,132px)] sm:right-auto sm:gap-[18px]">
        <button
          type="button"
          onClick={() => ignite(0.5, 0.5)}
          className="min-h-[50px] min-w-0 flex-1 rounded-full border border-[#d9f6e6]/25 bg-[#061911]/25 px-[18px] text-xs text-[#f1f9f5]/80 shadow-[inset_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#8df0bc]/60 hover:bg-[#0d3926]/60 hover:text-[#f4fbf6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8df0bc] active:translate-y-0 active:scale-[0.98] sm:min-h-[58px] sm:min-w-[154px] sm:flex-none sm:px-[26px] sm:text-sm"
        >
          {content.primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => ignite(0.58, 0.48)}
          className="min-h-[50px] min-w-0 flex-1 rounded-full border border-[#d9f6e6]/25 bg-[#061911]/25 px-[18px] text-xs text-[#f1f9f5]/80 shadow-[inset_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#8df0bc]/60 hover:bg-[#0d3926]/60 hover:text-[#f4fbf6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8df0bc] active:translate-y-0 active:scale-[0.98] sm:min-h-[58px] sm:min-w-[154px] sm:flex-none sm:px-[26px] sm:text-sm"
        >
          {content.secondaryLabel}
        </button>
      </div>

      <aside className="absolute bottom-28 right-7 z-[5] w-[min(72vw,330px)] sm:bottom-[clamp(64px,8vh,92px)] sm:right-[clamp(64px,6.4vw,132px)] sm:w-[min(30vw,470px)]">
        <p className="m-0 text-xs leading-[1.5] tracking-[-0.02em] text-[#e0efe7]/70 [text-shadow:0_2px_22px_rgba(0,0,0,0.5)] sm:text-[clamp(14px,1.2vw,19px)] sm:leading-[1.55]">
          {content.description}
        </p>
      </aside>

      <nav
        id={menuId}
        aria-label="Primary navigation"
        aria-hidden={!menuOpen}
        className={`absolute right-7 top-[76px] z-10 grid w-[min(320px,calc(100vw_-_56px))] rounded-[20px] border border-[#d2f5e1]/20 bg-[#02110b]/85 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition duration-200 sm:right-[clamp(42px,4.5vw,74px)] sm:top-[clamp(92px,9vw,132px)] ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {content.menu.map((item, index) => (
          <button
            type="button"
            key={item}
            onClick={() => runMenuAction(index)}
            tabIndex={menuOpen ? 0 : -1}
            className="flex min-h-[58px] items-center gap-5 rounded-[13px] border-0 bg-transparent px-4 text-left text-[#f0f9f4]/85 outline-none transition hover:bg-[#8df0bc]/10 hover:text-[#f4fbf6] focus-visible:ring-2 focus-visible:ring-[#8df0bc]"
          >
            <span className="text-[10px] tracking-[0.12em] text-[#99d0b4]/50">0{index + 1}</span>
            {item}
          </button>
        ))}
      </nav>
    </section>
  )
}

export default HeroOrbParticles
