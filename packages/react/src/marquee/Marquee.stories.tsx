import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marquee } from './Marquee'

/**
 * Figma: Steelbook Design System › Marquee (node `40:530`).
 *
 * The frame can only draw the strip at rest; the description says to
 * animate it, so it moves here. Hover or focus it and it stops — motion
 * that loops forever needs a way out — and `prefers-reduced-motion`
 * parks it before it ever starts.
 *
 * The strip fills its container, so the 960 in the frame is the frame's
 * width. Its height stays at the drawn 48.
 */
const meta = {
  title: 'Components/Marquee',
  component: Marquee,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Release announcement',
    children: 'STEELBOOK V1.0',
  },
} satisfies Meta<typeof Marquee>

export default meta
type Story = StoryObj<typeof meta>

/** Tone=Inverse — white caps and orange pips on black. */
export const Inverse: Story = {}

/** Tone=Accent — black caps and black pips on orange. */
export const Accent: Story = {
  args: { tone: 'accent' },
}

/** Both tones stacked, which is how the variant set is drawn. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-gap-lg)' }}>
      <Marquee {...args} />
      <Marquee {...args} tone="accent" />
    </div>
  ),
}

/** Held still, as Figma draws it. */
export const Paused: Story = {
  args: { paused: true },
}

/** Running the other way — `side` points the strip, not a separate prop. */
export const Reversed: Story = {
  args: { side: 'end' },
}

/** Faster than the 50px/s default; the design names no speed. */
export const Fast: Story = {
  args: { speed: 140 },
}

/**
 * A longer phrase. Nothing wraps or shrinks — the strip is a ticker, so
 * it simply takes longer to come round.
 */
export const LongPhrase: Story = {
  args: { children: 'STEELBOOK V1.0 — BUILT FROM FIGMA, TOKEN BY TOKEN' },
}

/**
 * Narrow enough that one copy overruns the strip. `autoFill` stops
 * cloning past what fits and the loop still closes seamlessly.
 */
export const Narrow: Story = {
  render: (args) => (
    <div style={{ inlineSize: '320px' }}>
      <Marquee {...args} />
    </div>
  ),
}
