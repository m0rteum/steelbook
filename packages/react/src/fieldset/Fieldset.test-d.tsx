/**
 * Compile-time conformance test: a Fieldset always carries a legend and
 * content, and it exposes no state props — everything stateful belongs
 * to the Fields inside (disabled passes through as the native/Ark
 * attribute).
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening FieldsetProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Field } from '../field/Field'
import { Fieldset } from './Fieldset'

// Accepted — the drawn default: legend, hint, grouped Fields.
export const asDrawn = (
  <Fieldset legend="SHIPPING" hint="Where the crate lands. All fields required.">
    <Field label="Email address" helper="We only use this for receipts." />
    <Field label="Email address" helper="We only use this for receipts." />
  </Fieldset>
)

// Accepted — hint is optional; disabled reaches every Field via context.
export const legendOnly = (
  <Fieldset legend="SHIPPING" disabled>
    <Field label="City" />
  </Fieldset>
)

// @ts-expect-error — a fieldset must carry a legend.
export const unlabelled = <Fieldset>{<Field label="City" />}</Fieldset>

// @ts-expect-error — a fieldset with nothing to group is meaningless.
export const empty = <Fieldset legend="SHIPPING" />

// @ts-expect-error — no state prop; states belong to the Fields inside.
export const stateAsProp = <Fieldset legend="SHIPPING" state="Disabled">{null}</Fieldset>
