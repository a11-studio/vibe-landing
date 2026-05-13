import{r as o,j as c}from"./vendor-react-B-ueB1ye.js";import{C as L,S as C,N as W,u as z,a as R,b as B,L as G,c as N,d as U,V as A,P as V,e as D}from"./vendor-three-BTG0Lxxp.js";const _=`
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
`,k=`
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 c = texture2D(uTexture, vUv);
  if (c.a < 0.01) discard;
  gl_FragColor = c;
}
`;function q(){if(typeof document>"u")return!1;try{const r=document.createElement("canvas");return!!(r.getContext("webgl2")??r.getContext("webgl"))}catch{return!1}}function H({url:r,controlRef:h}){var s,S;const p=o.useRef(null),y=o.useRef({x:.5,y:.5}),a=o.useRef(0),e=z(r),g=R(t=>t.gl),m=R(t=>t.camera),f=R(t=>t.size);o.useEffect(()=>{e.colorSpace=C,e.wrapS=e.wrapT=B,e.minFilter=G,e.magFilter=N,e.anisotropy=Math.min(8,g.capabilities.getMaxAnisotropy()),e.needsUpdate=!0},[e,g]);const x=(s=e.image)!=null&&s.width&&((S=e.image)!=null&&S.height)?e.image.width/e.image.height:1,u=o.useMemo(()=>new U({uniforms:{uTexture:{value:e},uMouse:{value:new A(.5,.5)},uBulge:{value:.11},uRadius:{value:.34},uStrength:{value:0}},vertexShader:_,fragmentShader:k,transparent:!0,depthWrite:!1}),[e]);return o.useEffect(()=>()=>{u.dispose()},[u]),o.useLayoutEffect(()=>{const t=p.current;if(!t||!(m instanceof V))return;const l=Math.abs(m.position.z),n=m.fov*Math.PI/180,d=2*Math.tan(n/2)*l,i=d*(f.width/Math.max(f.height,1)),v=x,M=1,w=Math.min(i/v,d/M)*.92;t.scale.set(v*w,M*w,1)},[x,m,f.height,f.width]),D((t,l)=>{const n=p.current,d=n==null?void 0:n.material;if(!n||!d)return;const i=y.current,v=h.current.mouse,M=h.current.hover,w=1-Math.exp(-12*l),E=1-Math.exp(-10*l);i.x+=(v.x-i.x)*w,i.y+=(v.y-i.y)*E,d.uniforms.uMouse.value.set(i.x,i.y);const P=a.current;a.current+=(M-P)*(1-Math.exp(-14*l));const b=a.current;d.uniforms.uStrength.value=b;const T=(i.x-.5)*2,F=(i.y-.5)*2,j=1-Math.exp(-5*l);n.rotation.x+=(-F*.055*b-n.rotation.x)*j,n.rotation.y+=(T*.055*b-n.rotation.y)*j}),c.jsx("mesh",{ref:p,material:u,children:c.jsx("planeGeometry",{args:[1,1,96,96]})})}function I({url:r,controlRef:h}){return c.jsx(H,{url:r,controlRef:h})}function K({src:r,alt:h,className:p,reducedMotion:y}){const a=o.useRef({mouse:{x:.5,y:.5},hover:0}),[e,g]=o.useState(!0);o.useEffect(()=>{g(q())},[]);const m=s=>{a.current.hover=1;const t=s.currentTarget.getBoundingClientRect();if(t.width<=0||t.height<=0)return;const l=(s.clientX-t.left)/t.width,n=1-(s.clientY-t.top)/t.height;a.current.mouse={x:Math.min(1,Math.max(0,l)),y:Math.min(1,Math.max(0,n))}},f=()=>{a.current.hover=1},x=()=>{a.current.hover=0,a.current.mouse={x:.5,y:.5}},u=y||!e;return c.jsx("div",{className:p,onPointerEnter:u?void 0:f,onPointerMove:u?void 0:m,onPointerLeave:u?void 0:x,onPointerDown:u?void 0:m,role:"img","aria-label":h,children:u?c.jsx("img",{src:r,alt:h,className:"h-full w-full object-contain"}):c.jsx(o.Suspense,{fallback:c.jsx("img",{src:r,alt:"",className:"h-full w-full object-contain","aria-hidden":!0}),children:c.jsx(L,{className:"!h-full !w-full touch-none",style:{touchAction:"none"},camera:{position:[0,0,3.6],fov:38,near:.1,far:20},dpr:[1,Math.min(2,typeof window<"u"?window.devicePixelRatio:1)],gl:{alpha:!0,antialias:!0,powerPreference:"high-performance"},onCreated:({gl:s})=>{s.setClearColor(0,0),s.outputColorSpace=C,s.toneMapping=W},children:c.jsx(I,{url:r,controlRef:a})})})})}export{K as ApproachWebGLImage};
