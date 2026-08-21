import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './ScrollArea'

const COPY =
  'Content overflows; the viewport does not flinch. The custom scrollbar is part of the design: a black block riding a muted rail. Native browser chrome is themed to match — scrollbar, selection, caret, all of it. Nothing ships on defaults.'

const bodySm = {
  margin: 0,
  fontFamily: 'var(--sb-text-body-sm-family)',
  fontWeight: 'var(--sb-text-body-sm-weight)',
  fontSize: 'var(--sb-text-body-sm-size)',
  lineHeight: 'var(--sb-text-body-sm-line-height)',
  color: 'var(--sb-text-secondary)',
} as const

/**
 * Figma: Steelbook Design System › Scroll Area (node `40:542`).
 *
 * Figma's `Orientation` axis is not a prop — the machine measures each
 * axis against the content and draws only the bars that are needed. The
 * two variants below are the same component holding tall content and
 * wide content.
 *
 * The box is sized by the caller; the drawn 320 x 200 is the example's
 * size. Every story sets it, because a scroll area that is not
 * constrained never scrolls.
 *
 * Tab to the viewport and the arrows, Page keys and Home / End scroll
 * it. The thumb also drags, and clicking the rail pages toward the
 * click.
 */
const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  args: {
    style: { inlineSize: 320, blockSize: 200 },
    children: <p style={bodySm}>{COPY}</p>,
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/** Orientation=Vertical — tall content, the bar down the right edge. */
export const Vertical: Story = {
  args: {
    children: (
      <>
        <p style={bodySm}>{COPY}</p>
        <p style={bodySm}>{COPY}</p>
      </>
    ),
  },
}

/** Orientation=Horizontal — one unbroken line, the bar along the bottom. */
export const Horizontal: Story = {
  args: {
    children: <p style={{ ...bodySm, whiteSpace: 'nowrap' }}>{COPY}</p>,
  },
}

/**
 * Both axes at once. The bars stop short of each other and the corner
 * fills the square between them — a state the design never draws,
 * since each variant scrolls one way.
 */
export const BothAxes: Story = {
  args: {
    children: (
      <div style={{ inlineSize: 560 }}>
        <p style={bodySm}>{COPY}</p>
        <p style={bodySm}>{COPY}</p>
        <p style={bodySm}>{COPY}</p>
        <p style={bodySm}>{COPY}</p>
      </div>
    ),
  },
}

/**
 * Content that fits. No bar is drawn and the inset stays even on all
 * four sides — nothing reserves a gutter it does not need.
 */
export const NoOverflow: Story = {
  args: {
    children: <p style={bodySm}>Short enough to fit.</p>,
  },
}

/** A list rather than prose: the viewport imposes no type of its own. */
export const List: Story = {
  args: {
    children: (
      <ul style={{ ...bodySm, paddingInlineStart: 'var(--sb-gap-md)' }}>
        {[
          'Gunmetal',
          'Concrete',
          'Rebar',
          'Blast furnace',
          'Safety orange',
          'Weathering steel',
          'Galvanised',
          'Mill scale',
          'Quench',
          'Temper',
        ].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
}

/** Right-to-left: the vertical bar moves to the left edge. */
export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    children: (
      <>
        <p style={bodySm}>{COPY}</p>
        <p style={bodySm}>{COPY}</p>
      </>
    ),
  },
}
