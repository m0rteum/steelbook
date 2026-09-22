import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { readFileSync } from 'node:fs'
import { catalog, findComponent, findIcon, findToken, findGuideline, componentNames, suggest } from './catalog.js'
import {
  componentLine,
  componentMarkdown,
  tokenLine,
  tokenMarkdown,
  iconMarkdown,
  paginate,
  ok,
  fail,
  type ComponentSection,
} from './format.js'
import { lintCss } from './lint.js'
import { reviewUsage } from './review.js'
import { overviewMarkdown, setupMarkdown, workflowMarkdown } from './docs.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }

export const SERVER_NAME = 'steelbook'
export const SERVER_VERSION: string = pkg.version

const INSTRUCTIONS = `Steelbook is a React design system built from a Figma file; Figma is the source of truth and code implements it exactly. This server exposes the ${catalog.counts.components} components, ${catalog.counts.icons} icons, ${catalog.counts.tokens} design tokens and the house rules.

Start with steelbook_get_started. Before writing UI: steelbook_list_components → steelbook_get_component (reuse, never regenerate). Every CSS value must be a var(--sb-*) token — steelbook_find_token turns a raw value into the right token, steelbook_lint_css runs the same gate CI runs. State (hover/active/focus/disabled) is CSS, never a prop. Icon-only controls need aria-label. Run steelbook_review_usage on finished JSX.`

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const

const ResponseFormat = z
  .enum(['markdown', 'json'])
  .default('markdown')
  .describe("'markdown' for readable output (default), 'json' for the raw catalog records")

const Limit = z.number().int().min(1).max(100).default(25).describe('Page size (1–100, default 25)')
const Offset = z.number().int().min(0).default(0).describe('Number of items to skip; use next_offset from a previous call')

function notFoundComponent(name: string) {
  const near = suggest(name, componentNames())
  return fail(
    `No Steelbook component named "${name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Call steelbook_list_components to see all ${catalog.counts.components}, or steelbook_search with a description of what you need.`,
    { suggestions: near },
  )
}

/** Builds a fresh server. Stateless transports call this once per request. */
export function createSteelbookServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION, title: 'Steelbook Design System' }, { instructions: INSTRUCTIONS })

  /* ---------------------------------------------------------------- */
  /* orientation                                                       */
  /* ---------------------------------------------------------------- */

  server.registerTool(
    'steelbook_get_started',
    {
      title: 'Get started with Steelbook',
      description:
        'Start here. Returns what Steelbook is, how to install and wire it up (tokens stylesheet, Archivo variable font, dark theme attribute), the non-negotiable house rules, and which tool to call for what. No arguments.',
      inputSchema: z.object({}),
      annotations: READ_ONLY,
    },
    async () =>
      ok(overviewMarkdown(), {
        counts: catalog.counts,
        source: catalog.source,
        tools: [
          'steelbook_list_components',
          'steelbook_get_component',
          'steelbook_search',
          'steelbook_list_tokens',
          'steelbook_get_token',
          'steelbook_find_token',
          'steelbook_list_icons',
          'steelbook_get_icon',
          'steelbook_get_guidelines',
          'steelbook_get_setup',
          'steelbook_lint_css',
          'steelbook_review_usage',
        ],
      }),
  )

  server.registerTool(
    'steelbook_get_setup',
    {
      title: 'Installation and app wiring',
      description:
        'How to add Steelbook to an app: workspace dependency on @steelbook/react (consumed from source, no build step), importing packages/tokens/tokens.css, the required Archivo variable-font <link>, the data-theme="dark" attribute, the 768px typography breakpoint, and a first component render. Returns copy-pasteable snippets.',
      inputSchema: z.object({}),
      annotations: READ_ONLY,
    },
    async () => ok(setupMarkdown()),
  )

  server.registerTool(
    'steelbook_get_guidelines',
    {
      title: 'House rules and documentation',
      description:
        "The working agreement every Steelbook change must follow (CLAUDE.md) and the README. With no `section`, lists every section id with a one-line summary. With `section`, returns that section's full text. Key ids: rules/non-negotiables, rules/house-patterns, rules/house-patterns-focus-ring, rules/house-patterns-disabled-skin, rules/house-patterns-fluid-width, rules/known-gaps-do-not-silently-work-around-these, readme/using-it-theming.",
      inputSchema: z.object({
        section: z.string().optional().describe('Section id (e.g. "rules/non-negotiables") or a title fragment. Omit to list sections.'),
        source: z.enum(['rules', 'readme', 'all']).default('all').describe("Limit the listing to CLAUDE.md ('rules') or README ('readme')"),
      }),
      outputSchema: z.object({
        sections: z.array(z.object({ id: z.string(), title: z.string(), source: z.string(), body: z.string().optional() })),
      }),
      annotations: READ_ONLY,
    },
    async ({ section, source }) => {
      if (section) {
        const g = findGuideline(section)
        if (!g) {
          const near = suggest(section, catalog.guidelines.map((x) => x.id))
          return fail(`No guideline section "${section}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Call without \`section\` to list them.`)
        }
        return ok(`# ${g.title}\n_${g.source === 'rules' ? 'CLAUDE.md — binding' : 'README'}_\n\n${g.body}`, { sections: [g] })
      }
      const list = catalog.guidelines.filter((g) => source === 'all' || g.source === source)
      const text = [
        '# Steelbook guidelines',
        '',
        'Sections from CLAUDE.md (binding rules) and README.md. Call again with `section` set to an id for the full text.',
        '',
        ...list.map((g) => `- \`${g.id}\` — ${g.title}: ${g.body.replace(/\s+/g, ' ').slice(0, 140)}…`),
        '',
        workflowMarkdown(),
      ].join('\n')
      return ok(text, { sections: list.map(({ id, title, source }) => ({ id, title, source })) })
    },
  )

  /* ---------------------------------------------------------------- */
  /* components                                                        */
  /* ---------------------------------------------------------------- */

  server.registerTool(
    'steelbook_list_components',
    {
      title: 'List components',
      description:
        'Lists the Steelbook React components with a one-line summary, the primitive each builds on (Ark UI or native element) and its Figma node id. Filter with `query` (matches name, summary and prop names) or `primitive`. Always check here before writing new UI: if a component exists, import it; building a second version is a defect.',
      inputSchema: z.object({
        query: z.string().optional().describe('Free-text filter, e.g. "input", "overlay", "date"'),
        primitive: z.enum(['ark', 'native']).optional().describe('Only components built on Ark UI, or only native-element ones'),
        limit: Limit,
        offset: Offset,
        response_format: ResponseFormat,
      }),
      outputSchema: z.object({
        components: z.array(
          z.object({
            name: z.string(),
            title: z.string(),
            summary: z.string(),
            primitive: z.string(),
            figmaNodeId: z.string().optional(),
            exports: z.array(z.string()),
          }),
        ),
        total: z.number(),
        offset: z.number(),
        limit: z.number(),
        has_more: z.boolean(),
        next_offset: z.number().nullable(),
      }),
      annotations: READ_ONLY,
    },
    async ({ query, primitive, limit, offset, response_format }) => {
      let list = catalog.components
      if (primitive) list = list.filter((c) => c.primitive.kind === primitive)
      if (query) {
        const q = query.toLowerCase()
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.slug.includes(q) ||
            c.summary.toLowerCase().includes(q) ||
            c.exports.some((e) => e.name.toLowerCase().includes(q) || e.props?.some((p) => p.name.toLowerCase().includes(q))) ||
            (c.figma?.description.toLowerCase().includes(q) ?? false),
        )
      }
      const page = paginate(list, limit, offset)
      const records = page.page.map((c) => ({
        name: c.name,
        title: c.title,
        summary: c.summary,
        primitive: c.primitive.kind === 'ark' ? `ark:${c.primitive.name}` : 'native',
        ...(c.figmaNodeId ? { figmaNodeId: c.figmaNodeId } : {}),
        exports: c.exports.map((e) => e.name),
      }))
      const structured = { components: records, total: page.total, offset: page.offset, limit: page.limit, has_more: page.has_more, next_offset: page.next_offset }
      if (response_format === 'json') return ok(JSON.stringify(structured, null, 2), structured)
      const text = [
        `# Steelbook components (${page.offset + 1}–${page.offset + page.page.length} of ${page.total}${query ? ` matching "${query}"` : ''})`,
        '',
        ...page.page.map(componentLine),
        '',
        page.has_more ? `More available: call again with offset=${page.next_offset}.` : 'End of list.',
        'Call steelbook_get_component with a name for props, examples and the Figma contract.',
      ].join('\n')
      return ok(text, structured)
    },
  )

  server.registerTool(
    'steelbook_get_component',
    {
      title: 'Get a component',
      description:
        "Everything needed to use one component correctly: import line, exports, props table with types and defaults, usage examples from the source JSDoc, the Figma component description (the binding contract, including its CODE block and property → prop mapping), the CSS class names and tokens it consumes, and Storybook story ids. `name` accepts the export name (Button), the Storybook title (Toast), the directory (date-picker) or a Figma node id (14:2). Use `sections` to trim the response.",
      inputSchema: z.object({
        name: z.string().describe('Component name, e.g. "Button", "DatePicker", "toast", or a Figma node id'),
        sections: z
          .array(z.enum(['usage', 'props', 'types', 'figma', 'css', 'stories']))
          .default(['usage', 'props', 'types', 'figma', 'stories'])
          .describe('Which sections to include. Default: everything except css. "usage" and "props" both return the exports block.'),
        response_format: ResponseFormat,
      }),
      annotations: READ_ONLY,
    },
    async ({ name, sections, response_format }) => {
      const c = findComponent(name)
      if (!c) return notFoundComponent(name)
      if (response_format === 'json') {
        const { tokensCss: _unused, ...rest } = { ...c, tokensCss: undefined }
        void _unused
        return ok(JSON.stringify(rest, null, 2), { component: c })
      }
      return ok(componentMarkdown(c, sections as ComponentSection[]), { component: c })
    },
  )

  /* ---------------------------------------------------------------- */
  /* search                                                            */
  /* ---------------------------------------------------------------- */

  server.registerTool(
    'steelbook_search',
    {
      title: 'Search the whole system',
      description:
        'Free-text search across components, tokens, icons and guideline sections at once. Use it when you know what you need but not what it is called ("something to pick a date", "focus ring colour", "chevron"). Returns ranked hits with the tool to call next for each.',
      inputSchema: z.object({
        query: z.string().min(1).describe('What you are looking for'),
        kinds: z
          .array(z.enum(['component', 'token', 'icon', 'guideline']))
          .optional()
          .describe('Restrict to some kinds. Default: all.'),
        limit: z.number().int().min(1).max(50).default(15),
      }),
      outputSchema: z.object({
        hits: z.array(z.object({ kind: z.string(), name: z.string(), score: z.number(), summary: z.string(), next: z.string() })),
      }),
      annotations: READ_ONLY,
    },
    async ({ query, kinds, limit }) => {
      // Token names abbreviate; let plain words reach them.
      const ALIASES: Record<string, string> = { background: 'bg', backgrounds: 'bg', colour: 'color', colours: 'color', colors: 'color', spacing: 'space', padding: 'space', margin: 'space', outline: 'focus', typography: 'text', font: 'text', heading: 'heading', radius: 'radius', rounded: 'radius', stroke: 'stroke', 'border-width': 'stroke' }
      const terms = [
        ...new Set(
          query
            .toLowerCase()
            .split(/[^a-z0-9-]+/)
            .filter((t) => t.length > 1)
            .flatMap((t) => (ALIASES[t] && ALIASES[t] !== t ? [t, ALIASES[t]!] : [t])),
        ),
      ]
      const want = new Set(kinds ?? ['component', 'token', 'icon', 'guideline'])
      // Names weigh far more than prose, and hits covering more of the query
      // terms rank higher, so an exact token or component name beats a long
      // description that merely mentions one word.
      const score = (fields: [string, number][]) => {
        let s = 0
        const matched = new Set<string>()
        for (const [text, weight] of fields) {
          const lower = text.toLowerCase()
          const words = lower.split(/[^a-z0-9]+/)
          for (const t of terms) {
            if (lower === t) {
              s += weight * 6
              matched.add(t)
            } else if (words.includes(t)) {
              s += weight * 3
              matched.add(t)
            } else if (lower.includes(t)) {
              s += weight
              matched.add(t)
            }
          }
        }
        return s ? Math.round(s * (0.5 + matched.size / Math.max(1, terms.length))) : 0
      }
      const hits: { kind: string; name: string; score: number; summary: string; next: string }[] = []
      if (want.has('component'))
        for (const c of catalog.components) {
          const s = score([
            [c.name, 10],
            [c.title, 10],
            [c.slug, 8],
            [c.summary, 2],
            [c.exports.flatMap((e) => e.props?.map((p) => p.name) ?? []).join(' '), 3],
            [c.exports.map((e) => e.description).join(' ') + ' ' + (c.figma?.description ?? ''), 1],
          ])
          if (s) hits.push({ kind: 'component', name: c.name, score: s, summary: c.summary, next: `steelbook_get_component name="${c.name}"` })
        }
      if (want.has('token'))
        for (const t of catalog.tokens) {
          const s = score([
            [t.name.slice(5), 10],
            [t.group, 1],
            [t.note ?? '', 1],
            [t.value + ' ' + (t.resolved ?? ''), 3],
          ])
          if (s) hits.push({ kind: 'token', name: t.name, score: s, summary: tokenLine(t).slice(2), next: `steelbook_get_token names=["${t.name}"]` })
        }
      if (want.has('icon'))
        for (const i of catalog.icons) {
          const s = score([
            [i.glyph, 10],
            [i.name, 4],
            [i.description.split('\n')[0] ?? '', 1],
          ])
          if (s) hits.push({ kind: 'icon', name: i.name, score: s, summary: `glyph ${i.glyph}`, next: `steelbook_get_icon name="${i.name}"` })
        }
      if (want.has('guideline'))
        for (const g of catalog.guidelines) {
          const s = score([
            [g.title, 8],
            [g.id.split('/')[1] ?? '', 4],
            [g.body, 1],
          ])
          if (s) hits.push({ kind: 'guideline', name: g.id, score: s, summary: g.body.replace(/\s+/g, ' ').slice(0, 120), next: `steelbook_get_guidelines section="${g.id}"` })
        }
      hits.sort((a, b) => b.score - a.score)
      const top = hits.slice(0, limit)
      if (!top.length) {
        const figmaIconHits = catalog.figmaIcons.filter((f) => terms.some((t) => f.name.includes(t))).slice(0, 10)
        return ok(
          `No matches for "${query}".${
            figmaIconHits.length
              ? ` The Figma file does hold icon sets named ${figmaIconHits.map((f) => f.name.replace('icons/', '')).join(', ')}, but they are not exported to code yet — ask for an export rather than redrawing one.`
              : ''
          } Try broader terms, or steelbook_list_components / steelbook_list_tokens to browse.`,
          { hits: [] },
        )
      }
      const text = [
        `# Search: "${query}" — ${top.length} of ${hits.length} hits`,
        '',
        ...top.map((h) => `- [${h.kind}] **${h.name}** — ${h.summary}\n  next: \`${h.next}\``),
      ].join('\n')
      return ok(text, { hits: top })
    },
  )

  /* ---------------------------------------------------------------- */
  /* tokens                                                            */
  /* ---------------------------------------------------------------- */

  const groups = [...new Set(catalog.tokens.map((t) => t.group))]

  server.registerTool(
    'steelbook_list_tokens',
    {
      title: 'List design tokens',
      description: `Lists the --sb-* custom properties from tokens.css with their light/dark and desktop/mobile values, resolved through aliases to the raw value. Filter by \`group\` (${groups.map((g) => `"${g}"`).join(', ')}) or \`query\` (substring of the name, e.g. "gap", "text-heading", "border-focus"). Semantic tokens (text-*, bg-*, border-*, icon-*, gap-*, size-*, radius-*, stroke-*) are what components should reach for; primitives (gray-700, space-3) are the fallback when no semantic name carries the meaning.`,
      inputSchema: z.object({
        group: z.string().optional().describe('Exact group name or a fragment of it, e.g. "Semantic color", "Layout", "Text styles"'),
        query: z.string().optional().describe('Substring of the token name, without the --sb- prefix if you like'),
        limit: Limit,
        offset: Offset,
        response_format: ResponseFormat,
      }),
      annotations: READ_ONLY,
    },
    async ({ group, query, limit, offset, response_format }) => {
      let list = catalog.tokens
      if (group) {
        const g = group.toLowerCase()
        list = list.filter((t) => t.group.toLowerCase().includes(g))
        if (!list.length) return fail(`No token group matching "${group}". Groups: ${groups.join(' | ')}`)
      }
      if (query) {
        const q = query.toLowerCase().replace(/^--/, '').replace(/^sb-/, '')
        list = list.filter((t) => t.name.slice(5).includes(q))
      }
      const page = paginate(list, limit, offset)
      const structured = { tokens: page.page, total: page.total, offset: page.offset, limit: page.limit, has_more: page.has_more, next_offset: page.next_offset }
      if (response_format === 'json') return ok(JSON.stringify(structured, null, 2), structured)
      const text = [
        `# Tokens (${page.offset + 1}–${page.offset + page.page.length} of ${page.total})`,
        '',
        ...(!group && !query ? [`Groups: ${groups.join(' | ')}`, ''] : []),
        ...page.page.map((t) => `${tokenLine(t)} · ${t.group}`),
        '',
        page.has_more ? `More available: call again with offset=${page.next_offset}.` : 'End of list.',
      ].join('\n')
      return ok(text, structured)
    },
  )

  server.registerTool(
    'steelbook_get_token',
    {
      title: 'Get tokens',
      description:
        'Full detail for one or more tokens: value per mode (light/dark, desktop/mobile), the alias chain down to the raw value, what aliases it, and which components consume it. Names may be given with or without the --sb- prefix or var() wrapper.',
      inputSchema: z.object({
        names: z.array(z.string()).min(1).max(50).describe('Token names, e.g. ["--sb-border-focus", "gap-sm", "var(--sb-text-heading-1-size)"]'),
      }),
      annotations: READ_ONLY,
    },
    async ({ names }) => {
      const found = []
      const missing: string[] = []
      for (const n of names) {
        const t = findToken(n)
        if (t) found.push(t)
        else missing.push(n)
      }
      const text = [
        ...found.map(tokenMarkdown),
        ...missing.map((m) => {
          const near = suggest(m, catalog.tokens.map((t) => t.name))
          return `## ${m}\nNot a Steelbook token.${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} If the design uses a value with no token behind it, flag the gap — do not hardcode or snap to the nearest token.`
        }),
      ].join('\n\n')
      return { ...ok(text, { tokens: found, missing }), ...(found.length ? {} : { isError: true as const }) }
    },
  )

  server.registerTool(
    'steelbook_find_token',
    {
      title: 'Find the token for a raw value',
      description:
        'Given a raw CSS value from a design or a measurement — a hex colour (#3f3f3f), a length (12px, 0.75rem, or just 12), a font size, weight, line-height or letter-spacing — returns every token that resolves to it, semantic names first. Use this instead of hardcoding: if nothing matches, the design has a value with no token behind it and the gap must be flagged rather than snapped to the nearest token.',
      inputSchema: z.object({
        value: z.string().min(1).describe('Raw value, e.g. "#ff4f00", "12px", "1.2", "0.08em", "rgb(63, 63, 63)"'),
        property: z
          .string()
          .optional()
          .describe('CSS property the value is for (e.g. "padding", "color", "font-size", "border-width"). Narrows results to tokens of a fitting kind.'),
        mode: z.enum(['light', 'dark', 'any']).default('any').describe('For colours: match the light value, the dark value, or either'),
      }),
      outputSchema: z.object({
        matches: z.array(z.object({ name: z.string(), value: z.string(), resolved: z.string(), group: z.string(), semantic: z.boolean() })),
        normalized: z.string(),
      }),
      annotations: READ_ONLY,
    },
    async ({ value, property, mode }) => {
      const normalized = normalizeValue(value)
      const prop = property?.toLowerCase() ?? ''
      const kindFor = (name: string) =>
        /^--sb-(text|bg|border|icon)-|^--sb-(gray|orange|red|green|blue|yellow|alpha)-|^--sb-(black|white|shadow-color)$/.test(name) &&
        !/^--sb-text-[a-z]+-[a-z0-9]+-/.test(name)
          ? 'color'
          : /^--sb-text-[a-z]+-[a-z0-9]+-/.test(name) || /^--sb-(font|line-height|tracking)/.test(name)
            ? 'type'
            : 'length'
      const wantKind = /color|background|border-color|fill|stroke|outline-color|shadow/.test(prop)
        ? 'color'
        : /font|line-height|letter-spacing/.test(prop)
          ? 'type'
          : /padding|margin|gap|width|height|size|radius|inset|border/.test(prop)
            ? 'length'
            : undefined
      const semantic = (name: string) => !/^--sb-(gray|orange|red|green|blue|yellow|alpha|space|font|line-height|tracking|black|white|border-[123]$)/.test(name)
      const matches = catalog.tokens
        .filter((t) => {
          const light = normalizeValue(t.resolved ?? t.value)
          const dark = t.resolvedDark ? normalizeValue(t.resolvedDark) : undefined
          const hit = mode === 'light' ? light === normalized : mode === 'dark' ? dark === normalized : light === normalized || dark === normalized
          if (!hit) return false
          if (wantKind && kindFor(t.name) !== wantKind) return false
          return true
        })
        .map((t) => ({ name: t.name, value: t.value, resolved: t.resolved ?? t.value, group: t.group, semantic: semantic(t.name) }))
        .sort((a, b) => Number(b.semantic) - Number(a.semantic) || a.name.localeCompare(b.name))
      if (!matches.length) {
        return ok(
          `No token resolves to \`${value}\`${property ? ` for \`${property}\`` : ''}. This is a gap between the design and the token layer: stop and flag it rather than hardcoding the value or snapping to the nearest token. (Sub-pixel strokes and 1.5px borders are known gaps — see steelbook_get_guidelines section="rules/known-gaps-do-not-silently-work-around-these".)`,
          { matches: [], normalized },
        )
      }
      const text = [
        `# Tokens resolving to \`${value}\``,
        '',
        ...matches.map((m) => `- \`var(${m.name})\` — ${m.group}${m.semantic ? '' : ' (primitive: prefer a semantic alias when one carries the meaning)'}${m.value !== m.resolved ? ` · ${m.value}` : ''}`),
        '',
        matches.some((m) => m.semantic)
          ? 'Pick the semantic token whose name matches the role the value plays in the design.'
          : 'Only primitives match. Use one only if no semantic token carries the meaning; otherwise flag the gap.',
      ].join('\n')
      return ok(text, { matches, normalized })
    },
  )

  /* ---------------------------------------------------------------- */
  /* icons                                                             */
  /* ---------------------------------------------------------------- */

  server.registerTool(
    'steelbook_list_icons',
    {
      title: 'List icons',
      description: `Lists the icon components exported from @steelbook/react (${catalog.counts.icons}, all on the 16px grid, filled with currentColor) and, with \`include_figma_only\`, the ${catalog.figmaIcons.length} icon sets in the Figma file that are not exported to code yet. Never redraw an icon from memory: if the glyph you need is Figma-only, ask for it to be exported.`,
      inputSchema: z.object({
        query: z.string().optional().describe('Substring of the glyph name, e.g. "chevron", "arrow", "check"'),
        include_figma_only: z.boolean().default(false).describe('Also list Figma icon sets that have no code export'),
        limit: Limit,
        offset: Offset,
      }),
      annotations: READ_ONLY,
    },
    async ({ query, include_figma_only, limit, offset }) => {
      const q = query?.toLowerCase()
      const code = catalog.icons.filter((i) => !q || i.glyph.includes(q) || i.name.toLowerCase().includes(q))
      const page = paginate(code, limit, offset)
      const lines = page.page.map((i) => `- **${i.name}** — glyph \`${i.glyph}\`${i.figmaNodeId ? `, Figma \`${i.figmaNodeId}\`` : ''}`)
      let figmaOnly: { name: string; styles: string[] }[] = []
      if (include_figma_only) {
        const exported = new Set(catalog.icons.map((i) => i.glyph))
        figmaOnly = catalog.figmaIcons
          .map((f) => ({ name: f.name.replace(/^icons\//, ''), styles: f.styles }))
          .filter((f) => !exported.has(f.name) && (!q || f.name.includes(q)))
      }
      const text = [
        `# Icons in code (${page.offset + 1}–${page.offset + page.page.length} of ${page.total})`,
        '',
        ...(lines.length ? lines : ['_none match_']),
        '',
        `Usage: \`import { ${page.page[0]?.name ?? 'CheckIcon'} } from '@steelbook/react'\` then \`<${page.page[0]?.name ?? 'CheckIcon'} aria-hidden="true" />\` beside a label. Icon-only controls need aria-label on the control.`,
        page.has_more ? `More available: call again with offset=${page.next_offset}.` : '',
        ...(include_figma_only
          ? ['', `# Figma-only icon sets (${figmaOnly.length}, not exported to code)`, ...figmaOnly.slice(0, 200).map((f) => `- ${f.name} (${f.styles.join('/')})`)]
          : ['', `The Figma file holds ${catalog.figmaIcons.length} icon sets in total; pass include_figma_only=true to see the ones not yet exported.`]),
      ].join('\n')
      return ok(text, { icons: page.page.map(({ name, glyph, figmaNodeId }) => ({ name, glyph, figmaNodeId })), total: page.total, has_more: page.has_more, next_offset: page.next_offset, figmaOnly })
    },
  )

  server.registerTool(
    'steelbook_get_icon',
    {
      title: 'Get an icon',
      description:
        'One icon: the React import and usage, and its SVG with the path data exactly as exported from Figma (currentColor fill). `name` accepts the export name (ChevronDownIcon) or the glyph (chevron-down).',
      inputSchema: z.object({
        name: z.string().describe('Icon export name or glyph name'),
        format: z.enum(['markdown', 'svg', 'json']).default('markdown').describe("'svg' returns only the markup"),
      }),
      annotations: READ_ONLY,
    },
    async ({ name, format }) => {
      const i = findIcon(name)
      if (!i) {
        const near = suggest(name, catalog.icons.map((x) => x.glyph))
        const figmaOnly = catalog.figmaIcons.filter((f) => f.name.includes(name.toLowerCase().replace(/icon$/, ''))).slice(0, 5)
        return fail(
          `No icon "${name}" in code.${near.length ? ` Did you mean: ${near.join(', ')}?` : ''}${
            figmaOnly.length ? ` The Figma file has ${figmaOnly.map((f) => f.name).join(', ')} — not exported yet; ask for an export instead of redrawing.` : ''
          }`,
        )
      }
      if (format === 'svg') return ok(i.svg, { icon: i })
      if (format === 'json') return ok(JSON.stringify(i, null, 2), { icon: i })
      return ok(iconMarkdown(i), { icon: i })
    },
  )

  /* ---------------------------------------------------------------- */
  /* checks                                                            */
  /* ---------------------------------------------------------------- */

  server.registerTool(
    'steelbook_lint_css',
    {
      title: 'Lint CSS against the token gate',
      description:
        'Runs the exact Stylelint configuration CI runs on component CSS: no hex/rgb/hsl colours, no raw px/rem/em lengths in spacing, sizing, radius or border properties, no typography outside the --sb-text-* groups, class names must follow sb-<block>__<element>--<modifier>, custom properties must be --sb- prefixed. Returns each violation with line, rule and a fix hint. Run it on any CSS before reporting it done.',
      inputSchema: z.object({
        css: z.string().min(1).describe('The CSS to check'),
        filename: z.string().default('Component.css').describe('Name shown in messages'),
      }),
      outputSchema: z.object({
        passed: z.boolean(),
        problems: z.array(z.object({ line: z.number(), column: z.number(), rule: z.string(), severity: z.string(), message: z.string(), hint: z.string().optional() })),
      }),
      annotations: { ...READ_ONLY, idempotentHint: true },
    },
    async ({ css, filename }) => {
      const result = await lintCss(css, filename)
      const text = result.passed
        ? `✓ ${filename} passes the Steelbook CSS gate (${result.rulesRun} rules).`
        : [
            `✗ ${filename}: ${result.problems.length} problem${result.problems.length === 1 ? '' : 's'}`,
            '',
            ...result.problems.map((p) => `- line ${p.line}:${p.column} [${p.rule}] ${p.message}${p.hint ? `\n  → ${p.hint}` : ''}`),
          ].join('\n')
      return ok(text, { passed: result.passed, problems: result.problems })
    },
  )

  server.registerTool(
    'steelbook_review_usage',
    {
      title: 'Review JSX/TSX that uses Steelbook',
      description:
        'Static review of React code against the house rules: unknown Steelbook components or props, a `state` prop (state is CSS, never a prop), icons without aria-hidden or icon-only controls without an accessible name, inline styles with raw colours or lengths, hand-written <svg> icons, missing required props. Heuristic and fast — it does not replace tsc or a render. Run it on finished code.',
      inputSchema: z.object({
        code: z.string().min(1).describe('The TSX/JSX source to review'),
        filename: z.string().default('Component.tsx'),
      }),
      outputSchema: z.object({
        passed: z.boolean(),
        findings: z.array(z.object({ line: z.number(), severity: z.enum(['error', 'warning', 'info']), rule: z.string(), message: z.string() })),
        componentsUsed: z.array(z.string()),
      }),
      annotations: READ_ONLY,
    },
    async ({ code, filename }) => {
      const r = reviewUsage(code)
      const text = [
        `${r.passed ? '✓' : '✗'} ${filename}: ${r.findings.length ? `${r.findings.length} finding${r.findings.length === 1 ? '' : 's'}` : 'no findings'}`,
        r.componentsUsed.length ? `Steelbook components used: ${r.componentsUsed.join(', ')}` : 'No Steelbook components detected — is the import from @steelbook/react?',
        '',
        ...r.findings.map((f) => `- line ${f.line} [${f.severity}] ${f.rule}: ${f.message}`),
      ].join('\n')
      return ok(text, { ...r })
    },
  )

  /* ---------------------------------------------------------------- */
  /* resources                                                         */
  /* ---------------------------------------------------------------- */

  server.registerResource(
    'overview',
    'steelbook://overview',
    { title: 'Steelbook overview', description: 'What Steelbook is, setup, house rules and the tool map.', mimeType: 'text/markdown' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: overviewMarkdown() }] }),
  )

  server.registerResource(
    'tokens-css',
    'steelbook://tokens.css',
    { title: 'tokens.css', description: 'The complete generated token stylesheet (packages/tokens/tokens.css).', mimeType: 'text/css' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/css', text: catalog.tokensCss }] }),
  )

  server.registerResource(
    'catalog',
    'steelbook://catalog.json',
    { title: 'Full catalog (JSON)', description: 'Every component, token, icon and guideline as one JSON document.', mimeType: 'application/json' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(catalog) }] }),
  )

  server.registerResource(
    'component',
    new ResourceTemplate('steelbook://components/{name}', {
      list: async () => ({
        resources: catalog.components.map((c) => ({
          uri: `steelbook://components/${c.name}`,
          name: c.name,
          title: c.title,
          description: c.summary,
          mimeType: 'text/markdown',
        })),
      }),
      complete: { name: async (v) => componentNames().filter((n) => n.toLowerCase().startsWith(v.toLowerCase())) },
    }),
    { title: 'Component', description: 'One component: props, examples, Figma contract, CSS, stories.', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const c = findComponent(String(name))
      if (!c) throw new Error(`No component "${String(name)}"`)
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: componentMarkdown(c, ['usage', 'props', 'types', 'figma', 'css', 'stories']) }] }
    },
  )

  server.registerResource(
    'icon',
    new ResourceTemplate('steelbook://icons/{name}.svg', {
      list: async () => ({
        resources: catalog.icons.map((i) => ({ uri: `steelbook://icons/${i.glyph}.svg`, name: i.name, description: `glyph ${i.glyph}`, mimeType: 'image/svg+xml' })),
      }),
      complete: { name: async (v) => catalog.icons.map((i) => i.glyph).filter((g) => g.startsWith(v.toLowerCase())) },
    }),
    { title: 'Icon SVG', description: 'Verbatim Figma path data, currentColor fill.', mimeType: 'image/svg+xml' },
    async (uri, { name }) => {
      const i = findIcon(String(name))
      if (!i) throw new Error(`No icon "${String(name)}"`)
      return { contents: [{ uri: uri.href, mimeType: 'image/svg+xml', text: i.svg }] }
    },
  )

  server.registerResource(
    'guideline',
    new ResourceTemplate('steelbook://guidelines/{id}', {
      list: async () => ({
        resources: catalog.guidelines.map((g) => ({ uri: `steelbook://guidelines/${g.id}`, name: g.id, title: g.title, mimeType: 'text/markdown' })),
      }),
    }),
    { title: 'Guideline section', description: 'A section of CLAUDE.md or README.md.', mimeType: 'text/markdown' },
    async (uri, { id }) => {
      const g = findGuideline(String(id))
      if (!g) throw new Error(`No guideline "${String(id)}"`)
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: `# ${g.title}\n\n${g.body}` }] }
    },
  )

  /* ---------------------------------------------------------------- */
  /* prompts                                                           */
  /* ---------------------------------------------------------------- */

  server.registerPrompt(
    'build-with-steelbook',
    {
      title: 'Build UI with Steelbook',
      description: 'Walks an agent through building a screen or feature the Steelbook way: reuse, tokens only, state as CSS, verify with the lint and review tools.',
      argsSchema: z.object({ task: z.string().describe('What to build, in plain words') }),
    },
    async ({ task }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are building with the Steelbook design system. Task: ${task}\n\n${workflowMarkdown()}\n\nBegin by calling steelbook_get_started, then steelbook_list_components. Do not write any component that already exists. Report which Steelbook components you used and any gap where the design needed something the system does not provide.`,
          },
        },
      ],
    }),
  )

  server.registerPrompt(
    'review-steelbook-code',
    {
      title: 'Review code against the house rules',
      description: 'Reviews React/CSS that uses Steelbook against CLAUDE.md: reuse, tokens, state-as-CSS, focus ring, disabled skin, accessible names, fluid width.',
      argsSchema: z.object({ code: z.string().describe('The TSX and/or CSS to review') }),
    },
    async ({ code }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review the following code against the Steelbook working agreement. First run steelbook_review_usage on the TSX and steelbook_lint_css on any CSS, then read steelbook_get_guidelines section="rules/non-negotiables" and section="rules/house-patterns" and check each rule by hand. For every violation give the line, the rule, and the corrected code. Where the code hardcodes a value, use steelbook_find_token to name the token it should use, or say that the design has a gap.\n\n\`\`\`\n${code}\n\`\`\``,
          },
        },
      ],
    }),
  )

  return server
}

/** Canonical form of a raw CSS value so `#FFF`, `#ffffff` and `rgb(255,255,255)` compare equal. */
export function normalizeValue(v: string): string {
  let s = v.trim().toLowerCase().replace(/\s+/g, '')
  const hex3 = s.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/)
  if (hex3) s = `#${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}${hex3[3]}${hex3[3]}`
  const rgb = s.match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/)
  if (rgb) {
    const h = (n: string) => Number(n).toString(16).padStart(2, '0')
    s = `#${h(rgb[1]!)}${h(rgb[2]!)}${h(rgb[3]!)}`
    if (rgb[4] !== undefined && Number(rgb[4]) < 1) s = `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${rgb[4]})`
  }
  if (/^-?\d*\.?\d+$/.test(s) && Number(s) !== 0 && Math.abs(Number(s)) >= 2) s = `${s}px` // bare numbers ≥ 2 are lengths
  if (/^-?\d*\.?\d+rem$/.test(s)) s = `${parseFloat(s) * 16}px`
  if (/^-?\d*\.?\d+px$/.test(s)) s = `${parseFloat(s)}px`
  if (/^-?\d*\.?\d+em$/.test(s)) s = `${parseFloat(s)}em`
  if (/^0(px|rem|em)?$/.test(s)) s = '0'
  return s
}
