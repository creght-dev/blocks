"use client"

import { useId, type MouseEventHandler, type ReactNode } from "react"
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Search,
  Settings,
  Sparkles,
  Target,
} from "lucide-react"

export const AI_SEO_SECTION = "mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-10"

export function FadeIn({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return <div className={className}>{children}</div>
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-white/15 bg-[radial-gradient(75%_50%_at_50%_100%,#1c1c1c_0%,#000_100%)] ${className}`}
      aria-hidden="true"
    >
      <span className="relative size-[52.63%] overflow-hidden rounded-[10px] shadow-[0_1px_10px_rgba(198,54,255,0.7),0_1px_6px_rgba(140,69,255,0.6)]">
        <video
          autoPlay
          className="absolute left-1/2 top-1/2 size-[110%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          loop
          muted
          playsInline
          poster="https://fsu.creght.com/site/2083536173505974272/1789974846437__creght_blocks_ai_seo_source_logo_poster.avif"
          src="https://fsu.creght.com/site/2083536173505974272/1789974847225__creght_blocks_ai_seo_source_logo.mp4"
        />
      </span>
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  descriptionClassName = "",
  align = "center",
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  descriptionClassName?: string
  align?: "left" | "center"
}) {
  const centered = align === "center"
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left"}>
      {eyebrow ? (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ad77ff]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.045em] text-white sm:text-[46px] lg:text-[56px]">
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-[15px] leading-7 text-white/48 sm:text-base ${centered ? "mx-auto max-w-xl" : "max-w-lg"} ${descriptionClassName}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function GlowBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[680px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f26d9]/18 blur-[120px]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_48%,black,transparent_78%)]" />
    </div>
  )
}

export function PrimaryButton({
  children,
  href = "#pricing",
  className = "",
  onClick,
}: {
  children: ReactNode
  href?: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border border-white/70 bg-white px-5 text-sm font-semibold text-[#100d16] shadow-[0_0_0_6px_rgba(139,69,255,0.08),0_12px_36px_rgba(123,49,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5ecff] ${className}`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </a>
  )
}

function MetricCard({
  label,
  value,
  change,
  negative = false,
}: {
  label: string
  value: string
  change: string
  negative?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/[0.09] bg-black/20 p-2 sm:p-5">
      <div className="flex items-center justify-between text-[9px] text-white/42 sm:text-[11px]">
        <span>{label}</span>
        <span className="grid size-4 place-items-center rounded-full border border-white/14 text-[9px]">?</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <strong className="text-[22px] font-medium leading-none tracking-[-0.04em] text-white sm:text-[32px]">
          {value}
        </strong>
        <span className={`text-[9px] sm:text-[11px] ${negative ? "text-[#dc5c89]" : "text-[#61d2a1]"}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

export function DashboardMockup({
  className = "",
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const rawId = useId()
  const chartGradientId = `chart-${rawId.replaceAll(":", "")}`
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border border-white/[0.12] bg-[#09070d] shadow-[0_24px_90px_rgba(91,33,160,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] ${compact ? "min-h-[300px]" : "min-h-[220px] sm:min-h-[520px]"} ${className}`}
      aria-label="Auralis search performance dashboard preview"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_35%,rgba(118,52,198,0.24),transparent_42%),linear-gradient(145deg,rgba(255,255,255,0.025),transparent_36%)]" />
      <div className="relative flex h-10 items-center border-b border-white/[0.08] px-3 sm:h-16 sm:px-5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#fd7969] sm:size-2.5" />
          <span className="size-2 rounded-full bg-[#f4be58] sm:size-2.5" />
          <span className="size-2 rounded-full bg-[#75ca78] sm:size-2.5" />
        </div>
        <div className="ml-auto hidden h-8 w-52 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[11px] text-white/30 sm:flex">
          <Search className="ml-auto size-3.5" aria-hidden="true" />
        </div>
        <span
          aria-hidden="true"
          className="ml-2 grid size-8 place-items-center rounded-lg border border-[#9c62ff]/30 bg-[#6d2ac2]/35 text-[#c79bff] transition hover:bg-[#7733d1]/55"
        >
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className="relative grid h-[180px] min-h-0 grid-cols-[64px_minmax(0,1fr)] sm:h-auto sm:min-h-[456px] sm:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r border-white/[0.08] p-2 sm:p-5">
          <div className="mb-6 flex items-center gap-2 text-[9px] font-medium text-white/72 sm:text-xs">
            <Eye className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Site overview</span>
          </div>
          <div className="space-y-3.5 text-white/27 sm:space-y-4 sm:text-[11px]">
            <div className="flex items-center gap-2"><BarChart3 className="size-3.5" /><span className="hidden sm:inline">Analytics</span></div>
            <div className="flex items-center gap-2"><Sparkles className="size-3.5" /><span className="hidden sm:inline">Query studio</span></div>
            <div className="flex items-center gap-2"><Target className="size-3.5" /><span className="hidden sm:inline">Growth goals</span></div>
          </div>
        </aside>

        <div className="min-w-0 p-2 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-2 sm:pb-5">
            <div>
              <p className="text-[10px] font-medium text-white/80 sm:text-xs">Search pulse</p>
              <p className="mt-1 text-[8px] text-white/26 sm:text-[10px]">auralis.example ↗</p>
            </div>
            <Settings className="size-4 text-white/32" aria-hidden="true" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
            <MetricCard label="Visibility" value="12.4%" change="+6.2%" />
            <MetricCard label="Qualified terms" value="38.2K" change="-1.8%" negative />
          </div>
          <div className="relative mt-2 h-[78px] overflow-hidden rounded-xl border border-white/[0.08] bg-black/10 p-2 sm:mt-3 sm:h-[205px] sm:p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] text-white/35 sm:text-[10px]">Organic reach</p>
                <p className="mt-1 text-lg font-medium tracking-[-0.04em] text-white sm:text-3xl">64.8K</p>
              </div>
              <span className="text-[8px] text-[#61d2a1] sm:text-[10px]">+10.7%</span>
            </div>
            <svg className="absolute inset-x-2 bottom-2 h-[42px] w-[calc(100%_-_1rem)] sm:inset-x-5 sm:bottom-5 sm:h-[120px] sm:w-[calc(100%_-_2.5rem)]" viewBox="0 0 620 150" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id={chartGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#8c45ff" stopOpacity="0.42" />
                  <stop offset="1" stopColor="#8c45ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 122 L62 92 L120 119 L190 60 L260 105 L330 73 L410 108 L490 56 L560 92 L620 48 L620 150 L0 150 Z" fill={`url(#${chartGradientId})`} />
              <path d="M0 122 L62 92 L120 119 L190 60 L260 105 L330 73 L410 108 L490 56 L560 92 L620 48" fill="none" stroke="#8c45ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070609] via-[#070609]/70 to-transparent" aria-hidden="true" />
    </div>
  )
}
