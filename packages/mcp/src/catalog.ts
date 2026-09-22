import { readFileSync } from 'node:fs'
import type { Catalog, CatalogComponent, CatalogIcon, CatalogToken, CatalogGuideline } from './catalog-types.js'

/**
 * The generated catalog, loaded once per process. Lives next to `dist/` and
 * `src/` alike (`../data/catalog.json`), so the same import works from tsx,
 * from the compiled package and from the bundled Vercel function.
 */
export const catalog: Catalog = JSON.parse(readFileSync(new URL('../data/catalog.json', import.meta.url), 'utf8'))

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export function findComponent(name: string): CatalogComponent | undefined {
  const n = norm(name)
  return (
    catalog.components.find((c) => norm(c.name) === n || norm(c.title) === n || norm(c.slug) === n) ??
    catalog.components.find((c) => c.exports.some((e) => norm(e.name) === n)) ??
    catalog.components.find((c) => c.figmaNodeId === name)
  )
}

export function findIcon(name: string): CatalogIcon | undefined {
  const n = norm(name).replace(/icon$/, '')
  return catalog.icons.find((i) => norm(i.name).replace(/icon$/, '') === n || norm(i.glyph) === n)
}

export function findToken(name: string): CatalogToken | undefined {
  const n = name.trim().replace(/^var\(/, '').replace(/\)$/, '')
  const full = n.startsWith('--') ? n : n.startsWith('sb-') ? `--${n}` : `--sb-${n}`
  return catalog.tokens.find((t) => t.name === full)
}

export function findGuideline(id: string): CatalogGuideline | undefined {
  const n = id.toLowerCase().trim().replace(/[^a-z0-9/]+/g, '-')
  return (
    catalog.guidelines.find((g) => g.id === n) ??
    catalog.guidelines.find((g) => g.id.endsWith(`/${n}`)) ??
    catalog.guidelines.find((g) => g.title.toLowerCase() === n) ??
    catalog.guidelines.find((g) => g.id.includes(n))
  )
}

export function componentNames(): string[] {
  return catalog.components.map((c) => c.name)
}

/** Closest names for "did you mean" errors. */
export function suggest(input: string, candidates: string[], max = 5): string[] {
  const n = norm(input)
  const scored = candidates
    .map((c) => {
      const cn = norm(c)
      let score = 0
      if (cn === n) score = 100
      else if (cn.includes(n) || n.includes(cn)) score = 60
      else {
        // bigram overlap
        const bg = (s: string) => new Set(Array.from({ length: Math.max(0, s.length - 1) }, (_, i) => s.slice(i, i + 2)))
        const a = bg(n)
        const b = bg(cn)
        let hit = 0
        for (const x of a) if (b.has(x)) hit++
        score = a.size ? Math.round((hit / a.size) * 50) : 0
      }
      return { c, score }
    })
    .filter((x) => x.score > 15)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, max).map((x) => x.c)
}
