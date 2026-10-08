import { useId, useState, type CSSProperties, type FormEvent } from "react"
import { ArrowRight, ChevronRight } from "lucide-react"
import { GiRabbitHead } from "react-icons/gi"
import { DEFAULT_HOPSTACK_HEAD_IMAGE } from "./footer-hopstack-art"
import "./footer-hopstack.css"

export type FooterHopstackProps = {
  className?: string
  ctaHref?: string
  docsHref?: string
  /** Replace the generated rabbit head with another image (800×447, transparent). */
  heroImageSrc?: string
  onSubscribe?: (email: string) => void | Promise<void>
}

const palette = {
  "--fhs-hero": "#03060b",
  "--fhs-panel": "#070b12",
  "--fhs-accent": "#74d4ff",
  "--fhs-accent-ink": "#04121d",
  "--fhs-border": "#17212d",
} as CSSProperties

const LEDGE_LINE = "#4a9cc6"
const LEDGE_PATH = "M0 .5H150Q180 .5 180 25V40Q180 59.5 200 59.5H640Q660 59.5 660 40V25Q660 .5 690 .5H840"

const navigation = ["Platform", "Edge Functions", "Storage", "Pricing", "Docs"]

export function FooterHopstack({
  className = "",
  ctaHref = "#",
  docsHref = "#",
  heroImageSrc = DEFAULT_HOPSTACK_HEAD_IMAGE,
  onSubscribe,
}: FooterHopstackProps) {
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

  return (
    <footer className={`fhs ${className}`} style={palette}>
      <div className="fhs-hero">
        <img className="fhs-hero-art" src={heroImageSrc} alt="" aria-hidden="true" />
        <div className="fhs-ledge" aria-hidden="true">
          <span />
          <svg viewBox="0 0 840 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`fhs-ledge-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="840" y2="0">
                <stop offset="0" stopColor="#17212d" />
                <stop offset=".5" stopColor={LEDGE_LINE} />
                <stop offset="1" stopColor="#17212d" />
              </linearGradient>
            </defs>
            <path className="fhs-ledge-fill" d={`${LEDGE_PATH}V60H0Z`} />
            <path className="fhs-ledge-line" d={LEDGE_PATH} stroke={`url(#fhs-ledge-${id})`} />
          </svg>
          <span />
        </div>
      </div>

      <div className="fhs-content">
        <div className="fhs-cta">
          <a className="fhs-pill" href={ctaHref}>
            Now live in 300+ edge regions <span aria-hidden="true"><ChevronRight size={10} strokeWidth={3} /></span>
          </a>
          <h2>Deploy everywhere<br />in a single hop.</h2>
          <div className="fhs-cta-actions">
            <a className="fhs-button" href={ctaHref}>Start deploying <ArrowRight size={15} /></a>
            <a className="fhs-button fhs-button--ghost" href={docsHref}>Read the docs</a>
          </div>
        </div>

        <div className="fhs-strip">
          <div className="fhs-brand-group">
            <a className="fhs-brand" href="#" aria-label="Hopstack home">
              <span className="fhs-brand-icon" aria-hidden="true"><GiRabbitHead size={16} /></span>
              <span>Hopstack</span>
            </a>
            <p>Fast, friendly infrastructure for the edge.</p>
          </div>
          <nav className="fhs-nav" aria-label="Footer navigation">
            {navigation.map((label) => <a key={label} href="#">{label}</a>)}
          </nav>
          <div className="fhs-strip-news">
            <h3>Hop notes</h3>
            <p>One short email when something ships.</p>
            <form className="fhs-form" onSubmit={(event) => void handleSubscribe(event)}>
              <label className="fhs-sr-only" htmlFor={`fhs-email-${id}`}>Email address</label>
              <input
                id={`fhs-email-${id}`}
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Subscribe"}</button>
            </form>
            {message && <p className="fhs-message" role="status">{message}</p>}
          </div>
        </div>

        <div className="fhs-bottom">
          <small>© 2026 Hopstack Cloud. Built at the edge.</small>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterHopstack
