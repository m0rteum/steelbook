/**
 * Compile-time conformance test: a Field always carries a label, its
 * native input surface passes through, and the Figma `State` axis is
 * data (`error`) or interaction skin — never a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening FieldProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { createRef } from 'react'
import { Field } from './Field'

// Accepted — the drawn default: label, helper, placeholder.
export const basic = (
  <Field label="Email address" helper="We only use this for receipts." placeholder="you@company.com" />
)

// Accepted — Value=Filled with native input props and a ref to the input.
export const filled = (
  <Field
    label="Email address"
    type="email"
    defaultValue="you@company.com"
    onChange={(e) => void e.target.value}
    ref={createRef<HTMLInputElement>()}
  />
)

// Accepted — Required boolean; the asterisk renders from Ark context.
export const required = <Field label="Email address" required />

// Accepted — State=Error is the presence of the error sentence.
export const errored = <Field label="Email address" error="That address has no @ sign." />

// Accepted — State=Disabled is reached through the native attribute.
export const disabled = <Field label="Email address" disabled />

// @ts-expect-error — a field must carry a label.
export const unlabelled = <Field placeholder="you@company.com" />

// @ts-expect-error — Focus/Error/Disabled are skins or data, never a prop.
export const stateAsProp = <Field label="Email address" state="Error" />
