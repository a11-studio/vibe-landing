import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const VERT = /* glsl */ `
uniform vec2 uMouse;
uniform float uBulge;
uniform float uRadius;
uniform float uStrength;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 delta = uv - uMouse;
  float distSq = dot(delta, delta);
  float r = uRadius * uRadius;
  float w = exp(-distSq / max(r, 1e-6));
  float dlen = length(delta);
  vec2 dir = dlen > 1e-5 ? delta / dlen : vec2(0.0);
  float bulge = uBulge * w * uStrength;
  pos.xy += dir * bulge * 0.45;
  pos.z += bulge * 0.22;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 c = texture2D(uTexture, vUv);
  if (c.a < 0.01) discard;
  gl_FragColor = c;
}
`;

type MouseTarget = { x: number; y: number };

type ApproachPointerControl = {
  mouse: MouseTarget;
  /** Cieľ intenzity efektu: 1 = nad obrázkom, 0 = mimo */
  hover: number;
};

function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

function MagneticMesh({
  url,
  controlRef,
}: {
  url: string;
  controlRef: MutableRefObject<ApproachPointerControl>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothRef = useRef<MouseTarget>({ x: 0.5, y: 0.5 });
  const strengthSmoothRef = useRef(0);
  const texture = useTexture(url);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [texture, gl]);

  const aspect =
    texture.image?.width && texture.image?.height
      ? texture.image.width / texture.image.height
      : 1;

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uBulge: { value: 0.11 },
        uRadius: { value: 0.34 },
        uStrength: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });
  }, [texture]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !(camera instanceof THREE.PerspectiveCamera)) return;
    const z = Math.abs(camera.position.z);
    const vFov = (camera.fov * Math.PI) / 180;
    const viewH = 2 * Math.tan(vFov / 2) * z;
    const viewW = viewH * (size.width / Math.max(size.height, 1));
    const planeW = aspect;
    const planeH = 1;
    const sFit = Math.min(viewW / planeW, viewH / planeH) * 0.92;
    mesh.scale.set(planeW * sFit, planeH * sFit, 1);
  }, [aspect, camera, size.height, size.width]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const mat = mesh?.material as THREE.ShaderMaterial | undefined;
    if (!mesh || !mat) return;
    const s = smoothRef.current;
    const t = controlRef.current.mouse;
    const hoverTarget = controlRef.current.hover;
    const damp = 1 - Math.exp(-12 * delta);
    const nd = 1 - Math.exp(-10 * delta);
    s.x += (t.x - s.x) * damp;
    s.y += (t.y - s.y) * nd;
    const uMouse = mat.uniforms.uMouse.value as THREE.Vector2;
    uMouse.set(s.x, s.y);

    const strSmooth = strengthSmoothRef.current;
    strengthSmoothRef.current += (hoverTarget - strSmooth) * (1 - Math.exp(-14 * delta));
    const str = strengthSmoothRef.current;
    mat.uniforms.uStrength.value = str;

    const dx = (s.x - 0.5) * 2;
    const dy = (s.y - 0.5) * 2;
    const tilt = 1 - Math.exp(-5 * delta);
    mesh.rotation.x += (-dy * 0.055 * str - mesh.rotation.x) * tilt;
    mesh.rotation.y += (dx * 0.055 * str - mesh.rotation.y) * tilt;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[1, 1, 96, 96]} />
    </mesh>
  );
}

function Scene({
  url,
  controlRef,
}: {
  url: string;
  controlRef: MutableRefObject<ApproachPointerControl>;
}) {
  return <MagneticMesh url={url} controlRef={controlRef} />;
}

export function ApproachWebGLImage({
  src,
  alt,
  className,
  reducedMotion,
}: {
  src: string;
  alt: string;
  className?: string;
  reducedMotion: boolean;
}) {
  const controlRef = useRef<ApproachPointerControl>({
    mouse: { x: 0.5, y: 0.5 },
    hover: 0,
  });
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  const setPointer = (e: PointerEvent<HTMLDivElement>) => {
    controlRef.current.hover = 1;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    controlRef.current.mouse = {
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    };
  };

  const onEnter = () => {
    controlRef.current.hover = 1;
  };

  const onLeave = () => {
    controlRef.current.hover = 0;
    controlRef.current.mouse = { x: 0.5, y: 0.5 };
  };

  const useFallback = reducedMotion || !webgl;

  return (
    <div
      className={className}
      onPointerEnter={useFallback ? undefined : onEnter}
      onPointerMove={useFallback ? undefined : setPointer}
      onPointerLeave={useFallback ? undefined : onLeave}
      onPointerDown={useFallback ? undefined : setPointer}
      role="img"
      aria-label={alt}
    >
      {useFallback ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <Suspense
          fallback={<img src={src} alt="" className="h-full w-full object-contain" aria-hidden />}
        >
          <Canvas
            className="!h-full !w-full touch-none"
            style={{ touchAction: "none" }}
            camera={{ position: [0, 0, 3.6], fov: 38, near: 0.1, far: 20 }}
            dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1)]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.NoToneMapping;
            }}
          >
            <Scene url={src} controlRef={controlRef} />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
