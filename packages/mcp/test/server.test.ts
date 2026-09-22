import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Client } from '@modelcontextprotocol/client'
import { InMemoryTransport } from '@modelcontextprotocol/server'
import { createSteelbookServer, normalizeValue } from '../src/server.js'
import { catalog } from '../src/catalog.js'

type ToolResult = { isError?: boolean; content: { type: string; text: string }[]; structuredContent?: Record<string, unknown> }

let client: Client
let server: ReturnType<typeof createSteelbookServer>

const call = async (name: string, args: Record<string, unknown> = {}) =>
  (await client.callTool({ name, arguments: args })) as unknown as ToolResult
const text = (r: ToolResult) => r.content[0]!.text

beforeAll(async () => {
  const [a, b] = InMemoryTransport.createLinkedPair()
  server = createSteelbookServer()
  await server.connect(a)
  client = new Client({ name: 'test', version: '0' })
  await client.connect(b)
})

afterAll(async () => {
  await client.close()
  await server.close()
})

describe('catalog', () => {
  it('covers every export of @steelbook/react', () => {
    expect(catalog.counts.components).toBe(51)
    expect(catalog.counts.icons).toBe(40)
    expect(catalog.counts.tokens).toBeGreaterThan(280)
    expect(catalog.components.every((c) => c.figmaNodeId && c.figma)).toBe(true)
    expect(catalog.icons.every((i) => i.paths.length > 0 && i.svg.includes('currentColor'))).toBe(true)
  })
})

describe('tools', () => {
  it('lists every tool with annotations and schemas', async () => {
    const { tools } = await client.listTools()
    const names = tools.map((t) => t.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'steelbook_get_started',
        'steelbook_get_setup',
        'steelbook_get_guidelines',
        'steelbook_list_components',
        'steelbook_get_component',
        'steelbook_search',
        'steelbook_list_tokens',
        'steelbook_get_token',
        'steelbook_find_token',
        'steelbook_list_icons',
        'steelbook_get_icon',
        'steelbook_lint_css',
        'steelbook_review_usage',
      ]),
    )
    for (const t of tools) {
      expect(t.name.startsWith('steelbook_')).toBe(true)
      expect(t.annotations?.readOnlyHint).toBe(true)
      expect(t.description!.length).toBeGreaterThan(40)
    }
  })

  it('get_started returns the overview', async () => {
    const r = await call('steelbook_get_started')
    expect(r.isError).toBeFalsy()
    expect(text(r)).toContain('Figma is the source of truth')
    expect(text(r)).toContain('steelbook_list_components')
  })

  it('list_components filters and paginates', async () => {
    const r = await call('steelbook_list_components', { query: 'date', limit: 5 })
    expect(text(r)).toContain('DatePicker')
    const s = r.structuredContent as { total: number; has_more: boolean }
    expect(s.total).toBeGreaterThanOrEqual(1)
    const page = await call('steelbook_list_components', { limit: 10, offset: 0 })
    const ps = page.structuredContent as { has_more: boolean; next_offset: number }
    expect(ps.has_more).toBe(true)
    expect(ps.next_offset).toBe(10)
  })

  it('get_component returns props, examples and the Figma contract', async () => {
    const r = await call('steelbook_get_component', { name: 'Button' })
    const t = text(r)
    expect(t).toContain("import { Button } from '@steelbook/react'")
    expect(t).toContain('| `tone` |')
    expect(t).toContain("'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'")
    expect(t).toContain('<Button onClick={save}>Save</Button>')
    expect(t).toContain('CODE:')
    expect(t).toContain('node `14:2`')
  })

  it('get_component resolves aliases: title, slug, node id', async () => {
    expect(text(await call('steelbook_get_component', { name: 'toast' }))).toContain('Toaster')
    expect(text(await call('steelbook_get_component', { name: 'date-picker' }))).toContain('DatePicker')
    expect(text(await call('steelbook_get_component', { name: '14:2' }))).toContain('# Button')
  })

  it('get_component suggests on a typo', async () => {
    const r = await call('steelbook_get_component', { name: 'Buton' })
    expect(r.isError).toBe(true)
    expect(text(r)).toContain('Did you mean: Button')
  })

  it('search ranks across kinds', async () => {
    const r = await call('steelbook_search', { query: 'focus ring', limit: 15 })
    const hits = (r.structuredContent as { hits: { kind: string; name: string }[] }).hits
    expect(hits.some((h) => h.kind === 'token' && h.name === '--sb-border-focus')).toBe(true)
    expect(hits.some((h) => h.kind === 'guideline')).toBe(true)
  })

  it('find_token maps raw values to tokens, semantic first', async () => {
    const black = await call('steelbook_find_token', { value: '#000', property: 'color' })
    const m = (black.structuredContent as { matches: { name: string; semantic: boolean }[] }).matches
    expect(m[0]!.semantic).toBe(true)
    expect(m.map((x) => x.name)).toContain('--sb-text-primary')
    expect(m.map((x) => x.name)).toContain('--sb-black')

    const gap = await call('steelbook_find_token', { value: '12px', property: 'gap' })
    expect(text(gap)).toContain('--sb-gap-sm')
    expect(text(gap)).not.toContain('--sb-text-')

    const none = await call('steelbook_find_token', { value: '13px', property: 'padding' })
    expect(text(none)).toContain('flag it')
  })

  it('get_token explains a token and its consumers', async () => {
    const r = await call('steelbook_get_token', { names: ['gap-sm', 'var(--sb-text-heading-1-size)', 'nope'] })
    const t = text(r)
    expect(t).toContain('--sb-gap-sm')
    expect(t).toContain('12px')
    expect(t).toContain('Used by components: Button')
    expect(t).toContain('mobile')
    expect(t).toContain('typography group')
    expect(t).toContain('Not a Steelbook token')
  })

  it('list_tokens filters by group', async () => {
    const r = await call('steelbook_list_tokens', { group: 'Semantic color', limit: 100 })
    const s = r.structuredContent as { total: number }
    expect(s.total).toBeGreaterThan(40)
    expect(text(r)).toContain('dark')
  })

  it('get_icon returns verbatim SVG', async () => {
    const r = await call('steelbook_get_icon', { name: 'chevron-down', format: 'svg' })
    expect(text(r)).toMatch(/^<svg width="16"/)
    expect(text(r)).toContain('fill="currentColor"')
    const missing = await call('steelbook_get_icon', { name: 'bug' })
    expect(missing.isError).toBe(true)
    expect(text(missing)).toContain('icons/bug')
  })

  it('list_icons can show Figma-only sets', async () => {
    const r = await call('steelbook_list_icons', { query: 'bug', include_figma_only: true })
    expect(text(r)).toContain('Figma-only')
    expect(text(r)).toContain('bug')
  })

  it('lint_css runs the repo gate', async () => {
    const bad = await call('steelbook_lint_css', { css: '.sb-card { padding: 12px; color: #333; }\n.card { font-size: 14px }' })
    const s = bad.structuredContent as { passed: boolean; problems: { rule: string }[] }
    expect(s.passed).toBe(false)
    const rules = s.problems.map((p) => p.rule)
    expect(rules).toContain('color-no-hex')
    expect(rules).toContain('declaration-property-value-disallowed-list')
    expect(rules).toContain('selector-class-pattern')

    const good = await call('steelbook_lint_css', {
      css: '.sb-card {\n  padding: var(--sb-space-3);\n  color: var(--sb-text-primary);\n  gap: calc(var(--sb-gap-sm) - var(--sb-stroke-default));\n}\n',
    })
    expect((good.structuredContent as { passed: boolean }).passed).toBe(true)
  })

  it('review_usage flags the classic mistakes', async () => {
    const code = [
      "import { Button, CheckIcon } from '@steelbook/react'",
      'export const X = () => (',
      "  <div style={{ color: '#fff', padding: 8 }}>",
      '    <Button state="hover" tone="primary">Go</Button>',
      '    <Button><CheckIcon /></Button>',
      '    <svg viewBox="0 0 16 16" />',
      '  </div>',
      ')',
    ].join('\n')
    const r = await call('steelbook_review_usage', { code })
    const s = r.structuredContent as { passed: boolean; findings: { rule: string }[]; componentsUsed: string[] }
    expect(s.passed).toBe(false)
    const rules = s.findings.map((f) => f.rule)
    expect(rules).toContain('state-is-css')
    expect(rules).toContain('tokens-only')
    expect(rules).toContain('accessible-name')
    expect(rules).toContain('assets-from-figma')
    expect(rules).toContain('icon-decorative')
    expect(s.componentsUsed).toEqual(['Button', 'CheckIcon'])

    const clean = await call('steelbook_review_usage', {
      code: "import { Button, ArrowLeftIcon } from '@steelbook/react'\nexport const Back = () => <Button tone=\"ghost\" iconLeft={<ArrowLeftIcon aria-hidden=\"true\" />}>Back</Button>",
    })
    expect((clean.structuredContent as { passed: boolean }).passed).toBe(true)
  })

  it('get_guidelines lists and reads sections', async () => {
    const list = await call('steelbook_get_guidelines')
    expect(text(list)).toContain('rules/non-negotiables')
    const one = await call('steelbook_get_guidelines', { section: 'focus ring' })
    expect(text(one)).toContain('--sb-stroke-heavy')
  })
})

describe('resources and prompts', () => {
  it('lists static and templated resources', async () => {
    const { resources } = await client.listResources()
    const uris = resources.map((r) => r.uri)
    expect(uris).toContain('steelbook://overview')
    expect(uris).toContain('steelbook://tokens.css')
    expect(uris).toContain('steelbook://components/Button')
    expect(uris).toContain('steelbook://icons/check.svg')
    const { resourceTemplates } = await client.listResourceTemplates()
    expect(resourceTemplates.map((t) => t.uriTemplate)).toContain('steelbook://components/{name}')
  })

  it('reads a component and the token stylesheet', async () => {
    const c = await client.readResource({ uri: 'steelbook://components/Switch' })
    expect((c.contents[0] as { text: string }).text).toContain('# Switch')
    const css = await client.readResource({ uri: 'steelbook://tokens.css' })
    expect((css.contents[0] as { text: string }).text).toContain('--sb-border-focus')
  })

  it('serves the prompts', async () => {
    const { prompts } = await client.listPrompts()
    expect(prompts.map((p) => p.name)).toEqual(expect.arrayContaining(['build-with-steelbook', 'review-steelbook-code']))
    const p = await client.getPrompt({ name: 'build-with-steelbook', arguments: { task: 'a settings page' } })
    expect((p.messages[0]!.content as { text: string }).text).toContain('a settings page')
  })
})

describe('normalizeValue', () => {
  it('canonicalises colours and lengths', () => {
    expect(normalizeValue('#FFF')).toBe('#ffffff')
    expect(normalizeValue('rgb(63, 63, 63)')).toBe('#3f3f3f')
    expect(normalizeValue('0.75rem')).toBe('12px')
    expect(normalizeValue('12')).toBe('12px')
    expect(normalizeValue('1.2')).toBe('1.2')
    expect(normalizeValue('0px')).toBe('0')
  })
})
