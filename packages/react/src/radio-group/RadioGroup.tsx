import type { ReactNode } from 'react'
import {
  RadioGroup as ArkRadioGroup,
  type RadioGroupRootProps,
  type RadioGroupItemProps as ArkRadioGroupItemProps,
} from '@ark-ui/react/radio-group'
import './RadioGroup.css'

export type RadioGroupProps = RadioGroupRootProps

export type RadioProps = Omit<ArkRadioGroupItemProps, 'children'> & {
  /**
   * The label beside the ring. Required — mirrors the Figma Label text
   * property, which has no hide boolean; an unlabelled radio reaches
   * the accessibility tree unnamed.
   */
  children: ReactNode
}

/**
 * A vertical stack of Radio items, gap/sm apart, with exactly one
 * selected. Which one is the group's `value` / `defaultValue`; the
 * Figma `Selected` axis is that value, never a prop on the item.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="standard" onValueChange={({ value }) => setShipping(value)}>
 *   <Radio value="standard">Standard shipping</Radio>
 *   <Radio value="express">Express shipping</Radio>
 *   <Radio value="overnight">Overnight freight</Radio>
 * </RadioGroup>
 * ```
 *
 * Figma: Steelbook Design System › Radio Group (node `18:31`).
 * Built on [Ark UI RadioGroup](https://ark-ui.com/docs/components/radio-group).
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <ArkRadioGroup.Root
      {...props}
      className={className ? `sb-radio-group ${className}` : 'sb-radio-group'}
    />
  )
}

/**
 * Single-choice control — the one place Steelbook is round. Selected
 * drops a 10px orange dot inside the 2px black ring. Compose inside
 * {@link RadioGroup}; Ark's group context supplies roving focus,
 * keyboard navigation and ARIA, so a Radio cannot render alone.
 *
 * The Figma `Interaction` axis is a skin: Hover and Focus ride Ark's
 * `data-hover` / `data-focus-visible`, and Disabled is the `disabled`
 * prop (on the item or the whole group). Focus draws its 3px accent
 * ring outside the 20px circle, same as Checkbox.
 *
 * Figma: Steelbook Design System › Radio (node `18:30`).
 */
export function Radio({ children, className, ...props }: RadioProps) {
  return (
    <ArkRadioGroup.Item
      {...props}
      className={className ? `sb-radio ${className}` : 'sb-radio'}
    >
      <ArkRadioGroup.ItemControl className="sb-radio__control" />
      <ArkRadioGroup.ItemText className="sb-radio__label">{children}</ArkRadioGroup.ItemText>
      <ArkRadioGroup.ItemHiddenInput />
    </ArkRadioGroup.Item>
  )
}
