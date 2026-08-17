"use client"

import type { LucideIcon } from "lucide-react"
import {
  BellRing,
  Files,
  Gauge,
  LineChart,
  ListChecks,
  MousePointer2,
  Sparkles,
  Target,
  WandSparkles,
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
    title: "User-friendly dashboard",
    description: "Perform complex SEO audits and optimizations with a single click.",
    icon: Gauge,
  },
  {
    title: "Visual reports",
    description: "Visual insights into your site’s performance.",
    icon: LineChart,
  },
  {
    title: "Smart Keyword Generator",
    description: "Automatic suggestions and the best keywords to target.",
    icon: Sparkles,
    isNew: true,
  },
  {
    title: "Content evaluation",
    description: "Simple corrections for immediate improvemens.",
    icon: ListChecks,
  },
  {
    title: "SEO goal setting",
    description: "Helps you set and achieve SEO goals with guided assistance.",
    icon: Target,
  },
  {
    title: "Automated alerts",
    description: "Automatic notifications about your SEO health, including quick fixes.",
    icon: BellRing,
  },
  {
    title: "Link Optimization Wizard",
    description: "Guides you through the process of creating and managing links.",
    icon: WandSparkles,
  },
  {
    title: "One-click optimization",
    description: "Perform complex SEO audits and optimizations with a single click.",
    icon: MousePointer2,
  },
  {
    title: "Competitor reports",
    description: "Provides insights into competitors’ keyword strategies and ranking.",
    icon: Files,
  },
]

function FeatureItem({ feature }: { feature: Feature }) {
  const Icon = feature.icon

  return (
    <div className="group min-h-[80px]">
      <div className="flex min-h-6 items-center gap-2">
        <Icon
          className="size-4 shrink-0 text-white/90 transition-colors duration-200 group-hover:text-[#b981ff]"
          strokeWidth={1.9}
          aria-hidden="true"
        />
        <h3 className="text-base font-medium leading-6 tracking-[-0.015em] text-white">{feature.title}</h3>
        {feature.isNew ? (
          <span className="ml-0.5 inline-flex h-[17px] items-center rounded-full bg-[#8c45ff] px-2 text-[9px] font-semibold uppercase leading-none tracking-[0.04em] text-white shadow-[0_0_16px_rgba(140,69,255,0.38)]">
            New
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 max-w-[342px] text-base leading-6 text-white/60 transition-colors duration-200 group-hover:text-white/70">
        {feature.description}
      </p>
    </div>
  )
}

export default function FeatureListAiSeo({ className = "" }: FeatureListAiSeoProps) {
  return (
    <section
      id="feature-list"
      className={`scroll-mt-[68px] bg-black text-white min-[810px]:scroll-mt-[74px] ${className}`}
      aria-labelledby="ai-seo-feature-list-title"
    >
      <div className="mx-auto w-full max-w-[1300px] min-[810px]:w-[calc(100%_-_5rem)]">
        <div className="h-[1275.6px] overflow-hidden border-y border-white/[0.14] bg-[linear-gradient(112deg,#190d2e_0%,#090414_48%,#000_100%)] px-5 pt-[78px] min-[810px]:h-[679.6px] min-[810px]:rounded-[10px] min-[810px]:border min-[810px]:px-[60px] min-[810px]:py-20 lg:px-[100px] lg:py-[98px]">
          <FadeIn>
            <h2
              id="ai-seo-feature-list-title"
              className="max-w-[380px] text-[32px] font-medium leading-[1.08] tracking-[-0.04em] text-white min-[810px]:text-[56px]"
            >
              Elevate your SEO efforts.
            </h2>
          </FadeIn>

          <div className="mt-[42px] grid gap-y-[33px] min-[810px]:grid-cols-3 min-[810px]:gap-x-10 min-[810px]:gap-y-[38px] lg:gap-x-[52px]">
            {features.map((feature) => (
              <FadeIn key={feature.title}>
                <FeatureItem feature={feature} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
