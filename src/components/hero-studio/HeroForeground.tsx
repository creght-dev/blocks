import { useId, useState } from "react"
import { ArrowRight, ArrowUp, Check, Globe, Plus, Sparkles } from "lucide-react"
import { DashboardPreview } from "@/registry/creght/hero/hero-cunda/DashboardPreview"
import { LightDashboardPreview } from "./LightDashboardPreview"

export type HeroLayoutId = "ai-centered" | "ai-split" | "sphere-ai" | "mockup-centered" | "mockup-split"
export type HeroContent = {
  badge: string
  title: string
  description: string
  buttonText: string
  buttonHref: string
  placeholder: string
  suggestions: string
  imageUrl: string
  imageAlt: string
}

export function safeHeroUrl(value: string, image = false): string {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed) || /^\/(?!\/)/.test(trimmed)) return trimmed
  if (!image && (/^[#?]/.test(trimmed) || /^mailto:/i.test(trimmed))) return trimmed
  return image ? "" : "#"
}

export function HeroForeground({
  layoutId,
  content,
  appearance = "dark",
}: {
  layoutId: HeroLayoutId
  content: HeroContent
  appearance?: "dark" | "light"
}) {
  const promptId = useId()
  const [prompt, setPrompt] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [failedImage, setFailedImage] = useState("")
  const isAi = layoutId.startsWith("ai-")
  const isSplit = layoutId.endsWith("-split")
  const imageUrl = safeHeroUrl(content.imageUrl, true)
  const suggestions = content.suggestions
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4)
  const updatePrompt = (value: string) => {
    setPrompt(value)
    setSubmitted(false)
  }

  const visual = isAi ? (
    <div className="hs-prompt-wrap">
      <form
        className="hs-prompt"
        onSubmit={(event) => {
          event.preventDefault()
          if (prompt.trim()) setSubmitted(true)
        }}
      >
        {isSplit && (
          <div className="hs-prompt-heading">
            <Sparkles size={16} /> Your creative co-pilot
          </div>
        )}
        <label className="hs-sr-only" htmlFor={promptId}>
          {content.placeholder || "描述你的想法"}
        </label>
        <textarea
          id={promptId}
          value={prompt}
          onChange={(event) => updatePrompt(event.target.value)}
          placeholder={content.placeholder}
          rows={isSplit ? 5 : 3}
          maxLength={2000}
        />
        <div className="hs-prompt-toolbar">
          <span className="hs-prompt-hint">
            <Globe size={15} /> Bring your ideas to life
          </span>
          <button
            type="submit"
            className="hs-send"
            disabled={!prompt.trim()}
            aria-label="预览提交提示词"
          >
            {submitted ? <Check size={17} /> : <ArrowUp size={17} />}
          </button>
        </div>
      </form>
      <div className="hs-suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            type="button"
            key={`${index}-${suggestion}`}
            onClick={() => updatePrompt(suggestion)}
          >
            <Plus size={12} />
            {suggestion}
          </button>
        ))}
      </div>
      <p className="hs-prompt-status" role="status">
        {submitted
          ? "已收到你的想法 · 这是交互演示，尚未连接 AI 服务"
          : "Start with an idea. Make it something real."}
      </p>
    </div>
  ) : (
    <div className="hs-mockup">
      {imageUrl && imageUrl !== failedImage ? (
        <div className="hs-image-frame">
          <div className="hs-browser-bar">
            <span />
            <span />
            <span />
            <p>Product preview</p>
          </div>
          <img src={imageUrl} alt={content.imageAlt} onError={() => setFailedImage(imageUrl)} />
        </div>
      ) : (
        <>
          <div inert>
            {appearance === "light" ? <LightDashboardPreview /> : <DashboardPreview />}
          </div>
          {imageUrl && (
            <p className="hs-image-error" role="status">
              图片加载失败，正在显示示例 Mockup
            </p>
          )}
        </>
      )}
    </div>
  )

  return (
    <div
      className={`hs-foreground ${isSplit ? "hs-split" : "hs-centered"} ${isAi ? "hs-ai" : "hs-product"}`}
      data-layout={layoutId}
    >
      <div className="hs-copy">
        {content.badge && (
          <div className="hs-badge">
            <Sparkles size={12} />
            {content.badge}
          </div>
        )}
        <h1>{content.title}</h1>
        {content.description && <p className="hs-description">{content.description}</p>}
        {(!isAi || isSplit) && content.buttonText && (
          <a className="hs-cta" href={safeHeroUrl(content.buttonHref)}>
            {content.buttonText}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
      {visual}
    </div>
  )
}
