import { Menu, X } from "lucide-react"
import { useState } from "react"

import { ParticleButterfly } from "./ParticleButterfly"

export type HeroMileoneProps = {
  className?: string
}

const navItems = ["Product", "Solutions", "Resources", "Customers", "Pricing"]

function MileoneMark() {
  return (
    <svg
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 18C2.5 13.5 6 9.5 10.5 9.5C15 9.5 18 13.5 18 18"
        stroke="#eaff80"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M10.5 18C10.5 13.5 14 9.5 18.5 9.5C23 9.5 26 13.5 26 18"
        stroke="#eaff80"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

export function HeroMileone({ className = "" }: HeroMileoneProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <section
      className={`relative min-h-[100svh] w-full overflow-hidden bg-black text-white sm:min-h-[660px] ${className}`}
    >
      <div className="absolute inset-0 z-0">
        <ParticleButterfly />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.1)_48%,rgba(0,0,0,0.72)_100%),linear-gradient(180deg,rgba(0,0,0,0.2)_0%,transparent_34%,rgba(0,0,0,0.72)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col px-4 py-4 sm:min-h-[660px] sm:px-8 md:py-8 lg:px-10">
        <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 min-[920px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[920px]:gap-5">
          <a
            href="#"
            className="flex min-w-0 items-center gap-2 text-white transition hover:opacity-82"
            aria-label="Mileone home"
          >
            <MileoneMark />
            <span className="truncate text-base font-bold uppercase leading-none tracking-[0.15em] sm:text-lg">
              Mileone
            </span>
          </a>

          <nav className="hidden items-center justify-self-center gap-8 text-[13px] font-medium tracking-wide text-zinc-400 min-[920px]:flex lg:gap-10">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition duration-300 hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#"
            className="hidden min-h-11 shrink-0 items-center justify-center justify-self-end rounded-[4px] bg-white px-5 text-[13px] font-semibold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition duration-300 hover:bg-zinc-200 min-[920px]:inline-flex"
          >
            Get Started Free
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mileone-mobile-menu"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center justify-self-end rounded-[4px] border border-[#eaff80]/45 bg-[#eaff80]/12 text-[#eaff80] shadow-[0_0_18px_rgba(234,255,128,0.12)] backdrop-blur transition hover:bg-[#eaff80]/20 min-[920px]:hidden"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            id="mileone-mobile-menu"
            className={`absolute left-0 right-0 top-[calc(100%+14px)] z-20 overflow-hidden rounded-[6px] border border-white/12 bg-black/82 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl transition duration-200 min-[920px]:hidden ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <nav className="grid p-2 text-sm font-medium text-zinc-300">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[4px] px-3 py-3 transition hover:bg-white/8 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="border-t border-white/10 p-2">
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-[4px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-end justify-between gap-8 pb-7 pt-14 sm:pt-20 md:gap-10 md:pb-12">
          <div className="max-w-[42rem] min-w-0">
            <p className="mb-5 max-w-[22rem] text-sm font-medium leading-6 text-[#eaff80]/80 md:hidden">
              Build, observe, and scale intelligent products with one adaptive AI
              systems layer.
            </p>
            <h1 className="[font-family:Georgia,serif] text-[34px] font-normal leading-[1.06] tracking-[-0.02em] text-[#f4f4f4] min-[380px]:text-[38px] min-[420px]:text-[42px] sm:text-[52px] lg:text-[56px]">
              The Intelligent
              <br />
              <span className="text-[#a0a0a0]">Layer For AI</span>
              <span className="hidden sm:inline"> </span>
              <span className="block text-[#a0a0a0] sm:inline">Systems</span>
            </h1>
          </div>

          <p className="mb-2 hidden max-w-[320px] text-left text-[13px] font-medium leading-[1.8] text-[#888888] md:block">
            Build, observe, and scale intelligent products with one adaptive AI
            systems layer for fast-moving product teams.
          </p>
        </main>
      </div>
    </section>
  )
}

export default HeroMileone
