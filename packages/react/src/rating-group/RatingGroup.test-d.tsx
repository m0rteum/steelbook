/**
 * Compile-time conformance test: a Rating Group always carries an
 * accessible name (it draws no label), and the Figma `Value` axis is
 * the numeric value rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening RatingGroupProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { RatingGroup } from './RatingGroup'

// Accepted — the drawn stops are values of the 0–5 axis.
export const empty = <RatingGroup defaultValue={0} aria-label="Rate this release" />
export const three = <RatingGroup defaultValue={3} aria-label="Rate this release" />

// Accepted — controlled, read-only display, named by reference.
export const display = (
  <RatingGroup
    value={4}
    readOnly
    onValueChange={({ value }) => void value}
    aria-labelledby="rating-heading"
  />
)

// @ts-expect-error — five stars with no label need a name from the caller.
export const unnamed = <RatingGroup defaultValue={3} />

// @ts-expect-error — exactly one name source, never both.
export const doubleNamed = <RatingGroup defaultValue={3} aria-label="Rating" aria-labelledby="rating-heading" />

// @ts-expect-error — Value is numeric, not the drawn variant strings.
export const stringValue = <RatingGroup defaultValue="3" aria-label="Rating" />
