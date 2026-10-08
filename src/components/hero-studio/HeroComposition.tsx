import AiLiquidBackground from "@/registry/creght/background/ai-liquid-background/ai-liquid-background"
import CundaHeroBackground from "@/registry/creght/background/cunda-hero-background/cunda-hero-background"
import NeuroNoise from "@/registry/creght/background/neuro-noise/neuro-noise"
import { CargoLiquidBackground } from "./CargoLiquidBackground"
import { GlassRibbonBackground } from "./GlassRibbonBackground"
import { SoftSkyBackground } from "./SoftSkyBackground"
import { HeroForeground } from "./HeroForeground"
import { ArcFlowBackground } from "@/registry/creght/hero/hero-sphere-ai/ArcFlowBackground"
import { HeroSphereAI } from "@/registry/creght/hero/hero-sphere-ai/hero-sphere-ai"
import type { HeroConfig } from "@/src/lib/hero-studio-config"
import "./hero-composition.css"

export function HeroComposition({ config }: { config: HeroConfig }) {
  return (
    <section
      className={`hs-hero hs-${config.appearance}`}
      style={
        config.backgroundId === "liquid"
          ? { backgroundColor: "#000" }
          : config.backgroundId === "cargoLiquid"
            ? { backgroundColor: config.backgrounds.cargoLiquid.color1 }
            : config.backgroundId === "glassRibbon"
              ? { backgroundColor: config.backgrounds.glassRibbon.skyColor }
              : config.backgroundId === "softSky"
                ? { backgroundColor: config.backgrounds.softSky.topColor }
            : undefined
      }
    >
      {config.backgroundId === "cunda" && (
        <CundaHeroBackground {...config.backgrounds.cunda} className="hs-background" />
      )}
      {config.backgroundId === "liquid" && (
        <AiLiquidBackground {...config.backgrounds.liquid} className="hs-background" />
      )}
      {config.backgroundId === "cargoLiquid" && (
        <CargoLiquidBackground {...config.backgrounds.cargoLiquid} className="hs-background" />
      )}
      {config.backgroundId === "glassRibbon" && (
        <GlassRibbonBackground {...config.backgrounds.glassRibbon} className="hs-background" />
      )}
      {config.backgroundId === "softSky" && (
        <SoftSkyBackground {...config.backgrounds.softSky} className="hs-background" />
      )}
      {config.backgroundId === "neuro" && (
        <NeuroNoise {...config.backgrounds.neuro} className="hs-background" />
      )}
      {config.backgroundId === "arcFlow" && (
        <ArcFlowBackground {...config.backgrounds.arcFlow} className="hs-background" />
      )}
      <div
        className="hs-overlay"
        style={{
          opacity: config.overlays[config.backgroundId],
          backgroundColor:
            config.appearance === "light"
              ? "#ffffff"
              : config.backgroundId === "liquid" || config.backgroundId === "cargoLiquid"
              ? "#000"
              : undefined,
        }}
      />
      {config.layoutId === "sphere-ai" ? (
        <HeroSphereAI
          className="hs-sphere-layout"
          renderBackground={false}
          brandName={config.sphereContent.brandName}
          content={config.sphereContent}
        />
      ) : (
        <HeroForeground layoutId={config.layoutId} content={config.content} appearance={config.appearance} />
      )}
    </section>
  )
}
