import type { ReactNode } from 'react'
import {
  SegmentGroup as ArkSegmentGroup,
  type SegmentGroupRootProps,
  type SegmentGroupItemProps as ArkSegmentGroupItemProps,
} from '@ark-ui/react/segment-group'
import './SegmentGroup.css'

export type SegmentGroupProps = SegmentGroupRootProps

export type SegmentProps = Omit<ArkSegmentGroupItemProps, 'children'> & {
  /**
   * The cell's label. Required — it mirrors the Figma `Label` text
   * property, which has no hide boolean, and it is what names the radio
   * underneath.
   */
  children: ReactNode
}

/**
 * Exclusive choice rendered as fused cells — exactly one black. Adjacent
 * 2px borders collapse into a single stroke, so the drawn row of 84 + 93
 * + 72 measures 245px, not 249px.
 *
 * The Figma component draws no states of its own; every visible state
 * belongs to the {@link Segment} cells inside it. Multiple selection is
 * not possible here by construction — use Toggle Group for that.
 *
 * Ark's `Indicator` is deliberately not rendered: it is a sliding block
 * that marks the selection, and this design marks it by inverting the
 * cell itself. Nor is `ItemControl`, which would draw a radio dot.
 *
 * The root is a `role="radiogroup"`, so it wants a name and the design
 * draws none — pass `aria-label` or `aria-labelledby`, or wrap it in a
 * Fieldset.
 *
 * `orientation` defaults to `horizontal`, unlike the Ark primitive. The
 * row is drawn horizontal, and the machine's default would both announce
 * `aria-orientation="vertical"` and bind the wrong arrow keys.
 *
 * @example
 * ```tsx
 * <SegmentGroup defaultValue="monthly" aria-label="Billing period">
 *   <Segment value="monthly">Monthly</Segment>
 *   <Segment value="quarterly">Quarterly</Segment>
 *   <Segment value="yearly">Yearly</Segment>
 * </SegmentGroup>
 * ```
 *
 * Figma: Steelbook Design System › Segment Group (node `30:178`).
 * Built on [Ark UI SegmentGroup](https://ark-ui.com/docs/components/segment-group).
 */
export function SegmentGroup({
  className,
  orientation = 'horizontal',
  ...props
}: SegmentGroupProps) {
  /* Ark points the root's `aria-labelledby` at a `Label` part this design
     does not draw, so the reference dangles and outranks any `aria-label`
     the caller gives. Its `mergeProps` keeps its own value whenever ours
     is `undefined`, so clearing the attribute takes an explicit null —
     React then drops it and the name resolves. */
  const labelledBy = (props['aria-labelledby'] ?? null) as string | undefined
  return (
    <ArkSegmentGroup.Root
      {...props}
      orientation={orientation}
      aria-labelledby={labelledBy}
      className={className ? `sb-segment-group ${className}` : 'sb-segment-group'}
    />
  )
}

/**
 * One cell of a segmented control: a 40px box with 16px insets and a
 * `label/md` label, inverting to black when selected.
 *
 * The Figma `Selected` axis is the group's `value`, never a prop on the
 * cell, and `Interaction` is a skin — Hover rides Ark's `data-hover`
 * (which the machine already suppresses on a disabled cell) and Disabled
 * is the `disabled` prop, on the cell or the whole group. Hover moves
 * only an unselected cell; a selected one is drawn the same either way.
 *
 * Compose inside {@link SegmentGroup}; Ark's group context supplies
 * roving focus, keyboard navigation and the radio ARIA, so a Segment
 * cannot render alone.
 *
 * Figma: Steelbook Design System › Segment (node `30:166`).
 */
export function Segment({ children, className, ...props }: SegmentProps) {
  return (
    <ArkSegmentGroup.Item
      {...props}
      className={className ? `sb-segment ${className}` : 'sb-segment'}
    >
      <ArkSegmentGroup.ItemText className="sb-segment__label">{children}</ArkSegmentGroup.ItemText>
      <ArkSegmentGroup.ItemHiddenInput />
    </ArkSegmentGroup.Item>
  )
}
