import { useEffect, useMemo, useRef, type ReactNode } from "react"

const VERTEX_SHADER = `
  precision mediump float;

  attribute vec2 a_position;
  varying vec2 vUv;

  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;
  uniform float u_speed;
  uniform float u_scale;
  uniform float u_complexity;
  uniform float u_flow_rotation;
  uniform float u_pointer_strength;
  uniform float u_intensity;
  uniform float u_contrast;
  uniform float u_detail;
  uniform float u_threshold;
  uniform float u_vignette;
  uniform float u_scroll_influence;
  uniform float u_color_variation;
  uniform float u_hue_shift;
  uniform float u_opacity;
  uniform vec3 u_base_color;
  uniform vec3 u_background_color;

  vec2 rotate(vec2 uv, float angle) {
    return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * uv;
  }

  float neuroShape(vec2 uv, float time, float pointerForce) {
    vec2 sineAccumulator = vec2(0.0);
    vec2 result = vec2(0.0);
    float scale = u_scale;

    for (int layerIndex = 0; layerIndex < 15; layerIndex++) {
      float layerWeight = 1.0 - step(u_complexity, float(layerIndex));
      uv = rotate(uv, u_flow_rotation);
      sineAccumulator = rotate(sineAccumulator, u_flow_rotation);
      vec2 layer = uv * scale + float(layerIndex) + sineAccumulator - time;
      sineAccumulator += (sin(layer) + u_pointer_strength * pointerForce) * layerWeight;
      result += ((0.5 + 0.5 * cos(layer)) / scale) * layerWeight;
      scale *= 1.2;
    }

    return result.x + result.y;
  }

  void main() {
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;

    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float pointerForce = clamp(length(pointer), 0.0, 1.0);
    pointerForce = 0.5 * pow(1.0 - pointerForce, 2.0);

    float time = 0.001 * u_time * u_speed;
    float noise = neuroShape(uv, time, pointerForce);

    noise = u_intensity * pow(noise, u_contrast);
    noise += pow(noise, u_detail);
    noise = max(0.0, noise - u_threshold);
    noise *= 1.0 - clamp(length(vUv - 0.5) * u_vignette, 0.0, 1.0);

    float colorPhase = 3.0 * u_scroll_progress * u_scroll_influence + u_hue_shift;
    vec3 colorVector = u_base_color + vec3(
      0.0,
      0.4 * u_color_variation * cos(colorPhase),
      0.5 * u_color_variation * sin(colorPhase)
    );
    vec3 color = normalize(max(colorVector, vec3(0.001)));
    float alpha = clamp(noise * u_opacity, 0.0, 1.0);
    vec3 composed = color * noise * u_opacity + u_background_color * (1.0 - alpha);

    gl_FragColor = vec4(composed, 1.0);
  }
`

export type NeuroNoiseSettings = {
  backgroundColor: string
  baseColor: string
  colorVariation: number
  hueShift: number
  speed: number
  scale: number
  complexity: number
  flowRotation: number
  pointerStrength: number
  intensity: number
  contrast: number
  detail: number
  threshold: number
  vignette: number
  scrollInfluence: number
  opacity: number
  maxPixelRatio: number
  interactive: boolean
}

export const NEURO_NOISE_DEFAULTS: NeuroNoiseSettings = {
  backgroundColor: "#151912",
  baseColor: "#338080",
  colorVariation: 1,
  hueShift: 0,
  speed: 1,
  scale: 8,
  complexity: 15,
  flowRotation: 1,
  pointerStrength: 2.4,
  intensity: 1.2,
  contrast: 3,
  detail: 10,
  threshold: 0.5,
  vignette: 1,
  scrollInfluence: 1,
  opacity: 0.95,
  maxPixelRatio: 2,
  interactive: true,
}

export type NeuroNoiseProps = Partial<NeuroNoiseSettings> & {
  children?: ReactNode
  className?: string
}

type PointerState = {
  x: number
  y: number
  targetX: number
  targetY: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function parseHexColor(value: string, fallback: string) {
  const normalized = /^#[\da-f]{6}$/i.test(value) ? value : fallback
  return [
    Number.parseInt(normalized.slice(1, 3), 16) / 255,
    Number.parseInt(normalized.slice(3, 5), 16) / 255,
    Number.parseInt(normalized.slice(5, 7), 16) / 255,
  ] as const
}

export function NeuroNoise({
  children,
  className = "",
  backgroundColor = NEURO_NOISE_DEFAULTS.backgroundColor,
  baseColor = NEURO_NOISE_DEFAULTS.baseColor,
  colorVariation = NEURO_NOISE_DEFAULTS.colorVariation,
  hueShift = NEURO_NOISE_DEFAULTS.hueShift,
  speed = NEURO_NOISE_DEFAULTS.speed,
  scale = NEURO_NOISE_DEFAULTS.scale,
  complexity = NEURO_NOISE_DEFAULTS.complexity,
  flowRotation = NEURO_NOISE_DEFAULTS.flowRotation,
  pointerStrength = NEURO_NOISE_DEFAULTS.pointerStrength,
  intensity = NEURO_NOISE_DEFAULTS.intensity,
  contrast = NEURO_NOISE_DEFAULTS.contrast,
  detail = NEURO_NOISE_DEFAULTS.detail,
  threshold = NEURO_NOISE_DEFAULTS.threshold,
  vignette = NEURO_NOISE_DEFAULTS.vignette,
  scrollInfluence = NEURO_NOISE_DEFAULTS.scrollInfluence,
  opacity = NEURO_NOISE_DEFAULTS.opacity,
  maxPixelRatio = NEURO_NOISE_DEFAULTS.maxPixelRatio,
  interactive = NEURO_NOISE_DEFAULTS.interactive,
}: NeuroNoiseProps) {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resizeRef = useRef<() => void>(() => undefined)
  const redrawRef = useRef<() => void>(() => undefined)
  const settings = useMemo(
    () => ({
      backgroundColor,
      baseColor,
      colorVariation,
      hueShift,
      speed,
      scale,
      complexity,
      flowRotation,
      pointerStrength,
      intensity,
      contrast,
      detail,
      threshold,
      vignette,
      scrollInfluence,
      opacity,
      maxPixelRatio,
      interactive,
    }),
    [
      backgroundColor,
      baseColor,
      colorVariation,
      complexity,
      contrast,
      detail,
      flowRotation,
      hueShift,
      intensity,
      interactive,
      maxPixelRatio,
      opacity,
      pointerStrength,
      scale,
      scrollInfluence,
      speed,
      threshold,
      vignette,
    ],
  )
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null

    if (!gl) {
      console.warn("NeuroNoise requires WebGL support.")
      return
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("NeuroNoise shader compilation failed:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader)
      if (fragmentShader) gl.deleteShader(fragmentShader)
      return
    }

    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("NeuroNoise shader linking failed:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    const rawLocations = {
      position: gl.getAttribLocation(program, "a_position"),
      time: gl.getUniformLocation(program, "u_time"),
      ratio: gl.getUniformLocation(program, "u_ratio"),
      pointer: gl.getUniformLocation(program, "u_pointer_position"),
      scroll: gl.getUniformLocation(program, "u_scroll_progress"),
      speed: gl.getUniformLocation(program, "u_speed"),
      scale: gl.getUniformLocation(program, "u_scale"),
      complexity: gl.getUniformLocation(program, "u_complexity"),
      flowRotation: gl.getUniformLocation(program, "u_flow_rotation"),
      pointerStrength: gl.getUniformLocation(program, "u_pointer_strength"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      contrast: gl.getUniformLocation(program, "u_contrast"),
      detail: gl.getUniformLocation(program, "u_detail"),
      threshold: gl.getUniformLocation(program, "u_threshold"),
      vignette: gl.getUniformLocation(program, "u_vignette"),
      scrollInfluence: gl.getUniformLocation(program, "u_scroll_influence"),
      colorVariation: gl.getUniformLocation(program, "u_color_variation"),
      hueShift: gl.getUniformLocation(program, "u_hue_shift"),
      opacity: gl.getUniformLocation(program, "u_opacity"),
      baseColor: gl.getUniformLocation(program, "u_base_color"),
      backgroundColor: gl.getUniformLocation(program, "u_background_color"),
    }

    if (
      rawLocations.position < 0 ||
      Object.entries(rawLocations).some(
        ([key, location]) => key !== "position" && location === null,
      )
    ) {
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    const locations = rawLocations as typeof rawLocations &
      Record<Exclude<keyof typeof rawLocations, "position">, WebGLUniformLocation>
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    gl.useProgram(program)
    gl.enableVertexAttribArray(locations.position)
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0)
    gl.disable(gl.DEPTH_TEST)

    const pointer: PointerState = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const startedAt = performance.now()
    let animationFrame = 0
    let reducedMotion = motionQuery.matches
    let visible = true
    let disposed = false

    const applySettings = () => {
      const current = settingsRef.current
      const [baseRed, baseGreen, baseBlue] = parseHexColor(
        current.baseColor,
        NEURO_NOISE_DEFAULTS.baseColor,
      )
      const [backgroundRed, backgroundGreen, backgroundBlue] = parseHexColor(
        current.backgroundColor,
        NEURO_NOISE_DEFAULTS.backgroundColor,
      )

      gl.uniform1f(locations.speed, clamp(current.speed, 0, 3))
      gl.uniform1f(locations.scale, clamp(current.scale, 2, 18))
      gl.uniform1f(locations.complexity, Math.round(clamp(current.complexity, 1, 15)))
      gl.uniform1f(locations.flowRotation, clamp(current.flowRotation, 0, 2.5))
      gl.uniform1f(locations.pointerStrength, clamp(current.pointerStrength, 0, 5))
      gl.uniform1f(locations.intensity, clamp(current.intensity, 0.2, 3))
      gl.uniform1f(locations.contrast, clamp(current.contrast, 1, 6))
      gl.uniform1f(locations.detail, clamp(current.detail, 2, 14))
      gl.uniform1f(locations.threshold, clamp(current.threshold, 0, 1))
      gl.uniform1f(locations.vignette, clamp(current.vignette, 0, 2))
      gl.uniform1f(locations.scrollInfluence, clamp(current.scrollInfluence, 0, 3))
      gl.uniform1f(locations.colorVariation, clamp(current.colorVariation, 0, 2))
      gl.uniform1f(locations.hueShift, (clamp(current.hueShift, -180, 180) * Math.PI) / 180)
      gl.uniform1f(locations.opacity, clamp(current.opacity, 0, 1))
      gl.uniform3f(locations.baseColor, baseRed, baseGreen, baseBlue)
      gl.uniform3f(
        locations.backgroundColor,
        backgroundRed,
        backgroundGreen,
        backgroundBlue,
      )
    }

    const paintFrame = (currentTime: number) => {
      if (disposed) return

      pointer.x += (pointer.targetX - pointer.x) * 0.2
      pointer.y += (pointer.targetY - pointer.y) * 0.2
      applySettings()
      gl.uniform1f(locations.time, reducedMotion ? 0 : currentTime - startedAt)
      gl.uniform2f(locations.pointer, pointer.x, pointer.y)
      gl.uniform1f(
        locations.scroll,
        window.scrollY / Math.max(window.innerHeight * 2, 1),
      )
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const animate = (currentTime: number) => {
      paintFrame(currentTime)
      if (!reducedMotion && visible) animationFrame = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        clamp(settingsRef.current.maxPixelRatio, 0.5, 2),
      )
      const displayWidth = Math.round(width * pixelRatio)
      const displayHeight = Math.round(height * pixelRatio)

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
      }

      gl.viewport(0, 0, displayWidth, displayHeight)
      gl.uniform1f(locations.ratio, displayWidth / displayHeight)

      if (reducedMotion) paintFrame(performance.now())
    }

    const updatePointer = (clientX: number, clientY: number) => {
      if (!settingsRef.current.interactive) return
      const bounds = container.getBoundingClientRect()
      pointer.targetX = clamp((clientX - bounds.left) / Math.max(bounds.width, 1), 0, 1)
      pointer.targetY = 1 - clamp((clientY - bounds.top) / Math.max(bounds.height, 1), 0, 1)
      if (reducedMotion) paintFrame(performance.now())
    }

    const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY)
    const onClick = (event: MouseEvent) => updatePointer(event.clientX, event.clientY)
    const onScroll = () => {
      if (reducedMotion) paintFrame(performance.now())
    }
    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      window.cancelAnimationFrame(animationFrame)
      if (reducedMotion) paintFrame(performance.now())
      else animate(performance.now())
    }
    const visibilityObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            window.cancelAnimationFrame(animationFrame)
            if (visible) {
              if (reducedMotion) paintFrame(performance.now())
              else animate(performance.now())
            }
          })
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize)

    visibilityObserver?.observe(container)
    resizeObserver?.observe(container)
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("click", onClick)
    motionQuery.addEventListener("change", onMotionPreferenceChange)
    resizeRef.current = resize
    redrawRef.current = () => paintFrame(performance.now())

    resize()
    if (reducedMotion) paintFrame(performance.now())
    else animate(performance.now())

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      visibilityObserver?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("click", onClick)
      motionQuery.removeEventListener("change", onMotionPreferenceChange)
      resizeRef.current = () => undefined
      redrawRef.current = () => undefined
      gl.deleteBuffer(vertexBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  useEffect(() => {
    resizeRef.current()
    redrawRef.current()
  }, [settings])

  return (
    <section
      ref={containerRef}
      className={`relative isolate min-h-dvh w-full overflow-hidden bg-[#151912] text-[#fff6f7] ${className}`}
      aria-label="Neuro noise animated background"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block size-full"
        aria-hidden="true"
      />
      {children ? <div className="relative z-10 min-h-dvh">{children}</div> : null}
    </section>
  )
}

export default NeuroNoise
