/**
 * Compile-time conformance test: the Figma `Value` axis is the numeric
 * `value` prop, and no state or variant props exist beyond it.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ProgressCircularProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { ProgressCircular } from './ProgressCircular'

// Accepted — the drawn stops are just sample values of the 0–100 axis.
export const empty = <ProgressCircular value={0} aria-label="Upload progress" />
export const half = <ProgressCircular value={50} aria-label="Upload progress" />
export const done = <ProgressCircular value={100} aria-label="Upload progress" />

// Accepted — custom range; the readout stays the percent of that range.
export const customRange = (
  <ProgressCircular value={3} min={0} max={8} aria-label="Steps completed" />
)

// @ts-expect-error — Value is numeric, not the drawn stop strings.
export const stringValue = <ProgressCircular value="50" aria-label="Upload progress" />

// @ts-expect-error — no state props; a progress ring has no states to skin.
export const stateAsProp = <ProgressCircular value={50} state="Default" aria-label="x" />
