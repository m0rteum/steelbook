/**
 * Compile-time conformance test: the Figma `State` axis is Ark's props
 * or a CSS skin, never a `state` prop, and the cells are fixed by the
 * design rather than composed by the consumer.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening PinInputProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { PinInput } from './PinInput'

// Accepted — the drawn default: four empty cells.
export const basic = <PinInput />

// Accepted — State=Error is Ark's `invalid`, which also sets aria-invalid.
export const error = <PinInput invalid defaultValue={['4', '8', '1', '5']} />

// Accepted — State=Disabled is the native attribute, through Ark.
export const disabled = <PinInput disabled defaultValue={['4', '8']} />

// Accepted — a one-time code that reports itself when complete.
export const otp = (
  <PinInput otp onValueComplete={({ valueAsString }) => void valueAsString} />
)

// @ts-expect-error — Focus is a skin and Error/Disabled are Ark props; none is a state prop.
export const stateAsProp = <PinInput state="Focus" />

// @ts-expect-error — the cells come from `count`; children are not composed here.
export const withChildren = <PinInput>extra</PinInput>
