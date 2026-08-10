import type { CSSProperties } from "react"
import type { IconType } from "react-icons"
import { FaSlack } from "react-icons/fa6"
import {
  SiAirbnb,
  SiDropbox,
  SiFigma,
  SiGumroad,
  SiHotjar,
  SiNotion,
  SiPaypal,
  SiShopify,
} from "react-icons/si"

type Integration = {
  name: string
  icon: IconType
  background: string
  width: number
}

type IntegrationStyle = CSSProperties & {
  "--integration-color": string
  "--integration-width": string
}

const INTEGRATION_ROWS: Integration[][] = [
  [
    { name: "Shopify", icon: SiShopify, background: "#95bf47", width: 150 },
    { name: "Gumroad", icon: SiGumroad, background: "#f477d8", width: 161 },
    { name: "Slack", icon: FaSlack, background: "#4a154b", width: 131 },
    { name: "Dropbox", icon: SiDropbox, background: "#0b63f6", width: 155 },
    { name: "Hotjar", icon: SiHotjar, background: "#ff350b", width: 136 },
  ],
  [
    { name: "Figma", icon: SiFigma, background: "#914bff", width: 136 },
    { name: "Airbnb", icon: SiAirbnb, background: "#ff385c", width: 140 },
    { name: "Notion", icon: SiNotion, background: "#242424", width: 140 },
    { name: "PayPal", icon: SiPaypal, background: "#179bd7", width: 141 },
  ],
]

function IntegrationPill({ integration }: { integration: Integration }) {
  const Icon = integration.icon
  const style: IntegrationStyle = {
    "--integration-color": integration.background,
    "--integration-width": `${integration.width}px`,
  }

  return (
    <li
      className="logo-wall-07-pill group flex h-[52px] w-[var(--integration-width)] shrink-0 items-center gap-[9px] rounded-full bg-[#f3f3f4] px-[9px] text-[#111214] transition duration-200 hover:-translate-y-0.5 hover:bg-[#eeeeef] hover:shadow-[0_10px_24px_-18px_rgba(17,18,20,0.32)]"
      style={style}
    >
      <span className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[var(--integration-color)] text-white transition-transform duration-200 group-hover:scale-105">
        <Icon aria-hidden="true" className="size-[19px]" />
      </span>
      <span className="truncate text-[16px] font-bold leading-none tracking-[-0.015em]">
        {integration.name}
      </span>
    </li>
  )
}

export default function LogoWall07({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="logo-wall-07-title"
      className={`flex min-h-[548px] items-start justify-center overflow-hidden bg-[#fdfdfd] px-5 text-[#111214] md:h-dvh md:min-h-[548px] ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[1183px] flex-col items-center pb-16 pt-[94px] text-center md:translate-x-[10px] max-md:pt-20">
        <h2
          id="logo-wall-07-title"
          className="origin-center text-balance text-[52px] font-bold leading-[0.94] tracking-[-0.038em] md:scale-x-[1.04] max-sm:text-[36px] max-sm:leading-[1.12]"
        >
          Connect with 1000+ Apps
          <br />
          Seamlessly
        </h2>

        <p className="mx-auto mt-[35px] max-w-[760px] origin-center text-[22px] leading-[1.4] tracking-[-0.012em] text-[#89919f] md:scale-x-[1.035] max-sm:text-base">
          Effortlessly integrate with your favorite tools, from CRMs and analytics to
          <br className="max-md:hidden" /> marketing and automation platforms.
        </p>

        <div
          aria-label="Supported application integrations"
          className="mt-[44px] flex flex-wrap justify-center gap-[9px] md:flex-col md:items-center md:gap-[18px]"
        >
          {INTEGRATION_ROWS.map((row, rowIndex) => (
            <ul
              className={`contents md:flex md:justify-center ${
                rowIndex === 0 ? "md:gap-[12px]" : "md:gap-[13px]"
              }`}
              key={rowIndex}
            >
              {row.map((integration) => (
                <IntegrationPill key={integration.name} integration={integration} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
