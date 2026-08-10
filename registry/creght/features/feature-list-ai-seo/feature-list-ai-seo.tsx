"use client"

import type { LucideIcon } from "lucide-react"
import {
  BellRing,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  LineChart,
  Link2,
  MousePointerClick,
  Radar,
  Sparkles,
  Target,
} from "lucide-react"
import { FadeIn } from "../../shared/ai-seo/ai-seo-shared"

type FeatureListAiSeoProps = {
  className?: string
}

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  isNew?: boolean
}

const features: Feature[] = [
  {
    title: "Priority workspace",
    description: "Bring urgent opportunities into one clear decision queue.",
    icon: LayoutDashboard,
  },
  {
    title: "Progress narratives",
    description: "Turn changing performance into a story everyone understands.",
    icon: LineChart,
  },
  {
    title: "Demand discovery",
    description: "Spot valuable themes while they are still gaining momentum.",
    icon: Sparkles,
    isNew: true,
  },
  {
    title: "Content scorecards",
    description: "Review clarity and coverage with guidance for the next edit.",
    icon: ClipboardCheck,
  },
  {
    title: "Outcome roadmaps",
    description: "Connect each optimization to a result and stay on course.",
    icon: Target,
  },
  {
    title: "Risk sensing",
    description: "Catch unusual drops and warnings before they become costly.",
    icon: BellRing,
  },
  {
    title: "Authority paths",
    description: "Find stronger internal paths between your most useful pages.",
    icon: Link2,
  },
  {
    title: "Fast improvements",
    description: "Apply confident recommendations without another complex workflow.",
    icon: MousePointerClick,
  },
  {
    title: "Market watch",
    description: "Track category shifts and see where attention is moving next.",
    icon: Radar,
  },
]

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon

  return (
    <FadeIn delay={index * 0.035} className="min-h-[79px]">
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 shrink-0 text-white/90" strokeWidth={1.8} aria-hidden="true" />
        <h3 className="text-base font-medium leading-[1.3] tracking-[-0.01em] text-white">{feature.title}</h3>
        {feature.isNew ? (
          <span className="ml-0.5 inline-flex h-[17px] items-center rounded-full bg-[#8c45ff] px-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_0_18px_rgba(140,69,255,0.5)]">
            New
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 max-w-[340px] text-sm leading-5 text-white/70 min-[810px]:text-base min-[810px]:leading-6">{feature.description}</p>
    </FadeIn>
  )
}

export default function FeatureListAiSeo({ className = "" }: FeatureListAiSeoProps) {
  return (
    <section
      className={`relative scroll-mt-[68px] bg-black text-white min-[810px]:scroll-mt-[74px] ${className}`}
      aria-labelledby="ai-seo-feature-list-title"
    >
      <div className="mx-auto w-[calc(100%_-_2.5rem)] max-w-[1300px]">
        <div className="relative isolate h-[1276px] overflow-hidden rounded-[10px] border border-white/15 bg-[linear-gradient(135deg,#190d2e_0%,#000_100%)] px-6 py-12 min-[810px]:h-auto min-[810px]:px-10 min-[810px]:py-16 lg:h-[680px] lg:min-h-0 lg:p-[100px]">
          <div
            className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_12%_18%,rgba(140,69,255,0.2),transparent_32%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:auto,64px_64px,64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
            aria-hidden="true"
          />

          <FadeIn className="relative max-w-[440px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#bd91ff]">
              <Gauge className="size-3.5" aria-hidden="true" />
              Connected intelligence
            </div>
            <h2
              id="ai-seo-feature-list-title"
              className="max-w-[420px] text-[42px] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:text-[50px] lg:text-[56px]"
            >
              Search signals, connected.
            </h2>
          </FadeIn>

          <div className="relative mt-10 grid gap-x-10 gap-y-9 min-[810px]:grid-cols-3 min-[810px]:gap-y-10">
            {features.map((feature, index) => (
              <FeatureItem feature={feature} index={index} key={feature.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
