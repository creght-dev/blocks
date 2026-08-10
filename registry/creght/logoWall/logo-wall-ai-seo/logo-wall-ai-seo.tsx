import {
  AI_SEO_SECTION,
  FadeIn,
} from "../../shared/ai-seo/ai-seo-shared"

type GlyphName =
  | "aperture"
  | "helix"
  | "orbit"
  | "prism"
  | "signal"
  | "stack"
  | "wave"
  | "weave"

type LogoItem = {
  glyph: GlyphName
  name: string
}

export type LogoWallAiSeoProps = {
  className?: string
}

const logoItems: LogoItem[] = [
  { glyph: "prism", name: "Nexalume" },
  { glyph: "orbit", name: "Orivanta" },
  { glyph: "stack", name: "Morrowgrid" },
  { glyph: "signal", name: "Quietrail" },
  { glyph: "weave", name: "Virelune" },
  { glyph: "aperture", name: "Pellora" },
  { glyph: "helix", name: "Aveniq" },
  { glyph: "wave", name: "Solvanta" },
]

function BrandGlyph({ glyph }: { glyph: GlyphName }) {
  if (glyph === "prism") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3.5 24 21H4L14 3.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m9.2 21 4.8-8.1 4.8 8.1M14 3.5v9.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (glyph === "orbit") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="3.4" fill="currentColor" />
        <ellipse cx="14" cy="14" rx="11" ry="5.2" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="14" cy="14" rx="5.2" ry="11" stroke="currentColor" strokeWidth="1.6" transform="rotate(32 14 14)" />
      </svg>
    )
  }

  if (glyph === "stack") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="m14 4 10 5.2-10 5.2L4 9.2 14 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m5.5 14 8.5 4.4 8.5-4.4M5.5 18.7 14 23l8.5-4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (glyph === "signal") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M5 20.5h3.3v-5H5v5ZM12.3 20.5h3.4V10h-3.4v10.5ZM19.7 20.5H23V5.5h-3.3v15Z" fill="currentColor" />
        <path d="m5 10.5 5-4 5 1.7L23 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (glyph === "weave") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 6.5h8A7.5 7.5 0 0 1 21.5 14v7.5h-7A8 8 0 0 1 6.5 13V6.5H6Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.5 21.5V14A7.5 7.5 0 0 1 14 6.5h7.5V14a7.5 7.5 0 0 1-7.5 7.5H6.5Z" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  if (glyph === "aperture") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="m14 3.5 3.6 6.3L14 14M24.5 14h-7.2L14 14M19.3 23.1l-3.6-6.2L14 14M8.7 23.1l3.6-6.2L14 14M3.5 14h7.2L14 14M8.7 4.9l3.6 6.2L14 14" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
      </svg>
    )
  }

  if (glyph === "helix") {
    return (
      <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M7 4c0 7 14 13 14 20M21 4C21 11 7 17 7 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 8h10M8.5 14h11M9 20h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className="size-6" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M3.5 17.5c3.5 0 3.5-7 7-7s3.5 7 7 7 3.5-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 11c3.5 0 3.5 7 7 7s3.5-7 7-7 3.5 7 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".45" />
    </svg>
  )
}

export default function LogoWallAiSeo({ className = "" }: LogoWallAiSeoProps) {
  return (
    <section
      className={`relative overflow-hidden border-y border-white/[0.065] bg-[#09070c] py-20 text-white min-[810px]:py-[31px] ${className}`}
      aria-labelledby="ai-seo-logo-wall-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(111,38,217,0.11),transparent_43%)]"
        aria-hidden="true"
      />
      <div className={`${AI_SEO_SECTION} relative`}>
        <FadeIn className="mx-auto flex max-w-[940px] flex-col gap-2 text-center min-[810px]:flex-row min-[810px]:items-end min-[810px]:justify-between min-[810px]:gap-8 min-[810px]:text-left">
          <h2
            className="max-w-[440px] text-[18px] font-medium leading-tight tracking-[-0.04em] text-white/90 min-[810px]:text-[29px]"
            id="ai-seo-logo-wall-title"
          >
            Trusted by ambitious search teams.
          </h2>
          <p className="mx-auto hidden max-w-[390px] text-xs leading-5 text-white/38 min-[810px]:mx-0 min-[810px]:block min-[810px]:text-right">
            One shared view of demand for focused studios and scaling software teams.
          </p>
        </FadeIn>

        <div className="relative mx-auto mt-10 grid max-w-[940px] grid-cols-2 gap-[10px] min-[810px]:grid-cols-4">
          {logoItems.map((item, index) => (
            <FadeIn
              className="group relative flex min-h-[90px] items-center justify-center gap-2.5 rounded-[10px] border border-white/[0.075] bg-white/[0.018] px-3 text-white/40 transition duration-300 hover:bg-[#8c45ff]/30 hover:text-white/78 sm:gap-3.5 sm:px-5"
              delay={index * 0.025}
              key={item.name}
            >
              <span className="text-[#ba8aff] transition duration-300 group-hover:text-[#d8bcff] group-hover:drop-shadow-[0_0_10px_rgba(177,119,255,0.45)]">
                <BrandGlyph glyph={item.glyph} />
              </span>
              <span className="text-[12px] font-semibold tracking-[-0.02em] sm:text-[15px]">
                {item.name}
              </span>
            </FadeIn>
          ))}
        </div>

        <p className="sr-only">
          Fictional partner marks shown for demonstration
        </p>
      </div>
    </section>
  )
}
