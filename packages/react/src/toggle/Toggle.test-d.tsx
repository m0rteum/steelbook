/**
 * Compile-time conformance test for [sb-conformance-a11y-name] — the Figma
 * Toggle component requires that an accessible name is unskippable in the
 * type system, not merely documented.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so weakening ToggleProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Toggle } from './Toggle'

// Accepted — named directly.
export const withLabel = <Toggle aria-label="Favourite" />

// Accepted — named by reference to another element.
export const withLabelledBy = <Toggle aria-labelledby="bold-heading" />

// @ts-expect-error — an icon-only Toggle must carry an accessible name.
export const withNoName = <Toggle />

// @ts-expect-error — exactly one name source, never both.
export const withBothNames = <Toggle aria-label="Favourite" aria-labelledby="bold-heading" />
