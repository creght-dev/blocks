import { useState } from "react"
import { RotateCcw, Settings2, X } from "lucide-react"

import { SphereWall } from "@/registry/creght/effects/sphere-wall/sphere-wall"

const DEFAULT_CONFIG = {
  backgroundColor: "#101014",
  cardAspect: 1,
  columnGap: 2,
  columns: 5,
  cornerRadius: 0.5,
  dragEnabled: true,
  duration: 20,
  gap: 2,
  padding: 13,
  rows: 5,
  wheelEnabled: true,
}

type SphereWallPreviewConfig = typeof DEFAULT_CONFIG

type RangeControlProps = {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step?: number
  suffix?: string
  value: number
}

function RangeControl({
  label,
  max,
  min,
  onChange,
  step = 1,
  suffix = "",
  value,
}: RangeControlProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-4 text-xs text-zinc-300">
        <span>{label}</span>
        <span className="font-mono text-zinc-100">
          {value}
          {suffix}
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

type ToggleControlProps = {
  label: string
  onChange: () => void
  value: boolean
}

function ToggleControl({ label, onChange, value }: ToggleControlProps) {
  return (
    <button
      aria-pressed={value}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10"
      onClick={onChange}
      type="button"
    >
      <span className="text-xs text-zinc-200">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          value ? "bg-indigo-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  )
}

const ASPECT_OPTIONS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
]

export function SphereWallPreview() {
  const [config, setConfig] = useState<SphereWallPreviewConfig>(DEFAULT_CONFIG)
  const [panelOpen, setPanelOpen] = useState(true)

  const updateConfig = <Key extends keyof SphereWallPreviewConfig>(
    key: Key,
    value: SphereWallPreviewConfig[Key],
  ) => {
    setConfig((current) => ({ ...current, [key]: value }))
  }

  return (
    <main className="relative h-dvh min-h-[560px] overflow-hidden bg-zinc-950">
      <SphereWall {...config} />

      {panelOpen ? (
        <aside className="absolute right-4 top-4 z-30 max-h-[calc(100dvh-2rem)] w-[min(340px,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/88 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                <Settings2 className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-sm font-semibold">Sphere Wall</h1>
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
            <section className="space-y-4" aria-labelledby="sphere-layout-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="sphere-layout-settings"
              >
                布局
              </h2>
              <RangeControl
                label="电脑端列数"
                max={10}
                min={3}
                onChange={(value) => updateConfig("columns", value)}
                value={config.columns}
              />
              <RangeControl
                label="移动端基准行数"
                max={8}
                min={2}
                onChange={(value) => updateConfig("rows", value)}
                value={config.rows}
              />
              <RangeControl
                label="水平间隔"
                max={8}
                min={0}
                onChange={(value) => updateConfig("columnGap", value)}
                suffix="%"
                value={config.columnGap}
              />
              <RangeControl
                label="垂直间隔"
                max={8}
                min={0}
                onChange={(value) => updateConfig("gap", value)}
                suffix="%"
                value={config.gap}
              />
              <RangeControl
                label="圆角"
                max={8}
                min={0}
                onChange={(value) => updateConfig("cornerRadius", value)}
                step={0.5}
                suffix="%"
                value={config.cornerRadius}
              />
              <div className="space-y-2">
                <p className="text-xs text-zinc-300">图片比例</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ASPECT_OPTIONS.map((option) => {
                    const active = config.cardAspect === option.value
                    return (
                      <button
                        key={option.label}
                        aria-pressed={active}
                        className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                        }`}
                        onClick={() => updateConfig("cardAspect", option.value)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <RangeControl
                label="上下预留"
                max={30}
                min={0}
                onChange={(value) => updateConfig("padding", value)}
                suffix="%"
                value={config.padding}
              />
            </section>

            <section className="space-y-4 border-t border-white/10 pt-5" aria-labelledby="sphere-motion-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="sphere-motion-settings"
              >
                动画与交互
              </h2>
              <RangeControl
                label="旋转周期"
                max={60}
                min={6}
                onChange={(value) => updateConfig("duration", value)}
                suffix="秒"
                value={config.duration}
              />
              <ToggleControl
                label="拖拽交互"
                onChange={() => updateConfig("dragEnabled", !config.dragEnabled)}
                value={config.dragEnabled}
              />
              <ToggleControl
                label="滚轮交互"
                onChange={() => updateConfig("wheelEnabled", !config.wheelEnabled)}
                value={config.wheelEnabled}
              />
            </section>

            <section className="space-y-3 border-t border-white/10 pt-5" aria-labelledby="sphere-appearance-settings">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                id="sphere-appearance-settings"
              >
                外观
              </h2>
              <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <span className="text-xs text-zinc-200">背景颜色</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase text-zinc-400">
                    {config.backgroundColor}
                  </span>
                  <input
                    aria-label="背景颜色"
                    className="size-7 cursor-pointer rounded border-0 bg-transparent p-0"
                    onInput={(event) => updateConfig("backgroundColor", event.currentTarget.value)}
                    type="color"
                    value={config.backgroundColor}
                  />
                </span>
              </label>
            </section>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
              onClick={() => setConfig(DEFAULT_CONFIG)}
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
