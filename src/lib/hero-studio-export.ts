import foregroundSource from "@/src/components/hero-studio/HeroForeground.tsx?raw"
import dashboardSource from "@/registry/creght/hero/hero-cunda/DashboardPreview.tsx?raw"
import lightDashboardSource from "@/src/components/hero-studio/LightDashboardPreview.tsx?raw"
import cundaSource from "@/registry/creght/background/cunda-hero-background/cunda-hero-background.tsx?raw"
import sideRaysSource from "@/registry/creght/background/cunda-hero-background/SideRays.tsx?raw"
import liquidSource from "@/registry/creght/background/ai-liquid-background/ai-liquid-background.tsx?raw"
import cargoLiquidSource from "@/src/components/hero-studio/CargoLiquidBackground.tsx?raw"
import glassRibbonSource from "@/src/components/hero-studio/GlassRibbonBackground.tsx?raw"
import particleBackgroundSource from "@/src/components/hero-studio/ParticleBackground.tsx?raw"
import softSkySource from "@/src/components/hero-studio/SoftSkyBackground.tsx?raw"
import neuroSource from "@/registry/creght/background/neuro-noise/neuro-noise.tsx?raw"
import arcFlowSource from "@/registry/creght/hero/hero-sphere-ai/ArcFlowBackground.tsx?raw"
import arcFlowShaderSource from "@/registry/creght/hero/hero-sphere-ai/arc-flow-shaders.ts?raw"
import sphereSource from "@/registry/creght/hero/hero-sphere-ai/hero-sphere-ai.tsx?raw"
import sphereOrbSource from "@/registry/creght/hero/hero-sphere-ai/orb-asset.ts?raw"
import sphereStyles from "@/registry/creght/hero/hero-sphere-ai/hero-sphere-ai.css?raw"
import compositionStyles from "@/src/components/hero-studio/hero-composition.css?raw"
import { normalizeHeroConfig, type HeroConfig } from "./hero-studio-config"

function withoutImports(source: string) {
  return source
    .replace(/^import\s+[\s\S]*?\sfrom\s*["'][^"']+["'];?\s*$/gm, "")
    .replace(/^import\s*["'][^"']+["'];?\s*$/gm, "")
    .replace(/^export default (\w+);?\s*$/gm, "")
    .replace(/export default function /g, "function ")
    .trim()
}

export function buildHeroSource(input: HeroConfig): string {
  const config = normalizeHeroConfig(input)
  const baseColor =
    config.backgroundId === "liquid"
      ? "#000000"
      : config.backgroundId === "cargoLiquid"
        ? config.backgrounds.cargoLiquid.color1
        : config.backgroundId === "glassRibbon"
          ? config.backgrounds.glassRibbon.skyColor
          : config.backgroundId === "softSky"
            ? config.backgrounds.softSky.topColor
          : config.backgroundId === "arcFlow"
            ? config.backgrounds.arcFlow.top
        : "#040506"
  const overlayColor =
    config.appearance === "light"
      ? "#ffffff"
      : config.backgroundId === "liquid" || config.backgroundId === "cargoLiquid"
      ? "#000000"
      : baseColor
  const backgroundName = {
    cunda: "CundaHeroBackground",
    liquid: "AiLiquidBackground",
    cargoLiquid: "CargoLiquidBackground",
    glassRibbon: "GlassRibbonBackground",
    softSky: "SoftSkyBackground",
    neuro: "NeuroNoise",
    arcFlow: "ArcFlowBackground",
  }[config.backgroundId]
  const backgroundSources = {
    cunda: [sideRaysSource, cundaSource],
    liquid: [liquidSource],
    cargoLiquid: [cargoLiquidSource],
    glassRibbon: [glassRibbonSource],
    softSky: [particleBackgroundSource, softSkySource],
    neuro: [neuroSource],
    arcFlow: [arcFlowShaderSource, arcFlowSource],
  }[config.backgroundId]
  const sphereLayout = config.layoutId === "sphere-ai"
  const sources = [
    ...backgroundSources,
    ...(sphereLayout && config.backgroundId !== "arcFlow" ? [arcFlowShaderSource, arcFlowSource] : []),
    dashboardSource,
    lightDashboardSource,
    foregroundSource,
    ...(sphereLayout ? [sphereOrbSource, sphereSource] : []),
  ]
  // Collect the actual named imports so each generated component stays self-contained.
  const reactNames = new Set<string>()
  const iconNames = new Set<string>()
  for (const source of sources) {
    for (const match of source.matchAll(
      /import\s*\{([^}]+)\}\s*from\s*["'](react|lucide-react)["']/g,
    )) {
      for (const name of match[1]
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)) {
        ;(match[2] === "react" ? reactNames : iconNames).add(name)
      }
    }
  }
  return `"use client"\n\n// Generated with Creght Hero Studio.\n// React + Tailwind CSS v4 required (keep this file in your Tailwind source tree).\n// Install: npm install lucide-react${config.backgroundId === "cunda" ? " ogl" : ""}\n// Background and layout source are included; no private/local component imports.\n${config.backgroundId === "liquid" ? "// AI Liquid uses the existing Creght CDN animation runtime.\n" : ""}\nimport { ${[...reactNames].sort().join(", ")} } from "react"\nimport { ${[...iconNames].sort().join(", ")} } from "lucide-react"\n${config.backgroundId === "cunda" ? 'import { Renderer, Program, Triangle, Mesh } from "ogl"\n' : ""}\n${sources.map(withoutImports).join("\n\n")}\n\nconst heroStyles = ${JSON.stringify(compositionStyles + (sphereLayout ? "\n" + sphereStyles : ""))}\nconst heroContent = ${JSON.stringify(sphereLayout ? config.sphereContent : config.content, null, 2)}\nconst backgroundSettings = ${JSON.stringify(config.backgrounds[config.backgroundId], null, 2)} as const\n\nexport default function GeneratedHero() {\n  return (\n    <section className="hs-hero hs-${config.appearance}" style={{ backgroundColor: "${baseColor}" }}>\n      <style>{heroStyles}</style>\n      <${backgroundName} {...backgroundSettings} className="hs-background" />\n      <div className="hs-overlay" style={{ opacity: ${config.overlays[config.backgroundId]}, backgroundColor: "${overlayColor}" }} />\n      ${sphereLayout ? '<HeroSphereAI className="hs-sphere-layout" renderBackground={false} brandName={heroContent.brandName} content={heroContent} />' : `<HeroForeground layoutId=${JSON.stringify(config.layoutId)} content={heroContent} appearance=${JSON.stringify(config.appearance)} />`}\n    </section>\n  )\n}\n`
}

export async function copyHeroText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      /* Use selection fallback. */
    }
  }
  const previous = document.activeElement as HTMLElement | null
  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.style.cssText = "position:fixed;left:-9999px;top:0"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  previous?.focus()
  if (!copied) throw new Error("Clipboard unavailable")
}

export function downloadHeroSource(source: string) {
  const url = URL.createObjectURL(new Blob([source], { type: "text/plain;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "GeneratedHero.tsx"
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
