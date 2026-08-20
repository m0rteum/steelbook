/**
 * Compile-time conformance test: the Figma `Value` axis is the numeric
 * `value` prop, and no state or variant props exist beyond it.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ProgressLinearProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { ProgressLinear } from './ProgressLinear'

// Accepted — the drawn stops are just sample values of the 0–100 axis.
export const empty = <ProgressLinear value={0} aria-label="Upload progress" />
export const half = <ProgressLinear value={50} aria-label="Upload progress" />
export const done = <ProgressLinear value={100} aria-label="Upload progress" />

// Accepted — custom range, controlled updates.
export const customRange = (
  <ProgressLinear value={3} min={0} max={8} aria-label="Steps completed" />
)

// @ts-expect-error — Value is numeric, not the drawn stop strings.
export const stringValue = <ProgressLinear value="50" aria-label="Upload progress" />

// @ts-expect-error — no state props; a progress bar has no states to skin.
export const stateAsProp = <ProgressLinear value={50} state="Default" aria-label="x" />
