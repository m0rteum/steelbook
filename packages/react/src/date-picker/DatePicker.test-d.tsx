/**
 * Compile-time conformance test: neither Figma `State` axis is a prop —
 * the input's Focus is `:focus-within` and its Disabled the native
 * attribute, and every day-cell state is machine-derived — and the
 * label is required because every variant draws it.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening DatePickerProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { DatePicker } from './DatePicker'

// Accepted — the drawn control.
export const basic = <DatePicker label="Ship date" />

// Accepted — State=Disabled is the native attribute, as Field's is.
export const disabled = <DatePicker label="Ship date" disabled />

// Accepted — selection is the caller's to control.
export const controlled = <DatePicker label="Ship date" value={[]} onValueChange={({ value }) => void value} />

// Accepted — the drawn Monday start and six fixed rows are defaults, not decrees.
export const weekStart = <DatePicker label="Ship date" startOfWeek={0} fixedWeeks={false} />

// Accepted — the DD / MM / YYYY mask is a default; callers can localise it.
export const localised = <DatePicker label="Ship date" locale="en-US" format={(date) => date.toString()} />

// Accepted — the gutter is drawn but the rest of the placement is Ark's.
export const placement = <DatePicker label="Ship date" positioning={{ placement: 'top', gutter: 6 }} />

// Accepted — the input carries a name into a form.
export const named = <DatePicker label="Ship date" name="ship-date" required />

// @ts-expect-error — Focus is :focus-within on the control.
export const stateAsProp = <DatePicker label="Ship date" state="Focus" />

// @ts-expect-error — State is not a prop under its Figma name either.
export const variantAsProp = <DatePicker label="Ship date" State="Focus" />

// @ts-expect-error — a day cell's Selected/Today/Outside are the machine's.
export const dayStateAsProp = <DatePicker label="Ship date" dayState="Selected" />

// @ts-expect-error — every variant draws the label, and it names the input.
export const unlabelled = <DatePicker />

// @ts-expect-error — the calendar is rendered from the machine, not composed.
export const withChildren = <DatePicker label="Ship date">extra</DatePicker>
