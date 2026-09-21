import React, { useEffect, useRef, useState } from 'react'
import {
  defaultConfig,
  sanitizeConfig,
  makeTargets,
  vertexShader,
  fragmentShader,
  rgb,
} from './particles'
import type { ParticleConfig } from './particles'
import { advanceOrbit } from './orbits'
import type { OrbitState } from './orbits'
import { createBloom } from './bloom'

export interface ParticleFieldProps extends Partial<ParticleConfig> {
  className?: string
  replay?: number
  onStats?: (fps: number, count: number) => void
  onError?: (message: string) => void
}

/** A self-contained particle surface. Give its parent a height, or pass className. */
export default function ParticleField({
  mode = 'six',
  text = 'HELLO',
  image = '',
  speed = 1,
  size = 1.3,
  count = 12000,
  scale = 1,
  scatter = 0.16,
  glow = 0.8,
  depth = 0.5,
  interaction = 0.65,
  rotation = 0,
  brilliance = 1.3,
  starDensity = 7,
  twinkle = 0.7,
  flowSpeed = 1,
  starRays = 1,
  rayLength = 1,
  coreGlow = 1,
  color = '#a9dbff',
  accentColor = '#ffa66b',
  background = '#03090e',
  imageColors = true,
  invert = false,
  threshold = 90,
  paused = false,
  replay = 0,
  className = 'relative h-[600px] w-full',
  onStats,
  onError,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<{ rebuild: () => void; replay: () => void } | null>(null)
  const config = useRef<ParticleConfig>(defaultConfig)
  const callbacks = useRef({ onStats, onError })
  const [error, setError] = useState('')
  useEffect(() => {
    config.current = sanitizeConfig({
      mode,
      text,
      image,
      speed,
      size,
      count,
      scale,
      scatter,
      glow,
      brilliance,
      starDensity,
      twinkle,
      flowSpeed,
      starRays,
      rayLength,
      coreGlow,
      depth,
      interaction,
      rotation,
      color,
      accentColor,
      background,
      imageColors,
      invert,
      threshold,
      paused,
    })
    callbacks.current = { onStats, onError }
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    let disposed = false,
      frame = 0,
      abort = new AbortController()
    const report = (message: string) => {
      if (!disposed) {
        setError(message)
        callbacks.current.onError?.(message)
      }
    }
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      report('WebGL is unavailable. Enable hardware acceleration and try again.')
      return
    }
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, source)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s)
        gl.deleteShader(s)
        throw new Error(log || 'Shader compilation failed')
      }
      return s
    }
    const program = gl.createProgram()!
    const shaders: WebGLShader[] = []
    try {
      shaders.push(shader(gl.VERTEX_SHADER, vertexShader), shader(gl.FRAGMENT_SHADER, fragmentShader))
      shaders.forEach((s) => gl.attachShader(program, s))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program) || 'Could not link particle renderer')
    } catch (e) {
      report((e as Error).message)
      shaders.forEach((s) => gl.deleteShader(s))
      gl.deleteProgram(program)
      return
    }
    let bloom: ReturnType<typeof createBloom>
    try {
      bloom = createBloom(gl)
    } catch (e) {
      report((e as Error).message)
      shaders.forEach((s) => gl.deleteShader(s))
      gl.deleteProgram(program)
      return
    }
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    const uniforms: Record<string, WebGLUniformLocation | null> = {}
    ;[
      'Resolution',
      'Pointer',
      'Time',
      'Morph',
      'Size',
      'Scale',
      'Scatter',
      'Depth',
      'Interaction',
      'Rotation',
      'Dpr',
      'Intro',
      'Color',
      'Accent',
      'Glow',
      'MaxPoint',
      'Brilliance',
      'StarDensity',
      'Twinkle',
      'Footprint',
      'StarRays',
      'RayLength',
      'CoreGlow',
      'Orbit',
      'DensityScale',
    ].forEach((n) => (uniforms[n] = gl.getUniformLocation(program, 'u' + n)))
    const buffers: Record<string, WebGLBuffer> = {}
    const attributes: Record<string, number> = {}
    ;['From', 'Target', 'Color', 'Seed', 'Activity', 'RayMask'].forEach((n) => {
      buffers[n] = gl.createBuffer()!
      attributes[n] = gl.getAttribLocation(program, 'a' + n)
    })
    const bindAttributes = () =>
      Object.keys(buffers).forEach((n) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[n])
        gl.enableVertexAttribArray(attributes[n])
        gl.vertexAttribPointer(attributes[n], 3, gl.FLOAT, false, 0, 0)
      })
    function upload(name: string, data: Float32Array) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers[name])
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW)
    }
    let w = 1,
      h = 1,
      dpr = 1,
      n = 0,
      time = 0,
      morph = 1,
      intro = config.current.paused ? 1 : 0,
      last = 0,
      statsAt = 0,
      frames = 0,
      visible = true
    let from = new Float32Array(0),
      target = new Float32Array(0)
    let activity = new Float32Array(0),
      orbit: OrbitState | null = null,
      flowTime = 0
    let pointer = [10, 10],
      smoothed = [0, 0]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const maxPoint = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1]
    const rebuild = async () => {
      abort.abort()
      abort = new AbortController()
      const signal = abort.signal
      try {
        const result = await makeTargets(config.current, w / h, signal)
        if (disposed || signal.aborted) return
        const nextN = result.points.length / 3
        const nextFrom = new Float32Array(result.points.length)
        const m = morph * morph * (3 - 2 * morph)
        for (let i = 0; i < nextFrom.length; i++)
          nextFrom[i] = target.length
            ? from[i % from.length] * (1 - m) + target[i % target.length] * m
            : result.points[i]
        const hadPoints = n > 0
        from = nextFrom
        target = result.points
        activity = result.activity
        orbit = result.orbit
        flowTime = 0
        n = nextN
        morph = hadPoints ? 0 : 1
        const seeds = new Float32Array(n * 3)
        for (let i = 0; i < n * 3; i++) seeds[i] = (((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1) + 1) % 1
        // Background dust stays dim; the luminous stars belong to the shape.
        for (let i = 0; i < n; i += 10) if (i % 300 !== 0) seeds[i * 3 + 2] *= 0.83
        if (orbit) {
          for (let i = n - 4; i < n - 1; i++) seeds.set([0.4, 0.85, 0.9999], i * 3)
          seeds[n * 3 - 1] = 2
        }
        // One stable optical source per lane, never the central cluster or
        // background dust. Static image/text shapes use at most three sources.
        const rayMask = new Float32Array(n * 3)
        const candidates = new Array<number>(orbit ? 5 : 3).fill(-1)
        for (let i = 0; i < n; i++) {
          const lane = orbit ? orbit.lanes[i] : i % 3
          if (lane < 0 || i % 10 === 0) continue
          const previous = candidates[lane]
          if (previous < 0 || seeds[i * 3 + 2] > seeds[previous * 3 + 2]) candidates[lane] = i
        }
        candidates.forEach((i) => {
          if (i >= 0) rayMask[i * 3] = 1
        })
        upload('From', from)
        upload('Target', target)
        upload('Color', result.colors)
        upload('Seed', seeds)
        upload('Activity', activity)
        upload('RayMask', rayMask)
        report('')
      } catch (e) {
        if ((e as Error).name !== 'AbortError') report((e as Error).message)
      }
    }
    const resize = () => {
      const r = canvas.getBoundingClientRect(),
        oldAspect = w / h
      w = Math.max(1, r.width)
      h = Math.max(1, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      bloom.resize(canvas.width, canvas.height)
      if (Math.abs(oldAspect - w / h) > 0.025 || !n) void rebuild()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    })
    intersection.observe(canvas)
    const move = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer = [(event.clientX - r.left - w / 2) / h, (event.clientY - r.top - h / 2) / h]
    }
    const leave = () => {
      pointer = [10, 10]
    }
    const lost = (event: Event) => {
      event.preventDefault()
      report('The graphics context was interrupted. Refresh the page to restore it.')
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('webglcontextlost', lost)
    renderer.current = {
      rebuild: () => void rebuild(),
      replay: () => {
        intro = 0
        time = 0
        flowTime = 0
      },
    }
    resize()
    const tick = (now: number) => {
      if (disposed) return
      frame = requestAnimationFrame(tick)
      const dt = Math.min((now - (last || now)) / 1000, 0.05)
      last = now
      if (!visible || document.hidden || gl.isContextLost()) return
      const c = config.current
      if (!c.paused && !reduced.matches) {
        time += dt * c.speed
        flowTime += dt * c.speed * c.flowSpeed
      }
      if (!c.paused) {
        morph = Math.min(1, morph + dt / 1.5)
        intro = Math.min(1, intro + dt / 2.8)
      }
      if (reduced.matches) {
        intro = 1
        morph = 1
      }
      const lerp = 1 - Math.exp(-dt * 4)
      if (!c.paused) smoothed = smoothed.map((p, i) => p + ((pointer[i] === 10 ? 0 : pointer[i]) - p) * lerp)
      if (!n) return
      if (orbit) {
        advanceOrbit(orbit, flowTime, target, activity)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.Target)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, target)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.Activity)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, activity)
      }
      bloom.begin()
      gl.useProgram(program)
      bindAttributes()
      gl.uniform2f(uniforms.Resolution, w, h)
      gl.uniform2f(
        uniforms.Pointer,
        pointer[0] === 10 ? 10 : smoothed[0],
        pointer[1] === 10 ? 10 : smoothed[1],
      )
      const values = {
        Time: time,
        Morph: morph,
        Size: c.size,
        Scale: c.scale,
        Scatter: c.scatter,
        Depth: c.depth,
        Interaction: reduced.matches ? 0 : c.interaction,
        Rotation: (c.rotation * Math.PI) / 180,
        Dpr: dpr,
        Intro: intro,
        Glow: c.glow,
        MaxPoint: maxPoint,
        Brilliance: c.brilliance,
        StarDensity: c.starDensity,
        Twinkle: c.twinkle,
        Footprint: orbit ? 1 : 0.72,
        StarRays: c.starRays,
        RayLength: c.rayLength,
        CoreGlow: c.coreGlow,
        Orbit: orbit ? 1 : 0,
        DensityScale: Math.min(1, (orbit ? 4500 : 6000) / n),
      }
      Object.entries(values).forEach(([key, value]) => gl.uniform1f(uniforms[key], value))
      gl.uniform3fv(uniforms.Color, rgb(c.color))
      gl.uniform3fv(uniforms.Accent, rgb(c.accentColor))
      gl.drawArrays(gl.POINTS, 0, n)
      bloom.end(rgb(c.background), c.glow)
      frames++
      if (now - statsAt > 1000) {
        callbacks.current.onStats?.(Math.round((frames * 1000) / (now - statsAt)), n)
        frames = 0
        statsAt = now
      }
    }
    frame = requestAnimationFrame(tick)
    return () => {
      disposed = true
      abort.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('webglcontextlost', lost)
      Object.values(buffers).forEach((b) => gl.deleteBuffer(b))
      shaders.forEach((s) => gl.deleteShader(s))
      gl.deleteProgram(program)
      bloom.dispose()
      renderer.current = null
    }
  }, [])

  useEffect(() => {
    renderer.current?.rebuild()
  }, [mode, text, image, count, imageColors, invert, threshold])
  useEffect(() => {
    renderer.current?.replay()
  }, [replay])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-pan-y"
        role="img"
        aria-label={
          mode === 'text'
            ? `Particle text: ${text}`
            : mode === 'image'
              ? 'Custom image particle effect'
              : 'Flowing spiral particle effect'
        }
      />
      {error && (
        <div
          role="alert"
          className="absolute bottom-20 left-1/2 z-20 w-[min(90%,440px)] -translate-x-1/2 rounded-xl border border-amber-300/20 bg-[#242019]/95 px-5 py-4 text-sm leading-6 text-amber-100"
        >
          {error}
        </div>
      )}
    </div>
  )
}
