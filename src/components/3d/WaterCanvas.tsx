'use client';

import { useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Max simultaneous click ripples tracked in the shader
const MAX_CLICK_RIPPLES = 8;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

// Click ripple data: xy = UV origin, z = birth time, w = unused
uniform vec4 uClickRipples[${MAX_CLICK_RIPPLES}];

varying vec2 vUv;

const float CLICK_DURATION   = 1.8;  // seconds before a click ripple disappears
const float CLICK_SPEED      = 0.7;  // how fast the ring expands outward
const float CLICK_FREQ       = 55.0; // ring tightness
const float CLICK_AMPLITUDE  = 0.045;
const float HOVER_AMPLITUDE  = 0.032;

void main() {
  // ─── 1. Cover-fit UVs (object-fit: cover, anchored center-right) ───────────
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  vec2 uvCover = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 1.0,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  float aspect = uResolution.x / uResolution.y;

  // ─── 2. Hover / continuous ripple ──────────────────────────────────────────
  vec2 hoverDelta = vUv - uMouse;
  hoverDelta.x *= aspect;
  float hoverDist  = length(hoverDelta);
  float hoverWave  = sin(hoverDist * 40.0 - uTime * 5.0);
  float hoverFade  = smoothstep(0.3, 0.0, hoverDist);
  vec2  displacement = hoverDelta * hoverWave * hoverFade * HOVER_AMPLITUDE;

  // ─── 3. Click ripples – expanding ring per registered click ────────────────
  for (int i = 0; i < ${MAX_CLICK_RIPPLES}; i++) {
    vec4  ripple   = uClickRipples[i];
    float birthTime = ripple.z;

    // Skip uninitialised slots (birth time == 0.0 means slot empty)
    if (birthTime <= 0.0) continue;

    float elapsed = uTime - birthTime;
    // Skip if the ripple has fully decayed
    if (elapsed < 0.0 || elapsed > CLICK_DURATION) continue;

    vec2  clickDelta = vUv - ripple.xy;
    clickDelta.x *= aspect;
    float clickDist  = length(clickDelta);

    // Expanding wavefront radius
    float radius  = elapsed * CLICK_SPEED;

    // Ring: sharp peak at the wavefront, falls off on both sides
    float ring    = exp(-pow((clickDist - radius) * CLICK_FREQ, 2.0));

    // Fade out with time and at very short distances (avoid singularity at origin)
    float timeFade  = 1.0 - (elapsed / CLICK_DURATION);
    timeFade = timeFade * timeFade; // ease-out
    float distFade  = smoothstep(0.0, 0.02, clickDist);

    float strength  = ring * timeFade * distFade;

    // Radial displacement direction
    vec2 dir = (clickDist > 0.0001)
      ? clickDelta / clickDist
      : vec2(0.0);

    displacement += dir * strength * CLICK_AMPLITUDE;
  }

  // ─── 4. Sample the image with accumulated displacement ─────────────────────
  vec2 displacedUv = uvCover + displacement;
  gl_FragColor = texture2D(uTexture, displacedUv);
}
`;

// Internal click ripple record (JS side)
interface ClickRipple {
  x: number; // UV 0-1
  y: number;
  birthTime: number; // clock.elapsedTime at click
}

function WaterPlane({ imageUrl }: { imageUrl: string }) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const clockRef  = useRef(0); // mirrors state.clock.elapsedTime

  // Ring buffer of active click ripples
  const clickRipples = useRef<ClickRipple[]>([]);

  const texture = useTexture(imageUrl);
  const { viewport, size } = useThree();

  // Initialise uniforms once
  const uniforms = useMemo(() => {
    // Build the flat vec4 array that the shader expects
    const clickData = new Array<THREE.Vector4>(MAX_CLICK_RIPPLES)
      .fill(null as unknown as THREE.Vector4)
      .map(() => new THREE.Vector4(0, 0, 0, 0));

    return {
      uTexture:        { value: texture },
      uMouse:          { value: new THREE.Vector2(0.5, 0.5) },
      uTime:           { value: 0 },
      uResolution:     { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution:{ value: new THREE.Vector2((texture.image as any).width, (texture.image as any).height) },
      uClickRipples:   { value: clickData },
    };
  }, [texture, size.width, size.height]);

  // Called from the Canvas onClick handler below
  const handleClick = useCallback((e: { pointer: THREE.Vector2 }) => {
    // R3F pointer is in NDC (-1..1); convert to UV (0..1), flip Y
    const uvX = e.pointer.x * 0.5 + 0.5;
    const uvY = e.pointer.y * 0.5 + 0.5;

    const newRipple: ClickRipple = { x: uvX, y: uvY, birthTime: clockRef.current };

    // Keep only last MAX_CLICK_RIPPLES entries
    clickRipples.current = [
      ...clickRipples.current.slice(-(MAX_CLICK_RIPPLES - 1)),
      newRipple,
    ];
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    clockRef.current = t;

    // Update time uniform
    materialRef.current.uniforms.uTime.value = t;

    // Smooth mouse lerp
    const targetX = state.pointer.x * 0.5 + 0.5;
    const targetY = state.pointer.y * 0.5 + 0.5;
    materialRef.current.uniforms.uMouse.value.x +=
      (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.08;
    materialRef.current.uniforms.uMouse.value.y +=
      (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.08;

    // Upload click ripple data to shader
    const slots = materialRef.current.uniforms.uClickRipples.value as THREE.Vector4[];
    const DURATION = 1.8;

    // Prune dead ripples
    clickRipples.current = clickRipples.current.filter(
      (r) => t - r.birthTime <= DURATION
    );

    for (let i = 0; i < MAX_CLICK_RIPPLES; i++) {
      const r = clickRipples.current[i];
      if (r) {
        slots[i].set(r.x, r.y, r.birthTime, 0);
      } else {
        slots[i].set(0, 0, 0, 0); // empty slot
      }
    }
  });

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function WaterCanvas({ imageUrl }: { imageUrl: string }) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 1] }}
    >
      <Suspense fallback={null}>
        <WaterPlane imageUrl={imageUrl} />
      </Suspense>
    </Canvas>
  );
}
