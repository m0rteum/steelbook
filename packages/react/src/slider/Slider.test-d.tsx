/**
 * Compile-time conformance test: a Slider always carries an accessible
 * name (it draws no label of its own), the Figma `Type` axis is the
 * shape of the value rather than a prop, and `State` is a skin.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening SliderProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Slider } from './Slider'

// Accepted — Type=Single: one value, one name.
export const single = <Slider defaultValue={[60]} aria-label="Volume" />

// Accepted — Type=Range: two values, a name per thumb.
export const range = (
  <Slider
    defaultValue={[25, 75]}
    aria-label={['Minimum price', 'Maximum price']}
    onValueChange={({ value }) => void value}
  />
)

// Accepted — named by reference, with a stepped scale.
export const stepped = (
  <Slider defaultValue={[4]} min={0} max={8} step={2} aria-labelledby="steps-heading" />
)

// Accepted — State=Disabled is reached through the prop.
export const disabled = <Slider defaultValue={[60]} aria-label="Volume" disabled />

// @ts-expect-error — the rail has no visible label, so a name is required.
export const unnamed = <Slider defaultValue={[60]} />

// @ts-expect-error — exactly one name source, never both.
export const doubleNamed = <Slider defaultValue={[60]} aria-label="Volume" aria-labelledby="volume-heading" />

// @ts-expect-error — Type is the shape of the value, never a prop.
export const typeAsProp = <Slider defaultValue={[60]} aria-label="Volume" type="Range" />

// @ts-expect-error — Hover/Focus are driven by the user, never by a prop.
export const stateAsProp = <Slider defaultValue={[60]} aria-label="Volume" state="Hover" />
