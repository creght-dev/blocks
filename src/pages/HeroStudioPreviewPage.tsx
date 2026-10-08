import { useEffect, useState } from "react"
import { HeroComposition } from "@/src/components/hero-studio/HeroComposition"
import { HERO_LAYOUTS, loadHeroConfig, normalizeHeroConfig } from "@/src/lib/hero-studio-config"

function loadPreviewConfig() {
  const config = loadHeroConfig()
  const requestedLayout = new URLSearchParams(window.location.search).get("layout")
  const layout = HERO_LAYOUTS.find((item) => item.id === requestedLayout)
  return layout ? { ...config, layoutId: layout.id } : config
}

export function HeroStudioPreviewPage() {
  const [config, setConfig] = useState(loadPreviewConfig)
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== window.location.origin ||
        event.data?.type !== "hero-studio:update"
      )
        return
      setConfig(normalizeHeroConfig(event.data.config))
    }
    window.addEventListener("message", receive)
    window.parent.postMessage({ type: "hero-studio:ready" }, window.location.origin)
    return () => {
      window.removeEventListener("message", receive)
    }
  }, [])
  useEffect(() => {
    document.documentElement.style.colorScheme = config.appearance
  }, [config.appearance])
  return <HeroComposition config={config} />
}
