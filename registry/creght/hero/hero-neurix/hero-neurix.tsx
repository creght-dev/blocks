import { Menu, X } from "lucide-react"
import { useState } from "react"

import GradientBlinds from "./GradientBlinds"

export function HeroNeurix() {
  const navItems = ["HOME", "FEATURES", "RESOURCES", "PRICING"]
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050505] font-sans text-white">
      <nav className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:py-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter">NEURIX</span>
        </div>

        <div className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-400 md:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="transition-colors hover:text-white">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 text-sm font-medium sm:gap-4">
          <a href="#" className="hidden text-gray-400 transition-colors hover:text-white sm:inline">
            Log in
          </a>
          <a
            href="#"
            className="group hidden items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white transition-all hover:bg-zinc-700 min-[430px]:flex sm:px-5"
          >
            Start Free
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="neurix-mobile-menu"
            className="inline-grid size-10 place-items-center rounded-lg border border-zinc-700 bg-zinc-800 text-white transition-all hover:bg-zinc-700 md:hidden"
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          id="neurix-mobile-menu"
          className={`absolute left-5 right-5 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 md:hidden ${
            menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="grid text-sm font-medium text-gray-400">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 transition hover:bg-white/8 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex min-h-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-white transition-all hover:bg-zinc-700 sm:hidden"
          >
            Log in
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex min-h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-black transition-all hover:bg-zinc-200 min-[430px]:hidden"
          >
            Start Free
          </a>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 pb-12 pt-12 text-center md:pt-24">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 pr-4 text-[10px] backdrop-blur-sm sm:text-xs">
          <span className="scale-90 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-black">
            UPDATE
          </span>
          <span className="font-medium tracking-wide text-zinc-400">CUSTOMIZABLE AI LOGIC</span>
        </div>

        <h1 className="mb-6 text-[2.6rem] font-semibold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
          AI That Thinks With You <br />
          <span>Not For You</span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Neurix helps teams turn scattered data into confident decisions using adaptive AI
          workflows built for speed, clarity, and scale.
        </p>

        <div className="group relative w-full max-w-2xl">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-zinc-700 to-zinc-800 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <textarea
              className="h-24 w-full resize-none border-none bg-transparent text-base text-zinc-300 outline-none placeholder:text-zinc-600 focus:ring-0"
              placeholder="Ask Neurix anything..."
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  Attach
                </button>
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400">
                  Select style
                  <svg
                    className="h-3 w-3 opacity-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <button className="self-end rounded-lg bg-white p-2 text-black transition-colors hover:bg-zinc-200 sm:self-auto">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 flex w-full flex-col items-center gap-8 md:mt-32">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Trusted by experts at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 opacity-40 grayscale contrast-125 sm:gap-x-12">
            <span className="text-xl font-bold tracking-tight">Google</span>
            <span className="text-xl font-bold tracking-tight">Microsoft</span>
            <span className="text-xl font-bold tracking-tight">stripe</span>
            <span className="text-xl font-bold tracking-tight">amazon</span>
          </div>
        </div>
      </main>

      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full opacity-80">
        <GradientBlinds
          gradientColors={["#FFFFFF", "#F472B6", "#3B82F6", "#1E3A8A", "#050505"]}
          gradientColorsSecondary={["#FDF2F8", "#EC4899", "#2563EB", "#172554", "#050505"]}
          angle={0}
          noise={0.8}
          blindCount={16}
          blindMinWidth={60}
          spotlightRadius={0.7}
          spotlightSoftness={1.2}
          spotlightOpacity={1}
          distortAmount={0}
          mouseDampening={0.15}
          shineDirection="right"
          mirrorGradient
          mixBlendMode="screen"
        />
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  )
}

export default HeroNeurix
