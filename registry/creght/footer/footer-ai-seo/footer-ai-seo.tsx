import { Instagram, X, Youtube } from "lucide-react"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#feature-list" },
      { label: "Updates", href: "#feature-list" },
      { label: "FAQ", href: "#footer" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#footer" },
      { label: "Blog", href: "#stories" },
      { label: "Careers", href: "#footer" },
      { label: "Manifesto", href: "#footer" },
      { label: "Press", href: "#footer" },
      { label: "Contact", href: "#signup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Examples", href: "#stories" },
      { label: "Community", href: "#signup" },
      { label: "Guides", href: "#feature-list" },
      { label: "Docs", href: "#feature-list" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#footer" },
      { label: "Terms", href: "#footer" },
      { label: "Security", href: "#footer" },
    ],
  },
] as const

const socialLinks = [
  { label: "X", href: "https://x.com/framer", Icon: X },
  {
    label: "Instagram",
    href: "https://www.instagram.com/framer/",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCW5gUZ7lKGrAbLOkHv2xfbw",
    Icon: Youtube,
  },
] as const

function FooterBrandMark() {
  return (
    <span
      aria-hidden="true"
      className="relative block size-[34px] shrink-0 overflow-hidden rounded-[7px] border border-white/15 bg-[radial-gradient(75%_50%_at_50%_100%,#1c1c1c_0%,#000_100%)]"
    >
      <span className="absolute left-1/2 top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] shadow-[0_1px_10px_rgba(198,54,255,0.7),0_1px_6px_rgba(140,69,255,0.6)]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://fsu.creght.com/site/2083536173505974272/1789974846437__creght_blocks_ai_seo_source_logo_poster.avif"
          className="absolute left-1/2 top-1/2 size-[19.8px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover grayscale blur-[1px]"
        >
          <source src="https://fsu.creght.com/site/2083536173505974272/1789974847225__creght_blocks_ai_seo_source_logo.mp4" type="video/mp4" />
        </video>
        <span className="absolute inset-0 bg-gradient-to-b from-[#8c45ff] to-[#c145ff] mix-blend-color" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.25)_0%,rgba(140,69,255,0.08)_48%,rgba(0,0,0,0.2)_100%)]" />
      </span>
    </span>
  )
}

export default function FooterAiSeo({
  className = "",
}: {
  className?: string
}) {
  return (
    <footer
      id="footer"
      className={`scroll-mt-[68px] bg-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] min-[810px]:scroll-mt-[74px] ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-10 px-5 py-[60px] min-[810px]:flex-row min-[810px]:items-stretch min-[810px]:justify-between min-[810px]:gap-[100px]">
        <div className="flex w-full flex-row items-center justify-between max-[374px]:flex-wrap max-[374px]:gap-y-5 min-[810px]:w-max min-[810px]:flex-col min-[810px]:items-start">
          <a
            href="#top"
            className="flex w-max items-center gap-[10px]"
            aria-label="Back to top"
          >
            <FooterBrandMark />
            <span className="whitespace-nowrap text-[13px] font-medium leading-[1.3] tracking-[-0.01em] text-white">
              AI Startup Website Kit
            </span>
          </a>

          <div className="flex w-max items-center gap-5">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="relative grid size-6 place-items-center text-white/50 transition-opacity hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                <Icon aria-hidden="true" className="size-6" strokeWidth={2.5} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-10 min-[810px]:w-max min-[810px]:flex-row min-[810px]:gap-[60px] min-[810px]:pb-0 min-[810px]:pr-10 min-[810px]:pt-[6px] min-[1200px]:pr-[100px]">
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="flex w-full flex-col items-start gap-5 min-[810px]:w-max"
            >
              <h3 className="whitespace-nowrap text-[13px] font-medium leading-[1.3] tracking-[-0.01em] text-white">
                {column.title}
              </h3>
              {column.links.map(({ label, href }) => (
                <a
                  href={href}
                  key={label}
                  className="whitespace-nowrap text-[13px] font-normal leading-[1.2] text-white/60"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
