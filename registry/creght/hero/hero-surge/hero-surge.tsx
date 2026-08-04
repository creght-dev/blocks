import { Menu, X } from "lucide-react"
import { useState } from "react"

import { MeshGradient } from "./MeshGradient"

export type HeroSurgeProps = {
  className?: string
}

function SurgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M17.8 2.7 5 17.1l9.6 2.1-1.8 10.1L27 12.7l-9.9-2.1.7-7.9Z" fill="currentColor" opacity="0.95" />
      <path d="m13.3 7.9-5.8 6.6 7.1 1.6 2.5-5.5-3.8-2.7Z" fill="white" opacity="0.72" />
    </svg>
  )
}

export function HeroSurge({ className = "" }: HeroSurgeProps) {
  const navItems = ["Platform", "Workflows", "Signals", "Docs", "Pricing"]
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <section className={`relative min-h-[100svh] w-full overflow-hidden bg-[#7068ff] text-white ${className}`}>
      <MeshGradient />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#554dff]/55 to-transparent" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-4 py-4 sm:px-8 sm:py-5 lg:px-14 xl:px-20">
        <header className="relative grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:min-h-14 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
          <a href="#" className="inline-flex items-center gap-3 text-white">
            <SurgeMark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
            <span className="text-[22px] font-semibold uppercase leading-none sm:text-[26px]">SURGE</span>
          </a>

          <nav className="hidden items-center gap-9 text-[18px] font-medium text-white/60 lg:flex xl:gap-12">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#"
            className="hidden min-h-14 items-center justify-center rounded-full border border-white/18 bg-white/5 px-7 text-[17px] font-semibold text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur transition hover:border-white/34 hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            Start building
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="hero-surge-mobile-menu"
            className="inline-grid size-11 place-items-center rounded-full border border-white/18 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition hover:bg-white/14 lg:hidden"
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>

          <div
            id="hero-surge-mobile-menu"
            className={`absolute left-0 right-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[18px] border border-white/16 bg-[#5f57f5]/88 p-2 shadow-[0_24px_80px_rgba(45,40,124,0.38)] backdrop-blur-xl transition duration-200 lg:hidden ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <nav className="grid text-sm font-semibold text-white/78">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[14px] px-4 py-3 transition hover:bg-white/12 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-white/90"
            >
              Start building
            </a>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center pb-10 pt-14 text-center sm:pb-[8vh] sm:pt-24">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center">
            <h1 className="max-w-[340px] text-[42px] font-light leading-[1.04] text-white sm:max-w-[760px] sm:text-[76px] sm:leading-[0.98] md:max-w-[980px] md:text-[96px] lg:max-w-[1080px] lg:text-[112px]">
              Build AI products
              <br />
              that surge ahead
            </h1>

            <p className="mt-7 max-w-[330px] text-[18px] font-medium leading-7 text-white/74 sm:mt-10 sm:max-w-[720px] sm:text-[24px] sm:leading-10">
              Orchestrate models, data, and release workflows in one responsive layer{" "}
              <br className="hidden sm:block" />
              built for teams shipping reliable AI at production speed.
            </p>

            <a
              href="#"
              className="mt-10 inline-flex min-h-[58px] w-full max-w-[246px] items-center justify-center rounded-full bg-white px-7 text-[18px] font-semibold text-zinc-950 shadow-[0_24px_70px_rgba(47,44,135,0.28)] transition hover:-translate-y-0.5 hover:bg-white/90 sm:mt-14 sm:min-h-[70px] sm:min-w-[258px] sm:text-[21px]"
            >
              Start building
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSurge
