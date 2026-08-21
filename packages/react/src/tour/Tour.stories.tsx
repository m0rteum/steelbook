import { useEffect, useRef, type CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { Tour, useTour, type TourStep } from './Tour'

/** The example frame's canvas: 800 x 480 on bg/canvas. */
const canvas: CSSProperties = {
  position: 'relative',
  inlineSize: '800px',
  blockSize: '480px',
  padding: 'var(--sb-gap-xl)',
  backgroundColor: 'var(--sb-bg-canvas)',
  border: 'var(--sb-stroke-default) solid var(--sb-border-default)',
  boxSizing: 'border-box',
}

/** The example frame's target: 200 x 80 on bg/surface-raised. */
const panel: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  inlineSize: '200px',
  blockSize: '80px',
  backgroundColor: 'var(--sb-bg-surface-raised)',
  border: 'var(--sb-stroke-default) solid var(--sb-border-default)',
  boxSizing: 'border-box',
  color: 'var(--sb-text-secondary)',
  fontFamily: 'var(--sb-text-mono-sm-family)',
  fontSize: 'var(--sb-text-mono-sm-size)',
}

const STEPS: TourStep[] = [
  {
    id: 'tokens',
    target: () => document.querySelector<HTMLElement>('#token-panel'),
    title: 'THIS IS YOUR TOKEN PANEL',
    description:
      'Every color you see resolves through here. Change a token once, watch forty components obey.',
  },
  {
    id: 'components',
    target: () => document.querySelector<HTMLElement>('#component-panel'),
    title: 'AND THIS IS THE SHELF',
    description: 'Forty of them, all reading the same values. None of them own a hex code.',
  },
  {
    id: 'canvas',
    target: () => document.querySelector<HTMLElement>('#canvas-panel'),
    title: 'THE CANVAS',
    description: 'Drop a component here and it arrives already dressed.',
  },
]

/** A three-panel page for the tour to walk across. */
function Stage() {
  return (
    <div style={{ display: 'flex', gap: 'var(--sb-gap-lg)', flexWrap: 'wrap' }}>
      <div id="token-panel" style={panel}>
        TOKENS
      </div>
      <div id="component-panel" style={panel}>
        COMPONENTS
      </div>
      <div id="canvas-panel" style={panel}>
        CANVAS
      </div>
    </div>
  )
}

/**
 * Figma: Steelbook Design System › Tour Step (node `46:2`), with the
 * spotlight from Example / Tour spotlight (node `46:28`).
 *
 * Press the button to start. The page dims, one panel keeps its light
 * behind an accent ring, and the coach mark points at it. The left and
 * right arrow keys step through it, Escape ends it, and so does the close
 * in the corner.
 *
 * The example frame draws the dim as four rectangles around a hole, which
 * is how a cut-out is drawn in Figma. Ark cuts the same hole with one
 * `clip-path` on a single backdrop, so it follows a target that moves.
 */
const meta: Meta<typeof Tour> = {
  title: 'Components/Tour',
  component: Tour,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Tour>

/** The drawn tour: three steps, Back and Next on each. */
export const Default: Story = {
  render: function DefaultStory() {
    const tour = useTour({ steps: STEPS })

    return (
      <div style={canvas}>
        <Button size="sm" onClick={() => tour.start()}>
          Take the tour
        </Button>
        <div style={{ marginBlockStart: 'var(--sb-gap-lg)' }}>
          <Stage />
        </div>
        <Tour tour={tour} />
      </div>
    )
  },
}

/** Opened on load, sitting on the first panel, which is the frame's state. */
export const Open: Story = {
  render: function OpenStory() {
    const tour = useTour({ steps: STEPS })
    const started = useRef(false)

    useEffect(() => {
      if (started.current) return
      started.current = true
      tour.start()
    }, [tour])

    return (
      <div style={canvas}>
        <Stage />
        <Tour tour={tour} />
      </div>
    )
  },
}

/**
 * A last step that ends on a button. Ark disables Next at the end, so
 * without an action of `dismiss` a tour finishes through the close, the
 * Escape key, or a click outside.
 */
export const WithFinish: Story = {
  render: function WithFinishStory() {
    const tour = useTour({
      steps: STEPS.map((step, index) =>
        index === STEPS.length - 1
          ? {
              ...step,
              actions: [
                { label: 'Back', action: 'prev' as const },
                { label: 'Finish', action: 'dismiss' as const },
              ],
            }
          : step,
      ),
    })

    return (
      <div style={canvas}>
        <Button size="sm" onClick={() => tour.start()}>
          Take the tour
        </Button>
        <div style={{ marginBlockStart: 'var(--sb-gap-lg)' }}>
          <Stage />
        </div>
        <Tour tour={tour} />
      </div>
    )
  },
}

/**
 * A step with no target: Ark centres it and dims the whole page, with no
 * spotlight to cut.
 */
export const DialogStep: Story = {
  render: function DialogStepStory() {
    const tour = useTour({
      steps: [
        {
          id: 'welcome',
          type: 'dialog',
          title: 'WELCOME TO STEELBOOK',
          description: 'Four screens, no hex codes. This will take a minute.',
          actions: [{ label: 'Start', action: 'next' as const }],
        },
        ...STEPS,
      ],
    })

    return (
      <div style={canvas}>
        <Button size="sm" onClick={() => tour.start()}>
          Take the tour
        </Button>
        <div style={{ marginBlockStart: 'var(--sb-gap-lg)' }}>
          <Stage />
        </div>
        <Tour tour={tour} />
      </div>
    )
  },
}
