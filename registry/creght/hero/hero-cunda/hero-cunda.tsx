// Use React's classic JSX transform to avoid the preview's missing __tzimg runtime.
/** @jsxRuntime classic */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CircleDashed,
  Menu,
  Play,
  Sparkles,
  X,
} from 'lucide-react'
import { useRevealMotion } from './useRevealMotion'
import HeroBackground from './HeroBackground'
import { DashboardPreview } from './DashboardPreview'
export { DashboardPreview } from './DashboardPreview'

export type HeroNavigationItem = {
  label: string
  href: string
}

type HeroProps = {
  navigation?: readonly HeroNavigationItem[]
  onOpenTour?: () => void
}

const defaultNavigation: readonly HeroNavigationItem[] = [
  { label: 'Product', href: '#features' },
  { label: 'Use cases', href: '#goals' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Stories', href: '#testimonials' },
]

const partnerLogos = [
  { name: 'Notion', src: 'https://cdn.simpleicons.org/notion/FFFFFF' },
  { name: 'Figma', src: 'https://cdn.simpleicons.org/figma/FFFFFF' },
  { name: 'Linear', src: 'https://cdn.simpleicons.org/linear/FFFFFF' },
  { name: 'Asana', src: 'https://cdn.simpleicons.org/asana/FFFFFF' },
  { name: 'GitHub', src: 'https://cdn.simpleicons.org/github/FFFFFF' },
  { name: 'Stripe', src: 'https://cdn.simpleicons.org/stripe/FFFFFF' },
]

function Brand() {
  return (
    <a className="inline-flex items-center gap-2.5 text-white" href="#top" aria-label="Cunda home">
      <CircleDashed size={26} strokeWidth={2.7} />
      <span className="text-[21px] font-semibold tracking-[-0.06em]">Cunda.</span>
    </a>
  )
}

function Button({ children, href, light = false }: { children: string; href?: string; light?: boolean }) {
  const className = `cunda-cta-button inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold transition duration-200 hover:-translate-y-0.5 ${light ? 'bg-[linear-gradient(325deg,#0044ff_0%,#2ccfff_55%,#0044ff_90%)] text-white shadow-[0_0_22px_rgba(71,184,255,.28),inset_3px_3px_7px_rgba(175,230,255,.28),inset_-3px_-3px_7px_rgba(19,95,216,.25)] hover:brightness-110' : 'bg-[#111722] text-white shadow-[0_8px_22px_rgba(4,12,30,.18)] hover:bg-[#25324a]'}`

  return (
    <a className={className} href={href ?? '#pricing'}>
      {children}
      <ArrowRight size={15} />
    </a>
  )
}

export default function Hero({
  navigation = defaultNavigation,
  onOpenTour = () => {},
}: HeroProps) {
  const reveal = useRevealMotion()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section className="cunda-hero relative isolate overflow-hidden bg-[#040506] px-5 pb-20 pt-5 text-white sm:px-8 sm:pt-6 sm:pb-24">
      <HeroBackground />
      <motion.header
        {...reveal({ onLoad: true, distance: -12, duration: 0.65 })}
        className="mx-auto flex max-w-[1240px] items-center justify-between"
      >
        <Brand />
        <nav className="hidden items-center gap-8 text-[14px] text-white/80 lg:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-[14px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
          >
            Get Started
          </a>
        </div>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-lg border border-white/20 bg-white/10 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </motion.header>
      {mobileOpen && (
        <nav className="mx-auto mt-3 grid max-w-[1240px] gap-1 rounded-xl border border-white/15 bg-[#15376f]/95 p-2 lg:hidden">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-[14px] text-white/80 hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg border border-white/25 bg-transparent px-3 py-2 text-[14px] text-white transition hover:border-white/50 hover:bg-white/10"
          >
            Get Started
          </a>
        </nav>
      )}
      <div className="mx-auto mt-[76px] max-w-[1000px] text-center sm:mt-[92px]">
        <motion.span
          {...reveal({ onLoad: true, delay: 0.1, distance: 16, blur: 4 })}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.09] px-3.5 py-1.5 text-[10px] text-white/90 backdrop-blur"
        >
          <Sparkles size={12} className="text-[#b4caff]" />
          One workspace for better business
        </motion.span>
        <h1 className="mx-auto mt-6 max-w-[900px] text-balance text-[clamp(42px,6.4vw,78px)] font-normal leading-[.99] tracking-[-.065em]">
          <motion.span
            {...reveal({ onLoad: true, delay: 0.2, distance: 32, blur: 6, duration: 0.95 })}
            className="block"
          >
            Simplify your workflow.
          </motion.span>
          <motion.span
            {...reveal({ onLoad: true, delay: 0.32, distance: 32, blur: 6, duration: 0.95 })}
            className="block text-white/75"
          >
            Supercharge your team.
          </motion.span>
        </h1>
        <motion.p
          {...reveal({ onLoad: true, delay: 0.46, distance: 20 })}
          className="mx-auto mt-5 max-w-[620px] text-pretty text-[14px] leading-6 text-white/75 sm:text-[16px] sm:leading-7"
        >
          Manage projects, understand your finances, and keep your team moving—all in one calm,
          connected workspace.
        </motion.p>
        <motion.div
          {...reveal({ onLoad: true, delay: 0.58, distance: 18 })}
          className="mt-7 flex flex-wrap justify-center gap-3"
        >
          <Button href="#pricing" light>
            Get started free
          </Button>
          <button
            type="button"
            onClick={onOpenTour}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/[0.06] px-5 text-[13px] font-semibold text-white transition hover:bg-white/15"
          >
            <Play size={13} fill="currentColor" />
            Watch product tour
          </button>
        </motion.div>
      </div>
      <motion.div
        {...reveal({ onLoad: true, delay: 0.68, distance: 48, scale: 0.97, duration: 1.1 })}
        className="relative mx-auto mt-12 max-w-[1120px] sm:mt-14"
      >
        <DashboardPreview />
        <span className="pointer-events-none absolute -bottom-9 left-[14%] h-20 w-[72%] rounded-full bg-[#3f7fff]/35 blur-[50px]" />
      </motion.div>
      <div className="mx-auto mt-12 max-w-[980px] text-center">
        <motion.p
          {...reveal({ distance: 16 })}
          className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/45"
        >
          Illustrative integrations · Free brand icons
        </motion.p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {partnerLogos.map((logo, index) => (
            <motion.span
              {...reveal({ delay: index * 0.06, distance: 16, duration: 0.65 })}
              key={logo.name}
              className="inline-flex items-center gap-2.5 text-white/75 transition hover:text-white"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="size-[20px] shrink-0 object-contain opacity-90"
                loading="lazy"
              />
              <span className="text-[13px] font-semibold tracking-[-.025em]">{logo.name}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}

export const metadata = {
  title: 'Cunda Workspace Hero',
  description: 'A dark Cunda workspace hero with an animated ray background and dashboard preview.',
}
