import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import useMediaQuery from '@/hooks/useMediaQuery'
import {
  Landmark,
  Building2,
  ChartCandlestick,
  Briefcase,
  House,
  type LucideIcon,
} from 'lucide-react'
import { ROLES, roleHref, roleLabel } from '@/data/roles'
import { SEGMENTS } from '@/data/segments'
import { PRODUCTS as PRODUCT_LIST } from '@/data/products'
import { SOLUTIONS as SOLUTION_PAGES, solutionHref } from '@/data/solutions'
import { APP_HREF } from '@/components/layout/AskParts'
import { LINKS } from '@/config/site'

interface NavItem {
  key: string
  label: string
  href?: string
  soon?: boolean
  icon?: LucideIcon
  desc?: string
}

const PRODUCTS: NavItem[] = PRODUCT_LIST

// Names come from SEGMENTS (the hero's rotating words) so menu and headline match. A desk with no page in data/solutions.ts falls back to #why-finsynth.
const SOLUTION_BLURBS: Record<string, { icon: LucideIcon; desc: string; slug?: string }> = {
  'Hedge Funds': { icon: Landmark, desc: 'Alpha generation and signal research' },
  'Asset Managers': { icon: Building2, desc: 'IC memos and portfolio monitoring' },
  'Private Markets': { icon: ChartCandlestick, desc: 'Deal screening, diligence and IC memos' },
  'Family Offices': { icon: House, desc: 'Public holdings and private deals' },
  'Sell Side': { icon: Briefcase, desc: 'Initiations, earnings notes and sector reports' },
}
// exported for the footer's Solutions column, so the two lists are one list
export const SOLUTIONS: NavItem[] = SEGMENTS.filter((name) => name in SOLUTION_BLURBS).map(
  (name) => {
    const { slug: pageSlug, ...blurb } = SOLUTION_BLURBS[name]
    const slug = pageSlug || name.toLowerCase().replace(/\s+/g, '-')
    return {
      key: slug,
      label: name,
      href: slug in SOLUTION_PAGES ? solutionHref(slug) : '/#why-finsynth',
      ...blurb,
    }
  },
)

const CAREERS: NavItem[] = ROLES.map((r) => ({
  key: r.key,
  label: roleLabel(r),
  href: roleHref(r),
}))

/**
 * `id` is what the bar's single open-menu state holds, so opening one closes the other.
 * `flat` (phone sheet) is a separate render, not a CSS override: touch emulates mouseenter just before the
 * tap, which would toggle the desktop menu shut as it opens. Flat rows use their own flatOpen/onToggle.
 */
type NavDropProps = {
  id: string
  label: string
  items: NavItem[]
} & (
  | {
      flat: true
      flatOpen: boolean
      onToggle: () => void
      onNavigate: () => void
      open?: never
      setOpen?: never
      grid?: never
    }
  | {
      flat?: false
      open: string | null
      setOpen: Dispatch<SetStateAction<string | null>>
      grid?: boolean
      flatOpen?: never
      onToggle?: never
      onNavigate?: never
    }
)

function NavDrop({
  id,
  label,
  items,
  open,
  setOpen,
  flat,
  flatOpen,
  onToggle,
  onNavigate,
  grid,
}: NavDropProps) {
  const isOpen = flat ? flatOpen : open === id

  const renderItem = (it: NavItem, onClick?: () => void) => {
    if (it.soon) {
      return (
        <span key={it.key} className="nav-drop-item is-soon" aria-disabled="true">
          {it.label}
        </span>
      )
    }
    if (it.icon) {
      const Icon = it.icon
      return (
        <a
          key={it.key}
          className="nav-drop-item nav-drop-item--rich"
          href={it.href}
          onClick={onClick}
        >
          <span className="nav-drop-ico" aria-hidden="true">
            <Icon strokeWidth={1.6} />
          </span>
          <span className="nav-drop-text">
            <span className="nav-drop-title">{it.label}</span>
            <span className="nav-drop-desc">{it.desc}</span>
          </span>
        </a>
      )
    }
    return (
      <a key={it.key} className="nav-drop-item" href={it.href} onClick={onClick}>
        {it.label}
      </a>
    )
  }

  if (flat) {
    return (
      <div className={`nav-drop nav-drop--flat${isOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="nav-link nav-drop-btn"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {label}
          <svg
            className="nav-drop-caret"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.75 4.5 6 7.75 9.25 4.5" />
          </svg>
        </button>
        <div className="nav-drop-fold">
          <div className="nav-drop-fold-inner">{items.map((it) => renderItem(it, onNavigate))}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`nav-drop${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(id)}
      onMouseLeave={() => setOpen((cur) => (cur === id ? null : cur))}
    >
      <button
        type="button"
        className="nav-link nav-drop-btn"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {label}
        <svg
          className="nav-drop-caret"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.75 4.5 6 7.75 9.25 4.5" />
        </svg>
      </button>
      <div className="nav-drop-menu">
        <div className={`nav-drop-card${grid ? ' nav-drop-card--grid' : ''}`}>
          {items.map((it) => renderItem(it, () => setOpen(null)))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  // A set, not one id: in the sheet both groups can be open. They start open on purpose — the links are why the sheet was opened.
  const allFlats = () => new Set(['product', 'solutions', 'careers'])
  const [openFlats, setOpenFlats] = useState(allFlats)
  const toggleFlat = (id: string) =>
    setOpenFlats((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  // same breakpoint as the CSS that lays out the sheet
  const compact = useMediaQuery('(max-width: 900px)')
  const [sheetOpen, setSheetOpen] = useState(false)
  const lastY = useRef(0)
  // the whole link row, so an outside click is measured against both menus at
  // once rather than each drop watching for itself
  const linksRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  // Whether the hero or footer is currently on screen — nav stays visible in either.
  const anchorVisible = useRef(true)
  // Over the dark footer the frosted fill reads murky, so the bar goes solid for that stretch.
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const heroes = Array.from(document.querySelectorAll('.hero-s2'))
    const footer = document.querySelector('.footer-new')

    const update = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      const atTop = y < 80

      if (anchorVisible.current || atTop || !goingDown) {
        setHidden(false)
      } else {
        setHidden(true)
      }

      // Measured against the bar's own strip rather than the footer merely
      // being in view: the swap has to land as the dark edge crosses the bar,
      // not when the footer first appears at the bottom of the screen.
      const navH = navRef.current?.offsetHeight ?? 60
      const footTop = footer?.getBoundingClientRect().top
      setOnDark(footTop != null && footTop < navH)

      lastY.current = y
    }

    const onScroll = () => window.requestAnimationFrame(update)

    let observer: IntersectionObserver | undefined
    const targets = [...heroes, footer].filter((t): t is Element => !!t)
    if (targets.length) {
      const seen = new Set()
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) seen.add(e.target)
            else seen.delete(e.target)
          })
          anchorVisible.current = seen.size > 0
          update()
        },
        { threshold: 0 },
      )
      targets.forEach((t) => io.observe(t))
      observer = io
    }

    lastY.current = window.scrollY
    // a reload part-way down the page can land on the footer, so settle the
    // fill before the first scroll rather than after it
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (observer) observer.disconnect()
    }
  }, [])

  // A menu left open while the bar slides away would hang in mid-air.
  useEffect(() => {
    if (hidden) {
      setOpenMenu(null)
      setSheetOpen(false)
    }
  }, [hidden])

  // Rotating a phone or dragging a desktop window across the breakpoint swaps
  // which navigation is on screen; the other one's state has to go with it.
  useEffect(() => {
    setSheetOpen(false)
    setOpenMenu(null)
    setOpenFlats(allFlats())
  }, [compact])

  // Escape or a tap anywhere outside (including the page behind) closes the sheet.
  useEffect(() => {
    if (!sheetOpen) return
    const onDown = (e: PointerEvent) => {
      if (
        !sheetRef.current?.contains(e.target as Node) &&
        !burgerRef.current?.contains(e.target as Node)
      ) {
        setSheetOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSheetOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [sheetOpen])

  // Folds don't outlive the sheet: reopening starts fully expanded again.
  useEffect(() => {
    if (!sheetOpen) setOpenFlats(allFlats())
  }, [sheetOpen])

  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: PointerEvent) => {
      if (!linksRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu])

  // Every link in the sheet is a jump on this page, so the sheet has to get out
  // of the way of what it just scrolled to.
  const closeSheet = () => setSheetOpen(false)

  return (
    <nav
      className={`navbar${hidden ? ' nav-hidden' : ''}${sheetOpen ? ' nav-sheet-open' : ''}${onDark ? ' nav-on-dark' : ''}`}
      ref={navRef}
    >
      <div className="navbar-inner">
        <a className="navbar-logo-link" href="/">
          <img className="navbar-logo" src="/assets/img/full-logo.svg" alt="FinSynth Logo" />
        </a>
        {compact ? (
          <div
            id="nav-sheet"
            className={`navbar-sheet${sheetOpen ? ' is-open' : ''}`}
            ref={sheetRef}
            hidden={!sheetOpen}
          >
            <NavDrop
              id="product"
              label="Product"
              items={PRODUCTS}
              flat
              flatOpen={openFlats.has('product')}
              onToggle={() => toggleFlat('product')}
              onNavigate={closeSheet}
            />
            <NavDrop
              id="solutions"
              label="Solutions"
              items={SOLUTIONS}
              flat
              flatOpen={openFlats.has('solutions')}
              onToggle={() => toggleFlat('solutions')}
              onNavigate={closeSheet}
            />
            <a className="nav-link" href="/#security" onClick={closeSheet}>
              Security
            </a>
            <a className="nav-link" href="/#pricing" onClick={closeSheet}>
              Pricing
            </a>
            <a className="nav-link" href="/#faq" onClick={closeSheet}>
              FAQ
            </a>
            <NavDrop
              id="careers"
              label="Careers"
              items={CAREERS}
              flat
              flatOpen={openFlats.has('careers')}
              onToggle={() => toggleFlat('careers')}
              onNavigate={closeSheet}
            />
            <div className="nav-sheet-actions">
              <a
                className="nav-signin nav-sheet-btn"
                href={APP_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to app
              </a>
              <a
                className="nav-demo nav-sheet-btn"
                href={LINKS.bookCall}
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk to Us
              </a>
            </div>
          </div>
        ) : (
          <div className="navbar-links" ref={linksRef}>
            <NavDrop
              id="product"
              label="Product"
              items={PRODUCTS}
              open={openMenu}
              setOpen={setOpenMenu}
            />
            <NavDrop
              id="solutions"
              label="Solutions"
              items={SOLUTIONS}
              open={openMenu}
              setOpen={setOpenMenu}
              grid
            />
            <a className="nav-link" href="/#security">
              Security
            </a>
            <a className="nav-link" href="/#pricing">
              Pricing
            </a>
            <a className="nav-link" href="/#faq">
              FAQ
            </a>
            {/* last in the row so its menu has room to open inward */}
            <NavDrop
              id="careers"
              label="Careers"
              items={CAREERS}
              open={openMenu}
              setOpen={setOpenMenu}
            />
          </div>
        )}
        <div className="navbar-right">
          {!compact && (
            <a className="nav-signin" href={APP_HREF} target="_blank" rel="noopener noreferrer">
              Go to app
            </a>
          )}
          {/* on compact this moves into the sheet's footer, beside Go to app */}
          {!compact && (
            <a className="nav-demo" href={LINKS.bookCall} target="_blank" rel="noopener noreferrer">
              Talk to Us
            </a>
          )}
          {compact && (
            <button
              type="button"
              className={`nav-burger${sheetOpen ? ' is-open' : ''}`}
              ref={burgerRef}
              aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sheetOpen}
              aria-controls="nav-sheet"
              onClick={() => setSheetOpen((v) => !v)}
            >
              <span className="nav-burger-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
