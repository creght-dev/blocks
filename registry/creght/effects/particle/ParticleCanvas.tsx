import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type CSSProperties,
  type MutableRefObject,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from './shaders';
import type { SceneData, TargetParticleSource } from './ParticleCanvas.types';

type MediaParticleProcessorDeps = {
  sceneDataRef: MutableRefObject<SceneData | null>;
  stateRef: MutableRefObject<{
    uploadedImage: string | null;
    uploadedModel: string | null;
    currentShape: string | null;
    morphFactor: number;
  }>;
  targetSourceRef: MutableRefObject<TargetParticleSource | null>;
  applyCurrentTarget: () => void;
  syncMorphUniformToState: () => void;
};

/** 仅在实际 target 数据与当前模式一致时 morph=1，避免异步加载期间仍用上一帧 target 却混到 100% 造成闪屏。 */
function resolveMorphUniform(
  state: {
    uploadedImage: string | null;
    uploadedModel: string | null;
    currentShape: string | null;
  },
  source: TargetParticleSource | null
): number {
  if (state.uploadedModel) {
    return source?.type === 'model' ? 1.0 : 0.0;
  }
  if (state.uploadedImage && state.uploadedImage !== 'shape') {
    return source?.type === 'image' ? 1.0 : 0.0;
  }
  if (state.uploadedImage === 'shape' || (state.currentShape != null && state.currentShape !== 'default')) {
    return source?.type === 'shape' ? 1.0 : 0.0;
  }
  return 0.0;
}

/** 换图/换模型开始加载前：target 与初始粒子云一致，避免短暂残留上一张图的几何。 */
function primeTargetsForAsyncMediaLoad(
  sceneData: SceneData,
  targetSourceRef: MutableRefObject<TargetParticleSource | null>,
  applyCurrentTarget: () => void
): void {
  const { targetPositions, originalPositions, targetColors, originalColors, geometry } = sceneData;
  targetPositions.set(originalPositions);
  targetColors.set(originalColors);
  geometry.attributes.targetPosition.needsUpdate = true;
  geometry.attributes.targetColor.needsUpdate = true;
  targetSourceRef.current = {
    positions: originalPositions,
    colors: originalColors,
    type: 'shape',
  };
  applyCurrentTarget();
}

/** 异步贴图/模型就绪前先隐藏 WebGL 画布，避免「云 → 图」一闪；显示时可带短淡入。 */
function concealWebglCanvas(sceneDataRef: MutableRefObject<SceneData | null>): void {
  const el = sceneDataRef.current?.renderer.domElement;
  if (!el) return;
  el.style.transition = 'none';
  el.style.opacity = '0';
}

function revealWebglCanvas(sceneDataRef: MutableRefObject<SceneData | null>): void {
  const el = sceneDataRef.current?.renderer.domElement;
  if (!el) return;
  el.style.transition = 'opacity 0.4s ease-out';
  requestAnimationFrame(() => {
    const cur = sceneDataRef.current?.renderer.domElement;
    if (!cur) return;
    cur.style.opacity = '1';
  });
}

function ensureWebglCanvasVisible(sceneDataRef: MutableRefObject<SceneData | null>): void {
  const el = sceneDataRef.current?.renderer.domElement;
  if (!el) return;
  el.style.transition = '';
  el.style.opacity = '1';
}

const textureDataCache = new Map<string, ImageData>();

function getTextureData(texture: THREE.Texture): ImageData | null {
  const image = texture.image;
  if (!image || !image.width || !image.height) return null;

  const cacheKey = (image as unknown as { src?: string }).src || (image as unknown as { id?: string }).id || texture.uuid;
  if (textureDataCache.has(cacheKey)) return textureDataCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(image as CanvasImageSource, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height);
  textureDataCache.set(cacheKey, data);
  return data;
}

function processImageParticles(imageUrl: string | null, deps: MediaParticleProcessorDeps): void {
  const { sceneDataRef, stateRef, targetSourceRef, applyCurrentTarget, syncMorphUniformToState } = deps;
  const sceneData = sceneDataRef.current;
  stateRef.current.uploadedModel = null;

  if (!imageUrl || !sceneData) {
    if (!imageUrl && sceneData) {
      const { targetPositions, originalPositions, targetColors, originalColors, geometry } = sceneData;
      targetPositions.set(originalPositions);
      targetColors.set(originalColors);
      geometry.attributes.targetPosition.needsUpdate = true;
      geometry.attributes.targetColor.needsUpdate = true;
      syncMorphUniformToState();
      ensureWebglCanvasVisible(sceneDataRef);
    }
    return;
  }

  concealWebglCanvas(sceneDataRef);
  primeTargetsForAsyncMediaLoad(sceneData, targetSourceRef, applyCurrentTarget);
  syncMorphUniformToState();

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageUrl;
  img.onerror = () => {
    if (stateRef.current.uploadedImage !== imageUrl) return;
    console.error('Failed to load source image:', imageUrl);
    ensureWebglCanvasVisible(sceneDataRef);
    alert(
      'Could not load this image. For remote URLs, the server must send CORS headers allowing this site to read pixels (or use a local file instead).'
    );
  };
  img.onload = () => {
    // 丢弃过期请求：快速换 URL、clearImage、setModel 后仍可能触发旧 onload
    if (stateRef.current.uploadedImage !== imageUrl) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !sceneDataRef.current) {
      ensureWebglCanvasVisible(sceneDataRef);
      return;
    }

    const resolution = 200;
    const aspect = img.width / img.height;
    const drawWidth = aspect > 1 ? resolution : resolution * aspect;
    const drawHeight = aspect > 1 ? resolution / aspect : resolution;
    canvas.width = resolution;
    canvas.height = resolution;
    const offsetX = (resolution - drawWidth) / 2;
    const offsetY = (resolution - drawHeight) / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, resolution, resolution);
    try {
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
      console.error('drawImage failed (often CORS / tainted canvas):', imageUrl, e);
      ensureWebglCanvasVisible(sceneDataRef);
      return;
    }

    let imgData: Uint8ClampedArray;
    try {
      imgData = ctx.getImageData(0, 0, resolution, resolution).data;
    } catch (e) {
      console.error(
        'getImageData failed — remote image must allow cross-origin read (Access-Control-Allow-Origin):',
        imageUrl,
        e
      );
      ensureWebglCanvasVisible(sceneDataRef);
      return;
    }
    const validPoints: { pos: [number, number, number]; col: [number, number, number] }[] = [];

    const pushPixels = (brightnessThreshold: number) => {
      validPoints.length = 0;
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const idx = (y * resolution + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > brightnessThreshold) {
            validPoints.push({
              pos: [
                (x / resolution - 0.5) * 38,
                (0.5 - y / resolution) * 38,
                (brightness / 255 - 0.5) * 12,
              ],
              col: [r / 255, g / 255, b / 255],
            });
          }
        }
      }
    };

    pushPixels(10);
    if (validPoints.length === 0) pushPixels(3);

    if (stateRef.current.uploadedImage !== imageUrl) return;

    if (validPoints.length > 0 && sceneDataRef.current) {
      const rawPositions = new Float32Array(validPoints.length * 3);
      const rawColors = new Float32Array(validPoints.length * 3);

      for (let i = 0; i < validPoints.length; i++) {
        const p = validPoints[i];
        const i3 = i * 3;
        rawPositions[i3] = p.pos[0];
        rawPositions[i3 + 1] = p.pos[1];
        rawPositions[i3 + 2] = p.pos[2];
        rawColors[i3] = p.col[0];
        rawColors[i3 + 1] = p.col[1];
        rawColors[i3 + 2] = p.col[2];
      }
      targetSourceRef.current = { positions: rawPositions, colors: rawColors, type: 'image' };
      applyCurrentTarget();
      syncMorphUniformToState();
      revealWebglCanvas(sceneDataRef);
    } else {
      ensureWebglCanvasVisible(sceneDataRef);
    }
  };
}

function processModelParticles(modelUrl: string | null, deps: MediaParticleProcessorDeps): void {
  const { sceneDataRef, stateRef, targetSourceRef, applyCurrentTarget, syncMorphUniformToState } = deps;
  const sceneData = sceneDataRef.current;
  stateRef.current.uploadedImage = null;

  if (!modelUrl || !sceneData) {
    if (!modelUrl && sceneData) {
      const { targetPositions, originalPositions, targetColors, originalColors, geometry } = sceneData;
      targetPositions.set(originalPositions);
      targetColors.set(originalColors);
      geometry.attributes.targetPosition.needsUpdate = true;
      geometry.attributes.targetColor.needsUpdate = true;
      syncMorphUniformToState();
      ensureWebglCanvasVisible(sceneDataRef);
    }
    return;
  }

  concealWebglCanvas(sceneDataRef);
  primeTargetsForAsyncMediaLoad(sceneData, targetSourceRef, applyCurrentTarget);
  syncMorphUniformToState();

  void import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (stateRef.current.uploadedModel !== modelUrl) return;

        const positions: number[] = [];
        const colors: number[] = [];
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const geometry = mesh.geometry;
          const posAttr = geometry.attributes.position;
          const uvAttr = geometry.attributes.uv;
          const colorAttr = geometry.attributes.color;

          const material = (
            Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
          ) as THREE.MeshStandardMaterial;
          const texture = material?.map;
          const imageData = texture ? getTextureData(texture) : null;
          const meshColor = material?.color || new THREE.Color(0xffffff);

          for (let i = 0; i < posAttr.count; i++) {
            const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
            v.applyMatrix4(mesh.matrixWorld);
            positions.push(v.x, v.y, v.z);

            const col = new THREE.Color(1, 1, 1);
            if (imageData && uvAttr) {
              const u = ((uvAttr.getX(i) % 1) + 1) % 1;
              const vUv = ((uvAttr.getY(i) % 1) + 1) % 1;
              const xPx = Math.floor(u * (imageData.width - 1));
              const yPx = Math.floor((1 - vUv) * (imageData.height - 1));
              const idx = (yPx * imageData.width + xPx) * 4;
              col.setRGB(
                imageData.data[idx] / 255,
                imageData.data[idx + 1] / 255,
                imageData.data[idx + 2] / 255
              );
              col.multiply(meshColor);
            } else if (colorAttr) {
              col.fromBufferAttribute(colorAttr, i);
            } else {
              col.copy(meshColor);
            }
            colors.push(col.r, col.g, col.b);
          }
        }
      });

      if (positions.length > 0 && sceneDataRef.current) {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 30 / maxDim;

        const rawPositions = new Float32Array(positions.length);
        const rawColors = new Float32Array(colors.length);

        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          rawPositions[i3] = (positions[i3] - center.x) * scale;
          rawPositions[i3 + 1] = (positions[i3 + 1] - center.y) * scale;
          rawPositions[i3 + 2] = (positions[i3 + 2] - center.z) * scale;
          rawColors[i3] = colors[i3];
          rawColors[i3 + 1] = colors[i3 + 1];
          rawColors[i3 + 2] = colors[i3 + 2];
        }
        targetSourceRef.current = { positions: rawPositions, colors: rawColors, type: 'model' };
        applyCurrentTarget();
        syncMorphUniformToState();
        revealWebglCanvas(sceneDataRef);
      } else {
        ensureWebglCanvasVisible(sceneDataRef);
      }
      },
      undefined,
      () => {
        ensureWebglCanvasVisible(sceneDataRef);
      }
    );
  }).catch(() => {
    ensureWebglCanvasVisible(sceneDataRef);
  });
}

const EFFECT_MODES: Record<string, number> = {
  default: 0,
  scatter: 1,
  explode: 2,
  vortex: 3,
  pulse: 4,
  wave: 5,
};

export type ParticleCanvasRef = {
  setImage: (imageUrl: string | null) => void;
  setModel: (modelUrl: string | null) => void;
  clearImage: () => void;
  setParticleSize: (size: number) => void;
  setParticleCount: (count: number) => void;
  setShape: (shape: string) => void;
  setEffect: (effect: string) => void;
  triggerExplosion: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  getUploadedModelUrl: () => string | null;
  setInteractionMode: (mode: 'auto' | 'manual') => void;
  setManualControlTarget: (target: 'camera' | 'object') => void;
};

export type ParticleColorMode = 'original' | 'custom';

export type NeuralParticleMorphEffect =
  | 'default'
  | 'scatter'
  | 'explode'
  | 'vortex'
  | 'pulse'
  | 'wave';

export type NeuralParticleMorphShape =
  | 'default'
  | 'heart'
  | 'butterfly'
  | 'rose'
  | 'cube'
  | 'pyramid'
  | 'spiral'
  | 'star'
  | 'sphere'
  | 'dna'
  | 'infinity';

type Props = {
  particleCount?: number;
  particleSize?: number;
  /** WebGL 清屏与容器底色（#RRGGBB） */
  canvasBackgroundColor?: string;
  particleColorMode?: ParticleColorMode;
  /** 自定义模式下的粒子颜色（#RRGGBB） */
  particleCustomColor?: string;
  /**
   * 声明式同步到内部状态；不传则仅由 ref / 初始 mount 控制（主界面 ConfigPanel 用法）。
   */
  effect?: NeuralParticleMorphEffect | (string & {});
  /**
   * 未提供 imageUrl / modelUrl 时展示该预设；声明式同步，不传则不由 props 驱动形态切换。
   */
  shape?: NeuralParticleMorphShape | (string & {});
  interactionMode?: 'auto' | 'manual';
  manualControlTarget?: 'camera' | 'object';
  imageUrl?: string | null;
  modelUrl?: string | null;
  /**
   * 是否监听全局 Space 切换交互模式。多实例嵌入时设为 false，避免快捷键冲突。
   * @default true
   */
  listenForKeyboardToggle?: boolean;
  /**
   * 为 true 时用 IntersectionObserver 在元素不可见时暂停 rAF 与渲染，降低 CPU/GPU 占用。
   * @default false
   */
  pauseAnimationWhenHidden?: boolean;
  /** 传入 `pauseAnimationWhenHidden` 时的 rootMargin，例如 `100px` 可提前恢复动画 */
  intersectionRootMargin?: string;
  /**
   * 传入时在外层包一层 `position:relative` 容器，便于嵌入式固定高度。
   * 未传 `className` 时默认 `relative w-full`。
   */
  className?: string;
  style?: CSSProperties;
};

/** sRGB 权重下的相对亮度（0～1）。与导出 HTML 中阈值保持一致。 */
function perceptualLuminanceFromHex(hex: string): number {
  const c = new THREE.Color(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/**
 * AdditiveBlending：输出颜色会直接“加”到目标像素上。若为黑色 RGB≈0，则不会产生任何亮度增量，
 * 无论背景是黑是白都会几乎不可见（常见需求是发光感，不适合深色实体粒子）。
 */
const CUSTOM_DARK_LUM_BLEND_THRESHOLD = 0.45;

/** 画布亮度 ≥ 该阈值时使用 NormalBlending，避免浅色底 + 采样偏暗的「原始颜色」在加法混合下消失。 */
const LIGHT_BG_BLEND_THRESHOLD = 0.58;

function resolvePointsBlending(
  canvasBgHex: string,
  mode: ParticleColorMode,
  particleCustomHex: string
): THREE.Blending {
  if (perceptualLuminanceFromHex(canvasBgHex) >= LIGHT_BG_BLEND_THRESHOLD) {
    return THREE.NormalBlending;
  }
  if (mode === 'custom' && perceptualLuminanceFromHex(particleCustomHex) < CUSTOM_DARK_LUM_BLEND_THRESHOLD) {
    return THREE.NormalBlending;
  }
  return THREE.AdditiveBlending;
}

function createDefaultGeometry(particleCount: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const targetPositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const targetColors = new Float32Array(particleCount * 3);
  const randomOffsets = new Float32Array(particleCount * 3);
  const greenColor = new THREE.Color(0x00ff66);
  const brightWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const t = (Math.random() - 0.5) * 5.0;
    const angle = Math.random() * Math.PI * 2;
    const radiusBase = 0.4 + Math.pow(Math.abs(t), 2.4);
    const radius = radiusBase * (0.75 + Math.random() * 0.55);
    let x = radius * Math.cos(angle);
    let z = radius * Math.sin(angle);
    const y = t * 7.5;
    const squash = 2.9;
    x *= squash;
    z *= squash;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    targetPositions[i3] = x;
    targetPositions[i3 + 1] = y;
    targetPositions[i3 + 2] = z;
    randomOffsets[i3] = (Math.random() - 0.5) * 2;
    randomOffsets[i3 + 1] = (Math.random() - 0.5) * 2;
    randomOffsets[i3 + 2] = (Math.random() - 0.5) * 2;

    const mixRatio = Math.random();
    const color = mixRatio > 0.7 ? greenColor : brightWhite;
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    targetColors[i3] = color.r;
    targetColors[i3 + 1] = color.g;
    targetColors[i3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('targetColor', new THREE.BufferAttribute(targetColors, 3));
  geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 3));

  return {
    geometry,
    positions,
    targetPositions,
    colors,
    targetColors,
  };
}

export const ParticleCanvas = forwardRef<ParticleCanvasRef, Props>(function ParticleCanvas(
  {
    particleCount = 90000,
    particleSize = 200,
    canvasBackgroundColor = '#000000',
    particleColorMode = 'original' as ParticleColorMode,
    particleCustomColor = '#22c55e',
    effect,
    shape,
    interactionMode: interactionModeProp,
    manualControlTarget: manualControlTargetProp,
    imageUrl,
    modelUrl,
    listenForKeyboardToggle = true,
    pauseAnimationWhenHidden = false,
    intersectionRootMargin = '0px',
    className,
    style,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** 确保 WebGL 在 DOM 节点已挂上后再 init（避免首帧 useEffect 时 ref 仍为空或时序导致 scene 未就绪）。 */
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const setContainerNode = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setContainerEl(node);
  }, []);
  const canvasApiRef = useRef<ParticleCanvasRef | null>(null);
  const hadSourceFromPropsRef = useRef(false);
  const sceneDataRef = useRef<SceneData | null>(null);
  const animationIdRef = useRef<number>(0);
  const suspendAnimationRef = useRef(false);
  const targetSourceRef = useRef<TargetParticleSource | null>(null);
  /** 与 props 同步，供 mount 时 WebGL init 在 scene 就绪后再跑 setImage/setModel/generateShape（避免对应 effect 先于 init 执行导致 process* 在 !sceneData 时直接 return、异步加载从未开始）。 */
  const shapePropRef = useRef(shape);
  shapePropRef.current = shape;
  const modelUrlPropRef = useRef(modelUrl);
  modelUrlPropRef.current = modelUrl;
  const imageUrlPropRef = useRef(imageUrl);
  imageUrlPropRef.current = imageUrl;
  const effectPropRef = useRef(effect);
  effectPropRef.current = effect;
  const interactionModePropRef = useRef(interactionModeProp);
  interactionModePropRef.current = interactionModeProp;
  const manualControlTargetPropRef = useRef(manualControlTargetProp);
  manualControlTargetPropRef.current = manualControlTargetProp;
  const stateRef = useRef({
    uploadedImage: null as string | null,
    uploadedModel: null as string | null,
    particleSize,
    particleCount,
    currentEffect: 'default',
    effectIntensity: 0,
    targetEffectIntensity: 0,
    explosionTriggered: false,
    explosionTime: 0,
    currentShape: null as string | null,
    time: 0,
    morphFactor: 0,
    interactionMode: (interactionModeProp ?? 'auto') as 'auto' | 'manual',
    manualControlTarget: (manualControlTargetProp ?? 'camera') as 'camera' | 'object',
  });

  // 鼠标控制粒子对象的状态
  const mouseStateRef = useRef({
    isDragging: false,
    previousX: 0,
    previousY: 0,
  });
  const resetViewTransform = () => {
    const sceneData = sceneDataRef.current;
    if (!sceneData) return;

    sceneData.points.rotation.set(0, 0, 0);
    sceneData.points.position.set(0, 0, 0);
    sceneData.points.scale.set(1, 1, 1);
    mouseStateRef.current.isDragging = false;

    if (sceneData.controls) {
      sceneData.controls.reset();
      sceneData.controls.update();
    }
  };

  const applyCurrentTarget = () => {
    const sceneData = sceneDataRef.current;
    const source = targetSourceRef.current;
    if (!sceneData || !source) return;

    const { particleCount: count } = stateRef.current;
    const { targetPositions, targetColors, geometry } = sceneData;
    const srcPos = source.positions;
    const srcCol = source.colors;
    const srcCount = srcPos.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let srcIdx: number;

      if (source.type === 'model') {
        srcIdx = Math.floor(Math.random() * srcCount) * 3;
      } else {
        srcIdx = (i % srcCount) * 3;
      }

      let jitterX = 0, jitterY = 0, jitterZ = 0;
      if (source.type === 'image') {
        jitterX = (Math.random() - 0.5) * 0.4;
        jitterY = (Math.random() - 0.5) * 0.4;
        jitterZ = (Math.random() - 0.5) * 1.5;
      } else if (source.type === 'model') {
        const jitter = 0.15;
        jitterX = (Math.random() - 0.5) * jitter;
        jitterY = (Math.random() - 0.5) * jitter;
        jitterZ = (Math.random() - 0.5) * jitter;
      } else if (source.type === 'shape') {
        const spread = 0.3;
        jitterX = (Math.random() - 0.5) * spread;
        jitterY = (Math.random() - 0.5) * spread;
        jitterZ = (Math.random() - 0.5) * spread;
      }

      targetPositions[i3] = srcPos[srcIdx] + jitterX;
      targetPositions[i3 + 1] = srcPos[srcIdx + 1] + jitterY;
      targetPositions[i3 + 2] = srcPos[srcIdx + 2] + jitterZ;

      targetColors[i3] = srcCol[srcIdx];
      targetColors[i3 + 1] = srcCol[srcIdx + 1];
      targetColors[i3 + 2] = srcCol[srcIdx + 2];
    }

    geometry.attributes.targetPosition.needsUpdate = true;
    geometry.attributes.targetColor.needsUpdate = true;
  };

  const syncMorphUniformToState = () => {
    const state = stateRef.current;
    const sd = sceneDataRef.current;
    const target = resolveMorphUniform(state, targetSourceRef.current);
    state.morphFactor = target;
    if (sd?.material) {
      sd.material.uniforms.uMorph.value = target;
    }
  };

  const sourceDepsForMedia = (): MediaParticleProcessorDeps => ({
    sceneDataRef,
    stateRef,
    targetSourceRef,
    applyCurrentTarget,
    syncMorphUniformToState,
  });

  /**
   * useImperativeHandle(..., []) 只挂载一次 API，必须用 ref 取「当前渲染」的 deps，
   * 否则 setImage 会永远拿着首次渲染的 applyCurrentTarget；且 scene 未就绪时提前 return 后无法再应用贴图。
   */
  const mediaDepsRef = useRef<MediaParticleProcessorDeps | null>(null);
  mediaDepsRef.current = sourceDepsForMedia();

  const generateShape = (shapeName: string) => {
    const sceneData = sceneDataRef.current;
    if (!sceneData) return;

    const { particleCount: count } = stateRef.current;
    const points: { pos: [number, number, number]; col: [number, number, number] }[] = [];
    const greenColor = new THREE.Color(0x00ff66);
    const brightWhite = new THREE.Color(0xffffff);
    const butterflyPalette = [
      new THREE.Color(0xfff38a),
      new THREE.Color(0xf2b363),
      new THREE.Color(0xff8faf),
      new THREE.Color(0xd7ff83),
      new THREE.Color(0xffffff),
    ];

    if (shapeName === 'default') {
      for (let i = 0; i < count; i++) {
        const t = (Math.random() - 0.5) * 5.0;
        const angle = Math.random() * Math.PI * 2;
        const radiusBase = 0.4 + Math.pow(Math.abs(t), 2.4);
        const radius = radiusBase * (0.75 + Math.random() * 0.55);
        let x = radius * Math.cos(angle);
        let z = radius * Math.sin(angle);
        const y = t * 7.5;
        const squash = 2.9;
        x *= squash;
        z *= squash;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({ pos: [x, y, z], col: [color.r, color.g, color.b] });
      }
      stateRef.current.uploadedImage = null;
      stateRef.current.uploadedModel = null;
    } else if (shapeName === 'heart') {
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const scale = 18;
        const x = (scale * (16 * Math.pow(Math.sin(t), 3))) / 16 * Math.sin(v) * Math.cos(u);
        const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
        const z = (scale * (16 * Math.pow(Math.sin(t), 3))) / 16 * Math.sin(v) * Math.sin(u) * 0.8;
        const spread = 3.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'butterfly') {
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 12;
        const scale = 5.5;
        const exp = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5);
        const x = Math.sin(t) * exp * scale;
        const y = Math.cos(t) * exp * scale;
        const z = (Math.random() - 0.5) * 15;
        const spread = 2.5;
        const color = butterflyPalette[Math.floor(Math.random() * butterflyPalette.length)];
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'rose') {
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 14;
        const k = 5;
        const r = Math.cos(k * t) * 15;
        const h = (Math.random() - 0.5) * 20;
        const x = r * Math.cos(t);
        const y = h;
        const z = r * Math.sin(t);
        const spread = 2.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'cube') {
      const cubeSize = 18;
      for (let i = 0; i < count; i++) {
        const face = Math.floor(Math.random() * 6);
        const a = (Math.random() - 0.5) * cubeSize;
        const b = (Math.random() - 0.5) * cubeSize;
        let x: number, y: number, z: number;
        switch (face) {
          case 0: x = cubeSize / 2; y = a; z = b; break;
          case 1: x = -cubeSize / 2; y = a; z = b; break;
          case 2: x = a; y = cubeSize / 2; z = b; break;
          case 3: x = a; y = -cubeSize / 2; z = b; break;
          case 4: x = a; y = b; z = cubeSize / 2; break;
          default: x = a; y = b; z = -cubeSize / 2;
        }
        const spread = 2.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'pyramid') {
      const pyrHeight = 25;
      const pyrBase = 20;
      for (let i = 0; i < count; i++) {
        const onBase = Math.random() < 0.3;
        let x: number, y: number, z: number;
        if (onBase) {
          x = (Math.random() - 0.5) * pyrBase;
          z = (Math.random() - 0.5) * pyrBase;
          y = -pyrHeight / 2;
        } else {
          const t = Math.random();
          const baseX = (Math.random() - 0.5) * pyrBase * (1 - t);
          const baseZ = (Math.random() - 0.5) * pyrBase * (1 - t);
          x = baseX;
          y = -pyrHeight / 2 + t * pyrHeight;
          z = baseZ;
        }
        const spread = 2.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'spiral') {
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 10;
        const r = 10 + Math.sin(t * 3) * 4;
        const x = r * Math.cos(t);
        const y = (i / count - 0.5) * 40;
        const z = r * Math.sin(t);
        const spread = 2.5;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'star') {
      const starPoints = 5;
      const innerR = 8;
      const outerR = 18;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const pointAngle = Math.floor(angle / (Math.PI * 2 / starPoints)) * (Math.PI * 2 / starPoints);
        const t = (angle - pointAngle) / (Math.PI / starPoints);
        const r = t < 1 ? outerR - (outerR - innerR) * t : innerR + (outerR - innerR) * (t - 1);
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = (Math.random() - 0.5) * 15;
        const spread = 2.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'sphere') {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 16;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        const spread = 2.5;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'dna') {
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 8;
        const y = (i / count - 0.5) * 45;
        const r = 10;
        const strand = i % 3;
        let x: number, z: number;
        if (strand === 0) {
          x = r * Math.cos(t);
          z = r * Math.sin(t);
        } else if (strand === 1) {
          x = r * Math.cos(t + Math.PI);
          z = r * Math.sin(t + Math.PI);
        } else {
          const barPos = Math.random();
          x = r * Math.cos(t) * (1 - barPos) + r * Math.cos(t + Math.PI) * barPos;
          z = r * Math.sin(t) * (1 - barPos) + r * Math.sin(t + Math.PI) * barPos;
        }
        const spread = 2.0;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + (Math.random() - 0.5) * spread, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread],
          col: [color.r, color.g, color.b],
        });
      }
    } else if (shapeName === 'infinity') {
      const infScale = 25;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 6;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = infScale * Math.cos(t) / denom;
        const y = infScale * Math.sin(t) * Math.cos(t) / denom;
        const verticalSpread = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 15 + Math.sin(t * 2) * 5;
        const thickness = 4.0;
        const offsetX = (Math.random() - 0.5) * thickness;
        const offsetY = (Math.random() - 0.5) * thickness + verticalSpread * 0.3;
        const offsetZ = (Math.random() - 0.5) * thickness;
        const color = Math.random() > 0.7 ? greenColor : brightWhite;
        points.push({
          pos: [x + offsetX, y + offsetY, z + offsetZ],
          col: [color.r, color.g, color.b],
        });
      }
    }

    if (points.length > 0) {
      const rawPositions = new Float32Array(points.length * 3);
      const rawColors = new Float32Array(points.length * 3);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const i3 = i * 3;
        rawPositions[i3] = p.pos[0];
        rawPositions[i3 + 1] = p.pos[1];
        rawPositions[i3 + 2] = p.pos[2];
        rawColors[i3] = p.col[0];
        rawColors[i3 + 1] = p.col[1];
        rawColors[i3 + 2] = p.col[2];
      }

      targetSourceRef.current = { positions: rawPositions, colors: rawColors, type: 'shape' };
      applyCurrentTarget();

      stateRef.current.uploadedImage = shapeName === 'default' ? null : 'shape';
      stateRef.current.uploadedModel = null;
      syncMorphUniformToState();
    }
  };

  useImperativeHandle(ref, () => {
    const api: ParticleCanvasRef = {
      setImage(imageUrlV: string | null) {
        resetViewTransform();
        stateRef.current.uploadedModel = null;
        stateRef.current.uploadedImage = imageUrlV;
        stateRef.current.currentShape = null;
        const d = mediaDepsRef.current;
        if (d) processImageParticles(imageUrlV, d);
      },
      setModel(modelUrlV: string | null) {
        resetViewTransform();
        stateRef.current.uploadedImage = null;
        stateRef.current.uploadedModel = modelUrlV;
        stateRef.current.currentShape = null;
        const d = mediaDepsRef.current;
        if (d) processModelParticles(modelUrlV, d);
      },
      clearImage() {
        stateRef.current.uploadedImage = null;
        stateRef.current.uploadedModel = null;
        stateRef.current.currentShape = null;
        targetSourceRef.current = null;
        const d = mediaDepsRef.current;
        if (d) {
          processModelParticles(null, d);
          processImageParticles(null, d);
        }
      },
      getUploadedModelUrl() {
        return stateRef.current.uploadedModel;
      },
      setParticleSize(size: number) {
        stateRef.current.particleSize = size;
        if (sceneDataRef.current?.material) {
          sceneDataRef.current.material.uniforms.uPointSize.value = size;
        }
      },
      setParticleCount(count: number) {
        const sceneData = sceneDataRef.current;
        const state = stateRef.current;
        if (count === state.particleCount || !sceneData) return;

        state.particleCount = count;
        const { scene, points, material } = sceneData;
        scene.remove(points);
        points.geometry.dispose();

        const { geometry, positions, targetPositions, colors, targetColors } = createDefaultGeometry(count);
        const newPoints = new THREE.Points(geometry, material);
        scene.add(newPoints);

        sceneDataRef.current = {
          ...sceneData,
          points: newPoints,
          geometry,
          originalPositions: positions,
          targetPositions,
          originalColors: colors,
          targetColors,
        };

        if (targetSourceRef.current) {
          applyCurrentTarget();
        } else {
          if (state.currentShape) {
            generateShape(state.currentShape);
          } else if (state.uploadedImage && state.uploadedImage !== 'shape') {
            const d = mediaDepsRef.current;
            if (d) processImageParticles(state.uploadedImage, d);
          } else if (state.uploadedModel) {
            const d = mediaDepsRef.current;
            if (d) processModelParticles(state.uploadedModel, d);
          }
        }
        syncMorphUniformToState();
      },
      setShape(shapeParam: string) {
        stateRef.current.currentShape = shapeParam;
        generateShape(shapeParam);
      },
      setEffect(effectName: string) {
        stateRef.current.currentEffect = effectName;
        if (effectName === 'default') {
          stateRef.current.targetEffectIntensity = 0;
          stateRef.current.explosionTriggered = false;
        } else {
          stateRef.current.targetEffectIntensity = 1.0;
          if (effectName === 'explode') {
            stateRef.current.explosionTriggered = true;
            stateRef.current.explosionTime = 0;
          } else {
            stateRef.current.explosionTriggered = false;
          }
        }
      },
      triggerExplosion() {
        if (stateRef.current.currentEffect === 'explode') {
          stateRef.current.explosionTime = 0;
          stateRef.current.explosionTriggered = true;
        }
      },
      getCanvas() {
        return sceneDataRef.current?.renderer.domElement ?? null;
      },
      setInteractionMode(mode: 'auto' | 'manual') {
        stateRef.current.interactionMode = mode;
        const sceneData = sceneDataRef.current;
        if (sceneData) {
          if (mode === 'manual') {
            sceneData.points.rotation.set(0, 0, 0);
          }
          const isManualCamera = mode === 'manual' && stateRef.current.manualControlTarget === 'camera';
          sceneData.controls.enabled = isManualCamera;
        }
      },
      setManualControlTarget(target: 'camera' | 'object') {
        stateRef.current.manualControlTarget = target;
        if (sceneDataRef.current?.controls) {
          const isManualCamera = stateRef.current.interactionMode === 'manual' && target === 'camera';
          sceneDataRef.current.controls.enabled = isManualCamera;
        }
      },
    };
    canvasApiRef.current = api;
    return api;
  }, []);

  useLayoutEffect(() => {
    const container = containerEl;
    if (!container) return;

    stateRef.current.particleCount = particleCount;
    stateRef.current.particleSize = particleSize;

    const modeFromPropsOnMount = interactionModePropRef.current;
    if (modeFromPropsOnMount !== undefined) {
      stateRef.current.interactionMode = modeFromPropsOnMount;
    }
    const targetFromPropsOnMount = manualControlTargetPropRef.current;
    if (targetFromPropsOnMount !== undefined) {
      stateRef.current.manualControlTarget = targetFromPropsOnMount;
    }

    const measure = () => {
      const rawW = container.clientWidth;
      const rawH = container.clientHeight;
      return {
        width: Math.max(1, rawW || 1),
        height: Math.max(1, rawH || 1),
      };
    };

    let { width, height } = measure();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(canvasBackgroundColor), 1);
    container.appendChild(renderer.domElement);

    const { geometry, positions, targetPositions, colors, targetColors } = createDefaultGeometry(particleCount);
    targetSourceRef.current = { positions: positions, colors: colors, type: 'shape' };
    const customParticleCol = new THREE.Color(particleCustomColor);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPointSize: { value: particleSize },
        uEffectMode: { value: 0 },
        uEffectIntensity: { value: 0 },
        uExplosionTime: { value: 0 },
        uParticleColorMode: { value: particleColorMode === 'custom' ? 1 : 0 },
        uCustomParticleColor: {
          value: new THREE.Vector3(customParticleCol.r, customParticleCol.g, customParticleCol.b),
        },
      },
      depthWrite: false,
      blending: resolvePointsBlending(canvasBackgroundColor, particleColorMode, particleCustomColor),
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 初始化 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // 默认禁用（自动旋转模式）
    controls.enableDamping = true; // 启用阻尼（惯性）
    controls.dampingFactor = 0.05;
    controls.minDistance = 20; // 最小缩放距离
    controls.maxDistance = 100; // 最大缩放距离
    controls.enablePan = true; // 允许平移
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI; // 允许全方位旋转

    sceneDataRef.current = {
      scene,
      camera,
      renderer,
      points,
      geometry,
      material,
      originalPositions: positions,
      targetPositions,
      originalColors: colors,
      targetColors,
      controls,
    };

    const m = modelUrlPropRef.current;
    const im = imageUrlPropRef.current;
    const hasModel = m != null && m !== '';
    const hasImage = im != null && im !== '';
    if (hasModel || hasImage) {
      concealWebglCanvas(sceneDataRef);
    } else {
      ensureWebglCanvasVisible(sceneDataRef);
    }

    /** 必须在 scene 就绪后同步调用：props 的 useEffect 可能已在「无 scene」时提前跑过且不会再触发。 */
    const deps = mediaDepsRef.current;
    if (deps) {
      if (hasModel) {
        hadSourceFromPropsRef.current = true;
        stateRef.current.uploadedImage = null;
        stateRef.current.uploadedModel = m;
        stateRef.current.currentShape = null;
        processModelParticles(m, deps);
      } else if (hasImage) {
        hadSourceFromPropsRef.current = true;
        stateRef.current.uploadedModel = null;
        stateRef.current.uploadedImage = im;
        stateRef.current.currentShape = null;
        processImageParticles(im, deps);
      }
    }

    if (!hasModel && !hasImage) {
      const shapeFromProps = shapePropRef.current;
      if (shapeFromProps !== undefined) {
        stateRef.current.currentShape = shapeFromProps;
        generateShape(shapeFromProps);
      }
    }

    syncMorphUniformToState();

    /** 与 particleify applyDeclarativeProps 一致：scene 就绪后立即同步，避免首帧仍按 auto 自转 */
    const api = canvasApiRef.current;
    if (api) {
      const effectFromProps = effectPropRef.current;
      if (effectFromProps !== undefined) api.setEffect(effectFromProps);
      const modeFromProps = interactionModePropRef.current;
      if (modeFromProps !== undefined) api.setInteractionMode(modeFromProps);
      const targetFromProps = manualControlTargetPropRef.current;
      if (targetFromProps !== undefined) api.setManualControlTarget(targetFromProps);
    }

    const resizeObserver = new ResizeObserver(() => {
      const next = measure();
      width = next.width;
      height = next.height;
      if (!sceneDataRef.current) return;
      sceneDataRef.current.camera.aspect = width / height;
      sceneDataRef.current.camera.updateProjectionMatrix();
      sceneDataRef.current.renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 鼠标控制粒子对象的事件监听器
    const onMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      if (state.interactionMode === 'manual' && state.manualControlTarget === 'object') {
        mouseStateRef.current.isDragging = true;
        mouseStateRef.current.previousX = e.clientX;
        mouseStateRef.current.previousY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      const mouseState = mouseStateRef.current;
      if (state.interactionMode === 'manual' && state.manualControlTarget === 'object' && mouseState.isDragging) {
        if (!sceneDataRef.current) return;
        const deltaX = e.clientX - mouseState.previousX;
        const deltaY = e.clientY - mouseState.previousY;

        // 旋转粒子对象
        const { points } = sceneDataRef.current;
        points.rotation.y += deltaX * 0.005;
        points.rotation.x += deltaY * 0.005;

        mouseState.previousX = e.clientX;
        mouseState.previousY = e.clientY;
      }
    };

    const onMouseUp = () => {
      mouseStateRef.current.isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 添加键盘监听：按 Space 切换交互模式
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        const state = stateRef.current;
        const newMode = state.interactionMode === 'auto' ? 'manual' : 'auto';
        canvasApiRef.current?.setInteractionMode(newMode);
        // 提示用户
        console.log(`[交互模式] ${newMode === 'auto' ? '自动旋转' : '手动控制（拖动鼠标旋转）'}`);
      }
    };
    if (listenForKeyboardToggle) {
      window.addEventListener('keydown', onKeyDown);
    }

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      if (suspendAnimationRef.current) return;

      const state = stateRef.current;
      state.time += 0.008;

      const sceneData = sceneDataRef.current;
      if (!sceneData) return;

      const { renderer, scene, camera, points, material, controls } = sceneData;

      // 根据交互模式决定是否自动旋转
      if (state.interactionMode === 'manual') {
        // 手动模式：不自动旋转；控制相机时保持粒子朝向固定
        if (state.manualControlTarget === 'camera') {
          points.rotation.set(0, 0, 0);
          controls.update();
        }
        // manualControlTarget === 'object' 时由鼠标拖拽控制旋转
      } else {
        // 自动旋转模式：执行自动旋转
        let rotationSpeed = 0.0025;
        if (state.currentEffect === 'vortex') {
          rotationSpeed = 0.008 * (0.5 + state.effectIntensity);
        } else if (state.currentEffect === 'explode' && state.explosionTriggered) {
          rotationSpeed = 0.001;
        }

        points.rotation.y += rotationSpeed;
        points.rotation.z += 0.001;
        points.rotation.x = Math.sin(state.time * 0.15) * 0.12;
      }

      material.uniforms.uTime.value = state.time;

      const targetMorph = resolveMorphUniform(state, targetSourceRef.current);
      state.morphFactor = targetMorph;
      material.uniforms.uMorph.value = targetMorph;

      state.effectIntensity += (state.targetEffectIntensity - state.effectIntensity) * 0.08;
      material.uniforms.uEffectIntensity.value = state.effectIntensity;
      material.uniforms.uEffectMode.value = EFFECT_MODES[state.currentEffect] ?? 0;

      if (state.explosionTriggered) {
        state.explosionTime += 0.016;
        if (state.explosionTime > 2.0) state.explosionTime = 0;
      }
      material.uniforms.uExplosionTime.value = state.explosionTime;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationIdRef.current);
      if (sceneDataRef.current) {
        const { renderer, scene, points, controls } = sceneDataRef.current;
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        controls.dispose();
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
        scene.remove(points);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        sceneDataRef.current = null;
      }
    };
  }, [containerEl]);

  useEffect(() => {
    if (!pauseAnimationWhenHidden) {
      suspendAnimationRef.current = false;
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        suspendAnimationRef.current = !(e?.isIntersecting ?? false);
      },
      {
        threshold: 0,
        root: null,
        rootMargin: intersectionRootMargin,
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      suspendAnimationRef.current = false;
    };
  }, [pauseAnimationWhenHidden, intersectionRootMargin]);

  useEffect(() => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.renderer.setClearColor(new THREE.Color(canvasBackgroundColor), 1);
    if (containerRef.current) containerRef.current.style.backgroundColor = canvasBackgroundColor;
  }, [canvasBackgroundColor]);

  useEffect(() => {
    const mat = sceneDataRef.current?.material;
    if (!mat) return;
    mat.uniforms.uParticleColorMode.value = particleColorMode === 'custom' ? 1 : 0;
    mat.blending = resolvePointsBlending(canvasBackgroundColor, particleColorMode, particleCustomColor);
  }, [canvasBackgroundColor, particleColorMode, particleCustomColor]);

  useEffect(() => {
    const mat = sceneDataRef.current?.material;
    if (!mat) return;
    const c = new THREE.Color(particleCustomColor);
    mat.uniforms.uCustomParticleColor.value.set(c.r, c.g, c.b);
  }, [particleCustomColor]);

  useEffect(() => {
    canvasApiRef.current?.setParticleCount(particleCount);
  }, [particleCount]);

  useEffect(() => {
    canvasApiRef.current?.setParticleSize(particleSize);
  }, [particleSize]);

  useEffect(() => {
    if (effect === undefined) return;
    canvasApiRef.current?.setEffect(effect);
  }, [effect]);

  useEffect(() => {
    if (shape === undefined) return;
    canvasApiRef.current?.setShape(shape);
  }, [shape]);

  useEffect(() => {
    if (interactionModeProp === undefined) return;
    canvasApiRef.current?.setInteractionMode(interactionModeProp);
  }, [interactionModeProp]);

  useEffect(() => {
    if (manualControlTargetProp === undefined) return;
    canvasApiRef.current?.setManualControlTarget(manualControlTargetProp);
  }, [manualControlTargetProp]);

  useEffect(() => {
    const api = canvasApiRef.current;
    if (!api) return;

    const hasModel = modelUrl != null && modelUrl !== '';
    const hasImage = imageUrl != null && imageUrl !== '';

    if (hasModel) {
      api.setModel(modelUrl);
      hadSourceFromPropsRef.current = true;
      return;
    }
    if (hasImage) {
      api.setImage(imageUrl as string);
      hadSourceFromPropsRef.current = true;
      return;
    }

    if (hadSourceFromPropsRef.current) {
      api.clearImage();
      api.setShape(shape ?? 'default');
      hadSourceFromPropsRef.current = false;
    }
  }, [modelUrl, imageUrl, shape]);

  const canvasEl = (
    <div
      ref={setContainerNode}
      className="absolute inset-0 w-full h-full"
      style={{ backgroundColor: canvasBackgroundColor }}
    />
  );

  if (className !== undefined || style !== undefined) {
    return (
      <div
        className={className ?? 'relative w-full'}
        style={{ position: 'relative', overflow: 'hidden', minHeight: 1, ...style }}
      >
        {canvasEl}
      </div>
    );
  }

  return canvasEl;
});
