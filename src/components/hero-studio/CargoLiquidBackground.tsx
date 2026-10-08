import { useEffect, useRef } from "react"

export type CargoLiquidSettings = {
  color1: string
  color2: string
  color3: string
  proportion: number
  softness: number
  shape: "Checks" | "Stripes" | "Edge"
  shapeSize: number
  scale: number
  rotation: number
  speed: number
  distortion: number
  swirl: number
  swirlIterations: number
}

export const CARGO_LIQUID_DEFAULTS: CargoLiquidSettings = {
  color1: "#262626",
  color2: "#75c1f0",
  color3: "#ffffff",
  proportion: 35,
  softness: 80,
  shape: "Checks",
  shapeSize: 10,
  scale: 1,
  rotation: 0,
  speed: 25,
  distortion: 12,
  swirl: 80,
  swirlIterations: 6,
}

const CARGO_LIQUID_VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

// Adapted from Cargo Effects Lab's Animated Liquid shader. The simplex-noise
// structure is by Inigo Quilez, Copyright (c) 2013.
//
// The MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
const CARGO_LIQUID_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor1, uColor2, uColor3;
uniform float uScale, uRotation, uSpeed, uProportion, uSoftness;
uniform float uDistortion, uSwirl, uSwirlIterations, uShape, uShapeSize;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = step(a.yx, a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h*h*h*h * vec3(dot(a,hash(i)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
  return dot(n, vec3(70.0));
}
mat2 rotate2d(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
void main() {
  vec2 uv = (vUv - .5) * vec2(uResolution.x / uResolution.y, 1.);
  uv = rotate2d(uRotation) * uv * (1.3 + uScale * 2.8);
  float t = uTime * uSpeed * .18;
  float n1 = noise(uv * .55 + vec2(t, -.4 * t));
  float n2 = noise(uv * 1.1 - vec2(.7 * t, t));
  float angle = n1 * 6.2831853;
  uv += uDistortion * .7 * n2 * vec2(cos(angle), sin(angle));
  for (int k = 1; k <= 8; k++) {
    float i = float(k);
    float enabled = step(i, uSwirlIterations);
    uv.x += enabled * uSwirl * .27 / i * cos(t + i * 1.5 * uv.y);
    uv.y += enabled * uSwirl * .27 / i * cos(t + i * uv.x);
  }
  float field;
  if (uShape < .5) field = .5 + .5 * sin(uv.x * (.8 + 3. * uShapeSize)) * cos(uv.y * (.8 + 3. * uShapeSize));
  else if (uShape < 1.5) field = .5 + .5 * sin(uv.y * (1. + 5. * uShapeSize));
  else field = smoothstep(-.4, .4, uv.y + .2 * n1);
  field = clamp(field + (uProportion - .5) * .75, 0., 1.);
  float edge = mix(.035, .34, uSoftness);
  vec3 col = mix(uColor1, uColor2, smoothstep(.32 - edge, .32 + edge, field));
  col = mix(col, uColor3, smoothstep(.68 - edge, .68 + edge, field));
  gl_FragColor = vec4(col, 1.);
}`

function cargoLiquidColor(hex: string): [number, number, number] {
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as [
    number,
    number,
    number,
  ]
}

export function CargoLiquidBackground({
  className = "",
  ...settings
}: Partial<CargoLiquidSettings> & { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<CargoLiquidSettings>({ ...CARGO_LIQUID_DEFAULTS, ...settings })
  settingsRef.current = { ...CARGO_LIQUID_DEFAULTS, ...settings }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const canvas = document.createElement("canvas")
    canvas.setAttribute("aria-hidden", "true")
    canvas.style.cssText = "display:block;width:100%;height:100%;"
    container.appendChild(canvas)
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false })
    if (!gl) return () => canvas.remove()

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
      gl.deleteShader(shader)
      return null
    }
    const vertex = compile(gl.VERTEX_SHADER, CARGO_LIQUID_VERTEX)
    const fragment = compile(gl.FRAGMENT_SHADER, CARGO_LIQUID_FRAGMENT)
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      canvas.remove()
      return
    }
    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      canvas.remove()
      return
    }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      canvas.remove()
      return
    }
    gl.useProgram(program)
    const vertices = gl.createBuffer()
    if (!vertices) {
      gl.deleteProgram(program)
      canvas.remove()
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniforms = new Map<string, WebGLUniformLocation | null>()
    const location = (name: string) => {
      if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(program, name))
      return uniforms.get(name) ?? null
    }
    const float = (name: string, value: number) => gl.uniform1f(location(name), value)
    const color = (name: string, value: string) => gl.uniform3fv(location(name), cargoLiquidColor(value))
    const resize = () => {
      const bounds = container.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const density = Math.min(devicePixelRatio || 1, 2)
      const cap = Math.min(1, Math.sqrt(2073600 / (bounds.width * bounds.height * density * density)))
      const width = Math.max(1, Math.round(bounds.width * density * cap))
      const height = Math.max(1, Math.round(bounds.height * density * cap))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()
    let frame = 0
    let last = 0
    let time = 0
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      time += Math.min((now - (last || now)) / 1000, 0.05)
      last = now
      if (!canvas.width || !canvas.height) return
      const s = settingsRef.current
      gl.useProgram(program)
      gl.uniform2f(location("uResolution"), canvas.width, canvas.height)
      float("uTime", time)
      color("uColor1", s.color1)
      color("uColor2", s.color2)
      color("uColor3", s.color3)
      float("uScale", s.scale)
      float("uRotation", (s.rotation * Math.PI) / 180)
      float("uSpeed", s.speed / 25)
      float("uProportion", s.proportion / 100)
      float("uSoftness", s.softness / 100)
      float("uDistortion", s.distortion / 50)
      float("uSwirl", s.swirl / 100)
      float("uSwirlIterations", s.swirlIterations)
      float("uShape", ["Checks", "Stripes", "Edge"].indexOf(s.shape))
      float("uShapeSize", s.shapeSize / 100)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) {
        last = 0
        frame = requestAnimationFrame(draw)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", onVisibility)
      resizeObserver.disconnect()
      gl.deleteBuffer(vertices)
      gl.deleteProgram(program)
      canvas.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(125deg, ${settingsRef.current.color1}, ${settingsRef.current.color2} 55%, ${settingsRef.current.color3})`,
      }}
    />
  )
}
