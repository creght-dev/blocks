import { useEffect, useRef } from "react"
import * as THREE from "three"
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js"

import {
  BACKGROUND_FRAGMENT, BACKGROUND_VERTEX, COMPOSITE_FRAGMENT,
  DUST_FRAGMENT, DUST_VERTEX, SCREEN_VERTEX, STAR_FRAGMENT,
  STAR_INDICES, STAR_VERTEX, STAR_VERTICES, TRAIL_FRAGMENT,
} from "./lodestar-source"

// Parameters from the source's graphics profile and particle configuration.
// The hero is a mesh-sampled extruded star, NOT a rotating volumetric point cloud.
const SOURCE = {
  cameraZ: 800,
  sizeFill: 0.68,
  shapeScale: 0.48 / 2.55,
  zRange: 0.12,
  sizeRef: 5600,
  tilt: 0.58,
  rotationSpeed: 9,
  cursorRadius: 78,
  cursorForce: 34,
  cursorReturn: 5.2,
  color: "#58467b",
}

function seededRandom(seed: number) {
  return () => {
    let n = (seed += 0x6d2b79f5)
    n = Math.imul(n ^ (n >>> 15), n | 1)
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61)
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296
  }
}

export function ParticleLodestar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.closest<HTMLElement>(".hero-lodestar")
    if (!canvas || !section) return
    const cursor = section.querySelector<HTMLElement>(".hero-lodestar__cursor")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches
    const cores = navigator.hardwareConcurrency || 8
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const low = motionQuery.matches
    const medium = !low && (coarse || (memory !== undefined && memory <= 4) || (cores <= 4 && window.devicePixelRatio >= 2))
    const count = low ? 1800 : medium ? 2800 : 4000
    const dustCount = low ? 3000 : medium ? 6000 : 10000
    const twinkleFraction = low ? 0 : medium ? 0.2 : 0.4
    const twinkleIntensity = low ? 0 : medium ? 1.8 : 3.5
    const pixelRatio = Math.min(window.devicePixelRatio || 1, low ? 1 : medium ? 1.5 : 2)
    const random = seededRandom(481516)
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" })
    } catch {
      section.dataset.webgl = "unavailable"
      return
    }
    renderer.setPixelRatio(pixelRatio)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.autoClear = false

    const starScene = new THREE.Scene()
    const starGroup = new THREE.Group()
    starScene.add(starGroup)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1600)
    camera.position.z = SOURCE.cameraZ
    const sourceGeometry = new THREE.BufferGeometry()
    sourceGeometry.setAttribute("position", new THREE.BufferAttribute(STAR_VERTICES.slice(), 3))
    sourceGeometry.setIndex(new THREE.BufferAttribute(STAR_INDICES.slice(), 1))
    // three@0.170 implements this method; its matching DefinitelyTyped package omits it.
    const samplingMaterial = new THREE.MeshBasicMaterial()
    const samplingMesh = new THREE.Mesh(sourceGeometry, samplingMaterial)
    const sampler = new MeshSurfaceSampler(samplingMesh) as MeshSurfaceSampler & {
      setRandomGenerator(generator: () => number): MeshSurfaceSampler
    }
    sampler.setRandomGenerator(random).build()
    samplingMaterial.dispose()
    const point = new THREE.Vector3()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const brightness = new Float32Array(count)
    const opacity = new Float32Array(count)
    const baseColor = new THREE.Color(SOURCE.color)
    const particles = Array.from({ length: count }, () => {
      sampler.sample(point)
      return {
        x: point.x * SOURCE.shapeScale,
        y: point.y * SOURCE.shapeScale,
        z: point.z * SOURCE.shapeScale,
        spawnX: 0, spawnY: 0, spawnZ: 0, offX: 0, offY: 0,
        dissolveDelay: 0,
        baseSize: 0.1 + (10 - 0.1) * random() * 0.32,
        phase: random() * Math.PI * 2,
        noisePhase: random() * Math.PI * 2,
        twinkle: 0.35 + 0.65 * random(),
        hasTwinkle: false,
        twinklePhase: random() * Math.PI * 2,
        twinkleSpeed: 0.85 + 2.2 * random(),
      }
    })
    // Exact percentage, shuffled independently of sample positions.
    const order = particles.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    for (let i = 0; i < Math.round(count * twinkleFraction); i++) particles[order[i]].hasTwinkle = true
    const maxDistance = Math.max(...particles.map(p => Math.hypot(p.x, p.y, p.z)))
    particles.forEach((p, i) => {
      p.dissolveDelay = (1 - Math.hypot(p.x, p.y, p.z) / maxDistance) * 0.65
      baseColor.toArray(colors, i * 3)
    })
    const geometry = new THREE.BufferGeometry()
    for (const [name, array, itemSize] of [
      ["position", positions, 3], ["color", colors, 3], ["size", sizes, 1],
      ["brightness", brightness, 1], ["opacity", opacity, 1],
    ] as const) geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize))
    const material = new THREE.ShaderMaterial({
      vertexShader: STAR_VERTEX, fragmentShader: STAR_FRAGMENT,
      uniforms: {
        uSizeRef: { value: SOURCE.sizeRef }, uLocalZExtent: { value: 1 },
        uZAlphaMin: { value: 0.6 }, uZAlphaMax: { value: 1 },
        uGlowBoost: { value: 1.45 }, uHaloStrength: { value: 0.78 },
      },
      transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const star = new THREE.Points(geometry, material)
    star.frustumCulled = false
    starGroup.add(star)

    // Source background: animated noise gradient, moving perspective dust,
    // and a ping-pong texture for the dissipating mouse trail.
    const backgroundScene = new THREE.Scene()
    const dustScene = new THREE.Scene()
    const trailScene = new THREE.Scene()
    const compositeScene = new THREE.Scene()
    const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const dustCamera = new THREE.PerspectiveCamera(55, 1, 1, 4000)
    dustCamera.lookAt(0, 0, -1)
    const plane = new THREE.PlaneGeometry(2, 2)
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: BACKGROUND_VERTEX, fragmentShader: BACKGROUND_FRAGMENT,
      uniforms: {
        u_time: { value: 0 }, u_color1: { value: new THREE.Color("#0d0718") },
        u_color2: { value: new THREE.Color("#3f2476") },
        u_weight1: { value: 0 }, u_weight2: { value: 100 },
        u_blobRandomness: { value: 0.35 }, u_blobDisplacement: { value: 0.55 },
        u_blobMorphSpeed: { value: 1.3 }, u_colorBlend: { value: 1 },
      }, depthTest: false, depthWrite: false,
    })
    backgroundScene.add(new THREE.Mesh(plane, backgroundMaterial))
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType })
    let trailRead = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false })
    let trailWrite = trailRead.clone()
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: SCREEN_VERTEX, fragmentShader: TRAIL_FRAGMENT,
      uniforms: {
        u_trailPrev: { value: trailRead.texture }, u_time: { value: 0 },
        u_pointer: { value: new THREE.Vector2(0.5, 0.5) }, u_pointerPrev: { value: new THREE.Vector2(0.5, 0.5) },
        u_pointerEngage: { value: 0 }, u_pointerRadius: { value: 0.1 },
        u_resolution: { value: new THREE.Vector2(1, 1) }, u_fade: { value: 0.968 },
        u_disengage: { value: 0 }, u_ageRate: { value: 0.018 },
      }, depthTest: false, depthWrite: false,
    })
    trailScene.add(new THREE.Mesh(plane, trailMaterial))
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: SCREEN_VERTEX,
      fragmentShader: COMPOSITE_FRAGMENT
        .replace("gl_FragColor = base;", "gl_FragColor = base;\n#include <colorspace_fragment>\n")
        .replace("gl_FragColor = mix(base, displaced, clamp(blob * 0.98, 0.0, 1.0));", "gl_FragColor = mix(base, displaced, clamp(blob * 0.98, 0.0, 1.0));\n#include <colorspace_fragment>\n"),
      uniforms: {
        u_scene: { value: sceneTarget.texture }, u_trail: { value: trailRead.texture },
        u_time: { value: 0 }, u_pointerEngage: { value: 0 }, u_resolution: { value: new THREE.Vector2(1, 1) },
      }, depthTest: false, depthWrite: false,
    })
    compositeScene.add(new THREE.Mesh(plane, compositeMaterial))
    const dustPositions = new Float32Array(dustCount * 3)
    const dustSizes = new Float32Array(dustCount)
    const dustBrightness = new Float32Array(dustCount)
    const dustColors = new Float32Array(dustCount * 3).fill(1)
    const dust = Array.from({ length: dustCount }, (_, i) => ({
      x: 0, y: 0, z: 0, originX: 0, originY: 0, offX: 0, offY: 0,
      speed: 40 * Math.pow(13, random()), sparkle: i < dustCount * 0.2,
    }))
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))
    dustGeometry.setAttribute("size", new THREE.BufferAttribute(dustSizes, 1))
    dustGeometry.setAttribute("brightness", new THREE.BufferAttribute(dustBrightness, 1))
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3))
    const dustMaterial = new THREE.ShaderMaterial({
      vertexShader: DUST_VERTEX, fragmentShader: DUST_FRAGMENT,
      uniforms: { uSizeRef: { value: 520 }, uSpawnFar: { value: 2400 } },
      transparent: true, depthTest: true, depthWrite: false, blending: THREE.NormalBlending,
    })
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial)
    dustPoints.frustumCulled = false
    dustScene.add(dustPoints)

    let width = 1, height = 1, scale = 1, elapsed = 0, lastTime = 0, frame = 0
    let visible = true, disposed = false, reducedMotion = motionQuery.matches
    let speed = 0, engagement = 0, trailEngagement = 0, disengage = 0, active = false
    const targetMouse = new THREE.Vector2()
    const smoothMouse = new THREE.Vector2()
    const previousMouse = new THREE.Vector2()
    const mouseUV = new THREE.Vector2(0.5, 0.5)
    const previousUV = mouseUV.clone()
    const localMouse = new THREE.Vector3()
    const forward = new THREE.Vector3(0, 0, 1)
    const direction = new THREE.Vector3()
    const targetRotation = new THREE.Quaternion()
    const identityRotation = new THREE.Quaternion()
    function spawnDust(p: typeof dust[number], far = false) {
      p.z = far ? -(2400 - random() * 600) : -(900 + random() * 1500)
      const halfH = Math.tan(55 * Math.PI / 360) * Math.abs(p.z)
      p.x = p.originX = (random() - 0.5) * halfH * (width / height) * 2 * 1.05
      p.y = p.originY = (random() - 0.5) * halfH * 2 * 1.05
      p.offX = p.offY = 0
    }
    function resize() {
      const rect = section!.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      scale = Math.min(width, height) * SOURCE.sizeFill
      // R3F in the reference updates DPR when its viewport changes, too.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1 : medium ? 1.5 : 2))
      renderer.setSize(width, height, false)
      camera.left = -width / 2; camera.right = width / 2
      camera.top = height / 2; camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      dustCamera.aspect = width / height
      dustCamera.updateProjectionMatrix()
      material.uniforms.uLocalZExtent.value = SOURCE.zRange * scale
      const fboScale = low ? 0.7 : medium ? 0.85 : 1
      for (const target of [sceneTarget, trailRead, trailWrite]) {
        target.setSize(Math.round(width * fboScale), Math.round(height * fboScale))
        renderer.setRenderTarget(target)
        renderer.setClearColor(0, 0)
        renderer.clear()
      }
      renderer.setRenderTarget(null)
      trailMaterial.uniforms.u_resolution.value.set(width, height)
      trailMaterial.uniforms.u_pointerRadius.value = 90 / Math.min(width, height)
      compositeMaterial.uniforms.u_resolution.value.set(width, height)
      particles.forEach(p => {
        p.spawnX = (random() - 0.5) * width * 1.84
        p.spawnY = (random() - 0.5) * height * 1.84
        p.spawnZ = (random() - 0.5) * SOURCE.zRange * scale * 5.6
      })
      dust.forEach((p, i) => {
        spawnDust(p)
        dustSizes[i] = (0.55 + random() * 1.1) * (p.sparkle ? 1.42 : 1)
        dustBrightness[i] = p.sparkle ? 2.05 : 0.68
      })
      dustGeometry.attributes.size.needsUpdate = true
      dustGeometry.attributes.brightness.needsUpdate = true
      if (reducedMotion) render(0)
    }

    function render(dt: number) {
      elapsed += dt
      previousMouse.copy(smoothMouse)
      if (active) smoothMouse.lerp(targetMouse, 1 - Math.exp(-16 * dt))
      speed += (smoothMouse.distanceTo(previousMouse) / Math.max(dt, 0.001) - speed) * (1 - Math.exp(-14 * dt))
      engagement += ((active ? 1 : 0) - engagement) * (1 - Math.exp(-10 * dt))
      if (engagement > 0.001 && !reducedMotion) {
        direction.set(-smoothMouse.x / (width * 0.5) * engagement * SOURCE.tilt, -smoothMouse.y / (height * 0.5) * engagement * SOURCE.tilt, 1).normalize()
        targetRotation.setFromUnitVectors(forward, direction)
      } else targetRotation.copy(identityRotation)
      starGroup.quaternion.slerp(targetRotation, 1 - Math.exp(-SOURCE.rotationSpeed * dt))
      starGroup.updateMatrixWorld()
      localMouse.set(smoothMouse.x, smoothMouse.y, 0)
      starGroup.worldToLocal(localMouse)
      const pointerForce = reducedMotion ? 0 : engagement * Math.min(1, speed / 90)
      const dissolve = reducedMotion ? 0 : 1 - THREE.MathUtils.clamp((elapsed - 1.72) / 2, 0, 1)
      particles.forEach((p, i) => {
        const progress = THREE.MathUtils.clamp((dissolve - p.dissolveDelay) / (1 - p.dissolveDelay), 0, 1)
        const amount = 1 - Math.pow(1 - progress, 3)
        const angle = amount * Math.PI * 2
        const x = p.x * scale + (p.spawnX - p.x * scale) * amount
        const y = p.y * scale + (p.spawnY - p.y * scale) * amount
        const z = p.z * scale + (p.spawnZ - p.z * scale) * amount
        const rotatedX = x * Math.cos(angle) + z * Math.sin(angle)
        const rotatedZ = -x * Math.sin(angle) + z * Math.cos(angle)
        const decay = Math.exp(-SOURCE.cursorReturn * dt)
        p.offX *= decay; p.offY *= decay
        const dx = localMouse.x - rotatedX - p.offX
        const dy = localMouse.y - y - p.offY
        const distance = Math.hypot(dx, dy)
        if (pointerForce > 0.02 && distance > 0.0001 && distance < SOURCE.cursorRadius) {
          const force = Math.pow(1 - distance / SOURCE.cursorRadius, 2) * SOURCE.cursorForce * pointerForce * dt * 60
          p.offX -= dx / distance * force; p.offY -= dy / distance * force
        }
        positions[i * 3] = rotatedX + p.offX
        positions[i * 3 + 1] = y + p.offY
        positions[i * 3 + 2] = rotatedZ
        opacity[i] = 1 - amount
        sizes[i] = p.baseSize * (1 - amount)
        const phase = elapsed * p.twinkleSpeed + p.twinklePhase
        const twinkle = p.hasTwinkle
          ? Math.pow(Math.max(0, (0.5 * Math.sin(phase) + 0.32 * Math.sin(2.17 * phase + p.phase) + 0.18 * Math.sin(4.83 * phase + p.noisePhase) + 1) * 0.5), 2.6) * twinkleIntensity
          : 0.1 * Math.sin(elapsed * (1.1 + p.twinkle) + p.phase)
        brightness[i] = 1.05 + twinkle
      })
      for (const name of ["position", "size", "brightness", "opacity"]) geometry.attributes[name].needsUpdate = true

      previousUV.copy(mouseUV)
      mouseUV.set(smoothMouse.x / width + 0.5, smoothMouse.y / height + 0.5)
      const trailTarget = active && !reducedMotion ? Math.min(speed / 300, 1) : 0
      trailEngagement += (trailTarget - trailEngagement) * (1 - Math.exp(-(trailTarget > trailEngagement ? 11 : 2.2) * dt))
      disengage = trailEngagement > 0.008 ? 0 : Math.min(disengage + dt * 1.35, 1.5)
      dust.forEach((p, i) => {
        p.z += p.speed * dt
        if (p.z > 80) spawnDust(p, true)
        const far = Math.abs(p.z) / 2400 >= 0.21
        const halfH = Math.tan(55 * Math.PI / 360) * Math.abs(p.z)
        const dx = (mouseUV.x - 0.5) * 2 * halfH * width / height - p.x
        const dy = (mouseUV.y - 0.5) * 2 * halfH - p.y
        const depth = Math.abs(p.z) / 450
        const radius = 220 * depth
        const distance = Math.hypot(dx, dy)
        if (trailEngagement > 0.01 && distance > 0.0001 && distance < radius) {
          const force = Math.pow(1 - distance / radius, 2) * 42 * trailEngagement * depth * dt * 4
          if (far) { p.offX -= dx / distance * force; p.offY -= dy / distance * force }
          else { p.x -= dx / distance * force; p.y -= dy / distance * force }
        } else if (far) { p.offX *= Math.exp(-3.2 * dt); p.offY *= Math.exp(-3.2 * dt) }
        if (far) { p.x = p.originX + p.offX; p.y = p.originY + p.offY }
        dustPositions[i * 3] = p.x; dustPositions[i * 3 + 1] = p.y; dustPositions[i * 3 + 2] = p.z
      })
      dustGeometry.attributes.position.needsUpdate = true
      backgroundMaterial.uniforms.u_time.value = elapsed
      renderer.setRenderTarget(sceneTarget)
      renderer.setClearColor(0, 0)
      renderer.clear()
      renderer.render(backgroundScene, screenCamera)
      renderer.clearDepth()
      renderer.render(dustScene, dustCamera)
      const tu = trailMaterial.uniforms
      tu.u_trailPrev.value = trailRead.texture
      tu.u_time.value = elapsed
      tu.u_pointer.value.copy(mouseUV); tu.u_pointerPrev.value.copy(previousUV)
      tu.u_pointerEngage.value = trailEngagement
      tu.u_fade.value = Math.pow(0.968, dt * 60)
      tu.u_disengage.value = disengage
      tu.u_ageRate.value = 0.018 * dt * 60
      renderer.setRenderTarget(trailWrite)
      renderer.clear()
      renderer.render(trailScene, screenCamera)
      ;[trailRead, trailWrite] = [trailWrite, trailRead]
      compositeMaterial.uniforms.u_trail.value = trailRead.texture
      compositeMaterial.uniforms.u_time.value = elapsed
      compositeMaterial.uniforms.u_pointerEngage.value = trailEngagement
      renderer.setRenderTarget(null)
      renderer.clear()
      renderer.render(compositeScene, screenCamera)
      renderer.clearDepth()
      renderer.render(starScene, camera)
    }
    function animate(now: number) {
      if (disposed || document.hidden || !visible || reducedMotion) return
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60
      lastTime = now
      render(dt)
      frame = requestAnimationFrame(animate)
    }
    function resume() {
      cancelAnimationFrame(frame)
      lastTime = 0
      if (!disposed && !document.hidden && visible && !reducedMotion) frame = requestAnimationFrame(animate)
    }
    function move(event: PointerEvent) {
      const rect = section!.getBoundingClientRect()
      const x = event.clientX - rect.left, y = event.clientY - rect.top
      active = true
      targetMouse.set(x - width / 2, height / 2 - y)
      if (cursor && !coarse) { cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`; cursor.style.opacity = "1" }
    }
    function leave() { active = false; if (cursor) cursor.style.opacity = "0" }
    function motionChanged() {
      reducedMotion = motionQuery.matches
      if (reducedMotion) {
        active = false
        starGroup.quaternion.identity()
        particles.forEach(p => { p.offX = 0; p.offY = 0 })
        render(0)
      }
      resume()
    }
    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume() })
    resize()
    resizeObserver.observe(section)
    intersectionObserver.observe(section)
    section.addEventListener("pointermove", move, { passive: true })
    section.addEventListener("pointerleave", leave)
    document.addEventListener("visibilitychange", resume)
    motionQuery.addEventListener("change", motionChanged)
    resume()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect(); intersectionObserver.disconnect()
      section.removeEventListener("pointermove", move); section.removeEventListener("pointerleave", leave)
      document.removeEventListener("visibilitychange", resume)
      motionQuery.removeEventListener("change", motionChanged)
      for (const resource of [sourceGeometry, geometry, material, plane, backgroundMaterial, trailMaterial,
        compositeMaterial, dustGeometry, dustMaterial, sceneTarget, trailRead, trailWrite]) resource.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-lodestar__canvas" aria-hidden="true" />
}
