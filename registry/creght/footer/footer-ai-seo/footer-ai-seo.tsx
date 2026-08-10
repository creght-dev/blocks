import { Github, Linkedin, Youtube } from "lucide-react"

import { AI_SEO_SECTION, BrandMark } from "../../shared/ai-seo/ai-seo-shared"

const footerColumns: Array<{
  title: string
  links: Array<{ label: string; href?: string }>
}> = [
  { title: "Product", links: [{ label: "Platform", href: "#features" }, { label: "Opportunity map", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Private preview", href: "#signup" }] },
  { title: "Company", links: [{ label: "About" }, { label: "Journal" }, { label: "Careers" }, { label: "Contact" }] },
  { title: "Resources", links: [{ label: "Field notes" }, { label: "Templates" }, { label: "Community" }, { label: "Help center" }] },
  { title: "Legal", links: [{ label: "Privacy" }, { label: "Terms" }, { label: "Security" }] },
]

export default function FooterAiSeo({ className = "" }: { className?: string }) {
  return (
    <footer id="footer" className={`scroll-mt-[68px] border-t border-white/[0.1] bg-[#050505] py-[33px] text-white min-[810px]:min-h-[357px] min-[810px]:scroll-mt-[74px] min-[810px]:py-14 ${className}`}>
      <div className={`${AI_SEO_SECTION} grid gap-[30px] min-[810px]:grid-cols-[minmax(260px,1fr)_minmax(0,560px)] min-[810px]:gap-20`}>
        <div className="flex min-h-[160px] flex-col min-[810px]:min-h-[220px]">
          <a href="#top" className="inline-flex w-fit items-center gap-3 text-sm font-medium text-white/88">
            <BrandMark className="size-[34px]" />
            <span>Auralis Intelligence</span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/34">
            A calmer operating system for search teams building durable organic growth.
          </p>
          <div className="mt-auto flex gap-2 pt-9">
            {[
              { label: "GitHub", href: "https://github.com", Icon: Github },
              { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
              { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
            ].map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/8 text-white/38 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 min-[810px]:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-medium text-white/88">{column.title}</h3>
              <ul className="mt-5 space-y-4 text-[13px] text-white/36">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className="transition hover:text-white/80">{link.label}</a>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
