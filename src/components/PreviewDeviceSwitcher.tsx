import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, MonitorSmartphone, Smartphone, Tablet } from "lucide-react"

export type PreviewDevice = "desktop" | "tablet" | "mobile"

const DEVICE_OPTIONS: {
  value: PreviewDevice
  label: string
  icon: typeof MonitorSmartphone
}[] = [
  { value: "desktop", label: "Desktop", icon: MonitorSmartphone },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
]

export const PREVIEW_DEVICE_WIDTH: Record<PreviewDevice, string | null> = {
  desktop: null,
  mobile: "390px",
  tablet: "768px",
}

type PreviewDeviceSwitcherProps = {
  value: PreviewDevice
  onChange: (device: PreviewDevice) => void
}

export function PreviewDeviceSwitcher({ value, onChange }: PreviewDeviceSwitcherProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const active = DEVICE_OPTIONS.find((option) => option.value === value) ?? DEVICE_OPTIONS[0]
  const ActiveIcon = active.icon
  const Chevron = open ? ChevronUp : ChevronDown

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative justify-self-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
      >
        <ActiveIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Device</span>
        <Chevron className="h-4 w-4 shrink-0 text-zinc-300" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Preview device"
          className="absolute left-0 top-[calc(100%+6px)] z-20 min-w-full overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 p-1.5 shadow-xl"
        >
          {DEVICE_OPTIONS.map((option) => {
            const Icon = option.icon
            const isActive = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${
                  isActive ? "bg-zinc-800 text-white" : "text-zinc-200 hover:bg-zinc-800/70"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
