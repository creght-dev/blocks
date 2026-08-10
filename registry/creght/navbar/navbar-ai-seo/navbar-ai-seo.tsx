"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Building2,
  ChevronDown,
  CircleHelp,
  FileSearch,
  Menu,
  Radar,
  Sparkles,
  Target,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

type DropdownKey = "features" | "company"

type DropdownItem = {
  description: string
  href: string
  icon: LucideIcon
  label: string
}

export type NavbarAiSeoProps = {
  className?: string
}

const LOGO_IMAGE =
  "https://fsu.creght.com/site/2083536173505974272/1786355770118__creght_blocks_external_004.png"

const LOGO_VIDEO =
  "https://framerusercontent.com/assets/lN121Od6cmfJkXFXD2gnsHz0yn4.mp4"

const featureItems: DropdownItem[] = [
  {
    description: "Track how your brand appears across high-intent searches.",
    href: "#features",
    icon: Radar,
    label: "Visibility radar",
  },
  {
    description: "Turn topic gaps into a focused editorial roadmap.",
    href: "#features",
    icon: Target,
    label: "Content opportunities",
  },
  {
    description: "See technical blockers before they slow organic growth.",
    href: "#features",
    icon: FileSearch,
    label: "Site intelligence",
  },
  {
    description: "Measure the searches that influence qualified pipeline.",
    href: "#stories",
    icon: BarChart3,
    label: "Revenue analytics",
  },
]

const companyItems: DropdownItem[] = [
  {
    description: "Meet the people building a clearer way to grow in search.",
    href: "#footer",
    icon: Building2,
    label: "About",
  },
  {
    description: "Read practical playbooks from our search strategy team.",
    href: "#stories",
    icon: Sparkles,
    label: "Field notes",
  },
  {
    description: "Get thoughtful answers from a real product specialist.",
    href: "#footer",
    icon: CircleHelp,
    label: "Contact",
  },
  {
    description: "Help ambitious teams make search performance legible.",
    href: "#footer",
    icon: Users,
    label: "Careers",
  },
]

function DropdownPanel({
  items,
  onNavigate,
}: {
  items: DropdownItem[]
  onNavigate: () => void
}) {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 w-[352px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c0911]/95 p-2 shadow-[0_24px_80px_rgba(22,8,38,0.72),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,69,255,0.16),transparent_42%)]" />
      <div className="relative grid gap-1">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <a
              className="group flex gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ad77ff]"
              href={item.href}
              key={item.label}
              onClick={onNavigate}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[#9b61ff]/20 bg-[#6e2bc4]/10 text-[#b888ff] transition group-hover:border-[#9b61ff]/40 group-hover:bg-[#6e2bc4]/20 group-hover:text-[#d4b7ff]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span>
                <strong className="block text-[13px] font-medium text-white/90">
                  {item.label}
                </strong>
                <span className="mt-1 block text-[11px] leading-[1.55] text-white/45">
                  {item.description}
                </span>
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function DesktopDropdown({
  activeDropdown,
  dropdownKey,
  items,
  label,
  setActiveDropdown,
}: {
  activeDropdown: DropdownKey | null
  dropdownKey: DropdownKey
  items: DropdownItem[]
  label: string
  setActiveDropdown: (value: DropdownKey | null) => void
}) {
  const isOpen = activeDropdown === dropdownKey

  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown(dropdownKey)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        aria-expanded={isOpen}
        className="flex h-[31.6px] items-center gap-[2px] px-3.5 text-[13px] font-normal leading-[15.6px] text-white/70 transition hover:text-white"
        onClick={() => setActiveDropdown(dropdownKey)}
        type="button"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`size-3 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#c8a5ff]" : ""}`}
        />
      </button>

      {isOpen ? (
        <DropdownPanel items={items} onNavigate={() => setActiveDropdown(null)} />
      ) : null}
    </div>
  )
}

const navLinkClass =
  "flex h-[31.6px] items-center px-3.5 text-[13px] font-normal leading-[15.6px] text-white/70 transition hover:text-white"

export default function NavbarAiSeo({ className = "" }: NavbarAiSeoProps) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMenus = () => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null)
        setMobileOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-50 h-[68px] bg-black/70 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.15)] [font-family:Inter,sans-serif] backdrop-blur-[7px] min-[810px]:h-[73.6px] ${className}`}
    >
      <div className="relative mx-auto flex h-full w-full items-center justify-between px-5 min-[810px]:w-[calc(100%_-_25px)] min-[810px]:max-w-[1400px]">
        <a
          aria-label="Home"
          className="relative z-10 size-[38px] overflow-hidden rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad77ff]"
          href="#top"
          onClick={closeMenus}
        >
          <video
            aria-hidden="true"
            autoPlay
            className="size-full object-cover"
            loop
            muted
            playsInline
            poster={LOGO_IMAGE}
            src={LOGO_VIDEO}
          />
        </a>

        <nav
          aria-label="Primary navigation"
          className="absolute left-1/2 top-1/2 hidden h-[43.6px] -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-full bg-white/[0.045] p-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-inset ring-white/[0.08] min-[810px]:flex min-[1200px]:left-[calc(50%_-_30.5px)]"
        >
          <DesktopDropdown
            activeDropdown={activeDropdown}
            dropdownKey="features"
            items={featureItems}
            label="Features"
            setActiveDropdown={setActiveDropdown}
          />
          <a className={navLinkClass} href="#features" onClick={closeMenus}>
            Developers
          </a>
          <DesktopDropdown
            activeDropdown={activeDropdown}
            dropdownKey="company"
            items={companyItems}
            label="Company"
            setActiveDropdown={setActiveDropdown}
          />
          <a className={navLinkClass} href="#stories" onClick={closeMenus}>
            Blog
          </a>
          <a className={navLinkClass} href="#stories" onClick={closeMenus}>
            Changelog
          </a>
        </nav>

        <div className="relative z-10 hidden min-[810px]:block">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-xl border border-white/[0.09]"
          />
          <a
            className="relative inline-flex h-[32.9px] w-[99.1px] items-center justify-center rounded-lg bg-[#8c45ff]/50 text-[13px] font-medium leading-[16.9px] text-white transition hover:bg-[#8c45ff]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd91ff]"
            href="#signup"
            onClick={closeMenus}
          >
            Join waitlist
          </a>
        </div>

        <div className="relative z-10 flex items-center gap-5 min-[810px]:hidden">
          <span className="relative inline-flex">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 rounded-xl border border-white/[0.09]"
            />
            <a
              className="relative inline-flex h-[32.9px] w-[99.1px] items-center justify-center rounded-lg bg-[#8c45ff]/50 text-[13px] font-medium leading-[16.9px] text-white transition hover:bg-[#8c45ff]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd91ff]"
              href="#signup"
              onClick={closeMenus}
            >
              Join waitlist
            </a>
          </span>
          <button
            aria-controls="ai-seo-mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="grid h-7 w-[29px] place-items-center p-0 text-white transition hover:text-[#c9a6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad77ff]"
            onClick={() => {
              setMobileOpen((open) => !open)
              setActiveDropdown(null)
            }}
            type="button"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="size-7" />
            ) : (
              <Menu aria-hidden="true" className="size-7" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-t border-white/[0.08] bg-black/95 px-5 pb-10 pt-7 backdrop-blur-2xl min-[810px]:hidden"
          id="ai-seo-mobile-navigation"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_0%,rgba(140,69,255,0.22),transparent_38%)]" />
          <nav aria-label="Mobile navigation" className="relative mx-auto grid max-w-2xl gap-2">
            {[
              ["Features", "#features"],
              ["Developers", "#features"],
              ["Company", "#footer"],
              ["Blog", "#stories"],
              ["Changelog", "#stories"],
            ].map(([label, href]) => (
              <a
                className="rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-4 text-sm font-medium text-white/85 transition hover:border-[#8c45ff]/40 hover:bg-[#8c45ff]/10"
                href={href}
                key={label}
                onClick={closeMenus}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
