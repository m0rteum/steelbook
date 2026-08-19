import type { ReactNode } from 'react'
import { Toggle as ArkToggle, type ToggleRootProps } from '@ark-ui/react/toggle'
import { StarIcon } from '../icons/StarIcon'
import './Toggle.css'

/**
 * Exactly one of `aria-label` / `aria-labelledby`, enforced at compile time.
 *
 * The chip is icon-only and renders no text of its own, so without one of
 * these it reaches the accessibility tree unnamed. Each branch marks the
 * other prop `never`, which makes both "neither" and "both" type errors
 * rather than lint findings or runtime warnings.
 *
 * Required by the Figma component's CONFORMANCE note [sb-conformance-a11y-name].
 */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }

export type ToggleProps = Omit<
  ToggleRootProps,
  'children' | 'aria-label' | 'aria-labelledby'
> & {
  /**
   * Glyph rendered in the 20px slot at the centre of the chip. Mirrors the
   * Icon swap property on the Figma component, which defaults to `icon/star`.
   */
  icon?: ReactNode
} & AccessibleName

/**
 * A pressable icon button with memory. Pressed inverts the chip: black fill,
 * white glyph.
 *
 * The chip is icon-only, so it carries no text of its own — every instance
 * must pass exactly one of `aria-label` or `aria-labelledby`. This is a
 * compile-time requirement, not a convention: omitting both, or passing
 * both, fails typecheck.
 *
 * @example
 * ```tsx
 * <Toggle aria-label="Favourite" defaultPressed />
 * <Toggle aria-labelledby="bold-heading" icon={<BoldIcon />} onPressedChange={setBold} />
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
