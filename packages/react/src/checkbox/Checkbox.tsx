import type { ReactNode } from 'react'
import { Checkbox as ArkCheckbox, type CheckboxRootProps } from '@ark-ui/react/checkbox'
import { CheckIcon } from '../icons/CheckIcon'
import { MinusIcon } from '../icons/MinusIcon'
import './Checkbox.css'

export type CheckboxProps = Omit<CheckboxRootProps, 'children'> & {
  /**
   * The label. Required — mirrors the Figma Label text property; see
   * `hideLabel` for the standalone-box case. There is no variant of this
   * component without an accessible name.
   */
  children: ReactNode
  /**
   * Keep the label in the accessibility tree but take it off screen.
   * Mirrors `Show label = false` on the Figma component — "hide it with
   * the boolean for standalone boxes".
   *
   * The label element still renders: Ark points the control's
   * `aria-labelledby` at it unconditionally, so dropping it would leave a
   * dangling reference and an unnamed checkbox.
   *
   * @default false
   */
  hideLabel?: boolean
}

/**
 * Binary + indeterminate selection. Checked fills safety orange with a
 * black glyph; indeterminate is a black bar on the same orange.
 *
 * The Figma `State` axis maps to Ark's checked state — `checked` /
 * `defaultChecked` accept `true`, `false`, or `'indeterminate'` — and the
 * `Interaction` axis is a skin, not an API: Hover and Focus are driven by
 * Ark's `data-hover` and `data-focus-visible`. Pass `disabled` to reach
 * the disabled skin; the other two belong to the user.
 *
 * Unlike the other Steelbook controls, focus draws its 3px accent ring
 * OUTSIDE the box (Figma stroke align outside, per the component
 * description) and replaces the resting border, so the 20px box and its
 * neighbours never move.
 *
 * @example
 * ```tsx
 * <Checkbox defaultChecked onCheckedChange={({ checked }) => setAgreed(checked === true)}>
 *   Accept the terms
 * </Checkbox>
 *
 * <Checkbox checked="indeterminate" hideLabel>Select all rows</Checkbox>
 * ```
 *
 * Figma: Steelbook Design System › Checkbox (node `17:54`).
 * Built on [Ark UI Checkbox](https://ark-ui.com/docs/components/checkbox).
 */
export function Checkbox({ children, hideLabel = false, className, ...props }: CheckboxProps) {
  return (
    <ArkCheckbox.Root
      {...props}
      className={className ? `sb-checkbox ${className}` : 'sb-checkbox'}
    >
      <ArkCheckbox.Control className="sb-checkbox__box">
        <ArkCheckbox.Indicator className="sb-checkbox__glyph">
          <CheckIcon />
        </ArkCheckbox.Indicator>
        <ArkCheckbox.Indicator indeterminate className="sb-checkbox__glyph">
          <MinusIcon />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.Label
        className={
          hideLabel ? 'sb-checkbox__label sb-checkbox__label--hidden' : 'sb-checkbox__label'
        }
      >
        {children}
      </ArkCheckbox.Label>
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  )
}
