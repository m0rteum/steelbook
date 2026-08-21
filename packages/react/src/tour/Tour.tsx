import { useEffect, useState, type CSSProperties } from 'react'
import { Portal } from '@ark-ui/react/portal'
import {
  Tour as ArkTour,
  useTour as useArkTour,
  type TourStepDetails,
  type UseTourProps as ArkUseTourProps,
  type UseTourReturn,
} from '@ark-ui/react/tour'
import { Button } from '../button/Button'
import { XIcon } from '../icons/XIcon'
import './Tour.css'

export type { UseTourReturn }

/** One coach mark's worth of content, as Ark's machine takes it. */
export type TourStep = TourStepDetails

/**
 * One button in a step's action row. Ark does not re-export the type from
 * its tour entry point, so it is read back off the step.
 */
export type TourAction = NonNullable<TourStepDetails['actions']>[number]

/**
 * The spotlight sits flush on its target. Ark inflates it by 10px on each
 * axis by default; the example frame cuts the overlay at exactly the
 * target's bounds and rings it there.
 */
const SPOTLIGHT_OFFSET = { x: 0, y: 0 }

/**
 * Square corners, like everything else here. Ark rounds the cut-out by
 * 4px by default; `radius/control` in this system is 0.
 */
const SPOTLIGHT_RADIUS = 0

/**
 * The frame draws the counter as `2 / 5`. Ark's own default reads
 * `2 of 5`, and the separator is the design's.
 */
const PROGRESS_TEXT = ({ current, total }: { current: number; total: number }) =>
  `${current + 1} / ${total}`

/**
 * The pair the frame draws, for any step that names no actions of its
 * own. Ark disables `prev` on the first step and `next` on the last, so
 * neither ever leads nowhere.
 */
const DEFAULT_ACTIONS: TourAction[] = [
  { label: 'Back', action: 'prev' },
  { label: 'Next', action: 'next' },
]

export type UseTourProps = ArkUseTourProps

/**
 * Ark's `useTour`, with the three things the design decides already set:
 * the spotlight sits flush on its target, it is not rounded, and the
 * step counter reads `2 / 5` rather than `2 of 5`. Everything else is
 * Ark's, and anything passed here wins.
 *
 * The tour is driven from the returned handle — `start()`, `next()`,
 * `prev()`, `setStep(id)` — which is why the machine is created out here
 * rather than inside the component, the same way `createToaster` sits
 * outside `Toaster`.
 *
 * @example
 * ```tsx
 * const tour = useTour({ steps })
 * return (
 *   <>
 *     <Button onClick={() => tour.start()}>Take the tour</Button>
 *     <Tour tour={tour} />
 *   </>
 * )
 * ```
 */
export function useTour(props: UseTourProps): UseTourReturn {
  return useArkTour({
    spotlightOffset: SPOTLIGHT_OFFSET,
    spotlightRadius: SPOTLIGHT_RADIUS,
    ...props,
    translations: { progressText: PROGRESS_TEXT, ...props.translations },
  })
}

/**
 * The height of the whole scrollable page, while the tour is open.
 *
 * Ark cuts the backdrop's hole in document coordinates and sizes the cut
 * to `document.documentElement.scrollHeight` — but the element it draws
 * that on is `position: absolute; inset: 0`, which resolves against the
 * viewport-sized initial containing block. On a page taller than one
 * screen the dim would stop one viewport down and the hole would fall
 * outside it entirely. The height is the one thing CSS cannot say, so it
 * is measured here and handed to the stylesheet.
 */
function usePageHeight(open: boolean): number | null {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return

    const root = document.documentElement
    const sync = () => setHeight(root.scrollHeight)
    sync()

    const observer = new ResizeObserver(sync)
    observer.observe(root)
    observer.observe(document.body)
    window.addEventListener('resize', sync)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [open])

  return height
}

export type TourProps = {
  /** The handle from {@link useTour}. */
  tour: UseTourReturn
  /** Appended after the coach mark's own class, on the drawn box. */
  className?: string
}

/**
 * A guided tour: the page dims, one element keeps its light behind an
 * accent ring, and a coach mark points at it — step counter, title, body,
 * Back and Next, and a close in the corner. Ark drives the stepping, the
 * positioning, the scroll-into-view, the arrow keys and the ARIA; the
 * visual design stays as drawn.
 *
 * **The spotlight is one element, not four.** The example frame builds
 * the dim out of four rectangles around a hole, because that is how you
 * draw a cut-out in Figma. Ark cuts the same hole with a `clip-path` on a
 * single backdrop, computed from the target's rect, and puts the accent
 * ring on a second element sized to the target. Same picture, and it
 * follows a target that moves.
 *
 * **The machine lives outside.** `Tour` renders; {@link useTour} is what
 * you hold and call `start()` on. That split is Ark's own Root API and
 * the one `Toaster` already uses.
 *
 * Five decisions the design did not make:
 *
 * - **Back and Next are the default, not the only, actions.** Ark takes
 *   the buttons from each step's `actions`; the frame draws exactly the
 *   drawn pair, so that pair is what a step gets when it names none. Ark
 *   disables Back on the first step and Next on the last.
 * - **The last action is the primary one.** The frame draws Back ghost
 *   and Next primary, and Next is last; a step that names three actions
 *   gets one primary at the end and ghosts before it.
 * - **The last action is pushed to the far edge.** The frame springs the
 *   two apart with a filled spacer, which is the same thing, and it
 *   degrades correctly: a lone action still sits at the right.
 * - **Nothing is drawn for finishing.** Ark disables Next on the last
 *   step, so as drawn a tour ends through the close in the corner, the
 *   Escape key, or a click outside. Give the last step an action of
 *   `dismiss` if it should end on a button. Raised in Figma.
 * - **No arrow.** Ark can draw one between the mark and its target; the
 *   frame draws none, so none is rendered.
 *
 * Every value in the stylesheet is a token. The one un-namespaced custom
 * property, `--tour-z-index`, is Ark's own and has to be declared for its
 * layering to resolve — there is no z-index scale in the token set to
 * anchor it to, which is flagged.
 *
 * @example
 * ```tsx
 * const tour = useTour({
 *   steps: [
 *     {
 *       id: 'tokens',
 *       target: () => document.querySelector('#token-panel'),
 *       title: 'THIS IS YOUR TOKEN PANEL',
 *       description: 'Every color you see resolves through here.',
 *     },
 *   ],
 * })
 * ```
 *
 * Figma: Steelbook Design System › Tour Step (node `46:2`), with the
 * spotlight from Example / Tour spotlight (node `46:28`).
 * Built on [Ark UI Tour](https://ark-ui.com/docs/components/tour).
 */
export function Tour({ tour, className }: TourProps) {
  const pageHeight = usePageHeight(tour.open)

  return (
    <ArkTour.Root tour={tour}>
      <Portal>
        <ArkTour.Backdrop
          className="sb-tour__backdrop"
          style={
            pageHeight == null
              ? undefined
              : ({ '--sb-tour-page-height': `${pageHeight}px` } as CSSProperties)
          }
        />
        <ArkTour.Spotlight className="sb-tour__spotlight" />

        <ArkTour.Positioner className="sb-tour__positioner">
          <ArkTour.Content className={className ? `sb-tour ${className}` : 'sb-tour'}>
            <div className="sb-tour__header">
              <ArkTour.ProgressText className="sb-tour__progress" />
              {/* Ark names this from its own translations — "close tour"
                  by default — which is what an icon-only control needs. */}
              <ArkTour.CloseTrigger className="sb-tour__close">
                <XIcon className="sb-tour__close-glyph" />
              </ArkTour.CloseTrigger>
            </div>

            <ArkTour.Title className="sb-tour__title" />
            <ArkTour.Description className="sb-tour__body" />

            <ArkTour.Actions>
              {(actions) => {
                const shown = actions.length > 0 ? actions : DEFAULT_ACTIONS
                return (
                  <div className="sb-tour__actions">
                    {shown.map((action, index) => (
                      <ArkTour.ActionTrigger key={action.label} action={action} asChild>
                        <Button
                          className="sb-tour__action"
                          size="sm"
                          tone={index === shown.length - 1 ? 'primary' : 'ghost'}
                        >
                          {action.label}
                        </Button>
                      </ArkTour.ActionTrigger>
                    ))}
                  </div>
                )
              }}
            </ArkTour.Actions>
          </ArkTour.Content>
        </ArkTour.Positioner>
      </Portal>
    </ArkTour.Root>
  )
}
