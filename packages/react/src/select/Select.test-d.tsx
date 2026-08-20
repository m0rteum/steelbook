/**
 * Compile-time conformance test: the Figma `State` axis is not a prop —
 * Open is the machine's and Disabled is the native attribute — the
 * label is required because every variant draws it, and the rows travel
 * as data.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening SelectProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Select } from './Select'

const items = [
  { value: 'gunmetal', label: 'Gunmetal' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'rebar', label: 'Rebar', disabled: true },
]

// Accepted — the drawn control.
export const basic = <Select label="Material" placeholder="Choose material…" items={items} />

// Accepted — State=Disabled is the native attribute, as Field's is.
export const disabled = <Select label="Material" items={items} disabled />

// Accepted — selection is the caller's to control.
export const controlled = <Select label="Material" items={items} value={['rebar']} onValueChange={({ value }) => void value} />

// Accepted — the gutter is drawn but the rest of the placement is Ark's.
export const placement = <Select label="Material" items={items} positioning={{ placement: 'top', gutter: 6 }} />

// Accepted — the hidden native select carries a name into a form.
export const named = <Select label="Material" items={items} name="material" required />

// @ts-expect-error — Open is the machine's, derived from the trigger.
export const stateAsProp = <Select label="Material" items={items} state="Open" />

// @ts-expect-error — open is Ark's own prop name; State is not one.
export const openAsVariant = <Select label="Material" items={items} State="Open" />

// @ts-expect-error — every variant draws the label, and it names the combobox.
export const unlabelled = <Select items={items} />

// @ts-expect-error — a select with no choices has nothing to open.
export const itemless = <Select label="Material" />

// @ts-expect-error — the rows come from the items; children are not composed here.
export const withChildren = <Select label="Material" items={items}>extra</Select>

// @ts-expect-error — a choice is a value and a label, not a bare string.
export const looseItems = <Select label="Material" items={['Gunmetal']} />
