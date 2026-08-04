import type * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type TargetParticleSource = {
  positions: Float32Array;
  colors: Float32Array;
  type: 'image' | 'model' | 'shape';
};

export type SceneData = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  originalPositions: Float32Array;
  targetPositions: Float32Array;
  originalColors: Float32Array;
  targetColors: Float32Array;
  controls: OrbitControls;
};
