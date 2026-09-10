import { useCallback, useEffect, useState } from 'react'
import Hero from './Hero'

// ── Hero iterations ──
// The hero is being rebuilt, and each pass wants to be seen next to the last
// one rather than replacing it. This is the registry: one entry per iteration,
// each rendering a whole hero, so an iteration can be a prop tweak on the
// current Hero (as the first three are) or an entirely different component.
// Add an entry, and it shows up in the switch.
//
// Picking one: `?hero=<id>` in the URL wins, then the last choice saved in
// localStorage, then DEFAULT_ID. The switch (bottom-left) is shown in dev, and
// in production only once an iteration has been chosen by URL — so a shared
// preview link `?hero=v2` opens on v2 with the switch visible, while the plain
// site shows the default and no switch. Closing the switch clears the choice.
export const HERO_ITERATIONS = [
  {
    id: 'v1',
    label: 'v1',
    note: 'Baseline: plain trust line',
    render: () => <Hero variant="photo" trust="plain" />,
  },
  {
    id: 'v2',
    label: 'v2',
    note: 'Trust line as a tracked-caps eyebrow between hairlines',
    render: () => <Hero variant="photo" trust="eyebrow" />,
  },
  {
    id: 'v3',
    label: 'v3',
    note: 'Trust line as the same sentence in full ink',
    render: () => <Hero variant="photo" trust="ink" />,
  },
]

export const DEFAULT_ID = 'v1'
const STORAGE_KEY = 'fs-hero-iteration'
const PARAM = 'hero'

const byId = (id) => HERO_ITERATIONS.find((it) => it.id === id)

function readInitial() {
  if (typeof window === 'undefined') return { id: DEFAULT_ID, pinned: false }
  const fromUrl = new URLSearchParams(window.location.search).get(PARAM)
  if (fromUrl && byId(fromUrl)) return { id: fromUrl, pinned: true }
  let stored = null
  try { stored = window.localStorage.getItem(STORAGE_KEY) } catch { /* private mode */ }
  if (stored && byId(stored)) return { id: stored, pinned: true }
  return { id: DEFAULT_ID, pinned: false }
}

function writeChoice(id) {
  try { window.localStorage.setItem(STORAGE_KEY, id) } catch { /* private mode */ }
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM, id)
  window.history.replaceState(window.history.state, '', url)
}

function clearChoice() {
  try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* private mode */ }
  const url = new URL(window.location.href)
  url.searchParams.delete(PARAM)
  window.history.replaceState(window.history.state, '', url)
}

export function useHeroIteration() {
  const [state, setState] = useState(readInitial)
  const choose = useCallback((id) => {
    if (!byId(id)) return
    writeChoice(id)
    setState({ id, pinned: true })
  }, [])
  const reset = useCallback(() => {
    clearChoice()
    setState({ id: DEFAULT_ID, pinned: false })
  }, [])
  // [ and ] step through the iterations while the switch is up — quicker than
  // reaching for the mouse when flipping back and forth to compare
  useEffect(() => {
    const visible = import.meta.env.DEV || state.pinned
    if (!visible) return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      if (e.key !== '[' && e.key !== ']') return
      const i = HERO_ITERATIONS.findIndex((it) => it.id === state.id)
      const n = HERO_ITERATIONS.length
      const next = HERO_ITERATIONS[(i + (e.key === ']' ? 1 : n - 1)) % n]
      choose(next.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, choose])
  return { ...state, choose, reset, current: byId(state.id) || HERO_ITERATIONS[0] }
}

// The hero and its switch, together: Home drops this in where <Hero /> was.
export default function HeroIteration() {
  const { id, pinned, choose, reset, current } = useHeroIteration()
  const visible = import.meta.env.DEV || pinned
  return (
    <>
      {current.render()}
      {visible && (
        <div className="hero-iter" role="group" aria-label="Hero iteration">
          <span className="hero-iter-title">Hero</span>
          {HERO_ITERATIONS.map((it) => (
            <button
              key={it.id}
              type="button"
              className={`hero-iter-btn${it.id === id ? ' is-on' : ''}`}
              aria-pressed={it.id === id}
              title={it.note}
              onClick={() => choose(it.id)}
            >
              {it.label}
            </button>
          ))}
          <span className="hero-iter-note">{current.note}</span>
          <button
            type="button"
            className="hero-iter-close"
            aria-label="Hide iteration switch"
            title="Hide and go back to the default"
            onClick={reset}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
