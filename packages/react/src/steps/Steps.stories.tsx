import type { Meta, StoryObj } from '@storybook/react-vite'
import { Steps } from './Steps'

/**
 * Figma: Steelbook Design System › Steps (node `31:242`) and Step
 * (node `31:241`).
 *
 * State is the machine's — it derives Complete, Current and Upcoming
 * from the current step and the position. Each connector belongs to the
 * rung behind it and darkens once that rung is done.
 */
const meta = {
  title: 'Components/Steps',
  component: Steps,
  args: { steps: ['Cart', 'Shipping', 'Payment', 'Done'] },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn rail — one done, one current, two to go. */
export const Default: Story = {
  args: { defaultStep: 1 },
}

/** Nothing done yet: every rung outlined, every connector muted. */
export const FirstStep: Story = {
  args: { defaultStep: 0 },
}

/** All four done — the rail as it looks after the wizard finishes. */
export const Complete: Story = {
  args: { defaultStep: 4 },
}

/** Two rungs, the shortest rail that still draws a connector. */
export const TwoSteps: Story = {
  args: { steps: ['Details', 'Confirm'], defaultStep: 1 },
}
