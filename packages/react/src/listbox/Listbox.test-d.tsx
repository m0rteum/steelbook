/**
 * Compile-time conformance test: the `Selected` and `Interaction` axes
 * are the machine's, the row's disabled state travels with the row, and
 * the list — which draws no label — cannot be built without an
 * accessible name.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ListboxProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Listbox } from './Listbox'

const items = [
  { value: 'gunmetal', label: 'Gunmetal' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'rebar', label: 'Rebar', disabled: true },
]

// Accepted — the drawn list, sitting on its first row.
export const basic = <Listbox aria-label="Palette" items={items} defaultValue={['gunmetal']} />

// Accepted — a name by reference instead.
export const labelledby = <Listbox aria-labelledby="palette-heading" items={items} />

// Accepted — selection is the caller's to control.
export const controlled = <Listbox aria-label="Palette" items={items} value={['rebar']} onValueChange={({ value }) => void value} />

// Accepted — single is the drawn mode, but it is Ark's to change.
export const multiple = <Listbox aria-label="Palette" items={items} selectionMode="multiple" />

// @ts-expect-error — Selected is the machine's, derived from the value.
export const selectedAsProp = <Listbox aria-label="Palette" items={items} selected />

// @ts-expect-error — Hover is CSS (data-highlighted), never a prop.
export const interactionAsProp = <Listbox aria-label="Palette" items={items} interaction="Hover" />

// @ts-expect-error — the list draws no label, so it cannot name itself.
export const unnamed = <Listbox items={items} />

// @ts-expect-error — the two naming routes are mutually exclusive.
export const doublyNamed = <Listbox aria-label="Palette" aria-labelledby="palette-heading" items={items} />

// @ts-expect-error — a list with no rows has nothing to draw.
export const itemless = <Listbox aria-label="Palette" />

// @ts-expect-error — the rows come from the items; children are not composed here.
export const withChildren = <Listbox aria-label="Palette" items={items}>extra</Listbox>

// @ts-expect-error — a row is a value and a label, not a bare string.
export const looseItems = <Listbox aria-label="Palette" items={['Gunmetal']} />
