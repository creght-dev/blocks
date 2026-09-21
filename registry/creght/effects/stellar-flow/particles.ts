import { createOrbit } from './orbits'
export type Shape = 'six' | 'galaxy' | 'text' | 'image'
export interface ParticleConfig {
  mode: Shape
  text: string
  image: string
  speed: number
  size: number
  count: number
  scale: number
  scatter: number
  glow: number
  brilliance: number
  starDensity: number
  twinkle: number
  flowSpeed: number
  starRays: number
  rayLength: number
  coreGlow: number
  depth: number
  interaction: number
  rotation: number
  color: string
  accentColor: string
  background: string
  imageColors: boolean
  invert: boolean
  threshold: number
  paused: boolean
}

export const defaultConfig: ParticleConfig = {
  mode: 'six',
  text: 'HELLO',
  image: '',
  speed: 1,
  size: 1.3,
  count: 12000,
  scale: 1,
  scatter: 0.16,
  glow: 0.8,
  depth: 0.5,
  interaction: 0.65,
  brilliance: 1.3,
  starDensity: 7,
  twinkle: 0.7,
  flowSpeed: 1,
  starRays: 1,
  rayLength: 1,
  coreGlow: 1,
  rotation: 0,
  color: '#a9dbff',
  accentColor: '#ffa66b',
  background: '#03090e',
  imageColors: true,
  invert: false,
  threshold: 90,
  paused: false,
}

export function sanitizeConfig(input: unknown): ParticleConfig {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Configuration must be a JSON object.')
  const data = input as Record<string, unknown>
  const c = { ...defaultConfig }
  const ranges: Record<string, [number, number]> = {
    speed: [0, 3],
    size: [0.3, 4],
    count: [1000, 30000],
    scale: [0.4, 1.6],
    scatter: [0, 1],
    glow: [0, 2],
    depth: [0, 1.5],
    interaction: [0, 2],
    rotation: [-180, 180],
    threshold: [0, 255],
    brilliance: [0.3, 2.5],
    starDensity: [0, 16],
    twinkle: [0, 1.5],
    flowSpeed: [0, 3],
    starRays: [0, 3],
    rayLength: [0.3, 2],
    coreGlow: [0, 3],
  }
  for (const [key, [min, max]] of Object.entries(ranges)) {
    if (typeof data[key] === 'number' && Number.isFinite(data[key]))
      Object.assign(c, { [key]: Math.min(max, Math.max(min, data[key])) })
  }
  c.count = Math.round(c.count)
  if (['six', 'galaxy', 'text', 'image'].includes(String(data.mode))) c.mode = data.mode as Shape
  for (const key of ['color', 'accentColor', 'background'] as const)
    if (typeof data[key] === 'string' && /^#[a-f\d]{6}$/i.test(data[key])) c[key] = data[key]
  for (const key of ['paused', 'invert', 'imageColors'] as const)
    if (typeof data[key] === 'boolean') c[key] = data[key]
  if (typeof data.text === 'string') c.text = data.text.slice(0, 80)
  if (typeof data.image === 'string' && /^(https?:\/\/|data:image\/|\/[^/])/.test(data.image))
    c.image = data.image
  return c
}

function random(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Sample = [number, number, number, number, number]
export async function makeTargets(c: ParticleConfig, aspect: number, signal: AbortSignal) {
  const rng = random(73124)
  if (c.mode === 'six' || c.mode === 'galaxy') return createOrbit(c.count, aspect, rng, c.mode === 'galaxy')
  const points = new Float32Array(c.count * 3)
  const colors = new Float32Array(c.count * 3)
  const samples: Sample[] = []
  if (c.mode === 'text' || c.mode === 'image') {
    const mask = document.createElement('canvas')
    mask.width = 900
    mask.height = 600
    const ctx = mask.getContext('2d', { willReadFrequently: true })!
    if (c.mode === 'text') {
      const lines = (c.text.trim() || 'HELLO').split('\n').slice(0, 4)
      const font = '700 180px Arial, "PingFang SC", sans-serif'
      ctx.font = font
      const max = Math.max(...lines.map((l) => ctx.measureText(l).width))
      const size = Math.min(210, (790 / Math.max(max, 1)) * 180, 460 / lines.length)
      ctx.font = `700 ${size}px Arial, "PingFang SC", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      lines.forEach((line, i) => ctx.fillText(line, 450, 300 + (i - (lines.length - 1) / 2) * size * 1.12))
    } else {
      if (!c.image) throw new Error('Choose an image or enter an image URL.')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        const cancel = () => {
          cleanup()
          img.src = ''
          reject(new DOMException('Aborted', 'AbortError'))
        }
        const timeout = window.setTimeout(() => {
          cleanup()
          img.src = ''
          reject(new Error('Image loading timed out. Try uploading a local image.'))
        }, 15000)
        const cleanup = () => {
          window.clearTimeout(timeout)
          signal.removeEventListener('abort', cancel)
        }
        img.onload = () => {
          cleanup()
          resolve()
        }
        img.onerror = () => {
          cleanup()
          reject(
            new Error(
              'Could not read this image. Its URL must allow cross-origin access; try uploading a local image.',
            ),
          )
        }
        signal.addEventListener('abort', cancel, { once: true })
        if (signal.aborted) {
          cancel()
          return
        }
        img.src = c.image
      })
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
      const ratio = Math.min(820 / img.width, 520 / img.height)
      ctx.drawImage(
        img,
        (900 - img.width * ratio) / 2,
        (600 - img.height * ratio) / 2,
        img.width * ratio,
        img.height * ratio,
      )
    }
    let pixels: Uint8ClampedArray
    try {
      pixels = ctx.getImageData(0, 0, 900, 600).data
    } catch {
      throw new Error('This image blocks cross-origin sampling. Download it and upload the local file.')
    }
    const fit = Math.min(1, aspect / 1.55)
    for (let y = 0; y < 600; y += 2)
      for (let x = 0; x < 900; x += 2) {
        const i = (y * 900 + x) * 4
        const l = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722
        if (pixels[i + 3] > 50 && (c.mode === 'text' || (c.invert ? 255 - l : l) > c.threshold))
          samples.push([
            (x / 900 - 0.5) * 1.38 * fit,
            (y / 600 - 0.5) * 0.92 * fit,
            pixels[i] / 255,
            pixels[i + 1] / 255,
            pixels[i + 2] / 255,
          ])
      }
    if (!samples.length)
      throw new Error('No particles found. Lower the brightness threshold or toggle Invert brightness.')
  }
  for (let i = 0; i < c.count; i++) {
    let x = 0,
      y = 0,
      z = 0
    const field = i % 10 === 0
    if (field) {
      x = (rng() - 0.5) * aspect * 1.8
      y = (rng() - 0.5) * 1.8
      z = (rng() - 0.5) * 0.9
    } else if (samples.length) {
      const p = samples[Math.floor(rng() * samples.length)]
      x = p[0] + (rng() - 0.5) * 0.002
      y = p[1] + (rng() - 0.5) * 0.002
      z = (rng() - 0.5) * 0.05
      if (c.mode === 'image' && c.imageColors) colors.set(p.slice(2), i * 3)
    }
    points.set([x, y, z], i * 3)
  }
  return { points, colors, activity: new Float32Array(c.count * 3).fill(1), orbit: null }
}

export const vertexShader = `
precision highp float;
attribute vec3 aFrom;
attribute vec3 aTarget;
attribute vec3 aColor;
attribute vec3 aSeed;
attribute vec3 aActivity;
attribute vec3 aRayMask;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime, uMorph, uSize, uScale, uScatter, uDepth, uInteraction, uRotation, uDpr, uIntro, uMaxPoint;
uniform float uBrilliance, uStarDensity, uTwinkle, uFootprint;
uniform float uDensityScale;
uniform mediump float uStarRays, uRayLength;
uniform float uCoreGlow, uOrbit;
varying vec3 vColor;
varying float vBrightness;
varying float vStar;
varying float vExtent;
void main(){
  float m=smoothstep(0.,1.,uMorph);
  vec3 p=mix(aFrom,aTarget,m);
  float phase=aSeed.x*62.83;
  float time=uTime*(.32+aSeed.y*.35);
  vec3 motion=vec3(sin(time+phase),cos(time*.81+phase*1.3),sin(time*.6+phase*2.));
  p+=motion*(.001+uScatter*mix(.035,.006,uOrbit));
  p+=motion*sin(m*3.14159)*.13;
  p=mix(vec3(sin(phase)*aSeed.y*1.3,cos(phase)*aSeed.z, sin(phase*2.)*.7),p,smoothstep(0.,1.,uIntro));
  float c=cos(uRotation),s=sin(uRotation);
  p.xy=mat2(c,s,-s,c)*p.xy*uScale;
  vec2 delta=p.xy-uPointer;
  float dist=length(delta);
  p.xy+=delta/max(dist,.001)*exp(-dist*dist/0.011)*uInteraction*.05;
  p.xy+=uPointer*p.z*uDepth*.3*(1.-step(5.,uPointer.x));
  p.z*=uDepth;
  float perspective=1./(1.+p.z*.7);
  vec2 clip=p.xy*perspective*2.;
  clip.x/=uResolution.x/uResolution.y;
  gl_Position=vec4(clip.x,-clip.y,0.,1.);
  float bright=step(1.-uStarDensity*.01*uDensityScale,aSeed.z);
  float beacon=step(1.-uStarDensity*.0025*uDensityScale,aSeed.z)*bright;
  float wave=.5+.5*sin(uTime*(.6+aSeed.y*.8)+phase);
  float flare=pow(wave,7.)*uTwinkle;
  float shimmer=1.-uTwinkle*.3+uTwinkle*.3*sin(uTime*(.85+aSeed.y)+phase*1.7);
  float diameter=mix(2.8+aSeed.y*2.5,21.+aSeed.y*13.,bright);
  diameter=mix(diameter,42.+aSeed.y*24.,beacon);
  diameter*=mix(1.,aActivity.y,uOrbit*.6);
  float crossStar=beacon*aRayMask.x;
  vExtent=1.+crossStar*uRayLength*.8*step(.01,uStarRays);
  float screenScale=clamp(min(uResolution.x,uResolution.y)/850.,.38,1.);
  gl_PointSize=min(uMaxPoint,diameter*(1.+flare*.14*bright)*uSize*uDpr*perspective*screenScale*uFootprint*vExtent);
  if(aSeed.z>1.5){gl_PointSize=min(uMaxPoint,280.*uDpr*uSize*screenScale);vExtent=1.;}
  vStar=bright+beacon+step(1.5,aSeed.z);
  vBrightness=mix(.35+aSeed.y*.65,.65+aSeed.y*.45,bright)*shimmer;
  vBrightness*=mix(1.,uBrilliance,bright)*(1.+flare*.7*bright);
  vBrightness*=mix(1.,aActivity.x,uOrbit);
  vBrightness*=1.+uCoreGlow*aActivity.z*.18*uOrbit;
  if(aSeed.z>1.5)vBrightness=uCoreGlow*(.6+.4*smoothstep(.25,1.,uIntro))*(.94+.06*sin(uTime*.65));
  vColor=aColor;
  if(length(aColor)<.01) vColor=vec3(-1.,aSeed.x,bright);
}`

export const fragmentShader = `
precision mediump float;
uniform vec3 uColor, uAccent;
uniform float uGlow;
uniform float uStarRays, uRayLength;
varying vec3 vColor;
varying float vBrightness;
varying float vStar;
varying float vExtent;
void main(){
  vec2 q=(gl_PointCoord-.5)*2.*vExtent;
  float r=length(q);
  if(r>vExtent)discard;
  float bright=step(.5,vStar),beacon=step(1.5,vStar);
  float core=mix(exp(-r*r*18.),1.-smoothstep(.025,.12,r),bright);
  float corona=exp(-r*r*95.)*.4*bright;
  float halo=(exp(-r*r*9.)*.21+exp(-r*r*3.)*.06)*uGlow*bright;
  vec2 ray=q/(max(uRayLength,.3)*.7);
  float horizontal=exp(-abs(q.y)*95.)*(1.-smoothstep(.08,1.35,abs(ray.x)));
  float vertical=exp(-abs(q.x)*95.)*(1.-smoothstep(.08,1.35,abs(ray.y)));
  float rays=max(horizontal,vertical)*.4*uStarRays*beacon*step(1.001,vExtent);
  vec3 tint=vColor.x<0.?mix(uColor,uAccent,step(.77,vColor.y)):vColor;
  vec3 coreColor=vColor.x<0.?mix(tint,vec3(1.),bright*.83):tint;
  vec3 energy=coreColor*core+tint*(corona+halo+rays);
  if(vStar>2.5)energy=mix(tint,vec3(1.),.75)*exp(-r*r*5.)*.5*uGlow;
  // Premultiply radiance: additive blending preserves HDR-like overlapping
  // halos without clipping every individual star to a flat white square.
  gl_FragColor=vec4(energy*vBrightness,1.);
}`

export function rgb(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
}
