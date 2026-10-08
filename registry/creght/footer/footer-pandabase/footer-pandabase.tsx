import { useState, type FormEvent } from "react"
import { ChevronRight } from "lucide-react"
import { GiPanda } from "react-icons/gi"
import { DEFAULT_PANDA_HEAD_IMAGE } from "./footer-pandabase-art"
import "./footer-pandabase.css"

export type FooterPandabaseProps = {
  className?: string
  ctaHref?: string
  /** Replace the built-in artwork with another dark, wide image. Transparent WebP or PNG works best. */
  heroImageSrc?: string
  onSubscribe?: (email: string) => void | Promise<void>
}

const navigation = [
  { label: "Disputes", href: "https://pandabase.io/products/payments" },
  { label: "Vendors", href: "https://pandabase.io/" },
  { label: "Customers", href: "https://pandabase.io/" },
  { label: "Pay", href: "https://pandabase.io/products/payments" },
  { label: "Fraud Detection", href: "https://pandabase.io/security" },
  { label: "MoR", href: "https://pandabase.io/" },
]

const articles = [
  "Case Study: How we our sellers make over $1M a month.",
  "Engineering: How we manage to innovate new features.",
  "Engineering: How we’ve scaled our team from just two to ten.",
]

export function FooterPandabase({
  className = "",
  ctaHref = "https://merchant.pandabase.io/",
  heroImageSrc = DEFAULT_PANDA_HEAD_IMAGE,
  onSubscribe,
}: FooterPandabaseProps) {
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
    <footer id="pandabase-footer" className={`pbf ${className}`}>
      <div className="pbf-hero">
        <img className="pbf-hero-art" src={heroImageSrc} alt="" aria-hidden="true" />
        <div className="pbf-hero-copy">
          <a className="pbf-hero-cta" href={ctaHref} target="_blank" rel="noreferrer">
            Get started now <span aria-hidden="true"><ChevronRight size={10} strokeWidth={3} /></span>
          </a>
          <h2>Your all in one<br />payment infrastructure</h2>
        </div>
        <div className="pbf-hero-ledge" aria-hidden="true">
          <span />
          <svg viewBox="0 0 840 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pbf-ledge-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="840" y2="0">
                <stop offset="0" stopColor="#0e181a" />
                <stop offset=".15" stopColor="#1d3030" />
                <stop offset=".5" stopColor="#4f8a72" />
                <stop offset=".85" stopColor="#1d3030" />
                <stop offset="1" stopColor="#0e181a" />
              </linearGradient>
            </defs>
            <path className="pbf-ledge-fill" d="M0 .5H17Q25 .5 31 4.2L119 55.8Q125 59.5 133 59.5H707Q715 59.5 721 55.8L809 4.2Q815 .5 823 .5H840V60H0Z" />
            <path className="pbf-ledge-line" d="M0 .5H17Q25 .5 31 4.2L119 55.8Q125 59.5 133 59.5H707Q715 59.5 721 55.8L809 4.2Q815 .5 823 .5H840" />
          </svg>
          <span />
        </div>
      </div>

      <div className="pbf-mobile-intro">
        <a className="pbf-mobile-cta" href={ctaHref} target="_blank" rel="noreferrer">
          Get started now <span aria-hidden="true"><ChevronRight size={11} strokeWidth={3} /></span>
        </a>
        <h2>Your all in one<br />payment infrastructure</h2>
      </div>

      <div className="pbf-content">
        <div className="pbf-top">
          <div className="pbf-brand-group">
            <a className="pbf-brand" href="https://pandabase.io/" target="_blank" rel="noreferrer" aria-label="Pandabase home">
              <span className="pbf-brand-icon" aria-hidden="true"><GiPanda size={18} /></span>
              <span>Pandabase</span>
            </a>
            <p>A platform built for the next wave of<br className="pbf-desktop-break" /> entrepreneurs.</p>
          </div>
          <nav className="pbf-nav" aria-label="Footer navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
            ))}
          </nav>
        </div>

        <div className="pbf-main">
          <div className="pbf-subscribe">
            <h3>Claim Free Resources</h3>
            <form onSubmit={(event) => void handleSubscribe(event)}>
              <label className="pbf-sr-only" htmlFor="pbf-email">Email address</label>
              <input
                id="pbf-email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email id..."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Subscribe"}</button>
            </form>
            <p className="pbf-policy">By submitting your email address, you agree to our <a href="https://pandabase.io/legal/privacy-policy" target="_blank" rel="noreferrer">privacy policy.</a></p>
            {message && <p className="pbf-message" role="status">{message}</p>}
          </div>

          <div className="pbf-articles" aria-label="Resources">
            {articles.map((title) => (
              <a key={title} className="pbf-article" href="https://pandabase.io/blog" target="_blank" rel="noreferrer">
                <span className="pbf-article-image" aria-hidden="true" />
                <span className="pbf-article-title">{title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="pbf-bottom">
          <small>Copyright © 2024 Pandabase. A registered trademark of Velta, LLC.</small>
          <div>
            <a href="https://pandabase.io/legal/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>
            <a href="https://pandabase.io/legal/merchant-services-agreement" target="_blank" rel="noreferrer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterPandabase
