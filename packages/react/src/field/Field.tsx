import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Field as ArkField } from '@ark-ui/react/field'
import './Field.css'

export type FieldProps = Omit<ComponentPropsWithRef<'input'>, 'children'> & {
  /**
   * The label above the input. Required — every variant of the Figma
   * component draws it, and without it the input reaches the
   * accessibility tree unnamed.
   */
  label: ReactNode
  /**
   * The line under the input. Mirrors the Figma Helper text property;
   * omitting it is `Show helper = false`. Hidden while `error` is set —
   * the design draws exactly one message line.
   */
  helper?: ReactNode
  /**
   * The error sentence. Its presence IS `State=Error`: the border
   * thickens to 3px red and this text replaces the helper, in full
   * sentences per the component description. Wired to `aria-invalid`
   * and `aria-errormessage` by Ark.
   */
  error?: ReactNode
}

/**
 * Label + input + helper, wired for every state — the form primitive
 * every specialized input shares.
 *
 * The Figma `State` axis maps as: Focus is an interaction skin (`:focus`
 * on the input — a text input shows its ring on pointer focus too, since
 * the caret means editing either way); Error is the presence of the
 * `error` prop; Disabled is the native attribute. The `Value` axis
 * (Empty/Filled) is the input's own content: `placeholder` draws the
 * Empty text, `value`/`defaultValue` the Filled text.
 *
 * Input attributes (`placeholder`, `value`, `type`, `onChange`, `ref`,
 * `disabled`, `required`, …) ride the top level and reach the native
 * `<input>`; `disabled`/`required` also inform Ark's root so every part
 * picks up its skin and the accent asterisk renders.
 *
 * The design draws no Focus+Error combination; here Error wins while
 * focused, so a broken field stays visibly broken until fixed (decision
 * not specified in the design).
 *
 * @example
 * ```tsx
 * <Field label="Email address" helper="We only use this for receipts."
 *        placeholder="you@company.com" type="email" required />
 *
 * <Field label="Email address" error="That address has no @ sign."
 *        defaultValue="you.company.com" />
 * ```
 *
 * Figma: Steelbook Design System › Field (node `27:58`).
 * Built on [Ark UI Field](https://ark-ui.com/docs/components/field).
 */
export function Field({
  label,
  helper,
  error,
  className,
  disabled,
  required,
  ...inputProps
}: FieldProps) {
  return (
    <ArkField.Root
      className={className ? `sb-field ${className}` : 'sb-field'}
      invalid={error != null}
      disabled={disabled}
      required={required}
    >
      <ArkField.Label className="sb-field__label">
        {label}
        <ArkField.RequiredIndicator className="sb-field__required" />
      </ArkField.Label>
      <ArkField.Input {...inputProps} className="sb-field__input" />
      {error != null ? (
        <ArkField.ErrorText className="sb-field__message sb-field__message--error">
          {error}
        </ArkField.ErrorText>
      ) : helper != null ? (
        <ArkField.HelperText className="sb-field__message">{helper}</ArkField.HelperText>
      ) : null}
    </ArkField.Root>
  )
}
