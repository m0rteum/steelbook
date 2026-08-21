import type { ReactNode } from 'react'
import {
  ScrollArea as ArkScrollArea,
  type ScrollAreaRootProps,
} from '@ark-ui/react/scroll-area'
import './ScrollArea.css'

export type ScrollAreaProps = Omit<ScrollAreaRootProps, 'children'> & {
  /** What scrolls. */
  children: ReactNode
  /** Appended after the box's own class, on the drawn frame. */
  className?: string
}

/**
 * A bordered viewport that scrolls its content behind a scrollbar the
 * system owns: a black thumb riding a muted rail, square, flush to the
 * inside edge. Ark drives the measuring, the thumb geometry, dragging,
 * click-to-page and the ARIA; the visual design stays as drawn.
 *
 * **`Orientation` is not a prop.** Figma draws Vertical and Horizontal
 * as a variant axis because a static frame cannot show a scrollbar
 * appearing, but which bar exists is a fact about the content, not a
 * choice about the component — the machine measures the viewport
 * against its content and marks each axis `data-overflow-x` /
 * `data-overflow-y`, and the stylesheet hides the bar whose axis does
 * not overflow. Both scrollbars are always rendered; at most the ones
 * that are needed are visible. The two drawn variants are this one
 * component holding tall content and wide content.
 *
 * Four decisions the design did not make:
 *
 * - **The caller sizes the box.** A scroll area only scrolls when it is
 *   constrained, and the drawn 320 x 200 is the example's size, not the
 *   component's — the same reading Field's 320 gets. Nothing here sets
 *   a height, so give it one (or a `max-block-size`) or it will simply
 *   grow to fit and never scroll.
 * - **It is reachable from the keyboard.** Ark makes the viewport
 *   tabbable only when *both* axes overflow, which leaves the ordinary
 *   vertical scroll area — the one this file draws first — unfocusable
 *   and so unscrollable without a pointer. That is a WCAG 2.1.1 failure
 *   and it contradicts the annotation, which says Ark supplies the
 *   keyboard. The viewport is made tabbable whenever *either* axis
 *   overflows. Delete the override once upstream changes that `||`.
 * - **Focus is drawn with the house ring.** Nothing is drawn for it, so
 *   the tabbable viewport takes the same 3px inset `border/focus` ring
 *   Listbox uses, rather than a browser default that belongs to no
 *   design.
 * - **The corner is the rail continuing.** When both axes overflow the
 *   two bars leave a square hole between them, which Ark reserves and
 *   the design never shows, since neither drawn variant scrolls both
 *   ways. It is filled with `bg/muted`, the rail's own colour.
 *
 * The viewport's 16 inset is inferred from where the sample text sits
 * rather than declared — the frame has no auto-layout, so Figma records
 * no padding. The drawn content width of 264 is exactly what that inset
 * plus the scrollbar's reserved gutter leaves, which is the reason to
 * read it as padding. Flagged in Figma.
 *
 * Not styled: what goes inside. The body/sm copy in the frame is sample
 * content, so the viewport imposes no type on its children.
 *
 * @example
 * ```tsx
 * <ScrollArea style={{ blockSize: 200 }}>
 *   <p>Content that overflows…</p>
 * </ScrollArea>
 * ```
 *
 * Figma: Steelbook Design System › Scroll Area (node `40:542`).
 * Built on [Ark UI ScrollArea](https://ark-ui.com/docs/components/scroll-area).
 */
export function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <ArkScrollArea.Root
      {...props}
      className={className ? `sb-scroll-area ${className}` : 'sb-scroll-area'}
    >
      <ArkScrollArea.Context>
        {(api) => (
          <ArkScrollArea.Viewport
            className="sb-scroll-area__viewport"
            tabIndex={api.hasOverflowX || api.hasOverflowY ? 0 : undefined}
          >
            <ArkScrollArea.Content className="sb-scroll-area__content">
              {children}
            </ArkScrollArea.Content>
          </ArkScrollArea.Viewport>
        )}
      </ArkScrollArea.Context>
      {/* Both bars are always mounted; each hides itself when its own
          axis has nothing to scroll. */}
      <ArkScrollArea.Scrollbar orientation="vertical" className="sb-scroll-area__scrollbar">
        <ArkScrollArea.Thumb className="sb-scroll-area__thumb" />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar orientation="horizontal" className="sb-scroll-area__scrollbar">
        <ArkScrollArea.Thumb className="sb-scroll-area__thumb" />
      </ArkScrollArea.Scrollbar>
      {/* Has to exist for the machine to measure the square where the
          two bars meet; without it they would run into each other. */}
      <ArkScrollArea.Corner className="sb-scroll-area__corner" />
    </ArkScrollArea.Root>
  )
}
