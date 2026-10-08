import { useId, useState, type CSSProperties, type FormEvent } from "react"
import { ChevronRight } from "lucide-react"
import { GiFoxHead } from "react-icons/gi"
import { DEFAULT_FOXLINE_HEAD_IMAGE } from "./footer-foxline-art"
import "./footer-foxline.css"

export type FooterFoxlineProps = {
  className?: string
  ctaHref?: string
  /** Replace the generated fox head with another image (800×447, transparent). */
  heroImageSrc?: string
  onSubscribe?: (email: string) => void | Promise<void>
}

const palette = {
  "--ffl-hero": "#090604",
  "--ffl-panel": "#0e0a07",
  "--ffl-accent": "#ffab57",
  "--ffl-accent-ink": "#1d0f03",
  "--ffl-border": "#261d16",
} as CSSProperties

const LEDGE_LINE = "#c0782f"
const LEDGE_PATH = "M0 .5H200Q210 .5 217 6L268 54Q275 59.5 285 59.5H555Q565 59.5 572 54L623 6Q630 .5 640 .5H840"

const navigation = ["Reports", "Forecasts", "Integrations", "Security", "Pricing"]

const articles = [
  "Field Notes: Closing the books in two days.",
  "Guide: Building a rolling 13-week forecast.",
  "Product: Variance alerts that explain themselves.",
]

export function FooterFoxline({
  className = "",
  ctaHref = "#",
  heroImageSrc = DEFAULT_FOXLINE_HEAD_IMAGE,
  onSubscribe,
}: FooterFoxlineProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return

    if (!onSubscribe) {
      setMessage("Newsletter sign-up is currently unavailable.")
      return
    }

    setSubmitting(true)
    setMessage("")
    try {
      await onSubscribe(email.trim())
      setMessage("Thanks for subscribing!")
      setEmail("")
    } catch {
      setMessage("Could not subscribe. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const cta = (
    <a className="ffl-pill" href={ctaHref}>
      Book a demo <span aria-hidden="true"><ChevronRight size={10} strokeWidth={3} /></span>
    </a>
  )
  const headline = <h2>Every number,<br />explained.</h2>

  return (
    <footer className={`ffl ${className}`} style={palette}>
      <div className="ffl-hero">
        <img className="ffl-hero-art" src={heroImageSrc} alt="" aria-hidden="true" />
        <div className="ffl-hero-copy">
          {cta}
          {headline}
          <p>Clever reporting for finance teams that move fast.</p>
        </div>
        <div className="ffl-ledge" aria-hidden="true">
          <span />
          <svg viewBox="0 0 840 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`ffl-ledge-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="840" y2="0">
                <stop offset="0" stopColor="#261d16" />
                <stop offset=".5" stopColor={LEDGE_LINE} />
                <stop offset="1" stopColor="#261d16" />
              </linearGradient>
            </defs>
            <path className="ffl-ledge-fill" d={`${LEDGE_PATH}V60H0Z`} />
            <path className="ffl-ledge-line" d={LEDGE_PATH} stroke={`url(#ffl-ledge-${id})`} />
          </svg>
          <span />
        </div>
      </div>

      <div className="ffl-mobile-intro">
        {cta}
        {headline}
      </div>

      <div className="ffl-content">
        <div className="ffl-top">
          <div className="ffl-brand-group">
            <a className="ffl-brand" href="#" aria-label="Foxline home">
              <span className="ffl-brand-icon" aria-hidden="true"><GiFoxHead size={16} /></span>
              <span>Foxline</span>
            </a>
            <p>Clever reporting for finance teams that move fast.</p>
          </div>
          <nav className="ffl-nav" aria-label="Footer navigation">
            {navigation.map((label) => <a key={label} href="#">{label}</a>)}
          </nav>
        </div>

        <div className="ffl-main">
          <div className="ffl-subscribe">
            <h3>Read the Field Notes</h3>
            <form className="ffl-form" onSubmit={(event) => void handleSubscribe(event)}>
              <label className="ffl-sr-only" htmlFor={`ffl-email-${id}`}>Email address</label>
              <input
                id={`ffl-email-${id}`}
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Subscribe"}</button>
            </form>
            <p className="ffl-policy">By submitting your email address, you agree to our <a href="#">privacy policy.</a></p>
            {message && <p className="ffl-message" role="status">{message}</p>}
          </div>

          <div className="ffl-articles" aria-label="Resources">
            {articles.map((title) => (
              <a key={title} className="ffl-article" href="#">
                <span className="ffl-article-image" aria-hidden="true" />
                <span className="ffl-article-title">{title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="ffl-bottom">
          <small>© 2026 Foxline Analytics, Inc.</small>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterFoxline
