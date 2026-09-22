import { catalog, findComponent } from './catalog.js'

export interface ReviewFinding {
  line: number
  severity: 'error' | 'warning' | 'info'
  rule: string
  message: string
}

export interface ReviewResult {
  passed: boolean
  findings: ReviewFinding[]
  componentsUsed: string[]
}

const exportNames = new Set(catalog.components.flatMap((c) => c.exports.map((e) => e.name)))
const iconNames = new Set(catalog.icons.map((i) => i.name))

function lineOf(src: string, index: number) {
  return src.slice(0, index).split('\n').length
}

/**
 * Heuristic review of TSX against the house rules. Regex-based on purpose:
 * it runs anywhere, needs no TypeScript program, and catches the mistakes
 * agents actually make. It does not replace tsc.
 */
export function reviewUsage(code: string): ReviewResult {
  const findings: ReviewFinding[] = []
  const used = new Set<string>()

  // Every JSX opening tag: <Name ...attrs...> or <Name ... />
  const tagRe = /<([A-Z][A-Za-z0-9.]*)((?:\s+[^<>]*?)?)(\/?)>/g
  for (const m of code.matchAll(tagRe)) {
    const [, tag, attrs = ''] = m
    const line = lineOf(code, m.index!)
    const name = tag!.split('.')[0]!
    const attrNames = [...attrs.matchAll(/(?:^|\s)([a-zA-Z-]+)(?==|\s|$)/g)].map((a) => a[1]!)

    if (iconNames.has(name)) {
      used.add(name)
      if (!/aria-hidden/.test(attrs) && !/aria-label|role=/.test(attrs)) {
        findings.push({
          line,
          severity: 'warning',
          rule: 'icon-decorative',
          message: `<${name}> has no aria-hidden="true". Steelbook icons are decorative glyphs; the text beside them carries the meaning. If this icon is the whole control, the control itself needs aria-label.`,
        })
      }
      continue
    }
    if (!exportNames.has(name)) continue
    used.add(name)
    const component = findComponent(name)
    const exp = component?.exports.find((e) => e.name === name)

    if (attrNames.includes('state')) {
      findings.push({
        line,
        severity: 'error',
        rule: 'state-is-css',
        message: `<${name} state=…>: hover / active / focus / disabled are CSS (:hover, :active, :focus-visible, disabled attribute or Ark data-* attributes), never a prop. Remove it.`,
      })
    }
    for (const a of attrNames) {
      if (/^(hover|active|focused|focus|pressed|isHovered|isActive|isFocused)$/.test(a)) {
        findings.push({ line, severity: 'error', rule: 'state-is-css', message: `<${name} ${a}>: interaction state is not a prop in Steelbook. Let the browser (or Ark's data-* attributes) drive it.` })
      }
    }
    if (exp?.props) {
      const own = new Set(exp.props.map((p) => p.name))
      const required = exp.props.filter((p) => p.required && p.name !== 'children')
      const spread = /\{\.\.\./.test(attrs)
      for (const r of required) {
        if (!attrNames.includes(r.name) && !spread) {
          findings.push({ line, severity: 'error', rule: 'required-prop', message: `<${name}> is missing required prop \`${r.name}\` (${r.type}).` })
        }
      }
      // Props that look like a Figma property name rather than the mapped prop.
      for (const a of attrNames) {
        if (own.has(a) || /^(aria-|data-|on[A-Z]|className|style|id|ref|key|children|disabled|type|value|name|role|tabIndex)/.test(a)) continue
        const lower = a.toLowerCase()
        const near = [...own].find((p) => p.toLowerCase() === lower || p.toLowerCase() === lower.replace(/^show/, '') || lower.includes(p.toLowerCase()))
        if (near && near !== a) {
          findings.push({ line, severity: 'warning', rule: 'prop-name', message: `<${name} ${a}>: did you mean \`${near}\`? Figma property names map to props as the component description says.` })
        }
      }
    }
    // Icon-only control: a button-like Steelbook component whose only child is an icon.
    if (component && ['Button', 'Toggle', 'ToggleGroupItem', 'MenuItem'].includes(name) && !attrs.includes('aria-label') && !attrs.includes('aria-labelledby')) {
      const rest = code.slice(m.index! + m[0].length, m.index! + m[0].length + 300)
      const inner = rest.slice(0, rest.indexOf(`</${tag}>`) >= 0 ? rest.indexOf(`</${tag}>`) : 0).trim()
      if (inner && /^<[A-Z][A-Za-z]*Icon\b[^>]*\/?>(\s*<\/[A-Z][A-Za-z]*Icon>)?$/.test(inner)) {
        findings.push({ line, severity: 'error', rule: 'accessible-name', message: `<${name}> contains only an icon and no aria-label: it reaches the accessibility tree unnamed. Add aria-label or visible text.` })
      }
    }
    if (attrs.includes('aria-label') && attrs.includes('aria-labelledby')) {
      findings.push({ line, severity: 'error', rule: 'accessible-name', message: `<${name}> sets both aria-label and aria-labelledby; the contract is a mutually exclusive union — pick one.` })
    }
  }

  // Inline styles carrying raw values.
  for (const m of code.matchAll(/style=\{\{([^}]*)\}\}/g)) {
    const body = m[1]!
    const line = lineOf(code, m.index!)
    if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(body)) {
      findings.push({ line, severity: 'error', rule: 'tokens-only', message: 'Inline style uses a raw colour. Every colour comes from a var(--sb-*) token; steelbook_find_token names it.' })
    }
    if (/:\s*['"]?\d+(\.\d+)?(px|rem|em)\b/.test(body) || /(padding|margin|gap|width|height|fontSize|borderRadius|borderWidth)\s*:\s*\d/.test(body)) {
      findings.push({ line, severity: 'error', rule: 'tokens-only', message: 'Inline style uses a raw length. Lengths come from tokens (space / gap / size / radius / stroke); prefer a CSS class over inline style.' })
    }
    if (/font(Family|Weight|Size|Stretch)|lineHeight|letterSpacing/.test(body)) {
      findings.push({ line, severity: 'error', rule: 'typography-group', message: 'Typography must consume a whole --sb-text-<style>-* group via CSS, never per-property inline values.' })
    }
  }

  // Hand-drawn icons.
  for (const m of code.matchAll(/<svg\b/g)) {
    const line = lineOf(code, m.index!)
    findings.push({ line, severity: 'warning', rule: 'assets-from-figma', message: 'Inline <svg>: icons must be the exported Figma asset. Use a Steelbook icon component (steelbook_list_icons) or ask for the glyph to be exported; never redraw from memory.' })
  }

  // Import sanity.
  const importsSteelbook = /from\s+['"]@steelbook\/react['"]/.test(code)
  if (used.size && !importsSteelbook) {
    findings.push({ line: 1, severity: 'warning', rule: 'import-path', message: "Steelbook components are used but nothing is imported from '@steelbook/react'." })
  }
  const arkImport = code.match(/from\s+['"]@ark-ui\/react[^'"]*['"]/)
  if (arkImport) {
    findings.push({ line: lineOf(code, arkImport.index!), severity: 'warning', rule: 'reuse-never-regenerate', message: 'Importing Ark UI directly in app code: if a Steelbook component wraps this primitive, use it instead of restyling Ark from scratch.' })
  }
  if (/\bimport\s+.*\bfrom\s+['"]\.\.?\/.*\/(Button|Dialog|Field|Select)['"]/.test(code) && !importsSteelbook) {
    findings.push({ line: 1, severity: 'info', rule: 'reuse-never-regenerate', message: 'A local Button/Dialog/Field/Select is imported. If it duplicates a Steelbook component, that is a defect: import from @steelbook/react instead.' })
  }

  findings.sort((a, b) => a.line - b.line)
  return { passed: !findings.some((f) => f.severity === 'error'), findings, componentsUsed: [...used].sort() }
}
