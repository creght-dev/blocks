// @ts-nocheck -- this is a direct, component-scoped port of the original WebGL scene.
import * as THREE from "three"

export type OrbParticlesSceneController = {
  ignite: (x?: number, y?: number) => void
  destroy: () => void
}

export function createOrbParticlesScene(
  canvas: HTMLCanvasElement,
  cursorEl: HTMLDivElement,
  root: HTMLElement,
): OrbParticlesSceneController {
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
const cameraLookTarget = new THREE.Vector3();
camera.position.set(0, 0, 10);

function updateCameraLookTarget(){
  cameraLookTarget.set(0, 0, 0);
  camera.lookAt(cameraLookTarget);
}

updateCameraLookTarget();

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

const pointerNDC = new THREE.Vector2(9, 9);
const hoverWorld = new THREE.Vector3(0, 0, 0);
const hoverTarget = new THREE.Vector3(0, 0, 0);
const hoverRaycaster = new THREE.Raycaster();
const hoverSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 3.9);
const hoverHit = new THREE.Vector3();
const hoverToCenter = new THREE.Vector3();
let hoverNear = 0, hoverFar = 0, hasHoverTube = false;
let hoverStrength = 0, pointerInside = false, pointerMoveBoost = 0;
let pointerVelX = 0, pointerVelY = 0, prevPointerX = 0, prevPointerY = 0, prevPointerTs = 0, hasPrevPointer = false;

/* shockwave state */
let waveT = -1;
const wavePos = new THREE.Vector3(0, 0, 0);

const handlePointerMove = (e: PointerEvent) => {
  const rect = canvas.getBoundingClientRect();
  cursorEl.style.left = e.clientX - rect.left + 'px';
  cursorEl.style.top  = e.clientY - rect.top + 'px';
  cursorEl.style.opacity = '1';
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  pointerInside = px >= 0 && px <= 1 && py >= 0 && py <= 1;
  if(pointerInside){
    pointerNDC.x = px * 2 - 1;
    pointerNDC.y = -(py * 2 - 1);
    pointerMoveBoost = 1;
    if(hasPrevPointer){
      const dtMs = Math.max(1, e.timeStamp - prevPointerTs);
      const vx = (e.clientX - prevPointerX) / dtMs;
      const vy = (e.clientY - prevPointerY) / dtMs;
      pointerVelX = pointerVelX * 0.72 + vx * 0.28;
      pointerVelY = pointerVelY * 0.72 + vy * 0.28;
    }
    prevPointerX = e.clientX; prevPointerY = e.clientY;
    prevPointerTs = e.timeStamp; hasPrevPointer = true;
  } else {
    pointerNDC.set(9, 9);
    hasPrevPointer = false;
  }
};
const handlePointerLeave = () => {
  pointerInside = false; pointerMoveBoost = 0;
  pointerVelX = 0; pointerVelY = 0; hasPrevPointer = false;
  pointerNDC.set(9, 9);
  cursorEl.style.opacity = '0';
};
const handlePointerDown = (e: PointerEvent) => {
  if(reducedMotion) return;
  const rect = canvas.getBoundingClientRect();
  const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const py = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  hoverRaycaster.setFromCamera(new THREE.Vector2(px, py), camera);
  if(hoverRaycaster.ray.intersectSphere(hoverSphere, hoverHit)){
    wavePos.copy(hoverHit);
  } else {
    // click outside the orb: launch the wave from the nearest surface point
    hoverRaycaster.ray.closestPointToPoint(hoverSphere.center, hoverHit);
    hoverHit.setLength(3.6);
    wavePos.copy(hoverHit);
  }
  waveT = 0;
};

window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerleave', handlePointerLeave);
window.addEventListener('pointerdown', handlePointerDown);

/* ─── Background sphere ─── */
const bgVertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;
const bgFragmentShader = `
varying vec2 vUv;
uniform vec3 uColor1,uColor2,uColor3,uColor4;
uniform float uColor4BlendStart,uColor4BlendEnd;
uniform vec2 uOffset1,uOffset2,uOffset3;
uniform float uScale1,uScale2,uScale3,uSpeed,uTime;
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.0*C.xxx;vec3 x3=x0-1.+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0,i1.z,i2.z,1))+i.y+vec4(0,i1.y,i2.y,1))+i.x+vec4(0,i1.x,i2.x,1));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
void main(){
  vec2 uv1=vUv*uScale1+uOffset1+vec2(uTime*uSpeed*0.06,-uTime*uSpeed*0.03);
  vec2 uv2=vUv*uScale2+uOffset2+vec2(-uTime*uSpeed*0.04,uTime*uSpeed*0.05);
  vec2 uv3=vUv*uScale3+uOffset3+vec2(uTime*uSpeed*0.02,uTime*uSpeed*0.015);
  float n1=smoothstep(0.0,1.0,snoise(vec3(uv1,uTime*uSpeed*0.25)));
  vec3 color=mix(uColor1,uColor2,n1);
  float n2=smoothstep(0.0,1.0,snoise(vec3(uv2,uTime*uSpeed*0.18)));
  vec3 c3=mix(uColor4,uColor3,smoothstep(uColor4BlendStart,uColor4BlendEnd,n2));
  color=mix(color,c3,n2);
  float n3=smoothstep(0.0,1.0,snoise(vec3(uv3,uTime*uSpeed*1.15)));
  color=mix(color,clamp(color*1.22,0.0,1.0),n3);
  gl_FragColor=vec4(clamp(color,0.0,1.0),1.0);
}`;
const bgMat = new THREE.ShaderMaterial({
  vertexShader: bgVertexShader, fragmentShader: bgFragmentShader, side: THREE.BackSide,
  uniforms: {
    uColor1:{value:new THREE.Color(0x082e22)},uColor2:{value:new THREE.Color(0x123a2c)},
    uColor3:{value:new THREE.Color(0x1f5c45)},uColor4:{value:new THREE.Color(0x4ed4a0)},
    uColor4BlendStart:{value:0.2},uColor4BlendEnd:{value:0.9},
    uOffset1:{value:new THREE.Vector2(0,0)},uOffset2:{value:new THREE.Vector2(0.3,0.1)},
    uOffset3:{value:new THREE.Vector2(0.6,0.6)},
    uScale1:{value:1.2},uScale2:{value:1.6},uScale3:{value:0.8},
    uSpeed:{value:0.2},uTime:{value:0}
  }
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,32), bgMat));

/* ─── Landing Orb ─── */
const orbVertexShader = `
varying vec3 vNormal,vView,vViewPosition,vPosition;
void main(){
  vPosition=position;
  vNormal=normalize(mat3(modelMatrix[0].xyz,modelMatrix[1].xyz,modelMatrix[2].xyz)*normal);
  vec4 wp=modelMatrix*vec4(position,1.0);
  vec4 mv=viewMatrix*wp;
  vViewPosition=-mv.xyz;
  vView=normalize(cameraPosition-wp.xyz);
  gl_Position=projectionMatrix*mv;
}`;
const orbFragmentShader = `
varying vec3 vNormal,vView,vViewPosition,vPosition;
uniform float uTime,uColorFresnelAmount,uColorFresnelOffset,uColorFresnelFalloff;
uniform float uOpacityFresnelAmount,uOpacityFresnelOffset,uOpacityFresnelFalloff,uOpacity;
uniform vec3 uFresnelColor,uAmbientColor,uCloudsColor;
uniform vec2 uCloudsSmoothstep;
uniform float uCloudNoiseSpeed;
uniform vec3 uCloudNoiseScale,uLightPosition,uLightColor,uLightPosition2,uLightColor2;
uniform float uLightIntensity,uSpecularIntensity,uLightIntensity2,uSpecularIntensity2,uShininess;
float fresnelFunc(float a,float o,float f,vec3 n,vec3 v){return clamp(o+(1.0-o)*pow(max(1.0-dot(n,v),0.0),a)*f,0.0,1.0);}
vec4 mod289v(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return mod289v(((x*34.0)+1.0)*x);}
float noise3(vec3 p){
  vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.0-2.0*d);
  vec4 b=a.xxyy+vec4(0,1,0,1);vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);
  vec4 c=k2+a.zzzz;vec4 o1=fract(perm(c)*(1.0/41.0));vec4 o2=fract(perm(c+1.0)*(1.0/41.0));
  vec4 o3=o2*d.z+o1*(1.0-d.z);vec2 o4=o3.yw*d.x+o3.xz*(1.0-d.x);
  return o4.y*d.y+o4.x*(1.0-d.y);
}
float fbm(vec3 x){float v=0.0,a=0.5;vec3 s=vec3(100);for(int i=0;i<5;i++){v+=a*noise3(x);x=x*2.0+s;a*=0.5;}return v;}
void main(){
  vec3 n=normalize(vNormal),vd=normalize(vView);
  vec3 ld=normalize(uLightPosition-vViewPosition),ld2=normalize(uLightPosition2-vViewPosition);
  float nc=fbm(vPosition*uCloudNoiseScale+vec3(0,0,uTime*uCloudNoiseSpeed));
  float cl=smoothstep(0.15,0.9,nc);
  vec3 amb=mix(uAmbientColor*uCloudsColor,uAmbientColor,cl);
  float d1=max(dot(n,ld),0.0),d2=max(dot(n,ld2),0.0);
  vec3 diff=mix(d1*uLightColor*uLightIntensity,d2*uLightColor2*uLightIntensity2,d2);
  float s1=pow(max(dot(vd,reflect(-ld,n)),0.0),uShininess)*uSpecularIntensity;
  float s2=pow(max(dot(vd,reflect(-ld2,n)),0.0),uShininess)*uSpecularIntensity2;
  vec3 spec=mix(s1*uLightColor,s2*uLightColor2,s2);
  float cf=fresnelFunc(uColorFresnelAmount,uColorFresnelOffset,uColorFresnelFalloff,n,vd);
  float of=fresnelFunc(uOpacityFresnelAmount,uOpacityFresnelOffset,uOpacityFresnelFalloff,n,vd);
  float ca=smoothstep(uCloudsSmoothstep.x,uCloudsSmoothstep.y,nc);
  gl_FragColor.rgb=mix(amb+diff+spec,uFresnelColor,cf);
  gl_FragColor.a=max(ca*uOpacity,of);
}`;
const orbMat = new THREE.ShaderMaterial({
  vertexShader: orbVertexShader, fragmentShader: orbFragmentShader,
  transparent: true, depthWrite: false,
  uniforms: {
    /* BORDER: fresnel shape + muted sage-green rim taken from the first file */
    uTime:{value:0},uColorFresnelAmount:{value:2.2},uColorFresnelOffset:{value:0.08},uColorFresnelFalloff:{value:1.8},
    uOpacityFresnelAmount:{value:1.1},uOpacityFresnelOffset:{value:0.04},uOpacityFresnelFalloff:{value:2.1},
    uOpacity:{value:0.62},uFresnelColor:{value:new THREE.Color(0x6a9a8a)},
    uAmbientColor:{value:new THREE.Color(0x16362a)},uCloudsColor:{value:new THREE.Color(0x0d2417)},
    uCloudsSmoothstep:{value:new THREE.Vector2(0.36,0.92)},uCloudNoiseScale:{value:new THREE.Vector3(2.5,2.5,2.5)},
    uCloudNoiseSpeed:{value:0.42},uShininess:{value:74},
    uLightPosition:{value:new THREE.Vector3(-12,16,53)},uLightColor:{value:new THREE.Color(0x54a37e)},
    uLightIntensity:{value:0.52},uSpecularIntensity:{value:0.12},
    uLightPosition2:{value:new THREE.Vector3(18,-6.7,22)},uLightColor2:{value:new THREE.Color(0x3a6650)},
    uLightIntensity2:{value:0.38},uSpecularIntensity2:{value:0.28}
  }
});
const orb = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), orbMat);
orb.scale.setScalar(4);
scene.add(orb);

/* ─── Inner Orb Particles ─── */
const INNER_COUNT = 18000;

const ipLife  = new Float32Array(INNER_COUNT);
const ipSpeed = new Float32Array(INNER_COUNT);
const ipScale = new Float32Array(INNER_COUNT);
const ipRandX = new Float32Array(INNER_COUNT);
const ipRandY = new Float32Array(INNER_COUNT);
const ipRandZ = new Float32Array(INNER_COUNT);

for(let i = 0; i < INNER_COUNT; i++){
  ipLife[i]  = Math.random();
  ipSpeed[i] = 0.04 + Math.random() * 0.06;
  ipScale[i] = 0.05 + Math.random() * Math.random() * 0.4;
  const theta2 = Math.acos(2 * Math.random() - 1);
  const phi2   = Math.random() * Math.PI * 2;
  ipRandX[i] = Math.sin(theta2) * Math.cos(phi2);
  ipRandY[i] = Math.sin(theta2) * Math.sin(phi2);
  ipRandZ[i] = Math.cos(theta2);
}

const ipVS = `
attribute float aLife;
attribute float aScale;
attribute float aRandX;
attribute float aRandY;
attribute float aRandZ;
varying vec2  vUv;
varying float vLife;
varying vec3  vRandom;
varying vec3  vPosition;
varying vec3  vWorldPos;
uniform float uParticleSize;
uniform vec2  uScaleRange;
uniform vec3  uHoverPos;
uniform float uHoverStrength;

void main(){
  vUv      = uv;
  vLife    = aLife;
  vRandom  = vec3(aRandX, aRandY, aRandZ);

  vec3 right = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
  vec3 up    = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);
  vec3 iPos  = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

  float s = uParticleSize * aScale;
  float rand01 = aRandX * 0.5 + 0.5;
  s *= mix(uScaleRange.x, uScaleRange.y, rand01);
  s *= smoothstep(0.0, 0.20, aLife);
  s *= 1.0 - smoothstep(0.9, 1.0, aLife);

  // particles caught by the cursor vortex grow slightly — feels energized
  float hd = length(iPos - uHoverPos);
  s *= 1.0 + smoothstep(1.6, 0.1, hd) * uHoverStrength * 0.9;

  vPosition = iPos;
  vWorldPos = (modelMatrix * vec4(iPos, 1.0)).xyz;

  vec3 worldPos = iPos + right * position.x * s + up * position.y * s;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`;

const ipFS = `
varying vec2  vUv;
varying float vLife;
varying vec3  vRandom;
varying vec3  vPosition;
varying vec3  vWorldPos;
uniform vec3  uAmbientColor1;
uniform vec3  uAmbientColor2;
uniform vec3  uBaseColor;
uniform vec3  uBaseColor2;
uniform vec3  uEdgeColor1;
uniform vec2  uEdgeColorStop;
uniform vec3  uBloomColor1;
uniform vec3  uRandomHighlightColor;
uniform float uRandomHighlightSelect;
uniform vec3  uLightPosition;
uniform vec3  uLightColor;
uniform float uLightIntensity;
uniform float uOpacity;
uniform float uTime;
uniform vec3  uPulseColor;
uniform float uPulseStrength;
uniform vec3  uHoverPos;
uniform float uHoverStrength;
uniform vec3  uAccentA;
uniform vec3  uAccentB;
uniform float uWaveT;
uniform vec3  uWavePos;

void main(){
  float d = length(vUv - 0.5) * 2.0;
  if(d > 1.0) discard;

  vec2 n2 = vUv * 2.0 - 1.0;
  float nz = sqrt(max(0.0, 1.0 - dot(n2, n2)));
  vec3 normal = normalize(vec3(n2.x, -n2.y, nz));

  vec3 lightDir = normalize(uLightPosition - vWorldPos);
  vec3 lightDirOpp = normalize(-uLightPosition - vWorldPos);
  float diffA = max(dot(normal, lightDir), 0.0);
  float diffB = max(dot(normal, lightDirOpp), 0.0);
  float diff = max(diffA, diffB);
  vec3 diffuse = (0.45 + 0.55 * diff) * uLightColor * uLightIntensity;

  float distFromCenter = length(vPosition);
  float rand01 = vRandom.x * 0.5 + 0.5;
  float rand01y = vRandom.y * 0.5 + 0.5;
  vec3 baseColor = mix(uBaseColor, uBaseColor2, rand01);
  baseColor = mix(baseColor, uEdgeColor1, smoothstep(uEdgeColorStop.x, uEdgeColorStop.y, distFromCenter));
  baseColor *= mix(0.75, 1.0, rand01);

  vec3 ambient = mix(uAmbientColor1, uAmbientColor2, rand01y);
  vec3 color = (ambient + diffuse) * baseColor;
  color = max(color, vec3(0.18, 0.18, 0.18));

  color = mix(color, color + uBloomColor1 + uRandomHighlightColor, step(uRandomHighlightSelect, rand01));
  float whiteTint = smoothstep(0.35, 0.95, diff) * 0.18;
  color = mix(color, vec3(1.0), whiteTint);

  // breathing color waves inside the orb
  float wave = 0.5 + 0.5 * sin(uTime * 1.2 - distFromCenter * 3.1 + rand01 * 6.28318);
  float pulseMask = smoothstep(2.9, 0.5, distFromCenter);
  color += uPulseColor * (wave * pulseMask * uPulseStrength);

  float edgeAlpha = 1.0 - smoothstep(0.3, 1.0, d);
  float centerDensity = smoothstep(0.9, 2.8, distFromCenter);
  float alpha = edgeAlpha * uOpacity * mix(0.45, 1.0, centerDensity);

  /* ── IGNITION: particles near the cursor catch fire with a mint→gold gradient ── */
  float hd = length(vPosition - uHoverPos);
  float ign = smoothstep(1.7, 0.12, hd) * uHoverStrength;
  vec3 accent = mix(uAccentB, uAccentA, rand01);
  float flicker = 0.8 + 0.35 * sin(uTime * 7.0 + rand01 * 25.0 + hd * 4.0);
  color += accent * ign * flicker * 1.5;
  alpha = max(alpha, edgeAlpha * ign * 0.95);

  /* ── SHOCKWAVE: expanding luminous ring after a click ── */
  if(uWaveT >= 0.0){
    float wr = uWaveT * 3.4;
    float wd = length(vPosition - uWavePos);
    float ring = exp(-pow((wd - wr) * 2.4, 2.0));
    float decay = exp(-uWaveT * 1.5);
    color += mix(uAccentB, uAccentA, 0.35) * ring * decay * 2.2;
    alpha = max(alpha, edgeAlpha * ring * decay * 0.85);
  }

  gl_FragColor = vec4(color, alpha);
}`;

const ipGeo = new THREE.PlaneGeometry(1, 1);
const ipLifeAttr  = new THREE.InstancedBufferAttribute(new Float32Array(INNER_COUNT), 1);
ipGeo.setAttribute('aLife',  ipLifeAttr);
ipGeo.setAttribute('aScale', new THREE.InstancedBufferAttribute(ipScale, 1));
ipGeo.setAttribute('aRandX', new THREE.InstancedBufferAttribute(ipRandX, 1));
ipGeo.setAttribute('aRandY', new THREE.InstancedBufferAttribute(ipRandY, 1));
ipGeo.setAttribute('aRandZ', new THREE.InstancedBufferAttribute(ipRandZ, 1));

const ipMat = new THREE.ShaderMaterial({
  vertexShader: ipVS,
  fragmentShader: ipFS,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uParticleSize:          { value: 0.19 },
    uScaleRange:            { value: new THREE.Vector2(0.45, 1.05) },
    uOpacity:               { value: 0.86 },
    uTime:                  { value: 0 },
    uPulseColor:            { value: new THREE.Color(0x47d18f) },
    uPulseStrength:         { value: reducedMotion ? 0.06 : 0.2 },
    uAmbientColor1:         { value: new THREE.Color(0x101010) },
    uAmbientColor2:         { value: new THREE.Color(0x2a2a2a) },
    uBaseColor:             { value: new THREE.Color(0xbfc5c9) },
    uBaseColor2:            { value: new THREE.Color(0xf2f6fa) },
    uEdgeColor1:            { value: new THREE.Color(0xdce2e8) },
    uEdgeColorStop:         { value: new THREE.Vector2(1.92, 2.88) },
    uBloomColor1:           { value: new THREE.Color(0xcfd6dc) },
    uRandomHighlightColor:  { value: new THREE.Vector3(0.8, 0.8, 0.8) },
    uRandomHighlightSelect: { value: 0.985 },
    uLightPosition:         { value: new THREE.Vector3(4.2, 5.79, 6.0) },
    uLightColor:            { value: new THREE.Color(0xf5f7fa) },
    uLightIntensity:        { value: 0.72 },
    /* signature interaction uniforms */
    uHoverPos:              { value: new THREE.Vector3(99, 99, 99) },
    uHoverStrength:         { value: 0 },
    uAccentA:               { value: new THREE.Color(0xffc86b) },  // warm gold
    uAccentB:               { value: new THREE.Color(0x5cf5c0) },  // electric mint
    uWaveT:                 { value: -1 },
    uWavePos:               { value: new THREE.Vector3(0, 0, 0) },
  }
});

const innerParticles = new THREE.InstancedMesh(ipGeo, ipMat, INNER_COUNT);
innerParticles.frustumCulled = false;
innerParticles.renderOrder = 10;
scene.add(innerParticles);

const ipDummy = new THREE.Object3D();
for(let i = 0; i < INNER_COUNT; i++){
  ipDummy.position.set(0, 0, 0);
  ipDummy.updateMatrix();
  innerParticles.setMatrixAt(i, ipDummy.matrix);
}
innerParticles.instanceMatrix.needsUpdate = true;

/* ─── Flare Particles ─── */
const COUNT = 3000;
const ORB_R = 4.05;
const RADIAL_RANGE = 2.4;

function sampleEdgeDir(){
  let nx, ny, nz, tries = 0;
  do {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi   = Math.random() * Math.PI * 2;
    nx = Math.sin(theta) * Math.cos(phi);
    ny = Math.sin(theta) * Math.sin(phi);
    nz = Math.cos(theta);
    tries++;
  } while (Math.abs(nz) > 0.12 && tries < 50);
  return [nx, ny, nz];
}

const pDirX  = new Float32Array(COUNT);
const pDirY  = new Float32Array(COUNT);
const pDirZ  = new Float32Array(COUNT);
const pLife  = new Float32Array(COUNT);
const pSpeed = new Float32Array(COUNT);
const pScale = new Float32Array(COUNT);
const pRandX = new Float32Array(COUNT);

for(let i = 0; i < COUNT; i++){
  const [nx, ny, nz] = sampleEdgeDir();
  pDirX[i] = nx; pDirY[i] = ny; pDirZ[i] = nz;
  pLife[i]  = Math.random();
  pSpeed[i] = 0.18 + Math.random() * 0.28;
  pScale[i] = 0.05 + Math.random() * Math.random() * 0.6;
  pRandX[i] = Math.random();
}

const pVS = `
uniform float uTime;
uniform float uParticleSize;
uniform vec2  uScaleRange;
attribute float aLife;
attribute float aScale;
attribute float aRandX;
varying float vLife;
varying float vRand;
varying vec2  vUv;

void main(){
  vUv   = uv;
  vLife = aLife;
  vRand = aRandX;

  vec3 right = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
  vec3 up    = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);
  vec3 iPos  = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

  float s = uParticleSize * aScale;
  s *= mix(uScaleRange.x, uScaleRange.y, aRandX);
  s *= smoothstep(0.0, 0.35, aLife);
  s *= 1.0 - smoothstep(0.75, 1.0, aLife);

  vec3 worldPos = iPos + right * position.x * s + up * position.y * s;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}`;

const pFS = `
varying float vLife;
varying float vRand;
varying vec2  vUv;
uniform vec3  uColor;
uniform vec3  uColorB;
uniform vec3  uBloomColor;
uniform float uOpacity;

void main(){
  float d = length(vUv - 0.5) * 2.0;
  if(d > 1.0) discard;
  float alpha = 1.0 - smoothstep(0.5, 1.0, d);
  // sparks vary between deep green and pale aqua-gold for richer flares
  vec3 c = mix(uColor, uColorB, vRand);
  gl_FragColor = vec4(c + uBloomColor, alpha * uOpacity);
}`;

const pGeo = new THREE.PlaneGeometry(1, 1);
const lifeAttr  = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
pGeo.setAttribute('aLife',  lifeAttr);
pGeo.setAttribute('aScale', new THREE.InstancedBufferAttribute(pScale, 1));
pGeo.setAttribute('aRandX', new THREE.InstancedBufferAttribute(pRandX, 1));

const pMat = new THREE.ShaderMaterial({
  vertexShader: pVS,
  fragmentShader: pFS,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime:         { value: 0 },
    uParticleSize: { value: 0.15 },
    uScaleRange:   { value: new THREE.Vector2(0.2, 0.6) },
    uOpacity:      { value: 0.62 },
    uColor:        { value: new THREE.Color(0.10, 0.68, 0.36) },
    uColorB:       { value: new THREE.Color(0.45, 0.85, 0.62) },
    uBloomColor:   { value: new THREE.Color(0.18, 0.62, 0.46) }
  }
});

const particles = new THREE.InstancedMesh(pGeo, pMat, COUNT);
particles.frustumCulled = false;
scene.add(particles);

const dummy = new THREE.Object3D();
function radiusForLife(life){
  const ease = 1 - Math.pow(1 - life, 2);
  return ORB_R + ease * RADIAL_RANGE;
}
for(let i = 0; i < COUNT; i++){
  const r = radiusForLife(pLife[i]);
  dummy.position.set(pDirX[i] * r, pDirY[i] * r, pDirZ[i] * r);
  dummy.updateMatrix();
  particles.setMatrixAt(i, dummy.matrix);
}
particles.instanceMatrix.needsUpdate = true;

/* ─── Animate ─── */
resize();
const start = performance.now();
let animationFrame = 0;

function animate(){
  animationFrame = requestAnimationFrame(animate);
  const t = (performance.now()-start)/1000;
  const dt = 0.016;

  bgMat.uniforms.uTime.value  = t;
  orbMat.uniforms.uTime.value = t;
  ipMat.uniforms.uTime.value  = t;
  pMat.uniforms.uTime.value   = t;

  /* subtle camera parallax toward the cursor for depth */
  if(!reducedMotion && pointerInside){
    camera.position.x += (pointerNDC.x * 0.55 - camera.position.x) * 0.03;
    camera.position.y += (pointerNDC.y * 0.4  - camera.position.y) * 0.03;
  } else {
    camera.position.x += (0 - camera.position.x) * 0.02;
    camera.position.y += (0 - camera.position.y) * 0.02;
  }
  updateCameraLookTarget();

  /* shockwave clock */
  if(waveT >= 0){
    waveT += dt;
    if(waveT > 2.6) waveT = -1;
  }
  ipMat.uniforms.uWaveT.value = waveT;
  ipMat.uniforms.uWavePos.value.copy(wavePos);

  let isHovering = false;
  if(pointerInside){
    hoverRaycaster.setFromCamera(pointerNDC, camera);
    if(hoverRaycaster.ray.intersectSphere(hoverSphere, hoverHit)){
      isHovering = true;
      hoverTarget.copy(hoverHit);
      const ro = hoverRaycaster.ray.origin;
      const rd = hoverRaycaster.ray.direction;
      hoverToCenter.copy(ro);
      const b = hoverToCenter.dot(rd);
      const c = hoverToCenter.lengthSq() - hoverSphere.radius * hoverSphere.radius;
      const h = b * b - c;
      if(h >= 0){
        const s = Math.sqrt(h);
        hoverNear = -b - s;
        hoverFar = -b + s;
        hasHoverTube = hoverFar > 0;
      } else { hasHoverTube = false; }
    } else { hasHoverTube = false; }
  } else { hasHoverTube = false; }

  root.classList.toggle('hovering', isHovering);

  pointerMoveBoost *= 0.9;
  pointerVelX *= 0.92;
  pointerVelY *= 0.92;
  const motionGate = Math.min(1, 0.35 + pointerMoveBoost * 1.8); // stays alive even when still
  const targetHover = (isHovering && !reducedMotion) ? motionGate : 0.0;
  const easeK = isHovering ? 0.14 : 0.22;
  hoverStrength += (targetHover - hoverStrength) * easeK;
  hoverWorld.lerp(hoverTarget, 0.16);

  ipMat.uniforms.uHoverPos.value.copy(isHovering || hoverStrength > 0.01 ? hoverWorld : new THREE.Vector3(99,99,99));
  ipMat.uniforms.uHoverStrength.value = hoverStrength;

  orb.rotation.y += 0.002;

  /* flare particles */
  const lifeArr = lifeAttr.array;
  for(let i = 0; i < COUNT; i++){
    pLife[i] += pSpeed[i] * dt;
    if(pLife[i] > 1.0){
      pLife[i] = 0.0;
      const [nx, ny, nz] = sampleEdgeDir();
      pDirX[i] = nx; pDirY[i] = ny; pDirZ[i] = nz;
    }
    lifeArr[i] = pLife[i];
    const r = radiusForLife(pLife[i]);
    dummy.position.set(pDirX[i] * r, pDirY[i] * r, pDirZ[i] * r);
    dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  }
  lifeAttr.needsUpdate = true;
  particles.instanceMatrix.needsUpdate = true;

  /* inner particles */
  const velMag = Math.min(1.2, Math.sqrt(pointerVelX * pointerVelX + pointerVelY * pointerVelY) * 1.8);
  const rdRay = hoverRaycaster.ray.direction;
  const roRay = hoverRaycaster.ray.origin;
  const waveActive = waveT >= 0 && waveT < 2.4;
  const waveR = waveT * 3.4;
  const waveDecay = waveActive ? Math.exp(-waveT * 1.5) : 0;

  const ipLifeArr = ipLifeAttr.array;
  for(let i = 0; i < INNER_COUNT; i++){
    ipLifeArr[i] = 0.72;
    const life = ipLife[i];
    const seed = ipRandX[i] * 6.28318;
    const seed2 = ipRandY[i] * 6.28318;
    const seed3 = ipRandZ[i] * 6.28318;
    const phase = t * (0.22 + ipSpeed[i] * 1.0) + life * 6.28318;
    const r = (0.3 + 0.68 * (0.5 + 0.5 * Math.sin(phase + seed3))) * 3.8;

    const dx = ipRandX[i], dy = ipRandY[i], dz = ipRandZ[i];
    const hxx = Math.abs(dz) < 0.92 ? 0.0 : 1.0;
    const hzz = Math.abs(dz) < 0.92 ? 1.0 : 0.0;
    let px = dy * hzz;
    let py = dz * hxx - dx * hzz;
    let pz = -dy * hxx;
    const plen = Math.sqrt(px*px + py*py + pz*pz) || 1.0;
    px /= plen; py /= plen; pz /= plen;
    let qx = dy * pz - dz * py;
    let qy = dz * px - dx * pz;
    let qz = dx * py - dy * px;
    const qlen = Math.sqrt(qx*qx + qy*qy + qz*qz) || 1.0;
    qx /= qlen; qy /= qlen; qz /= qlen;

    const orbitR = (0.34 + 0.24 * Math.sin(phase + seed2)) * (0.85 + Math.abs(ipRandZ[i]) * 0.55);
    const angle = phase * (2.1 + ipRandX[i] * 1.1) + seed;
    const angle2 = phase * (1.7 + ipRandY[i] * 1.0) + seed3;
    const swirlA = phase * (1.05 + ipRandZ[i] * 0.6) + seed2;
    const swirlB = phase * (0.82 + ipRandX[i] * 0.5) + seed3;
    const ox = px * Math.cos(angle) + qx * Math.sin(angle);
    const oy = py * Math.cos(angle) + qy * Math.sin(angle);
    const oz = pz * Math.cos(angle) + qz * Math.sin(angle);
    const w = (Math.sin(phase + seed2) + Math.cos(angle2)) * 0.2;
    const bx = Math.cos(swirlA) * Math.sin(swirlB);
    const by = Math.sin(swirlA) * Math.sin(swirlB);
    const bz = Math.cos(swirlB);
    let x = bx * r + ox * orbitR + w * px;
    let y = by * r + oy * orbitR + w * py;
    let z = bz * r + oz * orbitR + w * pz;

    /* ── SIGNATURE: cursor stirs a vortex ring — particles are swept into
       a rotating whirlpool around the pointer instead of just fleeing it ── */
    if(hoverStrength > 0.001 && hasHoverTube){
      const vx = x - roRay.x, vy = y - roRay.y, vz = z - roRay.z;
      const tLine = vx * rdRay.x + vy * rdRay.y + vz * rdRay.z;
      if(tLine > hoverNear && tLine < hoverFar){
        const cx = roRay.x + rdRay.x * tLine;
        const cy = roRay.y + rdRay.y * tLine;
        const cz = roRay.z + rdRay.z * tLine;
        let hx = x - cx, hy = y - cy, hz = z - cz;
        const d2 = hx*hx + hy*hy + hz*hz;
        const captureR = 1.7;
        if(d2 < captureR * captureR){
          const d = Math.sqrt(d2) + 1e-5;
          const nx = hx / d, ny = hy / d, nz = hz / d;
          // pull toward a ring around the cursor (whirlpool wall)
          const ringR = 0.62 + 0.1 * Math.sin(seed2 + phase * 0.6);
          const k = (1.0 - d / captureR) * hoverStrength * (0.4 + 0.5 * velMag);
          const tx = cx + nx * ringR;
          const ty = cy + ny * ringR;
          const tz = cz + nz * ringR;
          x += (tx - x) * k;
          y += (ty - y) * k;
          z += (tz - z) * k;
          // spin tangentially around the cursor ray → visible rotation
          let sx = rdRay.y * nz - rdRay.z * ny;
          let sy = rdRay.z * nx - rdRay.x * nz;
          let sz = rdRay.x * ny - rdRay.y * nx;
          const spin = k * (0.55 + 0.5 * Math.sin(t * 3.0 + seed)) * 0.9;
          x += sx * spin;
          y += sy * spin;
          z += sz * spin;
          // shimmer along the ray depth for that traveling energy feel
          const shock = (0.5 + 0.5 * Math.sin(t * 12.0 - tLine * 3.7 + seed * 2.3)) * k * 0.25;
          x += px * shock; y += py * shock; z += pz * shock;
        }
      }
    }

    /* click shockwave physically pushes particles in an expanding shell */
    if(waveActive){
      const wx = x - wavePos.x, wy = y - wavePos.y, wz = z - wavePos.z;
      const wd = Math.sqrt(wx*wx + wy*wy + wz*wz) + 1e-5;
      const band = Math.exp(-((wd - waveR) * (wd - waveR)) * 3.2);
      const push = band * waveDecay * 0.55;
      x += (wx / wd) * push;
      y += (wy / wd) * push;
      z += (wz / wd) * push;
    }

    const maxR = 3.85;
    const len = Math.sqrt(x*x + y*y + z*z);
    if(len > maxR){
      const s = maxR / len;
      x *= s; y *= s; z *= s;
    }
    ipDummy.position.set(x, y, z);
    ipDummy.updateMatrix();
    innerParticles.setMatrixAt(i, ipDummy.matrix);
  }
  ipLifeAttr.needsUpdate = true;
  innerParticles.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

return {
  ignite(x = 0.5, y = 0.5) {
    const rect = canvas.getBoundingClientRect();
    handlePointerDown({
      clientX: rect.left + rect.width * x,
      clientY: rect.top + rect.height * y,
    } as PointerEvent);
  },
  destroy() {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerleave', handlePointerLeave);
    window.removeEventListener('pointerdown', handlePointerDown);
    root.classList.remove('hovering');
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else if (object.material) {
        object.material.dispose();
      }
    });
    renderer.dispose();
  },
};
}
