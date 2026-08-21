import type { ReactElement, ReactNode } from 'react'
import { Dialog as ArkDialog, type DialogRootProps } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { XIcon } from '../icons/XIcon'
import './Dialog.css'

/** What the close glyph is called, since Ark's dialog machine names nothing. */
const CLOSE_LABEL = 'Close'

export type DialogProps = Omit<DialogRootProps, 'children'> & {
  /** The question, on the top line — Figma's `title` layer, heading/2. */
  title: ReactNode
  /**
   * What the decision costs, underneath — Figma's `body` layer, body/md.
   * Rendered into Ark's Description part, which is what gives the dialog
   * its `aria-describedby`.
   */
  body: ReactNode
  /**
   * The decision itself. Figma fills this slot with two md Buttons —
   * a ghost "Cancel" and the confirming one — drawn but not exposed as
   * properties, so they are the caller's to pass. Pass `size="md"` to
   * match the frame: Button's own default is `sm`, which disagrees with
   * its documented default and is raised separately.
   */
  children: ReactNode
  /**
   * The control that opens it, rendered *as* Ark's trigger via
   * `asChild`, so it must be a single element that takes a ref. Optional
   * — nothing is drawn for it, and a confirmation is as often opened
   * from code through `open` / `onOpenChange`.
   */
  trigger?: ReactElement
  /** @default 'Close' — the close glyph's accessible name. */
  closeLabel?: string
  /** Appended after the card's own class, on the drawn box. */
  className?: string
}

/**
 * A modal decision: a heavy-bordered card on a dimmed page, carrying a
 * headline, a line about what it costs, and the two verbs. Ark drives
 * opening, the focus trap, the escape key, dismissal on outside click,
 * body-scroll locking and the dialog ARIA; the visual design stays as
 * drawn.
 *
 * **`Tone` is not a prop.** It is the only axis Figma declares, and the
 * two variants are identical everywhere except one place: the
 * confirming button is `primary` in Default and `danger` in Danger. The
 * card, its border, shadow, padding, type and the ghost "Cancel" are
 * the same in both. Since the buttons are drawn instances rather than
 * component properties, they arrive through the slot anyway — so Tone
 * is expressed by which Button the caller puts there, exactly as
 * Popover leaves its own action unparameterised.
 *
 * Five decisions the design did not make:
 *
 * - **The caps are copy, not a transform.** Both titles are typed in
 *   capitals but `textCase` is ORIGINAL and heading/2 carries no
 *   `-transform` token, so nothing here uppercases the title. If caps
 *   is a rule rather than a convention it belongs in the heading/2
 *   token group — the way mono/overline already carries one — not in
 *   this component's CSS, which would put the two out of step. Flagged
 *   in Figma.
 * - **It is portalled**, unlike Popover and DatePicker, which are not.
 *   A modal's backdrop has to cover the viewport, and any ancestor with
 *   a `transform`, `filter` or `contain` silently re-anchors
 *   `position: fixed` to itself — so the overlay would stop covering
 *   the page while the focus trap kept working. That failure is quiet
 *   and severe in a way a clipped popover is not.
 * - **The close glyph is named here.** Ark's dialog machine, unlike its
 *   popover, puts no `aria-label` on the close trigger, which would
 *   leave an icon-only button unnamed. It gets "Close"; override with
 *   `closeLabel`.
 * - **The overlay comes from the example frame**, which is the only
 *   place it is drawn: `bg/overlay` at full bleed. The card centres in
 *   it.
 * - **A tall dialog scrolls rather than being cut off.** The frame
 *   draws one that fits; nothing specifies the other case.
 *
 * The card is fixed at the drawn 440 and its height hugs, so a longer
 * title or body grows it — which is exactly the difference between the
 * two drawn variants, at 242 and 205 tall.
 *
 * Ark's Root props pass through, including `role="alertdialog"` — worth
 * setting for a destructive confirmation, since it also moves initial
 * focus to the close trigger — and `open` / `defaultOpen` /
 * `onOpenChange` for opening it without a trigger.
 *
 * @example
 * ```tsx
 * <Dialog
 *   trigger={<Button tone="danger">Delete files</Button>}
 *   role="alertdialog"
 *   title="DELETE 214 FILES?"
 *   body="This empties the whole export folder. There is no trash, no undo, no second chance."
 * >
 *   <Button size="md" tone="ghost">Cancel</Button>
 *   <Button size="md" tone="danger" onClick={remove}>Delete forever</Button>
 * </Dialog>
 * ```
 *
 * Figma: Steelbook Design System › Dialog (node `41:46`), with the
 * overlay from Example / Dialog on overlay (node `41:47`).
 * Built on [Ark UI Dialog](https://ark-ui.com/docs/components/dialog).
 */
export function Dialog({
  title,
  body,
  children,
  trigger,
  closeLabel = CLOSE_LABEL,
  className,
  ...props
}: DialogProps) {
  return (
    <ArkDialog.Root {...props}>
      {trigger ? <ArkDialog.Trigger asChild>{trigger}</ArkDialog.Trigger> : null}
      <Portal>
        <ArkDialog.Backdrop className="sb-dialog__backdrop" />
        <ArkDialog.Positioner className="sb-dialog__positioner">
          <ArkDialog.Content className={className ? `sb-dialog ${className}` : 'sb-dialog'}>
            <div className="sb-dialog__header">
              <ArkDialog.Title className="sb-dialog__title">{title}</ArkDialog.Title>
              <ArkDialog.CloseTrigger className="sb-dialog__close" aria-label={closeLabel}>
                <XIcon />
              </ArkDialog.CloseTrigger>
            </div>
            <ArkDialog.Description className="sb-dialog__body">{body}</ArkDialog.Description>
            <div className="sb-dialog__actions">{children}</div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
