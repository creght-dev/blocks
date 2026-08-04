import { Menu, X, Zap } from "lucide-react"
import { useState } from "react"

export type Hero03Props = {
  className?: string
}

const navItems = ["Product", "Solutions", "Resources", "Customers", "Pricing"]

export function Hero03({ className = "" }: Hero03Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <section
      className={`relative h-screen min-h-[640px] w-full overflow-hidden bg-black text-white ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-40 top-52 z-0 mx-auto w-[92vw] max-w-[430px] translate-x-10 sm:bottom-6 sm:top-12 sm:w-[64vw] sm:max-w-[560px] lg:top-10 lg:max-w-[720px]">
        <img
          src="https://ugc.talizen.com/_assets/site/2052003801170186240/1779179767214__image.png"
          alt=""
          className=" w-full object-contain "
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-[35px] lg:py-[34px]">
        <header className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 min-[880px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[880px]:gap-4">
          <a href="#" className="flex items-center gap-2.5">
            <Zap className="h-[22px] w-[22px] fill-white text-white" strokeWidth={0} />
            <span className="text-base font-bold leading-none tracking-[-0.01em] sm:text-lg">
              Fundora
            </span>
          </a>

          <nav className="hidden items-center gap-6 pr-0 text-sm font-medium text-[#8d8f9a] min-[880px]:flex lg:gap-[38px] lg:pr-[13px] lg:text-base">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#"
            className="hidden h-9 items-center justify-center whitespace-nowrap rounded-[4px] bg-white px-3 text-sm tracking-[0.01em] text-black transition hover:bg-zinc-200 min-[880px]:inline-flex sm:h-10 sm:px-4"
          >
            Get Started Free
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="hero-03-mobile-menu"
            className="inline-grid size-10 place-items-center rounded-[4px] border border-white/10 bg-white/8 text-white transition hover:bg-white/14 min-[880px]:hidden"
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>

          <div
            id="hero-03-mobile-menu"
            className={`absolute left-0 right-0 top-[calc(100%+12px)] z-20 overflow-hidden rounded-[6px] border border-white/10 bg-black/88 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 min-[880px]:hidden ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <nav className="grid text-sm font-medium text-[#a0a2ab]">
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
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex min-h-10 items-center justify-center rounded-[4px] bg-white px-3 text-sm text-black transition hover:bg-zinc-200"
            >
              Get Started Free
            </a>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col justify-between pt-14 sm:pt-20 lg:pt-[188px]">
          <h1 className="relative max-w-[11ch] font-serif text-5xl font-normal leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            The Intelligent
            <br />
            <span className="text-[#858585]">Layer For AI</span>
            <br />
            <span className="text-[#858585]">Systems</span>
          </h1>

          <div className="relative flex flex-col gap-5 pb-0 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-1">
            <div className="flex gap-10 sm:gap-16 lg:gap-[103px]">
              <div>
                <p className="font-sans text-4xl font-normal leading-none tracking-[-0.03em] text-white">
                  32
                </p>
                <p className="mt-[9px] text-sm font-medium leading-none text-[#777777] sm:text-base">
                  Designs Shipped
                </p>
              </div>
              <div>
                <p className="font-sans text-4xl font-normal leading-none tracking-[-0.03em] text-white">
                  94%
                </p>
                <p className="mt-[9px] text-sm font-medium leading-none text-[#777777] sm:text-base">
                  Positive feedback
                </p>
              </div>
            </div>

            <p className="relative max-w-none text-sm font-medium leading-[1.5] text-[#777777] sm:max-w-[340px] sm:text-base sm:leading-[1.62]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              fringilla ut mi.
              Phasellus enim tellus, viverra commodo bibendum in,
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero03
