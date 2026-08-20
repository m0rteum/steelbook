/**
 * Compile-time conformance test: a Tags Input always carries a label,
 * and the Figma `State` axis is Ark's state or a skin — never a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TagsInputProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { TagsInput } from './TagsInput'

// Accepted — the drawn default.
export const basic = (
  <TagsInput
    label="Materials"
    defaultValue={['gunmetal', 'concrete', 'rebar']}
    placeholder="Add material…"
  />
)

// Accepted — the value is Ark's, reachable through its own props.
export const controlled = (
  <TagsInput
    label="Materials"
    value={['gunmetal']}
    onValueChange={({ value }) => void value}
    onInputValueChange={({ inputValue }) => void inputValue}
  />
)

// Accepted — Ark's own switches pass straight through.
export const constrained = (
  <TagsInput label="Materials" max={3} delimiter=";" disabled editable={false} />
)

// @ts-expect-error — the control is named by its label, which is required.
export const unlabelled = <TagsInput defaultValue={['gunmetal']} />

// @ts-expect-error — Focus is Ark's data-focus, not a state prop.
export const stateAsProp = <TagsInput label="Materials" state="Focus" />

// @ts-expect-error — the chips come from the value; children are not composed here.
export const withChildren = <TagsInput label="Materials">extra</TagsInput>
