/**
 * WebGL ripple transition — adapted from m1ckc3s/ripple (MIT).
 * https://github.com/m1ckc3s/ripple · https://ripple-gl.vercel.app/
 * Inspired by Minsang (@radiofun8).
 */
import gsap from "gsap";

export type RippleParams = {
  waveSpeed: number;
  sigma: number;
  waveFreq: number;
  pushAmt: number;
  caStrength: number;
  glow: number;
  noiseWarp: number;
  duration: number;
  ease: string;
  pinch: boolean;
};

export const PROJECT_RIPPLE_PARAMS: RippleParams = {
  waveSpeed: 1.55,
  sigma: 0.18,
  waveFreq: 4,
  pushAmt: 0.26,
  caStrength: 0.038,
  glow: 0.78,
  noiseWarp: 1.35,
  duration: 1.35,
  ease: "power2.inOut",
  pinch: true,
};

export type RippleStageHandle = {
  trigger: (cx?: number, cy?: number) => void;
  scrub: (progress: number) => void;
  destroy: () => void;
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform vec2 u_resolution;
uniform vec2 u_texAAspect;
uniform vec2 u_texBAspect;
uniform vec2 u_center;
uniform float u_progress;
uniform float u_waveSpeed;
uniform float u_sigma;
uniform float u_waveFreq;
uniform float u_pushAmt;
uniform float u_caStrength;
uniform float u_glow;
uniform float u_noiseWarp;
uniform float u_swap;
uniform float u_pinch;

varying vec2 v_uv;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    val += amp * vnoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

vec2 coverUv(vec2 uv, float texAspect, float viewAspect) {
  vec2 r = uv - 0.5;
  if (texAspect > viewAspect) {
    r.x *= viewAspect / texAspect;
  } else {
    r.y *= texAspect / viewAspect;
  }
  return r + 0.5;
}

void main() {
  vec2 uv = v_uv;
  vec2 size = u_resolution;
  vec2 center = u_center;
  float viewAspect = size.x / size.y;

  vec2 p = uv - center;
  float aspect = viewAspect;
  p.x *= aspect;

  float dist = length(p);
  float maxDist = length(vec2(0.5 * aspect, 0.5));
  float normDist = clamp(dist / maxDist, 0.0, 1.0);

  float noiseLarge = fbm(p * 4.0 + vec2(u_progress * 1.0, u_progress * 0.5), 4);
  float noiseSmall = fbm(p * 12.0 + vec2(u_progress * 2.0, -u_progress * 1.5), 3);

  float waveFront = u_progress * u_waveSpeed;
  float warpScale = smoothstep(0.0, 0.05, u_progress);
  float warpedDist = normDist
    + (noiseLarge - 0.5) * u_noiseWarp * warpScale
    + (noiseSmall - 0.5) * (u_noiseWarp * 0.9) * warpScale;

  float delta = warpedDist - waveFront;
  float baseEnvelope = exp(-delta * delta / (2.0 * u_sigma * u_sigma));
  float ripples = max(0.0, cos(delta * u_waveFreq));
  float envelope = baseEnvelope * ripples;

  float gate = smoothstep(0.0, 0.05, u_progress)
    * (1.0 - smoothstep(0.85, 1.0, u_progress));
  envelope *= gate;

  vec2 dir = (dist > 0.001) ? normalize(p) : vec2(0.0);
  float pushAmt = envelope * u_pushAmt;

  float pinchSigma = 0.10;
  float pinchG = exp(-dist * dist / (2.0 * pinchSigma * pinchSigma));
  float pinchDisp = (dist / (pinchSigma * pinchSigma)) * pinchG * 0.01 * u_pinch;

  vec2 toEdge = min(uv, 1.0 - uv);
  float edgeFade = smoothstep(0.0, 0.14, min(toEdge.x, toEdge.y));
  pinchDisp *= edgeFade;

  vec2 uvOffset = dir * (pushAmt - pinchDisp);
  uvOffset.x /= aspect;

  float caStrength = envelope * u_caStrength;
  vec2 caOffset = dir * caStrength;
  caOffset.x /= aspect;

  float texAAspect = u_texAAspect.x / max(u_texAAspect.y, 0.001);
  float texBAspect = u_texBAspect.x / max(u_texBAspect.y, 0.001);

  vec2 uvR = uv - uvOffset - caOffset;
  vec2 uvG = uv - uvOffset;
  vec2 uvB = uv - uvOffset + caOffset;

  vec4 colorA = vec4(
    texture2D(u_texA, coverUv(uvR, texAAspect, viewAspect)).r,
    texture2D(u_texA, coverUv(uvG, texAAspect, viewAspect)).g,
    texture2D(u_texA, coverUv(uvB, texAAspect, viewAspect)).b,
    1.0
  );
  vec4 colorB = vec4(
    texture2D(u_texB, coverUv(uvR, texBAspect, viewAspect)).r,
    texture2D(u_texB, coverUv(uvG, texBAspect, viewAspect)).g,
    texture2D(u_texB, coverUv(uvB, texBAspect, viewAspect)).b,
    1.0
  );

  float feather = 0.04 + 0.05 * noiseLarge;
  float reveal = smoothstep(waveFront + feather, waveFront - feather, warpedDist);
  reveal *= smoothstep(0.0, 0.05, u_progress);

  vec4 base = mix(colorA, colorB, u_swap);
  vec4 target = mix(colorB, colorA, u_swap);
  vec4 color = mix(base, target, reveal);

  float glow = envelope * u_glow;
  color.rgb = clamp(color.rgb / max(1.0 - glow, 0.01), 0.0, 1.0);
  color.rgb *= 1.0 - 0.16 * pinchG * edgeFade * u_pinch;
  color.rgb = clamp(color.rgb, 0.0, 1.0);

  gl_FragColor = vec4(color.rgb, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("Failed to create shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || "shader compile error";
    gl.deleteShader(sh);
    throw new Error(info);
  }
  return sh;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function uploadTexture(
  gl: WebGLRenderingContext,
  unit: number,
  img: HTMLImageElement,
) {
  const tex = gl.createTexture();
  if (!tex) throw new Error("Failed to create texture");
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function createProjectRippleStage(
  container: HTMLElement,
  options: {
    imageA: string;
    imageB: string;
    params?: RippleParams;
    onReady?: () => void;
  },
): RippleStageHandle | null {
  const canvas = document.createElement("canvas");
  canvas.className = "absolute inset-0 block h-full w-full touch-manipulation";
  canvas.setAttribute("role", "presentation");
  container.appendChild(canvas);

  const params = options.params ?? PROJECT_RIPPLE_PARAMS;
  const paramsRef = { current: params };
  let gl: WebGLRenderingContext | null = null;
  let cleanup: (() => void) | null = null;
  let render: (() => void) | null = null;
  let triggerFn: ((cx?: number, cy?: number) => void) | null = null;
  let scrubFn: ((progress: number) => void) | null = null;
  let destroyed = false;
  let uRes: WebGLUniformLocation | null = null;

  const resize = () => {
    if (!gl || !render) return;
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    render();
  };

  const setup = async () => {
    const [imgA, imgBraw] = await Promise.all([
      loadImage(options.imageA),
      loadImage(options.imageB),
    ]);
    if (destroyed || !imgA) return;

    const imgB = imgBraw ?? imgA;
    const context = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!context) return;
    gl = context;

    const vs = compileShader(gl, VERT, gl.VERTEX_SHADER);
    const fs = compileShader(gl, FRAG, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "program link error");
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texA = uploadTexture(gl, 0, imgA);
    const texB = uploadTexture(gl, 1, imgB);
    gl.uniform1i(gl.getUniformLocation(program, "u_texA"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_texB"), 1);

    uRes = gl.getUniformLocation(program, "u_resolution");
    const u = {
      res: uRes,
      texAAspect: gl.getUniformLocation(program, "u_texAAspect"),
      texBAspect: gl.getUniformLocation(program, "u_texBAspect"),
      center: gl.getUniformLocation(program, "u_center"),
      progress: gl.getUniformLocation(program, "u_progress"),
      waveSpeed: gl.getUniformLocation(program, "u_waveSpeed"),
      sigma: gl.getUniformLocation(program, "u_sigma"),
      waveFreq: gl.getUniformLocation(program, "u_waveFreq"),
      pushAmt: gl.getUniformLocation(program, "u_pushAmt"),
      caStrength: gl.getUniformLocation(program, "u_caStrength"),
      glow: gl.getUniformLocation(program, "u_glow"),
      noiseWarp: gl.getUniformLocation(program, "u_noiseWarp"),
      swap: gl.getUniformLocation(program, "u_swap"),
      pinch: gl.getUniformLocation(program, "u_pinch"),
    };

    gl.uniform2f(u.texAAspect, imgA.naturalWidth, imgA.naturalHeight);
    gl.uniform2f(u.texBAspect, imgB.naturalWidth, imgB.naturalHeight);

    const state = { progress: 0, cx: 0.5, cy: 0.5, swap: 0, pinch: 0 };
    let animating = false;

    const draw = () => {
      if (!gl) return;
      const p = paramsRef.current;
      gl.uniform2f(u.res!, canvas.width, canvas.height);
      gl.uniform2f(u.center!, state.cx, state.cy);
      gl.uniform1f(u.progress!, state.progress);
      gl.uniform1f(u.waveSpeed!, p.waveSpeed);
      gl.uniform1f(u.sigma!, p.sigma);
      gl.uniform1f(u.waveFreq!, p.waveFreq);
      gl.uniform1f(u.pushAmt!, p.pushAmt);
      gl.uniform1f(u.caStrength!, p.caStrength);
      gl.uniform1f(u.glow!, p.glow);
      gl.uniform1f(u.noiseWarp!, p.noiseWarp);
      gl.uniform1f(u.swap!, state.swap);
      gl.uniform1f(u.pinch!, state.pinch);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    render = draw;
    resize();

    const trigger = (cx?: number, cy?: number) => {
      if (animating) return;
      if (cx !== undefined) state.cx = cx;
      if (cy !== undefined) state.cy = cy;
      gsap.killTweensOf(state);
      state.progress = 0;
      state.pinch = 0;
      animating = true;

      if (paramsRef.current.pinch) {
        gsap.to(state, {
          keyframes: [
            { pinch: 1, duration: 0.1, ease: "power3.out" },
            { pinch: 0, duration: 0.4, ease: "power2.in" },
          ],
          onUpdate: draw,
        });
      }

      gsap.to(state, {
        progress: 1,
        duration: paramsRef.current.duration,
        ease: paramsRef.current.ease,
        onUpdate: draw,
        onComplete: () => {
          state.swap = state.swap > 0.5 ? 0 : 1;
          state.progress = 0;
          animating = false;
          draw();
        },
      });
    };

    const scrub = (progress: number) => {
      gsap.killTweensOf(state);
      animating = false;
      state.pinch = 0;
      state.progress = progress;
      draw();
    };

    triggerFn = trigger;
    scrubFn = scrub;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const r = canvas.getBoundingClientRect();
      trigger(
        (e.clientX - r.left) / r.width,
        (e.clientY - r.top) / r.height,
      );
    };
    canvas.addEventListener("pointerdown", onPointerDown);

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    options.onReady?.();

    cleanup = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      ro.disconnect();
      gsap.killTweensOf(state);
      gl?.deleteTexture(texA);
      gl?.deleteTexture(texB);
      gl?.deleteBuffer(buf);
      gl?.deleteProgram(program);
      gl?.deleteShader(vs);
      gl?.deleteShader(fs);
      render = null;
      triggerFn = null;
      scrubFn = null;
    };
  };

  void setup();

  return {
    trigger: (cx, cy) => triggerFn?.(cx, cy),
    scrub: (p) => scrubFn?.(p),
    destroy: () => {
      destroyed = true;
      cleanup?.();
      canvas.remove();
    },
  };
}

export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") ?? c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}
