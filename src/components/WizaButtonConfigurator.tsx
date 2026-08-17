import { useState } from "react"
import { RotateCcw, Settings2, X } from "lucide-react"

import {
  WizaButton,
  type WizaButtonTone,
} from "@/registry/creght/button/button-wiza/button-wiza"

const DEFAULTS = {
  glowIntensity: 1,
  particleCount: 26,
  particleSpeed: 1,
  tone: "violet" as WizaButtonTone,
}

type RangeControlProps = {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  value: number
}

function RangeControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: RangeControlProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-4 text-xs text-zinc-300">
        <span>{label}</span>
        <span className="font-mono text-zinc-100">
          {step < 1 ? value.toFixed(1) : value}
        </span>
      </span>
      <input
        aria-label={label}
        className="block h-1.5 w-full cursor-pointer accent-indigo-400"
        max={max}
        min={min}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  )
}

const TONE_OPTIONS: Array<{
  label: string
  value: WizaButtonTone
}> = [
  { label: "紫色", value: "violet" },
  { label: "中性", value: "neutral" },
]

export function WizaButtonConfigurator() {
  const [tone, setTone] = useState<WizaButtonTone>(DEFAULTS.tone)
  const [particleCount, setParticleCount] = useState(DEFAULTS.particleCount)
  const [particleSpeed, setParticleSpeed] = useState(DEFAULTS.particleSpeed)
  const [glowIntensity, setGlowIntensity] = useState(DEFAULTS.glowIntensity)
  const [panelOpen, setPanelOpen] = useState(true)
  const coverMode = new URLSearchParams(window.location.search).has("cover")

  const reset = () => {
    setTone(DEFAULTS.tone)
    setParticleCount(DEFAULTS.particleCount)
    setParticleSpeed(DEFAULTS.particleSpeed)
    setGlowIntensity(DEFAULTS.glowIntensity)
  }

  if (coverMode) {
    return (
      <main className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,67,224,0.08),transparent_34%)]" />
        <WizaButton
          className="[zoom:3]"
          glowIntensity={glowIntensity}
          particleCount={particleCount}
          particleSpeed={particleSpeed}
          tone={tone}
        />
      </main>
    )
  }

  return (
    <main className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden bg-black p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,67,224,0.08),transparent_34%)]" />
      <WizaButton
        glowIntensity={glowIntensity}
        particleCount={particleCount}
        particleSpeed={particleSpeed}
        tone={tone}
      />

      {panelOpen ? (
        <aside
          className="absolute right-4 top-4 z-30 max-h-[calc(100dvh-2rem)] w-[min(340px,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/88 text-white shadow-2xl shadow-black/40 backdrop-blur-xl"
          data-testid="wiza-config-panel"
        >
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                <Settings2 className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-sm font-semibold">Wiza Button</h1>
                <p className="text-[11px] text-zinc-400">实时配置预览</p>
              </div>
            </div>
            <button
              aria-label="收起配置面板"
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
              onClick={() => setPanelOpen(false)}
              type="button"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div className="space-y-5 p-4">
            <section className="space-y-4" aria-labelledby="wiza-appearance-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="wiza-appearance-settings"
              >
                外观
              </h2>
              <div className="space-y-2">
                <p className="text-xs text-zinc-300">色调</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {TONE_OPTIONS.map((option) => {
                    const active = tone === option.value
                    return (
                      <button
                        aria-pressed={active}
                        className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                        }`}
                        key={option.value}
                        onClick={() => setTone(option.value)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-5" aria-labelledby="wiza-particle-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="wiza-particle-settings"
              >
                粒子
              </h2>
              <RangeControl
                label="粒子数量"
                max={80}
                min={8}
                onChange={setParticleCount}
                step={1}
                value={particleCount}
              />
              <RangeControl
                label="粒子速度"
                max={4}
                min={0}
                onChange={setParticleSpeed}
                step={0.1}
                value={particleSpeed}
              />
            </section>

            <section className="space-y-4 border-t border-white/10 pt-5" aria-labelledby="wiza-glow-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="wiza-glow-settings"
              >
                光效
              </h2>
              <RangeControl
                label="光晕强度"
                max={2}
                min={0}
                onChange={setGlowIntensity}
                step={0.1}
                value={glowIntensity}
              />
            </section>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
              onClick={reset}
              type="button"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              恢复默认配置
            </button>

            <p className="text-center text-[10px] leading-relaxed text-zinc-600">
              此面板仅用于预览，不会随 npm 包发布
            </p>
          </div>
        </aside>
      ) : (
        <button
          className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-xl transition hover:bg-zinc-900"
          onClick={() => setPanelOpen(true)}
          type="button"
        >
          <Settings2 className="size-4" aria-hidden="true" />
          配置
        </button>
      )}
    </main>
  )
}
