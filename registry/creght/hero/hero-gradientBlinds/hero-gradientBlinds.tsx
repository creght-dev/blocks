import { useState } from 'react'
import { Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react'
import GradientBlinds from './GradientBlinds'

export function HeroGradientBlinds() {
  const navItems = ['Features', 'About', 'Newsletter', 'Newsletter']
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-60">
        <GradientBlinds
          gradientColors={['#000000', '#1a4d2e', '#4ade80', '#1a4d2e', '#000000']}
          blindCount={24}
          angle={0}
          noise={0.1}
          spotlightRadius={0.4}
          spotlightOpacity={0.8}
          spotlightSoftness={1.2}
          distortAmount={2}
        />
        {/* Dark overlay to ensure text readability and match the screenshot's depth */}
        <div
          className="absolute inset-0 
        pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-80"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-[100] mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-6 sm:px-6 md:px-12 md:py-8">
        <div className="text-xl font-bold tracking-tight italic">StartupSprint</div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          {navItems.map((item, index) => (
            <a
              key={`${item}-${index}`}
              href="#"
              className={`hover:text-white transition-colors ${
                index === navItems.length - 1 ? 'border-b border-white/20 pb-0.5' : ''
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <button className="hidden cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg transition-colors hover:bg-gray-200 sm:inline-flex">
          Join The Waitlist
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="gradient-blinds-mobile-menu"
          className="inline-grid size-11 place-items-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur transition hover:bg-white/14 md:hidden"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </button>

        <div
          id="gradient-blinds-mobile-menu"
          className={`absolute left-5 right-5 top-[calc(100%+8px)] z-[110] overflow-hidden rounded-[18px] border border-white/12 bg-black/88 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl transition duration-200 md:hidden ${
            menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <div className="grid text-sm font-medium text-gray-300">
            {navItems.map((item, index) => (
              <a
                key={`${item}-mobile-${index}`}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-[14px] px-4 py-3 transition hover:bg-white/8 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black transition-colors hover:bg-gray-200"
          >
            Join The Waitlist
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 pointer-events-none flex flex-col items-center justify-center pt-16 pb-12 px-5 text-center max-w-4xl mx-auto sm:px-6 sm:pt-24">
        {/* Waitlist Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full mb-8">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
              </div>
            ))}
          </div>
          <span className="text-[11px] md:text-sm font-medium text-gray-300">
            2.4K currently on the waitlist
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[2.75rem] sm:text-5xl md:text-8xl 
        pointer-events-none
        font-medium tracking-tight mb-4 text-white drop-shadow-sm"
        >
          Building the Future
        </h1>
        <h2
          className="text-4xl sm:text-5xl md:text-7xl 
        pointer-events-none font-light italic mb-8 text-gray-100 font-serif"
        >
          One Startup at a Time.
        </h2>

        {/* Description */}
        <p
          className="max-w-md mx-auto 
        pointer-events-none text-gray-400 text-sm md:text-base leading-relaxed mb-10"
        >
          Be the first to know when we launch. <br className="hidden md:block" />
          Join the waitlist and get exclusive early access.
        </p>

        {/* CTA Form */}
        <div
          className="w-full max-w-md bg-white/5 border border-white/10 p-1.5 rounded-[22px] flex flex-col gap-2 items-stretch mb-12 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:gap-0
      pointer-events-auto"
        >
          <input
            type="email"
            placeholder="Enter Your Email"
            className="min-w-0 flex-1 bg-transparent px-4 py-2 outline-none text-white text-sm sm:px-6"
          />
          <button
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors 
          cursor-pointer whitespace-nowrap"
          >
            Join The Waitlist
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-5">
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Twitter size={16} />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Instagram size={16} />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
          >
            <Linkedin size={16} fill="white" />
          </a>
        </div>
      </main>

      {/* Decorative vertical blinds at bottom for more depth (optional tweak for style) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none bg-gradient-to-t from-black to-transparent z-0" />
    </div>
  )
}

export default HeroGradientBlinds

export const metadata = {
  title: 'StartupSprint - Building the Future One Startup at a Time',
  description:
    'Be the first to know when we launch. Join the waitlist and get exclusive early access to the future of startups.',
}
