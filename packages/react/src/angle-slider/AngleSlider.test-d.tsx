/**
 * Compile-time conformance test: an Angle Slider always carries an
 * accessible name (it draws no label), and the Figma `Angle` axis is the
 * numeric value rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening AngleSliderProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { AngleSlider } from './AngleSlider'

// Accepted — the drawn stops are just sample values of the degree axis.
export const zero = <AngleSlider defaultValue={0} aria-label="Gradient angle" />
export const diagonal = <AngleSlider defaultValue={45} aria-label="Gradient angle" />

// Accepted — controlled, stepped, named by reference.
export const controlled = (
  <AngleSlider
    value={90}
    step={15}
    onValueChange={({ value }) => void value}
    aria-labelledby="angle-heading"
  />
)

// Accepted — disabled passes through to Ark.
export const disabled = <AngleSlider defaultValue={0} aria-label="Gradient angle" disabled />

// @ts-expect-error — the dial has no visible label, so a name is required.
export const unnamed = <AngleSlider defaultValue={45} />

// @ts-expect-error — exactly one name source, never both.
export const doubleNamed = <AngleSlider defaultValue={45} aria-label="Angle" aria-labelledby="angle-heading" />

// @ts-expect-error — Angle is the value, never its own prop.
export const angleAsProp = <AngleSlider aria-label="Angle" angle="45" />
