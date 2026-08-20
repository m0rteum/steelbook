import type { ReactNode } from 'react'
import {
  FloatingPanel as ArkFloatingPanel,
  type FloatingPanelRootProps,
} from '@ark-ui/react/floating-panel'
import { GripVerticalIcon } from '../icons/GripVerticalIcon'
import { MinusIcon } from '../icons/MinusIcon'
import { XIcon } from '../icons/XIcon'
import './FloatingPanel.css'

/**
 * The ridged resize corner, exported from the Figma frame verbatim (node
 * `42:533`) rather than redrawn: two 45°-rotated bars, clipped by the
 * 14px box. Recolored through `currentColor`.
 */
function ResizeRidges() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#sb-floating-panel-resize-clip)">
        <rect x="2" y="10" width="10" height="2" transform="rotate(45 2 10)" fill="currentColor" />
        <rect x="7" y="11" width="6" height="2" transform="rotate(45 7 11)" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="sb-floating-panel-resize-clip">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export type FloatingPanelProps = Omit<FloatingPanelRootProps, 'children'> & {
  /**
   * The title-bar text. Required — it is the panel's accessible name,
   * which Ark wires up through `aria-labelledby` on the dialog.
   */
  title: ReactNode
  /** The panel body. Figma draws it as a slot. */
  children?: ReactNode
  /** Appended after the panel's own class, on the drawn box. */
  className?: string
}

/**
 * A tool window that floats over the canvas: black title bar with grip,
 * minimize and close, a slot body, and a ridged resize corner. Ark drives
 * dragging, resizing, the minimize/restore stages, focus and the dialog
 * ARIA; the visual design stays as drawn.
 *
 * The panel is a single Figma frame but three Ark elements — Positioner
 * (placement), Content (the drawn box) and Body. `className` lands on the
 * Content, which is what the design draws. Ark writes the panel's width
 * and height inline from the machine, so the size travels through
 * `defaultSize` rather than CSS; it defaults to the drawn 320 × 260,
 * where Ark's own fallback would be 320 × 240.
 *
 * Four decisions the design did not make:
 *
 * - **It opens by itself.** No trigger is drawn and the frame is drawn
 *   visible, so `defaultOpen` defaults to `true`. Pass `open` /
 *   `defaultOpen` (and render your own `Trigger` alongside) to control it.
 * - **The whole bar drags, not just the grip.** Figma names a
 *   `drag-handle` element, but Ark's DragTrigger deliberately ignores
 *   drags that start on a button so it can wrap the entire header, and a
 *   title bar you cannot drag by would be a surprise. The grip is kept as
 *   the affordance that says so.
 * - **Minimize has no drawn way back.** Only minus and x are drawn, so
 *   only `stage="minimized"` and the close trigger are rendered. Ark
 *   restores a minimized panel on a double-click of the title bar, which
 *   is the only route until a restore glyph exists.
 * - **Focus is not drawn.** Ark makes the panel focusable (arrow keys
 *   move it), so `:focus-visible` gets the house 3px accent ring rather
 *   than a browser default that belongs to no design.
 *
 * Not portalled: the Positioner is `position: fixed`, so drop the panel
 * inside a transformed ancestor and it will anchor to that instead of the
 * viewport. Wrap it in Ark's `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <FloatingPanel title="INSPECTOR">
 *   <p>Anything you like.</p>
 * </FloatingPanel>
 * ```
 *
 * Figma: Steelbook Design System › Floating Panel (node `42:522`).
 * Built on [Ark UI FloatingPanel](https://ark-ui.com/docs/components/floating-panel).
 */
export function FloatingPanel({
  title,
  children,
  className,
  defaultOpen = true,
  defaultSize = { width: 320, height: 260 },
  ...props
}: FloatingPanelProps) {
  return (
    <ArkFloatingPanel.Root {...props} defaultOpen={defaultOpen} defaultSize={defaultSize}>
      <ArkFloatingPanel.Positioner className="sb-floating-panel__positioner">
        <ArkFloatingPanel.Content
          className={className ? `sb-floating-panel ${className}` : 'sb-floating-panel'}
        >
          <ArkFloatingPanel.DragTrigger className="sb-floating-panel__drag">
            <ArkFloatingPanel.Header className="sb-floating-panel__bar">
              <span className="sb-floating-panel__grip" aria-hidden="true">
                <GripVerticalIcon />
              </span>
              <ArkFloatingPanel.Title className="sb-floating-panel__title">
                {title}
              </ArkFloatingPanel.Title>
              <ArkFloatingPanel.StageTrigger
                stage="minimized"
                className="sb-floating-panel__control"
              >
                <MinusIcon />
              </ArkFloatingPanel.StageTrigger>
              <ArkFloatingPanel.CloseTrigger className="sb-floating-panel__control">
                <XIcon />
              </ArkFloatingPanel.CloseTrigger>
            </ArkFloatingPanel.Header>
          </ArkFloatingPanel.DragTrigger>
          <ArkFloatingPanel.Body className="sb-floating-panel__body">{children}</ArkFloatingPanel.Body>
          <ArkFloatingPanel.ResizeTrigger axis="se" className="sb-floating-panel__resize">
            <ResizeRidges />
          </ArkFloatingPanel.ResizeTrigger>
        </ArkFloatingPanel.Content>
      </ArkFloatingPanel.Positioner>
    </ArkFloatingPanel.Root>
  )
}
