export default function TestimonialsAiSeo({
  className = "",
}: {
  className?: string
}) {
  return (
    <section
      id="stories"
      aria-labelledby="ai-seo-testimonials-title"
      className={`relative flex w-full scroll-mt-[68px] flex-col items-center gap-[100px] overflow-hidden bg-black px-5 py-20 text-white min-[810px]:scroll-mt-[74px] min-[810px]:px-10 min-[810px]:py-[100px] ${className}`}
    >
      <header className="flex w-full flex-col items-center gap-5 text-center">
        <h2
          id="ai-seo-testimonials-title"
          className="max-w-[520px] text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-white min-[810px]:text-[48px] min-[1200px]:text-[56px]"
        >
          Our clients
        </h2>
        <p className="w-full max-w-[420px] text-[18px] font-normal leading-[1.4] tracking-[-0.01em] text-white/70 min-[1200px]:text-[20px]">
          Hear firsthand how our solutions have boosted online success for users like you.
        </p>
      </header>

      <div className="relative z-10 flex w-full max-w-[660px] flex-col items-center gap-[30px] min-[810px]:flex-row">
        <div className="relative isolate flex size-[217px] shrink-0 items-center justify-center overflow-visible">
          <div
            aria-hidden="true"
            className="absolute left-[-91.4747%] top-[-55.53%] z-0 h-[212%] w-[283%] bg-[radial-gradient(50%_50%,rgba(140,69,255,0.6)_0%,rgba(171,171,171,0)_100%)]"
          />

          <div className="relative z-10 size-[217px] overflow-hidden rounded-[20px] border border-white/15 shadow-[0_0_50px_20px_rgba(0,0,0,0.3)]">
            <img
              src="/assets/ai-seo-source/testimonial.avif"
              alt="Talia Taylor"
              className="absolute inset-0 size-full object-cover object-center grayscale"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#8c45ff] mix-blend-soft-light"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute left-0 top-1/2 z-20 h-px w-[356px] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[linear-gradient(90deg,transparent_0%,#fff_11.1747%,#fff_89.2423%,transparent_100%)] opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-1/2 z-20 h-px w-[356px] translate-x-1/2 -translate-y-1/2 rotate-90 bg-[linear-gradient(90deg,transparent_0%,#fff_11.1747%,#fff_89.2423%,transparent_100%)] opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-39.6313%] top-0 z-20 h-px w-[180%] bg-[linear-gradient(90deg,transparent_0%,#fff_11.1747%,#fff_89.2423%,transparent_100%)] opacity-40 min-[810px]:left-auto min-[810px]:right-[-608px] min-[810px]:w-[456%]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[-39.6313%] z-20 h-px w-[180%] bg-[linear-gradient(90deg,transparent_0%,#fff_11.1747%,#fff_89.2423%,transparent_100%)] opacity-40 min-[810px]:left-auto min-[810px]:right-[-608px] min-[810px]:w-[456%]"
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-5 text-center min-[810px]:text-left">
          <blockquote className="text-[23px] font-medium leading-[1.4] tracking-[-0.01em] text-white">
            “This product has completely transformed how I manage my projects and deadlines”
          </blockquote>
          <div className="flex w-full flex-col gap-1">
            <p className="text-[16px] font-normal leading-6 tracking-[-0.01em] text-white">
              Talia Taylor
            </p>
            <p className="text-[14px] font-normal leading-[1.2] text-white/50">
              Digital Marketing Director @ Quantum
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
