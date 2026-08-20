/**
 * Compile-time conformance test: the Figma `Mode` axis is Ark's own
 * state rather than a prop, and the value is data.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening EditableProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Editable } from './Editable'

// Accepted — Mode=Preview, the drawn default.
export const preview = <Editable defaultValue="Project title" />

// Accepted — Mode=Edit is reached through Ark's own state.
export const editing = <Editable defaultValue="Project title" defaultEdit />

// Accepted — controlled value, commit handler, translated trigger names.
export const controlled = (
  <Editable
    value="Project title"
    onValueChange={({ value }) => void value}
    onValueCommit={({ value }) => void value}
    translations={{ edit: 'Rename', submit: 'Save', cancel: 'Discard', input: 'Project title' }}
  />
)

// Accepted — disabled passes through to Ark.
export const disabled = <Editable defaultValue="Project title" disabled />

// @ts-expect-error — Mode is Ark's state, never a prop.
export const modeAsProp = <Editable defaultValue="Project title" mode="Edit" />

// @ts-expect-error — the parts are fixed by the design; children are not composed here.
export const withChildren = <Editable defaultValue="Project title">extra</Editable>
