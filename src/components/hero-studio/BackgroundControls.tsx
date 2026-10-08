import { RotateCcw, SlidersHorizontal } from "lucide-react"
import {
  BACKGROUND_CONTROLS,
  type BackgroundControl,
  type BackgroundId,
  type HeroConfig,
} from "@/src/lib/hero-studio-config"

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  const decimals = step < 0.1 ? 2 : step < 1 ? 1 : 0
  return (
    <label className="studio-range">
      <span>
        <span>{label}</span>
        <output>{value.toFixed(decimals)}</output>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, #9bb9fa ${((value - min) / (max - min)) * 100}%, #303744 0%)`,
        }}
      />
    </label>
  )
}

function Parameter({
  control,
  value,
  onChange,
}: {
  control: BackgroundControl
  value: number | string | boolean
  onChange: (value: number | string | boolean) => void
}) {
  if (control.type === "range")
    return (
      <RangeField
        label={control.label}
        value={value as number}
        min={control.min!}
        max={control.max!}
        step={control.step!}
        onChange={onChange}
      />
    )
  if (control.type === "color")
    return (
      <label className="studio-color">
        <span>{control.label}</span>
        <span className="studio-color-input">
          <input
            aria-label={control.label}
            type="color"
            value={value as string}
            onChange={(event) => onChange(event.target.value)}
          />
          <span>{String(value).toUpperCase()}</span>
        </span>
      </label>
    )
  if (control.type === "boolean")
    return (
      <label className="studio-toggle">
        <span>{control.label}</span>
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="studio-switch" aria-hidden="true" />
      </label>
    )
  return (
    <label className="studio-select">
      <span>{control.label}</span>
      <select
        aria-label={control.label}
        value={value as string}
        onChange={(event) => onChange(event.target.value)}
      >
        {control.options!.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function BackgroundControls({
  id,
  config,
  onChange,
  onReset,
}: {
  id: BackgroundId
  config: HeroConfig
  onChange: (key: string, value: number | string | boolean) => void
  onReset: () => void
}) {
  const values = config.backgrounds[id] as unknown as Record<string, number | string | boolean>
  const renderControl = (control: BackgroundControl) => (
    <Parameter
      key={control.key}
      control={control}
      value={values[control.key]}
      onChange={(value) => onChange(control.key, value)}
    />
  )
  return (
    <section className="studio-parameters" aria-label="背景参数">
      <div className="studio-section-heading">
        <span>
          <SlidersHorizontal size={13} />
          效果参数
        </span>
        <button type="button" className="studio-text-button" onClick={onReset}>
          <RotateCcw size={12} />
          重置参数
        </button>
      </div>
      <div className="studio-control-list">
        {BACKGROUND_CONTROLS[id].filter((control) => !control.advanced).map(renderControl)}
      </div>
      <details className="studio-advanced">
        <summary>更多参数</summary>
        <div className="studio-control-list">
          {BACKGROUND_CONTROLS[id].filter((control) => control.advanced).map(renderControl)}
        </div>
      </details>
    </section>
  )
}
