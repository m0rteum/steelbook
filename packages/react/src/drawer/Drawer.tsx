import type { ReactElement, ReactNode } from 'react'
import { Drawer as ArkDrawer, type DrawerRootProps } from '@ark-ui/react/drawer'
import { Portal } from '@ark-ui/react/portal'
import { XIcon } from '../icons/XIcon'
import './Drawer.css'

/**
 * The edge the sheet is pinned to. "end" rather than "right" so the
 * spine, the slide and the swipe all follow writing direction together —
 * the panel's own border is a logical inline-start edge for the same
 * reason.
 */
const SWIPE_DIRECTION = 'end'

/** What the close glyph is called, since Ark's drawer machine names nothing. */
const CLOSE_LABEL = 'Close'

export type DrawerProps = Omit<DrawerRootProps, 'children'> & {
  /** Figma text property `Title` — heading/2 on the header row. */
  title: ReactNode
  /**
   * The sheet's business. Figma leaves this a slot in as many words:
   * "Drop Fields, Checkboxes, Radio Groups — anything from the lower
   * tiers." It scrolls when it outgrows the panel.
   */
  children: ReactNode
  /**
   * The row under the rule. Figma fills it with two md Buttons — a
   * ghost "Reset" and a primary "Apply" — drawn but not exposed as
   * properties, so they are the caller's to pass. Pass `size="md"` to
   * match the frame: Button's own default is `sm`, which disagrees with
   * its documented default and is raised separately.
   */
  footer: ReactNode
  /**
   * The control that opens it, rendered *as* Ark's trigger via
   * `asChild`, so it must be a single element that takes a ref.
   * Optional — nothing is drawn for it, and a drawer is as often opened
   * from code through `open` / `onOpenChange`.
   */
  trigger?: ReactElement
  /** @default 'Close' — the close glyph's accessible name. */
  closeLabel?: string
  /** Appended after the panel's own class, on the drawn sheet. */
  className?: string
}

/**
 * A side sheet: a full-height panel pinned to the trailing edge behind a
 * 3px spine, with a titled header, a scrolling slot and a row of verbs,
 * each separated by a rule. Ark drives opening, the focus trap, the
 * escape key, dismissal on outside click, swipe-to-dismiss,
 * body-scroll locking and the dialog ARIA; the visual design stays as
 * drawn.
 *
 * Six decisions the design did not make:
 *
 * - **Nothing animates.** Figma draws the sheet at rest and says
 *   nothing about motion, so none is invented — unlike Marquee, whose
 *   description asked for it outright. Ark publishes `data-state` and
 *   `data-swipe-direction` on the panel precisely so a stylesheet can
 *   slide it; it is one rule if that is wanted. Raised in Figma.
 * - **The content slot scrolls.** The frame clips it, which loses
 *   anything past the fold. A drawer full of fields is the case the
 *   slot copy names, so it scrolls instead; the header and footer stay
 *   put, which is the point of the two rules.
 * - **The caps are copy, not a transform** — same as Dialog. "FILTERS"
 *   is typed in capitals but `textCase` is ORIGINAL and heading/2
 *   carries no `-transform` token, so nothing uppercases the title.
 * - **The close glyph is named here.** Ark's drawer machine puts no
 *   `aria-label` on the close trigger, which would leave an icon-only
 *   button unnamed. It gets "Close"; override with `closeLabel`.
 * - **It is portalled**, for the reason Dialog is: a modal's backdrop
 *   has to cover the viewport, and any ancestor carrying a `transform`,
 *   `filter` or `contain` silently re-anchors `position: fixed` to
 *   itself.
 * - **The overlay comes from the example frame**, the only place it is
 *   drawn: `bg/overlay` at full bleed behind the sheet.
 *
 * The panel is fixed at the drawn 380 wide and takes the full height of
 * the window, so the header and footer keep their drawn 81 and 84 and
 * the slot between them takes whatever is left.
 *
 * Ark's Root props pass through, including `open` / `defaultOpen` /
 * `onOpenChange` for opening it without a trigger, `modal`,
 * `closeOnEscape`, `closeOnInteractOutside`, and the swipe controls
 * (`swipeDirection`, `closeThreshold`, `preventDragOnScroll`,
 * `snapPoints`). No grabber is drawn, so none is rendered.
 *
 * @example
 * ```tsx
 * <Drawer
 *   trigger={<Button tone="secondary">Filters</Button>}
 *   title="FILTERS"
 *   footer={
 *     <>
 *       <Button size="md" tone="ghost">Reset</Button>
 *       <Button size="md" tone="primary">Apply</Button>
 *     </>
 *   }
 * >
 *   <Field label="Name" />
 * </Drawer>
 * ```
 *
 * Figma: Steelbook Design System › Drawer (node `41:493`), with the
 * overlay from Example / Drawer over canvas (node `41:513`).
 * Built on [Ark UI Drawer](https://ark-ui.com/docs/components/drawer).
 */
export function Drawer({
  title,
  children,
  footer,
  trigger,
  closeLabel = CLOSE_LABEL,
  className,
  swipeDirection = SWIPE_DIRECTION,
  ...props
}: DrawerProps) {
  return (
    <ArkDrawer.Root {...props} swipeDirection={swipeDirection}>
      {trigger ? <ArkDrawer.Trigger asChild>{trigger}</ArkDrawer.Trigger> : null}
      <Portal>
        <ArkDrawer.Backdrop className="sb-drawer__backdrop" />
        <ArkDrawer.Positioner className="sb-drawer__positioner">
          <ArkDrawer.Content className={className ? `sb-drawer ${className}` : 'sb-drawer'}>
            <div className="sb-drawer__header">
              <ArkDrawer.Title className="sb-drawer__title">{title}</ArkDrawer.Title>
              <ArkDrawer.CloseTrigger className="sb-drawer__close" aria-label={closeLabel}>
                <XIcon />
              </ArkDrawer.CloseTrigger>
            </div>
            <div className="sb-drawer__content">{children}</div>
            <div className="sb-drawer__footer">{footer}</div>
          </ArkDrawer.Content>
        </ArkDrawer.Positioner>
      </Portal>
    </ArkDrawer.Root>
  )
}
