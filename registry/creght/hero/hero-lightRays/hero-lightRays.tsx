import React from 'react'
import { ArrowRight, CircleDotDashed } from 'lucide-react'
import LightRays from './LightRays'

export function HeroLightRays() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020407] px-6 py-14 text-white sm:px-8 lg:px-12">
      <LightRays
        backgroundColor="#020407"
        intensity={28}
        rays={42}
        reach={56}
        position={50}
        raysColor={{ mode: 'multi', color1: '#6f96ff', color2: '#a7c3ff' }}
        animation={{ animate: true, speed: 5 }}
        className="opacity-95"
        style={{ zIndex: 0 }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_0%,rgba(75,117,198,0.24),transparent_34%),linear-gradient(180deg,rgba(7,19,38,0.34)_0%,rgba(2,4,7,0.2)_42%,#020407_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_84%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-b from-transparent via-[#020407]/80 to-[#020407]" />
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.72)_100%)]" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl flex-col items-center justify-center pt-10 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#6fa8d8]/25 bg-[#10243e]/55 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-300 shadow-[0_0_30px_rgba(67,132,190,0.22)] backdrop-blur-md sm:text-xs">
          <CircleDotDashed className="h-4 w-4 animate-spin text-slate-400 [animation-duration:4s]" />
          <span>New</span>
          <span className="text-white">Creght</span>
          <span>Component</span>
        </div>

        <h1 className="max-w-[880px] text-balance text-[3.35rem] font-semibold leading-[0.98] tracking-normal text-white sm:text-7xl lg:text-[5.25rem]">
          Animated{' '}
          <span className="whitespace-nowrap font-serif text-[0.98em] font-normal italic text-white">
            Light Rays
          </span>
          <br />
          Effect for Creght.
        </h1>

        <p className="mt-7 max-w-xl text-sm font-medium leading-6 text-slate-400 sm:text-base">
          Get more done with less effort, in a way that works for you.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a
            href="#"
            className="inline-flex h-12 min-w-36 items-center justify-center rounded-xl border border-[#6c94d9]/30 bg-[#10213c] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_38px_rgba(20,64,131,0.28)] transition duration-300 hover:border-[#91b3f7]/55 hover:bg-[#172b4b]"
          >
            Remix this project
          </a>
          <a
            href="#"
            className="inline-flex h-12 min-w-36 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-slate-400 transition duration-300 hover:text-white"
          >
            Learn more
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
    </section>
  )
}

export default HeroLightRays

export const metadata = {
  title: 'Animated Light Rays Effect for Creght',
  description: 'Get more done with less effort, in a way that works for you.',
}
