"use client"

import { useState } from "react"
import { Check } from "lucide-react"

type Plan = {
  action: string
  featured?: boolean
  features: string[]
  mobileHeight: string
  monthly: number
  name: string
  yearly: number
}

const plans: Plan[] = [
  {
    action: "Try for free",
    features: ["Keyword optimization", "Automated meta tags", "SEO monitoring", "Monthly reports"],
    mobileHeight: "h-[347.6px]",
    monthly: 35,
    name: "Basic",
    yearly: 29,
  },
  {
    action: "Get started",
    featured: true,
    features: [
      "Keyword optimization",
      "Automated meta tags",
      "SEO monitoring",
      "Monthly reports",
      "Content suggestions",
      "Link optimization",
    ],
    mobileHeight: "h-[421.2px]",
    monthly: 85,
    name: "Pro",
    yearly: 79,
  },
  {
    action: "Get started",
    features: [
      "Keyword optimization",
      "Automated meta tags",
      "SEO monitoring",
      "Monthly reports",
      "Content suggestions",
      "Link optimization",
      "Multi-user access",
      "API integration",
    ],
    mobileHeight: "h-[494.8px]",
    monthly: 160,
    name: "Business",
    yearly: 149,
  },
]

function PricingCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  return (
    <article
      className={`relative flex min-h-0 flex-col gap-5 overflow-hidden rounded-[10px] border border-white/[0.15] p-5 text-white min-[810px]:h-[500px] ${plan.mobileHeight} ${plan.featured ? "bg-[linear-gradient(180deg,#030204_0%,#251044_100%)] shadow-[0_20px_80px_rgba(140,69,255,0.28)]" : "bg-black/[0.03]"}`}
    >
      {plan.featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('https://fsu.creght.com/site/2083536173505974272/1789974848065__creght_blocks_ai_seo_source_pattern.png')] bg-repeat opacity-20 [mask-image:linear-gradient(180deg,transparent_15%,black_45%,black_100%)]"
        />
      ) : null}

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[24px] font-medium leading-[31.2px] tracking-[-0.24px] text-white">{plan.name}</h3>
          {plan.featured ? (
            <span className="mt-1 rounded-full bg-[#8c45ff] px-2 py-[2px] text-[8px] font-bold uppercase leading-3 tracking-[0.12px] text-white">
              Popular
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-[16px] leading-6 tracking-[-0.16px] text-white/70">
          ${yearly ? plan.yearly : plan.monthly}/mo
        </p>
      </div>

      <div aria-hidden="true" className="relative h-px shrink-0 bg-white/[0.15]" />

      <ul className="relative space-y-5 pt-2.5">
        {plan.features.map((feature) => (
          <li className="flex h-[16.8px] items-center gap-1.5 text-[14px] leading-[16.8px] text-white/70" key={feature}>
            <Check aria-hidden="true" className="size-[15px] shrink-0 text-white" strokeWidth={1.25} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        className={`relative mt-auto inline-flex h-[38.2px] shrink-0 items-center justify-center rounded-[10px] px-[15px] text-[14px] font-normal leading-[18.2px] text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b987ff] ${plan.featured ? "bg-[#8c45ff]/65 shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.15)] hover:bg-[#8c45ff]/80" : "bg-[#3d3d3d]/40 shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.15)] hover:bg-[#505050]/50"}`}
        href="#signup"
      >
        {plan.action}
      </a>
    </article>
  )
}

export default function PricingAiSeo({ className = "" }: { className?: string }) {
  const [yearly, setYearly] = useState(true)

  return (
    <section
      className={`relative scroll-mt-[68px] overflow-hidden bg-[radial-gradient(50%_50%_at_50%_50%,rgba(140,69,255,0.3)_0%,#000_100%)] px-5 py-20 text-white [font-family:Inter,sans-serif] min-[810px]:scroll-mt-[73.6px] min-[810px]:px-10 min-[810px]:py-[100px] ${className}`}
      id="pricing"
    >
      <div className="mx-auto flex w-full max-w-[1345px] flex-col items-center gap-5 text-center">
        <h2 className="text-[32px] font-medium leading-[35.2px] tracking-[-1.28px] min-[810px]:text-[56px] min-[810px]:leading-[61.6px] min-[810px]:tracking-[-2.24px]">
          Pricing
        </h2>
        <p className="w-full max-w-[335px] text-[18px] leading-[25.2px] tracking-[-0.18px] text-white/70 min-[810px]:max-w-[470px] min-[810px]:text-[20px] min-[810px]:leading-7 min-[810px]:tracking-[-0.2px]">
          Choose the right plan to meet your SEO needs and start optimizing today.
        </p>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-[1345px] flex-col items-center gap-5">
        <button
          aria-checked={yearly}
          className="inline-flex h-[20.8px] items-center gap-2.5 text-[16px] font-medium leading-[20.8px] text-white/80 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#9b64f5]"
          onClick={() => setYearly((value) => !value)}
          role="switch"
          type="button"
        >
          <span className={`relative h-5 w-[33px] rounded-full ring-1 ring-inset ring-white/[0.15] transition-colors ${yearly ? "bg-[#8c45ff]" : "bg-black"}`}>
            <span className={`absolute left-0 top-[3px] size-[14px] rounded-full bg-white transition-transform ${yearly ? "translate-x-4" : "translate-x-[3px]"}`} />
          </span>
          <span>Billed yearly</span>
        </button>

        <div className="grid w-full max-w-[940px] gap-2.5 min-[810px]:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </div>
      </div>
    </section>
  )
}
