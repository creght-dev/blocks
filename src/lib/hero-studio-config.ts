import {
  AI_LIQUID_DEFAULTS,
  type AiLiquidSettings,
} from "@/registry/creght/background/ai-liquid-background/ai-liquid-background"
import {
  CUNDA_HERO_DEFAULTS,
  type CundaHeroSettings,
} from "@/registry/creght/background/cunda-hero-background/cunda-hero-background"
import {
  CARGO_LIQUID_DEFAULTS,
  type CargoLiquidSettings,
} from "@/src/components/hero-studio/CargoLiquidBackground"
import {
  GLASS_RIBBON_DEFAULTS,
  type GlassRibbonSettings,
} from "@/src/components/hero-studio/GlassRibbonBackground"
import {
  SOFT_SKY_DEFAULTS,
  type SoftSkySettings,
} from "@/src/components/hero-studio/SoftSkyBackground"
import {
  NEURO_NOISE_DEFAULTS,
  type NeuroNoiseSettings,
} from "@/registry/creght/background/neuro-noise/neuro-noise"
import {
  safeHeroUrl,
  type HeroContent,
  type HeroLayoutId,
} from "@/src/components/hero-studio/HeroForeground"
import { ARC_FLOW_DEFAULTS, type ArcFlowSettings } from "@/registry/creght/hero/hero-sphere-ai/ArcFlowBackground"

export type HeroAppearance = "dark" | "light"
export type BackgroundId = "cunda" | "liquid" | "cargoLiquid" | "glassRibbon" | "softSky" | "neuro" | "arcFlow"
export type HeroConfig = {
  version: 1
  appearance: HeroAppearance
  layoutId: HeroLayoutId
  backgroundId: BackgroundId
  overlays: Record<BackgroundId, number>
  content: HeroContent
  sphereContent: HeroContent & { brandName: string }
  backgrounds: {
    cunda: CundaHeroSettings
    liquid: AiLiquidSettings
    cargoLiquid: CargoLiquidSettings
    glassRibbon: GlassRibbonSettings
    softSky: SoftSkySettings
    neuro: NeuroNoiseSettings
    arcFlow: ArcFlowSettings
  }
}
export type BackgroundControl = {
  key: string
  label: string
  type: "range" | "color" | "select" | "boolean"
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  advanced?: boolean
}
const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  advanced = false,
): BackgroundControl => ({ key, label, type: "range", min, max, step, advanced })
const color = (key: string, label: string): BackgroundControl => ({ key, label, type: "color" })

export const HERO_LAYOUTS: {
  id: HeroLayoutId
  category: "ai" | "mockup"
  title: string
  description: string
}[] = [
  { id: "ai-centered", category: "ai", title: "居中输入框", description: "让想法成为视觉焦点" },
  { id: "ai-split", category: "ai", title: "左文右框", description: "介绍产品，引导创作" },
  { id: "sphere-ai", category: "ai", title: "CreghtAI", description: "截图同款导航、标题与输入框" },
  { id: "mockup-centered", category: "mockup", title: "居中展示", description: "完整展现产品界面" },
  { id: "mockup-split", category: "mockup", title: "左文右图", description: "文案与产品并排呈现" },
]
export const HERO_BACKGROUNDS: {
  id: BackgroundId
  appearance: HeroAppearance
  title: string
  description: string
  cover: string
}[] = [
  {
    id: "cunda",
    appearance: "dark",
    title: "Cunda Rays",
    description: "流动光束",
    cover:
      "https://fsu.creght.com/site/2083536173505974272/1790153799366__cunda_hero_background_cover.png",
  },
  {
    id: "liquid",
    appearance: "dark",
    title: "AI Liquid",
    description: "液态渐变",
    cover:
      "https://fsu.creght.com/site/2083536173505974272/1788402652071__background_ai_liquid_cover.png",
  },
  {
    id: "cargoLiquid",
    appearance: "dark",
    title: "Cargo 液态渐变",
    description: "三色液态渐变",
    cover: "/covers/cargo-liquid.svg",
  },
  {
    id: "arcFlow",
    appearance: "dark",
    title: "Arc Flow",
    description: "蓝色弧线与流动光影",
    cover: "/covers/hero-sphere-ai.png",
  },
  {
    id: "glassRibbon",
    appearance: "light",
    title: "Glass Ribbon",
    description: "蓝色玻璃光带",
    cover: "/covers/glass-ribbon.svg",
  },
  {
    id: "softSky",
    appearance: "light",
    title: "Soft Sky",
    description: "暖色柔光、透视光线与浮动粒子",
    cover: "/covers/soft-sky.svg",
  },
  {
    id: "neuro",
    appearance: "dark",
    title: "Neuro Noise",
    description: "神经纹理",
    cover:
      "https://fsu.creght.com/site/2083536173505974272/1788336621574__background_neuro_noise_cover.png",
  },
]
export const BACKGROUND_CONTROLS: Record<BackgroundId, BackgroundControl[]> = {
  arcFlow: [
    color("top", "天空蓝"),
    color("mid", "柔和蓝"),
    color("warm", "暖光色"),
    color("mint", "青绿色"),
    color("blue", "深蓝色"),
    color("cyan", "亮蓝色"),
    range("speed", "流动速度", 0, 4, 0.05),
    range("curve", "弧线弯曲", -80, 80, 1),
    range("offset", "弧线位置", -80, 80, 1),
    range("width", "弧线宽度", 0.2, 3, 0.05),
    range("flow", "流动强度", 0, 4, 0.05),
    range("light", "光照强度", 0, 3, 0.05),
    range("grain", "颗粒质感", 0, 0.08, 0.001, true),
    range("seed", "纹理种子", 0, 20, 0.1, true),
  ],
  cunda: [
    color("rayColor1", "光束颜色 A"),
    color("rayColor2", "光束颜色 B"),
    range("speed", "流动速度", 0, 8, 0.1),
    range("intensity", "光照强度", 0, 5, 0.1),
    range("spread", "光束扩散", 0.5, 5, 0.1),
    {
      key: "origin",
      label: "光源位置",
      type: "select",
      options: [
        { value: "top-right", label: "右上" },
        { value: "top-left", label: "左上" },
        { value: "bottom-right", label: "右下" },
        { value: "bottom-left", label: "左下" },
      ],
    },
    range("tilt", "倾斜角度", -90, 90, 1),
    range("gridOpacity", "网格透明度", 0, 1, 0.01),
    range("blend", "双色混合", 0, 1, 0.01, true),
    range("saturation", "饱和度", 0, 3, 0.1, true),
    range("falloff", "光线衰减", 0.5, 4, 0.1, true),
    range("opacity", "光束透明度", 0, 1, 0.01, true),
  ],
  liquid: [
    color("color1", "底色"),
    color("color2", "流体颜色"),
    color("color3", "辅助颜色"),
    range("speed", "流动速度", 0, 10, 0.1),
    range("scale", "纹理缩放", 0.05, 2, 0.05),
    range("rotation", "旋转角度", 0, 360, 1),
    range("distortion", "扭曲程度", 0, 100, 1),
    range("swirl", "漩涡强度", 0, 100, 1),
    {
      key: "shape",
      label: "纹理形状",
      type: "select",
      options: [
        { value: "Edge", label: "流动边缘" },
        { value: "Stripes", label: "条纹" },
        { value: "Checks", label: "棋盘" },
      ],
    },
    range("opacity", "流体透明度", 0, 1, 0.01),
    range("proportion", "颜色占比", 0, 100, 1, true),
    range("softness", "柔和程度", 0, 100, 1, true),
    range("swirlIterations", "漩涡层数", 1, 12, 1, true),
    range("shapeSize", "形状尺寸", 1, 100, 1, true),
    range("offset", "纹理偏移", -200, 200, 1, true),
    range("noise", "颗粒质感", 0, 100, 1, true),
    range("maxPixelRatio", "渲染精度", 0.5, 2, 0.5, true),
    {
      key: "blendMode",
      label: "混合模式",
      type: "select",
      advanced: true,
      options: [
        { value: "hard-light", label: "深色高亮" },
        { value: "screen", label: "滤色" },
        { value: "normal", label: "正常" },
        { value: "lighten", label: "变亮" },
      ],
    },
  ],
  cargoLiquid: [
    color("color1", "暗部颜色"),
    color("color2", "主色"),
    color("color3", "亮部颜色"),
    range("proportion", "色彩比例", 0, 100, 1),
    range("softness", "柔和程度", 0, 100, 1),
    {
      key: "shape",
      label: "形状",
      type: "select",
      options: [
        { value: "Checks", label: "棋盘波纹" },
        { value: "Stripes", label: "流动条纹" },
        { value: "Edge", label: "柔和边缘" },
      ],
    },
    range("shapeSize", "形状密度", 0, 100, 1),
    range("scale", "噪声缩放", 0, 5, 0.05),
    range("rotation", "旋转", -180, 180, 1),
    range("speed", "流动速度", 0, 100, 1),
    range("distortion", "扭曲", 0, 100, 1),
    range("swirl", "漩涡强度", 0, 100, 1),
    range("swirlIterations", "漩涡层数", 1, 8, 1, true),
  ],
  glassRibbon: [
    color("skyColor", "天空蓝"),
    color("mistColor", "雾面色"),
    color("glassColor", "玻璃高光"),
    color("deepColor", "深蓝色"),
    color("warmColor", "暖光色"),
    range("curveHeight", "曲面高度", 0, 100, 1),
    range("warmIntensity", "暖光强度", 0, 1, 0.01),
    range("bandIntensity", "光带强度", 0, 1, 0.01),
    range("softness", "柔焦程度", 0, 100, 1, true),
    range("motionSpeed", "流动速度", 0, 1, 0.05, true),
  ],
  softSky: [
    color("topColor", "顶部颜色"),
    color("warmColor", "中段暖色"),
    color("accentColor", "底部强调色"),
    color("lightColor", "粒子与光线颜色"),
    range("particleCount", "粒子数量", 0, 300, 1),
    range("particleSize", "粒子大小", 0.3, 4, 0.1),
    range("particleOpacity", "粒子透明度", 0, 1, 0.01),
    range("speed", "浮动速度", 0, 3, 0.05),
    range("rayCount", "光线数量", 0, 16, 1),
    range("rayOpacity", "光线强度", 0, 1, 0.01),
    range("rayWidth", "光线宽度", 0.3, 3, 0.1, true),
    range("rayGlow", "光线柔光", 0, 1, 0.01, true),
    range("glowIntensity", "背景柔光", 0, 1, 0.01, true),
    range("topFade", "顶部留白", 0.05, 0.65, 0.01, true),
    range("focusX", "汇聚点 X", 0, 1, 0.01, true),
    range("focusY", "汇聚点 Y", 0.2, 1.2, 0.01, true),
    { key: "animated", label: "播放粒子动画", type: "boolean", advanced: true },
    range("seed", "粒子布局种子", 0, 9999, 1, true),
  ],
  neuro: [
    color("baseColor", "纹理颜色"),
    color("backgroundColor", "背景颜色"),
    range("speed", "流动速度", 0, 3, 0.1),
    range("scale", "纹理缩放", 2, 18, 0.1),
    range("intensity", "纹理亮度", 0.2, 3, 0.1),
    range("complexity", "纹理复杂度", 1, 15, 1),
    range("hueShift", "色相偏移", -180, 180, 1),
    { key: "interactive", label: "跟随鼠标", type: "boolean" },
    range("pointerStrength", "鼠标影响强度", 0, 5, 0.1, true),
    range("flowRotation", "流动方向", 0, 2.5, 0.1, true),
    range("colorVariation", "色彩变化", 0, 2, 0.1, true),
    range("contrast", "对比度", 1, 6, 0.1, true),
    range("detail", "细节层次", 2, 14, 0.1, true),
    range("threshold", "纹理阈值", 0, 1, 0.01, true),
    range("vignette", "边缘暗角", 0, 2, 0.1, true),
    range("scrollInfluence", "滚动影响", 0, 3, 0.1, true),
    range("opacity", "纹理透明度", 0, 1, 0.01, true),
    range("maxPixelRatio", "渲染精度", 0.5, 2, 0.5, true),
  ],
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  version: 1,
  appearance: "dark",
  layoutId: "ai-centered",
  backgroundId: "cunda",
  overlays: {
    cunda: 0.24,
    liquid: 0.24,
    cargoLiquid: 0.24,
    glassRibbon: 0.08,
    softSky: 0.02,
    neuro: 0.24,
    arcFlow: 0,
  },
  content: {
    badge: "A little idea. A world of possibility.",
    title: "Your next big thing\nstarts with an idea.",
    description:
      "A creative workspace for turning what you imagine into what comes next. Dream it. Describe it. Make it real.",
    buttonText: "Start creating",
    buttonHref: "#start",
    placeholder: "Describe what you want to create…",
    suggestions: "A portfolio website\nA new brand identity\nMy next big idea",
    imageUrl: "",
    imageAlt: "产品界面预览",
  },
  sphereContent: {
    brandName: "CreghtAI",
    badge: "Experience the power of our generative AI engine",
    title: "Build {orb} create\nwith generative AI.",
    description: "Join 4,000+ companies already growing",
    buttonText: "Get Started",
    buttonHref: "#sphere-ai-prompt",
    placeholder: "Ask Anything",
    suggestions: "Brainstorm\nCode\nText\nAdvice\nMore",
    imageUrl: "",
    imageAlt: "",
  },
  backgrounds: {
    cunda: { ...CUNDA_HERO_DEFAULTS, blend: 0.65 },
    liquid: { ...AI_LIQUID_DEFAULTS },
    cargoLiquid: { ...CARGO_LIQUID_DEFAULTS },
    glassRibbon: { ...GLASS_RIBBON_DEFAULTS },
    softSky: { ...SOFT_SKY_DEFAULTS },
    neuro: { ...NEURO_NOISE_DEFAULTS },
    arcFlow: { ...ARC_FLOW_DEFAULTS },
  },
}
export const HERO_STORAGE_KEY = "creght:hero-studio:v1"
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}

// Every boundary (storage, preview messages, imports) shares the same validation.
export function normalizeHeroConfig(value: unknown): HeroConfig {
  const next = structuredClone(DEFAULT_HERO_CONFIG)
  const input = record(value)
  if (input.version !== 1) return next
  if (HERO_LAYOUTS.some((item) => item.id === input.layoutId))
    next.layoutId = input.layoutId as HeroLayoutId
  if (HERO_BACKGROUNDS.some((item) => item.id === input.backgroundId))
    next.backgroundId = input.backgroundId as BackgroundId
  const selectedBackground = HERO_BACKGROUNDS.find((item) => item.id === next.backgroundId)!
  next.appearance = selectedBackground.appearance
  const savedOverlays = record(input.overlays)
  for (const { id } of HERO_BACKGROUNDS) {
    const stored = savedOverlays[id]
    const legacy = id === "glassRibbon" || id === "softSky" ? undefined : input.overlay
    const value = typeof stored === "number" ? stored : legacy
    if (typeof value === "number" && Number.isFinite(value))
      next.overlays[id] = Math.min(0.85, Math.max(0, value))
  }
  const content = record(input.content)
  for (const key of Object.keys(next.content) as (keyof HeroContent)[]) {
    if (typeof content[key] === "string")
      next.content[key] = content[key].slice(0, key === "imageUrl" ? 4000 : 2000)
  }
  next.content.buttonHref = safeHeroUrl(next.content.buttonHref)
  next.content.imageUrl = safeHeroUrl(next.content.imageUrl, true)
  const sphereContent = record(input.sphereContent)
  for (const key of Object.keys(next.sphereContent) as (keyof typeof next.sphereContent)[]) {
    if (typeof sphereContent[key] === "string")
      next.sphereContent[key] = sphereContent[key].slice(0, key === "imageUrl" ? 4000 : 2000)
  }
  next.sphereContent.buttonHref = safeHeroUrl(next.sphereContent.buttonHref)
  next.sphereContent.imageUrl = safeHeroUrl(next.sphereContent.imageUrl, true)
  for (const { id } of HERO_BACKGROUNDS) {
    const settings = record(record(input.backgrounds)[id])
    const output = next.backgrounds[id] as unknown as Record<string, unknown>
    for (const control of BACKGROUND_CONTROLS[id]) {
      const v = settings[control.key]
      if (control.type === "range" && typeof v === "number" && Number.isFinite(v))
        output[control.key] = Math.min(control.max!, Math.max(control.min!, v))
      if (control.type === "color" && typeof v === "string" && /^#[\da-f]{6}$/i.test(v))
        output[control.key] = v
      if (control.type === "boolean" && typeof v === "boolean") output[control.key] = v
      if (control.type === "select" && control.options!.some((option) => option.value === v))
        output[control.key] = v
    }
  }
  // Preserve colors and sparkle strength from Soft Sky drafts saved before the
  // Replyo particle background replaced the original static treatment.
  const savedSoftSky = record(record(input.backgrounds).softSky)
  const softSky = next.backgrounds.softSky
  if (typeof savedSoftSky.bottomColor === "string" && /^#[\da-f]{6}$/i.test(savedSoftSky.bottomColor) && savedSoftSky.accentColor === undefined)
    softSky.accentColor = savedSoftSky.bottomColor
  if (typeof savedSoftSky.glowColor === "string" && /^#[\da-f]{6}$/i.test(savedSoftSky.glowColor) && savedSoftSky.warmColor === undefined)
    softSky.warmColor = savedSoftSky.glowColor
  if (typeof savedSoftSky.sparkleOpacity === "number" && Number.isFinite(savedSoftSky.sparkleOpacity) && savedSoftSky.particleOpacity === undefined)
    softSky.particleOpacity = Math.min(1, Math.max(0, savedSoftSky.sparkleOpacity))
  const savedLiquid = record(record(input.backgrounds).liquid)
  if (
    typeof savedLiquid.color1 === "string" &&
    typeof savedLiquid.color3 === "string" &&
    savedLiquid.color1.toLowerCase() === "#050505" &&
    savedLiquid.color3.toLowerCase() === "#050505"
  ) {
    next.backgrounds.liquid.color1 = "#000000"
    next.backgrounds.liquid.color3 = "#000000"
    if (savedLiquid.blendMode === "screen") next.backgrounds.liquid.blendMode = "hard-light"
  }
  return next
}
export function loadHeroConfig(): HeroConfig {
  try {
    return normalizeHeroConfig(JSON.parse(localStorage.getItem(HERO_STORAGE_KEY) || "null"))
  } catch {
    return structuredClone(DEFAULT_HERO_CONFIG)
  }
}
