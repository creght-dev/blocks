import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

export type AiLiquidShape = "Checks" | "Stripes" | "Edge"
export type AiLiquidBlendMode = "screen" | "normal" | "lighten"

export type AiLiquidSettings = {
  color1: string
  color2: string
  color3: string
  scale: number
  rotation: number
  speed: number
  proportion: number
  softness: number
  distortion: number
  swirl: number
  swirlIterations: number
  shape: AiLiquidShape
  shapeSize: number
  offset: number
  noise: number
  maxPixelRatio: number
  opacity: number
  blendMode: AiLiquidBlendMode
}

export const AI_LIQUID_DEFAULTS: AiLiquidSettings = {
  color1: "#050505",
  color2: "#0586FF",
  color3: "#050505",
  scale: 0.1,
  rotation: 140,
  speed: 5,
  proportion: 60,
  softness: 60,
  distortion: 25,
  swirl: 25,
  swirlIterations: 8,
  shape: "Edge",
  shapeSize: 80,
  offset: -150,
  noise: 20,
  maxPixelRatio: 1,
  opacity: 0.6,
  blendMode: "screen",
}

const LIQUID_BACKGROUND_SRC_DOC = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
      #background { position: fixed; inset: 0; opacity: 0.6; }
    </style>
  </head>
  <body>
    <div id="background"></div>
    <script>
      var instance = null;
      var pendingOptions = null;
      var initialOptions = {
        color1: '#050505',
        color2: '#0586FF',
        color3: '#050505',
        scale: 0.1,
        rotation: 140,
        speed: 5,
        proportion: 60,
        softness: 60,
        distortion: 25,
        swirl: 25,
        swirlIterations: 8,
        shape: 'Edge',
        shapeSize: 80,
        offset: -150,
        noise: 20,
        maxPixelRatio: 1
      };

      function applyOptions(options) {
        if (!options) return;
        pendingOptions = Object.assign({}, pendingOptions || {}, options);
        var background = document.getElementById('background');
        if (typeof pendingOptions.opacity === 'number') {
          background.style.opacity = String(Math.max(0, Math.min(1, pendingOptions.opacity)));
        }
        if (instance && typeof instance.setOptions === 'function') {
          instance.setOptions(pendingOptions);
        }
      }

      window.addEventListener('message', function (event) {
        if (event.source !== window.parent) return;
        if (!event.data || event.data.type !== 'creght:ai-liquid-options') return;
        applyOptions(event.data.options);
      });

      function startAnimatedBackground() {
        var attempts = 0;
        var timer = setInterval(function () {
          attempts += 1;
          if (
            window.AnimatedLiquidBackground &&
            typeof window.AnimatedLiquidBackground.create === 'function'
          ) {
            clearInterval(timer);
            instance = window.AnimatedLiquidBackground.create(
              document.getElementById('background'),
              initialOptions
            );
            applyOptions(pendingOptions);
          }
          if (attempts > 20) clearInterval(timer);
        }, 100);
      }

      window.addEventListener('beforeunload', function () {
        if (instance && typeof instance.dispose === 'function') instance.dispose();
      });
    </script>
    <script
      src="https://fsu.creght.com/project/nWkyxaaRToy/mnwMLqKFOed__animated_liquid_background.js"
      onload="startAnimatedBackground()"
    ></script>
  </body>
  </html>
`

const BLEND_MODE_CLASSES: Record<AiLiquidBlendMode, string> = {
  screen: "mix-blend-screen",
  normal: "mix-blend-normal",
  lighten: "mix-blend-lighten",
}

export type AiLiquidBackgroundProps = Partial<AiLiquidSettings> & {
  children?: ReactNode
  className?: string
}

export function AiLiquidBackground({
  children,
  className = "",
  color1 = AI_LIQUID_DEFAULTS.color1,
  color2 = AI_LIQUID_DEFAULTS.color2,
  color3 = AI_LIQUID_DEFAULTS.color3,
  scale = AI_LIQUID_DEFAULTS.scale,
  rotation = AI_LIQUID_DEFAULTS.rotation,
  speed = AI_LIQUID_DEFAULTS.speed,
  proportion = AI_LIQUID_DEFAULTS.proportion,
  softness = AI_LIQUID_DEFAULTS.softness,
  distortion = AI_LIQUID_DEFAULTS.distortion,
  swirl = AI_LIQUID_DEFAULTS.swirl,
  swirlIterations = AI_LIQUID_DEFAULTS.swirlIterations,
  shape = AI_LIQUID_DEFAULTS.shape,
  shapeSize = AI_LIQUID_DEFAULTS.shapeSize,
  offset = AI_LIQUID_DEFAULTS.offset,
  noise = AI_LIQUID_DEFAULTS.noise,
  maxPixelRatio = AI_LIQUID_DEFAULTS.maxPixelRatio,
  opacity = AI_LIQUID_DEFAULTS.opacity,
  blendMode = AI_LIQUID_DEFAULTS.blendMode,
}: AiLiquidBackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const options = useMemo(
    () => ({
      color1,
      color2,
      color3,
      scale,
      rotation,
      speed,
      proportion,
      softness,
      distortion,
      swirl,
      swirlIterations,
      shape,
      shapeSize,
      offset,
      noise,
      maxPixelRatio,
      opacity,
    }),
    [
      color1,
      color2,
      color3,
      distortion,
      maxPixelRatio,
      noise,
      offset,
      opacity,
      proportion,
      rotation,
      scale,
      shape,
      shapeSize,
      softness,
      speed,
      swirl,
      swirlIterations,
    ],
  )
  const syncOptions = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "creght:ai-liquid-options", options },
      "*",
    )
  }, [options])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    syncOptions()
  }, [syncOptions])

  return (
    <section
      ref={sectionRef}
      className={`relative isolate min-h-dvh w-full overflow-hidden bg-[#050505] ${className}`}
      aria-label="AI liquid animated background"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {isVisible ? (
          <iframe
            ref={iframeRef}
            srcDoc={LIQUID_BACKGROUND_SRC_DOC}
            onLoad={syncOptions}
            className={`size-full border-0 ${BLEND_MODE_CLASSES[blendMode]}`}
            title="Animated liquid background"
            tabIndex={-1}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
      </div>

      {children ? <div className="relative z-10 min-h-dvh">{children}</div> : null}
    </section>
  )
}

export default AiLiquidBackground
