/**
 * Compile-time conformance test: a Checkbox always carries an accessible
 * name, the third Figma State (Indeterminate) is a value of `checked`
 * rather than a separate axis, and `Interaction` is a skin rather than a
 * prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening CheckboxProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Checkbox } from './Checkbox'

// Accepted — labelled, uncontrolled.
export const basic = <Checkbox defaultChecked>Accept the terms</Checkbox>

// Accepted — the third Figma State rides the checked value.
export const indeterminate = <Checkbox checked="indeterminate">Select all rows</Checkbox>

// Accepted — controlled, with the label taken off screen but not removed.
export const controlled = (
  <Checkbox hideLabel checked={false} onCheckedChange={({ checked }) => void checked}>
    Select row
  </Checkbox>
)

// Accepted — Interaction=Disabled is reached through the native prop.
export const disabled = <Checkbox disabled>Accept the terms</Checkbox>

// @ts-expect-error — a checkbox must carry a label.
export const unlabelled = <Checkbox />

// @ts-expect-error — Hover/Focus are driven by the user, never by a prop.
export const interactionAsProp = <Checkbox interaction="Hover">Accept the terms</Checkbox>

// @ts-expect-error — State is the checked value, never its own prop.
export const stateAsProp = <Checkbox state="Indeterminate">Accept the terms</Checkbox>
