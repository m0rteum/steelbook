import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { Popover } from './Popover'

/**
 * Figma: Steelbook Design System › Popover (node `35:244`).
 *
 * Click the trigger to open; Escape or a click outside closes it, and so
 * does the glyph in the header. Non-modal — the page underneath stays
 * live. Focus lands on the first control inside, which is the close.
 */
const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  args: {
    trigger: <Button tone="secondary">Share</Button>,
    title: 'Share this view',
    body: 'Anyone with the link can inspect tokens and copy CSS. They cannot edit.',
    children: <Button size="sm">Copy link</Button>,
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn surface, opened by its trigger. */
export const Default: Story = {}

/** Held open, so the surface can be measured against the Figma frame. */
export const Open: Story = {
  args: { open: true },
}

/** Above the trigger instead of below — placement is Ark's, not drawn. */
export const Top: Story = {
  args: { open: true, positioning: { placement: 'top' } },
}

/** A one-line body: the surface hugs its height. */
export const ShortBody: Story = {
  args: { open: true, body: 'Read-only link.' },
}

/** A title longer than the row wraps and grows the header. */
export const LongTitle: Story = {
  args: { open: true, title: 'Share this view with your whole team' },
}

/** Two controls in the slot — the frame draws one, but it is a slot. */
export const TwoActions: Story = {
  args: {
    open: true,
    children: (
      <div style={{ display: 'flex', gap: 'var(--sb-gap-xs)' }}>
        <Button size="sm">Copy link</Button>
        <Button size="sm" tone="outline">
          Settings
        </Button>
      </div>
    ),
  },
}
