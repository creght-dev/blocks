import { ChevronRight, Menu, Play, X } from "lucide-react"
import { useState } from "react"

export type HeroMolecularProps = {
  className?: string
}

const navItems = ["Technology", "Products", "Research", "About"]
const heroImage = "https://fsu.creght.com/project/mHbjYDMbTAO/mmoQRYDOFEl__image_2650.jpg"
const logoImage = "https://fsu.creght.com/project/mHbjYDMbTAO/mmoNwhWxTxc__image.png"

export function HeroMolecular({ className = "" }: HeroMolecularProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <section
      className={`isolate relative min-h-[720px] w-full overflow-hidden bg-black text-white ${className}`}
    >
      <img
        src={heroImage}
        alt=""
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[58%_43%]"
      />
      <div
        className="absolute inset-x-0 top-0 z-[1] h-48 bg-[radial-gradient(circle_at_54%_0%,rgba(54,111,255,0.34),transparent_44%)]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex min-h-[100dvh] w-full max-w-[1760px] flex-col px-4 py-4 sm:px-8 sm:py-6 lg:px-14">
        <header className="relative z-40 mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[36px] border border-white/12 bg-[#071234]/72 px-5 py-3 shadow-[0_24px_90px_rgba(0,38,130,0.38)] backdrop-blur-xl min-[900px]:grid-cols-[auto_minmax(0,1fr)_auto] sm:rounded-[42px] sm:px-8 sm:py-4">
          <a href="#" className="flex min-w-0 items-center text-white">
            <img
              src={logoImage}
              alt="LUMI"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="h-9 w-auto shrink-0 sm:h-10"
            />
          </a>

          <nav className="hidden items-center justify-center gap-7 text-[15px] font-semibold text-white/68 min-[900px]:flex lg:gap-12">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <a
              href="#"
              className="hidden min-h-12 items-center justify-center rounded-full border border-white/18 px-7 text-base font-semibold text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.08)] transition hover:border-white/36 hover:bg-white/10 min-[900px]:inline-flex"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="hero-molecular-mobile-menu"
              className="inline-grid size-11 place-items-center rounded-full border border-white/14 bg-white/8 text-white transition hover:bg-white/14 min-[900px]:hidden"
            >
              <MenuIcon className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div
            id="hero-molecular-mobile-menu"
            className={`absolute left-0 right-0 top-[calc(100%+12px)] z-50 overflow-hidden rounded-[20px] border border-white/12 bg-[#071234]/92 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-200 min-[900px]:hidden ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <nav className="grid text-sm font-semibold text-white/72">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[14px] px-4 py-3 transition hover:bg-white/10 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-[14px] border border-white/16 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              Contact
            </a>
          </div>
        </header>

        <main className="relative z-20 grid flex-1 items-end gap-10 pb-9 pt-20 sm:pb-14 sm:pt-24 lg:grid-cols-[minmax(0,770px)_1fr] lg:pb-20">
          <div className="max-w-[790px]">
            <p className="mb-5 inline-flex min-h-9 items-center rounded-full border border-white/12 bg-white/8 px-4 text-sm font-semibold text-white/72 backdrop-blur-md">
              Molecular systems platform
            </p>
            <h1 className="max-w-[12ch] text-[52px] font-light leading-[0.98] text-white min-[420px]:text-[64px] sm:text-[88px] lg:text-[96px]">
              Revolutionizing molecular innovation
            </h1>
            <p className="mt-6 max-w-[620px] text-lg font-medium leading-7 text-white/68 sm:text-xl sm:leading-8">
              Harnessing microscopic particle intelligence to transform material
              discovery, diagnostics, and industrial biology.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end lg:self-end">
            <a
              href="#"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 text-base font-semibold text-white shadow-[0_18px_60px_rgba(0,70,255,0.24)] backdrop-blur-md transition hover:border-white/40 hover:bg-white/16"
            >
              Products
              <ChevronRight className="size-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="grid size-14 place-items-center rounded-full border border-white/20 bg-white/8 text-white shadow-[0_18px_60px_rgba(0,70,255,0.2)] backdrop-blur-md transition hover:border-white/40 hover:bg-white/16"
              aria-label="Play introduction video"
            >
              <Play className="ml-0.5 size-5 fill-white" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </main>
      </div>
    </section>
  )
}

export default HeroMolecular
