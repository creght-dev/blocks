import { useEffect, useRef } from "react"
import * as THREE from "three"

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;
  uniform float bandWidthPx;
  uniform vec4 backgroundColor;
  uniform vec4 color;
  uniform vec4 color1;
  uniform vec4 color2;
  uniform vec4 color3;
  uniform float colorMode;
  uniform float blendMode;

  float random(in float x) {
    return fract(sin(x) * 1e4);
  }

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float bandCenterPx = floor(gl_FragCoord.x / bandWidthPx) * bandWidthPx + bandWidthPx * 0.5;
    uv.x = (bandCenterPx * 2.0 - resolution.x) / min(resolution.x, resolution.y);

    float t = time * 0.06 + random(uv.x) * 0.4;
    float lineWidth = 0.0008;
    vec3 colorIntensity = vec3(0.0);

    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        colorIntensity[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) - length(uv));
      }
    }

    vec3 finalColor;
    float finalAlpha;

    if (colorMode < 0.5) {
      finalColor = colorIntensity * color.rgb;
      finalAlpha = color.a;
    } else {
      finalColor = vec3(0.0);
      finalColor += colorIntensity.r * color1.rgb;
      finalColor += colorIntensity.g * color2.rgb;
      finalColor += colorIntensity.b * color3.rgb;
      finalAlpha = (color1.a + color2.a + color3.a) / 3.0;
    }

    float rayIntensity = max(max(finalColor.r, finalColor.g), finalColor.b);

    if (rayIntensity < 0.01) {
      finalColor = color.rgb * 0.1;
      rayIntensity = 0.1;
    }

    vec3 bgColor = backgroundColor.rgb;
    float bgAlpha = backgroundColor.a;
    vec3 blendedColor;
    float outputAlpha;

    if (blendMode < 0.5) {
      blendedColor = finalColor.rgb * rayIntensity + bgColor * bgAlpha * (1.0 - rayIntensity);
      outputAlpha = rayIntensity + bgAlpha * (1.0 - rayIntensity);
    } else {
      blendedColor = finalColor.rgb + bgColor * bgAlpha;
      outputAlpha = 1.0;
    }

    gl_FragColor = vec4(blendedColor, outputAlpha);
  }
`

export type ShaderLinesColorMode = "single" | "gradient"
export type ShaderLinesBlendMode = "alpha" | "additive"
export type ShaderLinesFlow = "in-out" | "out-in"

export type ShaderLinesCanvasProps = {
  className?: string
  backgroundColor?: string
  bandWidth?: number
  blendMode?: ShaderLinesBlendMode
  color?: string
  color1?: string
  color2?: string
  color3?: string
  colorMode?: ShaderLinesColorMode
  flow?: ShaderLinesFlow
  speed?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function mapLinear(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  if (inMax === inMin) return outMin
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

function mapSpeed(value: number) {
  return mapLinear(clamp(value, 0.1, 1), 0.1, 1, 1, 10)
}

function mapBandWidth(value: number) {
  return mapLinear(clamp(value, 0.1, 1), 0.1, 1, 2, 60)
}

function parseColor(input: string) {
  const normalized = input.trim().replace(/^#/, "")
  const expanded =
    normalized.length === 3 || normalized.length === 4
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized
  const valid = /^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(expanded)
  const value = valid ? expanded : "000000"

  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
    value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1,
  ] as const
}

export function ShaderLinesCanvas({
  className = "",
  backgroundColor = "#000000",
  bandWidth = 0.2,
  blendMode = "additive",
  color = "#ffffff",
  color1 = "#0008ff",
  color2 = "#f55d5d",
  color3 = "#cdff70",
  colorMode = "single",
  flow = "in-out",
  speed = 0.55,
}: ShaderLinesCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      time: { value: 1 },
      resolution: { value: new THREE.Vector2() },
      bandWidthPx: { value: 1 },
      backgroundColor: {
        value: new THREE.Vector4(...parseColor(backgroundColor)),
      },
      color: { value: new THREE.Vector4(...parseColor(color)) },
      color1: { value: new THREE.Vector4(...parseColor(color1)) },
      color2: { value: new THREE.Vector4(...parseColor(color2)) },
      color3: { value: new THREE.Vector4(...parseColor(color3)) },
      colorMode: { value: colorMode === "single" ? 0 : 1 },
      blendMode: { value: blendMode === "alpha" ? 0 : 1 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: blendMode === "alpha",
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = "absolute inset-0 block h-full w-full"
    container.appendChild(renderer.domElement)

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height, false)
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      )
    }

    resize()
    window.addEventListener("resize", resize)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    let animationFrame = 0
    let lastTime = 0
    const speedValue = mapSpeed(speed)
    const flowSign = flow === "out-in" ? -1 : 1
    const bandWidthValue = mapBandWidth(bandWidth)

    const animate = (currentTime: number) => {
      animationFrame = requestAnimationFrame(animate)
      const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016
      lastTime = currentTime
      uniforms.time.value += Math.min(deltaTime, 0.1) * speedValue * flowSign
      uniforms.bandWidthPx.value = bandWidthValue * renderer.getPixelRatio()
      renderer.render(scene, camera)
    }

    animate(0)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener("resize", resize)
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [
    backgroundColor,
    bandWidth,
    blendMode,
    color,
    color1,
    color2,
    color3,
    colorMode,
    flow,
    speed,
  ])

  return (
    <div
      ref={containerRef}
      className={`relative block h-full w-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  )
}
