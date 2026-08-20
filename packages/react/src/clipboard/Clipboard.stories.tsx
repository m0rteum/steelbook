import type { Meta, StoryObj } from '@storybook/react-vite'
import { Clipboard } from './Clipboard'

/**
 * Figma: Steelbook Design System › Clipboard (node `26:107`).
 *
 * The Copied axis is Ark's own state — click the trigger and it flips
 * green with a check, then resets itself after `timeout`.
 */
const meta = {
  title: 'Components/Clipboard',
  component: Clipboard,
  decorators: [
    (Story) => (
      <div style={{ width: 214 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'API key', value: 'sb_live_4d00ff2b1d' },
} satisfies Meta<typeof Clipboard>

export default meta
type Story = StoryObj<typeof meta>

/** Copied=False. Click the trigger to reach the copied skin. */
export const Default: Story = {}

/**
 * The same control with a long reset window, so the green Copied=True
 * skin stays put after a click instead of flipping back.
 */
export const CopiedState: Story = {
  args: { timeout: 60_000 },
}
