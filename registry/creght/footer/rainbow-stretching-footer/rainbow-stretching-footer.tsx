import { useEffect, useRef, type ReactNode } from "react"

export type RainbowStretchingFooterProps = {
  className?: string
}

const RAINBOW_URL =
  "https://fsu.creght.com/site/2081689097969078272/1785148393646__rainbow_footer.png"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function FooterLink({ children }: { children: ReactNode }) {
  return (
    <a
      className="flex h-[18px] w-max shrink-0 cursor-pointer flex-col items-stretch justify-center text-inherit no-underline outline-offset-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#050505]"
      href="#rainbow-footer"
      onClick={(event) => event.preventDefault()}
    >
      <span className="block select-none whitespace-nowrap">{children}</span>
      <i aria-hidden="true" className="block h-px w-full shrink-0 bg-[#050505] opacity-0" />
    </a>
  )
}

export function RainbowStretchingFooter({ className = "" }: RainbowStretchingFooterProps) {
  const footerRef = useRef<HTMLElement | null>(null)
  const creditRef = useRef<HTMLDivElement | null>(null)
  const socialRef = useRef<HTMLDivElement | null>(null)
  const metaRef = useRef<HTMLDivElement | null>(null)
  const rainbowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const viewportHeight = window.innerHeight
      const duration = viewportHeight * 0.48
      const footerTop = footerRef.current?.getBoundingClientRect().top ?? 0
      const progress = clamp(-footerTop / duration, 0, 1)
      const remaining = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1 - progress

      if (creditRef.current) {
        creditRef.current.style.transform = `translateY(${remaining * 94}px)`
      }
      if (socialRef.current) {
        socialRef.current.style.transform = `translateY(${remaining * 96}px)`
      }
      if (metaRef.current) {
        metaRef.current.style.transform = `translateY(${remaining * 48}px)`
      }
      if (rainbowRef.current) {
        rainbowRef.current.style.transform = `rotateX(${remaining * 90}deg)`
      }
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const textStyle =
    "font-mono text-[8px] font-semibold leading-[1.2] tracking-[0.6px] min-[810px]:text-[12px] min-[810px]:tracking-[1.3px]"

  return (
    <section
      className={`relative flex min-h-[198vh] w-full flex-col items-stretch overflow-hidden bg-white text-[#050505] ${className}`}
    >
      <div
        aria-label="Scroll prompt"
        className="relative z-[4] flex h-[50vh] shrink-0 basis-[50vh] items-center justify-center overflow-hidden"
      >
        <p className={textStyle}>SCROLL</p>
      </div>

      <footer
        ref={footerRef}
        className="relative z-[4] flex h-screen shrink-0 basis-[100vh] items-end justify-center overflow-visible"
        id="rainbow-footer"
      >
        <div
          className={`${textStyle} flex w-full flex-col items-center justify-center gap-[30px] pb-[140px] pt-[18px] min-[1200px]:pb-[196px]`}
        >
          <div
            ref={creditRef}
            className="flex min-h-min w-full translate-y-[94px] flex-col items-center justify-center gap-[2px] overflow-hidden will-change-transform"
          >
            <p className="whitespace-nowrap">DESIGNED BY DIA, REBUILT IN FRAMER</p>
            <FooterLink>BY FRAMER UNIVERSITY</FooterLink>
          </div>

          <div
            ref={socialRef}
            className="flex min-h-[18px] w-full translate-y-[96px] items-center justify-center gap-[4px] overflow-hidden will-change-transform min-[810px]:gap-[18px] min-[1200px]:gap-[24px] min-[1200px]:px-[230px]"
          >
            <FooterLink>X</FooterLink>
            <FooterLink>INSTAGRAM</FooterLink>
            <FooterLink>LINKEDIN</FooterLink>
          </div>

          <div
            ref={metaRef}
            className="flex min-h-[18px] w-full translate-y-[48px] items-center justify-between overflow-hidden px-[56px] will-change-transform min-[810px]:px-[124px] min-[1200px]:px-[168px]"
          >
            <FooterLink>PRIVACY POLICY</FooterLink>
            <FooterLink>CURRENT STATUS:</FooterLink>
          </div>

          <div className="flex min-h-[18px] w-full items-center justify-between overflow-hidden px-[12px] min-[810px]:px-[62px] min-[1200px]:px-[70px]">
            <FooterLink>CAREERS</FooterLink>
            <FooterLink>BETA</FooterLink>
          </div>
        </div>
      </footer>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-100px] left-0 right-0 z-[3] flex h-[800px] items-end justify-center"
      >
        <div
          ref={rainbowRef}
          className="relative h-[800px] w-full origin-bottom [transform:rotateX(90deg)] will-change-transform"
        >
          <img
            alt=""
            className="absolute inset-0 block h-full w-full object-cover object-center"
            src={RAINBOW_URL}
          />
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none relative z-[5] h-[48vh] shrink-0 basis-[48vh]" />
    </section>
  )
}

export default RainbowStretchingFooter
