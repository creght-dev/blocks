import { Menu, Plus, X } from "lucide-react"
import { useId, useState } from "react"

import ParticleField from "../../effects/stellar-flow/ParticleField"

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

export type HeroStellarFlowProps = {
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

export function HeroStellarFlow({
  className = "",
  brand = "Stellar Flow",
  eyebrow,
  titleLineOne,
  titleLineTwo,
  titleLineThree,
  description,
  primaryLabel,
  secondaryLabel,
}: HeroStellarFlowProps) {
  const menuId = useId()
  const [language, setLanguage] = useState<Language>("en")
  const [menuOpen, setMenuOpen] = useState(false)
  const [replay, setReplay] = useState(0)
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

  const replayParticles = () => setReplay((current) => current + 1)

  const runMenuAction = () => {
    replayParticles()
    setMenuOpen(false)
  }

  return (
    <section
      className={`relative isolate min-h-[max(720px,100dvh)] w-full overflow-hidden bg-[#03090e] font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[#f5f9ff] ${className}`}
    >
      <style>{`@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Red+Hat+Display:wght@400;500&display=swap");`}</style>

      <ParticleField
        mode="six"
        text="HELLO"
        image=""
        speed={1}
        size={1.3}
        count={12000}
        scale={1}
        scatter={0.16}
        glow={0.8}
        depth={0.5}
        interaction={0.65}
        brilliance={1.3}
        starDensity={7}
        twinkle={0.7}
        flowSpeed={1}
        starRays={1}
        rayLength={1}
        coreGlow={1}
        rotation={0}
        color="#a9dbff"
        accentColor="#ffa66b"
        background="#03090e"
        imageColors
        invert={false}
        threshold={90}
        replay={replay}
        className="absolute inset-0 z-0"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(48%_56%_at_0%_100%,rgba(68,151,215,0.14),transparent_74%),linear-gradient(90deg,rgba(2,7,12,0.7)_0%,rgba(2,7,12,0.12)_34%,transparent_64%,rgba(2,7,12,0.16)_100%),radial-gradient(120%_100%_at_50%_46%,transparent_48%,rgba(1,5,9,0.56)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-3 z-[2] border border-[#d9edff]/15 sm:inset-[22px]"
        aria-hidden="true"
      />

      <header className="absolute left-7 right-7 top-6 z-[8] flex items-center justify-between sm:left-[clamp(42px,4.5vw,74px)] sm:right-[clamp(42px,4.5vw,74px)] sm:top-[clamp(38px,4.5vw,68px)]">
        <p
          className="m-0 text-[15px] font-medium tracking-[-0.025em] text-[#f5f9ff]/90 sm:text-[clamp(16px,1.25vw,22px)]"
          style={{ fontFamily: '"Red Hat Display", ui-sans-serif, system-ui, sans-serif' }}
        >
          {brand}
        </p>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setLanguage((current) => (current === "en" ? "zh" : "en"))}
            className="flex items-center gap-1.5 border-0 bg-transparent py-2 text-[11px] tracking-[0.04em] text-[#dceeff]/45 outline-none transition hover:text-[#dceeff]/75 focus-visible:ring-2 focus-visible:ring-[#ffa66b] sm:text-[13px]"
            aria-label="Switch language"
          >
            <span className={language === "en" ? "text-[#f5f9ff]" : ""}>EN</span>
            <span aria-hidden="true">/</span>
            <span className={language === "zh" ? "text-[#f5f9ff]" : ""}>ZH</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 place-items-center border-0 bg-transparent text-[#f5f9ff] outline-none transition hover:text-[#ffa66b] focus-visible:ring-2 focus-visible:ring-[#ffa66b] sm:size-[42px]"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-6 sm:size-[30px]" /> : <Menu className="size-6 sm:size-[30px]" />}
          </button>
        </div>
      </header>

      <div className="absolute left-7 top-[15%] z-[5] w-[calc(100%_-_3.5rem)] sm:left-[clamp(64px,6.4vw,132px)] sm:top-[clamp(142px,17vh,190px)] sm:w-[min(38vw,600px)]">
        <p
          className="mb-2.5 text-xs font-normal tracking-[-0.02em] text-[#e1effb]/80 sm:mb-3.5 sm:text-[clamp(13px,1.1vw,18px)]"
          style={{ fontFamily: '"Red Hat Display", ui-sans-serif, system-ui, sans-serif' }}
        >
          {content.eyebrow}
        </p>
        <h1
          className="m-0 max-w-[350px] text-[clamp(44px,12.5vw,62px)] font-normal italic leading-[0.94] tracking-[-0.065em] text-[#f7fbff]/95 [text-shadow:0_2px_34px_rgba(0,0,0,0.34)] sm:max-w-none sm:text-[clamp(62px,5.25vw,94px)]"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          {content.titleLineOne}
          <span className="block text-[#c6dced]/70">{content.titleLineTwo}</span>
          <span className="block text-[#c6dced]/70">{content.titleLineThree}</span>
        </h1>
      </div>

      <div
        className="pointer-events-none absolute right-[22vw] top-[12%] z-[4] grid size-[30px] place-items-center text-[#f4f9ff]/80 sm:right-[23.5vw] sm:top-[19%]"
        aria-hidden="true"
      >
        <Plus className="size-6" strokeWidth={1} />
      </div>

      <div className="absolute bottom-[34px] left-7 right-7 z-[5] flex gap-2.5 sm:bottom-[clamp(60px,8.5vh,96px)] sm:left-[clamp(64px,6.4vw,132px)] sm:right-auto sm:gap-[18px]">
        <button
          type="button"
          onClick={replayParticles}
          className="min-h-[50px] min-w-0 flex-1 rounded-full border border-[#d9edff]/25 bg-[#07131e]/35 px-[18px] text-xs text-[#eef7ff]/80 shadow-[inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#ffa66b]/65 hover:bg-[#281b17]/60 hover:text-[#fff8f2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffa66b] active:translate-y-0 active:scale-[0.98] sm:min-h-[58px] sm:min-w-[154px] sm:flex-none sm:px-[26px] sm:text-sm"
        >
          {content.primaryLabel}
        </button>
        <button
          type="button"
          onClick={replayParticles}
          className="min-h-[50px] min-w-0 flex-1 rounded-full border border-[#d9edff]/25 bg-[#07131e]/35 px-[18px] text-xs text-[#eef7ff]/80 shadow-[inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#a9dbff]/65 hover:bg-[#0b2738]/60 hover:text-[#f5fbff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a9dbff] active:translate-y-0 active:scale-[0.98] sm:min-h-[58px] sm:min-w-[154px] sm:flex-none sm:px-[26px] sm:text-sm"
        >
          {content.secondaryLabel}
        </button>
      </div>

      <aside className="absolute bottom-28 right-7 z-[5] w-[min(72vw,330px)] sm:bottom-[clamp(64px,8vh,92px)] sm:right-[clamp(64px,6.4vw,132px)] sm:w-[min(30vw,470px)]">
        <p className="m-0 text-xs leading-[1.5] tracking-[-0.02em] text-[#dbeaf7]/70 [text-shadow:0_2px_22px_rgba(0,0,0,0.5)] sm:text-[clamp(14px,1.2vw,19px)] sm:leading-[1.55]">
          {content.description}
        </p>
      </aside>

      <nav
        id={menuId}
        aria-label="Primary navigation"
        aria-hidden={!menuOpen}
        className={`absolute right-7 top-[76px] z-10 grid w-[min(320px,calc(100vw_-_56px))] rounded-[20px] border border-[#d9edff]/20 bg-[#030b12]/85 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition duration-200 sm:right-[clamp(42px,4.5vw,74px)] sm:top-[clamp(92px,9vw,132px)] ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {content.menu.map((item, index) => (
          <button
            type="button"
            key={item}
            onClick={runMenuAction}
            tabIndex={menuOpen ? 0 : -1}
            className="flex min-h-[58px] items-center gap-5 rounded-[13px] border-0 bg-transparent px-4 text-left text-[#eff7ff]/85 outline-none transition hover:bg-[#a9dbff]/10 hover:text-[#f8fbff] focus-visible:ring-2 focus-visible:ring-[#ffa66b]"
          >
            <span className="text-[10px] tracking-[0.12em] text-[#9fc7e6]/50">0{index + 1}</span>
            {item}
          </button>
        ))}
      </nav>
    </section>
  )
}

export default HeroStellarFlow
