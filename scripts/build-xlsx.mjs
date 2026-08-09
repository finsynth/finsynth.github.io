// Generates the downloadable workbooks under public/assets/xlsx from the same
// table data the site renders (src/data/examples.js), so a figure edited in the
// UI and a figure in the download can never drift apart.
//
//   node scripts/build-xlsx.mjs
//
// Writes a real .xlsx (an OOXML zip) per example: a "Data" sheet with the
// table, plus a "Notes" sheet carrying the units/as-of line and the citation
// note. No runtime dependency — the parts are plain XML, zipped with the
// system `zip`.

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PROMPTS } from '../src/data/examples.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'assets', 'xlsx')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Excel column letter for a 0-based index (A, B, ... Z, AA).
const colName = (i) => {
  let n = i + 1
  let out = ''
  while (n > 0) {
    const r = (n - 1) % 26
    out = String.fromCharCode(65 + r) + out
    n = Math.floor((n - 1) / 26)
  }
  return out
}

// Cells are written as inline strings unless the value is cleanly numeric, so
// Excel still sums a revenue column while "(32)", "46.6%" and "n/a" keep the
// exact text the site shows.
const isNumeric = (v) => typeof v === 'string' && /^-?[\d,]+(\.\d+)?$/.test(v) && /\d/.test(v)

const cellXml = (value, rowNum, colIdx, styleId) => {
  const ref = `${colName(colIdx)}${rowNum}`
  const s = styleId ? ` s="${styleId}"` : ''
  if (value === '' || value == null) return `<c r="${ref}"${s}/>`
  if (isNumeric(value)) return `<c r="${ref}"${s}><v>${value.replace(/,/g, '')}</v></c>`
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`
}

// styles.xml: 0 = default, 1 = bold header, 2 = italic muted note
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="3">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
<font><i/><sz val="10"/><color rgb="FF6B7280"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFEEF1FB"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left/><right/><top/><bottom style="thin"><color rgb="FFBFC7DA"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="3">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
<sheet name="Data" sheetId="1" r:id="rId1"/>
<sheet name="Notes" sheetId="2" r:id="rId2"/>
</sheets>
</workbook>`

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

const APP_PROPS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
<Application>FinSynth</Application>
</Properties>`

const coreProps = (title, stamp) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${esc(title)}</dc:title>
<dc:creator>FinSynth</dc:creator>
<cp:lastModifiedBy>FinSynth</cp:lastModifiedBy>
<dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created>
<dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified>
</cp:coreProperties>`

// Column widths sized off the longest value in each column, so nothing opens
// as ####.
const colsXml = (cols, rows) => {
  const widths = cols.map((c, i) => {
    const longest = rows.reduce((m, r) => Math.max(m, String(r[i] ?? '').length), String(c).length)
    return Math.min(42, Math.max(10, longest + 3))
  })
  return `<cols>${widths
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join('')}</cols>`
}

const sheetXml = (rowsXml, extra = '') => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${extra}<sheetData>${rowsXml}</sheetData></worksheet>`

// The Data sheet: title, the units/as-of line, a blank spacer, then the header
// row (frozen) and the body.
const dataSheet = (ex) => {
  const { cols, rows, note } = ex.table
  const head = [
    [ex.label, 0],
    [note || '', 2],
    ['', 0],
  ]
  let n = 0
  const out = []
  for (const [text, style] of head) {
    n += 1
    out.push(`<row r="${n}">${text ? cellXml(text, n, 0, style) : ''}</row>`)
  }
  const headerRow = ++n
  out.push(
    `<row r="${headerRow}">${cols.map((c, i) => cellXml(c, headerRow, i, 1)).join('')}</row>`
  )
  for (const r of rows) {
    n += 1
    out.push(`<row r="${n}">${cols.map((_, i) => cellXml(r[i] ?? '', n, i, 0)).join('')}</row>`)
  }
  // freeze everything above the first body row
  const pane = `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerRow}" topLeftCell="A${headerRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
  return sheetXml(out.join(''), pane + colsXml(cols, rows))
}

const NOTE_LINES = (ex) => [
  [ex.label, 1],
  ['', 0],
  ['Prompt', 1],
  [ex.prompt, 0],
  ['', 0],
  ['Units and coverage', 1],
  [ex.table.note || '—', 0],
  ['', 0],
  ['Sources', 1],
  ['Figures are pulled from the companies’ own filings and earnings releases.', 0],
  ['In the FinSynth webapp every cell stays clickable: it opens the source', 0],
  ['document at the passage the number came from, highlighted.', 0],
  ['', 0],
  ['Computed columns', 1],
  ['Variances, midpoints, medians and means are calculated from the pulled', 0],
  ['figures rather than pulled themselves.', 0],
]

const notesSheet = (ex) => {
  const rows = NOTE_LINES(ex)
    .map(([text, style], i) => {
      const n = i + 1
      return `<row r="${n}">${text ? cellXml(text, n, 0, style) : ''}</row>`
    })
    .join('')
  return sheetXml(rows, '<cols><col min="1" max="1" width="86" customWidth="1"/></cols>')
}

// A fixed timestamp keeps rebuilds byte-identical when nothing changed.
const STAMP = '2026-07-22T00:00:00Z'

const build = (ex) => {
  const dir = mkdtempSync(join(tmpdir(), 'fs-xlsx-'))
  const put = (rel, body) => {
    const target = join(dir, rel)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, body)
  }
  put('[Content_Types].xml', CONTENT_TYPES)
  put('_rels/.rels', ROOT_RELS)
  put('docProps/core.xml', coreProps(ex.label, STAMP))
  put('docProps/app.xml', APP_PROPS)
  put('xl/workbook.xml', WORKBOOK)
  put('xl/_rels/workbook.xml.rels', WORKBOOK_RELS)
  put('xl/styles.xml', STYLES)
  put('xl/worksheets/sheet1.xml', dataSheet(ex))
  put('xl/worksheets/sheet2.xml', notesSheet(ex))

  const out = join(OUT_DIR, ex.file)
  rmSync(out, { force: true })
  // -X drops extra file attributes so the archive is reproducible
  execFileSync('zip', ['-q', '-X', '-r', out, '.'], { cwd: dir })
  rmSync(dir, { recursive: true, force: true })
  return out
}

mkdirSync(OUT_DIR, { recursive: true })
for (const ex of PROMPTS) {
  const out = build(ex)
  console.log(`wrote ${out.replace(ROOT + '/', '')}`)
}
