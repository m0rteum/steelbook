/**
 * Compile-time conformance test: the Figma `State` axis is not a prop —
 * Filtering is the input's own focus and content, Disabled is the
 * native attribute — the label is required because every variant draws
 * it, and the rows travel as data.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ComboboxProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Combobox } from './Combobox'

const items = [
  { value: 'brianna', label: 'Brianna Wolfe' },
  { value: 'bright', label: 'Bright Osei' },
  { value: 'gabriel', label: 'Gabriel Brito', disabled: true },
]

// Accepted — the drawn control.
export const basic = <Combobox label="Assignee" placeholder="Search people…" items={items} />

// Accepted — State=Disabled is the native attribute, as Field's is.
export const disabled = <Combobox label="Assignee" items={items} disabled />

// Accepted — selection is the caller's to control.
export const controlled = <Combobox label="Assignee" items={items} value={['bright']} onValueChange={({ value }) => void value} />

// Accepted — the caller can watch the query without owning the filtering.
export const watched = <Combobox label="Assignee" items={items} onInputValueChange={({ inputValue }) => void inputValue} />

// Accepted — the gutter is drawn but the rest of the placement is Ark's.
export const placement = <Combobox label="Assignee" items={items} positioning={{ placement: 'top', gutter: 6 }} />

// Accepted — the input carries a name into a form.
export const named = <Combobox label="Assignee" items={items} name="assignee" required />

// @ts-expect-error — Filtering is the input's own focus and content.
export const stateAsProp = <Combobox label="Assignee" items={items} state="Filtering" />

// @ts-expect-error — State is not a prop under its Figma name either.
export const variantAsProp = <Combobox label="Assignee" items={items} State="Filtering" />

// @ts-expect-error — every variant draws the label, and it names the combobox.
export const unlabelled = <Combobox items={items} />

// @ts-expect-error — a combobox with no choices has nothing to filter.
export const itemless = <Combobox label="Assignee" />

// @ts-expect-error — the rows come from the items; children are not composed here.
export const withChildren = <Combobox label="Assignee" items={items}>extra</Combobox>

// @ts-expect-error — a choice is a value and a label, not a bare string.
export const looseItems = <Combobox label="Assignee" items={['Brianna Wolfe']} />
