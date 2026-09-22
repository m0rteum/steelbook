import stylelint from 'stylelint'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

export interface LintProblem {
  line: number
  column: number
  rule: string
  severity: string
  message: string
  hint?: string
}

export interface LintResult {
  passed: boolean
  problems: LintProblem[]
  rulesRun: number
}

let configPromise: Promise<Record<string, unknown>> | undefined

/**
 * The repo's `stylelint.config.mjs`, copied verbatim into `data/` by the
 * catalog build so the published package enforces exactly what CI enforces.
 */
async function loadConfig(): Promise<Record<string, unknown>> {
  configPromise ??= import(new URL('../data/stylelint.config.mjs', import.meta.url).href).then((m) => {
    const cfg = { ...(m.default as Record<string, unknown>) }
    // The repo config ignores the token file by path; the snippet has no path.
    delete cfg.ignoreFiles
    // Resolve `extends` from this package rather than the caller's cwd.
    cfg.extends = (cfg.extends as string[]).map((e) => require.resolve(e))
    return cfg
  })
  return configPromise
}

function hint(rule: string, message: string): string | undefined {
  switch (rule) {
    case 'color-no-hex':
      return 'Replace with a semantic colour token — steelbook_find_token value="<the hex>" property="color" names it.'
    case 'declaration-property-value-disallowed-list':
      if (/font/.test(message)) return 'Typography comes from a --sb-text-<style>-* group: family / weight / width (font-stretch) / size / line-height / tracking together.'
      if (/color|background|border|fill|stroke|shadow|outline/.test(message))
        return 'Use var(--sb-text-*), var(--sb-bg-*), var(--sb-border-*), var(--sb-icon-*) or currentColor. steelbook_find_token maps a raw colour to its token.'
      return 'Lengths come from tokens: var(--sb-space-*), var(--sb-gap-*), var(--sb-size-*), var(--sb-radius-*), var(--sb-stroke-*). calc() is fine if every term is a token.'
    case 'selector-class-pattern':
      return 'Class names follow sb-<component>__<part>--<modifier>; state comes from :hover/:focus-visible/:disabled or Ark data-* attributes, not extra classes.'
    case 'custom-property-pattern':
      return 'Component-local custom properties are --sb-<component>-<name> so they cannot be mistaken for design tokens.'
    default:
      return undefined
  }
}

export async function lintCss(css: string, filename = 'Component.css'): Promise<LintResult> {
  const config = await loadConfig()
  const result = await stylelint.lint({ code: css, codeFilename: filename, config, configBasedir: here })
  const problems: LintProblem[] = []
  for (const r of result.results) {
    for (const w of r.warnings) {
      const rule = w.rule ?? 'unknown'
      problems.push({
        line: w.line,
        column: w.column,
        rule,
        severity: w.severity,
        message: w.text.replace(/\s*\([a-z-]+\)$/, ''),
        ...(hint(rule, w.text) ? { hint: hint(rule, w.text) } : {}),
      })
    }
    if (r.parseErrors?.length) {
      for (const e of r.parseErrors) problems.push({ line: e.line ?? 0, column: e.column ?? 0, rule: 'parse-error', severity: 'error', message: e.text })
    }
  }
  if (result.errored && problems.length === 0) {
    problems.push({ line: 0, column: 0, rule: 'stylelint', severity: 'error', message: result.report.slice(0, 500) })
  }
  const rules = (config.rules as Record<string, unknown>) ?? {}
  return { passed: problems.every((p) => p.severity !== 'error'), problems, rulesRun: Object.keys(rules).length }
}
