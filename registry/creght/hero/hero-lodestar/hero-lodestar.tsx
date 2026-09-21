import { useEffect, useState } from "react"
import { ParticleLodestar } from "./lodestar-particles"

import "./hero-lodestar.css"

type Locale = "en" | "es"

type HeroCopy = {
  eyebrow: string
  titleLineOne: string
  titleLineTwo: string
  titleLineThree: string
  description: string
  primary: string
  secondary: string
  menu: string[]
}

const COPY: Record<Locale, HeroCopy> = {
  en: {
    eyebrow: "Creative technologist & digital designer",
    titleLineOne: "I craft web",
    titleLineTwo: "moments that",
    titleLineThree: "linger.",
    description:
      "I bring design and code together to shape tactile 3D stories, expressive interfaces, and motion-rich experiences — built with intention, down to the smallest detail.",
    primary: "Start a project",
    secondary: "Explore work",
    menu: ["Home", "Profile", "Selected work", "Contact"],
  },
  es: {
    eyebrow: "Tecnología creativa y diseño digital",
    titleLineOne: "Creo mundos",
    titleLineTwo: "digitales que",
    titleLineThree: "perduran.",
    description:
      "Uno diseño y código para crear historias 3D, interfaces expresivas y experiencias web construidas con intención.",
    primary: "Iniciar proyecto",
    secondary: "Ver trabajos",
    menu: ["Inicio", "Perfil", "Proyectos", "Contacto"],
  },
}

export type HeroLodestarProps = {
  className?: string
  brand?: string
  primaryHref?: string
  secondaryHref?: string
}


function FrameCorners() {
  return (
    <div className="hero-lodestar__frame" aria-hidden="true">
      <i className="hero-lodestar__corner hero-lodestar__corner--tl" />
      <i className="hero-lodestar__corner hero-lodestar__corner--tr" />
      <i className="hero-lodestar__corner hero-lodestar__corner--bl" />
      <i className="hero-lodestar__corner hero-lodestar__corner--br" />
    </div>
  )
}

export function HeroLodestar({
  brand = "Aster / Studio",
  className = "",
  primaryHref = "#contact",
  secondaryHref = "#work",
}: HeroLodestarProps) {
  const [locale, setLocale] = useState<Locale>("en")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const copy = COPY[locale]

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timeout = window.setTimeout(() => setShowIntro(false), reducedMotion ? 80 : 1760)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <section
      className={`hero-lodestar ${className}`}
      aria-labelledby="hero-lodestar-title"
    >
      <div className="hero-lodestar__aurora" aria-hidden="true" />
      <ParticleLodestar />
      <FrameCorners />

      <header className="hero-lodestar__header">
        <a className="hero-lodestar__brand" href="#home">
          {brand}
        </a>

        <div className="hero-lodestar__header-actions">
          <div className="hero-lodestar__locales" aria-label="Language">
            <button
              type="button"
              className={locale === "en" ? "is-active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              className={locale === "es" ? "is-active" : ""}
              onClick={() => setLocale("es")}
            >
              ES
            </button>
          </div>
          <button
            type="button"
            className={`hero-lodestar__menu-toggle ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="hero-lodestar-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav
        id="hero-lodestar-menu"
        className={`hero-lodestar__menu ${menuOpen ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        {copy.menu.map((item, index) => (
          <a
            href={`#${index === 0 ? "home" : index === 1 ? "profile" : index === 2 ? "work" : "contact"}`}
            key={item}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="hero-lodestar__intro-copy">
        <p className="hero-lodestar__eyebrow">{copy.eyebrow}</p>
        <h1 id="hero-lodestar-title">
          <span className="hero-lodestar__title-line hero-lodestar__title-line--bright">
            {copy.titleLineOne}
          </span>
          <span className="hero-lodestar__title-line">{copy.titleLineTwo}</span>
          <span className="hero-lodestar__title-line">{copy.titleLineThree}</span>
        </h1>
      </div>

      <div className="hero-lodestar__actions">
        <a href={primaryHref}>{copy.primary}</a>
        <a href={secondaryHref}>{copy.secondary}</a>
      </div>

      <p className="hero-lodestar__description">{copy.description}</p>

      <div className="hero-lodestar__cursor" aria-hidden="true">
        <span />
      </div>

      {showIntro ? (
        <div className="hero-lodestar__loader" aria-hidden="true">
          <p>Where form meets motion.</p>
        </div>
      ) : null}
    </section>
  )
}

export default HeroLodestar
