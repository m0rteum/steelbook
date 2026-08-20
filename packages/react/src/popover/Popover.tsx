import type { ReactElement, ReactNode } from 'react'
import { Popover as ArkPopover, type PopoverRootProps } from '@ark-ui/react/popover'
import { XIcon } from '../icons/XIcon'
import './Popover.css'

export type PopoverProps = Omit<PopoverRootProps, 'children'> & {
  /**
   * The control that opens the surface. Rendered *as* Ark's trigger via
   * `asChild`, so it must be a single element that takes a ref.
   */
  trigger: ReactElement
  /** Figma text property `Title` — heading/4 on the top line. */
  title: ReactNode
  /**
   * Figma text property `Body` — body/sm underneath, wrapping across
   * the surface. Rendered into Ark's Description part, which is what
   * gives the dialog its `aria-describedby`.
   */
  body: ReactNode
  /**
   * The task itself. Figma fills this slot with a single sm primary
   * Button ("Copy link"), drawn but not exposed as a property.
   */
  children: ReactNode
  /** Appended after the surface's own class, on the drawn box. */
  className?: string
}

/**
 * An anchored, non-modal surface for a small task: a title with a close
 * glyph, a line or two of body, and the control that finishes the job.
 * Ark drives opening, focus, the escape key, dismissal on outside click
 * and the dialog ARIA; the visual design stays as drawn.
 *
 * Four decisions the design did not make:
 *
 * - **No trigger is drawn.** The frame is only the surface, so the
 *   trigger is whatever the caller passes as `trigger`, spread onto
 *   their own element with `asChild` rather than wrapped in Ark's
 *   default `<button>` — which would nest a button inside a button.
 * - **The action is not parameterised.** Figma exposes `Title` and
 *   `Body` as text properties but leaves the button as a drawn
 *   instance, so shipping "Copy link" baked in is not an option. The
 *   slot takes whatever the task needs; the frame draws
 *   `<Button size="sm">`.
 * - **The close glyph has no drawn skin beyond its ink.** It is a bare
 *   16px `icon/x` on `icon/default`, so it takes the button reset and
 *   the house focus ring and nothing else — no hover was invented.
 *   Ark names it "close"; pass `translations` to change that.
 * - **No placement is drawn.** Ark's default (below the trigger) stands;
 *   pass `positioning` to change it.
 *
 * The surface is fixed at the drawn 300px, so a long title or body wraps
 * and grows it in height — which is what both text layers do in the
 * frame.
 *
 * No arrow: the description says so outright, so `Popover.Arrow` is
 * deliberately not rendered.
 *
 * Not portalled: the Positioner is placed where the popover is written,
 * so an `overflow: hidden` ancestor will clip it. Wrap it in Ark's
 * `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <Popover
 *   trigger={<Button tone="secondary">Share</Button>}
 *   title="Share this view"
 *   body="Anyone with the link can inspect tokens and copy CSS. They cannot edit."
 * >
 *   <Button size="sm" onClick={copy}>Copy link</Button>
 * </Popover>
 * ```
 *
 * Figma: Steelbook Design System › Popover (node `35:244`).
 * Built on [Ark UI Popover](https://ark-ui.com/docs/components/popover).
 */
export function Popover({ trigger, title, body, children, className, ...props }: PopoverProps) {
  return (
    <ArkPopover.Root {...props}>
      <ArkPopover.Trigger asChild>{trigger}</ArkPopover.Trigger>
      <ArkPopover.Positioner>
        <ArkPopover.Content className={className ? `sb-popover ${className}` : 'sb-popover'}>
          <div className="sb-popover__header">
            <ArkPopover.Title className="sb-popover__title">{title}</ArkPopover.Title>
            <ArkPopover.CloseTrigger className="sb-popover__close">
              <XIcon />
            </ArkPopover.CloseTrigger>
          </div>
          <ArkPopover.Description className="sb-popover__body">{body}</ArkPopover.Description>
          {children}
        </ArkPopover.Content>
      </ArkPopover.Positioner>
    </ArkPopover.Root>
  )
}
