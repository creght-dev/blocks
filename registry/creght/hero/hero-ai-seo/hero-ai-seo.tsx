const HERO_IMAGE = "https://fsu.creght.com/site/2083536173505974272/1786355775493__creght_blocks_external_005.png"

export type HeroAiSeoProps = {
  className?: string
}

function OrbitNode({ className = "", outlined = false }: { className?: string; outlined?: boolean }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 origin-center ${className}`}>
      {outlined ? (
        <span className="absolute left-1/2 top-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white">
          <span className="size-[7px] rounded-full bg-white" />
        </span>
      ) : (
        <span className="absolute left-1/2 top-0 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      )}
    </span>
  )
}

export default function HeroAiSeo({ className = "" }: HeroAiSeoProps) {
  return (
    <section
      className={`relative isolate scroll-mt-[68px] overflow-hidden bg-black pt-20 text-white [font-family:Inter,sans-serif] min-[810px]:scroll-mt-[73.6px] ${className}`}
      id="top"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_88%_at_50%_78.3%,#d438ff_0%,#8c45ff_39.9916%,#190d2e_84.9328%,#000_100%)] min-[810px]:bg-[radial-gradient(60%_88%_at_50%_64.2%,#d438ff_0%,#8c45ff_39.9916%,#190d2e_84.9328%,#000_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-88px] hidden size-[1574px] -translate-x-1/2 opacity-50 mix-blend-overlay min-[810px]:block"
      >
        <span className="absolute left-1/2 top-1/2 size-[574px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white will-change-transform animate-[spin_60s_linear_infinite] motion-reduce:animate-none">
          <OrbitNode className="rotate-[-135deg]" outlined />
          <OrbitNode className="rotate-[-45deg]" />
          <OrbitNode className="rotate-[45deg]" />
          <OrbitNode className="rotate-[180deg]" />
        </span>
        <span className="absolute left-1/2 top-1/2 size-[774px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white will-change-transform animate-[spin_80s_linear_infinite_reverse] motion-reduce:animate-none" />
        <span className="absolute left-1/2 top-1/2 size-[974px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white will-change-transform animate-[spin_50s_linear_infinite] motion-reduce:animate-none">
          <OrbitNode className="rotate-[-130deg]" outlined />
          <OrbitNode className="rotate-[-90deg]" />
          <OrbitNode className="rotate-[-26deg]" />
          <OrbitNode className="rotate-[0deg]" />
          <OrbitNode className="rotate-[90deg]" outlined />
          <OrbitNode className="rotate-[163deg]" />
        </span>
        <span className="absolute left-1/2 top-1/2 size-[1174px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white will-change-transform animate-[spin_100s_linear_infinite_reverse] motion-reduce:animate-none" />
        <span className="absolute left-1/2 top-1/2 size-[1374px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white will-change-transform animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
          <OrbitNode className="rotate-[-118deg]" />
          <OrbitNode className="rotate-[-20deg]" outlined />
          <OrbitNode className="rotate-[44deg]" />
          <OrbitNode className="rotate-[136deg]" outlined />
          <OrbitNode className="rotate-[180deg]" />
        </span>
        <span className="absolute left-1/2 top-1/2 size-[1574px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white will-change-transform animate-[spin_80s_linear_infinite_reverse] motion-reduce:animate-none" />
      </div>

      <div className="relative z-20 mx-auto flex w-[calc(100%_-_40px)] max-w-[335px] flex-col items-center gap-5 text-center min-[810px]:max-w-[1000px]">
        <a
          className="inline-flex h-[39.6px] items-center gap-2 rounded-full bg-black px-3.5 text-[14px] font-medium leading-[19.6px] tracking-[-0.1px] text-[#8c45ff] ring-1 ring-inset ring-white/[0.15] transition hover:text-[#ad79ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b179ff]"
          href="#features"
        >
          <span className="inline-flex h-4 w-[31.8px] items-center justify-center rounded-full bg-[#8c45ff] text-[8px] font-bold uppercase leading-none tracking-[0.24px] text-white">
            New
          </span>
          <span>Latest integration just arrived</span>
        </a>

        <h1 className="w-full bg-clip-text text-[50px] font-medium leading-[50px] tracking-[-0.06em] text-transparent [background-image:radial-gradient(71%_100%_at_50%_133.9%,#7800ab_0%,#fff_100%)] min-[810px]:max-w-[530px] min-[810px]:text-[64px] min-[810px]:leading-[64px] min-[1200px]:max-w-[600px] min-[1200px]:text-[82px] min-[1200px]:leading-[82px]">
          <span className="block">Boost your</span>
          <span className="block min-[810px]:hidden">rankings with</span>
          <span className="block min-[810px]:hidden">AI.</span>
          <span className="hidden min-[810px]:block">rankings with AI.</span>
        </h1>

        <p className="w-full text-[18px] font-normal leading-[25.2px] tracking-[-0.18px] text-white/70 min-[810px]:max-w-[540px] min-[1200px]:text-[20px] min-[1200px]:leading-7 min-[1200px]:tracking-[-0.2px]">
          Elevate your site’s visibility effortlessly with AI, where smart technology meets user-friendly SEO tools.
        </p>

        <span className="relative inline-flex">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-[14px] border border-white/[0.11] bg-white/[0.02]"
          />
          <a
            className="relative inline-flex h-[38.2px] w-[112.1px] items-center justify-center rounded-[10px] bg-white text-[14px] font-medium leading-[18.2px] tracking-[-0.28px] text-black shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bb8aff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            href="#signup"
          >
            Start for free
          </a>
        </span>
      </div>

      <div className="relative z-20 mx-auto mt-10 w-[calc(100%_-_40px)] max-w-[335px] overflow-hidden rounded-[10px] bg-white/[0.035] p-[5px] shadow-[0_-2px_0_rgba(230,193,255,0.22),0_-32px_120px_rgba(191,80,255,0.24),0_46px_130px_rgba(0,0,0,0.58)] ring-1 ring-inset ring-white/[0.1] min-[810px]:w-[calc(100%_-_80px)] min-[810px]:max-w-[1300px] min-[810px]:p-[10px] min-[1200px]:h-[600px]">
        <div className="relative aspect-[10/7] w-full overflow-hidden rounded-[8px] bg-[#101011]">
          <img
            alt="AI SEO analytics dashboard showing site performance and keyword metrics"
            className="absolute inset-0 size-full object-cover object-top"
            decoding="async"
            fetchPriority="high"
            height="1848"
            loading="eager"
            sizes="(max-width: 809px) calc(100vw - 50px), (max-width: 1199px) calc(100vw - 100px), 1280px"
            src={HERO_IMAGE}
            width="2560"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-4px] top-[-4px] z-[15] bg-[radial-gradient(54%_50%_at_50%_57.2%,transparent_0%,rgba(0,0,0,0.67)_64.5147%,#000_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-56 bg-[linear-gradient(180deg,transparent_0%,#000_100%)]"
      />
    </section>
  )
}
