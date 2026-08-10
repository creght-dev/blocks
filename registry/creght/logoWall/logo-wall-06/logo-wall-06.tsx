import type { CSSProperties } from "react"
import type { IconType } from "react-icons"
import { FaSlack } from "react-icons/fa6"
import {
  SiAirbnb,
  SiDropbox,
  SiFigma,
  SiFramer,
  SiGooglechrome,
  SiGrammarly,
  SiHotjar,
  SiNotion,
  SiShopify,
  SiSketch,
} from "react-icons/si"
import { TbButterflyFilled } from "react-icons/tb"

type FloatingApp = {
  name: string
  icon: IconType
  background: string
  x: number
  y: number
  mobileX: string
  mobileY: string
  mobileTranslateX?: string
  mobileHidden?: boolean
}

type AppPositionStyle = CSSProperties & {
  "--desktop-x": string
  "--desktop-y": string
  "--mobile-x": string
  "--mobile-y": string
  "--mobile-translate-x": string
}

const APPS: FloatingApp[] = [
  {
    name: "Shopify",
    icon: SiShopify,
    background: "#95bf47",
    x: 11.04,
    y: 21.46,
    mobileX: "clamp(18px, 6vw, 32px)",
    mobileY: "7%",
  },
  {
    name: "Butterfly",
    icon: TbButterflyFilled,
    background: "#4d20e8",
    x: 25,
    y: 15.5,
    mobileX: "50%",
    mobileY: "3.5%",
    mobileTranslateX: "-50%",
  },
  {
    name: "Dropbox",
    icon: SiDropbox,
    background: "#1267f5",
    x: 4.09,
    y: 39.79,
    mobileX: "clamp(18px, 6vw, 32px)",
    mobileY: "18.25%",
  },
  {
    name: "Grammarly",
    icon: SiGrammarly,
    background: "#ed7cda",
    x: 14.69,
    y: 51.86,
    mobileX: "clamp(18px, 6vw, 32px)",
    mobileY: "60%",
  },
  {
    name: "Airbnb",
    icon: SiAirbnb,
    background: "#ff3159",
    x: 4.82,
    y: 66.77,
    mobileX: "clamp(18px, 6vw, 32px)",
    mobileY: "73%",
  },
  {
    name: "Framer",
    icon: SiFramer,
    background: "#0ca6ec",
    x: 22.3,
    y: 77.94,
    mobileX: "38%",
    mobileY: "84%",
    mobileTranslateX: "-50%",
  },
  {
    name: "Hotjar",
    icon: SiHotjar,
    background: "#ff3407",
    x: 66.52,
    y: 19.97,
    mobileX: "calc(100% - clamp(18px, 6vw, 32px) - var(--mobile-tile-size))",
    mobileY: "8%",
  },
  {
    name: "Figma",
    icon: SiFigma,
    background: "#9747ff",
    x: 75.36,
    y: 13.86,
    mobileX: "0px",
    mobileY: "0%",
    mobileHidden: true,
  },
  {
    name: "Slack",
    icon: FaSlack,
    background: "#4a154b",
    x: 84.14,
    y: 33.98,
    mobileX: "calc(100% - clamp(18px, 6vw, 32px) - var(--mobile-tile-size))",
    mobileY: "20%",
  },
  {
    name: "Notion",
    icon: SiNotion,
    background: "#242424",
    x: 74.27,
    y: 47.39,
    mobileX: "calc(100% - clamp(18px, 6vw, 32px) - var(--mobile-tile-size))",
    mobileY: "60%",
  },
  {
    name: "Google Chrome",
    icon: SiGooglechrome,
    background: "#337fe8",
    x: 80.48,
    y: 66.02,
    mobileX: "calc(100% - clamp(18px, 6vw, 32px) - var(--mobile-tile-size))",
    mobileY: "73%",
  },
  {
    name: "Sketch",
    icon: SiSketch,
    background: "#ffb20b",
    x: 68.06,
    y: 74.96,
    mobileX: "62%",
    mobileY: "84%",
    mobileTranslateX: "-50%",
  },
]

function AppTile({ app }: { app: FloatingApp }) {
  const Icon = app.icon
  const positionStyle: AppPositionStyle = {
    "--desktop-x": `${app.x}%`,
    "--desktop-y": `${app.y}%`,
    "--mobile-x": app.mobileX,
    "--mobile-y": app.mobileY,
    "--mobile-translate-x": app.mobileTranslateX ?? "0px",
    background: app.background,
  }

  return (
    <div
      aria-label={app.name}
      className={`logo-wall-06-app absolute z-10 flex h-[var(--mobile-tile-size)] w-[var(--mobile-tile-size)] items-center justify-center rounded-[28%] transition-transform duration-300 hover:z-30 hover:scale-110 focus-within:z-30 focus-within:scale-110 xl:h-[70px] xl:w-[70px] ${
        app.mobileHidden ? "max-xl:hidden" : ""
      }`}
      style={positionStyle}
    >
      <Icon aria-hidden="true" className="h-[43%] w-[43%] text-white" />
    </div>
  )
}

export default function LogoWall06({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-06-title"
      className={`relative min-h-[800px] overflow-hidden bg-[#fdfdfd] text-[#111214] sm:min-h-[720px] xl:h-dvh xl:min-h-[671px] ${className}`}
    >
      <style>{`
        .logo-wall-06-app {
          left: var(--desktop-x);
          top: var(--desktop-y);
        }
        @media (max-width: 1279px) {
          .logo-wall-06-app {
            left: var(--mobile-x);
            top: var(--mobile-y);
            translate: var(--mobile-translate-x) 0;
          }
        }
      `}</style>

      <div
        className="relative mx-auto h-full min-h-[800px] w-full max-w-[1368px] [--mobile-tile-size:clamp(58px,17.95vw,70px)] sm:min-h-[720px] xl:min-h-[671px]"
      >
        {APPS.map((app) => (
          <AppTile key={app.name} app={app} />
        ))}

        <div className="absolute inset-x-5 top-[30%] z-20 text-center sm:inset-x-20 sm:top-1/2 sm:-translate-y-1/2 xl:-translate-x-[30px]">
          <h2
            id="logo-wall-06-title"
            className="origin-center text-balance text-[clamp(2.25rem,11.2vw,2.75rem)] font-semibold leading-[1.18] tracking-[-0.045em] sm:text-[50px] xl:scale-x-[1.12]"
          >
            Connect with 1000+<br /> Apps Seamlessly
          </h2>
          <p className="mx-auto mt-[19px] max-w-[575px] text-base leading-[1.55] tracking-[-0.01em] text-[#89919f] min-[360px]:text-lg sm:text-xl xl:scale-x-[1.12]">
            Effortlessly integrate with your favorite tools, from CRMs and analytics to marketing and automation platforms.
          </p>
        </div>
      </div>
    </section>
  )
}
