"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Gauge,
  ListChecks,
  Mail,
  Menu,
  MessageCircleMore,
  Shapes,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from "lucide-react"

type DropdownKey = "features" | "company"

type MenuItem = {
  description?: string
  href: string
  icon: LucideIcon
  label: string
}

export type NavbarAiSeoProps = {
  className?: string
}

const LOGO_IMAGE = "https://fsu.creght.com/site/2083536173505974272/1789974846437__creght_blocks_ai_seo_source_logo_poster.avif"
const LOGO_VIDEO = "https://fsu.creght.com/site/2083536173505974272/1789974847225__creght_blocks_ai_seo_source_logo.mp4"

const featureItems: MenuItem[] = [
  { description: "Perform SEO audits", href: "#features", icon: Gauge, label: "Dashboard" },
  { description: "Simple corrections", href: "#feature-list", icon: ListChecks, label: "Content evaluation" },
  { description: "Set and achieve SEO goals", href: "#features", icon: Target, label: "SEO goals" },
  { description: "Automatic suggestions", href: "#features", icon: Sparkles, label: "Smart Keyword Generator" },
  { description: "Automatic notifications", href: "#feature-list", icon: Bell, label: "Automated alerts" },
]

const companyItems: MenuItem[] = [
  { description: "Our vision", href: "#footer", icon: MessageCircleMore, label: "About" },
  { description: "Join our team", href: "#footer", icon: BriefcaseBusiness, label: "Careers" },
  { description: "Brand assets & media", href: "#footer", icon: Shapes, label: "Press Kit" },
  { description: "Get in touch", href: "#signup", icon: Mail, label: "Contact" },
]

function MenuRow({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const Icon = item.icon

  return (
    <a className="group flex h-10 items-center gap-2.5" href={item.href} onClick={onNavigate} role="menuitem">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/[0.15] bg-white/[0.05] text-white transition group-hover:border-white/30 group-hover:bg-white/[0.09]">
        <Icon aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <strong className="block truncate text-[14px] font-medium leading-[17px] text-white">
          {item.label}
        </strong>
        {item.description ? (
          <span className="mt-0.5 block truncate text-[13px] leading-[16px] text-white/55">
            {item.description}
          </span>
        ) : null}
      </span>
    </a>
  )
}

function FeaturesPanel({ id, labelledBy, onNavigate }: { id: string; labelledBy: string; onNavigate: () => void }) {
  return (
    <div
      aria-labelledby={labelledBy}
      className="absolute left-[-100px] top-full z-50 mt-[11px] h-[340px] w-[694px] overflow-hidden rounded-[10px] border border-white/[0.15] bg-black p-5 shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
      id={id}
      role="menu"
    >
      <div className="grid h-full grid-cols-[300px_1fr] gap-[26px]">
        <div className="flex flex-col justify-between py-1.5">
          {featureItems.map((item) => (
            <MenuRow item={item} key={item.label} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="flex min-w-0 flex-col">
          <a
            className="group relative h-[238px] overflow-hidden rounded-[10px] border border-white/[0.15] bg-[#11081f]"
            href="#features"
            onClick={onNavigate}
            role="menuitem"
          >
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover object-top opacity-75 transition duration-500 group-hover:scale-[1.02]"
              src="https://fsu.creght.com/site/2083536173505974272/1786355775493__creght_blocks_external_005.png"
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(87,34,154,0.16)_0%,rgba(5,3,10,0.18)_45%,#07040c_100%)]" />
            <span className="absolute right-2.5 top-2.5 rounded-full bg-[#8c45ff] px-2 py-0.5 text-[8px] font-bold uppercase leading-[12px] text-black">
              New
            </span>
            <span className="absolute inset-x-5 bottom-5">
              <strong className="block text-[14px] font-medium leading-[18px] text-white">Visual reports</strong>
              <span className="mt-1 block text-[13px] leading-[17px] text-white/55">Insights into your site performance</span>
            </span>
          </a>
          <a
            className="mt-auto flex items-center justify-center gap-2 text-[14px] leading-5 text-white/85 transition hover:text-white"
            href="#feature-list"
            onClick={onNavigate}
            role="menuitem"
          >
            See the latest features
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

function CompanyPanel({ id, labelledBy, onNavigate }: { id: string; labelledBy: string; onNavigate: () => void }) {
  return (
    <div
      aria-labelledby={labelledBy}
      className="absolute left-[-80px] top-full z-50 h-[279px] w-[291px] rounded-[10px] border border-white/[0.15] bg-black p-[27px] shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
      id={id}
      role="menu"
    >
      <div className="flex h-full flex-col justify-between">
        {companyItems.map((item) => (
          <MenuRow item={item} key={item.label} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}

function DesktopDropdown({
  activeDropdown,
  dropdownKey,
  label,
  setActiveDropdown,
}: {
  activeDropdown: DropdownKey | null
  dropdownKey: DropdownKey
  label: string
  setActiveDropdown: (value: DropdownKey | null) => void
}) {
  const isOpen = activeDropdown === dropdownKey
  const openedByClick = useRef(false)
  const buttonId = `ai-seo-${dropdownKey}-trigger`
  const panelId = `ai-seo-${dropdownKey}-menu`

  const close = () => {
    openedByClick.current = false
    setActiveDropdown(null)
  }

  useEffect(() => {
    if (!isOpen) openedByClick.current = false
  }, [isOpen])

  const handleClick = () => {
    if (isOpen && openedByClick.current) {
      close()
      return
    }

    openedByClick.current = true
    setActiveDropdown(dropdownKey)
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close()
      }}
      onMouseEnter={() => {
        if (!isOpen) {
          openedByClick.current = false
          setActiveDropdown(dropdownKey)
        }
      }}
      onMouseLeave={close}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex h-[31.6px] items-center gap-[2px] rounded-full px-3.5 text-[13px] font-normal leading-[15.6px] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad77ff] ${isOpen ? "bg-white/[0.07] text-white" : "text-white/70"}`}
        id={buttonId}
        onClick={handleClick}
        type="button"
      >
        {label}
        <ChevronDown aria-hidden="true" className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && dropdownKey === "features" ? (
        <span
          aria-hidden="true"
          className="absolute left-[-100px] top-full h-[11px] w-[694px]"
          data-dropdown-hover-bridge="features"
        />
      ) : null}
      {isOpen && dropdownKey === "features" ? <FeaturesPanel id={panelId} labelledBy={buttonId} onNavigate={close} /> : null}
      {isOpen && dropdownKey === "company" ? <CompanyPanel id={panelId} labelledBy={buttonId} onNavigate={close} /> : null}
    </div>
  )
}

const navLinkClass =
  "flex h-[31.6px] items-center rounded-full px-3.5 text-[13px] font-normal leading-[15.6px] text-white/70 transition hover:bg-white/[0.05] hover:text-white"

function WaitlistButton({ onClick }: { onClick: () => void }) {
  return (
    <span className="relative inline-flex">
      <span aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-xl border border-white/[0.09]" />
      <a
        className="relative inline-flex h-[32.9px] w-[99.1px] items-center justify-center rounded-lg bg-[#8c45ff]/50 text-[13px] font-medium leading-[16.9px] text-white transition hover:bg-[#8c45ff]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd91ff]"
        href="#signup"
        onClick={onClick}
      >
        Join waitlist
      </a>
    </span>
  )
}

function MobileMenuRow({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const Icon = item.icon
  return (
    <a className="flex items-center gap-2.5 text-[13px] leading-[16.9px] text-white/90" href={item.href} onClick={onNavigate}>
      <Icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
      <span>{item.label}</span>
    </a>
  )
}

export default function NavbarAiSeo({ className = "" }: NavbarAiSeoProps) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMenus = () => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus()
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

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 810px)")
    const closeMobileMenuOnDesktop = () => {
      if (desktopViewport.matches) setMobileOpen(false)
    }

    closeMobileMenuOnDesktop()
    desktopViewport.addEventListener("change", closeMobileMenuOnDesktop)
    return () => desktopViewport.removeEventListener("change", closeMobileMenuOnDesktop)
  }, [])

  return (
    <header className={`sticky top-0 z-50 h-[68px] bg-black/70 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.15)] [font-family:Inter,sans-serif] backdrop-blur-[7px] min-[810px]:h-[73.6px] ${className}`}>
      <div className="relative mx-auto flex h-full w-full items-center justify-between px-5 min-[810px]:w-[calc(100%_-_25px)] min-[810px]:max-w-[1400px]">
        <a
          aria-label="Home"
          className="relative z-10 inline-flex size-[38px] items-center justify-center overflow-hidden rounded-[10px] border border-white/15 bg-[radial-gradient(75%_50%_at_50%_100%,#1c1c1c_0%,#000_100%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad77ff]"
          href="#top"
          onClick={closeMenus}
        >
          <span className="relative size-5 overflow-hidden rounded-[10px] shadow-[0_1px_10px_rgba(198,54,255,0.7),0_1px_6px_rgba(140,69,255,0.6)]">
            <video
              aria-hidden="true"
              autoPlay
              className="absolute left-1/2 top-1/2 size-[22px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover grayscale blur-[1px]"
              loop
              muted
              playsInline
              poster={LOGO_IMAGE}
              src={LOGO_VIDEO}
            />
            <span className="absolute inset-0 bg-gradient-to-b from-[#8c45ff] to-[#c145ff] mix-blend-color" />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.25)_0%,rgba(140,69,255,0.08)_48%,rgba(0,0,0,0.2)_100%)]" />
          </span>
        </a>

        <nav aria-label="Primary navigation" className="absolute left-1/2 top-1/2 hidden h-[43.6px] -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-full bg-white/[0.045] p-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-inset ring-white/[0.08] min-[810px]:flex min-[1200px]:left-[calc(50%_-_30.5px)]">
          <DesktopDropdown activeDropdown={activeDropdown} dropdownKey="features" label="Features" setActiveDropdown={setActiveDropdown} />
          <a className={navLinkClass} href="#features" onClick={closeMenus}>Developers</a>
          <DesktopDropdown activeDropdown={activeDropdown} dropdownKey="company" label="Company" setActiveDropdown={setActiveDropdown} />
          <a className={navLinkClass} href="#stories" onClick={closeMenus}>Blog</a>
          <a className={navLinkClass} href="#feature-list" onClick={closeMenus}>Changelog</a>
        </nav>

        <div className="relative z-10 hidden min-[810px]:block">
          <WaitlistButton onClick={closeMenus} />
        </div>

        <div className="relative z-10 flex items-center gap-5 min-[810px]:hidden">
          <WaitlistButton onClick={closeMenus} />
          <button
            aria-controls="ai-seo-mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className={`grid place-items-center p-0 text-white transition hover:text-[#c9a6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad77ff] ${mobileOpen ? "size-8 rounded-[4px] border border-white/70" : "h-7 w-[29px]"}`}
            onClick={() => {
              setMobileOpen((open) => !open)
              setActiveDropdown(null)
            }}
            type="button"
          >
            {mobileOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-7" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-t border-white/[0.08] bg-black px-3.5 pb-10 pt-[47px] min-[810px]:hidden" id="ai-seo-mobile-navigation">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-2xl">
            <p className="text-[13px] leading-[15.6px] text-white/45">Features</p>
            <div className="mt-[22.5px] grid gap-[21.1px]">
              {featureItems.map((item) => <MobileMenuRow item={item} key={item.label} onNavigate={closeMenus} />)}
            </div>

            <a className="mt-[32.5px] block text-[13px] leading-[15.6px] text-white/45" href="#features" onClick={closeMenus}>Developers</a>

            <p className="mt-[26px] text-[13px] leading-[15.6px] text-white/45">Company</p>
            <div className="mt-[22.5px] grid gap-[21.1px]">
              {companyItems.map((item) => <MobileMenuRow item={item} key={item.label} onNavigate={closeMenus} />)}
            </div>

            <a className="mt-[23.55px] block text-[13px] leading-[15.6px] text-white/45" href="#stories" onClick={closeMenus}>Blog</a>
            <a className="mt-[26px] block text-[13px] leading-[15.6px] text-white/45" href="#feature-list" onClick={closeMenus}>Changelog</a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
