import type { CatalogComponent, CatalogExport, CatalogIcon, CatalogProp, CatalogToken } from './catalog-types.js'
import { catalog } from './catalog.js'

/** Upper bound on a single tool response, in characters. */
export const CHARACTER_LIMIT = 25_000

export const STORYBOOK_URL = process.env.STEELBOOK_STORYBOOK_URL ?? ''

export function truncate(text: string, limit = CHARACTER_LIMIT): string {
  if (text.length <= limit) return text
  return (
    text.slice(0, limit) +
    `\n\n… truncated at ${limit} characters. Narrow the request (a smaller limit, a query, or fewer sections) to see the rest.`
  )
}

export function propsTable(props: CatalogProp[]): string {
  if (!props.length) return '_No own props — only the base props listed under "extends"._'
  const rows = props.map((p) => {
    const desc = p.description.replace(/\s+/g, ' ')
    const def = p.default ? ` Default: ${p.default.replace(/\s+/g, ' ')}` : ''
    return `| \`${p.name}\` | \`${p.type}\` | ${p.required ? 'yes' : 'no'} | ${desc}${def} |`
  })
  return ['| Prop | Type | Required | Description |', '|---|---|---|---|', ...rows].join('\n')
}

export function componentLine(c: CatalogComponent): string {
  const prim = c.primitive.kind === 'ark' ? `Ark \`${c.primitive.name}\`` : 'native element'
  const extra = c.exports.filter((e) => e.name !== c.name).map((e) => e.name)
  return `- **${c.name}** (${prim}${c.figmaNodeId ? `, Figma \`${c.figmaNodeId}\`` : ''}) — ${c.summary}${
    extra.length ? ` Also exports: ${extra.join(', ')}.` : ''
  }`
}

function exportBlock(e: CatalogExport, c: CatalogComponent): string {
  const out: string[] = []
  out.push(`### ${e.name} (${e.kind})`)
  if (e.description) out.push(e.description)
  if (e.extends?.length) out.push(`Extends: ${e.extends.map((x) => `\`${x}\``).join(' & ')}`)
  if (e.props) {
    out.push('', propsTable(e.props))
  }
  // Inline the union aliases the props refer to, so the agent sees the values.
  const referenced = c.types.filter((t) => e.props?.some((p) => p.type.includes(t.name)))
  if (referenced.length) {
    out.push('', ...referenced.map((t) => `- \`${t.name}\` = \`${t.type}\`${t.description ? ` — ${t.description}` : ''}`))
  }
  if (e.examples.length) {
    out.push('', '```tsx', ...e.examples, '```')
  }
  return out.join('\n')
}

function figmaBlock(f: import('./catalog-types.js').FigmaComponent, primary: boolean): string {
  const out: string[] = []
  out.push(
    `${primary ? '' : '#### '}${f.type === 'COMPONENT_SET' ? 'Component set' : 'Component'} \`${f.name}\` (node \`${f.id}\`, page "${f.page}"${
      f.variantCount > 1 ? `, ${f.variantCount} variants` : ''
    }, drawn at ${f.width}×${f.height}).${primary ? ' The description is the binding contract — its CODE block wins over anything else.' : ''}`,
    '',
    '```',
    f.description || '(no description)',
    '```',
  )
  const props = Object.entries(f.properties)
  if (props.length) {
    out.push('', 'Figma properties:')
    for (const [name, p] of props) {
      out.push(
        `- \`${name}\` (${p.type})${p.variantOptions?.length ? `: ${p.variantOptions.join(' | ')}` : ''}${
          p.defaultValue !== undefined ? ` — default \`${String(p.defaultValue)}\`` : ''
        }`,
      )
    }
  }
  return out.join('\n')
}

export type ComponentSection = 'usage' | 'props' | 'figma' | 'css' | 'stories' | 'types'

export function componentMarkdown(c: CatalogComponent, sections: ComponentSection[]): string {
  const want = new Set(sections)
  const out: string[] = []
  const prim =
    c.primitive.kind === 'ark'
      ? `Built on Ark UI \`${c.primitive.name}\` (${c.primitive.docs}); behaviour, keyboard handling and ARIA come from Ark, styling hangs off its \`data-*\` attributes.`
      : 'Built on the native element — the Figma description says there is no Ark primitive for it.'
  out.push(`# ${c.title === c.name ? c.name : `${c.title} (\`${c.name}\`)`}`)
  out.push('', c.summary, '', prim)
  out.push(
    '',
    `- Import: \`import { ${c.exports.map((e) => e.name).join(', ')} } from '${c.importPath}'\``,
    `- Source: \`${c.module}/\``,
    ...(c.figmaUrl ? [`- Figma: ${c.figmaUrl} (node \`${c.figmaNodeId}\`)`] : []),
    ...(c.storybookId ? [`- Storybook id: \`${c.storybookId}\`${STORYBOOK_URL ? ` → ${STORYBOOK_URL}/?path=/story/${c.stories[0]?.id ?? c.storybookId}` : ''}`] : []),
  )

  if (want.has('usage') || want.has('props')) {
    out.push('', '## Exports')
    for (const e of c.exports) out.push('', exportBlock(e, c))
  }
  if (want.has('types') && c.types.length) {
    out.push('', '## Types')
    for (const t of c.types) {
      out.push(`- \`${t.name}\` = \`${t.type}\`${t.description ? ` — ${t.description.replace(/\s+/g, ' ')}` : ''}`)
      if (t.props?.length) out.push('', propsTable(t.props), '')
    }
  }
  if (want.has('figma')) {
    out.push('', '## Figma contract')
    if (c.figma) {
      out.push(figmaBlock(c.figma, true))
      for (const r of c.figmaRelated ?? []) out.push('', figmaBlock(r, false))
    } else {
      out.push('_Figma description not captured in this build of the catalog. Open the node in Figma and read the description before implementing._')
    }
  }
  if (want.has('css')) {
    out.push('', '## CSS')
    if (c.css.note) out.push(c.css.note, '')
    out.push(`Class names: ${c.css.classes.map((x) => `\`.${x}\``).join(', ')}`)
    if (c.css.localProperties.length)
      out.push(`Component-local custom properties: ${c.css.localProperties.map((x) => `\`${x}\``).join(', ')}`)
    out.push(`Design tokens consumed (${c.css.tokens.length}): ${c.css.tokens.map((x) => `\`${x}\``).join(', ')}`)
  }
  if (want.has('stories') && c.stories.length) {
    out.push('', '## Stories')
    for (const s of c.stories)
      out.push(`- ${s.name}: \`${s.id}\`${STORYBOOK_URL ? ` → ${STORYBOOK_URL}/?path=/story/${s.id}` : ''}`)
  }
  return out.join('\n')
}

export function tokenLine(t: CatalogToken): string {
  const parts = [`\`${t.name}\`: \`${t.value}\``]
  if (t.resolved && t.resolved !== t.value) parts.push(`→ \`${t.resolved}\``)
  if (t.dark) parts.push(`| dark: \`${t.dark}\`${t.resolvedDark && t.resolvedDark !== t.dark ? ` → \`${t.resolvedDark}\`` : ''}`)
  else if (t.resolvedDark && t.resolvedDark !== t.resolved) parts.push(`| dark → \`${t.resolvedDark}\``)
  if (t.mobile) parts.push(`| mobile: \`${t.mobile}\`${t.resolvedMobile ? ` → \`${t.resolvedMobile}\`` : ''}`)
  return `- ${parts.join(' ')}`
}

export function tokenMarkdown(t: CatalogToken): string {
  const out = [`## ${t.name}`, `Group: ${t.group}`, tokenLine(t)]
  if (t.note) out.push(`Note: ${t.note.replace(/\s+/g, ' ')}`)
  if (t.references?.length) out.push(`References: ${t.references.map((r) => `\`${r}\``).join(', ')}`)
  const aliases = catalog.tokens.filter((x) => x.references?.includes(t.name)).map((x) => x.name)
  if (aliases.length) out.push(`Aliased by: ${aliases.map((a) => `\`${a}\``).join(', ')}`)
  if (t.usedBy?.length) out.push(`Used by components: ${t.usedBy.join(', ')}`)
  else out.push('Used by components: none yet')
  const group = t.name.match(/^(--sb-text-[a-z]+-[a-z0-9]+)-(family|weight|width|size|line-height|tracking|transform)$/)
  if (group) {
    out.push(
      `Part of the typography group \`${group[1]}-*\`. Consume the whole group — font-family / font-weight / font-stretch (width) / font-size / line-height / letter-spacing — never one member on its own.`,
    )
  }
  return out.join('\n')
}

export function iconMarkdown(i: CatalogIcon): string {
  return [
    `## ${i.name}`,
    `Glyph \`${i.glyph}\`, ${i.size}px grid${i.figmaNodeId ? `, Figma node \`${i.figmaNodeId}\`` : ''}.`,
    '',
    i.description,
    '',
    '```tsx',
    `import { ${i.name} } from '@steelbook/react'`,
    '',
    `// Decorative glyph next to a label: the label carries the meaning.`,
    `<${i.name} aria-hidden="true" />`,
    '',
    `// Never place an icon alone in a control without an accessible name on the control.`,
    '```',
    '',
    'SVG (path data verbatim from Figma, `currentColor` fill):',
    '```svg',
    i.svg,
    '```',
  ].join('\n')
}

export function paginate<T>(items: T[], limit: number, offset: number) {
  const page = items.slice(offset, offset + limit)
  return {
    page,
    total: items.length,
    offset,
    limit,
    has_more: offset + page.length < items.length,
    next_offset: offset + page.length < items.length ? offset + page.length : null,
  }
}

export function ok(text: string, structured?: Record<string, unknown>) {
  return {
    content: [{ type: 'text' as const, text: truncate(text) }],
    ...(structured ? { structuredContent: structured } : {}),
  }
}

export function fail(message: string, structured?: Record<string, unknown>) {
  return {
    content: [{ type: 'text' as const, text: message }],
    isError: true as const,
    ...(structured ? { structuredContent: { error: message, ...structured } } : { structuredContent: { error: message } }),
  }
}
