import type { CSSProperties, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Splitter, type SplitterPane } from './Splitter'

/**
 * The drawn frame's size. Ark sizes the root to its container, so the
 * stories supply the box the Figma frame supplies on the canvas.
 */
const frame: CSSProperties = { inlineSize: '420px', blockSize: '240px' }

/**
 * The placeholder labels the frame draws — mono-ish caps in text/muted,
 * centred. The centring is the story's, not the component's: the panes are
 * slots, and what goes in them is laid out by whoever puts it there.
 */
const label: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  blockSize: '100%',
  color: 'var(--sb-text-muted)',
  fontFamily: 'var(--sb-text-mono-sm-family)',
  fontSize: 'var(--sb-text-mono-sm-size)',
  letterSpacing: 'var(--sb-text-mono-sm-tracking)',
}

const Label = ({ children }: { children: ReactNode }) => <div style={label}>{children}</div>

/** Neither pane may be dragged below a fifth of the box. */
const constrained: [SplitterPane, SplitterPane] = [{ minSize: 20 }, { minSize: 20 }]

/** The first pane collapses to nothing and comes back. */
const collapsible: [SplitterPane, SplitterPane] = [
  { minSize: 15, collapsible: true, collapsedSize: 0 },
  { minSize: 20 },
]

/**
 * Figma: Steelbook Design System › Splitter (node `42:555`).
 *
 * Drag the black bar to resize, or focus it and use the arrow keys — Home
 * and End take it to either limit. `Orientation` is the file's one variant
 * axis and a real prop: it decides the layout, and the grip turns a quarter
 * turn with it.
 *
 * The component fills its container, which is why every story wraps it in
 * the drawn 420 x 240 box.
 */
const meta = {
  title: 'Components/Splitter',
  component: Splitter,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={frame}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Splitter>

export default meta
type Story = StoryObj<typeof meta>

/** Orientation=Horizontal — the default variant. */
export const Horizontal: Story = {
  args: { start: <Label>PANE-A</Label>, end: <Label>PANE-B</Label> },
}

/** Orientation=Vertical. */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    start: <Label>PANE-A</Label>,
    end: <Label>PANE-B</Label>,
  },
}

/** Opened off centre, which Ark takes as percentages. */
export const Uneven: Story = {
  args: {
    defaultSize: [30, 70],
    start: <Label>30%</Label>,
    end: <Label>70%</Label>,
  },
}

/** Neither pane can be dragged away entirely. */
export const Constrained: Story = {
  args: {
    panes: constrained,
    start: <Label>MIN 20%</Label>,
    end: <Label>MIN 20%</Label>,
  },
}

/** The first pane collapses when dragged past its minimum, and reopens. */
export const Collapsible: Story = {
  args: {
    panes: collapsible,
    start: <Label>COLLAPSIBLE</Label>,
    end: <Label>PANE-B</Label>,
  },
}

/**
 * Real content rather than labels — which is what the panes are for, and
 * why they do not centre what goes in them.
 */
export const WithContent: Story = {
  args: {
    panes: constrained,
    start: (
      <ul
        style={{
          margin: 0,
          padding: 'var(--sb-gap-sm)',
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sb-gap-2xs)',
          color: 'var(--sb-text-secondary)',
          fontFamily: 'var(--sb-text-mono-sm-family)',
          fontSize: 'var(--sb-text-mono-sm-size)',
        }}
      >
        <li>src/</li>
        <li>&nbsp;&nbsp;index.ts</li>
        <li>&nbsp;&nbsp;splitter/</li>
        <li>tokens.css</li>
      </ul>
    ),
    end: (
      <pre
        style={{
          margin: 0,
          padding: 'var(--sb-gap-sm)',
          color: 'var(--sb-text-primary)',
          fontFamily: 'var(--sb-text-mono-sm-family)',
          fontSize: 'var(--sb-text-mono-sm-size)',
          lineHeight: 'var(--sb-text-mono-sm-line-height)',
        }}
      >{`export { Splitter }
  from './splitter'`}</pre>
    ),
  },
}
