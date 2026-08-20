/**
 * Compile-time conformance test: a Password Input always carries a
 * label, and the Figma `Visibility` and `State` axes are Ark's state,
 * a skin, or the native attribute — never props.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening PasswordInputProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { PasswordInput } from './PasswordInput'

// Accepted — the drawn default.
export const basic = <PasswordInput label="Password" defaultValue="hunter2" />

// Accepted — Visibility is Ark's state, reachable through its own props.
export const revealed = (
  <PasswordInput
    label="Password"
    defaultVisible
    onVisibilityChange={({ visible }) => void visible}
  />
)

// Accepted — controlled value on the field, State=Disabled through the attribute.
export const disabled = (
  <PasswordInput
    label="Password"
    value="hunter2"
    onChange={(event) => void event.target.value}
    disabled
  />
)

// @ts-expect-error — the input is named by its label, which is required.
export const unlabelled = <PasswordInput defaultValue="hunter2" />

// @ts-expect-error — Focus is a skin and Disabled an attribute; neither is a state prop.
export const stateAsProp = <PasswordInput label="Password" state="Focus" />

// @ts-expect-error — the parts are fixed by the design; children are not composed here.
export const withChildren = <PasswordInput label="Password">extra</PasswordInput>
