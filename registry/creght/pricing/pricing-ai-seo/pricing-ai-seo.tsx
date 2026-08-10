"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { AI_SEO_SECTION, FadeIn, SectionHeading } from "../../shared/ai-seo/ai-seo-shared"

const plans = [
  {
    name: "Launch",
    monthly: 34,
    yearly: 27,
    description: "For focused sites finding their first repeatable growth loop.",
    features: ["Two tracked properties", "Weekly opportunity map", "Technical health alerts", "Shareable reports"],
    action: "Start exploring",
    mobileHeight: "h-[348px]",
  },
  {
    name: "Scale",
    monthly: 89,
    yearly: 72,
    description: "For teams coordinating content, technical work, and experiments.",
    features: ["Ten tracked properties", "Content briefs", "Internal-link planner", "Competitor movement", "Team workspaces", "Priority support"],
    action: "Choose Scale",
    mobileHeight: "h-[421px]",
    featured: true,
  },
  {
    name: "Studio",
    monthly: 169,
    yearly: 139,
    description: "For agencies and multi-brand teams that need flexible oversight.",
    features: ["Unlimited properties", "Client-ready workspaces", "Custom scoring models", "API and exports", "Advanced permissions", "Onboarding session"],
    action: "Talk to us",
    mobileHeight: "h-[495px]",
  },
]

export default function PricingAiSeo({ className = "" }: { className?: string }) {
  const [yearly, setYearly] = useState(true)

  return (
    <section
      id="pricing"
      className={`relative scroll-mt-[68px] overflow-hidden bg-[#050505] py-20 text-white min-[810px]:scroll-mt-[74px] min-[810px]:py-[72px] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(140,69,255,0.2),transparent_40%)]" aria-hidden="true" />
      <div className={AI_SEO_SECTION}>
        <FadeIn>
          <SectionHeading
            eyebrow="Simple plans"
            title="Choose the pace that fits."
            description="Start with the essentials, then expand your workspace as more teams and sites join the workflow."
            descriptionClassName="hidden min-[810px]:block"
          />
        </FadeIn>

        <FadeIn className="mt-6 flex justify-center min-[810px]:mt-9" delay={0.04}>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((value) => !value)}
            className="group inline-flex min-h-11 items-center gap-3 rounded-full px-3 text-sm text-white/58 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#9b64f5]"
          >
            <span className={`relative h-6 w-10 rounded-full border transition ${yearly ? "border-[#aa79ff]/45 bg-[#8c45ff]" : "border-white/14 bg-white/[0.07]"}`}>
              <span className={`absolute top-[3px] size-4 rounded-full bg-white shadow-sm transition-transform ${yearly ? "translate-x-[19px]" : "translate-x-[3px]"}`} />
            </span>
            <span>{yearly ? "Billed yearly · save up to 20%" : "Billed monthly"}</span>
          </button>
        </FadeIn>

        <div className="mx-auto mt-3 grid max-w-[940px] gap-2.5 min-[810px]:mt-6 min-[810px]:grid-cols-3 min-[810px]:items-stretch">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={0.08 + index * 0.06} className="h-full">
              <article
                className={`relative flex min-h-0 flex-col overflow-hidden rounded-[12px] border p-5 transition duration-500 hover:-translate-y-1 min-[810px]:h-full min-[810px]:min-h-[500px] ${plan.mobileHeight} min-[810px]:h-auto ${plan.featured
                  ? "border-[#a66eff]/36 bg-[linear-gradient(180deg,#070609_0%,#2a154d_100%)] shadow-[0_16px_70px_rgba(140,69,255,0.24)]"
                  : "border-white/[0.1] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] hover:border-white/20"
                }`}
              >
                {plan.featured ? (
                  <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" aria-hidden="true" />
                ) : null}
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-medium tracking-[-0.04em]">{plan.name}</h3>
                    {plan.featured ? <span className="rounded-full bg-[#8c45ff] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">Popular</span> : null}
                  </div>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="text-[34px] font-medium leading-none tracking-[-0.05em]">${yearly ? plan.yearly : plan.monthly}</span>
                    <span className="pb-0.5 text-xs text-white/36">/ month</span>
                  </div>
                  <p className="mt-4 hidden min-h-[66px] text-sm leading-6 text-white/45 min-[810px]:block">{plan.description}</p>
                </div>

                <ul className="relative mt-5 space-y-3.5 border-t border-white/[0.08] pt-5 min-[810px]:mt-7 min-[810px]:pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-5 text-white/62">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-white/72" strokeWidth={1.8} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#signup"
                  className={`relative mt-auto inline-flex min-h-10 items-center justify-center rounded-[9px] border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b987ff] ${plan.featured
                    ? "border-[#a96fff]/35 bg-[#8c45ff] text-white shadow-[0_8px_28px_rgba(140,69,255,0.28)] hover:bg-[#9b5aff]"
                    : "border-white/12 bg-white/[0.065] text-white/82 hover:border-white/25 hover:bg-white/[0.1]"
                  }`}
                >
                  {plan.action}
                </a>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
