"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

export type OrbitaWorld = "milkyway" | "andromeda" | "blackhole"

export type OrbitaHeroSceneProps = {
  className?: string
  world: OrbitaWorld
}

const starVertex = `
attribute float aSize;
attribute float aPhase;
varying vec3 vColor;
uniform float uTime;
uniform float uPixel;
uniform float uGlow;
varying float vAlpha;
void main() {
  vColor = color;
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  float pulse = .82 + .18 * sin(uTime * .7 + aPhase);
  gl_PointSize = clamp(aSize * uPixel * (230.0 / -p.z) * (0.8 + uGlow * .2), 1.0, 80.0);
  vAlpha = pulse;
}`

const starFragment = `
varying vec3 vColor;
varying float vAlpha;
uniform float uGlow;
void main() {
  float d = length(gl_PointCoord - .5) * 2.0;
  if(d > 1.0) discard;
  float a = exp(-d*d*5.0) * .5 + exp(-d*d*55.0) * .65;
  gl_FragColor = vec4(vColor * (1.0 + uGlow * .35), a * vAlpha);
}`

const blackHoleVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

const blackHoleFragment = `
precision highp float;
varying vec2 vUv;
uniform vec3 uCamera;
uniform mat3 uRotation;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGlow;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x),
    f.y
  );
}

float bands(float r, float angle) {
  float s = sin(r * 32.0 + sin(angle * 7.0 + r * 2.0 - uTime * .35) * 1.3) * .5 + .5;
  float n = noise(vec2(r * 5.0, angle * 8.0 - uTime * .6 / r));
  float m = noise(vec2(r * 15.0, angle * 27.0 - uTime * .8 / r));
  return (.28 + .72 * n) * (.55 + .45 * s) * (.7 + .3 * m);
}

vec3 disk(vec3 p) {
  float r = length(p.xz);
  float a = atan(p.z, p.x);
  float edge = smoothstep(2.7, 3.15, r) * (1.0 - smoothstep(8.0, 11.0, r));
  float temp = pow(3.0 / max(r, 3.0), 1.7);
  vec3 color = mix(vec3(1.0, .19, .035), vec3(1.0, .86, .59), temp);
  float doppler = clamp(1.0 + .45 * sin(a + .6), .45, 1.6);
  return color * edge * bands(r, a) * temp * doppler * 2.7;
}

void main() {
  vec2 uv = (vUv - .5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;
  vec3 ro = uCamera;
  vec3 rd = normalize(uRotation * vec3(uv * tan(radians(42.0) * .5), -1.0));
  vec3 p = ro;
  vec3 col = vec3(0.0);
  float trans = 1.0;
  float minR = 100.0;
  bool captured = false;

  for(int i = 0; i < 140; i++) {
    float r = length(p);
    minR = min(minR, r);
    if(r < 1.03) {
      captured = true;
      break;
    }
    if(r > 65.0) break;
    float stepSize = clamp(r * .085, .095, 1.7);
    vec3 old = p;
    float force = 1.48 / (r * r);
    rd = normalize(rd - normalize(p) * force * stepSize);
    p += rd * stepSize;
    if(old.y * p.y < 0.0) {
      float f = abs(old.y) / (abs(old.y) + abs(p.y));
      vec3 hit = mix(old, p, f);
      float rad = length(hit.xz);
      if(rad > 2.7 && rad < 11.0) {
        vec3 d = disk(hit);
        col += d * trans;
        trans *= .38;
      }
    }
    float radial = length(p.xz);
    if(radial > 2.7 && radial < 11.0) {
      float haze = exp(-abs(p.y) * 15.0) * stepSize;
      col += disk(p) * haze * trans * .38;
    }
  }

  float ring = exp(-pow((minR - 1.48) * 12.0, 2.0));
  col += vec3(1.0, .64, .27) * ring * .32;
  if(!captured) {
    vec2 sp = vec2(atan(rd.z, rd.x), asin(rd.y)) * 280.0;
    vec2 cell = floor(sp);
    float s = hash(cell);
    float star = pow(max(0.0, 1.0 - length(fract(sp) - .5) * 2.0), 18.0) * step(.995, s);
    col += vec3(.55, .65, .85) * star * trans * .5;
  }
  col *= .9 + uGlow * .65;
  col = vec3(1.0) - exp(-col * 1.5);
  gl_FragColor = vec4(col, 1.0);
}`

function seededRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function makePoints(
  positions: number[],
  colors: number[],
  sizes: number[],
  random: () => number,
  pixelRatio: number,
) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1))
  geometry.setAttribute(
    "aPhase",
    new THREE.Float32BufferAttribute(sizes.map(() => random() * 6.28), 1),
  )

  const material = new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: pixelRatio },
      uGlow: { value: 1 },
    },
  })

  return new THREE.Points(geometry, material)
}

function makeGalaxy(andromeda: boolean, pixelRatio: number) {
  const group = new THREE.Group()
  const random = seededRandom(andromeda ? 130 : 42)
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  const core = new THREE.Color("#ffe4bb")
  const blue = new THREE.Color(andromeda ? "#aaa4e8" : "#99bdec")
  const violet = new THREE.Color("#b192db")

  for (let index = 0; index < 108000; index += 1) {
    const bulge = index < 20000
    const radius = bulge ? Math.pow(random(), 1.6) * 3.8 : Math.pow(random(), .65) * 15.5
    const armCount = andromeda ? 2 : 4
    const arm = (index % armCount) * Math.PI * 2 / armCount
    const angle = bulge
      ? random() * Math.PI * 2
      : arm + 2.9 * Math.log(radius + .8) + Math.pow(random(), 2) * (random() < .5 ? -1 : 1) * (.85 + 1.5 / (radius + 1))
    const scatter = bulge ? .6 : .25 + Math.pow(radius / 15, 2) * .8
    let x = Math.cos(angle) * radius + (random() - .5) * scatter
    const z = Math.sin(angle) * radius + (random() - .5) * scatter
    if (bulge && !andromeda) x *= 1.65
    const y = (random() + random() + random() - 1.5) * (bulge ? 2.1 * Math.exp(-radius * .3) : .45 + .2 * radius / 15)
    positions.push(x, y, z * (andromeda ? .86 : 1))

    const color = core.clone().lerp(random() > .72 ? violet : blue, Math.min(1, radius / 8))
    color.multiplyScalar(.3 + random() * .7)
    colors.push(color.r, color.g, color.b)
    sizes.push((.1 + Math.pow(random(), 5) * .9) * (bulge ? .8 : 1))
  }
  group.add(makePoints(positions, colors, sizes, random, pixelRatio))

  const dustPositions: number[] = []
  const dustColors: number[] = []
  const dustSizes: number[] = []
  for (let index = 0; index < 9500; index += 1) {
    const radius = 1.5 + Math.pow(random(), .75) * 13.8
    const armCount = andromeda ? 2 : 4
    const angle = (index % armCount) * Math.PI * 2 / armCount + 2.9 * Math.log(radius + .8) + (random() - .5) * (.27 + .24 * random())
    dustPositions.push(
      Math.cos(angle) * radius,
      (random() - .5) * .5,
      Math.sin(angle) * radius * (andromeda ? .86 : 1),
    )
    const color = new THREE.Color(andromeda ? "#8873ae" : "#5273a3")
      .lerp(new THREE.Color("#baa399"), Math.max(0, 1 - radius / 6))
      .multiplyScalar((.02 + random() * .065) * (.45 + .55 * Math.pow(Math.sin(radius * 1.9 + (index % armCount) * 1.3), 2)))
    dustColors.push(color.r, color.g, color.b)
    dustSizes.push(3 + random() * 5)
  }
  group.add(makePoints(dustPositions, dustColors, dustSizes, random, pixelRatio))
  return group
}

function makeStarfield(pixelRatio: number) {
  const random = seededRandom(519)
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  for (let index = 0; index < 2600; index += 1) {
    const angle = random() * 6.28
    const vertical = random() * 2 - 1
    const radius = 95 + random() * 90
    const spread = Math.sqrt(1 - vertical * vertical)
    positions.push(
      radius * spread * Math.cos(angle),
      radius * vertical,
      radius * spread * Math.sin(angle),
    )
    const brightness = .35 + random() * .8
    colors.push(brightness * .7, brightness * .8, brightness)
    sizes.push(.18 + Math.pow(random(), 5) * 1.1)
  }
  return makePoints(positions, colors, sizes, random, pixelRatio)
}

export function OrbitaHeroScene({ className = "", world }: OrbitaHeroSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = hostRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      })
    } catch {
      setFailed(true)
      return
    }

    let disposed = false
    let animationFrame = 0
    let visible = true
    let elapsed = 0
    let previousTime = performance.now()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pixelRatio = Math.min(window.devicePixelRatio || 1, world === "blackhole" ? 1.25 : 1.7)

    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = "block size-full"
    renderer.domElement.setAttribute("aria-hidden", "true")
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, .05, 600)
    const baseCamera = world === "blackhole"
      ? new THREE.Vector3(0, 2.4, 24)
      : new THREE.Vector3(0, 26, 37)
    let cameraDistance = baseCamera.length()
    const object = new THREE.Group()
    const isInteractiveGalaxy = world === "milkyway"
    const isInteractiveBlackHole = world === "blackhole"
    const isInteractive = isInteractiveGalaxy || isInteractiveBlackHole
    scene.add(object)

    let blackHoleMaterial: THREE.ShaderMaterial | null = null
    if (world === "blackhole") {
      blackHoleMaterial = new THREE.ShaderMaterial({
        vertexShader: blackHoleVertex,
        fragmentShader: blackHoleFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uCamera: { value: camera.position.clone() },
          uRotation: { value: new THREE.Matrix3() },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uGlow: { value: 1 },
        },
      })
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blackHoleMaterial)
      screen.frustumCulled = false
      scene.add(screen)
    } else {
      scene.add(makeStarfield(pixelRatio))
      object.add(makeGalaxy(world === "andromeda", pixelRatio))
      object.rotation.y = world === "andromeda" ? .9 : -.3
      object.scale.setScalar(isInteractiveGalaxy ? 1.22 : 1)
    }

    const initialRotationX = isInteractiveBlackHole
      ? Math.atan2(baseCamera.y, Math.hypot(baseCamera.x, baseCamera.z))
      : object.rotation.x
    const initialRotationY = isInteractiveBlackHole
      ? Math.atan2(baseCamera.x, baseCamera.z)
      : object.rotation.y
    const interaction = {
      dragging: false,
      hoverX: 0,
      hoverY: 0,
      pointerId: -1,
      previousX: 0,
      previousY: 0,
      rotationX: initialRotationX,
      rotationY: initialRotationY,
    }
    const renderedRotation = {
      x: initialRotationX,
      y: initialRotationY,
    }

    const interactionSurface = isInteractive
      ? mount.closest<HTMLElement>("section") ?? mount
      : null

    const isInteractiveControl = (target: EventTarget | null) =>
      target instanceof Element
      && target.closest("a,button,input,select,textarea,[role='button'],[contenteditable='true']") !== null

    const handlePointerDown = (event: PointerEvent) => {
      if (!interactionSurface || (event.pointerType === "mouse" && event.button !== 0) || isInteractiveControl(event.target)) return
      interaction.dragging = true
      interaction.pointerId = event.pointerId
      interaction.previousX = event.clientX
      interaction.previousY = event.clientY
      interactionSurface.setPointerCapture(event.pointerId)
      interactionSurface.style.cursor = "grabbing"
      if (event.pointerType === "mouse") event.preventDefault()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactionSurface) return
      const bounds = interactionSurface.getBoundingClientRect()
      interaction.hoverX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1)
      interaction.hoverY = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1)

      if (!interaction.dragging || event.pointerId !== interaction.pointerId) return
      const deltaX = event.clientX - interaction.previousX
      const deltaY = event.clientY - interaction.previousY
      interaction.rotationY += deltaX * .006
      interaction.rotationX = THREE.MathUtils.clamp(interaction.rotationX + deltaY * .0045, -.95, .95)
      interaction.previousX = event.clientX
      interaction.previousY = event.clientY
    }

    const finishPointerInteraction = (event: PointerEvent) => {
      if (!interactionSurface || event.pointerId !== interaction.pointerId) return
      interaction.dragging = false
      interaction.pointerId = -1
      if (interactionSurface.hasPointerCapture(event.pointerId)) {
        interactionSurface.releasePointerCapture(event.pointerId)
      }
      interactionSurface.style.cursor = "grab"
    }

    const handlePointerLeave = () => {
      if (interaction.dragging) return
      interaction.hoverX = 0
      interaction.hoverY = 0
    }

    const previousCursor = interactionSurface?.style.cursor ?? ""
    const previousTouchAction = interactionSurface?.style.touchAction ?? ""
    if (interactionSurface) {
      interactionSurface.style.cursor = "grab"
      interactionSurface.style.touchAction = "pan-y"
      interactionSurface.addEventListener("pointerdown", handlePointerDown)
      interactionSurface.addEventListener("pointermove", handlePointerMove)
      interactionSurface.addEventListener("pointerup", finishPointerInteraction)
      interactionSurface.addEventListener("pointercancel", finishPointerInteraction)
      interactionSurface.addEventListener("pointerleave", handlePointerLeave)
    }

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      world === "blackhole" ? .08 : .45,
      world === "blackhole" ? .05 : .45,
      .65,
    )
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const resize = () => {
      const width = Math.max(1, mount.clientWidth)
      const height = Math.max(1, mount.clientHeight)
      renderer.setSize(width, height, false)
      composer.setSize(width, height)
      camera.aspect = width / height
      cameraDistance = baseCamera.length() * (width / height < .85 ? 1.55 : 1)
      camera.position.copy(baseCamera)
      camera.position.setLength(cameraDistance)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      blackHoleMaterial?.uniforms.uResolution.value.set(width, height)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true
      },
      { rootMargin: "160px" },
    )
    intersectionObserver.observe(mount)

    const render = (now: number) => {
      if (disposed) return
      animationFrame = window.requestAnimationFrame(render)
      const delta = Math.min((now - previousTime) / 1000, .05)
      previousTime = now
      if (!visible || document.hidden) return
      if (!reducedMotion) elapsed += delta

      if (isInteractive) {
        if (isInteractiveGalaxy && !interaction.dragging && !reducedMotion) interaction.rotationY += delta * .012
        const hoverStrength = interaction.dragging ? 0 : 1
        renderedRotation.x = THREE.MathUtils.damp(
          renderedRotation.x,
          interaction.rotationX + interaction.hoverY * .1 * hoverStrength,
          8,
          delta,
        )
        renderedRotation.y = THREE.MathUtils.damp(
          renderedRotation.y,
          interaction.rotationY + interaction.hoverX * .16 * hoverStrength,
          8,
          delta,
        )

        if (isInteractiveBlackHole) {
          const cosPitch = Math.cos(renderedRotation.x)
          camera.position.set(
            Math.sin(renderedRotation.y) * cosPitch * cameraDistance,
            Math.sin(renderedRotation.x) * cameraDistance,
            Math.cos(renderedRotation.y) * cosPitch * cameraDistance,
          )
          camera.lookAt(0, 0, 0)
          camera.updateMatrixWorld()
        } else {
          object.rotation.x = renderedRotation.x
          object.rotation.y = renderedRotation.y
        }
      } else if (world !== "blackhole" && !reducedMotion) {
        object.rotation.y += delta * .012
      }
      scene.traverse((entry) => {
        if (entry instanceof THREE.Points && entry.material instanceof THREE.ShaderMaterial) {
          entry.material.uniforms.uTime.value = elapsed
          entry.material.uniforms.uGlow.value = 1
        }
      })
      if (blackHoleMaterial) {
        blackHoleMaterial.uniforms.uTime.value = elapsed
        blackHoleMaterial.uniforms.uCamera.value.copy(camera.position)
        blackHoleMaterial.uniforms.uRotation.value.setFromMatrix4(camera.matrixWorld)
      }
      composer.render()
    }
    animationFrame = window.requestAnimationFrame(render)

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      setFailed(true)
    }
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost)

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost)
      if (interactionSurface) {
        interactionSurface.removeEventListener("pointerdown", handlePointerDown)
        interactionSurface.removeEventListener("pointermove", handlePointerMove)
        interactionSurface.removeEventListener("pointerup", finishPointerInteraction)
        interactionSurface.removeEventListener("pointercancel", finishPointerInteraction)
        interactionSurface.removeEventListener("pointerleave", handlePointerLeave)
        interactionSurface.style.cursor = previousCursor
        interactionSurface.style.touchAction = previousTouchAction
      }

      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      scene.traverse((entry) => {
        if (entry instanceof THREE.Mesh || entry instanceof THREE.Points) {
          geometries.add(entry.geometry)
          const entryMaterials = Array.isArray(entry.material) ? entry.material : [entry.material]
          entryMaterials.forEach((material) => materials.add(material))
        }
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      composer.passes.forEach((pass) => pass.dispose())
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [world])

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black ${className}`} aria-hidden="true">
      <div ref={hostRef} className="absolute inset-0" />
      {failed ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(121,159,255,0.24),transparent_24%),radial-gradient(circle_at_70%_48%,rgba(255,188,113,0.14),transparent_42%),#020308]" />
      ) : null}
    </div>
  )
}
