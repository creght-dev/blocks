"use client"

import { useState, type FormEvent } from "react"

export default function CtaAiSeo({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section
      className={`scroll-mt-[68px] bg-black px-5 py-20 text-white [font-family:Inter,sans-serif] min-[810px]:scroll-mt-[73.6px] min-[810px]:px-10 min-[810px]:pb-20 min-[810px]:pt-10 ${className}`}
      id="signup"
    >
      <div className="relative mx-auto flex h-[336.8px] w-full max-w-[1100px] flex-col items-center overflow-hidden rounded-[10px] border border-white/[0.15] bg-[radial-gradient(43%_85%_at_50%_-1.6%,#4a208a_0%,#000_100%)] p-10 text-center min-[810px]:h-[433.8px] min-[810px]:p-[100px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[250px] bg-[url('/assets/ai-seo-source/pattern.png')] bg-repeat opacity-10 [mask-image:linear-gradient(180deg,black_0%,rgba(0,0,0,0.7)_42%,transparent_82%)]"
        />

        <h2 className="relative w-[255px] text-[32px] font-medium leading-[35.2px] tracking-[-1.28px] min-[810px]:w-[420px] min-[810px]:text-[56px] min-[810px]:leading-[61.6px] min-[810px]:tracking-[-2.24px]">
          AI-driven SEO for everyone.
        </h2>

        {submitted ? (
          <div className="relative mt-[30px] flex h-[156.4px] w-[255px] items-center justify-center rounded-lg border border-[#8c45ff]/45 bg-[#8c45ff]/15 px-5 text-[14px] leading-5 text-white/80 min-[810px]:h-[80.6px] min-[810px]:w-[360px]" role="status">
            Thanks — you’re on the list.
          </div>
        ) : (
          <form className="relative mt-[30px] w-[255px] min-[810px]:w-[360px]" onSubmit={handleSubmit}>
            <div className="relative flex w-full flex-col gap-2.5 min-[810px]:block">
              <label className="sr-only" htmlFor="ai-seo-email">
                Email address
              </label>
              <span className="flex h-[48.8px] w-full items-center rounded-lg border border-white/[0.15] bg-transparent p-4 transition focus-within:border-[#8c45ff]/70">
                <input
                  autoComplete="email"
                  className="min-w-0 flex-1 bg-transparent p-0 text-[14px] leading-[16.8px] text-white outline-none placeholder:text-white/60 min-[810px]:pr-[125px]"
                  id="ai-seo-email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  required
                  type="email"
                  value={email}
                />
              </span>
              <button className="h-[39px] w-full rounded-[7px] bg-white text-[14px] font-medium text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b987ff] min-[810px]:absolute min-[810px]:right-[5px] min-[810px]:top-[5px] min-[810px]:w-[124px]" type="submit">
                Sign up
              </button>
            </div>

            <div className="mt-[15px] flex min-h-[16.8px] flex-wrap items-center justify-center gap-x-2.5 gap-y-2.5 text-[14px] leading-[16.8px] text-white/70">
              <span>No credit card required</span>
              <span aria-hidden="true">·</span>
              <span>7-days free trial</span>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
