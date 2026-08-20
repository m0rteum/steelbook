/**
 * Compile-time conformance test: the × is icon-only, so it cannot be
 * drawn without a name, and Tone is a prop while nothing else is.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TagProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Tag } from './Tag'

// Accepted — the drawn default: Tone=Solid, Removable=false.
export const basic = <Tag>steel</Tag>

// Accepted — Tone=Outline, Removable=true, with a name for the ×.
export const removableOutline = (
  <Tag tone="outline" onRemove={() => {}} removeLabel="Remove steel">
    steel
  </Tag>
)

// @ts-expect-error — the label is the tag; it is required.
export const empty = <Tag />

// @ts-expect-error — a drawn × with no accessible name.
export const unnamedRemove = <Tag onRemove={() => {}}>steel</Tag>

// @ts-expect-error — a name with nothing to name.
export const strayLabel = <Tag removeLabel="Remove steel">steel</Tag>

// @ts-expect-error — Tone is solid or outline; there is no third variant.
export const unknownTone = <Tag tone="ghost">steel</Tag>
