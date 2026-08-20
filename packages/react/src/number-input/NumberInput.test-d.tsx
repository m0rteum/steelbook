/**
 * Compile-time conformance test: a Number Input always carries a label,
 * the value is data, and the Figma `State` axis is a skin or the native
 * attribute rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening NumberInputProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { NumberInput } from './NumberInput'

// Accepted — the drawn default.
export const basic = <NumberInput label="Quantity" defaultValue="128" />

// Accepted — clamped range, step, and a change handler.
export const clamped = (
  <NumberInput
    label="Quantity"
    value="128"
    min={0}
    max={999}
    step={8}
    onValueChange={({ value, valueAsNumber }) => void [value, valueAsNumber]}
  />
)

// Accepted — State=Disabled is reached through the native attribute.
export const disabled = <NumberInput label="Quantity" defaultValue="128" disabled />

// @ts-expect-error — the input is named by its label, which is required.
export const unlabelled = <NumberInput defaultValue="128" />

// @ts-expect-error — Focus is a skin and Disabled an attribute; neither is a state prop.
export const stateAsProp = <NumberInput label="Quantity" state="Focus" />

// @ts-expect-error — the parts are fixed by the design; children are not composed here.
export const withChildren = <NumberInput label="Quantity">steppers</NumberInput>
