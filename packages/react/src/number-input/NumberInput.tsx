import type { ReactNode } from 'react'
import {
  NumberInput as ArkNumberInput,
  type NumberInputRootProps,
} from '@ark-ui/react/number-input'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { ChevronUpIcon } from '../icons/ChevronUpIcon'
import './NumberInput.css'

export type NumberInputProps = Omit<NumberInputRootProps, 'children'> & {
  /**
   * The label above the field. Required — every variant of the Figma
   * component draws it, and it is what names the input.
   */
  label: ReactNode
}

/**
 * Numeric entry with fused steppers. Mono digits, because numbers are
 * data. Two 21px stepper chips stack against the input's right edge,
 * sharing borders with it and with each other.
 *
 * The Figma `State` axis maps as: Focus is `:focus` on the input (the
 * steppers keep their black border, as drawn), and Disabled is the
 * `disabled` prop, which greys the label, the input and both chips.
 *
 * This shares the Field skeleton — label over control, `label/sm` in
 * secondary, the same 12px text inset — but is a separate component
 * rather than a Field wrapper: the design mandates Ark's NumberInput,
 * and Steelbook's Field is built on Ark's Field, whose own input part
 * cannot be swapped for another primitive's.
 *
 * The field is fluid; the design draws it at 220px but a number field
 * has to fit its container, so the input takes the space and the
 * stepper column stays 28px.
 *
 * @example
 * ```tsx
 * <NumberInput label="Quantity" defaultValue="128" min={0} max={999} />
 * ```
 *
 * Figma: Steelbook Design System › Number Input (node `28:38`).
 * Built on [Ark UI NumberInput](https://ark-ui.com/docs/components/number-input).
 */
export function NumberInput({ label, className, ...props }: NumberInputProps) {
  return (
    <ArkNumberInput.Root
      {...props}
      className={className ? `sb-number-input ${className}` : 'sb-number-input'}
    >
      <ArkNumberInput.Label className="sb-number-input__label">{label}</ArkNumberInput.Label>
      <ArkNumberInput.Control className="sb-number-input__group">
        <ArkNumberInput.Input className="sb-number-input__input" />
        <span className="sb-number-input__steppers">
          <ArkNumberInput.IncrementTrigger className="sb-number-input__stepper">
            <ChevronUpIcon />
          </ArkNumberInput.IncrementTrigger>
          <ArkNumberInput.DecrementTrigger className="sb-number-input__stepper sb-number-input__stepper--decrement">
            <ChevronDownIcon />
          </ArkNumberInput.DecrementTrigger>
        </span>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  )
}
