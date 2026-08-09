import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

const DEFAULT_CHARSET = '!@#$%^&*()_+-=<>?/\\|'

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

  return (
    <Tag
      className={className}
      style={styles}
      onMouseEnter={trigger === 'hover' ? play : undefined}
      {...rest}
    >
      {display ?? text}
    </Tag>
  )
})

export default MatrixDecode
