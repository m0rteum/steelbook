import type { ReactNode } from 'react'
import {
  ToggleGroup as ArkToggleGroup,
  type ToggleGroupRootProps,
  type ToggleGroupItemProps as ArkToggleGroupItemProps,
} from '@ark-ui/react/toggle-group'
import { StarIcon } from '../icons/StarIcon'
import '../toggle/Toggle.css'
import './ToggleGroup.css'

export type ToggleGroupProps = ToggleGroupRootProps

/**
 * Exactly one of `aria-label` / `aria-labelledby`, enforced at compile time.
 *
 * Items are icon-only chips, exactly like the standalone Toggle, so the same
 * conformance rule applies: without one of these the button reaches the
 * accessibility tree unnamed. [sb-conformance-a11y-name]
 */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }

export type ToggleGroupItemProps = Omit<
  ArkToggleGroupItemProps,
  'children' | 'aria-label' | 'aria-labelledby'
> & {
  /**
   * Glyph rendered in the 20px slot at the centre of the chip. Mirrors the
   * Icon swap property on the Figma Toggle instances the group is built
   * from, which default to `icon/star`.
   */
  icon?: ReactNode
} & AccessibleName

/**
 * A row of Toggles with collapsed 2px borders — adjacent chips share a
 * single stroke, so three 40px chips measure 116px, not 120px. Multiple
 * may be pressed; use Segment Group for exclusive choice.
 *
 * `multiple` defaults to `true`, unlike the Ark primitive: the component
 * description states "Multiple may be pressed; use Segment Group for
 * exclusive choice", so independent latching is this component's contract
 * and single-select is the opt-out.
 *
 * The Figma component draws no states of its own — every visible state
 * belongs to the Toggle chips inside it, and those are interaction skins
 * (`:hover`, `:focus-visible`, `data-state`, `data-disabled`), never props.
 *
 * @example
 * ```tsx
 * <ToggleGroup defaultValue={['bold']}>
 *   <ToggleGroupItem value="bold" aria-label="Bold" icon={<BoldIcon />} />
 *   <ToggleGroupItem value="italic" aria-label="Italic" icon={<ItalicIcon />} />
 * </ToggleGroup>
 * ```
 *
 * Figma: Steelbook Design System › Toggle Group (node `19:27`).
 * Built on [Ark UI ToggleGroup](https://ark-ui.com/docs/components/toggle-group).
 */
export function ToggleGroup({ multiple = true, className, ...props }: ToggleGroupProps) {
  return (
    <ArkToggleGroup.Root
      {...props}
      multiple={multiple}
      className={className ? `sb-toggle-group ${className}` : 'sb-toggle-group'}
    />
  )
}

/**
 * One chip in a Toggle Group. Visually a Toggle — it reuses the `sb-toggle`
 * skin verbatim — but built on Ark's ToggleGroup.Item so the group supplies
 * roving focus, keyboard navigation and ARIA. `value` identifies the chip
 * in the group's `value` array.
 *
 * Requires exactly one of `aria-label` / `aria-labelledby`, same as the
 * standalone Toggle. [sb-conformance-a11y-name]
 */
export function ToggleGroupItem({
  icon = <StarIcon />,
  className,
  ...props
}: ToggleGroupItemProps) {
  const classes = className
    ? `sb-toggle sb-toggle-group__item ${className}`
    : 'sb-toggle sb-toggle-group__item'
  return (
    <ArkToggleGroup.Item {...props} className={classes}>
      <span className="sb-toggle__glyph">{icon}</span>
    </ArkToggleGroup.Item>
  )
}
