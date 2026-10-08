import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Eye,
  Layers3,
  Monitor,
  Moon,
  Paintbrush,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  Type,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { BackgroundControls, RangeField } from "@/src/components/hero-studio/BackgroundControls"
import {
  HeroForeground,
  type HeroContent,
  type HeroLayoutId,
} from "@/src/components/hero-studio/HeroForeground"
import {
  DEFAULT_HERO_CONFIG,
  HERO_BACKGROUNDS,
  HERO_LAYOUTS,
  HERO_STORAGE_KEY,
  loadHeroConfig,
  type BackgroundId,
  type HeroAppearance,
} from "@/src/lib/hero-studio-config"
import { buildHeroSource, copyHeroText, downloadHeroSource } from "@/src/lib/hero-studio-export"
import "@/src/components/hero-studio/hero-composition.css"
import "@/src/components/hero-studio/hero-studio.css"

type Panel = "background" | "content"
const TABS = [
  { id: "background", title: "背景", icon: Paintbrush },
  { id: "content", title: "内容", icon: Type },
] as const

export function HeroStudioPage() {
  const [config, setConfig] = useState(loadHeroConfig)
  const [panel, setPanel] = useState<Panel>("background")
  const [category, setCategory] = useState<"ai" | "mockup">(
    HERO_LAYOUTS.find((item) => item.id === config.layoutId)?.category ?? "ai",
  )
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [stageWidth, setStageWidth] = useState(900)
  const [stageHeight, setStageHeight] = useState(700)
  const [ready, setReady] = useState(false)
  const [previewRevision, setPreviewRevision] = useState(0)
  const [saved, setSaved] = useState(true)
  const [message, setMessage] = useState("")
  const [exportOpen, setExportOpen] = useState(false)
  const [previewLayoutId, setPreviewLayoutId] = useState<HeroLayoutId | null>(null)
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previewDialogRef = useRef<HTMLDialogElement>(null)
  const fullPreviewFrameRef = useRef<HTMLIFrameElement>(null)
  const configRef = useRef(config)
  const selectedBackgroundRef = useRef<Record<HeroAppearance, BackgroundId>>({
    dark: config.appearance === "dark" ? config.backgroundId : "cunda",
    light: config.appearance === "light" ? config.backgroundId : "softSky",
  })
  const previewLayoutRef = useRef(previewLayoutId)
  configRef.current = config
  previewLayoutRef.current = previewLayoutId
  const background = HERO_BACKGROUNDS.find((item) => item.id === config.backgroundId)!
  const layout = HERO_LAYOUTS.find((item) => item.id === config.layoutId)!
  const source = useMemo(() => (exportOpen ? buildHeroSource(config) : ""), [config, exportOpen])
  const frameWidth = device === "desktop" ? 1200 : 390
  const frameHeight = device === "desktop" ? 860 : 844
  const scale = Math.min(1, Math.max(1, stageWidth - 4) / frameWidth, stageHeight / frameHeight)

  useEffect(() => {
    const oldTitle = document.title
    document.title = "Hero Studio — Creght"
    return () => {
      document.title = oldTitle
    }
  }, [])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      setStageWidth(Math.max(1, entry.contentRect.width))
      setStageHeight(
        window.innerWidth <= 760 ? Infinity : Math.max(180, entry.contentRect.height - 4),
      )
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== "hero-studio:ready") return
      if (event.source === frameRef.current?.contentWindow) {
        setReady(true)
        frameRef.current.contentWindow?.postMessage(
          { type: "hero-studio:update", config: configRef.current },
          location.origin,
        )
      }
      if (event.source === fullPreviewFrameRef.current?.contentWindow && previewLayoutRef.current) {
        fullPreviewFrameRef.current.contentWindow?.postMessage(
          {
            type: "hero-studio:update",
            config: { ...configRef.current, layoutId: previewLayoutRef.current },
          },
          location.origin,
        )
      }
    }
    window.addEventListener("message", receive)
    return () => window.removeEventListener("message", receive)
  }, [])
  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "hero-studio:update", config },
      location.origin,
    )
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(config))
        setSaved(true)
      } catch {
        setSaved(false)
      }
    }, 200)
    return () => window.clearTimeout(timer)
  }, [config])
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(""), 3500)
    return () => window.clearTimeout(timer)
  }, [message])
  useEffect(() => {
    if (exportOpen) {
      dialogRef.current?.showModal()
      setCopied(false)
    } else dialogRef.current?.close()
  }, [exportOpen])
  useEffect(() => {
    if (previewLayoutId) previewDialogRef.current?.showModal()
    else previewDialogRef.current?.close()
  }, [previewLayoutId])

  const sphereLayout = config.layoutId === "sphere-ai"
  const activeContent = sphereLayout ? config.sphereContent : config.content
  const updateContent = (key: keyof HeroContent, value: string) =>
    setConfig((previous) =>
      previous.layoutId === "sphere-ai"
        ? { ...previous, sphereContent: { ...previous.sphereContent, [key]: value } }
        : { ...previous, content: { ...previous.content, [key]: value } },
    )
  const copySource = async () => {
    try {
      await copyHeroText(source)
      setCopied(true)
    } catch {
      setMessage("复制未成功，请使用下载 TSX")
    }
  }
  const reset = () => {
    selectedBackgroundRef.current = { dark: "cunda", light: "softSky" }
    setConfig(structuredClone(DEFAULT_HERO_CONFIG))
    setReady(false)
    setPreviewRevision((previous) => previous + 1)
    setCategory("ai")
    setMessage("已恢复初始组合")
  }
  const selectAppearance = (appearance: HeroAppearance) => {
    if (config.appearance === appearance) return
    selectedBackgroundRef.current[config.appearance] = config.backgroundId
    const backgroundId = selectedBackgroundRef.current[appearance]
    setConfig((previous) => ({ ...previous, appearance, backgroundId }))
  }
  const textField = (key: keyof HeroContent, label: string, multiline = false, hint?: string) => (
    <label className="studio-text-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={activeContent[key]}
          onChange={(event) => updateContent(key, event.target.value)}
          rows={key === "suggestions" ? 4 : 3}
          maxLength={2000}
        />
      ) : (
        <input
          value={activeContent[key]}
          onChange={(event) => updateContent(key, event.target.value)}
          maxLength={key === "imageUrl" ? 4000 : 2000}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  )

  return (
    <main className="hero-studio">
      <header className="studio-header">
        <div className="studio-brand">
          <Link to="/" aria-label="返回组件库" className="studio-back">
            <ArrowLeft size={17} />
          </Link>
          <span className="studio-brand-divider" />
          <div className="studio-brand-icon">
            <Layers3 size={19} />
          </div>
          <h1>
            Hero Studio<span>BETA</span>
          </h1>
        </div>
        <div className="studio-header-actions">
          <span className={`studio-save ${saved ? "" : "studio-unsaved"}`}>
            <CheckCircle2 size={12} />
            {saved ? "草稿自动保存在本机" : "本机保存不可用"}
          </span>
          <button
            type="button"
            aria-label="重置"
            className="studio-button studio-reset"
            onClick={reset}
          >
            <RotateCcw size={13} />
            <span>重置</span>
          </button>
          <button
            type="button"
            className="studio-button"
            aria-label="预览当前 Hero 的真实效果"
            onClick={() => setPreviewLayoutId(config.layoutId)}
          >
            <Eye size={15} />
            预览
          </button>
          <button
            type="button"
            className="studio-button studio-primary"
            onClick={() => setExportOpen(true)}
          >
            <Code2 size={15} />
            导出代码
            <ArrowUpRight size={13} />
          </button>
        </div>
      </header>
      <div className="studio-workspace">
        <aside className="studio-layout-sidebar" aria-label="Hero 布局">
          <div className="studio-layout-rail-heading">
            <span className="studio-eyebrow">01 / LAYOUT</span>
            <h2>选择布局</h2>
            <p>先定前景结构，文案和背景会跟随保留。</p>
          </div>
          <div className="studio-category" aria-label="布局分类">
            {(
              [
                { id: "ai", label: "AI 输入框" },
                { id: "mockup", label: "Mockup" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
                <span>{HERO_LAYOUTS.filter((layout) => layout.category === item.id).length.toString().padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <div className="studio-layout-grid">
            {HERO_LAYOUTS.filter((item) => item.category === category).map((item) => (
              <article
                key={item.id}
                className="studio-layout-card"
                data-selected={config.layoutId === item.id}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="studio-layout-choice"
                  aria-label={`使用${item.title}布局`}
                  aria-pressed={config.layoutId === item.id}
                  onClick={() => setConfig((previous) => ({
                    ...previous,
                    layoutId: item.id,
                    ...(item.id === "sphere-ai" && previous.layoutId !== "sphere-ai"
                      ? { appearance: "dark" as const, backgroundId: "arcFlow" as const }
                      : {}),
                  }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      event.currentTarget.click()
                    }
                  }}
                >
                  <div className="studio-layout-thumbnail" aria-hidden="true">
                    {item.id === "sphere-ai" ? (
                      <img className="studio-sphere-thumbnail" src="/covers/hero-sphere-ai.png" alt="" />
                    ) : (
                      <div className={`studio-layout-mini hs-${config.appearance}`} inert>
                        <HeroForeground layoutId={item.id} content={DEFAULT_HERO_CONFIG.content} appearance={config.appearance} />
                      </div>
                    )}
                    {config.layoutId === item.id && (
                      <span className="studio-selection-check">
                        <Check size={11} />
                      </span>
                    )}
                  </div>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="studio-tip">
            <Sparkles size={14} />
            <p>
              同一个想法，换一种表达。
              <br />
              切换布局不会清空你的文案。
            </p>
          </div>
        </aside>
        <section className="studio-preview-panel" aria-label="Hero 实时预览">
          <div className="studio-preview-toolbar">
            <div className="studio-live">
              <span />
              实时预览
              <span className="studio-toolbar-divider" />
              <span className="studio-layout-name">{layout.title}</span>
            </div>
            <div className="studio-devices" aria-label="预览设备">
              <button
                type="button"
                aria-label="桌面预览"
                aria-pressed={device === "desktop"}
                onClick={() => setDevice("desktop")}
              >
                <Monitor size={14} />
                <span>桌面</span>
              </button>
              <button
                type="button"
                aria-label="手机预览"
                aria-pressed={device === "mobile"}
                onClick={() => setDevice("mobile")}
              >
                <Smartphone size={14} />
                <span>手机</span>
              </button>
            </div>
          </div>
          <div className="studio-preview-scroll" ref={stageRef}>
            <div className="studio-stage">
              <div
                className={`studio-frame studio-frame-${device}`}
                style={{ width: frameWidth * scale, height: frameHeight * scale }}
              >
                <div className="studio-frame-top">
                  <span />
                  <span />
                  <span />
                  <span className="studio-frame-address">your-next-idea.com</span>
                  <Sparkles size={10} />
                </div>
                <div className="studio-frame-content" style={{ height: frameHeight * scale }}>
                  <iframe
                    key={previewRevision}
                    ref={frameRef}
                    title="Hero 实时画布"
                    src="/hero-studio/preview"
                    onLoad={() => {
                      frameRef.current?.contentWindow?.postMessage(
                        { type: "hero-studio:update", config: configRef.current },
                        location.origin,
                      )
                      setReady(true)
                    }}
                    style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})` }}
                  />
                  {!ready && <div className="studio-loading">正在准备画布…</div>}
                </div>
              </div>
            </div>
          </div>
          <footer className="studio-preview-footer">
            <span>
              <Layers3 size={12} />
              {layout.category === "ai" ? "AI 输入框" : "Mockup"}
              <span>/</span>
              {background.title}
              <span>·</span>
              {config.appearance === "light" ? "亮色系" : "暗色系"}
            </span>
            <span>
              {frameWidth} × {frameHeight}
              <span>·</span>
              {Math.round(scale * 100)}%
            </span>
          </footer>
          <div className="studio-workflow">
            <span className="studio-workflow-label">MAKE IT YOURS</span>
            <span>选布局</span>
            <span>→</span>
            <span>换背景</span>
            <span>→</span>
            <span>调参数</span>
            <span>→</span>
            <span>带走代码</span>
          </div>
        </section>
        <aside className="studio-sidebar" aria-label="Hero 配置">
          <div className="studio-tabs" role="tablist" aria-label="配置分类">
            {TABS.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                type="button"
                id={`studio-tab-${id}`}
                aria-selected={panel === id}
                aria-controls={`studio-panel-${id}`}
                onClick={() => setPanel(id)}
              >
                <Icon size={15} />
                {title}
              </button>
            ))}
          </div>
          <div
            className="studio-panel"
            role="tabpanel"
            id={`studio-panel-${panel}`}
            aria-labelledby={`studio-tab-${panel}`}
          >
            {panel === "background" && (
              <>
                <div className="studio-panel-heading">
                  <h2>让背景定义氛围</h2>
                  <p>先选择色系，再挑选背景与调整细节。</p>
                </div>
                <div className="studio-appearance" role="group" aria-label="Hero 色系">
                  <button
                    type="button"
                    aria-pressed={config.appearance === "dark"}
                    onClick={() => selectAppearance("dark")}
                  >
                    <Moon size={13} /> 暗色系
                  </button>
                  <button
                    type="button"
                    aria-pressed={config.appearance === "light"}
                    onClick={() => selectAppearance("light")}
                  >
                    <Sun size={13} /> 亮色系
                  </button>
                </div>
                <p className="studio-appearance-hint">
                  {config.appearance === "light"
                    ? "浅色背景搭配深色文字，适合截图中的清爽科技感。"
                    : "深色背景搭配浅色文字，适合强调光影与沉浸感。"}
                </p>
                <div className="studio-backgrounds">
                  {HERO_BACKGROUNDS.filter((item) => item.appearance === config.appearance).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={config.backgroundId === item.id}
                      onClick={() => {
                        selectedBackgroundRef.current[item.appearance] = item.id
                        setConfig((previous) => ({ ...previous, backgroundId: item.id }))
                      }}
                    >
                      <div className="studio-background-cover">
                        <img src={item.cover} alt="" />
                        {config.backgroundId === item.id && (
                          <span className="studio-selection-check">
                            <Check size={10} />
                          </span>
                        )}
                      </div>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
                <div className="studio-active-background">
                  <div>
                    <span className="studio-status-dot" />
                    <strong>{background.title}</strong>
                    <span>{background.description}</span>
                  </div>
                  <span>已应用</span>
                </div>
                <BackgroundControls
                  key={config.backgroundId}
                  id={config.backgroundId}
                  config={config}
                  onChange={(key, value) =>
                    setConfig((previous) => ({
                      ...previous,
                      backgrounds: {
                        ...previous.backgrounds,
                        [previous.backgroundId]: {
                          ...previous.backgrounds[previous.backgroundId],
                          [key]: value,
                        },
                      },
                    }))
                  }
                  onReset={() => {
                    setConfig((previous) => ({
                      ...previous,
                      backgrounds: {
                        ...previous.backgrounds,
                        [previous.backgroundId]: {
                          ...DEFAULT_HERO_CONFIG.backgrounds[previous.backgroundId],
                        },
                      },
                    }))
                    setMessage("已重置当前背景参数")
                  }}
                />
                <section className="studio-overlay-control">
                  <div className="studio-section-heading">
                    <span>内容可读性</span>
                  </div>
                  <RangeField
                    label={config.appearance === "light" ? "白色柔化" : "暗色遮罩"}
                    min={0}
                    max={0.85}
                    step={0.01}
                    value={config.overlays[config.backgroundId]}
                    onChange={(overlay) =>
                      setConfig((previous) => ({
                        ...previous,
                        overlays: { ...previous.overlays, [previous.backgroundId]: overlay },
                      }))
                    }
                  />
                  <p>
                    {config.appearance === "light"
                      ? "压低背景色彩的干扰，让深色文字更清晰。"
                      : "降低背景亮度，让浅色文字更清晰。"}
                  </p>
                </section>
              </>
            )}
            {panel === "content" && (
              <>
                <div className="studio-panel-heading">
                  <h2>说出你的想法</h2>
                  <p>修改即时呈现，内容跟随布局保留。</p>
                </div>
                <div className="studio-fields">
                  {sphereLayout && (
                    <label className="studio-text-field">
                      <span>品牌名称</span>
                      <input
                        value={config.sphereContent.brandName}
                        onChange={(event) => setConfig((previous) => ({
                          ...previous,
                          sphereContent: { ...previous.sphereContent, brandName: event.target.value },
                        }))}
                        maxLength={80}
                      />
                    </label>
                  )}
                  {textField("badge", "顶部标签")}
                  {textField("title", "主标题", true, sphereLayout ? "首行用 {orb} 放置蓝色球体；换行显示副标题。" : "支持换行，让标题拥有自己的节奏。")}
                  {textField("description", sphereLayout ? "品牌墙引导语" : "描述", true)}
                  {(layout.category === "mockup" || config.layoutId === "ai-split" || sphereLayout) && (
                    <>
                      {textField("buttonText", "按钮文字")}
                      {!sphereLayout && textField(
                        "buttonHref",
                        "按钮链接",
                        false,
                        "支持 https://、站内路径或 #锚点",
                      )}
                    </>
                  )}
                  <div className="studio-section-heading">
                    <span>{layout.category === "ai" ? "AI 输入框" : "产品 Mockup"}</span>
                  </div>
                  {layout.category === "ai" ? (
                    <>
                      {textField("placeholder", "输入框提示")}
                      {textField(
                        "suggestions",
                        sphereLayout ? "功能标签" : "示例提示词",
                        true,
                        sphereLayout ? "每行一个标签，最多显示 5 个。" : "每行一条，最多显示 4 条；点击可填入输入框。",
                      )}
                      <p className="studio-field-note">
                        输入框支持交互演示，AI 服务可在导出后接入。
                      </p>
                    </>
                  ) : (
                    <>
                      {textField(
                        "imageUrl",
                        "图片地址",
                        false,
                        "留空使用 Cunda 示例。支持 https:// 或站内图片路径。",
                      )}
                      {textField("imageAlt", "图片描述")}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="studio-sidebar-footer">
            <span className="studio-status-dot" />
            {panel === "background" ? "每种背景的参数会独立保存" : "修改会实时应用到画布"}
          </div>
        </aside>
      </div>
      {message && (
        <div className="studio-toast" role="status">
          <CheckCircle2 size={15} />
          {message}
        </div>
      )}
      <dialog
        ref={previewDialogRef}
        className="studio-full-preview"
        aria-label="Hero 真实效果预览"
        onCancel={() => setPreviewLayoutId(null)}
        onClose={() => setPreviewLayoutId(null)}
      >
        {previewLayoutId && (
          <>
            <iframe
              ref={fullPreviewFrameRef}
              title="Hero 真实效果"
              src={`/hero-studio/preview?layout=${previewLayoutId}`}
              onLoad={() =>
                fullPreviewFrameRef.current?.contentWindow?.postMessage(
                  {
                    type: "hero-studio:update",
                    config: { ...configRef.current, layoutId: previewLayoutId },
                  },
                  location.origin,
                )
              }
            />
            <button
              type="button"
              className="studio-full-preview-close"
              aria-label="关闭真实效果预览"
              onClick={() => setPreviewLayoutId(null)}
            >
              <X size={17} />
              返回编辑
            </button>
          </>
        )}
      </dialog>
      <dialog
        ref={dialogRef}
        className="studio-export-dialog"
        onCancel={() => setExportOpen(false)}
        onClose={() => setExportOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExportOpen(false)
        }}
      >
        <div className="studio-export-inner">
          <header>
            <div>
              <span className="studio-eyebrow">TAKE IT WITH YOU</span>
              <h2>你的 Hero，准备好了。</h2>
            </div>
            <button
              type="button"
              className="studio-icon-button"
              aria-label="关闭导出"
              onClick={() => setExportOpen(false)}
            >
              <X size={18} />
            </button>
          </header>
          <p>一个 TSX 文件，包含当前布局、背景源码和所有参数。</p>
          <div className="studio-install">
            <span>React + Tailwind CSS v4</span>
            <code>npm install lucide-react{config.backgroundId === "cunda" ? " ogl" : ""}</code>
          </div>
          <label className="studio-code-label">
            GeneratedHero.tsx
            <textarea aria-label="导出的 React 代码" readOnly value={source} spellCheck={false} />
          </label>
          <footer>
            <span>保存后引入 &lt;GeneratedHero /&gt;</span>
            <div>
              <button
                type="button"
                className="studio-button"
                onClick={() => downloadHeroSource(source)}
              >
                <Download size={14} />
                下载 TSX
              </button>
              <button
                type="button"
                className="studio-button studio-primary"
                onClick={() => void copySource()}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "已复制" : "复制代码"}
              </button>
            </div>
          </footer>
        </div>
      </dialog>
    </main>
  )
}
