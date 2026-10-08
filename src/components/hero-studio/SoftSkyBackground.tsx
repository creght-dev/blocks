import ParticleBackground from "./ParticleBackground"

export type SoftSkySettings = {
  topColor: string
  warmColor: string
  accentColor: string
  lightColor: string
  particleCount: number
  particleSize: number
  particleOpacity: number
  speed: number
  rayCount: number
  rayOpacity: number
  rayWidth: number
  rayGlow: number
  glowIntensity: number
  topFade: number
  focusX: number
  focusY: number
  animated: boolean
  seed: number
}

// Match the Replyo homepage hero's palette, rays, particles, and motion.
export const SOFT_SKY_DEFAULTS: SoftSkySettings = {
  topColor: "#fffefd",
  warmColor: "#ffcea0",
  accentColor: "#f4936e",
  lightColor: "#ffffff",
  particleCount: 150,
  particleSize: 2.3,
  particleOpacity: 0.95,
  speed: 0.45,
  rayCount: 8,
  rayOpacity: 0.9,
  rayWidth: 1.4,
  rayGlow: 0.5,
  glowIntensity: 0.45,
  topFade: 0.2,
  focusX: 0.5,
  focusY: 0.96,
  animated: true,
  seed: 42,
}

export function SoftSkyBackground({
  className = "",
  ...options
}: Partial<SoftSkySettings> & { className?: string }) {
  const settings = { ...SOFT_SKY_DEFAULTS, ...options }
  return (
    <ParticleBackground
      colors={[settings.topColor, settings.warmColor, settings.accentColor, settings.lightColor]}
      particleCount={settings.particleCount}
      particleSize={settings.particleSize}
      particleOpacity={settings.particleOpacity}
      speed={settings.speed}
      rayCount={settings.rayCount}
      rayOpacity={settings.rayOpacity}
      rayWidth={settings.rayWidth}
      rayGlow={settings.rayGlow}
      glowIntensity={settings.glowIntensity}
      topFade={settings.topFade}
      focusX={settings.focusX}
      focusY={settings.focusY}
      animated={settings.animated}
      seed={settings.seed}
      className={className}
    />
  )
}
