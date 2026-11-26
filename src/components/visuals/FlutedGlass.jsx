import { useEffect, useRef } from 'react'

/* The Fluted Glass Lab animation, ported as it stands (feedback: use this
   animation, with these dial values, for the hero's ground): a blurred blue
   ribbon, coloured from testi-glass-bg.webp, sweeping and turning behind fixed
   reeded-glass ribs. The shader is the lab's own, unchanged; only the wrapper
   is new.

   flutes      ribs across the width
   refraction  how wide a slice each rib squeezes in
   warp        how much the ribbon folds and breathes as it moves
   speed       time multiplier on the drift
   edge        thin highlight on each rib
   shade       shadow on the far side of each rib
   clear       hides the ribs over the clean ground, so lines only show where
               colour drifts through
   blur        how blurred the ribbon is
   softness    how much neighbouring ribs melt into each other
   fluid       how liquid the folding feels
   sweep       how far the ribbon travels left to right
   turn        how much the ribbon rotates as it travels
   blue        how deep the navy core gets
   white       clears the faint blue wash to clean ground
   lighten     behind the copy the ribbon keeps full opacity but uses lighter
               blues, 1 = fully light palette, 0 = normal navy (feedback: the
               navy core merged with the text as it swept left). The copy's
               right edge is measured from the page, so it follows any width.
   fade        how quickly (share of width) full colour returns past the copy */
export const FLUTED_HERO = {
  flutes: 110,
  refraction: 0.5,
  warp: 0.12,
  speed: 1,
  edge: 0.08,
  shade: 0.09,
  clear: 1,
  blur: 1,
  softness: 0.35,
  fluid: 0.7,
  sweep: 0.7,
  turn: 0.6,
  blue: 0.6,
  white: 0.5,
  lighten: 1,
  fade: 0.12,
}

/* setting → uniform */
const UNIFORMS = {
  flutes: 'uFlutes',
  refraction: 'uRefract',
  warp: 'uWarp',
  edge: 'uEdge',
  shade: 'uShade',
  blur: 'uBlur',
  softness: 'uSoft',
  fluid: 'uFluid',
  blue: 'uBlue',
  white: 'uWhite',
  clear: 'uClear',
  sweep: 'uSweep',
  turn: 'uTurn',
  lighten: 'uLighten',
  fade: 'uFade',
}

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform float uAspect;
uniform float uFlutes;
uniform float uRefract;
uniform float uWarp;
uniform float uEdge;
uniform float uShade;
uniform float uBlur;
uniform float uSoft;
uniform float uFluid;
uniform float uBlue;
uniform float uWhite;
uniform float uClear;
uniform float uSweep;
uniform float uTurn;
uniform float uLighten;
uniform float uFade;
uniform float uCopyEdge;

const vec3 BG = vec3(0.937, 0.941, 0.949);

// Liquid flow: each pass bends the coordinates it was handed, so the cloth
// folds and breathes instead of moving as a rigid shape.
vec2 flow(vec2 p, float t) {
  float k = uWarp * uFluid;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    p += k * (0.9 - fi * 0.2) * vec2(
      sin(p.y * (3.1 + fi * 1.7) + t * (0.29 + fi * 0.09) + fi * 1.7),
      cos(p.x * (2.6 + fi * 1.4) - t * (0.23 + fi * 0.07) + fi * 2.3));
  }
  return p;
}

// One blurred cloth fold. d = signed distance across the fold (bent into a
// curve), s = position along it. The soft side rises slowly into the core;
// the crisp side drops fast from the core to a pale shelf, then fades out.
float fold(vec2 p, vec2 c, float ang, float bend, float wSoft, float wCrisp, float crispy, out float along) {
  vec2 dir = vec2(cos(ang), sin(ang));
  vec2 nrm = vec2(-dir.y, dir.x);
  vec2 r = p - c;
  float s = dot(r, dir);
  float d = dot(r, nrm) + bend * s * s;
  along = s;
  float soft = exp(-(d * d) / (wSoft * wSoft));
  float shelf = exp(-(d * d) / (wSoft * wSoft * 2.4)) * 0.45;
  float crisp = mix(shelf, 1.0, smoothstep(wCrisp, 0.0, d));
  float I = d < 0.0 ? soft : mix(soft, crisp, crispy);
  return I * exp(-(s * s) / 1.1);
}

// Background ribbon: 0 = clean background, 1 = deepest navy.
float glow(vec2 uv) {
  float t = uTime;
  vec2 q = flow(uv, t);
  vec2 p = (q - 0.5) * vec2(uAspect, 1.0);

  // Sweeps left to right and back (~9 s each way) while turning and bending.
  float cx = uAspect * 0.5 * (uSweep * 0.62 * sin(t * 0.35 - 1.5708) + 0.08 * sin(t * 0.9 + 0.7));
  float cy = 0.10 * sin(t * 0.47 + 1.0);
  float ang = 1.35 + uTurn * 0.6 * sin(t * 0.27 + 0.4) + 0.15 * sin(t * 0.61 + 2.1);
  float bend = 0.25 + 0.7 * sin(t * 0.41 + 2.0);

  float bl = 0.6 + 0.4 * uBlur;
  float s1;
  float main = fold(p, vec2(cx, cy), ang, bend, 0.20 * bl, 0.025 + 0.04 * uBlur, 1.0, s1);
  // Blue range: the fold thickens and thins along its length.
  main *= mix(1.0, 0.72 + 0.32 * sin(s1 * 2.6 - t * 0.5), uBlue);

  // Pale secondary wing, trailing behind the main fold.
  float s2;
  vec2 c2 = vec2(cx - 0.35 * cos(ang + 0.9), cy + 0.30);
  float wing = fold(p, c2, ang + 0.75 + 0.3 * sin(t * 0.33), -bend * 0.6, 0.17 * bl, 0.1, 0.0, s2) * 0.38;

  float I = 1.0 - (1.0 - main) * (1.0 - wing);
  // White space: shave the faint wash so more of the panel stays clean.
  float cut = uWhite * 0.45;
  return clamp((I - cut) / (1.0 - cut), 0.0, 1.0);
}

// Colour ramp: background → pale blue → the asset's blue → navy.
vec3 ramp(float i) {
  vec3 asset = texture2D(uTex, vec2(0.5, 0.3)).rgb;
  vec3 pale = vec3(0.70, 0.81, 0.94);
  vec3 mid = mix(vec3(0.20, 0.52, 0.88), asset, 0.45);
  vec3 navy = mix(asset * 0.55, vec3(0.02, 0.07, 0.22), 0.4 + 0.6 * uBlue);
  vec3 c = mix(BG, pale, smoothstep(0.0, 0.3, i));
  c = mix(c, mid, smoothstep(0.3, 0.6, i));
  c = mix(c, asset * 0.8, smoothstep(0.5, 0.72, i));
  c = mix(c, navy, smoothstep(0.68, 0.95, i));
  return c;
}

// Lighter palette: same shape and full strength, but the ribbon peaks at a
// soft sky blue instead of navy.
vec3 rampLight(float i) {
  vec3 pale = vec3(0.80, 0.87, 0.96);
  vec3 sky = vec3(0.62, 0.76, 0.95);
  vec3 light = vec3(0.45, 0.64, 0.93);
  vec3 c = mix(BG, pale, smoothstep(0.0, 0.3, i));
  c = mix(c, sky, smoothstep(0.3, 0.65, i));
  c = mix(c, light, smoothstep(0.6, 0.95, i));
  return c;
}

// Lighten: behind the copy (left of uCopyEdge) the ribbon stays at full
// opacity but switches to the lighter palette (uLighten = how far, 1 = fully
// light), so the text never sits on the dark core. Past the copy the normal
// navy palette returns over uFade.
vec3 field(vec2 uv) {
  float g = glow(uv);
  float light = uLighten * (1.0 - smoothstep(uCopyEdge, uCopyEdge + uFade, uv.x));
  return mix(ramp(g), rampLight(g), light);
}

// Each rib squeezes a wider slice of the field into its width, so gradients
// behind the glass break into stripes while flat colour stays flat.
vec3 ribCol(float idx, float f, float y) {
  float centre = (idx + 0.5) / uFlutes;
  float l = f - 0.5;
  float span = 1.0 + uRefract * 6.0;
  float sx = centre + (l + uRefract * 0.6 * l * abs(l)) * span / uFlutes;
  return field(vec2(sx, y));
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float x = uv.x * uFlutes;
  float idx = floor(x);
  float f = fract(x);

  // Softness: near a boundary, cross-fade into what the neighbouring rib shows.
  vec3 colA = ribCol(idx, f, uv.y);
  float nIdx = f < 0.5 ? idx - 1.0 : idx + 1.0;
  float nF = f < 0.5 ? f + 1.0 : f - 1.0;
  vec3 colB = ribCol(nIdx, nF, uv.y);
  float w = 0.5 * (1.0 - smoothstep(0.0, uSoft * 0.5 + 0.001, min(f, 1.0 - f)));
  vec3 col = mix(colA, colB, w);

  // Clear lines: the glass only shows where there is colour behind it.
  float amt = clamp(dot(BG - col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
  float vis = mix(1.0, smoothstep(0.01, 0.15, amt), uClear);

  float edge = smoothstep(0.06 + uSoft * 0.25, 0.0, f) * uEdge * (1.0 - 0.5 * uSoft) * vis;
  float shadeRamp = smoothstep(0.45 - uSoft * 0.25, 1.0, f) * (1.0 - smoothstep(1.0 - uSoft * 0.3, 1.0, f) * uSoft);
  float shade = mix(1.0, 1.0 - uShade * vis, shadeRamp);
  float lift = smoothstep(0.0, 0.35, f) * smoothstep(0.7, 0.35, f) * uShade * 0.6 * vis;
  col = col * shade + lift * (1.0 - col) * 0.5;
  col = mix(col, vec3(1.0), edge * (0.35 + 0.65 * (1.0 - dot(col, vec3(0.333)))));

  gl_FragColor = vec4(col, 1.0);
}`

export default function FlutedGlass({
  settings = FLUTED_HERO,
  src = '/assets/img/testi-glass-bg.webp',
  className = '',
}) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
    })
    /* without WebGL the canvas stays hidden and the panel's own colour shows */
    const hide = () => {
      if (canvas) canvas.style.display = 'none'
    }
    if (!gl) {
      hide()
      return
    }
    const sh = (type, code) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, code)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      hide()
      return
    }
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n) => gl.getUniformLocation(prog, n)
    Object.entries(UNIFORMS).forEach(([k, n]) => gl.uniform1f(u(n), settings[k]))
    gl.uniform1i(u('uTex'), 0)
    const uTime = u('uTime')
    const uAspect = u('uAspect')
    const uCopyEdge = u('uCopyEdge')

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let ready = false
    let visible = false
    let gone = false
    /* time is accumulated, so the drift never jumps after a pause */
    let sim = 0
    let last = 0
    const draw = () => {
      gl.uniform1f(uTime, sim)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      sim += dt * settings.speed
      draw()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      last = 0
    }
    const start = () => {
      stop()
      if (ready && visible && !still) raf = requestAnimationFrame(loop)
    }
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.uniform1f(uAspect, w / h)
      }
      /* where the copy ends, as a share of the canvas width: the right edge of
         the actual text and buttons beside the canvas (pushed off-canvas when
         they don't overlap it, e.g. the mobile band below the copy, so no
         lightening at all) */
      const box = canvas.getBoundingClientRect()
      let right = box.left
      const range = document.createRange()
      for (const el of canvas.parentElement?.children || []) {
        if (el === canvas) continue
        range.selectNodeContents(el)
        for (const r of range.getClientRects()) {
          if (r.width && r.bottom > box.top && r.top < box.bottom) right = Math.max(right, r.right)
        }
      }
      gl.uniform1f(uCopyEdge, box.width && right > box.left ? (right - box.left) / box.width : -1)
      if (ready) draw()
    }

    /* the ribbon takes its blue from the asset, downscaled so the asset's own
       baked column lines melt into a soft field */
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (gone) return
      const mid = document.createElement('canvas')
      mid.width = 512
      mid.height = 256
      const mctx = mid.getContext('2d')
      mctx.imageSmoothingQuality = 'high'
      mctx.drawImage(img, 0, 0, mid.width, mid.height)
      const off = document.createElement('canvas')
      off.width = 128
      off.height = 256
      const ctx = off.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(mid, 0, 0, off.width, off.height)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      ready = true
      size()
      canvas.classList.add('on')
      start()
    }
    img.onerror = hide
    img.src = src

    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    /* it only runs while it is on screen */
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '100px' },
    )
    io.observe(canvas)
    return () => {
      gone = true
      ro.disconnect()
      io.disconnect()
      stop()
    }
  }, [settings, src])
  return <canvas ref={ref} className={`fluted-glass ${className}`} aria-hidden="true" />
}
