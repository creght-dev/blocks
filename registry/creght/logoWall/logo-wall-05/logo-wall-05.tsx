import type { CSSProperties } from "react"
import type { IconType } from "react-icons"
import { FaSlack } from "react-icons/fa6"
import {
  SiAirbnb,
  SiAppletv,
  SiDiscord,
  SiDropbox,
  SiFigma,
  SiGoogle,
  SiGooglechrome,
  SiHotjar,
  SiInstagram,
  SiNetflix,
  SiNotion,
  SiShopify,
  SiSketch,
  SiTiktok,
  SiVisa,
  SiX,
} from "react-icons/si"
import { TbBrandAdobePhotoshop } from "react-icons/tb"

type AppIcon = {
  name: string
  icon: IconType
  background: string
}

type TickerColumn = {
  apps: AppIcon[]
  direction: "up" | "down"
  duration: string
  delay: string
}

const INSTAGRAM: AppIcon = {
  name: "Instagram",
  icon: SiInstagram,
  background: "linear-gradient(155deg, #ff355d 0%, #ff6835 58%, #ffab68 100%)",
}
const SHOPIFY: AppIcon = { name: "Shopify", icon: SiShopify, background: "#95bf47" }
const DROPBOX: AppIcon = { name: "Dropbox", icon: SiDropbox, background: "#1267f5" }
const TIKTOK: AppIcon = { name: "TikTok", icon: SiTiktok, background: "#050505" }
const AIRBNB: AppIcon = {
  name: "Airbnb",
  icon: SiAirbnb,
  background: "linear-gradient(155deg, #ff3159 0%, #ff3159 58%, #ffbfd0 100%)",
}
const X_APP: AppIcon = {
  name: "X",
  icon: SiX,
  background: "linear-gradient(180deg, #6da1f7 0%, #3178e8 100%)",
}
const NOTION: AppIcon = { name: "Notion", icon: SiNotion, background: "#242424" }
const SKETCH: AppIcon = { name: "Sketch", icon: SiSketch, background: "#ffb80c" }
const FIGMA: AppIcon = { name: "Figma", icon: SiFigma, background: "#9747ff" }
const HOTJAR: AppIcon = { name: "Hotjar", icon: SiHotjar, background: "#ff3900" }
const NETFLIX: AppIcon = {
  name: "Netflix",
  icon: SiNetflix,
  background: "linear-gradient(180deg, #ff5d6c 0%, #e50914 100%)",
}
const SLACK: AppIcon = { name: "Slack", icon: FaSlack, background: "#4a154b" }
const DISCORD: AppIcon = { name: "Discord", icon: SiDiscord, background: "#5865f2" }
const APPLE_TV: AppIcon = { name: "Apple TV", icon: SiAppletv, background: "#575757" }
const PHOTOSHOP: AppIcon = {
  name: "Adobe Photoshop",
  icon: TbBrandAdobePhotoshop,
  background: "linear-gradient(180deg, #3ca8f4 0%, #8dceff 100%)",
}
const GOOGLE: AppIcon = {
  name: "Google",
  icon: SiGoogle,
  background: "linear-gradient(180deg, #d3a4ff 0%, #a867ed 100%)",
}
const CHROME: AppIcon = { name: "Google Chrome", icon: SiGooglechrome, background: "#337fe8" }
const VISA: AppIcon = {
  name: "Visa",
  icon: SiVisa,
  background: "linear-gradient(180deg, #0d5ca8 0%, #164f91 100%)",
}

const COLUMNS: TickerColumn[] = [
  {
    apps: [INSTAGRAM, SHOPIFY, DROPBOX, TIKTOK, AIRBNB],
    direction: "up",
    duration: "27s",
    delay: "-8s",
  },
  {
    apps: [X_APP, NOTION, SKETCH, FIGMA, HOTJAR],
    direction: "down",
    duration: "31s",
    delay: "-14s",
  },
  {
    apps: [NETFLIX, SLACK, DISCORD, APPLE_TV, PHOTOSHOP],
    direction: "up",
    duration: "29s",
    delay: "-18s",
  },
  {
    apps: [GOOGLE, HOTJAR, CHROME, SKETCH, VISA],
    direction: "down",
    duration: "33s",
    delay: "-22s",
  },
]

function AppTile({ app, duplicate = false }: { app: AppIcon; duplicate?: boolean }) {
  const Icon = app.icon

  return (
    <div
      aria-label={duplicate ? undefined : app.name}
      aria-hidden={duplicate || undefined}
      className="flex aspect-square w-full shrink-0 items-center justify-center rounded-[25%] shadow-[0_16px_34px_-24px_rgba(15,23,42,0.36)]"
      style={{ background: app.background }}
    >
      <Icon aria-hidden="true" className="h-[42%] w-[42%] text-white" />
    </div>
  )
}

function TickerColumn({ column }: { column: TickerColumn }) {
  const animationStyle: CSSProperties = {
    animationDuration: column.duration,
    animationDelay: column.delay,
  }

  return (
    <div className="logo-wall-05-column h-full min-w-0 overflow-hidden">
      <div
        className={`logo-wall-05-track flex flex-col gap-2.5 ${
          column.direction === "down" ? "logo-wall-05-down" : "logo-wall-05-up"
        }`}
        style={animationStyle}
      >
        {[...column.apps, ...column.apps].map((app, index) => (
          <AppTile key={`${app.name}-${index}`} app={app} duplicate={index >= column.apps.length} />
        ))}
      </div>
    </div>
  )
}

export default function LogoWall05({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-05-title"
      className={`relative min-h-[760px] overflow-hidden bg-[#fbfbfb] text-[#111214] lg:h-dvh lg:min-h-[680px] ${className}`}
    >
      <style>{`
        @keyframes logo-wall-05-up {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(0, calc(-50% - 0.3125rem), 0); }
        }
        @keyframes logo-wall-05-down {
          from { transform: translate3d(0, calc(-50% - 0.3125rem), 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        .logo-wall-05-track {
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          will-change: transform;
        }
        .logo-wall-05-up { animation-name: logo-wall-05-up; }
        .logo-wall-05-down { animation-name: logo-wall-05-down; }
        .logo-wall-05-column:hover .logo-wall-05-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .logo-wall-05-track { animation-play-state: paused; }
        }
      `}</style>

      <div className="mx-auto grid min-h-[760px] w-full max-w-[1320px] grid-cols-1 px-6 sm:px-10 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-16 lg:px-12 xl:px-8">
        <div className="relative z-10 flex items-end pb-14 pt-20 sm:pb-20 lg:pb-[97px] lg:pl-9 lg:pt-0">
          <div className="max-w-[600px]">
            <h2
              id="logo-wall-05-title"
              className="origin-left text-balance text-[44px] font-semibold leading-[1.14] tracking-[-0.045em] sm:scale-x-[1.12] sm:text-[50px] lg:text-[50px]"
            >
              Connect with 1000+<br className="hidden sm:block" /> Apps Seamlessly
            </h2>
            <p className="mt-3 max-w-[575px] text-lg leading-[1.55] tracking-[-0.01em] text-[#89919f] sm:text-xl">
              Effortlessly integrate with your favorite tools, from CRMs and analytics to marketing and automation platforms.
            </p>
          </div>
        </div>

        <div
          aria-label="Supported application integrations"
          className="relative h-[540px] min-w-0 overflow-hidden lg:h-full lg:w-[536px] lg:-translate-x-[18px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#fbfbfb] via-[#fbfbfb]/90 to-transparent lg:h-36" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#fbfbfb] via-[#fbfbfb]/90 to-transparent lg:h-36" />
          <div className="grid h-full grid-cols-4 gap-3.5 sm:gap-5 lg:grid-cols-[repeat(4,101px)] lg:justify-between lg:gap-0">
            {COLUMNS.map((column, index) => (
              <TickerColumn key={index} column={column} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
