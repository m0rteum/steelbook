import { describe, it, expect } from 'vitest'
import { buildCatalog } from '../scripts/build-catalog.js'
import { catalog } from '../src/catalog.js'

/** `data/catalog.json` must be regenerated whenever the sources change. */
describe('data/catalog.json', () => {
  it('is up to date with the repository sources (run `pnpm build:catalog`)', () => {
    const strip = (c: typeof catalog) => {
      const { generatedAt: _g, source, ...rest } = c
      void _g
      const { commit: _c, ...src } = source
      void _c
      return { ...rest, source: src }
    }
    expect(strip(buildCatalog())).toEqual(strip(catalog))
  })
})
