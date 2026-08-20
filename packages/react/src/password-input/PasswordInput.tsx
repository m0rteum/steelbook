import type { ChangeEventHandler, ReactNode } from 'react'
import {
  PasswordInput as ArkPasswordInput,
  type PasswordInputRootProps,
} from '@ark-ui/react/password-input'
import { EyeIcon } from '../icons/EyeIcon'
import { EyeOffIcon } from '../icons/EyeOffIcon'
import { LockIcon } from '../icons/LockIcon'
import './PasswordInput.css'

export type PasswordInputProps = Omit<
  PasswordInputRootProps,
  'children' | 'defaultValue' | 'onChange'
> & {
  /**
   * The label above the field. Required — every variant of the Figma
   * component draws it, and it is what names the input.
   */
  label: ReactNode
  /**
   * The value, forwarded to the field itself.
   *
   * Ark's machine owns visibility, `name`, `required` and
   * `autoComplete`, but not the value — that stays a plain input
   * concern, so these four are handed to the input rather than the
   * root. Left on the root they would land on a `<div>` and quietly do
   * nothing.
   */
  value?: string
  /** As `value`, uncontrolled. */
  defaultValue?: string
  /** Fires on the field. */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /** Placeholder for the field. */
  placeholder?: string
}

/**
 * Secret entry with a reveal toggle. A muted lock leads, mono bullets
 * fill the middle, and the eye flips to eye-off once revealed.
 *
 * The Figma `Visibility` axis is Ark's own state — the trigger flips it
 * and swaps the glyph — and `State` maps as usual: Focus is the input
 * taking focus (the frame's stroke goes 2px → 3px accent), Disabled is
 * the `disabled` prop.
 *
 * The frame is the control, not the input: the border, fill and 12px
 * insets live on the wrapper so the lock and the toggle sit inside the
 * box with the value between them, and the input itself is bare. The
 * focus ring keys off the input specifically, so tabbing on to the
 * reveal toggle moves the ring to the toggle rather than leaving the
 * whole frame lit.
 *
 * Ark names the toggle from its `translations`, which is also where you
 * translate it, and deliberately keeps it out of the tab order
 * (`tabindex="-1"`, with `aria-controls` and `aria-expanded` pointing at
 * the field), so Tab runs label → field → next field. Reaching the
 * reveal by keyboard alone therefore is not possible — the primitive's
 * call, kept because the design says to build on it.
 *
 * @example
 * ```tsx
 * <PasswordInput label="Password" defaultValue="hunter2" />
 * ```
 *
 * Figma: Steelbook Design System › Password Input (node `29:50`).
 * Built on [Ark UI PasswordInput](https://ark-ui.com/docs/components/password-input).
 */
export function PasswordInput({
  label,
  className,
  value,
  defaultValue,
  onChange,
  placeholder,
  ...props
}: PasswordInputProps) {
  return (
    <ArkPasswordInput.Root
      {...props}
      className={className ? `sb-password-input ${className}` : 'sb-password-input'}
    >
      <ArkPasswordInput.Label className="sb-password-input__label">
        {label}
      </ArkPasswordInput.Label>
      <ArkPasswordInput.Control className="sb-password-input__control">
        <span className="sb-password-input__lock" aria-hidden="true">
          <LockIcon />
        </span>
        <ArkPasswordInput.Input
          className="sb-password-input__input"
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
        />
        <ArkPasswordInput.VisibilityTrigger className="sb-password-input__toggle">
          <ArkPasswordInput.Indicator fallback={<EyeIcon />}>
            <EyeOffIcon />
          </ArkPasswordInput.Indicator>
        </ArkPasswordInput.VisibilityTrigger>
      </ArkPasswordInput.Control>
    </ArkPasswordInput.Root>
  )
}
