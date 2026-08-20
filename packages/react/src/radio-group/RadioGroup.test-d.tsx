/**
 * Compile-time conformance test: a Radio always carries a label and a
 * value, the Figma `Selected` axis is the group's value rather than an
 * item prop, and `Interaction` is a skin rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening the props breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Radio, RadioGroup } from './RadioGroup'

// Accepted — the drawn default: three options, first selected.
export const asDrawn = (
  <RadioGroup defaultValue="standard">
    <Radio value="standard">Standard shipping</Radio>
    <Radio value="express">Express shipping</Radio>
    <Radio value="overnight">Overnight freight</Radio>
  </RadioGroup>
)

// Accepted — controlled group; disabled on the group or a single item.
export const controlled = (
  <RadioGroup value="express" onValueChange={({ value }) => void value} disabled>
    <Radio value="express">Express shipping</Radio>
    <Radio value="overnight" disabled>Overnight freight</Radio>
  </RadioGroup>
)

// @ts-expect-error — a radio must carry a label.
export const unlabelled = <Radio value="express" />

// @ts-expect-error — a radio without a value has no identity in the group.
export const valueless = <Radio>Express shipping</Radio>

// @ts-expect-error — Selected is the group's value, never an item prop.
export const selectedAsProp = <Radio value="express" selected>Express shipping</Radio>

// @ts-expect-error — Hover/Focus are driven by the user, never by a prop.
export const interactionAsProp = <Radio value="express" interaction="Hover">Express shipping</Radio>
