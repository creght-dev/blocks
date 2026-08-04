import { ParticleCanvas } from "../../effects/particle/ParticleCanvas"

export type Hero01Props = {
    className?: string
}

function XLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className={className}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

function InstagramLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={className}
        >
            <rect
                x="3.5"
                y="3.5"
                width="17"
                height="17"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.3" cy="6.8" r="1.2" fill="currentColor" />
        </svg>
    )
}

function AxisLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={className}
        >
            <path d="M12 2.5V21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M2.5 12H21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path
                d="M5.2 5.2L18.8 18.8M18.8 5.2L5.2 18.8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    )
}

export function Hero01({ className = "" }: Hero01Props) {
    return (
        <section
            className={`relative min-h-screen w-full overflow-hidden bg-black text-white ${className}`}
        >
            <div className="absolute inset-0 z-0 min-h-[100dvh]" aria-hidden>
                <ParticleCanvas

                    canvasBackgroundColor="#000000"
                    listenForKeyboardToggle={false}
                    particleColorMode="original"
                    pauseAnimationWhenHidden

                    className="pointer-events-none absolute inset-0 h-full min-h-[100dvh] w-full"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        minHeight: "100%",
                    }}
                />
            </div>

            <div className="pointer-events-none relative z-10 flex min-h-[100dvh] flex-col px-6 pb-6 pt-6 sm:px-10 md:px-14 lg:px-16 lg:pb-10">
                <header className="pointer-events-auto flex items-start justify-between">
                    <div className="flex items-center gap-2.5 text-white">
                        <AxisLogo className="size-5 text-gray-200" />
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-200 sm:text-xs">
                            Axis AI
                        </p>
                    </div>
                    <a
                        href="#"
                        className="inline-flex min-h-8 items-center border border-[#22c55e]/70 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#22c55e] transition hover:bg-[#22c55e]/10"
                    >
                        Join the Waitlist
                    </a>
                </header>

                <div className="flex flex-1 items-end justify-between gap-6 pt-16 sm:pt-20 md:pt-24">
                    <div className="pointer-events-auto max-w-[36rem]">
                        <h1 className="font-mono text-xl uppercase leading-[1.1] tracking-[0.06em] text-gray-100  md:text-3xl">
                            <span>ROBOT INTELLIGENCE IS NOT BUILT BY A FEW;</span>
                            <span className="mt-1 text-[#22c55e] block">IT&apos;S BUILT BY ALL.</span>
                        </h1>
                        <p className="mt-5 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.06em] text-gray-300 sm:text-xs">
                            Join us in transforming diverse human intelligence into robotic
                            general intelligence.
                        </p>

                        <div className="mt-6 max-w-md">
                            <button
                                type="button"
                                className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center bg-[#00ff7f] px-5 font-mono text-sm uppercase tracking-[0.08em] text-black transition hover:bg-[#2cff95]"
                            >
                                Join the Waitlist
                            </button>
                            <p className="mt-3 font-mono text-[10px] tracking-[0.08em] text-[#22c55e]">
                                Early access will be granted in order of registration.
                            </p>
                        </div>

                        <footer className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="#"
                                className="inline-flex min-h-11 items-center gap-2.5 border border-gray-600/90 px-4 py-2 font-mono text-xs tracking-[0.05em] text-gray-200 transition hover:border-gray-400 hover:text-white"
                            >
                                <InstagramLogo className="size-3.5 shrink-0 text-gray-300" />
                                Join Discord
                            </a>
                            <a
                                href="#"
                                className="inline-flex min-h-11 items-center gap-2.5 border border-gray-600/90 px-4 py-2 font-mono text-xs tracking-[0.05em] text-gray-200 transition hover:border-gray-400 hover:text-white"
                            >
                                <XLogo className="size-3.5 shrink-0 text-gray-300" />
                                Follow on X
                            </a>
                        </footer>
                    </div>

                    <aside className="pointer-events-auto mb-1 hidden w-52 shrink-0 text-right md:block">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">
                            Total Hash Power Connected
                        </p>
                        <p className="mt-1 font-mono text-base text-gray-100">462.8 PFLOPS</p>

                        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">
                            Identity Agents
                        </p>
                        <p className="mt-1 font-mono text-base text-gray-100">20,163.4</p>

                        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">
                            Active Networks
                        </p>
                        <p className="mt-1 font-mono text-base text-gray-100">8,882</p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default Hero01
