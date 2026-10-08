import { useEffect, useRef } from "react"
import { fragmentShader, vertexShader } from "./arc-flow-shaders"

export const ARC_FLOW_DEFAULTS = {
  top: "#2e6fae",
  mid: "#b2cbd8",
  warm: "#fff1bc",
  mint: "#a6dcd3",
  blue: "#1747b7",
  cyan: "#68b0d5",
  curve: -22,
  offset: -21,
  width: 1,
  flow: 1.45,
  light: 1,
  grain: 0.009,
  seed: 3.1,
  speed: 1.3,
}
export type ArcFlowSettings = typeof ARC_FLOW_DEFAULTS

function rgb(hex: string) {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  console.error("Arc Flow shader:", gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return null
}

export function ArcFlowBackground({
  className = "",
  ...settings
}: Partial<ArcFlowSettings> & { className?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef<ArcFlowSettings>({ ...ARC_FLOW_DEFAULTS, ...settings })
  settingsRef.current = { ...ARC_FLOW_DEFAULTS, ...settings }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false })
    if (!gl) return

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      return
    }

    const program = gl.createProgram()
    const vao = gl.createVertexArray()
    if (!program || !vao) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Arc Flow program:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      gl.deleteVertexArray(vao)
      return
    }

    gl.useProgram(program)
    gl.bindVertexArray(vao)
    const uniform = (name: string) => gl.getUniformLocation(program, `u_${name}`)
    const resolution = uniform("resolution")
    const time = uniform("time")
    gl.uniform1i(uniform("mode"), 0)
    const controls = ["curve", "offset", "width", "flow", "light", "grain", "seed"] as const
    const colors = ["top", "mid", "warm", "mint", "blue", "cyan"] as const
    const controlLocations = Object.fromEntries(controls.map((name) => [name, uniform(name)]))
    const colorLocations = Object.fromEntries(colors.map((name) => [name, uniform(name)]))

    let elapsed = 0
    let previousFrame = 0
    let frameId = 0
    let running = false
    let intersecting = true
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const render = (now: number) => {
      const current = settingsRef.current
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6)
      const width = Math.max(2, Math.round(bounds.width * ratio))
      const height = Math.max(2, Math.round(bounds.height * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
      if (previousFrame && !motion.matches) elapsed += Math.min((now - previousFrame) / 1000, 0.1) * current.speed
      previousFrame = now
      controls.forEach((name) => gl.uniform1f(controlLocations[name], current[name]))
      colors.forEach((name) => gl.uniform3fv(colorLocations[name], rgb(current[name])))
      gl.uniform2f(resolution, width, height)
      gl.uniform1f(time, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const tick = (now: number) => {
      if (!running) return
      render(now)
      if (motion.matches) {
        running = false
        return
      }
      frameId = window.requestAnimationFrame(tick)
    }

    const sync = () => {
      const shouldRun = intersecting && !document.hidden
      if (!shouldRun) {
        running = false
        window.cancelAnimationFrame(frameId)
        previousFrame = 0
      } else if (!running) {
        running = true
        frameId = window.requestAnimationFrame(tick)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (motion.matches) render(performance.now())
    })
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      sync()
    })
    intersectionObserver.observe(canvas)
    document.addEventListener("visibilitychange", sync)
    motion.addEventListener("change", sync)
    sync()

    return () => {
      running = false
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", sync)
      motion.removeEventListener("change", sync)
      gl.deleteProgram(program)
      gl.deleteVertexArray(vao)
    }
  }, [])

  return <canvas ref={canvasRef} className={`sphere-ai-flow ${className}`} aria-hidden="true" />
}
