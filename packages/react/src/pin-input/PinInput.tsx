import { PinInput as ArkPinInput, type PinInputRootProps } from '@ark-ui/react/pin-input'
import './PinInput.css'

export type PinInputProps = Omit<PinInputRootProps, 'children'>

/**
 * One glyph per cell for OTP, PIN, and verification codes. Ark drives
 * auto-advance, paste, backspace and arrow-key movement across the
 * cells; each cell is a real `<input>`, so the box the design draws is
 * the input itself rather than a wrapper around one.
 *
 * The Figma `State` axis maps the usual way: Focus is `:focus` on a
 * single cell, Error is Ark's `invalid` prop (which also sets
 * `aria-invalid`), and Disabled is `disabled`. There is no `state` prop.
 *
 * Two decisions the design did not make:
 *
 * - **Focus inside Error.** The design draws Error with no cell focused,
 *   so it never says which colour wins. Focus wins on the focused cell —
 *   both rings are 3px and differ only in hue, so keeping the cell red
 *   would leave nothing to locate the caret by. The other three stay red
 *   and `aria-invalid` is unaffected.
 * - **The group has no name.** No variant draws a label, so Ark's `Label`
 *   part is not rendered. Ark still names every cell individually
 *   ("pin code 1 of 4", overridable through `translations`), so nothing
 *   is unlabelled — but the set as a whole is anonymous. Pair it with a
 *   heading, or ask the designer for a labelled variant.
 *
 * `count` defaults to 4 and `placeholder` to empty, both as drawn — Ark's
 * own placeholder default is `"○"`, which the design does not show.
 *
 * @example
 * ```tsx
 * <PinInput otp onValueComplete={({ valueAsString }) => verify(valueAsString)} />
 * ```
 *
 * Figma: Steelbook Design System › PIN Input (node `29:81`).
 * Built on [Ark UI PinInput](https://ark-ui.com/docs/components/pin-input).
 */
export function PinInput({ className, count = 4, placeholder = '', ...props }: PinInputProps) {
  return (
    <ArkPinInput.Root
      {...props}
      count={count}
      placeholder={placeholder}
      className={className ? `sb-pin-input ${className}` : 'sb-pin-input'}
    >
      <ArkPinInput.Control className="sb-pin-input__control">
        <ArkPinInput.Context>
          {(api) =>
            api.items.map((index) => (
              <ArkPinInput.Input key={index} index={index} className="sb-pin-input__cell" />
            ))
          }
        </ArkPinInput.Context>
      </ArkPinInput.Control>
      <ArkPinInput.HiddenInput />
    </ArkPinInput.Root>
  )
}
