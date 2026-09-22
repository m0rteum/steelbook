/**
 * Builds `data/catalog.json` — the single file the MCP server serves from.
 *
 * Everything in it is derived from the repository, never hand-written:
 *
 *   packages/react/src/<name>/<Name>.tsx       exported components, props, JSDoc
 *   packages/react/src/<name>/<Name>.css       class names, tokens consumed
 *   packages/react/src/<name>/<Name>.stories.tsx  Storybook ids
 *   packages/react/src/icons/*.tsx             icon SVG path data, verbatim
 *   packages/tokens/tokens.css                 every --sb-* token, all modes
 *   CLAUDE.md, README.md                       house rules and setup docs
 *   packages/mcp/data/figma.json               component descriptions from the
 *                                              Figma file (the binding contract)
 *
 * Run `pnpm --filter @steelbook/mcp build:catalog` after any change to the
 * sources above and commit the result. The CI `test` step fails if the file
 * is stale.
 */
// TypeScript 7 no longer ships the classic compiler API; the builder runs on 5.x.
import ts from 'typescript5'
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, resolve, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  Catalog,
  CatalogComponent,
  CatalogExport,
  CatalogProp,
  CatalogTypeAlias,
  CatalogIcon,
  CatalogToken,
  CatalogGuideline,
  FigmaComponent,
  FigmaIcon,
} from '../src/catalog-types.js'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '../../..')
const reactSrc = join(repo, 'packages/react/src')
const tokensCss = join(repo, 'packages/tokens/tokens.css')
const dataDir = join(here, '../data')

const FIGMA_URL = 'https://www.figma.com/design/h612G7BPMLOPKHKKGec18l/Steelbook-Design-System'
const REPO_URL = 'https://github.com/m0rteum/steelbook'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const read = (p: string) => readFileSync(p, 'utf8')
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function kebab(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function jsDocText(node: ts.Node): { description: string; examples: string[]; tags: Record<string, string> } {
  const docs = ts.getJSDocCommentsAndTags(node)
  let description = ''
  let trailing = ''
  const examples: string[] = []
  const tags: Record<string, string> = {}
  for (const d of docs) {
    if (ts.isJSDoc(d)) {
      if (d.comment) description += (typeof d.comment === 'string' ? d.comment : commentText(d.comment)) + '\n'
      for (const tag of d.tags ?? []) {
        const name = tag.tagName.text
        const text = tag.comment ? (typeof tag.comment === 'string' ? tag.comment : commentText(tag.comment)) : ''
        if (name === 'example') {
          // Prose after the closing fence (the "Figma: … (node `x:y`)" line)
          // belongs to the description, not the example.
          const { code, rest } = splitExample(text)
          examples.push(code)
          if (rest) trailing += rest + '\n'
        } else tags[name] = text.trim()
      }
    }
  }
  return { description: (description + (trailing ? '\n' + trailing : '')).trim(), examples, tags }
}

function commentText(parts: ts.NodeArray<ts.JSDocComment>) {
  return parts
    .map((p) => {
      if (ts.isJSDocLink(p) || ts.isJSDocLinkCode(p) || ts.isJSDocLinkPlain(p)) {
        return `${p.name ? p.name.getText() : ''}${p.text}`
      }
      return p.text
    })
    .join('')
}

function splitExample(s: string): { code: string; rest: string } {
  const m = s.match(/^\s*```[a-z]*\n([\s\S]*?)\n```\s*([\s\S]*)$/)
  if (m) return { code: m[1]!.trim(), rest: m[2]!.trim() }
  return { code: stripFence(s), rest: '' }
}

function stripFence(s: string) {
  return s
    .trim()
    .replace(/^```[a-z]*\n?/, '')
    .replace(/\n?```$/, '')
    .trim()
}

function figmaNodeFrom(text: string): string | undefined {
  const m = text.match(/node `?([0-9]+:[0-9]+)`?/)
  return m?.[1]
}

/* ------------------------------------------------------------------ */
/* exports declared by packages/react/src/index.ts                     */
/* ------------------------------------------------------------------ */

function publicExports(): Map<string, string[]> {
  const sf = ts.createSourceFile('index.ts', read(join(reactSrc, 'index.ts')), ts.ScriptTarget.Latest, true)
  const byModule = new Map<string, string[]>()
  for (const st of sf.statements) {
    if (!ts.isExportDeclaration(st) || !st.moduleSpecifier || !st.exportClause) continue
    if (!ts.isNamedExports(st.exportClause)) continue
    const mod = (st.moduleSpecifier as ts.StringLiteral).text.replace(/^\.\//, '')
    const names = st.exportClause.elements.map((e) => e.name.text)
    byModule.set(mod, [...(byModule.get(mod) ?? []), ...names])
  }
  return byModule
}

/* ------------------------------------------------------------------ */
/* components                                                          */
/* ------------------------------------------------------------------ */

function propsFromTypeNode(node: ts.TypeNode, sf: ts.SourceFile): { props: CatalogProp[]; extends: string[] } {
  const props: CatalogProp[] = []
  const bases: string[] = []
  const visit = (t: ts.TypeNode) => {
    if (ts.isIntersectionTypeNode(t)) {
      t.types.forEach(visit)
    } else if (ts.isTypeLiteralNode(t)) {
      for (const m of t.members) {
        if (!ts.isPropertySignature(m) || !m.name) continue
        const doc = jsDocText(m)
        props.push({
          name: m.name.getText(sf),
          type: m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'unknown',
          required: !m.questionToken,
          description: doc.description,
          ...(doc.tags.default !== undefined ? { default: doc.tags.default } : {}),
        })
      }
    } else if (ts.isParenthesizedTypeNode(t)) {
      visit(t.type)
    } else {
      bases.push(t.getText(sf).replace(/\s+/g, ' '))
    }
  }
  visit(node)
  return { props, extends: bases }
}

function parseComponentDir(dir: string, wanted: string[]): CatalogComponent | undefined {
  const dirPath = join(reactSrc, dir)
  const files = readdirSync(dirPath).filter(
    (f) => /\.tsx?$/.test(f) && !/\.(stories|test-d|test)\.tsx?$/.test(f) && f !== 'index.ts',
  )
  const exportsOut: CatalogExport[] = []
  const types: CatalogTypeAlias[] = []
  const propsTypes = new Map<string, { props: CatalogProp[]; extends: string[]; description: string }>()
  let ark: string | undefined
  let firstDoc = ''

  for (const f of files) {
    const sf = ts.createSourceFile(f, read(join(dirPath, f)), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    for (const st of sf.statements) {
      if (ts.isImportDeclaration(st)) {
        const spec = (st.moduleSpecifier as ts.StringLiteral).text
        const m = spec.match(/^@ark-ui\/react\/([a-z-]+)$/)
        if (m) ark = m[1]
        continue
      }
      const isExported = ts.canHaveModifiers(st) && ts.getModifiers(st)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      if (!isExported) continue

      if (ts.isTypeAliasDeclaration(st)) {
        const name = st.name.text
        if (!wanted.includes(name)) continue
        const doc = jsDocText(st)
        if (/Props$/.test(name)) {
          const { props, extends: bases } = propsFromTypeNode(st.type, sf)
          propsTypes.set(name, { props, extends: bases, description: doc.description })
        } else {
          types.push({ name, type: st.type.getText(sf).replace(/\s+/g, ' '), description: doc.description })
        }
      } else if (ts.isInterfaceDeclaration(st)) {
        const name = st.name.text
        if (!wanted.includes(name)) continue
        const doc = jsDocText(st)
        const props: CatalogProp[] = []
        for (const m of st.members) {
          if (!ts.isPropertySignature(m) || !m.name) continue
          const d = jsDocText(m)
          props.push({
            name: m.name.getText(sf),
            type: m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'unknown',
            required: !m.questionToken,
            description: d.description,
            ...(d.tags.default !== undefined ? { default: d.tags.default } : {}),
          })
        }
        const bases = st.heritageClauses?.flatMap((h) => h.types.map((t) => t.getText(sf))) ?? []
        if (/Props$/.test(name)) propsTypes.set(name, { props, extends: bases, description: doc.description })
        else types.push({ name, type: `interface { ${props.map((p) => p.name).join(', ')} }`, description: doc.description })
      } else if (ts.isFunctionDeclaration(st) && st.name) {
        const name = st.name.text
        if (!wanted.includes(name)) continue
        const doc = jsDocText(st)
        const param = st.parameters[0]
        let propsType: string | undefined
        if (param?.type && ts.isTypeReferenceNode(param.type)) propsType = param.type.typeName.getText(sf)
        if (!firstDoc && /^[A-Z]/.test(name)) firstDoc = doc.description
        exportsOut.push({
          name,
          kind: /^use[A-Z]/.test(name) ? 'hook' : /^[A-Z]/.test(name) ? 'component' : 'function',
          description: doc.description,
          examples: doc.examples,
          ...(figmaNodeFrom(doc.description) ? { figmaNodeId: figmaNodeFrom(doc.description) } : {}),
          ...(propsType ? { propsType } : {}),
        })
      } else if (ts.isVariableStatement(st)) {
        for (const decl of st.declarationList.declarations) {
          const name = decl.name.getText(sf)
          if (!wanted.includes(name)) continue
          const doc = jsDocText(st)
          const init = decl.initializer
          const isFn = init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))
          let propsType: string | undefined
          if (isFn) {
            const p = (init as ts.ArrowFunction).parameters[0]
            if (p?.type && ts.isTypeReferenceNode(p.type)) propsType = p.type.typeName.getText(sf)
          }
          exportsOut.push({
            name,
            kind: isFn ? (/^use[A-Z]/.test(name) ? 'hook' : /^[A-Z]/.test(name) ? 'component' : 'function') : 'const',
            description: doc.description,
            examples: doc.examples,
            ...(figmaNodeFrom(doc.description) ? { figmaNodeId: figmaNodeFrom(doc.description) } : {}),
            ...(propsType ? { propsType } : {}),
            ...(!isFn && init ? { value: init.getText(sf).replace(/\s+/g, ' ').slice(0, 200) } : {}),
          })
        }
      }
    }
  }

  // Attach props to the export that declares them; any props type with no
  // owner is still listed (Toast's option bags, Tour steps).
  for (const ex of exportsOut) {
    if (ex.propsType && propsTypes.has(ex.propsType)) {
      const p = propsTypes.get(ex.propsType)!
      ex.props = p.props
      ex.extends = p.extends
      propsTypes.delete(ex.propsType)
    }
  }
  for (const [name, p] of propsTypes) {
    types.push({
      name,
      type: [...p.extends, p.props.length ? `{ ${p.props.map((x) => `${x.name}${x.required ? '' : '?'}: ${x.type}`).join('; ')} }` : '']
        .filter(Boolean)
        .join(' & '),
      description: p.description,
      props: p.props,
    })
  }

  const primary = exportsOut.find((e) => e.kind === 'component')
  if (!primary) return undefined

  /* CSS ------------------------------------------------------------ */
  const cssFiles = readdirSync(dirPath).filter((f) => f.endsWith('.css'))
  const classes = new Set<string>()
  const tokens = new Set<string>()
  const local = new Set<string>()
  let cssText = ''
  for (const f of cssFiles) {
    const css = read(join(dirPath, f))
    cssText += css
    for (const m of css.matchAll(/\.(sb-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?)/g)) classes.add(m[1]!)
    for (const m of css.matchAll(/(--sb-[a-z0-9-]+)\s*:/g)) local.add(m[1]!)
  }
  for (const m of cssText.matchAll(/var\((--sb-[a-z0-9-]+)/g)) if (!local.has(m[1]!)) tokens.add(m[1]!)
  const cssHeader = cssText.match(/^\/\*\s*-+\s*\n([\s\S]*?)-+\s*\*\//)?.[1]?.replace(/^\s+/gm, '').trim()

  /* Stories -------------------------------------------------------- */
  const storyFile = readdirSync(dirPath).find((f) => f.endsWith('.stories.tsx'))
  let storybookId: string | undefined
  let title: string | undefined
  const stories: { name: string; id: string }[] = []
  if (storyFile) {
    const src = read(join(dirPath, storyFile))
    const storyTitle = src.match(/const meta\s*=\s*\{[\s\S]*?title:\s*'([^']+)'/)?.[1]
    if (storyTitle) {
      title = storyTitle.split('/').pop()
      storybookId = storyTitle.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
      for (const m of src.matchAll(/^export const (\w+)/gm)) {
        stories.push({ name: m[1]!, id: `${storybookId}--${kebab(m[1]!)}` })
      }
    }
  }

  const figmaNodeId = primary.figmaNodeId ?? exportsOut.map((e) => e.figmaNodeId).find(Boolean)

  return {
    name: primary.name,
    title: title ?? primary.name,
    slug: dir,
    module: `packages/react/src/${dir}`,
    importPath: '@steelbook/react',
    summary: (firstDoc || primary.description).split(/\n\s*\n/)[0]!.replace(/\s+/g, ' ').trim(),
    ...(figmaNodeId ? { figmaNodeId, figmaUrl: `${FIGMA_URL}?node-id=${figmaNodeId.replace(':', '-')}` } : {}),
    primitive: ark ? { kind: 'ark', name: ark, docs: `https://ark-ui.com/docs/components/${ark}` } : { kind: 'native' },
    exports: exportsOut,
    types,
    css: {
      classes: [...classes].sort(),
      tokens: [...tokens].sort(),
      localProperties: [...local].sort(),
      ...(cssHeader ? { note: cssHeader } : {}),
    },
    ...(storybookId ? { storybookId, stories } : { stories }),
  }
}

/* ------------------------------------------------------------------ */
/* icons                                                               */
/* ------------------------------------------------------------------ */

function parseIcons(wanted: string[]): CatalogIcon[] {
  const dir = join(reactSrc, 'icons')
  const out: CatalogIcon[] = []
  for (const f of readdirSync(dir).filter((f) => /Icon\.tsx$/.test(f))) {
    const name = basename(f, '.tsx')
    if (!wanted.includes(name)) continue
    const src = read(join(dir, f))
    const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const fn = sf.statements.find((s): s is ts.FunctionDeclaration => ts.isFunctionDeclaration(s) && s.name?.text === name)
    const doc = fn ? jsDocText(fn) : { description: '', examples: [], tags: {} }
    const svgOpen = src.match(/<svg([\s\S]*?)>/)?.[1] ?? ''
    const attr = (k: string) => svgOpen.match(new RegExp(`${k}="([^"]*)"`))?.[1]
    const paths = [...src.matchAll(/<path\s+d="([^"]+)"/g)].map((m) => m[1]!)
    // Everything inside <svg>…</svg>, whitespace collapsed. The icon files are
    // plain SVG attributes in JSX, so the markup is valid SVG as written —
    // including <g> wrappers that carry a transform and the fill.
    const inner = src.match(/\{\.\.\.props\}\s*>([\s\S]*?)<\/svg>/)?.[1] ?? ''
    const pathMarkup = inner
      .replace(/\s+/g, ' ')
      .replace(/\s*\/>/g, '/>')
      .replace(/>\s+</g, '><')
      .trim()
    const viewBox = attr('viewBox') ?? '0 0 16 16'
    const size = Number(attr('width') ?? 16)
    const glyph = doc.description.match(/icon · ([a-z0-9-]+)/)?.[1] ?? kebab(name.replace(/Icon$/, ''))
    out.push({
      name,
      glyph,
      figmaNodeId: figmaNodeFrom(doc.description),
      description: doc.description,
      size,
      viewBox,
      paths,
      svg: `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${pathMarkup}</svg>`,
    })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

function parseTokens(): { tokens: CatalogToken[]; raw: string; header: string } {
  const css = read(tokensCss)
  const header = css.match(/^\/\*([\s\S]*?)\*\//)?.[1]?.replace(/^\s+/gm, '').trim() ?? ''
  const block = (start: RegExp) => {
    const m = css.match(start)
    if (!m || m.index === undefined) return ''
    const open = css.indexOf('{', m.index)
    let depth = 0
    for (let i = open; i < css.length; i++) {
      if (css[i] === '{') depth++
      else if (css[i] === '}') {
        depth--
        if (depth === 0) return css.slice(open + 1, i)
      }
    }
    return ''
  }
  const root = block(/^:root\s*\{/m)
  const mobile = block(/^@media \(max-width: 767px\)/m)
  const dark = block(/^\[data-theme="dark"\]/m)

  const tokens = new Map<string, CatalogToken>()
  const walk = (text: string, mode: 'default' | 'mobile' | 'dark') => {
    let section = ''
    let note = ''
    const re = /\/\*([\s\S]*?)\*\/|(--sb-[a-z0-9-]+)\s*:\s*([^;]+);/g
    for (const m of text.matchAll(re)) {
      if (m[1] !== undefined) {
        const c = m[1].replace(/^\s+/gm, '').trim()
        const sec = c.match(/^-+\s*(.+?)\s*-+/s)
        if (sec) {
          section = sec[1]!.replace(/\s+/g, ' ').trim()
          note = c.replace(/^-+\s*.+?\s*-+\s*/s, '').trim()
        } else {
          note = c
        }
        continue
      }
      const name = m[2]!
      const value = m[3]!.replace(/\s+/g, ' ').trim()
      if (mode === 'default') {
        tokens.set(name, {
          name,
          value,
          group: section || 'Primitives',
          ...(note ? { note } : {}),
          ...(value.includes('var(') ? { references: [...value.matchAll(/var\((--sb-[a-z0-9-]+)\)/g)].map((x) => x[1]!) } : {}),
        })
      } else {
        const t = tokens.get(name)
        if (t) t[mode] = value
        else tokens.set(name, { name, value: '', group: section || mode, [mode]: value })
      }
    }
  }
  walk(root, 'default')
  walk(mobile, 'mobile')
  walk(dark, 'dark')

  const resolve = (v: string, mode: 'default' | 'dark' | 'mobile', depth = 0): string => {
    if (depth > 10) return v
    return v.replace(/var\((--sb-[a-z0-9-]+)\)/g, (_, ref: string) => {
      const t = tokens.get(ref)
      if (!t) return `var(${ref})`
      const modeVal = mode === 'dark' ? t.dark : mode === 'mobile' ? t.mobile : undefined
      return resolve(modeVal ?? t.value, mode, depth + 1)
    })
  }
  for (const t of tokens.values()) {
    t.resolved = resolve(t.value, 'default')
    if (t.dark) t.resolvedDark = resolve(t.dark, 'dark')
    else if (t.references?.some((r) => tokens.get(r)?.dark)) t.resolvedDark = resolve(t.value, 'dark')
    if (t.mobile) t.resolvedMobile = resolve(t.mobile, 'mobile')
  }
  return { tokens: [...tokens.values()], raw: css, header }
}

/* ------------------------------------------------------------------ */
/* guidelines                                                          */
/* ------------------------------------------------------------------ */

function parseMarkdownSections(text: string, source: CatalogGuideline['source']): CatalogGuideline[] {
  const lines = text.split('\n')
  const out: CatalogGuideline[] = []
  let current: CatalogGuideline | undefined
  let parentTitle = ''
  const flush = () => {
    if (current) {
      current.body = current.body.trim()
      if (current.body) out.push(current)
    }
  }
  for (const line of lines) {
    const h = line.match(/^(#{1,3})\s+(.+)$/)
    if (h) {
      flush()
      const level = h[1]!.length
      const title = h[2]!.trim()
      if (level === 1) {
        current = undefined
        parentTitle = ''
        continue
      }
      if (level === 2) parentTitle = title
      current = {
        id: `${source}/${slugify(level === 3 ? `${parentTitle} ${title}` : title)}`,
        title: level === 3 ? `${parentTitle} › ${title}` : title,
        source,
        body: '',
      }
      continue
    }
    if (current) current.body += line + '\n'
    else if (!current && line.trim() && out.length === 0 && !/^\[!\[/.test(line)) {
      // Intro paragraph before the first heading.
      current = { id: `${source}/intro`, title: 'Intro', source, body: line + '\n' }
    }
  }
  flush()
  return out
}

/* ------------------------------------------------------------------ */
/* figma snapshot                                                      */
/* ------------------------------------------------------------------ */

function loadFigma(): { components: FigmaComponent[]; icons: FigmaIcon[] } | undefined {
  const p = join(dataDir, 'figma.json')
  if (!existsSync(p)) {
    console.warn('warning: data/figma.json missing — Figma descriptions will not be in the catalog')
    return undefined
  }
  return JSON.parse(read(p))
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

export function buildCatalog(): Catalog {
  const byModule = publicExports()
  const components: CatalogComponent[] = []
  for (const [mod, names] of byModule) {
    if (mod === 'icons') continue
    const c = parseComponentDir(mod, names)
    if (c) components.push(c)
    else console.warn(`warning: no component export found in ${mod}`)
  }
  components.sort((a, b) => a.name.localeCompare(b.name))

  const icons = parseIcons(byModule.get('icons') ?? [])
  const { tokens, raw: tokensRaw, header: tokensHeader } = parseTokens()

  // Which components consume each token.
  const usedBy = new Map<string, string[]>()
  for (const c of components) for (const t of c.css.tokens) usedBy.set(t, [...(usedBy.get(t) ?? []), c.name])
  for (const t of tokens) if (usedBy.has(t.name)) t.usedBy = usedBy.get(t.name)!

  const figma = loadFigma()
  if (figma) {
    const claimed = new Set<string>()
    for (const c of components) {
      const byName = (x: FigmaComponent) => {
        const n = norm(x.name.replace(/\s*\/\s*Open$/i, ''))
        return n === norm(c.name) || n === norm(c.title)
      }
      const f = figma.components.find(byName) ?? figma.components.find((x) => x.id === c.figmaNodeId)
      if (f) {
        c.figma = f
        claimed.add(f.id)
        if (!c.figmaNodeId) {
          c.figmaNodeId = f.id
          c.figmaUrl = `${FIGMA_URL}?node-id=${f.id.replace(':', '-')}`
        }
      } else console.warn(`warning: no Figma component matched ${c.name}`)
    }
    // Sub-components (Accordion Item, Calendar Day, File Dropzone…) attach to
    // the component on the same page whose name they extend, or to the only
    // component on that page.
    for (const f of figma.components) {
      if (claimed.has(f.id)) continue
      const onPage = components.filter((c) => c.figma?.page === f.page)
      const owner =
        onPage.find((c) => norm(c.name).startsWith(norm(f.name.split(/[ /]/)[0]!))) ??
        (onPage.length === 1 ? onPage[0] : undefined)
      if (owner) (owner.figmaRelated ??= []).push(f)
      else console.warn(`warning: Figma component ${f.name} (${f.id}) has no owner`)
    }
    const iconByNode = new Map(figma.icons.map((i) => [i.lineId, i]))
    for (const i of icons) {
      const f =
        (i.figmaNodeId ? iconByNode.get(i.figmaNodeId) : undefined) ??
        figma.icons.find((x) => norm(x.name.replace(/^icons\//, '')) === norm(i.glyph))
      if (f) i.figma = f
    }
  }

  const guidelines = [
    ...parseMarkdownSections(read(join(repo, 'CLAUDE.md')), 'rules'),
    ...parseMarkdownSections(read(join(repo, 'README.md')), 'readme'),
  ]

  const reactPkg = JSON.parse(read(join(repo, 'packages/react/package.json')))

  const catalog: Catalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      figmaFile: 'Steelbook Design System',
      figmaUrl: FIGMA_URL,
      repository: REPO_URL,
      reactPackage: reactPkg.name,
      reactVersion: reactPkg.version,
      arkVersion: reactPkg.dependencies['@ark-ui/react'],
      commit: process.env.GITHUB_SHA ?? gitSha(),
    },
    counts: {
      components: components.length,
      icons: icons.length,
      tokens: tokens.length,
      tokenDeclarations: (tokensRaw.match(/^\s*--sb-[a-z0-9-]+\s*:/gm) ?? []).length,
      guidelines: guidelines.length,
    },
    components,
    icons,
    tokens,
    tokensCss: tokensRaw,
    tokensHeader,
    guidelines,
    figmaIcons: figma?.icons ?? [],
  }
  return catalog
}

function gitSha() {
  try {
    const head = read(join(repo, '.git/HEAD')).trim()
    if (head.startsWith('ref: ')) return read(join(repo, '.git', head.slice(5))).trim()
    return head
  } catch {
    return 'unknown'
  }
}

export function writeCatalog() {
  const catalog = buildCatalog()
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(join(dataDir, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n')
  copyFileSync(join(repo, 'stylelint.config.mjs'), join(dataDir, 'stylelint.config.mjs'))
  const c = catalog.counts
  console.log(
    `catalog.json: ${c.components} components, ${c.icons} icons, ${c.tokens} tokens (${c.tokenDeclarations} declarations), ${c.guidelines} guideline sections`,
  )
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) writeCatalog()
