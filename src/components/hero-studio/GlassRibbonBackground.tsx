import { useId } from "react"

export type GlassRibbonSettings = {
  skyColor: string
  mistColor: string
  glassColor: string
  deepColor: string
  warmColor: string
  warmIntensity: number
  curveHeight: number
  bandIntensity: number
  softness: number
  motionSpeed: number
}

export const GLASS_RIBBON_DEFAULTS: GlassRibbonSettings = {
  skyColor: "#4a95d2",
  mistColor: "#dce5e6",
  glassColor: "#b8e2d5",
  deepColor: "#1c57c5",
  warmColor: "#f4e5a7",
  warmIntensity: 0.9,
  curveHeight: 50,
  bandIntensity: 0.85,
  softness: 65,
  motionSpeed: 0,
}

function RibbonArtwork({
  settings,
  mobile,
  id,
}: {
  settings: GlassRibbonSettings
  mobile: boolean
  id: string
}) {
  const lift = (settings.curveHeight - 50) * (mobile ? 1.2 : 1.6)
  const edge = mobile
    ? `M 20 844 C 95 ${676 - lift * 0.4} 188 ${418 - lift} 390 ${255 - lift}`
    : `M 205 860 C 415 ${683 - lift * 0.4} 596 ${427 - lift} 805 ${310 - lift} C 963 ${223 - lift} 1093 ${201 - lift} 1200 ${189 - lift}`
  const surface = `${edge} L ${mobile ? "390 844" : "1200 860"} Z`
  const suffix = mobile ? "mobile" : "desktop"
  const key = (name: string) => `${id}-${suffix}-${name}`
  const url = (name: string) => `url(#${key(name)})`
  const blur = 13 + settings.softness * 0.35
  const viewBox = mobile ? "0 0 390 844" : "0 0 1200 860"

  return (
    <svg
      className={mobile ? "hs-ribbon-mobile" : "hs-ribbon-desktop"}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={key("sky")} x1="0" y1="0" x2="0.08" y2="1">
          <stop stopColor={settings.skyColor} />
          <stop offset="0.5" stopColor={settings.mistColor} />
          <stop offset="1" stopColor={settings.deepColor} />
        </linearGradient>
        <radialGradient id={key("warm")}>
          <stop stopColor={settings.warmColor} stopOpacity="1" />
          <stop offset="0.48" stopColor={settings.warmColor} stopOpacity="0.72" />
          <stop offset="1" stopColor={settings.warmColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={key("low-blue")}>
          <stop stopColor={settings.deepColor} stopOpacity="0.96" />
          <stop offset="1" stopColor={settings.deepColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={key("surface")} x1="0" y1="0" x2="0.22" y2="1">
          <stop stopColor={settings.glassColor} stopOpacity="0.78" />
          <stop offset="0.34" stopColor="#6fa7c3" stopOpacity="0.82" />
          <stop offset="0.74" stopColor={settings.deepColor} stopOpacity="0.96" />
          <stop offset="1" stopColor="#103e9f" />
        </linearGradient>
        <linearGradient id={key("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor={settings.glassColor} stopOpacity="0" />
          <stop offset="0.34" stopColor={settings.glassColor} stopOpacity="0.45" />
          <stop offset="0.72" stopColor="#b8f2d2" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e1fff0" stopOpacity="0.18" />
        </linearGradient>
        <filter id={key("soft-blur")} x="-50%" y="-70%" width="200%" height="240%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
        <filter id={key("fine-blur")} x="-40%" y="-50%" width="180%" height="200%">
          <feGaussianBlur stdDeviation={blur * 0.42} />
        </filter>
        <clipPath id={key("surface-clip")}>
          <path d={surface} />
        </clipPath>
      </defs>

      <rect width="100%" height="100%" fill={url("sky")} />
      <ellipse
        cx={mobile ? "-25" : "175"}
        cy={mobile ? "710" : "605"}
        rx={mobile ? "300" : "510"}
        ry={mobile ? "300" : "325"}
        fill={url("warm")}
        opacity={settings.warmIntensity}
      />
      <ellipse
        cx={mobile ? "-45" : "150"}
        cy={mobile ? "875" : "915"}
        rx={mobile ? "370" : "640"}
        ry={mobile ? "170" : "200"}
        fill={url("low-blue")}
        opacity="0.9"
      />

      <path d={surface} fill={url("surface")} />
      <g clipPath={url("surface-clip")} opacity={settings.bandIntensity}>
        <g
          className="hs-ribbon-light-bands"
          style={{
            animationDuration: settings.motionSpeed ? `${36 / settings.motionSpeed}s` : undefined,
            animationPlayState: settings.motionSpeed ? "running" : "paused",
          }}
        >
          {mobile ? (
            <>
              <path d="M -40 855 C 86 690 225 415 490 322" stroke={url("sheen")} strokeWidth="88" fill="none" filter={url("soft-blur")} />
              <path d="M -50 960 C 80 747 247 506 490 470" stroke={settings.glassColor} strokeWidth="105" opacity="0.64" fill="none" filter={url("soft-blur")} />
              <path d="M -60 1030 C 107 819 282 685 500 607" stroke={settings.deepColor} strokeWidth="125" opacity="0.82" fill="none" filter={url("soft-blur")} />
              <path d="M 0 905 C 162 733 283 568 500 518" stroke={settings.glassColor} strokeWidth="34" opacity="0.5" fill="none" filter={url("fine-blur")} />
            </>
          ) : (
            <>
              <path d="M 350 980 C 641 600 966 324 1320 285" stroke={url("sheen")} strokeWidth="120" fill="none" filter={url("soft-blur")} />
              <path d="M 280 975 C 618 699 947 463 1320 406" stroke={settings.glassColor} strokeWidth="135" opacity="0.6" fill="none" filter={url("soft-blur")} />
              <path d="M 280 1030 C 667 804 940 588 1330 536" stroke={settings.deepColor} strokeWidth="165" opacity="0.86" fill="none" filter={url("soft-blur")} />
              <path d="M 410 945 C 719 682 985 535 1300 486" stroke={settings.glassColor} strokeWidth="43" opacity="0.57" fill="none" filter={url("fine-blur")} />
              <path d="M 390 1040 C 779 863 1015 690 1360 668" stroke={settings.deepColor} strokeWidth="180" opacity="0.7" fill="none" filter={url("soft-blur")} />
            </>
          )}
        </g>
      </g>
      <path d={edge} fill="none" stroke="#5cc6df" strokeWidth="7" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" filter={url("fine-blur")} />
      <path d={edge} fill="none" stroke="#eafffa" strokeWidth="1.7" strokeOpacity="0.64" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function GlassRibbonBackground({
  className = "",
  ...options
}: Partial<GlassRibbonSettings> & { className?: string }) {
  const settings = { ...GLASS_RIBBON_DEFAULTS, ...options }
  const id = useId().replace(/:/g, "")

  return (
    <div className={`hs-glass-ribbon ${className}`} aria-hidden="true">
      <RibbonArtwork settings={settings} mobile={false} id={id} />
      <RibbonArtwork settings={settings} mobile id={id} />
    </div>
  )
}
