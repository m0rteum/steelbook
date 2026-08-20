import type { ReactElement, ReactNode } from 'react'
import { Tooltip as ArkTooltip, type TooltipRootProps } from '@ark-ui/react/tooltip'
import './Tooltip.css'

export type TooltipProps = Omit<TooltipRootProps, 'children'> & {
  /**
   * The chip's text. Mirrors the Figma `Label` text property, which is
   * the component's only property.
   */
  label: ReactNode
  /**
   * The control the tooltip describes. Rendered *as* Ark's trigger via
   * `asChild`, so it must be a single element that takes a ref — and it
   * should be focusable, or the tooltip is mouse-only.
   */
  children: ReactElement
  /** Appended after the chip's own class, on the drawn box. */
  className?: string
}

/**
 * A terse inverted chip: black slab, white mono text, no arrow and no
 * shadow. Ark drives the hover and focus delays, the escape key and the
 * `aria-describedby` wiring; the visual design stays as drawn.
 *
 * Three decisions the design did not make:
 *
 * - **No trigger is drawn.** Only the chip is, so the trigger is
 *   whatever the caller passes. It is spread onto the caller's own
 *   element with `asChild` rather than wrapped in Ark's default
 *   `<button>`, which would nest a button inside a button for the
 *   commonest case — a tooltip on a control.
 * - **No timing is drawn.** The 400ms open / 150ms close delays and the
 *   bottom placement are Ark's defaults, not a design decision; pass
 *   `openDelay`, `closeDelay` or `positioning` to change them.
 * - **No arrow.** The description says so outright, so `Tooltip.Arrow`
 *   is deliberately not rendered.
 *
 * Not portalled: the Positioner is placed where the tooltip is written,
 * so a `overflow: hidden` ancestor will clip the chip. Wrap it in Ark's
 * `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <Tooltip label="Copy to clipboard">
 *   <Button tone="ghost" iconLeft={<CopyIcon />}>Copy</Button>
 * </Tooltip>
 * ```
 *
 * Figma: Steelbook Design System › Tooltip (node `33:2`).
 * Built on [Ark UI Tooltip](https://ark-ui.com/docs/components/tooltip).
 */
export function Tooltip({ label, children, className, ...props }: TooltipProps) {
  return (
    <ArkTooltip.Root {...props}>
      <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content className={className ? `sb-tooltip ${className}` : 'sb-tooltip'}>
          {label}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  )
}
