import { Menu, X } from "lucide-react"
import { useState } from "react"

import { ParticleCanvas } from "../../effects/particle/ParticleCanvas"

export type Hero02Props = {
    className?: string
}

function MileoneMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 92 32"
            fill="none"
            aria-hidden
            className={className}
        >
            <path
                d="M6 25C9.8 12.8 18.2 6.2 30.8 5.5L26.5 12.2C20.2 13.3 15.6 17.7 12.6 25H6Z"
                fill="currentColor"
            />
            <path
                d="M26.2 25C29.4 13 37.5 6.3 50.2 5.5L45.8 12.2C39.8 13.1 35.5 17.5 32.6 25H26.2Z"
                fill="currentColor"
            />
            <path d="M50.5 25V5.8H57.6V25H50.5Z" fill="currentColor" />
        </svg>
    )
}

export function Hero02({ className = "" }: Hero02Props) {
    const navItems = ["Product", "Solutions", "Resources", "Customers", "Pricing"]
    const [menuOpen, setMenuOpen] = useState(false)
    const MenuIcon = menuOpen ? X : Menu

    return (
        <section
            className={`relative min-h-screen w-full overflow-hidden bg-[#111312] text-white ${className}`}
        >
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(218,185,99,0.12),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.035),transparent_16%,transparent_84%,rgba(255,255,255,0.035))]"
                aria-hidden
            />
            <div
                className="absolute bottom-0 right-[7%] top-0 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"
                aria-hidden
            />
            <div
                className="absolute -right-8 top-0 h-full w-28 rounded-l-full border-l border-white/10 bg-white/[0.015] blur-[1px]"
                aria-hidden
            />

            <div className="absolute  z-0 inset-0 max-w-[760px] mx-auto">
                <ParticleCanvas
                    imageUrl={'https://fsu.creght.com/project/olctUKamjjC/mqaqHadgKfp__image_removebg_preview.png'}
                    effect="pulse"
                    particleCount={115000}
                    particleSize={150}
                    canvasBackgroundColor="#111312"
                    particleColorMode="original"
                    interactionMode="manual"
                    listenForKeyboardToggle={false}
                    pauseAnimationWhenHidden
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>

            <div className="pointer-events-none relative z-10 flex min-h-[100dvh] flex-col px-5 py-5 sm:px-8 md:px-12 lg:px-[72px]">
                <header className="pointer-events-auto relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-6">
                    <a href="#" className="flex min-h-10 items-center gap-2 text-[#f5df83]">
                        <MileoneMark className="h-7 w-12 shrink-0" />
                        <span className="font-sans text-xl font-medium uppercase leading-none tracking-[0.03em] text-zinc-100 sm:text-[30px]">
                            MILE<span className="text-[#f5df83]">ONE</span>
                        </span>
                    </a>

                    <nav className="pointer-events-auto hidden items-center justify-center gap-7 text-[13px] font-medium text-zinc-300 md:flex lg:gap-9">
                        {navItems.map((item) => (
                            <a key={item} href="#" className="transition hover:text-white">
                                {item}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="#"
                        className="hidden min-h-10 items-center justify-center rounded-[8px] bg-white px-4 text-sm font-semibold text-zinc-950 shadow-[0_18px_44px_rgba(255,255,255,0.12)] transition hover:bg-[#f5df83] md:inline-flex lg:min-h-12 lg:px-6"
                    >
                        Get Started Free
                    </a>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="hero-02-mobile-menu"
                        className="inline-grid size-11 place-items-center rounded-[8px] border border-white/12 bg-white/8 text-white shadow-[0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur transition hover:bg-white/14 md:hidden"
                    >
                        <MenuIcon className="size-5" aria-hidden="true" />
                    </button>

                    <div
                        id="hero-02-mobile-menu"
                        className={`absolute left-0 right-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[10px] border border-white/12 bg-[#161817]/92 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 md:hidden ${
                            menuOpen
                                ? "translate-y-0 opacity-100"
                                : "pointer-events-none -translate-y-2 opacity-0"
                        }`}
                    >
                        <nav className="grid text-sm font-medium text-zinc-300">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-[8px] px-4 py-3 transition hover:bg-white/8 hover:text-white"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <a
                            href="#"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 flex min-h-11 items-center justify-center rounded-[8px] bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-[#f5df83]"
                        >
                            Get Started Free
                        </a>
                    </div>
                </header>

                <div className="grid flex-1 grid-rows-[1fr_auto] pt-14 sm:pt-16">
                    <div aria-hidden />

                    <div className="pointer-events-auto grid items-end gap-8 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:pb-10">
                        <h1 className="max-w-[690px] font-serif text-[40px] leading-[0.98] tracking-[-0.04em] text-zinc-100 min-[380px]:text-[44px] sm:text-[62px] md:text-[72px] lg:text-[76px]">
                            The Intelligent
                            <br />
                            Layer For{" "}
                            <span className="text-zinc-500">AI Systems</span>
                        </h1>

                        <p className="max-w-[360px] pb-2 text-sm leading-6 text-zinc-400 md:justify-self-end md:text-[15px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Phasellus enim tellus, viverra commodo bibendum in, fringilla
                            ut mi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero02
