"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2 } from "lucide-react"

import { AI_SEO_SECTION, FadeIn } from "../../shared/ai-seo/ai-seo-shared"

export default function CtaAiSeo({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section id="signup" className={`scroll-mt-[68px] bg-[#050505] px-0 pb-[26px] pt-10 text-white min-[810px]:scroll-mt-[74px] min-[810px]:py-[60px] ${className}`}>
      <div className={AI_SEO_SECTION}>
        <FadeIn className="relative mx-auto flex h-[431px] min-h-0 max-w-[1100px] items-center justify-center overflow-hidden rounded-[12px] border border-white/[0.1] bg-[radial-gradient(ellipse_at_50%_-8%,#4a208a_0%,#160c28_35%,#050505_74%)] px-5 py-8 text-center min-[810px]:h-auto min-[810px]:min-h-[434px] min-[810px]:px-10 min-[810px]:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_50%_30%,black,transparent_74%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 rounded-full bg-[#a05dff]/22 blur-[55px]" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-[255px] min-[810px]:max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c398ff]">Your next search advantage</p>
            <h2 className="mt-5 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] sm:text-[50px] lg:text-[56px]">
              Turn search signals into momentum.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/48 sm:text-base">
              Join the private preview and get a guided workspace for your first site.
            </p>

            {submitted ? (
              <div className="mx-auto mt-8 flex min-h-[52px] max-w-[410px] items-center justify-center gap-2 rounded-[11px] border border-[#a971ff]/28 bg-[#8c45ff]/14 px-5 text-sm text-white/82" role="status">
                <CheckCircle2 className="size-4 text-[#c79cff]" aria-hidden="true" />
                Demo request confirmed for {email}.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-[410px] flex-col gap-2 rounded-[12px] border border-white/[0.12] bg-black/35 p-1.5 shadow-[0_12px_45px_rgba(0,0,0,0.28)] focus-within:ring-2 focus-within:ring-[#9b64f5]/70 min-[810px]:flex-row">
                <label htmlFor="ai-seo-email" className="sr-only">Work email</label>
                <input
                  id="ai-seo-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/28"
                />
                <button type="submit" className="min-h-10 rounded-[9px] bg-white px-5 text-sm font-semibold text-[#100d16] transition hover:bg-[#f4eaff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b987ff] min-[810px]:min-h-11">
                  Request access
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-white/36">No card required · 14-day guided preview</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
