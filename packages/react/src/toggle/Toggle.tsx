import type { ReactNode } from 'react'
import { Toggle as ArkToggle, type ToggleRootProps } from '@ark-ui/react/toggle'
import { StarIcon } from '../icons/StarIcon'
import './Toggle.css'

export interface ToggleProps extends Omit<ToggleRootProps, 'children'> {
  /**
   * Glyph rendered in the 18px slot at the centre of the chip. Mirrors the
   * Icon swap property on the Figma component, which defaults to `icon/star`.
   */
  icon?: ReactNode
}

/**
 * A pressable icon button with memory. Pressed inverts the chip: black fill,
 * white glyph.
 *
 * The chip is icon-only, so it carries no text of its own — always give it an
 * accessible name via `aria-label` (or `aria-labelledby`).
 *
 * @example
 * ```tsx
 * <Toggle aria-label="Favourite" defaultPressed />
 * <Toggle aria-label="Bold" icon={<BoldIcon />} onPressedChange={setBold} />
 * ```
 *
 * Figma: Steelbook Design System › Toggle (node `19:26`).
 * Built on [Ark UI Toggle](https://ark-ui.com/docs/components/toggle).
 */
export function Toggle({ icon = <StarIcon />, className, ...props }: ToggleProps) {
  return (
    <ArkToggle.Root {...props} className={className ? `sb-toggle ${className}` : 'sb-toggle'}>
      <span className="sb-toggle__glyph">{icon}</span>
    </ArkToggle.Root>
  )
}
