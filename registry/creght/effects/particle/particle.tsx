import {
  ParticleCanvas,
  type NeuralParticleMorphEffect,
  type NeuralParticleMorphShape,
  type ParticleColorMode,
} from "./ParticleCanvas"

export type ParticleProps = {
  className?: string
  config?: Partial<ParticleEffectConfig>
}

export type ParticleEffectConfig = {
  effect: NeuralParticleMorphEffect
  shape: NeuralParticleMorphShape
  particleCount: number
  particleSize: number
  canvasBackgroundColor: string
  particleColorMode: ParticleColorMode
  particleCustomColor: string
  imageUrl: string | null
  modelUrl: string | null
  interactionMode: "auto" | "manual"
  manualControlTarget: "camera" | "object"
}

export const DEFAULT_PARTICLE_EFFECT_CONFIG: ParticleEffectConfig = {
  effect: "pulse",
  shape: "sphere",
  particleCount: 90000,
  particleSize: 180,
  canvasBackgroundColor: "#000000",
  particleColorMode: "original",
  particleCustomColor: "#22c55e",
  imageUrl: null,
  modelUrl: null,
  interactionMode: "auto",
  manualControlTarget: "camera",
}

const PARTICLE_COUNT_LIMITS = {
  min: 1000,
  max: 150000,
}

const PARTICLE_SIZE_LIMITS = {
  min: 20,
  max: 500,
}

const PARTICLE_EFFECTS = [
  "default",
  "scatter",
  "explode",
  "vortex",
  "pulse",
  "wave",
] satisfies NeuralParticleMorphEffect[]

const PARTICLE_SHAPES = [
  "default",
  "heart",
  "butterfly",
  "rose",
  "cube",
  "pyramid",
  "spiral",
  "star",
  "sphere",
  "dna",
  "infinity",
] satisfies NeuralParticleMorphShape[]

const PARTICLE_COLOR_MODES = ["original", "custom"] satisfies ParticleColorMode[]
const INTERACTION_MODES = ["auto", "manual"] as const
const MANUAL_CONTROL_TARGETS = ["camera", "object"] as const

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

function resolveOption<T extends string>(
  value: T | undefined,
  fallback: T,
  allowed: readonly T[],
) {
  return value && allowed.includes(value) ? value : fallback
}

function resolveHexColor(value: string | undefined, fallback: string) {
  if (!value) return fallback
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

function resolveNullableUrl(value: string | null | undefined) {
  if (!value) return null
  return value
}

export function resolveParticleEffectConfig(
  config: Partial<ParticleEffectConfig> = {},
): ParticleEffectConfig {
  return {
    ...DEFAULT_PARTICLE_EFFECT_CONFIG,
    ...config,
    effect: resolveOption(
      config.effect,
      DEFAULT_PARTICLE_EFFECT_CONFIG.effect,
      PARTICLE_EFFECTS,
    ),
    shape: resolveOption(
      config.shape,
      DEFAULT_PARTICLE_EFFECT_CONFIG.shape,
      PARTICLE_SHAPES,
    ),
    particleCount: Math.round(
      clampNumber(
        config.particleCount ?? DEFAULT_PARTICLE_EFFECT_CONFIG.particleCount,
        PARTICLE_COUNT_LIMITS.min,
        PARTICLE_COUNT_LIMITS.max,
      ),
    ),
    particleSize: clampNumber(
      config.particleSize ?? DEFAULT_PARTICLE_EFFECT_CONFIG.particleSize,
      PARTICLE_SIZE_LIMITS.min,
      PARTICLE_SIZE_LIMITS.max,
    ),
    canvasBackgroundColor: resolveHexColor(
      config.canvasBackgroundColor,
      DEFAULT_PARTICLE_EFFECT_CONFIG.canvasBackgroundColor,
    ),
    particleCustomColor: resolveHexColor(
      config.particleCustomColor,
      DEFAULT_PARTICLE_EFFECT_CONFIG.particleCustomColor,
    ),
    particleColorMode: resolveOption(
      config.particleColorMode,
      DEFAULT_PARTICLE_EFFECT_CONFIG.particleColorMode,
      PARTICLE_COLOR_MODES,
    ),
    imageUrl: resolveNullableUrl(config.imageUrl),
    modelUrl: resolveNullableUrl(config.modelUrl),
    interactionMode: resolveOption(
      config.interactionMode,
      DEFAULT_PARTICLE_EFFECT_CONFIG.interactionMode,
      INTERACTION_MODES,
    ),
    manualControlTarget: resolveOption(
      config.manualControlTarget,
      DEFAULT_PARTICLE_EFFECT_CONFIG.manualControlTarget,
      MANUAL_CONTROL_TARGETS,
    ),
  }
}

export function Particle({ className = "", config }: ParticleProps) {
  const resolvedConfig = resolveParticleEffectConfig(config)

  return (
    <section
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ backgroundColor: resolvedConfig.canvasBackgroundColor }}
    >
      <ParticleCanvas
        effect={resolvedConfig.effect}
        shape={resolvedConfig.shape}
        imageUrl={resolvedConfig.imageUrl}
        modelUrl={resolvedConfig.modelUrl}
        particleCount={resolvedConfig.particleCount}
        particleSize={resolvedConfig.particleSize}
        canvasBackgroundColor={resolvedConfig.canvasBackgroundColor}
        particleColorMode={resolvedConfig.particleColorMode}
        particleCustomColor={resolvedConfig.particleCustomColor}
        interactionMode={resolvedConfig.interactionMode}
        manualControlTarget={resolvedConfig.manualControlTarget}
        listenForKeyboardToggle={false}
        pauseAnimationWhenHidden
        className="absolute inset-0 h-full w-full"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </section>
  )
}

export default Particle
