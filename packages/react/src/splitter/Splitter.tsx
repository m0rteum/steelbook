import { useMemo, type ReactNode } from 'react'
import {
  Splitter as ArkSplitter,
  type SplitterPanelData,
  type SplitterRootProps,
} from '@ark-ui/react/splitter'
import { GripVerticalIcon } from '../icons/GripVerticalIcon'
import './Splitter.css'

/** Figma's `pane-a`. */
const START = 'start'

/** Figma's `pane-b`. */
const END = 'end'

/**
 * Ark identifies a divider by the two panels it sits between, as
 * `before:after`. There is one divider here, so there is one id.
 */
const RESIZE_TRIGGER = `${START}:${END}` as const

/** The bar is focusable and carries only a glyph, so it needs a name. */
const HANDLE_LABEL = 'Resize panes'

/** No constraints are drawn, so none are imposed. */
const DEFAULT_PANES: [SplitterPane, SplitterPane] = [{}, {}]

/**
 * What a pane may say about its own size: `minSize`, `maxSize`,
 * `collapsible`, `collapsedSize`, `resizeBehavior`. The id is the
 * component's, so it is not part of this.
 */
export type SplitterPane = Omit<SplitterPanelData, 'id' | 'order'>

export type SplitterProps = Omit<SplitterRootProps, 'children' | 'panels'> & {
  /** The first pane — left when horizontal, top when vertical. Figma's `pane-a`. */
  start: ReactNode
  /** The second pane, which carries the muted fill. Figma's `pane-b`. */
  end: ReactNode
  /**
   * Size constraints for the two panes, in order. Keep the array stable
   * across renders — a fresh literal each time re-seeds Ark's machine.
   */
  panes?: [SplitterPane, SplitterPane]
  /** The bar's accessible name, for callers not working in English. */
  handleLabel?: string
  /** Appended after the component's own class, on the drawn box. */
  className?: string
}

/**
 * Two resizable panes with one black bar between them, carrying a grip.
 * Ark drives the dragging, the keyboard, the sizing maths and the ARIA;
 * the visual design stays as drawn.
 *
 * **The component fills its container.** Ark writes `width: 100%` and
 * `height: 100%` onto the root inline, which is right for a splitter — the
 * drawn 420 x 240 is the size of the frame it was drawn in, not an
 * intrinsic size. Give it a box.
 *
 * `Orientation` is a real prop here, unlike the state axes elsewhere in
 * this system: it decides the layout, not the skin. It passes straight
 * through to Ark as `orientation`, defaulting to `horizontal` — the
 * default variant in Figma. In the vertical orientation the grip is turned
 * a quarter turn, which is what the frame draws.
 *
 * Four decisions the design did not make:
 *
 * - **The panes are slots, not centred boxes.** Figma centres the content
 *   of both panes, but the only thing in them is a placeholder label —
 *   centring a file tree or an editor would be wrong. The panes are plain
 *   clipping slots and the caller lays out what goes in. Raised in Figma.
 * - **The border runs the whole way round.** In the file, the panes and
 *   the bar are opaque children drawn over the frame's inside stroke, so
 *   the render shows a border only where a pane is transparent. CSS paints
 *   a border outside its content, so the drawn 2px `border/default` shows
 *   on all four sides. Raised in Figma.
 * - **The focus ring goes outside the bar, not inside it.** The house ring
 *   is 3px, drawn inset everywhere else; inset on a 12px bar would swallow
 *   the grip. It sits outside instead, over 3px of each pane.
 * - **Only the pane geometry is exposed.** Ark supports any number of
 *   panels; the frame draws two, with a fill that tells them apart, so two
 *   is what this ships.
 *
 * Every value in the stylesheet is a token except the bar's 12px, which is
 * off the scale and bound to nothing in Figma. It is carried as a local on
 * the block and flagged rather than snapped.
 *
 * @example
 * ```tsx
 * <div style={{ inlineSize: 420, blockSize: 240 }}>
 *   <Splitter
 *     start={<FileTree />}
 *     end={<Editor />}
 *     panes={[{ minSize: 20 }, { minSize: 20 }]}
 *   />
 * </div>
 * ```
 *
 * Figma: Steelbook Design System › Splitter (node `42:555`).
 * Built on [Ark UI Splitter](https://ark-ui.com/docs/components/splitter).
 */
export function Splitter({
  start,
  end,
  panes = DEFAULT_PANES,
  handleLabel = HANDLE_LABEL,
  className,
  ...props
}: SplitterProps) {
  const panels = useMemo(
    () => [
      { ...panes[0], id: START },
      { ...panes[1], id: END },
    ],
    [panes],
  )

  return (
    <ArkSplitter.Root
      {...props}
      panels={panels}
      className={className ? `sb-splitter ${className}` : 'sb-splitter'}
    >
      <ArkSplitter.Panel id={START} className="sb-splitter__pane">
        {start}
      </ArkSplitter.Panel>

      <ArkSplitter.ResizeTrigger
        id={RESIZE_TRIGGER}
        className="sb-splitter__handle"
        aria-label={handleLabel}
      >
        {/* One glyph in both orientations: the frame draws icons/grip-vertical
            either way and turns it a quarter turn for the horizontal bar,
            which the stylesheet does off data-orientation. */}
        <GripVerticalIcon className="sb-splitter__grip" />
      </ArkSplitter.ResizeTrigger>

      <ArkSplitter.Panel id={END} className="sb-splitter__pane sb-splitter__pane--end">
        {end}
      </ArkSplitter.Panel>
    </ArkSplitter.Root>
  )
}
