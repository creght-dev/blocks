"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"

import { AI_SEO_SECTION, FadeIn, SectionHeading } from "../../shared/ai-seo/ai-seo-shared"

const stories = [
  {
    quote: "Auralis gave our team one shared view of the opportunities that deserve attention next.",
    name: "Maya Chen",
    role: "VP Growth · Northstar Labs",
    image: "https://fsu.creght.com/site/2073431569581740032/1783239328779__av_evelyn_w.jpg",
  },
  {
    quote: "We stopped debating reports and started shipping better experiments every week.",
    name: "Jon Bell",
    role: "SEO Lead · SignalWorks",
    image: "https://fsu.creght.com/site/2073431569581740032/1783239329922__av_mario.jpg",
  },
  {
    quote: "The guidance is specific enough to act on and calm enough for every stakeholder.",
    name: "Amara Patel",
    role: "Digital Director · Meridian Studio",
    image: "https://fsu.creght.com/site/2073431569581740032/1783239329323__av_karina.jpg",
  },
]

export default function TestimonialsAiSeo({ className = "" }: { className?: string }) {
  const [activeStory, setActiveStory] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const story = stories[activeStory]
  const selectStory = (direction: number) => {
    setActiveStory((current) => (current + direction + stories.length) % stories.length)
  }

  return (
    <section
      id="stories"
      className={`relative scroll-mt-[68px] overflow-hidden bg-[#050505] pb-20 pt-24 text-white min-[810px]:scroll-mt-[74px] min-[810px]:py-10 ${className}`}
      aria-label="Customer stories"
    >
      <div className="pointer-events-none absolute left-[16%] top-[46%] size-[440px] -translate-y-1/2 rounded-full bg-[#7a32dc]/20 blur-[110px]" aria-hidden="true" />
      <div className={AI_SEO_SECTION}>
        <FadeIn>
          <SectionHeading
            eyebrow="Customer signal"
            title="Built for teams that move fast."
            description="See how growth teams turn scattered search data into a clear, repeatable operating rhythm."
          />
        </FadeIn>

        <FadeIn className="relative mx-auto mt-8 max-w-[990px]" delay={0.08}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" aria-hidden="true" />
          <div className="grid h-[408px] grid-rows-[217px_191px] overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.025] min-[810px]:h-auto min-[810px]:grid-cols-[230px_minmax(0,1fr)] min-[810px]:grid-rows-none">
            <div className="relative mx-auto h-[217px] w-[217px] overflow-hidden rounded-full min-[810px]:m-0 min-[810px]:h-auto min-[810px]:min-h-[310px] min-[810px]:w-auto min-[810px]:rounded-none">
              <img
                key={story.image}
                src={story.image}
                alt={`Portrait of ${story.name}`}
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[#8c45ff]/28 mix-blend-color" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09070d]/80 via-transparent to-[#7b35d1]/10" aria-hidden="true" />
            </div>

            <div className="relative flex min-h-0 flex-col justify-center px-7 py-4 min-[810px]:min-h-[310px] min-[810px]:px-12 min-[810px]:py-10" aria-live="polite">
              <Quote className="absolute right-7 top-7 hidden size-10 text-[#9d61ff]/22 min-[810px]:block" strokeWidth={1.25} aria-hidden="true" />
              <motion.blockquote
                key={story.quote}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.72, delay: shouldReduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[570px] text-[19px] font-medium leading-[1.25] tracking-[-0.035em] text-white min-[810px]:text-[31px]"
              >
                “{story.quote}”
              </motion.blockquote>
              <div className="mt-3 border-t border-white/[0.09] pt-3 min-[810px]:mt-8 min-[810px]:pt-6">
                <p className="text-sm font-medium text-white/90">{story.name}</p>
                <p className="mt-1 text-xs text-white/38">{story.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 hidden items-center justify-between min-[810px]:flex">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/26">
              Story {String(activeStory + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => selectStory(-1)} aria-label="Previous customer story" className="grid size-10 place-items-center rounded-full border border-white/10 text-white/42 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => selectStory(1)} aria-label="Next customer story" className="grid size-10 place-items-center rounded-full border border-white/10 text-white/42 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white">
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
