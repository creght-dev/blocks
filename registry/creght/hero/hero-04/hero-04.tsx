import { ArrowLeft, ArrowRight, ChevronDown, Globe2, Menu, SunMedium } from "lucide-react"

export type Hero04Props = {
  className?: string
}

const navItems = ["Product", "About Us", "Features", "FAQ", "Contact"]
const heroImage = "https://fsu.creght.com/_assets/site/2064188570427461632/1782288320823__prism_horizon_hero.png"

export function Hero04({ className = "" }: Hero04Props) {
  return (
    <section
      className={`relative min-h-[720px] w-full overflow-hidden bg-[#89b1bd] text-white ${className}`}
    >
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[58%_50%]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,79,94,0.48),rgba(34,79,94,0.2)_42%,rgba(34,79,94,0.1)),linear-gradient(180deg,rgba(28,72,88,0.16),rgba(246,238,198,0.08)_72%,rgba(55,42,24,0.12))]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 lg:px-[58px]">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-4 min-[900px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[900px]:gap-x-5">
          <a href="#" className="flex items-center gap-2 text-white">
            <SunMedium className="size-7 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            <span className="font-serif text-[28px] italic leading-none tracking-[-0.04em] drop-shadow-sm">
              Prism
            </span>
          </a>

          <nav className="hidden min-w-0 items-center justify-center gap-5 text-[15px] font-medium text-white/88 drop-shadow-sm min-[900px]:flex lg:gap-8 xl:gap-[54px]">
            {navItems.map((item) => (
              <a key={item} href="#" className="shrink-0 transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-2 sm:gap-4 lg:gap-5">
            <details className="group relative min-[900px]:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 text-sm font-semibold text-white shadow-[0_14px_44px_rgba(31,72,86,0.18)] backdrop-blur-md transition hover:bg-white/18 [&::-webkit-details-marker]:hidden">
                <Menu className="size-4" aria-hidden="true" />
                Menu
                <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden="true" />
              </summary>

              <nav className="absolute right-0 top-[calc(100%+12px)] z-20 w-[220px] overflow-hidden rounded-[18px] border border-white/18 bg-[#d7e5e8]/90 p-2 text-sm font-semibold text-[#2f4852] shadow-[0_24px_70px_rgba(31,72,86,0.28)] backdrop-blur-xl">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block rounded-[12px] px-4 py-3 transition hover:bg-white/64 hover:text-[#1f3943]"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </details>

            <button
              type="button"
              className="hidden min-h-10 items-center gap-2 rounded-full px-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white sm:flex min-[900px]:px-0 min-[900px]:hover:bg-transparent"
              aria-label="Change language"
            >
              <Globe2 className="size-4" aria-hidden="true" />
              EN
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
            <a
              href="#"
              className="hidden min-h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#303642] shadow-[0_14px_40px_rgba(35,71,82,0.18)] transition hover:bg-white/88 min-[520px]:inline-flex sm:px-6 sm:text-base"
            >
              Sign up
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-8 pb-8 pt-24 sm:pt-32 lg:grid-cols-[minmax(0,760px)_1fr] lg:pb-[82px] lg:pt-[120px]">
          <div className="min-w-0 max-w-[760px]">
            <h1 className="max-w-full text-[42px] font-light leading-[0.98] tracking-[-0.04em] drop-shadow-[0_2px_18px_rgba(27,69,83,0.2)] min-[420px]:text-[48px] sm:text-[74px] lg:text-[72px]">
              Unlock the <span className="block sm:inline">Power</span>
              <span className="mt-2 block max-w-[8.5ch] font-serif text-[44px] italic leading-[0.9] tracking-[-0.065em] min-[520px]:max-w-none min-[420px]:text-[50px] sm:text-[78px] lg:text-[74px]">
                Beyond the Horizon
              </span>
            </h1>

            <p className="mt-7 max-w-[22rem] text-[18px] font-medium leading-[1.42] text-white/90 drop-shadow-[0_1px_12px_rgba(24,67,82,0.2)] sm:mt-8 sm:max-w-[690px] sm:text-[22px] lg:max-w-[720px]">
              Discover a new dimension of possibilities where innovation, imagination,
              and technology converge to shape the future.
            </p>

            <div className="mt-9 flex max-w-full flex-wrap items-center gap-4 sm:gap-8">
              <a
                href="#"
                className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-[#2b3035] shadow-[0_18px_54px_rgba(39,81,94,0.2)] transition hover:bg-white/90 sm:min-h-[60px] sm:px-9 sm:text-lg"
              >
                Explore More
              </a>
              <a
                href="#"
                className="inline-flex min-h-[58px] items-center gap-3 rounded-full border-2 border-white/86 bg-white/8 px-6 text-base font-semibold text-white shadow-[0_14px_42px_rgba(30,71,85,0.12)] backdrop-blur-[3px] transition hover:bg-white/18 sm:gap-4 sm:px-8 sm:text-lg"
              >
                Start Journey
                <ArrowRight className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="hidden justify-self-end pt-1 lg:block">
            <div className="w-[242px] rounded-[16px] bg-[#a9c1cc]/58 p-3 shadow-[0_24px_80px_rgba(36,76,88,0.22)] ring-1 ring-white/12 backdrop-blur-md">
              <img
                src={heroImage}
                alt=""
                className="h-[187px] w-full rounded-[9px] object-cover object-[61%_65%]"
              />
              <p className="mx-auto mt-4 max-w-[200px] pb-1 text-center text-xs font-medium leading-[1.18] text-white/62">
                Welcome to the next level of mindset, fuel your thoughts with clarity
              </p>
            </div>
          </aside>
        </main>

        <div className="pointer-events-auto absolute bottom-[30%] right-5 hidden gap-6 sm:flex lg:right-[62px]">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/16 text-white/80 backdrop-blur-md transition hover:bg-white/26 hover:text-white"
            aria-label="Previous slide"
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/16 text-white/80 backdrop-blur-md transition hover:bg-white/26 hover:text-white"
            aria-label="Next slide"
          >
            <ArrowRight className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero04
