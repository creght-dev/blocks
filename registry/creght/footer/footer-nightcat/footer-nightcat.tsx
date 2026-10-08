import { useId, useState, type CSSProperties, type FormEvent } from "react"
import { ChevronRight } from "lucide-react"
import { GiCat } from "react-icons/gi"
import { DEFAULT_NIGHTCAT_HEAD_IMAGE } from "./footer-nightcat-art"
import "./footer-nightcat.css"

export type FooterNightcatProps = {
  className?: string
  ctaHref?: string
  /** Replace the generated cat head with another image (800×447, transparent). */
  heroImageSrc?: string
  onSubscribe?: (email: string) => void | Promise<void>
}

const palette = {
  "--fnc-hero": "#06050b",
  "--fnc-panel": "#0a0912",
  "--fnc-accent": "#b49cff",
  "--fnc-accent-ink": "#120a26",
  "--fnc-border": "#1d1a28",
} as CSSProperties

const LEDGE_LINE = "#8a70e0"
const LEDGE_PATH = "M0 .5H8C70 .5 70 59.5 120 59.5H720C770 59.5 770 .5 832 .5H840"

const link = (label: string) => ({ label, href: "#" })

const columns = [
  { title: "Product", links: [link("Agents"), link("Code review"), link("Changelog"), link("Pricing")] },
  { title: "Developers", links: [link("Docs"), link("API reference"), link("CLI"), link("Status")] },
  { title: "Company", links: [link("About"), link("Careers"), link("Blog"), link("Contact")] },
]

export function FooterNightcat({
  className = "",
  ctaHref = "#",
  heroImageSrc = DEFAULT_NIGHTCAT_HEAD_IMAGE,
  onSubscribe,
}: FooterNightcatProps) {
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
    <a className="fnc-pill" href={ctaHref}>
      Start building <span aria-hidden="true"><ChevronRight size={10} strokeWidth={3} /></span>
    </a>
  )
  const headline = <h2>Ship code that<br />reviews itself</h2>

  return (
    <footer className={`fnc ${className}`} style={palette}>
      <div className="fnc-hero">
        <img className="fnc-hero-art" src={heroImageSrc} alt="" aria-hidden="true" />
        <div className="fnc-hero-copy">
          {cta}
          {headline}
        </div>
        <div className="fnc-ledge" aria-hidden="true">
          <span />
          <svg viewBox="0 0 840 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`fnc-ledge-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="840" y2="0">
                <stop offset="0" stopColor="#1d1a28" />
                <stop offset=".5" stopColor={LEDGE_LINE} />
                <stop offset="1" stopColor="#1d1a28" />
              </linearGradient>
            </defs>
            <path className="fnc-ledge-fill" d={`${LEDGE_PATH}V60H0Z`} />
            <path className="fnc-ledge-line" d={LEDGE_PATH} stroke={`url(#fnc-ledge-${id})`} />
          </svg>
          <span />
        </div>
      </div>

      <div className="fnc-mobile-intro">
        {cta}
        {headline}
      </div>

      <div className="fnc-content">
        <div className="fnc-columns">
          <div className="fnc-brand-group">
            <a className="fnc-brand" href="#" aria-label="Nightcat home">
              <span className="fnc-brand-icon" aria-hidden="true"><GiCat size={16} /></span>
              <span>Nightcat</span>
            </a>
            <p>Quiet, sharp-eyed AI tooling for teams who ship after dark.</p>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="fnc-column">
              <h3>{column.title}</h3>
              {column.links.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
            </div>
          ))}
        </div>

        <div className="fnc-newsletter-row">
          <div>
            <h3>Join the nightly build</h3>
            <p>Release notes and agent recipes, twice a month.</p>
          </div>
          <div>
            <form className="fnc-form" onSubmit={(event) => void handleSubscribe(event)}>
              <label className="fnc-sr-only" htmlFor={`fnc-email-${id}`}>Email address</label>
              <input
                id={`fnc-email-${id}`}
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Subscribe"}</button>
            </form>
            {message && <p className="fnc-message" role="status">{message}</p>}
          </div>
        </div>

        <div className="fnc-bottom">
          <small>© 2026 Nightcat Labs. All rights reserved.</small>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterNightcat
