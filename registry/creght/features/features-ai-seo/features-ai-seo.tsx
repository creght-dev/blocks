"use client"

import { DashboardMockup, FadeIn } from "../../shared/ai-seo/ai-seo-shared"

type FeaturesAiSeoProps = {
  className?: string
}

const cardClass =
  "relative isolate h-[400px] min-h-0 overflow-hidden rounded-[10px] border border-white/15 bg-[#030303] text-white"

function GlassOrbit() {
  return (
    <div
      className="relative mx-auto mt-1 h-[220px] w-full max-w-[280px] [perspective:600px]"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 size-[174px] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-white/30 bg-[conic-gradient(from_215deg,rgba(255,255,255,0.04),rgba(255,255,255,0.78),rgba(140,69,255,0.28),rgba(255,255,255,0.06),rgba(255,255,255,0.52))] p-[18px] shadow-[0_30px_70px_rgba(0,0,0,0.62),0_0_34px_rgba(140,69,255,0.16),inset_0_2px_8px_rgba(255,255,255,0.3)] [transform:translate(-50%,-50%)_rotateX(64deg)_rotateZ(-16deg)]">
        <div className="size-full rounded-full border border-white/20 bg-[#050407] shadow-[inset_0_18px_28px_rgba(0,0,0,0.9),inset_0_-5px_15px_rgba(140,69,255,0.13)]" />
      </div>
      <div className="absolute left-[23%] top-[24%] h-7 w-20 -rotate-[32deg] rounded-full bg-white/30 blur-xl" />
      <div className="absolute bottom-5 left-1/2 h-8 w-36 -translate-x-1/2 rounded-full bg-[#8c45ff]/20 blur-2xl" />
    </div>
  )
}

function SignalCone() {
  return (
    <div className="relative mx-auto mt-2 h-[220px] w-full max-w-[280px]" aria-hidden="true">
      <div className="absolute left-1/2 top-4 h-[174px] w-[176px] -translate-x-1/2 rotate-[11deg] bg-[linear-gradient(112deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.12)_18%,#0a0810_44%,rgba(140,69,255,0.9)_76%,rgba(255,255,255,0.65)_100%)] shadow-[0_30px_62px_rgba(0,0,0,0.74)] [clip-path:polygon(52%_0%,100%_91%,61%_100%,0%_91%)]" />
      <div className="absolute left-1/2 top-[31px] h-[148px] w-[137px] -translate-x-[54%] rotate-[11deg] bg-[linear-gradient(120deg,rgba(255,255,255,0.64),rgba(255,255,255,0.04)_30%,rgba(0,0,0,0.92)_70%)] [clip-path:polygon(50%_0%,93%_94%,50%_100%,8%_94%)]" />
      <div className="absolute bottom-[25px] left-1/2 h-7 w-[150px] -translate-x-[46%] rotate-[10deg] rounded-[50%] border border-white/25 bg-[radial-gradient(ellipse_at_center,rgba(140,69,255,0.34),rgba(4,3,7,0.95)_68%)] shadow-[0_0_30px_rgba(140,69,255,0.28)]" />
      <div className="absolute left-[39%] top-12 h-24 w-2 -rotate-[12deg] rounded-full bg-white/45 blur-[2px]" />
    </div>
  )
}

function MomentumChart() {
  return (
    <div className="relative mt-6 min-h-[218px] overflow-hidden rounded-[10px] border border-white/10 bg-[#09070e]/78 p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] text-white/45">Qualified reach</p>
          <div className="mt-1 flex items-end gap-2">
            <strong className="text-[30px] font-medium leading-none tracking-[-0.04em] text-white">68.3K</strong>
            <span className="text-[11px] text-emerald-300/80">+12.6%</span>
          </div>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/40">12 weeks</span>
      </div>

      <svg
        viewBox="0 0 640 150"
        preserveAspectRatio="none"
        className="absolute inset-x-5 bottom-4 h-[122px] w-[calc(100%_-_2.5rem)] text-[#8c45ff] sm:inset-x-7 sm:w-[calc(100%_-_3.5rem)]"
        aria-hidden="true"
      >
        <path d="M0 34H640M0 76H640M0 118H640" className="stroke-white/[0.07]" strokeWidth="1" />
        <path
          d="M0 124 L66 100 L126 117 L196 64 L267 108 L337 82 L409 106 L482 58 L555 90 L640 42 L640 150 L0 150 Z"
          className="fill-[#8c45ff]/15"
        />
        <path
          d="M0 124 L66 100 L126 117 L196 64 L267 108 L337 82 L409 106 L482 58 L555 90 L640 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="482" cy="58" r="4" className="fill-white stroke-[#8c45ff]" strokeWidth="3" />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1f0f36]/65 to-transparent" />
    </div>
  )
}

export default function FeaturesAiSeo({ className = "" }: FeaturesAiSeoProps) {
  return (
    <section
      id="features"
      className={`relative scroll-mt-[68px] overflow-hidden bg-black py-20 text-white min-[810px]:scroll-mt-[74px] min-[810px]:py-[100px] ${className}`}
      aria-labelledby="ai-seo-feature-showcase-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5f21b7]/10 blur-[150px]" aria-hidden="true" />

      <div className="relative mx-auto w-[calc(100%_-_2.5rem)] max-w-[1100px]">
        <FadeIn className="mx-auto mb-[47px] max-w-[560px] text-center min-[810px]:mb-[76px]">
          <h2
            id="ai-seo-feature-showcase-title"
            className="text-[30px] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:text-[32px]"
          >
            Turn scattered search signals into your next confident move.
          </h2>
        </FadeIn>

        <div className="grid gap-[10px] min-[810px]:grid-cols-3">
          <FadeIn className={`${cardClass} min-[810px]:col-span-1`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(140,69,255,0.12),transparent_48%)]" aria-hidden="true" />
            <div className="relative flex h-full flex-col p-8 sm:p-10">
              <GlassOrbit />
              <div className="mt-auto">
                <h3 className="text-base font-medium leading-[1.3] tracking-[-0.01em]">Outcome mapping</h3>
                <p className="mt-2 max-w-[270px] text-base leading-6 text-white/70">
                  Translate ambitious growth targets into a focused weekly path.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className={`${cardClass} bg-[linear-gradient(0deg,#371866_0%,#030303_100%)] min-[810px]:col-span-2`} delay={0.08}>
            <DashboardMockup
              compact
              className="!absolute left-6 right-6 top-6 h-[470px] sm:left-10 sm:right-10 sm:top-10 min-[810px]:right-auto min-[810px]:w-[1080px]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[190px] bg-gradient-to-t from-[#371866] via-[#251044]/95 to-transparent" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
              <h3 className="text-base font-medium leading-[1.3] tracking-[-0.01em]">A workspace that explains itself</h3>
              <p className="mt-2 max-w-[390px] text-base leading-6 text-white/70">
                See movement, priorities, and practical next steps in one calm view.
              </p>
            </div>
          </FadeIn>

          <FadeIn className={`${cardClass} bg-[linear-gradient(0deg,#371866_0%,#030303_100%)] min-[810px]:col-span-2`} delay={0.12}>
            <div className="relative flex h-full flex-col p-8 sm:p-10">
              <MomentumChart />
              <div className="relative mt-auto">
                <h3 className="text-base font-medium leading-[1.3] tracking-[-0.01em]">Momentum, made visible</h3>
                <p className="mt-2 max-w-[390px] text-base leading-6 text-white/70">
                  Follow meaningful progress without wrestling with dense reports.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className={`${cardClass} min-[810px]:col-span-1`} delay={0.16}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(140,69,255,0.13),transparent_46%)]" aria-hidden="true" />
            <div className="relative flex h-full flex-col p-8 sm:p-10">
              <SignalCone />
              <div className="mt-auto">
                <h3 className="text-base font-medium leading-[1.3] tracking-[-0.01em]">Intent discovery</h3>
                <p className="mt-2 max-w-[270px] text-base leading-6 text-white/70">
                  Reveal overlooked demand clusters before competitors notice them.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
