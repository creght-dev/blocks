"use client"

import { FadeIn } from "../../shared/ai-seo/ai-seo-shared"

type FeaturesAiSeoProps = {
  className?: string
}

const cardClass =
  "group relative isolate h-[400px] overflow-hidden rounded-[10px] border border-white/[0.14] bg-black text-white transition-[border-color,transform] duration-300 motion-safe:hover:-translate-y-1 hover:border-white/30"

function CardCopy({
  title,
  description,
  wide = false,
}: {
  title: string
  description: string
  wide?: boolean
}) {
  return (
    <div className="absolute inset-x-[38px] bottom-[38px] z-20">
      <h3 className="text-base font-medium leading-[1.35] tracking-[-0.015em] text-white">{title}</h3>
      <p className={`mt-2 text-base leading-6 text-white/60 ${wide ? "max-w-[390px]" : "max-w-[260px]"}`}>
        {description}
      </p>
    </div>
  )
}

export default function FeaturesAiSeo({ className = "" }: FeaturesAiSeoProps) {
  return (
    <section
      id="features"
      className={`scroll-mt-[68px] overflow-hidden bg-black py-20 text-white min-[810px]:scroll-mt-[74px] min-[810px]:py-[100px] ${className}`}
      aria-labelledby="ai-seo-feature-showcase-title"
    >
      <div className="mx-auto w-[calc(100%_-_2.5rem)] max-w-[1100px]">
        <FadeIn className="mx-auto mb-10 max-w-[540px] text-center">
          <h2
            id="ai-seo-feature-showcase-title"
            className="text-[24px] font-medium leading-[26.4px] tracking-[-0.96px] text-white min-[810px]:text-[32px] min-[810px]:leading-[35.2px] min-[810px]:tracking-[-1.28px]"
          >
            Harness the power of AI, making search engine optimization intuitive and effective for all skill levels.
          </h2>
        </FadeIn>

        <div className="grid gap-[10px] min-[810px]:grid-cols-3">
          <FadeIn className={cardClass}>
            <img
              src="/assets/ai-seo-source/feature-goal.avif"
              alt=""
              width="1011"
              height="1024"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-9 h-[219.2px] w-[216.5px] max-w-none -translate-x-1/2 object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            <CardCopy
              title="SEO goal setting"
              description="Helps you set and achieve SEO goals with guided assistance."
            />
          </FadeIn>

          <FadeIn className={`${cardClass} min-[810px]:col-span-2`}>
            <img
              src="/assets/ai-seo-source/dashboard.png"
              alt=""
              width="2200"
              height="1848"
              aria-hidden="true"
              className="pointer-events-none absolute left-10 top-10 h-[741.7px] w-[1080px] max-w-none object-cover object-top transition-transform duration-700 group-hover:scale-[1.008]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_30%,rgba(30,11,54,0.48)_55%,#4a2084_100%)]"
              aria-hidden="true"
            />
            <CardCopy
              wide
              title="User-friendly dashboard"
              description="Perform complex SEO audits and optimizations with a single click."
            />
          </FadeIn>

          <FadeIn className={`${cardClass} min-[810px]:col-span-2`}>
            <img
              src="/assets/ai-seo-source/analytics.avif"
              alt=""
              width="1024"
              height="593"
              aria-hidden="true"
              className="pointer-events-none absolute left-[55.6px] top-10 w-[530.4px] max-w-none transition-transform duration-700 group-hover:scale-[1.008] min-[810px]:left-10 min-[810px]:w-[650px]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_27%,rgba(41,16,74,0.25)_50%,#4b2187_100%)]"
              aria-hidden="true"
            />
            <CardCopy wide title="Visual reports" description="Visual insights into your site’s performance." />
          </FadeIn>

          <FadeIn className={cardClass}>
            <img
              src="/assets/ai-seo-source/keyword.avif"
              alt=""
              width="1011"
              height="1024"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[41.3px] h-[210.6px] w-52 max-w-none -translate-x-1/2 object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            <CardCopy
              title="Smart Keyword Generator"
              description="Automatic suggestions and the best keywords to target."
            />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
