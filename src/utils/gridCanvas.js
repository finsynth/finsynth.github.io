export function initGrid() {
  const CONFIG = {
    cellW: 80, cellH: 32, headerH: 24, rowNumW: 40,
    headerBg: '#F6F8FA', headerBorder: '#D0D7DE', headerText: '#57606A',
    line: '#EAEEF6', lineStrong: '#DEE5F0',
    strongEveryCol: 4, strongEveryRow: 5,
    accent: '#4265CC', glowAlpha: 0.028, glowRadius: 3.2,
    posColor: '14,159,110', negColor: '224,45,60', numColor: '71,84,103',
    sparkLife: [1400, 2300], sparksPerMove: [2, 3],
    ambient: true, ambientIdleMs: 2600, ambientEveryMs: 1900,
    dragSelect: true,
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  }

  const canvas = document.querySelector('[data-grid-hero]')
  if (!canvas) return () => {}
  const stage = canvas.parentElement
  const pill = stage.querySelector('.stat-pill')
  const ctx = canvas.getContext('2d')
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const { cellW, cellH, headerH, rowNumW } = CONFIG

  let W = 0, H = 0, cols = 0, rows = 0
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const r = stage.getBoundingClientRect()
    W = r.width; H = r.height
    canvas.width = W * dpr; canvas.height = H * dpr
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.ceil((W - rowNumW) / cellW) + 1
    rows = Math.ceil((H - headerH) / cellH) + 1
  }
  resize()
  window.addEventListener('resize', resize)

  function hash(c, r) {
    let h = (c * 374761393 + r * 668265263) ^ 0x5bf03635
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) >>> 0) / 4294967295
  }

  function cellValue(c, r) {
    const h = hash(c, r)
    if (h < .30) return { t: (h * 9000 + 120).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','), n: h * 9000 + 120, k: 'num' }
    if (h < .55) { const v = (h - .42) * 38; return { t: (v >= 0 ? '+' : '') + v.toFixed(1) + '%', n: null, k: v >= 0 ? 'pos' : 'neg' } }
    if (h < .72) return { t: (h * 4 + .2).toFixed(2) + 'x', n: null, k: 'num' }
    if (h < .86) return { t: '$' + (h * 90).toFixed(1) + 'M', n: h * 90, k: 'num' }
    return { t: ['Q1','Q2','Q3','Q4','FY24','FY25','EBITDA','GM%','WACC','IRR'][Math.floor(h * 1000) % 10], n: null, k: 'lbl' }
  }

  const colRef = c => { let s = ''; c++; while (c > 0) { s = String.fromCharCode(65 + (c - 1) % 26) + s; c = Math.floor((c - 1) / 26) } return s }
  const ref = (c, r) => colRef(c) + (r + 1)
  const key = (c, r) => c + '_' + r

  let hover = null, pointerOn = false
  let dragStart = null, dragEnd = null, dragging = false
  const sparks = new Map()
  let lastSparkCell = null, lastActivity = performance.now(), ambientTimer = 0

  const toLocal = e => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const cellAt = (x, y) => ({ c: Math.floor((x - rowNumW) / cellW), r: Math.floor((y - headerH) / cellH) })

  function spawnSparksAround(c, r) {
    if (reduceMotion) return
    const [lo, hi] = CONFIG.sparksPerMove
    const n = lo + Math.floor(Math.random() * (hi - lo + 1))
    for (let i = 0; i < n; i++) {
      const dc = Math.floor(Math.random() * 5) - 2, dr = Math.floor(Math.random() * 5) - 2
      if (dc === 0 && dr === 0) continue
      const k = key(c + dc, r + dr)
      const [minL, maxL] = CONFIG.sparkLife
      if (!sparks.has(k))
        sparks.set(k, { c: c + dc, r: r + dr, born: performance.now(), life: minL + Math.random() * (maxL - minL) })
    }
  }

  function onMove(e) {
    const p = toLocal(e)
    if (p.y < 0 || p.y > H || p.x < 0 || p.x > W) { pointerOn = false; hover = null; return }
    pointerOn = true; lastActivity = performance.now()
    const cell = cellAt(p.x, p.y)
    if (cell.c < 0 || cell.r < 0) { hover = null; return }
    if (!hover || cell.c !== hover.c || cell.r !== hover.r) {
      hover = cell
      const k = key(cell.c, cell.r)
      if (k !== lastSparkCell) { spawnSparksAround(cell.c, cell.r); lastSparkCell = k }
    }
    if (dragging) dragEnd = cell
  }
  document.addEventListener('pointermove', onMove, { passive: true })

  if (CONFIG.dragSelect) {
    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture(e.pointerId)
      dragging = true
      const p = toLocal(e)
      dragStart = dragEnd = cellAt(p.x, p.y)
    })
    const endDrag = () => {
      dragging = false
      setTimeout(() => { if (!dragging) { dragStart = dragEnd = null; pill && pill.classList.remove('show') } }, 1600)
    }
    canvas.addEventListener('pointerup', endDrag)
    canvas.addEventListener('pointercancel', endDrag)
  }

  function updatePill() {
    if (!pill || !dragStart || !dragEnd) return
    const c0 = Math.min(dragStart.c, dragEnd.c), c1 = Math.max(dragStart.c, dragEnd.c)
    const r0 = Math.min(dragStart.r, dragEnd.r), r1 = Math.max(dragStart.r, dragEnd.r)
    let sum = 0, cnt = 0, total = 0
    for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
      total++
      const v = cellValue(c, r)
      if (v.n !== null) { sum += v.n; cnt++ }
    }
    if (total < 2) { pill.classList.remove('show'); return }
    const fmt = n => n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : n.toFixed(1)
    pill.innerHTML = '<span><b>SUM</b>' + (cnt ? fmt(sum) : '—') + '</span>' +
      '<span><b>AVG</b>' + (cnt ? fmt(sum / cnt) : '—') + '</span>' +
      '<span><b>COUNT</b>' + total + '</span>'
    pill.classList.add('show')
  }

  function ambient(now) {
    if (!CONFIG.ambient || reduceMotion) return
    if (now - lastActivity < CONFIG.ambientIdleMs) return
    if (now - ambientTimer < CONFIG.ambientEveryMs) return
    ambientTimer = now
    const c = 2 + Math.floor(Math.random() * (cols - 4))
    const r = 2 + Math.floor(Math.random() * (rows - 4))
    const len = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i <= len; i++)
      sparks.set(key(c + i, r), { c: c + i, r, born: now + i * 140, life: 2400 })
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
  }

  function cellX(c) { return rowNumW + c * cellW }
  function cellY(r) { return headerH + r * cellH }

  function drawTag(label, x, y) {
    ctx.font = '500 10px ' + CONFIG.mono
    const tw = ctx.measureText(label).width + 12
    ctx.fillStyle = CONFIG.accent
    roundRect(x, Math.max(headerH + 2, y - 18), tw, 16, 4); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'
    ctx.fillText(label, x + 6, Math.max(headerH + 2, y - 18) + 8)
    ctx.textAlign = 'center'
  }

  let alive = true
  let rafId = null

  function draw(now) {
    if (!alive) return
    ctx.clearRect(0, 0, W, H)

    ctx.lineWidth = 1
    for (let c = 0; c <= cols; c++) {
      ctx.strokeStyle = (c % CONFIG.strongEveryCol === 0) ? CONFIG.lineStrong : CONFIG.line
      const x = rowNumW + c * cellW + .5
      ctx.beginPath(); ctx.moveTo(x, headerH); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let r = 0; r <= rows; r++) {
      const rowFade = Math.max(0.06, 1 - (r / rows) * 0.94)
      ctx.globalAlpha = rowFade
      ctx.strokeStyle = (r % CONFIG.strongEveryRow === 0) ? CONFIG.lineStrong : CONFIG.line
      const y = headerH + r * cellH + .5
      ctx.beginPath(); ctx.moveTo(rowNumW, y); ctx.lineTo(W, y); ctx.stroke()
    }
    ctx.globalAlpha = 1

    if (hover && pointerOn) {
      ctx.fillStyle = 'rgba(66,101,204,0.10)'
      ctx.fillRect(cellX(hover.c), 0, cellW, headerH)
      ctx.fillRect(0, cellY(hover.r), rowNumW, cellH)
    }

    ctx.fillStyle = CONFIG.headerBg
    ctx.fillRect(rowNumW, 0, W, headerH)
    ctx.fillStyle = CONFIG.headerBorder
    ctx.fillRect(0, headerH - 1, W, 1)
    ctx.font = '500 11px ' + CONFIG.mono
    ctx.fillStyle = CONFIG.headerText
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    for (let c = 0; c < cols; c++) {
      if (hover && pointerOn && c === hover.c) {
        ctx.fillStyle = CONFIG.accent
        ctx.fillRect(cellX(c), 0, cellW, headerH - 1)
        ctx.fillStyle = '#ffffff'
      } else {
        ctx.fillStyle = CONFIG.headerText
      }
      ctx.fillText(colRef(c), cellX(c) + cellW / 2, headerH / 2)
    }

    ctx.fillStyle = CONFIG.headerBg
    ctx.fillRect(0, headerH, rowNumW, H)
    ctx.fillStyle = CONFIG.headerBorder
    ctx.fillRect(rowNumW - 1, headerH, 1, H)
    ctx.font = '500 11px ' + CONFIG.mono
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    for (let r = 0; r < rows; r++) {
      if (hover && pointerOn && r === hover.r) {
        ctx.fillStyle = CONFIG.accent
        ctx.fillRect(0, cellY(r), rowNumW - 1, cellH)
        ctx.fillStyle = '#ffffff'
      } else {
        ctx.fillStyle = CONFIG.headerText
      }
      ctx.fillText(String(r + 1), rowNumW / 2, cellY(r) + cellH / 2)
    }

    ctx.fillStyle = CONFIG.headerBg
    ctx.fillRect(0, 0, rowNumW, headerH)
    ctx.fillStyle = CONFIG.headerBorder
    ctx.fillRect(rowNumW - 1, 0, 1, headerH)
    ctx.fillRect(0, headerH - 1, rowNumW, 1)

    if (hover && pointerOn && !reduceMotion) {
      const R = CONFIG.glowRadius
      for (let dc = -3; dc <= 3; dc++) for (let dr = -3; dr <= 3; dr++) {
        const d = Math.hypot(dc, dr)
        if (d === 0 || d > R) continue
        const a = CONFIG.glowAlpha * (1 - d / (R + .2))
        ctx.fillStyle = 'rgba(66,101,204,' + a.toFixed(3) + ')'
        ctx.fillRect(cellX(hover.c + dc) + 1, cellY(hover.r + dr) + 1, cellW - 1, cellH - 1)
      }
    }

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    for (const [k, s] of sparks) {
      const t = (now - s.born) / s.life
      if (t >= 1) { sparks.delete(k); continue }
      if (t < 0) continue
      const fade = t < .25 ? t / .25 : (1 - t) / .75
      const rowFade = Math.max(0, 1 - (s.r / rows) * 0.9)
      const a = fade * rowFade
      const v = cellValue(s.c, s.r)
      ctx.font = '400 10.5px ' + CONFIG.mono
      ctx.fillStyle = v.k === 'pos' ? 'rgba(' + CONFIG.posColor + ',' + (a * .38) + ')'
        : v.k === 'neg' ? 'rgba(' + CONFIG.negColor + ',' + (a * .32) + ')'
        : 'rgba(' + CONFIG.numColor + ',' + (a * .26) + ')'
      ctx.fillText(v.t, cellX(s.c) + cellW / 2, cellY(s.r) + cellH / 2)
    }

    if (dragStart && dragEnd) {
      const c0 = Math.min(dragStart.c, dragEnd.c), c1 = Math.max(dragStart.c, dragEnd.c)
      const r0 = Math.min(dragStart.r, dragEnd.r), r1 = Math.max(dragStart.r, dragEnd.r)
      const x = cellX(c0), y = cellY(r0), w = (c1 - c0 + 1) * cellW, h = (r1 - r0 + 1) * cellH
      ctx.fillStyle = 'rgba(66,101,204,.07)'; ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = CONFIG.accent; ctx.lineWidth = 1.6
      ctx.strokeRect(x + .5, y + .5, w - 1, h - 1)
      drawTag(ref(c0, r0) + ':' + ref(c1, r1), x, y)
      updatePill()
    } else if (hover && pointerOn) {
      const x = cellX(hover.c), y = cellY(hover.r)
      ctx.strokeStyle = CONFIG.accent; ctx.lineWidth = 1.8
      ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2)
      ctx.fillStyle = CONFIG.accent
      ctx.fillRect(x + cellW - 4.5, y + cellH - 4.5, 5, 5)
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1
      ctx.strokeRect(x + cellW - 5, y + cellH - 5, 6, 6)
      drawTag(ref(hover.c, hover.r), x, y)
    }

    ambient(now)
    rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)

  return () => {
    alive = false
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
    document.removeEventListener('pointermove', onMove)
  }
}
