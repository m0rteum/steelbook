import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard } from './HoverCard'

/**
 * Figma: Steelbook Design System › Hover Card (node `33:4`).
 *
 * Hover or tab to the handle to raise the card; it stays up while the
 * pointer travels towards it, and Escape dismisses it. The trigger is
 * the caller's own element — here the link the card previews.
 */
const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  args: {
    name: 'Sasha Brik',
    handle: '@sbrik',
    initials: 'SB',
    bio: 'Welds design systems for a living. Ships in black, white, and one very loud orange.',
    stats: [
      { value: 214, label: 'shipped' },
      { value: 12, label: 'systems' },
    ],
    children: <a href="#sbrik">@sbrik</a>,
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn card, raised on hover. */
export const Default: Story = {}

/** Held open, so the card can be measured against the Figma frame. */
export const Open: Story = {
  args: { open: true },
}

/** No initials — Avatar falls back to its user glyph. */
export const GlyphAvatar: Story = {
  args: { open: true, initials: undefined },
}

/** A short bio collapses to one line; the card hugs its height. */
export const ShortBio: Story = {
  args: { open: true, bio: 'Ships in black, white and orange.' },
}

/** Three cells instead of two — the row is drawn, not fixed at two. */
export const ThreeStats: Story = {
  args: {
    open: true,
    stats: [
      { value: 214, label: 'shipped' },
      { value: 12, label: 'systems' },
      { value: 7, label: 'forks' },
    ],
  },
}
