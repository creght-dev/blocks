import { useRef, useState, type FormEvent } from "react"
import {
  ArrowUp,
  ArrowUpRight,
  Box,
  Check,
  ChevronDown,
  CircleDashed,
  Code2,
  Feather,
  FileText,
  Globe2,
  GraduationCap,
  Hexagon,
  Lightbulb,
  Menu,
  MoreHorizontal,
  Orbit,
  Paperclip,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import { ArcFlowBackground } from "./ArcFlowBackground"
import { sphereOrbImage } from "./orb-asset"
import "./hero-sphere-ai.css"

type PromptMode = "Brainstorm" | "Code" | "Text" | "Advice" | "More"

const promptModes = [
  { label: "Brainstorm" as const, icon: Lightbulb, placeholder: "What would you like to brainstorm?" },
  { label: "Code" as const, icon: Code2, placeholder: "Describe what you want to build..." },
  { label: "Text" as const, icon: FileText, placeholder: "What would you like to write?" },
  { label: "Advice" as const, icon: GraduationCap, placeholder: "What do you need advice on?" },
  { label: "More" as const, icon: MoreHorizontal, placeholder: "Ask Anything" },
]

const brandLogos = [
  { name: "Boltshift", icon: Zap },
  { name: "Lightbox", icon: Box },
  { name: "FeatherDev", icon: Feather },
  { name: "Spherule", icon: Orbit },
  { name: "GlobalBank", icon: Hexagon },
]

export type HeroSphereAIProps = {
  className?: string
  brandName?: string
  renderBackground?: boolean
  content?: {
    badge: string
    title: string
    description: string
    buttonText: string
    placeholder: string
    suggestions: string
  }
  onPromptSubmit?: (prompt: string, mode: PromptMode, file: File | null) => void
}

export function HeroSphereAI({
  className = "",
  brandName = "CreghtAI",
  renderBackground = true,
  content,
  onPromptSubmit,
}: HeroSphereAIProps) {
  const [prompt, setPrompt] = useState("")
  const [mode, setMode] = useState<PromptMode | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")
  const [locale, setLocale] = useState<"en" | "zh">("en")
  const [openMenu, setOpenMenu] = useState<"navigation" | "resources" | "pricing" | "language" | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const focusPrompt = () => {
    setOpenMenu(null)
    promptRef.current?.focus()
    promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = prompt.trim()
    if (!value) {
      focusPrompt()
      return
    }
    onPromptSubmit?.(value, mode ?? "More", file)
    setStatus(
      onPromptSubmit
        ? "Your request has been sent."
        : "Prompt captured. Connect an AI service to generate a response.",
    )
  }

  const activeMode = promptModes.find((item) => item.label === mode)
  const placeholder = locale === "zh" ? "输入你的想法..." : activeMode?.placeholder ?? content?.placeholder ?? "Ask Anything"
  const titleLines = (content?.title ?? "Build {orb} create\nwith generative AI.").split("\n")
  const [beforeOrb, afterOrb = ""] = (titleLines[0] ?? "").split("{orb}")
  const modeLabels = content?.suggestions.split("\n").map((label) => label.trim()).filter(Boolean) ?? []

  return (
    <section className={`sphere-ai-hero ${className}`} id="sphere-ai-top">
      {renderBackground && <ArcFlowBackground />}

      <header className="sphere-ai-header">
        <a className="sphere-ai-logo" href="#sphere-ai-top" aria-label={`${brandName} home`}>
          <CircleDashed aria-hidden="true" size={26} strokeWidth={1.6} />
          <span>{brandName}</span>
        </a>

        <nav className={`sphere-ai-nav ${openMenu === "navigation" ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#sphere-ai-top" onClick={() => setOpenMenu(null)}>Home</a>
          <a href="#sphere-ai-capabilities" onClick={() => setOpenMenu(null)}>Features</a>
          <button type="button" onClick={() => setOpenMenu(openMenu === "pricing" ? null : "pricing")}>Pricing</button>
          <button
            type="button"
            aria-expanded={openMenu === "resources"}
            onClick={() => setOpenMenu(openMenu === "resources" ? null : "resources")}
          >
            Resources <ChevronDown size={15} strokeWidth={1.6} aria-hidden="true" />
          </button>
          {openMenu === "resources" && (
            <div className="sphere-ai-nav-popover" role="menu">
              <button type="button" role="menuitem" onClick={() => { setPrompt("Help me brainstorm a new product idea for..."); focusPrompt() }}>
                Prompt starter
              </button>
              <button type="button" role="menuitem" onClick={() => { setMode("Code"); focusPrompt() }}>
                Explore coding
              </button>
            </div>
          )}
          {openMenu === "pricing" && (
            <div className="sphere-ai-nav-popover sphere-ai-pricing-popover" role="status">
              <strong>Explore {brandName}</strong>
              <span>Start with an idea and discover what you can create.</span>
              <button type="button" onClick={focusPrompt}>Try the prompt <ArrowUpRight size={14} /></button>
            </div>
          )}
        </nav>

        <div className="sphere-ai-header-actions">
          <button className="sphere-ai-get-started" type="button" onClick={focusPrompt}>
            <span>{content?.buttonText ?? "Get Started"}</span>
            <span className="sphere-ai-get-started-icon"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </button>
          <button
            className="sphere-ai-mobile-menu"
            type="button"
            aria-label={openMenu === "navigation" ? "Close menu" : "Open menu"}
            aria-expanded={openMenu === "navigation"}
            onClick={() => setOpenMenu(openMenu === "navigation" ? null : "navigation")}
          >
            {openMenu === "navigation" ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main className="sphere-ai-main">
        <div className="sphere-ai-eyebrow">
          <Sparkles size={17} fill="currentColor" strokeWidth={1.3} aria-hidden="true" />
          {content?.badge ?? "Experience the power of our generative AI engine"}
        </div>

        <h1 className="sphere-ai-title">
          <span className="sphere-ai-title-first">
            <span>{beforeOrb.trim()}</span>
            {titleLines[0]?.includes("{orb}") && <img src={sphereOrbImage} alt="" aria-hidden="true" />}
            <span>{afterOrb.trim()}</span>
          </span>
          <span className="sphere-ai-title-second">{titleLines.slice(1).join(" ")}</span>
        </h1>

        <div className="sphere-ai-modes" id="sphere-ai-capabilities" aria-label="Prompt categories">
          {promptModes.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              className={mode === label ? "is-selected" : ""}
              type="button"
              aria-pressed={mode === label}
              onClick={() => { setMode(label); setStatus(""); focusPrompt() }}
            >
              {label !== "More" && <Icon size={17} strokeWidth={1.55} aria-hidden="true" />}
              {modeLabels[index] ?? label}
            </button>
          ))}
        </div>

        <form className="sphere-ai-prompt" id="sphere-ai-prompt" onSubmit={submitPrompt}>
          <label className="sphere-ai-sr-only" htmlFor="sphere-ai-input">Ask {brandName} anything</label>
          <textarea
            ref={promptRef}
            id="sphere-ai-input"
            value={prompt}
            onChange={(event) => { setPrompt(event.target.value); setStatus("") }}
            placeholder={placeholder}
            rows={2}
            maxLength={2000}
          />
          <div className="sphere-ai-prompt-toolbar">
            <div className="sphere-ai-prompt-tools">
              <input
                ref={fileRef}
                className="sphere-ai-sr-only"
                type="file"
                accept="image/*,.pdf,.txt"
                tabIndex={-1}
                onChange={(event) => { setFile(event.target.files?.[0] ?? null); setStatus("") }}
              />
              <button type="button" aria-label="Attach a file" title="Attach a file" onClick={() => fileRef.current?.click()}>
                {file ? <Check size={17} /> : <Paperclip size={17} />}
              </button>
              <div className="sphere-ai-language-wrap">
                <button
                  type="button"
                  aria-label="Choose language"
                  title="Choose language"
                  aria-expanded={openMenu === "language"}
                  onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
                >
                  <Globe2 size={17} />
                </button>
                {openMenu === "language" && (
                  <div className="sphere-ai-language-menu" role="menu">
                    <button type="button" role="menuitemradio" aria-checked={locale === "en"} onClick={() => { setLocale("en"); setOpenMenu(null) }}>English</button>
                    <button type="button" role="menuitemradio" aria-checked={locale === "zh"} onClick={() => { setLocale("zh"); setOpenMenu(null) }}>中文</button>
                  </div>
                )}
              </div>
              {file && <span className="sphere-ai-file-name" title={file.name}>{file.name}</span>}
            </div>
            <button className="sphere-ai-send" type="submit" aria-label="Submit prompt" title="Submit prompt">
              <ArrowUp size={18} strokeWidth={1.5} />
            </button>
          </div>
        </form>
        <p className="sphere-ai-status" role="status">{status}</p>

        <div className="sphere-ai-trust" id="sphere-ai-trust">
          <p>{content?.description ?? "Join 4,000+ companies already growing"}</p>
          <div className="sphere-ai-logos" aria-label="Trusted companies">
            {brandLogos.map(({ name, icon: Icon }, index) => (
              <div className="sphere-ai-brand" key={name}>
                {index > 0 && <span className="sphere-ai-brand-divider" aria-hidden="true" />}
                <Icon size={index === 2 ? 26 : 25} strokeWidth={index === 2 ? 2.5 : 2.1} aria-hidden="true" />
                <strong>{name}</strong>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  )
}

export default HeroSphereAI
