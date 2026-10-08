import { useReducedMotion, type MotionProps } from 'framer-motion'

type RevealOptions = {
  delay?: number
  duration?: number
  distance?: number
  scale?: number
  blur?: number
  onLoad?: boolean
}

// A shared, gentle ease-out keeps the page's entrance sequence consistent.
const revealEase = [0.22, 1, 0.36, 1] as const

export function useRevealMotion() {
  const reduceMotion = useReducedMotion()

  return ({
    delay = 0,
    duration = 0.8,
    distance = 28,
    scale = 1,
    blur = 0,
    onLoad = false,
  }: RevealOptions = {}): MotionProps & { 'data-reveal': string } => {
    const visible = {
      opacity: 1,
      y: 0,
      scale: 1,
      ...(blur ? { filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : {}),
    }

    if (reduceMotion) {
      return {
        'data-reveal': '',
        initial: false,
        animate: { opacity: 1, y: 0, scale: 1, filter: 'none' },
        transition: { duration: 0, delay: 0 },
      }
    }

    return {
      'data-reveal': '',
      initial: {
        opacity: 0,
        y: distance,
        scale,
        ...(blur ? { filter: `blur(${blur}px)` } : {}),
      },
      ...(onLoad ? { animate: visible } : { whileInView: visible }),
      // Observe each item so stacked mobile cards reveal as they enter view.
      viewport: { once: true, amount: 0.15, margin: '0px 0px -32px 0px' },
      transition: { duration, delay, ease: revealEase, type: 'tween' },
    }
  }
}
