import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const DEFAULT_CHARSET = '!@#$%^&*()_+-=<>?/\\|'

// While a decode runs the real word stays in layout as an invisible ghost
// and each churning symbol is painted at the measured centre of its
// character. Symbols vary in width, so rendering them inline would change the
// word's width every frame and, in a centred layout, shake the words beside
// it. Per-character boxes aren't enough either: they lose the kerning pairs
// and the word still runs a few px wider than at rest.
// Each symbol's box is the measured box of its character (the font's
// ascent+descent), with line-height equal to that height, so the symbol sits
// on the same baseline as the letters; a plain absolute span would get its own
// line box and float the symbol a few px above the word.
const GHOST = { visibility: 'hidden' }
const glyphStyle = (c) => ({
  position: 'absolute',
  left: c.x,
  top: c.y,
  height: c.h,
  lineHeight: `${c.h}px`,
  transform: 'translateX(-50%)',
})

/**
 * Matrix-style text decode: every character churns through the charset, then
 * locks into place left to right.
 *
 * trigger:
 *   'mount'  — decode once when the component mounts (reference behaviour)
 *   'hover'  — decode each time the pointer enters the element
 *   'manual' — only via the ref's play() (for a parent-owned hover target)
 *
 * `text` may change mid-decode (e.g. a typewriter feeding it); each frame
 * reads the latest value, so the scramble tracks the live word.
 */
export const MatrixDecode = forwardRef(function MatrixDecode(
  {
    text = '',
    charset = DEFAULT_CHARSET,
    as: Tag = 'span',
    className,
    style,
    fontSize,
    color,
    fontWeight,
    revealDuration = 60, // ms per character before it locks in
    speed = 1, // multiplier on the reveal rate
    trigger = 'mount',
    ...rest
  },
  ref,
) {
  const [display, setDisplay] = useState(null) // null → show `text` verbatim
  const rafRef = useRef(0)
  const textRef = useRef(text)
  textRef.current = text
  const hostRef = useRef(null)
  const ghostRef = useRef(null)
  const [centres, setCentres] = useState(null) // per character: centre x, top y, height (host-relative)

  const decoding = display != null
  useLayoutEffect(() => {
    if (!decoding) { setCentres(null); return }
    const host = hostRef.current
    // first decode frame renders `text` verbatim (no ghost yet): measure the
    // host's own text node, later frames measure the ghost
    const node = (ghostRef.current ?? host)?.firstChild
    if (!host || !node) return
    const { left, top } = host.getBoundingClientRect()
    const range = document.createRange()
    const out = []
    for (let i = 0; i < node.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      out.push({ x: r.left - left + r.width / 2, y: r.top - top, h: r.height })
    }
    setCentres(out)
  }, [decoding, text])

  const play = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    cancelAnimationFrame(rafRef.current)
    const t0 = performance.now()
    const perChar = Math.max(1, revealDuration) / Math.max(0.01, speed)
    const step = (now) => {
      const target = textRef.current
      const locked = Math.floor((now - t0) / perChar)
      if (locked >= target.length) {
        setDisplay(null)
        return
      }
      let out = ''
      for (let i = 0; i < target.length; i++) {
        const ch = target[i]
        out += i < locked || ch === ' '
          ? ch
          : charset[(Math.random() * charset.length) | 0]
      }
      setDisplay(out)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [charset, revealDuration, speed])

  useImperativeHandle(ref, () => ({ play }), [play])

  useEffect(() => {
    if (trigger === 'mount') play()
    return () => cancelAnimationFrame(rafRef.current)
    // mount-only by design; trigger changes don't retrigger a decode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const styles = { ...style }
  if (fontSize != null) styles.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize
  if (color != null) styles.color = color
  if (fontWeight != null) styles.fontWeight = fontWeight
  if (decoding && styles.position == null) styles.position = 'relative'

  return (
    <Tag
      ref={hostRef}
      className={className}
      style={styles}
      onMouseEnter={trigger === 'hover' ? play : undefined}
      {...rest}
    >
      {!decoding || !centres ? text : (
        <>
          <span ref={ghostRef} style={GHOST}>{text}</span>
          {Array.from(text).map((ch, i) => (
            ch === ' ' || centres[i] == null ? null : (
              <span key={i} aria-hidden="true" style={glyphStyle(centres[i])}>{display[i] ?? ch}</span>
            )
          ))}
        </>
      )}
    </Tag>
  )
})

export default MatrixDecode
