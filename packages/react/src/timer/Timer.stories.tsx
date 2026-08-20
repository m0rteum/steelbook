import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timer } from './Timer'

/**
 * Figma: Steelbook Design System › Timer (node `40:508`).
 *
 * Both stories start on mount and tick once a second. The drawn reading
 * is 00:14:32:09 — 14 hours, 32 minutes and 9 seconds.
 */
const meta = {
  title: 'Components/Timer',
  component: Timer,
  args: { startMs: 52_329_000 },
} satisfies Meta<typeof Timer>

export default meta
type Story = StoryObj<typeof meta>

/** Tone=Default — black blocks, white digits. */
export const Default: Story = {}

/** Tone=Urgent — the blocks flood accent and the digits go dark. */
export const Urgent: Story = {
  args: { tone: 'urgent' },
}
